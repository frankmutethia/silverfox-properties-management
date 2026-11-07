import { useId, useState, type FormEvent } from "react";
import { MessageSquareQuote, Star, Plus, Check } from "lucide-react";
import {
  listPublishedTestimonials,
  submitTestimonial,
  testimonialProblems,
  TESTIMONIAL_LIMITS,
} from "@/lib/testimonials";
import { toApiError, splitErrors } from "@/lib/api";
import { useQuery } from "@/lib/use-query";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LineSkeletons, LoadError } from "./QueryState";

export default function Testimonials() {
  const result = useQuery((signal) => listPublishedTestimonials({ limit: 12 }, signal), []);
  const published = result.data?.items ?? [];
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const [notice, setNotice] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const id = useId();
  const describe = (name: string) =>
    errors[name]
      ? { "aria-invalid": true as const, "aria-describedby": `${id}-${name}` }
      : { "aria-invalid": undefined, "aria-describedby": undefined };
  const message = (name: string) =>
    errors[name] ? (
      <span id={`${id}-${name}`} className="mt-1.5 block text-xs font-normal text-destructive">
        {errors[name]}
      </span>
    ) : null;

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const input = {
      name: String(data.get("name") ?? "").trim(),
      comment: String(data.get("comment") ?? "").trim(),
      rating,
      website: String(data.get("website") ?? ""),
    };
    const problems = testimonialProblems(input);
    setErrors(problems);
    setFormError("");
    if (Object.keys(problems).length) return;
    setSubmitting(true);
    try {
      setNotice(await submitTestimonial(input));
      setOpen(false);
    } catch (error) {
      const apiError = toApiError(error);
      const { fields } = splitErrors(apiError);
      setErrors(fields);
      setFormError(Object.keys(fields).length ? "" : apiError.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section id="testimonials" className="border-y border-border bg-secondary/60 py-16 lg:py-20">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 lg:grid-cols-[1fr_1.1fr] lg:px-8">
        <div>
          <p className="mb-4 text-xs font-bold uppercase tracking-[.18em] text-accent">
            Client experiences
          </p>
          <h2 className="max-w-lg text-4xl font-bold tracking-tight text-primary sm:text-5xl">
            Your experience matters.
          </h2>
          <p className="mt-5 max-w-md text-base leading-7 text-muted-foreground">
            Tell us about your experience with Silverfox. Your perspective helps shape better
            property care.
          </p>
          <Dialog
            open={open}
            onOpenChange={(next) => {
              if (submitting) return;
              setOpen(next);
              setErrors({});
              setFormError("");
              if (next) setRating(0);
            }}
          >
            <DialogTrigger asChild>
              <Button size="lg" className="mt-7">
                <Plus />
                Share Testimonial
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90dvh] max-w-[calc(100%-2rem)] overflow-y-auto sm:max-w-xl">
              <DialogTitle>Share your experience</DialogTitle>
              <DialogDescription>
                Add your name, feedback and star rating. Our team reviews every testimonial before
                it appears on the website.
              </DialogDescription>
              <form className="relative space-y-5" noValidate onSubmit={submit}>
                <label className="block text-sm font-medium">
                  Your name *
                  <input
                    name="name"
                    required
                    minLength={TESTIMONIAL_LIMITS.name.min}
                    maxLength={TESTIMONIAL_LIMITS.name.max}
                    autoComplete="name"
                    {...describe("name")}
                    className="mt-2 h-11 w-full rounded-md border border-input bg-background px-3 aria-invalid:border-destructive"
                  />
                  {message("name")}
                </label>
                {/* Honeypot: hidden from people and assistive technology; bots fill it in. */}
                <div
                  aria-hidden="true"
                  className="absolute -left-[9999px] h-px w-px overflow-hidden"
                >
                  <label>
                    Website
                    <input name="website" type="text" tabIndex={-1} autoComplete="off" />
                  </label>
                </div>
                <fieldset {...describe("rating")}>
                  <legend className="mb-2 text-sm font-medium">Your rating *</legend>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <label key={value} className="cursor-pointer">
                        <input
                          type="radio"
                          name="rating"
                          value={value}
                          checked={rating === value}
                          onChange={() => setRating(value)}
                          className="peer sr-only"
                          aria-label={`${value} ${value === 1 ? "star" : "stars"}`}
                        />
                        <span className="flex size-11 items-center justify-center rounded-md border border-border bg-background peer-focus-visible:ring-2 peer-focus-visible:ring-ring">
                          <Star
                            aria-hidden="true"
                            className={`size-6 ${value <= rating ? "fill-amber-500 text-amber-500" : "text-muted-foreground"}`}
                          />
                        </span>
                      </label>
                    ))}
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground" aria-live="polite">
                    {rating ? `${rating} out of 5 stars` : "Select a star rating"}
                  </p>
                  {message("rating")}
                </fieldset>
                <label className="block text-sm font-medium">
                  Your feedback *
                  <textarea
                    name="comment"
                    required
                    minLength={TESTIMONIAL_LIMITS.comment.min}
                    maxLength={TESTIMONIAL_LIMITS.comment.max}
                    rows={5}
                    {...describe("comment")}
                    placeholder="What stood out about your experience?"
                    className="mt-2 w-full rounded-md border border-input bg-background p-3 aria-invalid:border-destructive"
                  />
                  <span className="mt-1 block text-xs font-normal text-muted-foreground">
                    {TESTIMONIAL_LIMITS.comment.min}–{TESTIMONIAL_LIMITS.comment.max} characters.
                  </span>
                  {message("comment")}
                </label>
                {formError && (
                  <p role="alert" className="text-sm text-destructive">
                    {formError}
                  </p>
                )}
                <div className="flex justify-end gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={submitting}
                    onClick={() => setOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={submitting}>
                    {submitting ? "Submitting…" : "Submit for review"} <Check />
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
          <p role="status" className="mt-3 max-w-md text-sm leading-6 text-primary">
            {notice}
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-7 shadow-sm sm:p-10">
          <MessageSquareQuote className="mb-6 size-10 text-accent" aria-hidden="true" />
          {!result.data && result.loading ? (
            <LineSkeletons lines={5} />
          ) : !result.data && result.error ? (
            <LoadError error={result.error} onRetry={result.reload} className="py-4" />
          ) : published.length ? (
            <div className="max-h-[560px] space-y-8 overflow-y-auto pr-2">
              {published.map((item) => (
                <article
                  key={item._id}
                  className="border-b border-border pb-6 last:border-0 last:pb-0"
                >
                  <div className="mb-4 flex gap-1" aria-label={`${item.rating} out of 5 stars`}>
                    {[1, 2, 3, 4, 5].map((value) => (
                      <Star
                        key={value}
                        aria-hidden="true"
                        className={`size-5 ${value <= item.rating ? "fill-amber-500 text-amber-500" : "text-muted-foreground"}`}
                      />
                    ))}
                  </div>
                  <blockquote className="whitespace-pre-line break-words text-lg leading-8 text-primary">
                    {item.comment}
                  </blockquote>
                  <p className="mt-5 break-words font-semibold">{item.name}</p>
                </article>
              ))}
            </div>
          ) : (
            <>
              <h3 className="text-2xl font-semibold text-primary">Every story starts with you.</h3>
              <p className="mt-4 text-sm leading-7 text-muted-foreground">
                Client testimonials will appear here once they are available. If you have worked
                with our team, share what made a difference to you.
              </p>
              <p className="mt-6 border-t border-border pt-5 text-xs leading-6 text-muted-foreground">
                No published testimonials yet. Feedback is reviewed before it appears here.
              </p>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
