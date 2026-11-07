import { ArrowUpRight, ImageOff, MapPin } from "lucide-react";
import { propertyCategories, propertyPrice } from "@/lib/properties";
import type { ApiProperty } from "@/lib/types";
import PropertyFacts from "./PropertyFacts";

export default function PropertyCard({ property }: { property: ApiProperty }) {
  const photo = property.images[0];
  return (
    <article className="group min-w-0 overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-lg">
      <a
        href={`/properties/${property.slug}`}
        aria-label={`View ${property.name}`}
        className="block h-full focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ring"
      >
        <div className="relative aspect-[3/2] overflow-hidden bg-secondary">
          {photo ? (
            <img
              src={photo.url}
              alt={photo.alt}
              loading="lazy"
              style={{ objectPosition: photo.position ?? undefined }}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
          ) : (
            <ImageOff
              className="absolute inset-0 m-auto size-8 text-muted-foreground"
              aria-hidden="true"
            />
          )}
          <span className="absolute left-4 top-4 rounded-sm bg-background/95 px-3 py-1 text-xs font-semibold">
            {property.type}
          </span>
          {property.category && (
            <span className="absolute bottom-4 left-4 rounded bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
              {propertyCategories[property.category]}
            </span>
          )}
        </div>
        <div className="p-5">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-lg font-semibold text-primary">{property.name}</h3>
            <ArrowUpRight className="mt-1 size-5 shrink-0 text-accent" />
          </div>
          <p className="mb-4 mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
            <MapPin className="size-3.5 shrink-0" />
            {property.location ?? "Location to be confirmed"}
          </p>
          {property.bedrooms !== null ||
          property.bathrooms !== null ||
          property.areaSqm !== null ? (
            <PropertyFacts property={property} />
          ) : (
            <p className="border-y border-border py-3 text-xs text-muted-foreground">
              Specifications available on enquiry
            </p>
          )}
          <p className="my-4 line-clamp-2 text-sm leading-6 text-muted-foreground">
            {property.description}
          </p>
          {property.amenities.length > 0 && (
            <p className="mb-4 text-xs text-muted-foreground">{property.amenities.join(" · ")}</p>
          )}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="font-semibold text-primary">{propertyPrice(property)}</p>
            <span className="text-xs text-muted-foreground">{property.reference}</span>
          </div>
        </div>
      </a>
    </article>
  );
}
