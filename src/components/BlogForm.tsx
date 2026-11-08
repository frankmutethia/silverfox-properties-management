import { useId, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { notifyCreated, notifyUpdated } from "@/lib/notify";
import {
  ARTICLE_MAX_IMAGES,
  ARTICLE_MAX_TEXT,
  createPost,
  getAdminPost,
  updatePost,
} from "@/lib/blog";
import { plainText } from "@/lib/rich-text";
import type { ApiImage, ApiPost, PostInput, PublicationStatus } from "@/lib/types";
import { useFieldErrors } from "@/lib/form-errors";
import { useQuery } from "@/lib/use-query";
import ServiceEditor from "./ServiceEditor";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "./ui/dialog";
import FieldError from "./admin/FieldError";
import ImageField from "./admin/ImageField";
import { LineSkeletons, LoadError } from "./QueryState";

/** Create or edit an article. `postId` null = create. */
export default function BlogForm({
  postId,
  open,
  onOpenChange,
  onSaved,
}: {
  postId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved: (post: ApiPost) => void;
}) {
  const [busy, setBusy] = useState(false);
  return (
    <Dialog open={open} onOpenChange={(next) => !busy && onOpenChange(next)}>
      <DialogContent className="max-h-[90dvh] max-w-[calc(100%-2rem)] overflow-y-auto sm:max-w-4xl">
        <DialogTitle>{postId ? "Edit article" : "Create article"}</DialogTitle>
        <DialogDescription>
          Fields marked * are required. Leave the summary blank to generate it from the article.
        </DialogDescription>
        {postId ? (
          <ExistingPost
            key={postId}
            id={postId}
            busy={busy}
            setBusy={setBusy}
            onCancel={() => onOpenChange(false)}
            onSaved={(saved) => {
              onSaved(saved);
              onOpenChange(false);
            }}
          />
        ) : (
          <BlogFormBody
            post={null}
            busy={busy}
            setBusy={setBusy}
            onCancel={() => onOpenChange(false)}
            onSaved={(saved) => {
              onSaved(saved);
              onOpenChange(false);
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

type BodyProps = {
  busy: boolean;
  setBusy: (busy: boolean) => void;
  onCancel: () => void;
  onSaved: (post: ApiPost) => void;
};

/** List responses omit `content`, so the full article is fetched before editing. */
function ExistingPost({ id, ...props }: BodyProps & { id: string }) {
  const result = useQuery((signal) => getAdminPost(id, signal), [id]);
  if (result.data) return <BlogFormBody post={result.data} {...props} />;
  if (result.error) return <LoadError error={result.error} onRetry={result.reload} />;
  return <LineSkeletons lines={8} />;
}

function BlogFormBody({
  post,
  busy,
  setBusy,
  onCancel,
  onSaved,
}: BodyProps & { post: ApiPost | null }) {
  const form = useFieldErrors(["title", "category", "excerpt", "content", "cover"], {
    coverImage: "cover",
  });
  const [content, setContent] = useState(post?.content ?? "");
  const [cover, setCover] = useState<ApiImage | null>(post?.coverImage ?? null);
  const [uploading, setUploading] = useState(false);
  const summaryHintId = useId();

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy || uploading) return;
    const data = new FormData(event.currentTarget);
    const status = ((event.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null)
      ?.value as PublicationStatus | undefined;
    const title = String(data.get("title") ?? "").trim();
    const text = plainText(content);
    const images = Array.from(
      new DOMParser().parseFromString(content, "text/html").querySelectorAll("img"),
    );
    const problems: Record<string, string> = {};
    if (!title) problems["title"] = "Enter a title.";
    if (!text || text.length > ARTICLE_MAX_TEXT)
      problems["content"] =
        `Write an article of up to ${ARTICLE_MAX_TEXT.toLocaleString("en-GB")} characters.`;
    else if (images.length > ARTICLE_MAX_IMAGES)
      problems["content"] = `Use up to ${ARTICLE_MAX_IMAGES} images in the article.`;
    else if (images.some((img) => !img.alt.trim()))
      problems["content"] = "Describe every image in the article.";
    if (cover && !cover.alt.trim()) problems["cover"] = "Describe the cover image.";
    form.setErrors(problems);
    if (Object.keys(problems).length) {
      toast.error("Please correct the highlighted fields.");
      return;
    }
    const input: PostInput = {
      title,
      content,
      category: String(data.get("category") ?? "").trim() || null,
      excerpt: String(data.get("excerpt") ?? "").trim() || null,
      coverImage: cover && { ...cover, alt: cover.alt.trim() },
    };
    setBusy(true);
    try {
      const saved = post
        ? await updatePost(post._id, input)
        : await createPost({ ...input, status: status ?? "draft" });
      const item = {
        kind: "Article" as const,
        name: saved.title,
        status: saved.status,
        href: `/blogs/${saved.slug}`,
      };
      if (post) notifyUpdated(item);
      else notifyCreated(item);
      onSaved(saved);
    } catch (error) {
      form.handle(error);
    } finally {
      setBusy(false);
    }
  }

  const disabled = busy || uploading;
  return (
    <form className="space-y-5" onSubmit={submit} noValidate>
      <label className="block text-sm font-medium">
        Title *
        <input
          name="title"
          required
          maxLength={200}
          defaultValue={post?.title ?? ""}
          className="admin-input mt-2"
          {...form.describe("title")}
        />
        <FieldError form={form} name="title" />
      </label>
      <label className="block text-sm font-medium sm:max-w-md">
        Category
        <input
          name="category"
          maxLength={80}
          defaultValue={post?.category ?? ""}
          placeholder="e.g. Property care"
          className="admin-input mt-2"
          {...form.describe("category")}
        />
        <FieldError form={form} name="category" />
      </label>
      <label className="block text-sm font-medium">
        Summary
        <textarea
          name="excerpt"
          maxLength={400}
          rows={3}
          defaultValue={post?.excerpt ?? ""}
          className="admin-input mt-2 resize-y"
          {...form.describe("excerpt")}
          aria-describedby={[summaryHintId, form.describe("excerpt")["aria-describedby"]]
            .filter(Boolean)
            .join(" ")}
        />
        <span id={summaryHintId} className="mt-1.5 block text-xs font-normal text-muted-foreground">
          Shown on article cards, up to 400 characters. Leave blank to use the opening of the
          article.
        </span>
        <FieldError form={form} name="excerpt" />
      </label>
      <ImageField
        label="Cover image (optional)"
        folder="blog"
        value={cover}
        onChange={setCover}
        onBusyChange={setUploading}
        altLabel="Cover image description"
        error={form.errors["cover"]}
        errorId={form.messageId("cover")}
      />
      <ServiceEditor
        label="Article"
        initialHtml={post?.content ?? ""}
        onChange={setContent}
        imageFolder="blog"
        onBusy={setUploading}
        maxText={ARTICLE_MAX_TEXT}
        error={form.errors["content"]}
        errorId={form.messageId("content")}
      />
      <div className="flex flex-wrap justify-end gap-3 border-t border-border pt-4">
        <Button type="button" variant="outline" disabled={busy} onClick={onCancel}>
          Cancel
        </Button>
        {post ? (
          <Button type="submit" disabled={disabled}>
            {uploading ? "Uploading images…" : busy ? "Saving…" : "Save changes"}
          </Button>
        ) : (
          <>
            <Button type="submit" value="draft" variant="outline" disabled={disabled}>
              {busy ? "Saving…" : "Save draft"}
            </Button>
            <Button type="submit" value="published" disabled={disabled}>
              {uploading ? "Uploading images…" : "Save and publish"}
            </Button>
          </>
        )}
      </div>
    </form>
  );
}
