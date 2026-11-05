import { z } from "zod";

const schema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.union([z.literal(""), z.string().email()]),
  phone: z.string().max(30),
  photo: z
    .string()
    .max(850000)
    .regex(/^data:image\/(jpeg|png|webp);base64,/)
    .nullable(),
});
export type StaffProfile = z.infer<typeof schema>;
export const defaultProfile: StaffProfile = {
  name: "Administrator",
  email: "",
  phone: "",
  photo: null,
};
const key = "silverfox-staff-profile";
export function readProfile(): StaffProfile {
  try {
    const result = schema.safeParse(JSON.parse(localStorage.getItem(key) ?? "null"));
    return result.success ? result.data : defaultProfile;
  } catch {
    return defaultProfile;
  }
}
export function saveProfile(profile: StaffProfile) {
  const validated = schema.parse(profile);
  localStorage.setItem(key, JSON.stringify(validated));
  return validated;
}
