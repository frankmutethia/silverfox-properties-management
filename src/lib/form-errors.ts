import { useId, useState } from "react";
import { toast } from "sonner";
import { splitErrors, toApiError } from "./api";

/**
 * Field-level error state for a form. `handle` maps the API's "field: message" errors onto
 * the form's own field names (via `aliases` for nested paths such as "price.amount") and
 * toasts anything that can't be placed next to a field.
 */
export function useFieldErrors(known: readonly string[], aliases: Record<string, string> = {}) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const baseId = useId();

  function fieldFor(path: string) {
    const first = path.split(".")[0] ?? path;
    return aliases[path] ?? aliases[first] ?? (known.includes(first) ? first : null);
  }

  function handle(error: unknown) {
    const apiError = toApiError(error);
    const { fields, general } = splitErrors(apiError);
    const next: Record<string, string> = {};
    const unplaced = [...general];
    for (const [path, message] of Object.entries(fields)) {
      const field = fieldFor(path);
      if (field) next[field] ??= message;
      else unplaced.push(`${path}: ${message}`);
    }
    setErrors(next);
    toast.error(
      unplaced[0] ??
        (Object.keys(next).length ? "Please correct the highlighted fields." : apiError.message),
    );
  }

  const messageId = (name: string) => `${baseId}-${name}-error`;

  /** aria attributes linking an input to its error message. */
  function describe(name: string) {
    return errors[name]
      ? { "aria-invalid": true as const, "aria-describedby": messageId(name) }
      : { "aria-invalid": undefined, "aria-describedby": undefined };
  }

  return { errors, setErrors, handle, describe, messageId, clear: () => setErrors({}) };
}

export type FieldErrors = ReturnType<typeof useFieldErrors>;
