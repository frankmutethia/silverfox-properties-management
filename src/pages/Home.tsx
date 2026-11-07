import {
  ArrowRight,
  Building2,
  Check,
  Mail,
  MessageCircle,
  Phone,
  ShieldCheck,
  Wrench,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import kitchen from "@/assets/aaron-huber-G7sE2S4Lab4-unsplash.jpg";
import living from "@/assets/spacejoy-IH7wPsjwomc-unsplash.jpg";
import view from "@/assets/infinite-views-79NjpXDOJU8-unsplash.jpg";
import hero from "@/assets/tu-n-123-69K2AGQc_Yw-unsplash.jpg";
import PropertyListings from "@/components/PropertyListings";
import { whatsappUrl } from "@/lib/contact";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import BlogSection from "@/components/BlogSection";
import Testimonials from "@/components/Testimonials";
import ServicesSection from "@/components/ServicesSection";

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
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,29,53,0.90)_0%,rgba(0,29,53,0.68)_38%,rgba(0,29,53,0.12)_72%,transparent_100%)] max-sm:bg-[linear-gradient(90deg,rgba(0,29,53,0.88),rgba(0,29,53,0.45))]"
        />
        <div className="relative mx-auto flex min-h-[480px] max-w-7xl items-center px-5 py-16 sm:min-h-[540px] lg:min-h-[580px] lg:px-8">
          <div className="max-w-lg">
            <h1 className="text-5xl font-semibold leading-[1.08] tracking-[-.04em] text-white sm:text-6xl lg:text-7xl">
              Your property.
              <span className="block">Our priority.</span>
            </h1>
            <p className="mt-6 max-w-sm text-base leading-7 text-white/95 sm:text-lg">
              Buy, sell and manage property with a team you can rely on.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
              <Button asChild variant="cyan" size="lg" className="h-12">
                <a href="#properties">
                  Explore properties <ArrowRight />
                </a>
              </Button>
              <a
                href="#management"
                className="inline-flex min-h-12 items-center gap-2 text-sm font-semibold text-white underline decoration-white/50 underline-offset-8 transition-colors hover:decoration-white"
              >
                Our services <ArrowRight className="size-4" />
              </a>
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

      <ServicesSection />
      <BlogSection />
      <Testimonials />

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
