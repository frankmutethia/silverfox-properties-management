import { useEffect } from "react";
import { ArrowLeft, Check, Mail, MapPin, Phone } from "lucide-react";
import { type Property, propertyPrice } from "@/data/properties";
import { Button } from "@/components/ui/button";
import PropertyFacts from "@/components/PropertyFacts";
import PropertyGallery from "@/components/PropertyGallery";

export default function PropertyDetail({ property }: { property: Property }) {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = `${property.name} | Silverfox Property Management`;
    return () => {
      document.title = previousTitle;
    };
  }, [property.name]);
  const enquiry = `mailto:Info@silverfoxpropertymanagement.co.ke?subject=${encodeURIComponent(`Property enquiry: ${property.name} (${property.reference})`)}&body=${encodeURIComponent(`Hello Silverfox,\n\nI would like more information about ${property.name} (${property.reference}), including its location, price, availability and viewing arrangements.\n\nThank you.`)}`;
  return (
    <main id="main-content" className="mx-auto max-w-7xl px-5 pb-20 pt-8 lg:px-8">
      <a
        href="/#properties"
        className="inline-flex min-h-11 items-center gap-2 text-sm text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="size-4" />
        All properties
      </a>
      <div className="flex flex-wrap items-end justify-between gap-4 py-8">
        <div>
          <p className="mb-3 text-xs font-semibold uppercase text-muted-foreground">
            {property.type} / {property.reference}
          </p>
          <h1 className="font-serif text-4xl text-primary sm:text-5xl">{property.name}</h1>
          <p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="size-4" />
            {property.location ?? "Location to be confirmed"}
          </p>
        </div>
        <p className="text-xl font-semibold text-primary">{propertyPrice(property)}</p>
      </div>
      <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0">
          <PropertyGallery property={property} />
          <nav
            aria-label="Property sections"
            className="my-8 flex flex-wrap gap-x-6 gap-y-3 border-y border-border py-4 text-sm font-medium"
          >
            <a href="#overview" className="inline-flex min-h-10 items-center hover:text-accent">
              Overview
            </a>
            <a
              href="#specifications"
              className="inline-flex min-h-10 items-center hover:text-accent"
            >
              Specifications
            </a>
            <a href="#amenities" className="inline-flex min-h-10 items-center hover:text-accent">
              Amenities
            </a>
            <a href="#location" className="inline-flex min-h-10 items-center hover:text-accent">
              Location
            </a>
          </nav>
          <section id="overview">
            <h2 className="font-serif text-3xl text-primary">About this property</h2>
            <p className="mt-4 max-w-3xl leading-7 text-muted-foreground">{property.description}</p>
          </section>
          <section id="specifications" className="mt-10">
            <h2 className="mb-5 font-serif text-3xl text-primary">The details</h2>
            <PropertyFacts property={property} />
            <dl className="grid gap-5 py-6 sm:grid-cols-2">
              <div>
                <dt className="text-sm text-muted-foreground">Property type</dt>
                <dd className="mt-1 font-medium">{property.type}</dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">Price</dt>
                <dd className="mt-1 font-medium">{propertyPrice(property)}</dd>
              </div>
            </dl>
          </section>
          <section id="amenities" className="mt-5 border-t border-border pt-8">
            <h2 className="font-serif text-3xl text-primary">Amenities & features</h2>
            {property.amenities.length ? (
              <ul className="mt-5 grid gap-4 sm:grid-cols-2">
                {property.amenities.map((amenity) => (
                  <li key={amenity} className="flex items-center gap-2 text-sm">
                    <Check className="size-4 text-accent" />
                    {amenity}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 leading-7 text-muted-foreground">
                To be confirmed. Please contact our team for the verified list of amenities and
                services available at this property.
              </p>
            )}
          </section>
          <section id="location" className="mt-10 border-t border-border pt-8">
            <h2 className="font-serif text-3xl text-primary">The neighbourhood</h2>
            <p className="mt-4 flex items-center gap-2">
              <MapPin className="size-4 text-accent" />
              {property.location ?? "Location to be confirmed"}
            </p>
            {!property.location && (
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Request the exact location and viewing directions from our team.
              </p>
            )}
          </section>
        </div>
        <aside
          className="border-t-2 border-accent pt-6 lg:sticky lg:top-28"
          aria-label="Property enquiry"
        >
          <p className="text-xs font-semibold uppercase text-muted-foreground">Your next home</p>
          <h2 className="mt-3 font-serif text-3xl text-primary">Let's take a closer look.</h2>
          <p className="mt-4 text-sm leading-6 text-muted-foreground">
            Ask about availability, confirmed specifications or arrange a viewing with our team.
          </p>
          <Button asChild size="lg" className="mt-6 w-full">
            <a href={enquiry}>
              <Mail />
              Enquire about this property
            </a>
          </Button>
          <Button asChild size="lg" variant="outline" className="mt-3 w-full">
            <a href="tel:+254701507570">
              <Phone />
              0701 507570
            </a>
          </Button>
          <a
            href={enquiry}
            className="mt-3 flex min-h-10 items-center break-words text-sm text-muted-foreground hover:text-primary"
          >
            Info@silverfoxpropertymanagement.co.ke
          </a>
          <p className="mt-6 border-t border-border pt-4 text-xs text-muted-foreground">
            Property reference: {property.reference}
          </p>
        </aside>
      </div>
    </main>
  );
}
