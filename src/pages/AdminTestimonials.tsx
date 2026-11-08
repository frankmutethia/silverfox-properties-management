import { useState, type FormEvent } from "react";
import { Plus, Star, MessageSquareQuote, ArrowUpRight, Pencil, Trash2 } from "lucide-react";
import { notifyCreated, notifyDeleted, notifyStatusChanged, notifyUpdated } from "@/lib/notify";
import {
  createTestimonial,
  deleteTestimonial,
  listAdminTestimonials,
  testimonialProblems,
  TESTIMONIAL_LIMITS,
  toggleTestimonialPublish,
  updateTestimonial,
} from "@/lib/testimonials";
import { getDashboard } from "@/lib/auth";
import type { ApiTestimonial, PublicationStatus, TestimonialStatus } from "@/lib/types";
import { useFieldErrors } from "@/lib/form-errors";
import { reportError, useQuery } from "@/lib/use-query";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import FieldError from "@/components/admin/FieldError";
import Pager from "@/components/admin/Pager";
import StatusBadge, { StatusFilter } from "@/components/admin/StatusBadge";
import { LineSkeletons, LoadError } from "@/components/QueryState";

type Filter = "all" | TestimonialStatus;

export default function AdminTestimonials() {
  const [filter, setFilter] = useState<Filter>("pending");
  const [page, setPage] = useState(1);
  const result = useQuery(
    (signal) =>
      listAdminTestimonials(
        { status: filter === "all" ? undefined : filter, page, limit: 20 },
        signal,
      ),
    [filter, page],
  );
  // Status counts for the filter buttons.
  const counts = useQuery((signal) => getDashboard(signal).then((d) => d.testimonials), []);
  const [editing, setEditing] = useState<ApiTestimonial | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [deleting, setDeleting] = useState<ApiTestimonial | null>(null);
  const [working, setWorking] = useState<string | null>(null);
  const items = result.data?.items ?? [];

  function refresh() {
    result.reload();
    counts.reload();
  }

  async function toggle(item: ApiTestimonial) {
    setWorking(item._id);
    try {
      const saved = await toggleTestimonialPublish(item._id);
      notifyStatusChanged({
        kind: "Testimonial",
        name: saved.name,
        status: saved.status,
        href: "/#testimonials",
      });
      refresh();
    } catch (error) {
      reportError(error);
    } finally {
      setWorking(null);
    }
  }

  const total = counts.data
    ? counts.data.pending + counts.data.draft + counts.data.published
    : undefined;
  const label = (text: string, count: number | undefined) =>
    count === undefined ? text : `${text} (${count})`;

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
          <Button
            onClick={() => {
              setEditing(null);
              setFormOpen(true);
            }}
          >
            <Plus />
            Create testimonial
          </Button>
        </div>
      </div>
      <p className="mb-7 mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
        Visitor feedback arrives as pending review. Publish it to show it on the website, or delete
        it to reject it.
      </p>
      <div className="mb-6">
        <StatusFilter
          label="Filter testimonials"
          value={filter}
          onChange={(value) => {
            setFilter(value);
            setPage(1);
          }}
          options={[
            { value: "pending", label: label("Pending review", counts.data?.pending) },
            { value: "published", label: label("Published", counts.data?.published) },
            { value: "draft", label: label("Drafts", counts.data?.draft) },
            { value: "all", label: label("All", total) },
          ]}
        />
      </div>
      {!result.data && result.loading ? (
        <div className="grid gap-5 md:grid-cols-2">
          <LineSkeletons lines={6} className="admin-panel p-6" />
          <LineSkeletons lines={6} className="admin-panel p-6" />
        </div>
      ) : !result.data && result.error ? (
        <LoadError error={result.error} onRetry={result.reload} className="admin-panel" />
      ) : items.length ? (
        <div className="grid gap-5 md:grid-cols-2" aria-busy={result.loading}>
          {items.map((item) => (
            <article key={item._id} className="admin-panel flex flex-col p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <StatusBadge status={item.status} />
                <span className="text-xs text-muted-foreground">
                  {item.source === "admin" ? "Added by staff" : "Visitor submission"} ·{" "}
                  {new Date(item.createdAt).toLocaleDateString("en-GB")}
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
                {item.comment}
              </blockquote>
              <div className="mt-6 flex flex-wrap gap-2 border-t border-border pt-4">
                <Button
                  size="sm"
                  variant={item.status === "published" ? "outline" : "default"}
                  disabled={working === item._id}
                  onClick={() => void toggle(item)}
                >
                  {item.status === "published" ? "Unpublish" : "Publish"}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setEditing(item);
                    setFormOpen(true);
                  }}
                >
                  <Pencil />
                  {item.status === "pending" ? "Review / edit" : "Edit"}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-destructive"
                  onClick={() => setDeleting(item)}
                >
                  <Trash2 />
                  {item.status === "pending" ? "Reject" : "Delete"}
                </Button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="admin-panel py-16 text-center">
          <MessageSquareQuote className="mx-auto mb-4 size-9 text-accent" />
          <h2 className="text-xl font-semibold">
            {filter === "pending" ? "Nothing waiting for review" : "No testimonials here yet"}
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">
            New visitor submissions appear under Pending review.
          </p>
        </div>
      )}
      <Pager pagination={result.data?.pagination} onPage={setPage} disabled={result.loading} />
      <TestimonialForm
        testimonial={editing}
        open={formOpen}
        onOpenChange={setFormOpen}
        onSaved={refresh}
      />
      <ConfirmDialog
        open={deleting !== null}
        onOpenChange={(open) => !open && setDeleting(null)}
        title={
          deleting?.status === "pending"
            ? `Reject ${deleting.name}’s testimonial?`
            : `Delete ${deleting?.name ?? "this"} testimonial?`
        }
        description="The testimonial is permanently deleted and cannot be restored."
        confirmLabel={deleting?.status === "pending" ? "Reject" : "Delete"}
        onConfirm={async () => {
          if (!deleting) return;
          await deleteTestimonial(deleting._id);
          notifyDeleted("Testimonial", deleting.name);
          if (items.length === 1 && page > 1) setPage(page - 1);
          else refresh();
        }}
      />
    </>
  );
}

function TestimonialForm({
  testimonial,
  open,
  onOpenChange,
  onSaved,
}: {
  testimonial: ApiTestimonial | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved: () => void;
}) {
  const form = useFieldErrors(["name", "comment", "rating"]);
  const [busy, setBusy] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const input = {
      name: String(data.get("name") ?? "").trim(),
      comment: String(data.get("comment") ?? "").trim(),
      rating: Number(data.get("rating")),
    };
    const problems = testimonialProblems(input);
    form.setErrors(problems);
    if (Object.keys(problems).length) return;
    const status = ((event.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null)
      ?.value as PublicationStatus | undefined;
    setBusy(true);
    try {
      const saved = testimonial
        ? await updateTestimonial(testimonial._id, input)
        : await createTestimonial({ ...input, status: status ?? "draft" });
      const item = {
        kind: "Testimonial" as const,
        name: saved.name,
        status: saved.status,
        href: "/#testimonials",
      };
      if (testimonial) notifyUpdated(item);
      else notifyCreated(item);
      onSaved();
      onOpenChange(false);
    } catch (error) {
      form.handle(error);
    } finally {
      setBusy(false);
    }
  }
  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (busy) return;
        form.clear();
        onOpenChange(next);
      }}
    >
      <DialogContent className="max-h-[90dvh] max-w-[calc(100%-2rem)] overflow-y-auto sm:max-w-xl">
        <DialogTitle>{testimonial ? "Review testimonial" : "Create testimonial"}</DialogTitle>
        <DialogDescription>
          {testimonial
            ? "Correct typing errors if needed. Use Publish on the card to show it on the website."
            : "Enter genuine client feedback. Save it as a draft or publish it straight away."}
        </DialogDescription>
        <form key={testimonial?._id ?? "new"} onSubmit={submit} className="space-y-5" noValidate>
          <label className="block text-sm font-medium">
            Client name *
            <input
              name="name"
              required
              minLength={TESTIMONIAL_LIMITS.name.min}
              maxLength={TESTIMONIAL_LIMITS.name.max}
              defaultValue={testimonial?.name ?? ""}
              className="admin-input mt-2"
              {...form.describe("name")}
            />
            <FieldError form={form} name="name" />
          </label>
          <label className="block text-sm font-medium">
            Star rating *
            <select
              name="rating"
              required
              defaultValue={testimonial?.rating ?? ""}
              className="admin-input mt-2"
              {...form.describe("rating")}
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
            <FieldError form={form} name="rating" />
          </label>
          <label className="block text-sm font-medium">
            Client feedback *
            <textarea
              name="comment"
              required
              minLength={TESTIMONIAL_LIMITS.comment.min}
              maxLength={TESTIMONIAL_LIMITS.comment.max}
              rows={6}
              defaultValue={testimonial?.comment ?? ""}
              className="admin-input mt-2"
              {...form.describe("comment")}
            />
            <FieldError form={form} name="comment" />
          </label>
          <div className="flex flex-wrap justify-end gap-3 border-t border-border pt-4">
            <Button
              type="button"
              variant="ghost"
              disabled={busy}
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            {testimonial ? (
              <Button type="submit" disabled={busy}>
                {busy ? "Saving…" : "Save changes"}
              </Button>
            ) : (
              <>
                <Button type="submit" value="draft" variant="outline" disabled={busy}>
                  Save draft
                </Button>
                <Button type="submit" value="published" disabled={busy}>
                  Publish testimonial
                </Button>
              </>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
