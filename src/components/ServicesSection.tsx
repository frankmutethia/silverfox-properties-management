import { getPublishedServices } from "@/lib/services";
import { withPhotos } from "@/lib/service-photos";
import { useQuery } from "@/lib/use-query";
import { Skeleton } from "@/components/ui/skeleton";
import { LoadError } from "./QueryState";
import ServiceCard from "./ServiceCard";

// Few services are centred at a comfortable reading width instead of hugging the left edge.
function gridFor(count: number) {
  if (count === 1) return "mx-auto max-w-xl";
  if (count === 2) return "mx-auto max-w-5xl sm:grid-cols-2";
  return "sm:grid-cols-2 lg:grid-cols-3";
}

export default function ServicesSection() {
  const result = useQuery((signal) => getPublishedServices(signal), []);
  const cards = withPhotos(result.data ?? []);
  return (
    <section id="management" className="bg-secondary/60 py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-block rounded-full border border-border bg-card px-4 py-1.5 text-xs font-semibold text-primary shadow-sm">
            Services
          </span>
          <h2 className="mt-5 text-4xl font-bold tracking-[-0.035em] text-primary sm:text-5xl">
            Services we offer
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-base leading-7 text-foreground/70">
            Support for buyers, sellers and property owners at every stage.
          </p>
        </div>

        {!result.data && result.loading ? (
          <div
            className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            aria-busy="true"
            aria-label="Loading services"
          >
            {[0, 1, 2].map((index) => (
              <Skeleton key={index} className="h-[400px] rounded-2xl" />
            ))}
          </div>
        ) : !result.data && result.error ? (
          <div className="mt-12">
            <LoadError error={result.error} onRetry={result.reload} />
          </div>
        ) : cards.length ? (
          <ul className={`mt-12 grid gap-6 ${gridFor(cards.length)}`}>
            {cards.map((card) => (
              <li key={card.service._id} className="flex">
                <ServiceCard card={card} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-12 text-center text-sm text-muted-foreground">
            Our service details are being updated. Contact our team to discuss how we can help.
          </p>
        )}
      </div>
    </section>
  );
}
