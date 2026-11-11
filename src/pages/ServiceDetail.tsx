import { useEffect } from "react";
import { ArrowRight, ChevronRight, Mail, MessageSquareText, Phone } from "lucide-react";
import { contactEmail, phoneDisplay, phoneHref } from "@/lib/contact";
import { articleTextClass } from "@/lib/rich-text";
import { serviceIcon, serviceSummary } from "@/lib/services";
import type { ServiceWithPhoto } from "@/lib/service-photos";
import { Button } from "@/components/ui/button";
import RichText from "@/components/RichText";
import ServiceCard from "@/components/ServiceCard";
import Enquiries from "@/components/Enquiries";

/**
 * A service's own page: a branded header with the photo, the full write-up beside a
 * "talk to our team" card, other services, then the enquiry form just before the footer.
 */
export default function ServiceDetail({
  card,
  others,
}: {
  card: ServiceWithPhoto;
  /** Other published services, already paired with their photos. */
  others: ServiceWithPhoto[];
}) {
  const { service, photo, uploaded } = card;
  const Icon = serviceIcon(service.icon);
  const category = String(service.category || "").trim();
  const summary = serviceSummary(service);
  useEffect(() => {
    const previous = document.title;
    document.title = `${service.title} | Silverfox Property Management`;
    return () => {
      document.title = previous;
    };
  }, [service.title]);

  return (
    <main id="main-content" className="bg-background">
      {/* Header band */}
      <header className="relative isolate overflow-hidden bg-brand-surface text-white">
        <div
          aria-hidden="true"
          className="absolute -right-32 -top-32 -z-10 size-[28rem] rounded-full bg-accent/20 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-40 left-1/3 -z-10 size-[24rem] rounded-full bg-white/5 blur-3xl"
        />
        <div className="mx-auto max-w-7xl px-5 pb-14 pt-8 lg:px-8 lg:pb-20">
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-1.5 text-sm text-white/70">
              <li className="flex items-center gap-1.5">
                <a href="/" className="hover:text-white">
                  Home
                </a>
                <ChevronRight className="size-3.5" aria-hidden="true" />
              </li>
              <li className="flex items-center gap-1.5">
                <a href="/#management" className="hover:text-white">
                  Services
                </a>
                <ChevronRight className="size-3.5" aria-hidden="true" />
              </li>
              <li aria-current="page" className="max-w-[16rem] truncate text-white">
                {service.title}
              </li>
            </ol>
          </nav>
          <div className="mt-10 grid items-center gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-14">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="flex size-11 items-center justify-center rounded-xl bg-white/10 text-accent ring-1 ring-white/15">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                {category && (
                  <span className="rounded-full bg-accent/15 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-accent">
                    {category}
                  </span>
                )}
              </div>
              <h1 className="mt-6 text-4xl font-bold leading-[1.08] tracking-[-0.035em] sm:text-5xl lg:text-[3.5rem]">
                {service.title}
              </h1>
              {summary && (
                <p className="mt-5 line-clamp-3 max-w-xl text-base leading-7 text-white/80 sm:text-lg sm:leading-8">
                  {summary}
                </p>
              )}
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild variant="cyan" size="lg" className="h-12 px-6">
                  <a href="#enquiries">
                    Enquire about this service <ArrowRight />
                  </a>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="h-12 border-white/30 bg-white/5 px-6 text-white hover:bg-white/15 hover:text-white"
                >
                  <a href={phoneHref}>
                    <Phone /> Call {phoneDisplay}
                  </a>
                </Button>
              </div>
            </div>
            <div className="relative">
              <div
                aria-hidden="true"
                className="absolute -inset-3 -z-10 rounded-[1.75rem] bg-gradient-to-br from-accent/40 to-transparent opacity-60"
              />
              <img
                src={photo}
                alt={uploaded ? (service.image?.alt ?? "") : ""}
                fetchPriority="high"
                className="aspect-[4/3] w-full rounded-2xl object-cover shadow-2xl ring-1 ring-white/10"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Write-up and contact card */}
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-14 lg:px-8 lg:py-20">
        <article className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">
            About this service
          </p>
          <RichText
            images
            html={service.description}
            className={`${articleTextClass} mt-2 max-w-3xl text-[1.0625rem] [&>*:first-child]:mt-4 [&_strong]:text-primary [&_ul>li]:my-2 [&_ul>li]:pl-1 [&_li::marker]:text-accent`}
          />
        </article>
        <aside className="lg:pt-8">
          <div className="sticky top-28 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
            <div className="bg-secondary/70 p-6">
              <span className="flex size-11 items-center justify-center rounded-xl bg-accent/15 text-accent">
                <MessageSquareText className="size-5" aria-hidden="true" />
              </span>
              <h2 className="mt-4 text-lg font-semibold text-primary">Talk to our team</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Questions about {service.title.toLowerCase()}? Send an enquiry and we&apos;ll get
                back to you.
              </p>
              <Button asChild className="mt-5 w-full">
                <a href="#enquiries">
                  Send an enquiry <ArrowRight />
                </a>
              </Button>
            </div>
            <ul className="divide-y divide-border text-sm">
              <li>
                <a
                  href={phoneHref}
                  className="flex items-center gap-3 px-6 py-4 transition-colors hover:bg-secondary/50"
                >
                  <Phone className="size-4 shrink-0 text-accent" aria-hidden="true" />
                  <span>
                    <span className="block text-xs text-muted-foreground">Call us</span>
                    <span className="font-semibold text-primary">{phoneDisplay}</span>
                  </span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${contactEmail}`}
                  className="flex items-center gap-3 px-6 py-4 transition-colors hover:bg-secondary/50"
                >
                  <Mail className="size-4 shrink-0 text-accent" aria-hidden="true" />
                  <span className="min-w-0">
                    <span className="block text-xs text-muted-foreground">Email us</span>
                    <span className="block font-semibold text-primary">
                      {/* Wrap only after the @, never mid-word. */}
                      {contactEmail.split("@")[0]}@<wbr />
                      {contactEmail.split("@")[1]}
                    </span>
                  </span>
                </a>
              </li>
            </ul>
          </div>
        </aside>
      </div>

      {others.length > 0 && (
        <section aria-labelledby="other-services" className="bg-secondary/60 py-14 lg:py-20">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">
                  Explore more
                </p>
                <h2
                  id="other-services"
                  className="mt-2 text-3xl font-bold tracking-[-0.03em] text-primary"
                >
                  Other services
                </h2>
              </div>
              <a
                href="/#management"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-accent"
              >
                View all services <ArrowRight className="size-4" aria-hidden="true" />
              </a>
            </div>
            <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {others.slice(0, 3).map((item) => (
                <li key={item.service._id} className="flex">
                  <ServiceCard card={item} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <Enquiries
        heading={`Interested in ${service.title}?`}
        intro="Send us a few details and our team will get back to you about this service."
        defaultMessage={`Hello, I would like to know more about ${service.title}.`}
      />
    </main>
  );
}
