import { ArrowUpRight, ArrowRight } from "lucide-react";
import { listPublishedPosts } from "@/lib/blog";
import { useQuery } from "@/lib/use-query";
import { CardSkeletons, LoadError } from "./QueryState";

export default function BlogSection() {
  const result = useQuery((signal) => listPublishedPosts({ limit: 3 }, signal), []);
  const posts = result.data?.items ?? [];
  return (
    <section id="blogs" className="border-t border-border bg-background py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="mb-9 flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-[.18em] text-accent">
              The Silverfox journal
            </p>
            <h2 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl">
              A little insight. A better move.
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-7 text-muted-foreground">
            Practical perspectives on finding a home, caring for property and working with a
            management team.
          </p>
        </div>
        {!result.data && result.loading ? (
          <CardSkeletons className="md:grid-cols-3 xl:grid-cols-3" />
        ) : !result.data && result.error ? (
          <LoadError error={result.error} onRetry={result.reload} />
        ) : posts.length ? (
          <div className="grid gap-6 md:grid-cols-3">
            {posts.map((post) => (
              <article
                key={post._id}
                className="group overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-lg"
              >
                <a href={`/blogs/${post.slug}`} className="flex h-full flex-col">
                  {post.coverImage && (
                    <div className="aspect-[3/2] overflow-hidden">
                      <img
                        src={post.coverImage.url}
                        alt={post.coverImage.alt}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                    </div>
                  )}
                  <div className="flex flex-1 flex-col p-6">
                    {post.category && (
                      <p className="text-xs font-semibold uppercase tracking-wider text-accent">
                        {post.category}
                      </p>
                    )}
                    <h3 className="mt-3 text-xl font-semibold leading-snug text-primary">
                      {post.title}
                    </h3>
                    <p className="mt-3 flex-1 text-sm leading-6 text-muted-foreground">
                      {post.excerpt}
                    </p>
                    <span className="mt-6 flex items-center justify-between border-t border-border pt-4 text-sm font-semibold text-primary">
                      Read article <ArrowUpRight className="size-5" />
                    </span>
                  </div>
                </a>
              </article>
            ))}
          </div>
        ) : (
          <p className="rounded-xl border border-border bg-card p-8 text-sm text-muted-foreground">
            New articles are on the way. Check back soon for practical property advice.
          </p>
        )}
        <a
          href="#contact"
          className="mt-7 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-primary"
        >
          Have a property question? Talk to us <ArrowRight className="size-4" />
        </a>
      </div>
    </section>
  );
}
