import { api, getPage, request } from "./api";
import type { ApiEnquiry, EnquiryInput, Paginated } from "./types";

export async function submitEnquiry(input: EnquiryInput) {
  const result = await request<{ enquiry: ApiEnquiry }>("POST", "/enquiries", { body: input });
  return { enquiry: result.data.enquiry, message: result.message };
}

export const getEnquiries = (page: number, signal?: AbortSignal): Promise<Paginated<ApiEnquiry>> =>
  getPage<ApiEnquiry>("/enquiries", "enquiries", { page, limit: 20 }, signal).then((result) => ({
    ...result,
    items: [...result.items].sort(
      (left, right) => Date.parse(right.createdAt) - Date.parse(left.createdAt),
    ),
  }));

export const retryEnquiryEmail = (id: string) =>
  api
    .post<{ enquiry: ApiEnquiry }>(`/enquiries/${id}/retry-email`, {})
    .then((data) => data.enquiry);
