import { z } from "zod";

export const feedbackSchema = z.object({
  name: z.string().trim().min(1).max(100),
  feedback: z.string().trim().min(1).max(2000),
  rating: z.number().int().min(1).max(5),
});
const schema = feedbackSchema.extend({
  id: z.string().min(1),
  status: z.enum(["pending", "draft", "published"]),
  source: z.enum(["visitor", "admin", "legacy"]),
  created: z.string(),
  updated: z.string(),
});
export type Testimonial = z.infer<typeof schema>;
const key = "silverfox-testimonials";
export function readTestimonials(): Testimonial[] {
  try {
    const data: unknown = JSON.parse(localStorage.getItem(key) ?? "[]");
    const records = Array.isArray(data)
      ? data.flatMap((item) => {
          const parsed = schema.safeParse(item);
          return parsed.success ? [parsed.data] : [];
        })
      : [];
    const legacy = feedbackSchema.safeParse(
      JSON.parse(localStorage.getItem("silverfox-testimonial-preview") ?? "null"),
    );
    if (legacy.success && !records.some((item) => item.id === "legacy-preview"))
      records.push({
        ...legacy.data,
        id: "legacy-preview",
        source: "legacy",
        status: "pending",
        created: "",
        updated: "",
      });
    return records;
  } catch {
    return [];
  }
}
export function saveTestimonial(record: Testimonial) {
  const validated = schema.parse(record);
  const next = [validated, ...readTestimonials().filter((item) => item.id !== validated.id)];
  localStorage.setItem(key, JSON.stringify(next));
  return next;
}
export function submitTestimonial(feedback: z.infer<typeof feedbackSchema>) {
  const now = new Date().toISOString();
  return saveTestimonial({
    ...feedbackSchema.parse(feedback),
    id: crypto.randomUUID(),
    source: "visitor",
    status: "pending",
    created: now,
    updated: now,
  });
}
