import { useState, type FormEvent } from "react";
import { Plus, Star, MessageSquareQuote, ArrowUpRight } from "lucide-react";
import {
  feedbackSchema,
  readTestimonials,
  saveTestimonial,
  type Testimonial,
} from "@/lib/testimonials";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";

const labels = { pending: "Pending review", draft: "Draft", published: "Published" };
export default function AdminTestimonials() {
  const [records, setRecords] = useState(readTestimonials);
  const [filter, setFilter] = useState("all");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  function edit(item: Testimonial | null) {
    setEditing(item);
    setError("");
    setOpen(true);
  }
  function changeStatus(item: Testimonial, status: Testimonial["status"]) {
    try {
      setRecords(saveTestimonial({ ...item, status, updated: new Date().toISOString() }));
      setNotice(
        status === "published"
          ? "Testimonial published on this browser’s landing page."
          : "Testimonial moved to drafts and hidden from the landing page.",
      );
    } catch {
      setNotice("Unable to save the change. Browser storage may be unavailable or full.");
    }
  }
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const parsed = feedbackSchema.safeParse({
      name: data.get("name"),
      feedback: data.get("feedback"),
      rating: Number(data.get("rating")),
    });
    if (!parsed.success) {
      setError("Enter a client name, feedback and a rating between 1 and 5.");
      return;
    }
    const submitter = (event.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null;
    const status = submitter?.value === "published" ? "published" : "draft";
    const now = new Date().toISOString();
    try {
      setRecords(
        saveTestimonial({
          ...parsed.data,
          id: editing?.id ?? crypto.randomUUID(),
          source: editing?.source ?? "admin",
          status,
          created: editing?.created ?? now,
          updated: now,
        }),
      );
      setOpen(false);
      setNotice(
        status === "published"
          ? "Testimonial published on this browser’s landing page."
          : "Testimonial saved as a draft.",
      );
    } catch {
      setError(
        "Unable to save. Your work is still here; browser storage may be full or unavailable.",
      );
    }
  }
  const visible = records.filter((item) => filter === "all" || item.status === filter);
  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="admin-eyebrow">Client voices</p>
          <h1 className="admin-title">Testimonials</h1>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button asChild variant="outline">
            <a href="/#testimonials">
              View on website <ArrowUpRight />
            </a>
          </Button>
          <Button onClick={() => edit(null)}>
            <Plus />
            Create testimonial
          </Button>
        </div>
      </div>
      <p className="mb-7 mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
        Review submitted feedback before publishing. Submissions and publication are stored in this
        browser only; they are not shared across devices or sent to a server.
      </p>
      <div className="mb-6 flex flex-wrap gap-2" aria-label="Filter testimonials">
        {["all", "pending", "draft", "published"].map((status) => (
          <Button
            key={status}
            variant={filter === status ? "default" : "outline"}
            aria-pressed={filter === status}
            onClick={() => setFilter(status)}
          >
            {status === "all" ? "All" : labels[status as keyof typeof labels]} (
            {records.filter((item) => status === "all" || item.status === status).length})
          </Button>
        ))}
      </div>
      <p role="status" className="mb-4 text-sm">
        {notice}
      </p>
      {visible.length ? (
        <div className="grid gap-5 md:grid-cols-2">
          {visible.map((item) => (
            <article key={item.id} className="admin-panel flex flex-col p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-primary">
                  {labels[item.status]}
                </span>
                <span className="text-xs text-muted-foreground">
                  {item.source === "admin"
                    ? "Created by admin"
                    : item.source === "legacy"
                      ? "Previous visitor preview"
                      : "Visitor submission"}
                </span>
              </div>
              <h2 className="mt-5 break-words text-lg font-semibold">{item.name}</h2>
              <div className="my-3 flex gap-1" aria-label={`${item.rating} out of 5 stars`}>
                {[1, 2, 3, 4, 5].map((value) => (
                  <Star
                    key={value}
                    aria-hidden="true"
                    className={`size-4 ${value <= item.rating ? "fill-amber-500 text-amber-500" : "text-muted-foreground"}`}
                  />
                ))}
              </div>
              <blockquote className="flex-1 whitespace-pre-line break-words text-sm leading-7">
                {item.feedback}
              </blockquote>
              <div className="mt-6 flex flex-wrap gap-3 border-t border-border pt-4">
                <Button variant="outline" onClick={() => edit(item)}>
                  Review / edit
                </Button>
                {item.status !== "published" ? (
                  <Button onClick={() => changeStatus(item, "published")}>Publish</Button>
                ) : (
                  <Button variant="outline" onClick={() => changeStatus(item, "draft")}>
                    Unpublish
                  </Button>
                )}
                {item.status === "pending" && (
                  <Button variant="ghost" onClick={() => changeStatus(item, "draft")}>
                    Keep as draft
                  </Button>
                )}
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="admin-panel py-16 text-center">
          <MessageSquareQuote className="mx-auto mb-4 size-9 text-accent" />
          <h2 className="text-xl font-semibold">
            No{" "}
            {filter === "all"
              ? "testimonials"
              : labels[filter as keyof typeof labels].toLowerCase() + " testimonials"}{" "}
            yet
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">
            New visitor submissions appear here for review.
          </p>
        </div>
      )}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90dvh] max-w-[calc(100%-2rem)] overflow-y-auto sm:max-w-xl">
          <DialogTitle>{editing ? "Review testimonial" : "Create testimonial"}</DialogTitle>
          <DialogDescription>
            Enter genuine client feedback. Save it as a draft or publish it to the landing page in
            this browser.
          </DialogDescription>
          <form onSubmit={submit} className="space-y-5">
            <label className="block text-sm font-medium">
              Client name *
              <input
                name="name"
                required
                maxLength={100}
                defaultValue={editing?.name ?? ""}
                className="admin-input mt-2"
              />
            </label>
            <label className="block text-sm font-medium">
              Star rating *
              <select
                name="rating"
                required
                defaultValue={editing?.rating ?? ""}
                className="admin-input mt-2"
              >
                <option value="" disabled>
                  Select a rating
                </option>
                {[1, 2, 3, 4, 5].map((value) => (
                  <option key={value} value={value}>
                    {value} {value === 1 ? "star" : "stars"}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm font-medium">
              Client feedback *
              <textarea
                name="feedback"
                required
                maxLength={2000}
                rows={6}
                defaultValue={editing?.feedback ?? ""}
                className="admin-input mt-2"
              />
            </label>
            {error && (
              <p role="alert" className="text-sm text-destructive">
                {error}
              </p>
            )}
            <div className="flex flex-wrap justify-end gap-3 border-t border-border pt-4">
              <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" value="draft" variant="outline">
                Save draft
              </Button>
              <Button type="submit" value="published">
                Publish testimonial
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
