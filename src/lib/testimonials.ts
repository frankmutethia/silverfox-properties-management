import { api, getPage, request, type Query } from "./api";
import type {
  ApiTestimonial,
  PublicationStatus,
  PublicTestimonial,
  TestimonialInput,
  TestimonialStatus,
} from "./types";

// Limits enforced by the API.
export const TESTIMONIAL_LIMITS = {
  name: { min: 2, max: 100 },
  comment: { min: 10, max: 2000 },
} as const;

/** Returns field → message problems for a testimonial, matching the API rules. */
export function testimonialProblems({ name, comment, rating }: TestimonialInput) {
  const problems: Record<string, string> = {};
  const { name: n, comment: c } = TESTIMONIAL_LIMITS;
  if (name.trim().length < n.min || name.trim().length > n.max)
    problems["name"] = `Enter a name of ${n.min}–${n.max} characters.`;
  if (comment.trim().length < c.min || comment.trim().length > c.max)
    problems["comment"] = `Write between ${c.min} and ${c.max} characters.`;
  if (!Number.isInteger(rating) || rating < 1 || rating > 5)
    problems["rating"] = "Select a rating from 1 to 5 stars.";
  return problems;
}

export const testimonialStatusLabels: Record<TestimonialStatus, string> = {
  pending: "Pending review",
  draft: "Draft",
  published: "Published",
};

// ---------- Public ----------

export const listPublishedTestimonials = (query: Query, signal?: AbortSignal) =>
  getPage<PublicTestimonial>("/testimonials", "testimonials", query, signal);

/** Submits visitor feedback for review and returns the API's thank-you message. */
export const submitTestimonial = (input: TestimonialInput & { website: string }) =>
  request<object>("POST", "/testimonials/submit", { body: input }).then((result) => result.message);

// ---------- Staff ----------

export const listAdminTestimonials = (query: Query, signal?: AbortSignal) =>
  getPage<ApiTestimonial>("/testimonials/admin/all", "testimonials", query, signal);

export const createTestimonial = (input: TestimonialInput & { status: PublicationStatus }) =>
  api
    .post<{ testimonial: ApiTestimonial }>("/testimonials", input)
    .then((data) => data.testimonial);

export const updateTestimonial = (id: string, input: Partial<TestimonialInput>) =>
  api
    .patch<{ testimonial: ApiTestimonial }>(`/testimonials/${id}`, input)
    .then((data) => data.testimonial);

export const toggleTestimonialPublish = (id: string) =>
  api
    .patch<{ testimonial: ApiTestimonial }>(`/testimonials/${id}/publish`)
    .then((data) => data.testimonial);

export const deleteTestimonial = (id: string) => api.del<object>(`/testimonials/${id}`);
