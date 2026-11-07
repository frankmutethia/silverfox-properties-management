import { api, getAllPages, getPage, type Query } from "./api";
import type { ApiProperty, PropertyInput } from "./types";

export const propertyCategories = {
  sale: "For sale",
  rent: "For rent",
  managed: "Managed property",
} as const;

export function propertyPrice(property: Pick<ApiProperty, "category" | "price">) {
  if (property.category === "managed") return "Managed by Silverfox";
  if (!property.price) return "Price on enquiry";
  const { amount, currency, period } = property.price;
  return `${currency} ${new Intl.NumberFormat("en-KE").format(amount)}${period ? ` / ${period}` : ""}`;
}

// ---------- Public ----------

/** Every published property (one request per 100), newest first. */
export const listAllPublishedProperties = (signal?: AbortSignal) =>
  getAllPages<ApiProperty>("/properties", "properties", {}, signal);

export const getPropertyBySlug = (slug: string, signal?: AbortSignal) =>
  api
    .get<{ property: ApiProperty }>(`/properties/slug/${encodeURIComponent(slug)}`, {}, signal)
    .then((data) => data.property);

// ---------- Staff ----------

export const listAdminProperties = (query: Query, signal?: AbortSignal) =>
  getPage<ApiProperty>("/properties/admin/all", "properties", query, signal);

export const createProperty = (input: PropertyInput) =>
  api.post<{ property: ApiProperty }>("/properties", input).then((data) => data.property);

export const updateProperty = (id: string, input: Partial<PropertyInput>) =>
  api.patch<{ property: ApiProperty }>(`/properties/${id}`, input).then((data) => data.property);

export const togglePropertyPublish = (id: string) =>
  api.patch<{ property: ApiProperty }>(`/properties/${id}/publish`).then((data) => data.property);

export const deleteProperty = (id: string) => api.del<object>(`/properties/${id}`);
