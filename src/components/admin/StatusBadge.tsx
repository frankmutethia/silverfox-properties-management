import type { TestimonialStatus } from "@/lib/types";
import { testimonialStatusLabels } from "@/lib/testimonials";

const styles: Record<TestimonialStatus, string> = {
  published: "bg-emerald-600/12 text-emerald-700 dark:text-emerald-300",
  draft: "bg-secondary text-muted-foreground",
  pending: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
};

export default function StatusBadge({
  status,
  label,
}: {
  status: TestimonialStatus;
  /** Overrides the default wording, e.g. "Active". */
  label?: string;
}) {
  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full px-3 py-1 text-[11px] font-semibold ${styles[status]}`}
    >
      {label ?? testimonialStatusLabels[status]}
    </span>
  );
}

/** All / Draft / Published (and optionally Pending) filter buttons. */
export function StatusFilter<T extends string>({
  value,
  options,
  onChange,
  label,
}: {
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
  label: string;
}) {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label={label}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={value === option.value}
          onClick={() => onChange(option.value)}
          className={`min-h-9 rounded-md border px-3 text-sm font-medium transition-colors ${value === option.value ? "border-primary bg-primary text-primary-foreground" : "border-input bg-background hover:bg-secondary"}`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
