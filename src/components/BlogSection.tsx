import { ArrowUpRight, ArrowRight } from "lucide-react";
import { articles } from "@/data/articles";

export default function BlogSection() {
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
        <div className="grid gap-6 md:grid-cols-3">
          {articles.map((article) => (
            <article
              key={article.slug}
              className="group overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-lg"
            >
              <a href={`/blogs/${article.slug}`} className="flex h-full flex-col">
                <div className="aspect-[3/2] overflow-hidden">
                  <img
                    src={article.image}
                    alt={article.alt}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <p className="text-xs font-semibold uppercase tracking-wider text-accent">
                    {article.category}
                  </p>
                  <h3 className="mt-3 text-xl font-semibold leading-snug text-primary">
                    {article.title}
                  </h3>
                  <p className="mt-3 flex-1 text-sm leading-6 text-muted-foreground">
                    {article.excerpt}
                  </p>
                  <span className="mt-6 flex items-center justify-between border-t border-border pt-4 text-sm font-semibold text-primary">
                    Read article <ArrowUpRight className="size-5" />
                  </span>
                </div>
              </a>
            </article>
          ))}
        </div>
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
