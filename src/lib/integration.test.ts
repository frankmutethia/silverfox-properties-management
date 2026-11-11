import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getEnquiries, retryEnquiryEmail, submitEnquiry } from "./enquiries";
import { createService, getPublishedServices } from "./services";

const enquiry = {
  _id: "enquiry-1",
  name: "Client name",
  message: "Client enquiry",
  emailStatus: "pending" as const,
  createdAt: "2026-11-11T10:00:00.000Z",
  updatedAt: "2026-11-11T10:00:00.000Z",
};

function response(data: unknown, message = "Success") {
  return Promise.resolve(
    new Response(JSON.stringify({ success: true, message, data }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }),
  );
}

afterEach(() => vi.unstubAllGlobals());
beforeEach(() => vi.stubEnv("VITE_API_BASE_URL", "https://api.example.test/api/v1"));

describe("enquiry API integration", () => {
  it("submits the public payload and exposes the backend success message", async () => {
    const fetch = vi.fn<typeof globalThis.fetch>(() => response({ enquiry }, "Enquiry received"));
    vi.stubGlobal("fetch", fetch);

    await expect(
      submitEnquiry({ name: "Client name", message: "Client enquiry" }),
    ).resolves.toEqual({ enquiry, message: "Enquiry received" });
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("/enquiries"),
      expect.objectContaining({
        method: "POST",
        credentials: "include",
        body: JSON.stringify({ name: "Client name", message: "Client enquiry" }),
      }),
    );
  });

  it("loads one authenticated page newest first and replaces retry data from the API", async () => {
    const older = { ...enquiry, _id: "older", createdAt: "2026-11-10T10:00:00.000Z" };
    const sent = { ...enquiry, emailStatus: "sent" as const };
    const fetch = vi
      .fn<typeof globalThis.fetch>()
      .mockImplementationOnce(() =>
        response({
          enquiries: [older, enquiry],
          pagination: { page: 1, limit: 20, total: 2, totalPages: 1 },
        }),
      )
      .mockImplementationOnce(() => response({ enquiry: sent }));
    vi.stubGlobal("fetch", fetch);

    const page = await getEnquiries(1);
    expect(page.items.map((item) => item._id)).toEqual(["enquiry-1", "older"]);
    await expect(retryEnquiryEmail(enquiry._id)).resolves.toEqual(sent);
    expect(fetch.mock.calls[1]?.[0]).toEqual(
      expect.stringContaining("/enquiries/enquiry-1/retry-email"),
    );
  });
});

describe("service API integration", () => {
  it("uses the canonical public services collection, including an uncategorized service", async () => {
    const service = {
      _id: "service-1",
      title: "Consultation",
      description: "<p>Advice</p>",
      category: "",
      icon: null,
      image: null,
      sortOrder: 0,
      status: "published" as const,
      publishedAt: "2026-11-11T10:00:00.000Z",
      createdAt: "2026-11-11T10:00:00.000Z",
      updatedAt: "2026-11-11T10:00:00.000Z",
    };
    vi.stubGlobal(
      "fetch",
      vi.fn<typeof globalThis.fetch>(() => response({ services: [service], categories: [] })),
    );
    await expect(getPublishedServices()).resolves.toEqual([service]);
  });

  it("creates services with either an empty or custom category", async () => {
    const fetch = vi.fn<typeof globalThis.fetch>(() => response({ service: {} }));
    vi.stubGlobal("fetch", fetch);
    const base = { title: "Consultation", description: "<p>Advice</p>", icon: null, image: null };

    await createService({ ...base, category: "" });
    await createService({ ...base, category: "Bespoke advisory" });

    expect(fetch.mock.calls.map((call) => JSON.parse(String(call[1]?.body)).category)).toEqual([
      "",
      "Bespoke advisory",
    ]);
  });
});
