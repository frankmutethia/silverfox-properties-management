import { useEffect } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { listPublishedPosts } from "@/lib/blog";
import { articleTextClass } from "@/lib/rich-text";
import type { ApiPost } from "@/lib/types";
import { useQuery } from "@/lib/use-query";
import { Button } from "@/components/ui/button";
import RichText from "@/components/RichText";

export default function BlogDetail({ post }: { post: ApiPost }) {
  useEffect(() => {
    const previous = document.title;
    document.title = `${post.title} | Silverfox Journal`;
    return () => {
      document.title = previous;
    };
  }, [post.title]);
  const more = useQuery((signal) => listPublishedPosts({ limit: 3 }, signal), []);
  const others = (more.data?.items ?? []).filter((item) => item._id !== post._id).slice(0, 2);
  const published = post.publishedAt
    ? new Intl.DateTimeFormat("en-GB", { dateStyle: "long" }).format(new Date(post.publishedAt))
    : null;
  return (
    <main id="main-content" className="mx-auto max-w-5xl px-5 py-10 lg:px-8">
      <a
        href="/#blogs"
        className="inline-flex min-h-11 items-center gap-2 text-sm text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="size-4" />
        Back to the journal
      </a>
      <article>
        <header className="max-w-3xl py-8">
          {post.category && (
            <p className="text-xs font-bold uppercase tracking-wider text-accent">
              {post.category}
            </p>
          )}
          <h1 className="mt-4 text-4xl font-bold leading-tight tracking-tight text-primary sm:text-5xl">
            {post.title}
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">{post.excerpt}</p>
          {(published || post.author) && (
            <p className="mt-5 text-sm text-muted-foreground">
              {[post.author?.name, published].filter(Boolean).join(" · ")}
            </p>
          )}
        </header>
        {post.coverImage && (
          <img
            src={post.coverImage.url}
            alt={post.coverImage.alt}
            className="aspect-[16/9] w-full rounded-xl object-cover"
            fetchPriority="high"
          />
        )}
        <div className="mx-auto max-w-3xl py-10">
          <RichText html={post.content ?? ""} images className={`${articleTextClass} mb-9`} />
          <div className="rounded-xl bg-secondary p-6">
            <h2 className="text-xl font-semibold">Let’s talk about your property.</h2>
            <p className="my-3 text-sm leading-6 text-muted-foreground">
              Contact Silverfox for help with your next enquiry.
            </p>
            <Button asChild>
              <a href="/#contact">
                Contact our team <ArrowRight />
              </a>
            </Button>
          </div>
        </div>
      </article>
      {others.length > 0 && (
        <nav aria-label="More journal articles" className="mb-8 border-t border-border pt-8">
          <h2 className="mb-4 text-xl font-semibold">More from the journal</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {others.map((item) => (
              <a
                key={item._id}
                href={`/blogs/${item.slug}`}
                className="rounded-lg border border-border p-5 font-medium hover:bg-secondary"
              >
                {item.title}
                <ArrowRight className="mt-3 size-4 text-accent" />
              </a>
            ))}
          </div>
        </nav>
      )}
    </main>
  );
}
