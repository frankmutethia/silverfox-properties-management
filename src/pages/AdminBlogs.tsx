import { useState } from "react";
import { Plus, ArrowRight } from "lucide-react";
import { type Draft, type BlogImage, plainBlogText, readBlogImage, saveDrafts } from "@/lib/blogs";
import { cleanRichHtml } from "@/lib/local-services";
import ServiceEditor from "@/components/ServiceEditor";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";

export default function AdminBlogs({
  drafts,
  onSave,
}: {
  drafts: Draft[];
  onSave: (drafts: Draft[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const [id, setId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [initialBody, setInitialBody] = useState("");
  const [body, setBody] = useState("");
  const [cover, setCover] = useState<BlogImage | null>(null);
  const [imageBusy, setImageBusy] = useState(false);
  const [editorBusy, setEditorBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const busy = imageBusy || editorBusy;
  function edit(draft?: Draft) {
    setId(draft?.id ?? null);
    setTitle(draft?.title ?? "");
    setBody(draft?.body ?? "");
    setInitialBody(draft?.body ?? "");
    setCover(draft?.cover ?? null);
    setNotice("");
    setOpen(true);
  }
  async function uploadCover(file?: File) {
    if (!file) return;
    setImageBusy(true);
    setNotice("");
    try {
      setCover({ src: await readBlogImage(file), alt: "" });
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Unable to read image.");
    } finally {
      setImageBusy(false);
    }
  }
  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="admin-eyebrow">The Silverfox journal</p>
          <h1 className="admin-title">Blogs</h1>
        </div>
        <Button onClick={() => edit()}>
          <Plus />
          Create blog
        </Button>
      </div>
      <p className="mb-6 text-sm text-muted-foreground">
        Write stories for owners and residents. Drafts are saved in this browser; publishing is not
        connected yet.
      </p>
      {!open && (
        <p role="status" className="mb-4 text-sm">
          {notice}
        </p>
      )}
      {drafts.length ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {drafts.map((draft) => (
            <article key={draft.id} className="admin-panel overflow-hidden">
              {draft.cover && (
                <img
                  src={draft.cover.src}
                  alt={draft.cover.alt}
                  className="aspect-video w-full object-cover"
                />
              )}
              <div className="p-6">
                <span className="rounded-full bg-accent/10 px-3 py-1 text-xs">Local draft</span>
                <h2 className="mt-4 break-words text-xl font-semibold">{draft.title}</h2>
                <p className="mt-3 line-clamp-3 break-words text-sm leading-6 text-muted-foreground">
                  {plainBlogText(draft.body)}
                </p>
                <p className="mt-4 text-xs text-muted-foreground">
                  Saved {new Date(draft.updated).toLocaleDateString("en-GB")}
                </p>
                <Button variant="outline" className="mt-5" onClick={() => edit(draft)}>
                  Edit draft <ArrowRight />
                </Button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <section className="admin-panel p-12 text-center">
          <h2 className="text-xl font-semibold">Your next story starts here.</h2>
          <p className="my-4 text-sm text-muted-foreground">
            Share property insights, practical advice and news.
          </p>
          <Button onClick={() => edit()}>Create your first blog</Button>
        </section>
      )}
      <Dialog
        open={open}
        onOpenChange={(next) => {
          if (!busy) setOpen(next);
        }}
      >
        <DialogContent className="max-h-[90dvh] max-w-[calc(100%-2rem)] overflow-y-auto sm:max-w-4xl">
          <DialogTitle>{id ? "Edit blog draft" : "Create blog"}</DialogTitle>
          <DialogDescription>
            Add a title, optional cover image and full article. Fields marked * are required.
          </DialogDescription>
          <form
            className="space-y-5"
            onSubmit={(event) => {
              event.preventDefault();
              if (busy) return;
              const html = cleanRichHtml(body, true);
              const doc = new DOMParser().parseFromString(html, "text/html");
              const text = doc.body.textContent?.trim() ?? "";
              const images = Array.from(doc.querySelectorAll("img"));
              if (
                !title.trim() ||
                !text ||
                text.length > 50000 ||
                images.length > 5 ||
                images.some((img) => !img.alt.trim()) ||
                (cover && !cover.alt.trim())
              ) {
                setNotice(
                  "Add a title and article text (up to 50,000 characters). Provide alt text for all images and use up to five article images.",
                );
                return;
              }
              const draft: Draft = {
                id: id ?? crypto.randomUUID(),
                title: title.trim(),
                body: html,
                cover,
                format: "html",
                updated: new Date().toISOString(),
              };
              const next = [draft, ...drafts.filter((item) => item.id !== draft.id)];
              try {
                saveDrafts(next);
                onSave(next);
                setOpen(false);
                setNotice("Blog draft saved in this browser.");
              } catch {
                setNotice(
                  "Unable to save: browser storage is full or unavailable. Remove or reduce images and retry. Your work is still in this form.",
                );
              }
            }}
          >
            <label className="block text-sm font-medium">
              Blog title *
              <input
                required
                maxLength={160}
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                className="admin-input mt-2"
              />
            </label>
            <div className="rounded-lg border border-dashed border-border p-4">
              <label className="block text-sm font-medium">
                Cover image (optional)
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  disabled={busy}
                  className="admin-input mt-2"
                  onChange={(event) => {
                    void uploadCover(event.target.files?.[0]);
                    event.target.value = "";
                  }}
                />
              </label>
              <p className="mt-2 text-xs text-muted-foreground">
                JPG, PNG or WebP, up to 600 KB. Add more images within the article below.
              </p>
              {cover && (
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <img
                    src={cover.src}
                    alt={cover.alt || "Cover preview"}
                    className="h-24 w-32 rounded object-cover"
                  />
                  <label className="min-w-0 flex-1 text-sm">
                    Cover image alt text *
                    <input
                      required
                      maxLength={150}
                      value={cover.alt}
                      onChange={(event) => setCover({ ...cover, alt: event.target.value })}
                      className="admin-input mt-2"
                    />
                  </label>
                  <Button
                    type="button"
                    variant="ghost"
                    disabled={busy}
                    onClick={() => setCover(null)}
                  >
                    Remove cover
                  </Button>
                </div>
              )}
            </div>
            <ServiceEditor
              initialHtml={initialBody}
              onChange={setBody}
              allowImages
              onBusy={setEditorBusy}
            />
            {notice && (
              <p role="alert" className="text-sm text-destructive">
                {notice}
              </p>
            )}
            <div className="flex justify-end gap-3 border-t border-border pt-4">
              <Button
                type="button"
                variant="outline"
                disabled={busy}
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={busy}>
                {busy ? "Reading images…" : "Save draft"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
