import {
  ArrowRight,
  Building2,
  Check,
  FileCheck2,
  Handshake,
  KeyRound,
  Mail,
  MessageCircle,
  Phone,
  ScrollText,
  Search,
  ShieldCheck,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import kitchen from "@/assets/aaron-huber-G7sE2S4Lab4-unsplash.jpg";
import living from "@/assets/spacejoy-IH7wPsjwomc-unsplash.jpg";
import view from "@/assets/infinite-views-79NjpXDOJU8-unsplash.jpg";
import hero from "@/assets/tu-n-123-69K2AGQc_Yw-unsplash.jpg";
import PropertyListings from "@/components/PropertyListings";
import { whatsappUrl } from "@/lib/contact";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";

export default function Home() {
  return (
    <main id="main-content" className="min-h-screen bg-background font-sans text-foreground">
      <header
        id="top"
        className="relative overflow-hidden bg-brand-surface text-brand-surface-foreground"
      >
        <img
          src={hero}
          alt="Property professionals completing a real estate transaction beside a model home"
          fetchPriority="high"
          className="absolute inset-0 h-full w-full object-cover object-[58%_50%] sm:object-[55%_50%] lg:object-center"
        />
        <div className="absolute inset-0 bg-brand-surface/25" />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-surface via-brand-surface/90 to-brand-surface/25 sm:via-brand-surface/80 lg:from-brand-surface lg:via-brand-surface/75 lg:to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-surface/80 via-transparent to-brand-surface/20" />
        <div className="relative mx-auto flex min-h-[620px] max-w-7xl items-center px-5 py-16 sm:min-h-[650px] sm:py-20 lg:px-8">
          <div className="max-w-2xl">
            <p className="mb-7 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[.2em] text-white sm:text-xs">
              <span className="h-px w-10 bg-accent" />
              Property expertise. Personal service.
            </p>
            <h1 className="max-w-2xl text-5xl font-bold leading-[1.04] tracking-[-.045em] text-white sm:text-6xl lg:text-7xl">
              Property decisions,
              <span className="block text-accent">managed with confidence.</span>
            </h1>
            <p className="mt-7 max-w-xl text-base font-medium leading-7 text-white/90 sm:text-lg sm:leading-8">
              From property searches and due diligence to sales, transfers and tenancy management,
              Silverfox provides clear guidance at every stage.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Button asChild variant="cyan" size="lg" className="h-12">
                <a href="#properties">
                  Explore properties <ArrowRight />
                </a>
              </Button>
              <a
                href="#owners"
                className="inline-flex h-12 items-center gap-3 rounded-md border border-white/40 px-6 text-sm font-medium text-white transition-colors hover:bg-white/10"
              >
                Manage my property <ArrowRight className="size-4" />
              </a>
            </div>
            <div className="mt-12 grid max-w-2xl gap-3 border-t border-white/25 pt-6 text-xs font-semibold text-white/90 sm:grid-cols-3">
              <span>Purchase advisory</span>
              <span>Sales & transfer support</span>
              <span>Tenancy management</span>
            </div>
          </div>
        </div>
      </header>
      <div className="border-b border-border bg-card">
        <div className="mx-auto grid max-w-7xl divide-y divide-border md:grid-cols-3 md:divide-x md:divide-y-0">
          {[
            {
              icon: Building2,
              title: "Find your next home",
              copy: "Explore the Silverfox collection",
              href: "#properties",
            },
            {
              icon: ShieldCheck,
              title: "Care for your investment",
              copy: "Explore purchase and management services",
              href: "#management",
            },
            {
              icon: Wrench,
              title: "Feel supported at home",
              copy: "Connect with our property team",
              href: "#residents",
            },
          ].map(({ icon: Icon, title, copy, href }) => (
            <a
              key={href}
              href={href}
              className="group flex items-center gap-4 px-6 py-7 transition-colors hover:bg-secondary"
            >
              <Icon className="size-6 shrink-0 text-accent" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-primary">{title}</p>
                <p className="mt-1 text-xs text-muted-foreground">{copy}</p>
              </div>
              <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
            </a>
          ))}
        </div>
      </div>

      <PropertyListings />

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
          <div className="grid gap-6 pt-10 lg:grid-cols-2">
            <ServiceGroup
              number="01"
              title="Property Purchase Services"
              description="Professional support for clients buying or selling property, from the initial search through completion."
              services={[
                {
                  icon: Search,
                  title: "Property search & acquisition support",
                  copy: "Targeted property searches, shortlisting and buyer representation aligned with your requirements and investment priorities.",
                },
                {
                  icon: FileCheck2,
                  title: "Due diligence coordination",
                  copy: "Structured review and coordination of ownership, property and transaction documentation before a purchase proceeds.",
                },
                {
                  icon: Handshake,
                  title: "Buyer & seller representation",
                  copy: "Professional representation for property sales and purchases, with clear coordination between the parties throughout the transaction.",
                },
                {
                  icon: ScrollText,
                  title: "Agreements & transfer support",
                  copy: "Drafting and coordination of sale and lease agreements, together with practical assistance during the property transfer process.",
                },
              ]}
            />
            <ServiceGroup
              number="02"
              title="Property Management Services"
              description="Consistent administration and oversight designed to protect the property and support effective tenancies."
              services={[
                {
                  icon: KeyRound,
                  title: "Tenancy agreement administration",
                  copy: "Preparation and administration of tenancy agreements, renewals and the records required for a clear landlord–tenant relationship.",
                },
                {
                  icon: ShieldCheck,
                  title: "Tenancy notices & transitions",
                  copy: "Preparation and coordination of tenancy and eviction notices, with attention to agreed terms and the applicable process.",
                },
                {
                  icon: Building2,
                  title: "Property & resident oversight",
                  copy: "A dependable point of contact for occupancy matters, resident communication and the routine administration of managed properties.",
                },
                {
                  icon: Wrench,
                  title: "Maintenance coordination",
                  copy: "Timely coordination of maintenance needs and service providers to help preserve condition, usability and long-term property value.",
                },
              ]}
            />
          </div>
        </div>
      </section>

      <section id="owners" className="bg-brand-surface text-brand-surface-foreground">
        <div className="mx-auto grid max-w-7xl md:grid-cols-[2fr_3fr]">
          <div className="relative order-2 h-52 overflow-hidden sm:h-64 md:order-1 md:h-auto">
            <img
              src={living}
              alt="Warm modern living room with plants"
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover object-[50%_65%]"
            />
          </div>
          <div className="order-1 flex items-center px-5 py-12 sm:px-8 md:order-2 md:px-10 lg:px-12 lg:py-16">
            <div className="max-w-xl">
              <p className="mb-3 text-xs font-bold uppercase text-accent">For property owners</p>
              <h2 className="text-3xl font-bold leading-tight tracking-[-0.025em] sm:text-4xl">
                Confidence in every detail.
              </h2>
              <p className="mt-4 text-sm font-medium leading-7 text-brand-surface-foreground/85">
                Your property deserves attentive management and clear communication. We provide a
                dependable point of contact for the work that protects your investment.
              </p>
              <ul className="mt-5 grid gap-x-5 gap-y-3 text-sm sm:grid-cols-2">
                {[
                  "Property oversight",
                  "Maintenance coordination",
                  "Resident communication",
                  "Clear reporting",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <Check className="size-4 shrink-0 text-accent" />
                    {item}
                  </li>
                ))}
              </ul>
              <Button variant="cyan" size="lg" asChild className="mt-6">
                <a href="#contact">
                  Discuss your property <ArrowRight />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section id="residents" className="py-16 lg:py-20">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 lg:grid-cols-12 lg:items-center lg:px-8">
          <div className="lg:col-span-5">
            <p className="mb-5 text-xs font-bold uppercase tracking-[0.18em] text-accent">
              For residents
            </p>
            <h2 className="text-4xl font-bold tracking-[-0.035em] text-primary sm:text-5xl">
              A home supported with care.
            </h2>
            <p className="mt-6 max-w-md font-medium leading-7 text-foreground/75">
              Good management should feel simple: clear communication, considerate service, and help
              when you need it.
            </p>
            <Button variant="brand" size="lg" asChild className="mt-8">
              <a href="#contact">
                Contact the team <ArrowRight />
              </a>
            </Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
            <img
              src={view}
              alt="Light-filled living room with city view"
              loading="lazy"
              className="aspect-[4/3] w-full rounded-sm object-cover sm:aspect-[4/5]"
            />
            <img
              src={kitchen}
              alt="Carefully maintained contemporary kitchen"
              loading="lazy"
              className="aspect-[4/3] w-full rounded-sm object-cover sm:mt-12 sm:aspect-[4/5]"
            />
          </div>
        </div>
      </section>

      <section id="contact" className="border-t border-border bg-secondary py-16 lg:py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 lg:grid-cols-[1.2fr_1fr] lg:px-8">
          <div>
            <p className="mb-5 text-xs font-bold uppercase tracking-[.18em] text-accent">
              Your next chapter
            </p>
            <h2 className="max-w-xl text-4xl font-bold leading-tight tracking-[-0.035em] text-primary sm:text-5xl">
              Let’s talk about
              <br />
              <span className="text-accent">your property.</span>
            </h2>
            <p className="mt-5 max-w-md text-sm font-medium leading-7 text-foreground/75">
              Looking for a home or a dependable management partner? Tell us what matters to you.
              We’ll help you take the next step.
            </p>
          </div>
          <div className="min-w-0 divide-y divide-border border-y border-border">
            <a
              href={whatsappUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-5 py-7"
            >
              <span className="rounded-full bg-emerald-700 p-4 text-white">
                <MessageCircle className="size-5" aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-xs text-muted-foreground">
                  An enquiry starts with hello
                </span>
                <span className="mt-2 block text-xl font-semibold text-primary">
                  Chat on WhatsApp
                </span>
                <span className="mt-1 block text-sm text-muted-foreground">+254 701 507570</span>
              </span>
              <ArrowRight className="size-5 shrink-0 text-primary transition-transform group-hover:translate-x-1" />
            </a>
            <a href="tel:+254701507570" className="group flex items-center gap-5 py-7">
              <span className="rounded-full bg-card p-4 text-accent">
                <Phone className="size-5" />
              </span>
              <span className="flex-1">
                <span className="block text-xs text-muted-foreground">Speak with our team</span>
                <span className="mt-2 block text-xl font-semibold text-primary">0701 507570</span>
              </span>
              <ArrowRight className="size-5 text-primary transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href="mailto:Info@silverfoxpropertymanagement.co.ke"
              className="group flex min-w-0 items-center gap-5 py-7"
            >
              <span className="rounded-full bg-card p-4 text-accent">
                <Mail className="size-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-xs text-muted-foreground">Start a conversation</span>
                <span className="mt-2 block break-words text-sm font-semibold text-primary">
                  Info@silverfoxpropertymanagement.co.ke
                </span>
              </span>
              <ArrowRight className="size-5 shrink-0 text-primary transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        </div>
      </section>
      <FloatingWhatsApp />
    </main>
  );
}

interface ServiceItem {
  icon: LucideIcon;
  title: string;
  copy: string;
}

function ServiceGroup({
  number,
  title,
  description,
  services,
}: {
  number: string;
  title: string;
  description: string;
  services: ServiceItem[];
}) {
  return (
    <article className="overflow-hidden rounded-xl border border-border bg-background shadow-sm">
      <div className="border-b border-border bg-primary p-6 text-primary-foreground sm:p-8">
        <div className="mb-5 flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-accent">
            Service category
          </span>
          <span className="text-sm font-bold text-primary-foreground/60">{number}</span>
        </div>
        <h3 className="text-2xl font-bold tracking-[-0.025em] sm:text-3xl">{title}</h3>
        <p className="mt-3 max-w-xl text-sm font-medium leading-6 text-primary-foreground/80">
          {description}
        </p>
      </div>
      <div className="divide-y divide-border px-6 sm:px-8">
        {services.map(({ icon: Icon, title: serviceTitle, copy }) => (
          <div key={serviceTitle} className="grid gap-4 py-6 sm:grid-cols-[44px_1fr]">
            <span className="flex size-11 items-center justify-center rounded-lg bg-accent/10 text-accent">
              <Icon className="size-5" aria-hidden="true" />
            </span>
            <div>
              <h4 className="text-base font-bold text-primary">{serviceTitle}</h4>
              <p className="mt-2 text-sm font-medium leading-6 text-foreground/70">{copy}</p>
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}
