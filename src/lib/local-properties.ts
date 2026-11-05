import { z } from "zod";
import type { Property } from "@/data/properties";

const number = z.number().finite().nonnegative().nullable();
const schema = z.object({
  category: z.enum(["sale", "rent", "managed"]).nullable().default(null),
  neighbourhood: z.string().nullable().default(null),
  slug: z.string().min(1),
  reference: z.string().min(1),
  name: z.string().min(1),
  type: z.enum(["Apartment", "House"]),
  location: z.string().nullable(),
  price: z
    .object({ amount: z.number().finite().nonnegative(), currency: z.string(), period: z.string() })
    .nullable(),
  areaSqm: number,
  bedrooms: z.number().int().nonnegative().nullable(),
  bathrooms: z.number().int().nonnegative().nullable(),
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
  const validated = schema.parse(property);
  if (!validated.category || !validated.location?.trim())
    throw new Error("Category and location are required");
  if (validated.category === "managed") validated.price = null;
  if (validated.category === "sale" && validated.price) validated.price.period = "";
  if (
    validated.category === "rent" &&
    validated.price &&
    !["month", "year"].includes(validated.price.period)
  )
    throw new Error("Choose a rental period");
  const next = [...readLocalProperties(), validated as Property];
  localStorage.setItem(key, JSON.stringify(next));
  return next;
}
