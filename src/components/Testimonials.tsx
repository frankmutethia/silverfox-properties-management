import { useState } from "react";
import { MessageSquareQuote, Star, Plus, Check } from "lucide-react";
import { feedbackSchema as schema, readTestimonials, submitTestimonial } from "@/lib/testimonials";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function Testimonials() {
  const [open, setOpen] = useState(false);
  const [records, setRecords] = useState(readTestimonials);
  const published = records.filter((item) => item.status === "published");
  const [rating, setRating] = useState(0);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
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
              setOpen(next);
              setError("");
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
                Add your name, feedback and star rating for review. Submissions are saved in this
                browser only, not sent to a server. They appear publicly here only after admin
                approval in this browser.
              </DialogDescription>
              <form
                className="space-y-5"
                onSubmit={(event) => {
                  event.preventDefault();
                  const data = new FormData(event.currentTarget);
                  const result = schema.safeParse({
                    name: data.get("name"),
                    feedback: data.get("feedback"),
                    rating,
                  });
                  if (!result.success) {
                    setError(
                      "Enter your name and feedback, then select a rating from 1 to 5 stars.",
                    );
                    return;
                  }
                  try {
                    setRecords(submitTestimonial(result.data));
                    setOpen(false);
                    setNotice(
                      "Your testimonial is saved for admin review in this browser. It is not published or sent to a server.",
                    );
                  } catch {
                    setError(
                      "Unable to save in this browser. Your feedback is still here; please copy it before closing.",
                    );
                  }
                }}
              >
                <label className="block text-sm font-medium">
                  Your name *
                  <input
                    name="name"
                    required
                    maxLength={100}
                    autoComplete="name"

                    className="mt-2 h-11 w-full rounded-md border border-input bg-background px-3"
                  />
                </label>
                <fieldset>
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
                </fieldset>
                <label className="block text-sm font-medium">
                  Your feedback *
                  <textarea
                    name="feedback"
                    required
                    maxLength={2000}
                    rows={5}

                    placeholder="What stood out about your experience?"
                    className="mt-2 w-full rounded-md border border-input bg-background p-3"
                  />
                </label>
                {error && (
                  <p role="alert" className="text-sm text-destructive">
                    {error}
                  </p>
                )}
                <div className="flex justify-end gap-3">
                  <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    Submit for review <Check />
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
          <p role="status" className="mt-3 max-w-md text-xs leading-5 text-muted-foreground">
            {notice}
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-7 shadow-sm sm:p-10">
          <MessageSquareQuote className="mb-6 size-10 text-accent" aria-hidden="true" />
          {published.length ? (
            <div className="max-h-[560px] space-y-8 overflow-y-auto pr-2">
              {published.map((item) => (
                <article
                  key={item.id}
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
                    {item.feedback}
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
