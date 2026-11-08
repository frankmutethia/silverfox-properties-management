import {
  ArrowRight,
  ArrowUpRight,
  BriefcaseBusiness,
  Building2,
  FileText,
  ImageOff,
  MessageSquareQuote,
  Star,
} from "lucide-react";
import { getDashboard } from "@/lib/auth";
import type { ApiUser } from "@/lib/types";
import { useQuery } from "@/lib/use-query";
import { Button } from "@/components/ui/button";
import { LineSkeletons, LoadError } from "@/components/QueryState";
import StatusBadge from "@/components/admin/StatusBadge";

const date = (value: string) =>
  new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short" }).format(new Date(value));

export default function AdminDashboard({ user }: { user: ApiUser | null }) {
  const result = useQuery((signal) => getDashboard(signal), []);
  const data = result.data;
  return (
    <>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="mb-2 text-xs font-semibold text-accent">
            {new Intl.DateTimeFormat("en-GB", {
              weekday: "long",
              day: "numeric",
              month: "long",
              timeZone: "Africa/Nairobi",
            }).format(new Date())}
          </p>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Welcome back{user ? `, ${user.name}` : ""}
            <span className="text-accent">.</span>
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            A clear view of your properties and the stories behind them.
          </p>
        </div>
        <Button variant="outline" asChild>
          <a href="/">
            View website <ArrowUpRight />
          </a>
        </Button>
      </div>
      {!data && result.error ? (
        <LoadError error={result.error} onRetry={result.reload} className="admin-panel" />
      ) : (
        <>
          <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              {
                label: "Properties",
                count: data?.properties.total,
                detail: data
                  ? `${data.properties.published} published · ${data.properties.draft} draft · ${data.properties.apartments} apartments · ${data.properties.houses} houses`
                  : "",
                icon: Building2,
                href: "/admin/properties",
              },
              {
                label: "Services",
                count: data && data.services.published + data.services.draft,
                detail: data
                  ? `${data.services.published} published · ${data.services.draft} draft`
                  : "",
                icon: BriefcaseBusiness,
                href: "/admin/services",
              },
              {
                label: "Journal articles",
                count: data && data.blog.published + data.blog.draft,
                detail: data ? `${data.blog.published} published · ${data.blog.draft} draft` : "",
                icon: FileText,
                href: "/admin/blogs",
              },
              {
                label: "Testimonials to review",
                count: data?.testimonials.pending,
                detail: data
                  ? `${data.testimonials.published} published · ${data.testimonials.draft} draft`
                  : "",
                icon: MessageSquareQuote,
                href: "/admin/testimonials",
              },
            ].map(({ label, count, detail, icon: Icon, href }) => (
              <a key={label} href={href} className="admin-panel block p-5 hover:bg-secondary/40">
                <div className="mb-6 flex items-center justify-between">
                  <span className="rounded-xl bg-accent/10 p-3 text-accent">
                    <Icon className="size-5" />
                  </span>
                  <ArrowUpRight className="size-4 text-muted-foreground" aria-hidden="true" />
                </div>
                <p className="text-3xl font-semibold tracking-tight">
                  {count === undefined ? "–" : count.toString().padStart(2, "0")}
                </p>
                <h2 className="mb-1 mt-2 text-sm font-semibold">{label}</h2>
                <p className="min-h-4 text-xs text-muted-foreground">{detail}</p>
              </a>
            ))}
          </div>
          <div className="grid items-start gap-6 xl:grid-cols-[1.7fr_1fr]">
            <section className="admin-panel overflow-hidden">
              <div className="flex items-center justify-between gap-3 border-b border-border p-5">
                <div>
                  <h2 className="font-semibold">Recently updated properties</h2>
                  <p className="mt-1 text-xs text-muted-foreground">
                    The latest changes across your collection.
                  </p>
                </div>
                <a
                  href="/admin/properties"
                  className="flex shrink-0 items-center gap-1 text-xs font-semibold text-primary"
                >
                  View all <ArrowRight className="size-3" />
                </a>
              </div>
              {!data ? (
                <LineSkeletons lines={6} className="p-5" />
              ) : data.recent.properties.length ? (
                <div className="divide-y divide-border">
                  {data.recent.properties.map((property) => {
                    const cover = property.images[0];
                    return (
                      <div key={property._id} className="flex items-center gap-4 p-5">
                        {cover ? (
                          <img
                            src={cover.url}
                            alt=""
                            className="h-14 w-20 rounded-lg object-cover"
                          />
                        ) : (
                          <span className="flex h-14 w-20 items-center justify-center rounded-lg bg-secondary">
                            <ImageOff className="size-4 text-muted-foreground" />
                          </span>
                        )}
                        <div className="min-w-0 flex-1">
                          <h3 className="truncate text-sm font-semibold">{property.name}</h3>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {property.reference} · updated {date(property.updatedAt)}
                          </p>
                        </div>
                        <StatusBadge status={property.status} />
                        {property.status === "published" && (
                          <a
                            href={`/properties/${property.slug}`}
                            target="_blank"
                            rel="noreferrer"
                            aria-label={`View ${property.name} on the website`}
                            className="text-muted-foreground hover:text-primary"
                          >
                            <ArrowUpRight className="size-4" />
                          </a>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="p-5 text-sm text-muted-foreground">No properties yet.</p>
              )}
            </section>
            <div className="space-y-6">
              <section className="admin-panel p-6">
                <div className="mb-4 flex items-center gap-3">
                  <MessageSquareQuote className="size-5 text-accent" />
                  <h2 className="font-semibold">Waiting for review</h2>
                </div>
                {!data ? (
                  <LineSkeletons lines={3} />
                ) : data.recent.pendingTestimonials.length ? (
                  <ul className="space-y-4">
                    {data.recent.pendingTestimonials.map((item) => (
                      <li key={item._id} className="text-sm">
                        <p className="flex items-center gap-2 font-semibold">
                          {item.name}
                          <span className="flex items-center gap-0.5 text-xs font-normal text-muted-foreground">
                            <Star className="size-3 fill-amber-500 text-amber-500" />
                            {item.rating}
                          </span>
                        </p>
                        <p className="mt-1 line-clamp-2 text-muted-foreground">{item.comment}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">No testimonials are waiting.</p>
                )}
                <Button variant="outline" asChild className="mt-5">
                  <a href="/admin/testimonials">Open testimonials</a>
                </Button>
              </section>
              <section className="admin-panel p-6">
                <div className="mb-4 flex items-center gap-3">
                  <FileText className="size-5 text-accent" />
                  <h2 className="font-semibold">From the journal</h2>
                </div>
                {!data ? (
                  <LineSkeletons lines={3} />
                ) : data.recent.posts.length ? (
                  <ul className="space-y-3">
                    {data.recent.posts.map((post) => (
                      <li key={post._id} className="flex items-center justify-between gap-3">
                        <span className="min-w-0 truncate text-sm">{post.title}</span>
                        <StatusBadge status={post.status} />
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Good advice starts with a first draft.
                  </p>
                )}
                <Button variant="outline" asChild className="mt-5">
                  <a href="/admin/blogs">Open blogs</a>
                </Button>
              </section>
            </div>
          </div>
        </>
      )}
    </>
  );
}
