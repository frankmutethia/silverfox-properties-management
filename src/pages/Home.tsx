import { ArrowRight, Building2, Check, Mail, Phone, ShieldCheck, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import kitchen from "@/assets/aaron-huber-G7sE2S4Lab4-unsplash.jpg";
import living from "@/assets/spacejoy-IH7wPsjwomc-unsplash.jpg";
import view from "@/assets/infinite-views-79NjpXDOJU8-unsplash.jpg";
import PropertyListings from "@/components/PropertyListings";

export default function Home() {
  return (
    <main id="main-content" className="min-h-screen bg-background font-sans text-foreground">
      <header
        id="top"
        className="relative overflow-hidden bg-brand-surface text-brand-surface-foreground"
      >
        <img
          src={kitchen}
          alt="Bright contemporary kitchen with a large island and elegant pendant lighting"
          fetchPriority="high"
          className="absolute inset-0 h-full w-full object-cover object-[58%_50%] lg:left-[35%] lg:w-[65%] lg:object-[50%_52%]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-surface via-brand-surface/80 to-brand-surface/20 lg:from-35% lg:via-brand-surface/40 lg:via-60% lg:to-transparent" />
        <div className="relative mx-auto max-w-7xl px-5 py-16 sm:py-20 lg:px-8 lg:py-24">
          <p className="mb-7 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[.2em] text-white/85 sm:text-xs">
            <span className="h-px w-10 bg-accent" />
            Inspired spaces. Personal service.
          </p>
          <h1 className="max-w-xl text-5xl font-semibold leading-[1.08] tracking-[-.045em] text-white sm:text-6xl lg:text-7xl">
            Great places.
            <br />
            <span className="font-serif font-normal italic tracking-normal text-accent">
              Better living.
            </span>
          </h1>
          <p className="mt-7 max-w-md text-base leading-7 text-white/80">
            Discover a place to call home, and a property partner who cares. Thoughtful management
            for owners. A better everyday experience for residents.
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
          <div className="mt-12 flex max-w-xl flex-wrap gap-x-6 gap-y-3 border-t border-white/20 pt-6 text-xs text-white/80">
            <span>Residential property management</span>
            <span>Owner-focused oversight</span>
            <span>Resident support</span>
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
              copy: "Discover our approach to management",
              href: "#owners",
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
          <div className="grid gap-10 border-b border-border pb-8 lg:grid-cols-[1fr_.75fr] lg:items-end">
            <div>
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-accent">
                How we manage
              </p>
              <h2 className="font-serif text-4xl text-primary sm:text-5xl">
                Care that protects value.
              </h2>
            </div>
            <p className="border-l-2 border-accent/40 pl-6 leading-7 text-muted-foreground">
              From daily communication to long-term planning, we look after the details that keep
              properties performing and people feeling at home.
            </p>
          </div>
          <div className="grid gap-6 pt-8 md:grid-cols-3">
            {[
              [
                ShieldCheck,
                "01",
                "Thoughtful stewardship",
                "Clear oversight and consistent care shaped around each property and owner.",
              ],
              [
                Wrench,
                "02",
                "Proactive maintenance",
                "Routine attention and timely coordination help prevent small issues becoming costly ones.",
              ],
              [
                Building2,
                "03",
                "Resident experience",
                "Responsive, respectful support creates better tenancies and well-cared-for homes.",
              ],
            ].map(([Icon, number, title, copy]) => {
              const ServiceIcon = Icon as typeof ShieldCheck;
              return (
                <article
                  key={String(number)}
                  className="rounded-lg border border-border bg-background p-7"
                >
                  <div className="mb-7 flex items-center justify-between">
                    <ServiceIcon className="size-5 text-accent" />
                    <span className="font-serif text-2xl text-primary/30">{String(number)}</span>
                  </div>
                  <h3 className="mb-3 text-lg font-semibold text-primary">{String(title)}</h3>
                  <p className="text-sm leading-6 text-muted-foreground">{String(copy)}</p>
                </article>
              );
            })}
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
              <h2 className="font-serif text-3xl leading-tight sm:text-4xl">
                Confidence in every detail.
              </h2>
              <p className="mt-4 text-sm leading-6 text-brand-surface-foreground/80">
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
            <h2 className="font-serif text-4xl text-primary sm:text-5xl">
              A home supported with care.
            </h2>
            <p className="mt-6 max-w-md leading-7 text-muted-foreground">
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
            <h2 className="max-w-xl font-serif text-4xl leading-tight text-primary sm:text-5xl">
              Let’s talk about
              <br />
              <span className="italic">your property.</span>
            </h2>
            <p className="mt-5 max-w-md text-sm leading-7 text-muted-foreground">
              Looking for a home or a dependable management partner? Tell us what matters to you.
              We’ll help you take the next step.
            </p>
          </div>
          <div className="min-w-0 divide-y divide-border border-y border-border">
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
    </main>
  );
}
