import { getPublishedServices, serviceIcon } from "@/lib/services";
import { richTextClass } from "@/lib/rich-text";
import type { ServiceGroup as ServiceGroupData } from "@/lib/types";
import { useQuery } from "@/lib/use-query";
import { Skeleton } from "@/components/ui/skeleton";
import { LoadError, LineSkeletons } from "./QueryState";
import RichText from "./RichText";

export default function ServicesSection() {
  const result = useQuery((signal) => getPublishedServices(signal), []);
  const groups = result.data?.filter((group) => group.services.length) ?? [];
  return (
    <section id="management" className="bg-card py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="grid gap-8 border-b border-border pb-10 lg:grid-cols-[1fr_.9fr] lg:items-end">
          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-accent">
              Our services
            </p>
            <h2 className="max-w-2xl text-4xl font-bold leading-tight tracking-[-0.035em] text-primary sm:text-5xl">
              Guidance through every stage of property ownership.
            </h2>
          </div>
          <p className="border-l-2 border-accent pl-6 text-base font-medium leading-7 text-foreground/75">
            Silverfox supports buyers, sellers and property owners with practical coordination,
            careful documentation and dependable day-to-day management.
          </p>
        </div>
        {!result.data && result.loading ? (
          <div className="grid gap-6 pt-10 lg:grid-cols-2" aria-busy="true" aria-label="Loading">
            {[0, 1].map((index) => (
              <div key={index} className="overflow-hidden rounded-xl border border-border">
                <Skeleton className="h-40 rounded-none" />
                <LineSkeletons lines={6} className="p-8" />
              </div>
            ))}
          </div>
        ) : !result.data && result.error ? (
          <LoadError error={result.error} onRetry={result.reload} />
        ) : groups.length ? (
          <div className="grid gap-6 pt-10 lg:grid-cols-2">
            {groups.map((group) => (
              <ServiceGroup key={group.number} group={group} />
            ))}
          </div>
        ) : (
          <p className="pt-10 text-sm text-muted-foreground">
            Our service details are being updated. Contact our team to discuss how we can help.
          </p>
        )}
      </div>
    </section>
  );
}

function ServiceGroup({ group }: { group: ServiceGroupData }) {
  return (
    <article className="overflow-hidden rounded-xl border border-border bg-background shadow-sm">
      <div className="border-b border-border bg-primary p-6 text-primary-foreground sm:p-8">
        <div className="mb-5 flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-accent">
            Service category
          </span>
          <span className="text-sm font-bold text-primary-foreground/60">{group.number}</span>
        </div>
        <h3 className="text-2xl font-bold tracking-[-0.025em] sm:text-3xl">{group.title}</h3>
        <p className="mt-3 max-w-xl text-sm font-medium leading-6 text-primary-foreground/80">
          {group.description}
        </p>
      </div>
      <div className="divide-y divide-border px-6 sm:px-8">
        {group.services.map((service) => {
          const Icon = serviceIcon(service.icon);
          return (
            <div key={service._id} className="grid gap-4 py-6 sm:grid-cols-[44px_1fr]">
              <span className="flex size-11 items-center justify-center rounded-lg bg-accent/10 text-accent">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <h4 className="text-base font-bold text-primary">{service.title}</h4>
                {service.image && (
                  <img
                    src={service.image.url}
                    alt={service.image.alt}
                    loading="lazy"
                    className="mt-3 aspect-[16/9] w-full rounded-lg object-cover"
                  />
                )}
                <RichText
                  html={service.description}
                  className={`${richTextClass} mt-2 font-medium leading-6 text-foreground/70 [&_p]:my-0`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </article>
  );
}
