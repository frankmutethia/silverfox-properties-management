import { ArrowRight } from "lucide-react";
import buildingFacade from "@/assets/services/building-facade.jpg";
import greenResidence from "@/assets/services/green-residence.jpg";
import realEstate from "@/assets/precondo-ca-QHDFm084RNk-unsplash.jpg";
import keys from "@/assets/jakub-zerdzicki-bqUZEAeWuok-unsplash.jpg";
import kitchen from "@/assets/aaron-huber-G7sE2S4Lab4-unsplash.jpg";
import cityLiving from "@/assets/infinite-views-79NjpXDOJU8-unsplash.jpg";
import livingRoom from "@/assets/spacejoy-IH7wPsjwomc-unsplash.jpg";
import { getPublishedServices, serviceIcon } from "@/lib/services";
import { richTextClass } from "@/lib/rich-text";
import type { ApiService } from "@/lib/types";
import { useQuery } from "@/lib/use-query";
import { Skeleton } from "@/components/ui/skeleton";
import { LoadError } from "./QueryState";
import RichText from "./RichText";

// Services without an uploaded photo get a fitting site photo. Each service first gets the
// photo matching its icon; the rest get an unused photo, and if every photo is taken, the one
// used furthest away in the grid, so neighbouring cards never share a picture.
const PHOTOS = [buildingFacade, realEstate, greenResidence, keys, livingRoom, kitchen, cityLiving];
const PHOTO_FOR_ICON: Record<string, string> = {
  Search: buildingFacade,
  FileCheck2: realEstate,
  Handshake: cityLiving,
  KeyRound: keys,
  ShieldCheck: livingRoom,
  Building2: greenResidence,
  Wrench: kitchen,
};

type Card = { service: ApiService; photo: string; uploaded: boolean };

function withPhotos(services: ApiService[]): Card[] {
  const photos: (string | undefined)[] = services.map((service) => service.image?.url);
  const usedAt = new Map<string, number>();
  services.forEach((service, index) => {
    const match = service.icon ? PHOTO_FOR_ICON[service.icon] : undefined;
    if (!photos[index] && match && !usedAt.has(match)) {
      photos[index] = match;
      usedAt.set(match, index);
    }
  });
  services.forEach((_, index) => {
    if (photos[index]) return;
    const photo =
      PHOTOS.find((candidate) => !usedAt.has(candidate)) ??
      [...PHOTOS].sort(
        (a, b) => Math.abs(index - (usedAt.get(b) ?? 0)) - Math.abs(index - (usedAt.get(a) ?? 0)),
      )[0]!;
    photos[index] = photo;
    usedAt.set(photo, index);
  });
  return services.map((service, index) => ({
    service,
    photo: photos[index]!,
    uploaded: Boolean(service.image),
  }));
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
              <Skeleton key={index} className="h-[420px] rounded-2xl" />
            ))}
          </div>
        ) : !result.data && result.error ? (
          <div className="mt-12">
            <LoadError error={result.error} onRetry={result.reload} />
          </div>
        ) : cards.length ? (
          <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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

function ServiceCard({ card }: { card: Card }) {
  const { service, photo, uploaded } = card;
  const Icon = serviceIcon(service.icon);
  const category = String(service.category || "");
  return (
    <article className="group flex w-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow hover:shadow-lg">
      <div className="relative aspect-[16/10] shrink-0 overflow-hidden bg-secondary">
        <img
          src={photo}
          alt={uploaded ? (service.image?.alt ?? "") : ""}
          loading="lazy"
          className="absolute inset-0 size-full object-cover transition-transform duration-500 motion-safe:group-hover:scale-105"
        />
        <span className="absolute left-4 top-4 flex size-10 items-center justify-center rounded-xl bg-card/95 text-accent shadow-sm backdrop-blur">
          <Icon className="size-5" aria-hidden="true" />
        </span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        {category && (
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-accent">
            {category.replace(/ services$/i, "")}
          </p>
        )}
        <h3 className="mt-2 text-xl font-semibold tracking-[-0.02em] text-primary">
          {service.title}
        </h3>
        <RichText
          images={false}
          html={service.description}
          className={`${richTextClass} mt-3 text-sm leading-6 text-foreground/70 [&_p]:my-0`}
        />
        <a
          href="#enquiries"
          className="mt-auto inline-flex items-center gap-1.5 self-start pt-5 text-sm font-semibold text-primary underline-offset-4 hover:text-accent hover:underline"
        >
          Enquire<span className="sr-only"> about {service.title}</span>
          <ArrowRight
            className="size-4 transition-transform group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </a>
      </div>
    </article>
  );
}
