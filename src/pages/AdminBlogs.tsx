import { useState } from "react";
import { ArrowUpRight, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { notifyDeleted, notifyStatusChanged } from "@/lib/notify";
import { deletePost, listAdminPosts, togglePostPublish } from "@/lib/blog";
import type { ApiPost, PublicationStatus } from "@/lib/types";
import { reportError, useDebounced, useQuery } from "@/lib/use-query";
import { Button } from "@/components/ui/button";
import BlogForm from "@/components/BlogForm";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import Pager from "@/components/admin/Pager";
import StatusBadge, { StatusFilter } from "@/components/admin/StatusBadge";
import { CardSkeletons, LoadError } from "@/components/QueryState";

type StatusOption = "all" | PublicationStatus;

export default function AdminBlogs() {
  const [status, setStatus] = useState<StatusOption>("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const query = useDebounced(search.trim());
  const result = useQuery(
    (signal) =>
      listAdminPosts(
        { status: status === "all" ? undefined : status, search: query, page, limit: 12 },
        signal,
      ),
    [status, query, page],
  );
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [deleting, setDeleting] = useState<ApiPost | null>(null);
  const [toggling, setToggling] = useState<string | null>(null);
  const posts = result.data?.items ?? [];

  async function toggle(post: ApiPost) {
    setToggling(post._id);
    try {
      const saved = await togglePostPublish(post._id);
      notifyStatusChanged({
        kind: "Article",
        name: saved.title,
        status: saved.status,
        href: `/blogs/${saved.slug}`,
      });
      result.reload();
    } catch (error) {
      reportError(error);
    } finally {
      setToggling(null);
    }
  }

  function edit(id: string | null) {
    setEditingId(id);
    setFormOpen(true);
  }

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="admin-eyebrow">The Silverfox journal</p>
          <h1 className="admin-title">Blogs</h1>
        </div>
        <Button onClick={() => edit(null)}>
          <Plus />
          Create article
        </Button>
      </div>
      <p className="mb-6 text-sm text-muted-foreground">
        Write stories for owners and residents. Drafts stay private until you publish them.
      </p>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <StatusFilter
          label="Filter by status"
          value={status}
          onChange={(value) => {
            setStatus(value);
            setPage(1);
          }}
          options={[
            { value: "all", label: "All" },
            { value: "published", label: "Published" },
            { value: "draft", label: "Drafts" },
          ]}
        />
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-3.5 size-4 text-muted-foreground" />
          <input
            type="search"
            aria-label="Search articles"
            placeholder="Search titles and summaries…"
            className="admin-input pl-10"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
          />
        </div>
      </div>
      {!result.data && result.loading ? (
        <CardSkeletons />
      ) : !result.data && result.error ? (
        <LoadError error={result.error} onRetry={result.reload} className="admin-panel" />
      ) : posts.length ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3" aria-busy={result.loading}>
          {posts.map((post) => (
            <article key={post._id} className="admin-panel flex flex-col overflow-hidden">
              {post.coverImage && (
                <img
                  src={post.coverImage.url}
                  alt={post.coverImage.alt}
                  className="aspect-video w-full object-cover"
                />
              )}
              <div className="flex flex-1 flex-col p-6">
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge status={post.status} />
                  {post.category && (
                    <span className="text-xs text-muted-foreground">{post.category}</span>
                  )}
                </div>
                <h2 className="mt-4 break-words text-xl font-semibold">{post.title}</h2>
                <p className="mt-3 line-clamp-3 flex-1 break-words text-sm leading-6 text-muted-foreground">
                  {post.excerpt}
                </p>
                <p className="mt-4 text-xs text-muted-foreground">
                  Updated {new Date(post.updatedAt).toLocaleDateString("en-GB")}
                  {post.author ? ` · ${post.author.name}` : ""}
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" onClick={() => edit(post._id)}>
                    <Pencil />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={toggling === post._id}
                    onClick={() => void toggle(post)}
                  >
                    {post.status === "published" ? "Unpublish" : "Publish"}
                  </Button>
                  {post.status === "published" && (
                    <Button variant="outline" size="icon" asChild>
                      <a
                        href={`/blogs/${post.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`View “${post.title}” on the website`}
                      >
                        <ArrowUpRight />
                      </a>
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="icon"
                    className="text-destructive"
                    aria-label={`Delete “${post.title}”`}
                    onClick={() => setDeleting(post)}
                  >
                    <Trash2 />
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <section className="admin-panel p-12 text-center">
          <h2 className="text-xl font-semibold">
            {status === "all" && !query ? "Your next story starts here." : "No matching articles."}
          </h2>
          <p className="my-4 text-sm text-muted-foreground">
            Share property insights, practical advice and news.
          </p>
          <Button onClick={() => edit(null)}>Create an article</Button>
        </section>
      )}
      <Pager pagination={result.data?.pagination} onPage={setPage} disabled={result.loading} />
      <BlogForm
        postId={editingId}
        open={formOpen}
        onOpenChange={setFormOpen}
        onSaved={() => result.reload()}
      />
      <ConfirmDialog
        open={deleting !== null}
        onOpenChange={(open) => !open && setDeleting(null)}
        title={`Delete “${deleting?.title ?? "article"}”?`}
        description="This permanently removes the article and its cover image. To hide it temporarily, unpublish it instead."
        onConfirm={async () => {
          if (!deleting) return;
          await deletePost(deleting._id);
          notifyDeleted("Article", deleting.title);
          if (posts.length === 1 && page > 1) setPage(page - 1);
          else result.reload();
        }}
      />
    </>
  );
}
