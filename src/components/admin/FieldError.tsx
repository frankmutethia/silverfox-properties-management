import type { FieldErrors } from "@/lib/form-errors";

/** The error message for one field, linked to its input through `form.describe(name)`. */
export default function FieldError({ form, name }: { form: FieldErrors; name: string }) {
  const message = form.errors[name];
  if (!message) return null;
  return (
    <span id={form.messageId(name)} className="mt-1.5 block text-xs font-normal text-destructive">
      {message}
    </span>
  );
}
