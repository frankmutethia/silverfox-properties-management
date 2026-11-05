import { ArrowUpRight } from "lucide-react";
import { serviceGroups } from "@/data/services";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import CreateService from "@/components/CreateService";
import { readLocalServices } from "@/lib/local-services";
import { serviceTextClass } from "@/components/ServiceEditor";

export default function AdminServices() {
  const [drafts, setDrafts] = useState(readLocalServices);
  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="admin-eyebrow">The Silverfox offering</p>
          <h1 className="admin-title">Services</h1>
        </div>
        <div className="flex flex-wrap items-start gap-3">
          <Button asChild variant="outline">
            <a href="/#management">
              View on website <ArrowUpRight />
            </a>
          </Button>
          <CreateService onCreated={setDrafts} />
        </div>
      </div>
      <p className="mb-8 mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
        Review website services and create local drafts for each category. Drafts are not yet
        published to the website.
      </p>
      <div className="grid gap-6 xl:grid-cols-2">
        {serviceGroups.map((group) => (
          <section key={group.number} className="admin-panel overflow-hidden">
            <div className="border-b border-border bg-secondary/50 p-6">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-accent">
                Category {group.number} · {group.services.length} website services ·{" "}
                {drafts.filter((draft) => draft.category === group.number).length} drafts
              </p>
              <h2 className="text-xl font-semibold">{group.title}</h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{group.description}</p>
            </div>
            <ul className="divide-y divide-border px-6">
              {group.services.map(({ title, copy, icon: Icon }) => (
                <li key={title} className="flex gap-4 py-6">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold">{title}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{copy}</p>
                  </div>
                </li>
              ))}
            </ul>
            {drafts
              .filter((draft) => draft.category === group.number)
              .map((draft) => (
                <article key={draft.id} className="border-t border-border p-6">
                  <span className="rounded-full bg-accent/10 px-2 py-1 text-xs font-semibold text-accent">
                    Local draft
                  </span>
                  <h3 className="mt-3 break-words text-lg font-semibold">{draft.title}</h3>
                  {draft.image && (
                    <img
                      src={draft.image.src}
                      alt={draft.image.alt}
                      className="mt-4 aspect-[16/9] w-full rounded-lg object-cover"
                    />
                  )}
                  <div
                    className={`${serviceTextClass} mt-3`}
                    dangerouslySetInnerHTML={{ __html: draft.description }}
                  />
                </article>
              ))}
          </section>
        ))}
      </div>
    </>
  );
}
