import { z } from "zod";
import type { Property } from "@/data/properties";

const number = z.number().finite().nonnegative().nullable();
const schema = z.object({
  slug: z.string().min(1),
  reference: z.string().min(1),
  name: z.string().min(1),
  type: z.enum(["Apartment", "House"]),
  location: z.string().nullable(),
  price: z
    .object({ amount: z.number().finite().nonnegative(), currency: z.string(), period: z.string() })
    .nullable(),
  areaSqm: number,
  bedrooms: number,
  bathrooms: number,
  amenities: z.array(z.string()),
  description: z.string(),
  images: z
    .array(
      z.object({ src: z.string().regex(/^data:image\/(jpeg|png|webp);base64,/), alt: z.string() }),
    )
    .min(1),
});
const key = "silverfox-local-properties";
export function readLocalProperties(): Property[] {
  try {
    const result = z.array(schema).safeParse(JSON.parse(localStorage.getItem(key) ?? "[]"));
    return result.success ? (result.data as Property[]) : [];
  } catch {
    return [];
  }
}
export function saveLocalProperty(property: Property) {
  const next = [...readLocalProperties(), property];
  localStorage.setItem(key, JSON.stringify(next));
  return next;
}
