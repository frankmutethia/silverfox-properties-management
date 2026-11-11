import { ArrowRight } from "lucide-react";
import { serviceHref, serviceIcon, serviceSummary } from "@/lib/services";
import type { ServiceWithPhoto } from "@/lib/service-photos";

/** A compact, fixed-size service card; the whole card opens the service's page. */
export default function ServiceCard({ card }: { card: ServiceWithPhoto }) {
  const { service, photo, uploaded } = card;
  const Icon = serviceIcon(service.icon);
  const category = String(service.category || "").replace(/ services$/i, "");
  return (
    <a
      href={serviceHref(service)}
      className="group flex w-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-xl focus-visible:-translate-y-1 focus-visible:shadow-xl motion-reduce:transition-none motion-reduce:hover:translate-y-0"
    >
      <div className="relative aspect-[16/10] shrink-0 overflow-hidden bg-secondary">
        <img
          src={photo}
          alt={uploaded ? (service.image?.alt ?? "") : ""}
          loading="lazy"
          className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        />
        <span className="absolute left-4 top-4 flex size-10 items-center justify-center rounded-xl bg-card/95 text-accent shadow-sm backdrop-blur">
          <Icon className="size-5" aria-hidden="true" />
        </span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        {category && (
          <p className="truncate text-[11px] font-bold uppercase tracking-[0.16em] text-accent">
            {category}
          </p>
        )}
        <h3 className="mt-2 line-clamp-2 text-xl font-semibold tracking-[-0.02em] text-primary">
          {service.title}
        </h3>
        <p className="mt-3 line-clamp-3 text-sm leading-6 text-foreground/70">
          {serviceSummary(service)}
        </p>
        <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-semibold text-primary group-hover:text-accent">
          Learn more
          <ArrowRight
            className="size-4 transition-transform group-hover:translate-x-1"
            aria-hidden="true"
          />
        </span>
      </div>
    </a>
  );
}
