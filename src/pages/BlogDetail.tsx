import { useEffect } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { type Article, articles } from "@/data/articles";
import { Button } from "@/components/ui/button";

export default function BlogDetail({ article }: { article: Article }) {
  useEffect(() => {
    const previous = document.title;
    document.title = `${article.title} | Silverfox Journal`;
    return () => {
      document.title = previous;
    };
  }, [article.title]);
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
          <p className="text-xs font-bold uppercase tracking-wider text-accent">
            {article.category}
          </p>
          <h1 className="mt-4 text-4xl font-bold leading-tight tracking-tight text-primary sm:text-5xl">
            {article.title}
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">{article.excerpt}</p>
        </header>
        <img
          src={article.image}
          alt={article.alt}
          className="aspect-[16/9] w-full rounded-xl object-cover"
          fetchPriority="high"
        />
        <div className="mx-auto max-w-3xl py-10">
          {article.sections.map((section) => (
            <section key={section.title} className="mb-9">
              <h2 className="text-2xl font-semibold text-primary">{section.title}</h2>
              <p className="mt-4 leading-8 text-foreground/80">{section.body}</p>
            </section>
          ))}
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
      <nav aria-label="More journal articles" className="mb-8 border-t border-border pt-8">
        <h2 className="mb-4 text-xl font-semibold">More from the journal</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {articles
            .filter((item) => item.slug !== article.slug)
            .map((item) => (
              <a
                key={item.slug}
                href={`/blogs/${item.slug}`}
                className="rounded-lg border border-border p-5 font-medium hover:bg-secondary"
              >
                {item.title}
                <ArrowRight className="mt-3 size-4 text-accent" />
              </a>
            ))}
        </div>
      </nav>
    </main>
  );
}
