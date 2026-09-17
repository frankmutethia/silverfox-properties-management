import { useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { properties } from "@/data/properties";
import { Button } from "@/components/ui/button";
import PropertyCard from "./PropertyCard";

export default function PropertyListings() {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("");
  const [location, setLocation] = useState("");
  const locations = [
    ...new Set(
      properties
        .map((property) => property.location)
        .filter((value): value is string => value !== null),
    ),
  ];
  const filtered = properties.filter(
    (property) =>
      (!type || property.type === type) &&
      (!location || (property.location ?? "unconfirmed") === location) &&
      `${property.name} ${property.reference} ${property.location ?? ""} ${property.type}`
        .toLowerCase()
        .includes(query.trim().toLowerCase()),
  );
  const hasFilters = Boolean(query || type || location);
  function reset() {
    setQuery("");
    setType("");
    setLocation("");
  }
  return (
    <section id="properties" className="py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase text-accent">
              The Silverfox collection
            </p>
            <h2 className="font-serif text-4xl text-primary sm:text-5xl">A place to call home.</h2>
          </div>
          <p className="max-w-sm text-sm leading-6 text-muted-foreground">
            Explore our apartments and homes. Find a property that catches your eye, then talk to
            our team.
          </p>
        </div>
        <div className="grid gap-4 border-y border-border py-5 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr]">
          <label className="min-w-0 text-xs font-medium">
            Search properties
            <div className="relative mt-2">
              <Search className="absolute left-3 top-3 size-4 text-muted-foreground" />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Name, area or reference"
                className="h-10 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </label>
          <label className="min-w-0 text-xs font-medium">
            <span id="property-type-label">Property type</span>
            <select
              aria-labelledby="property-type-label"
              value={type}
              onChange={(event) => setType(event.target.value)}
              className="mt-2 h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus:ring-2 focus:ring-ring"
            >
              <option value="">All property types</option>
              <option>Apartment</option>
              <option>House</option>
            </select>
          </label>
          <label className="min-w-0 text-xs font-medium">
            <span id="property-location-label">Location</span>
            <select
              aria-labelledby="property-location-label"
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              className="mt-2 h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus:ring-2 focus:ring-ring"
            >
              <option value="">All locations</option>
              {locations.map((area) => (
                <option key={area}>{area}</option>
              ))}
              {properties.some((property) => !property.location) && (
                <option value="unconfirmed">Location to be confirmed</option>
              )}
            </select>
          </label>
        </div>
        <div className="flex min-h-16 items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground" role="status">
            {filtered.length} {filtered.length === 1 ? "property" : "properties"}
          </p>
          {hasFilters && (
            <Button variant="ghost" size="sm" onClick={reset}>
              Clear filters
            </Button>
          )}
        </div>
        {filtered.length ? (
          <div className="grid items-stretch gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((property) => (
              <PropertyCard key={property.slug} property={property} />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center">
            <SlidersHorizontal className="mx-auto mb-4 size-6 text-muted-foreground" />
            <h3 className="text-xl font-semibold">No matching properties</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Try another name, property type or area.
            </p>
            <Button variant="outline" className="mt-5" onClick={reset}>
              Clear filters
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
