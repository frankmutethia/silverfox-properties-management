import { ArrowRight, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import hero from "@/assets/ronnie-george-9gGvNWBeOq4-unsplash.jpg";
import PropertyListings from "@/components/PropertyListings";
import BlogSection from "@/components/BlogSection";
import Testimonials from "@/components/Testimonials";
import ServicesSection from "@/components/ServicesSection";
import Enquiries from "@/components/Enquiries";

export default function Home() {
  return (
    <main id="main-content" className="min-h-screen bg-background font-sans text-foreground">
      <header
        id="top"
        className="relative isolate -mt-20 overflow-hidden bg-brand-surface text-brand-surface-foreground"
      >
        <img
          src={hero}
          alt="Brick and white family home with a landscaped lawn on a quiet residential street"
          fetchPriority="high"
          className="absolute inset-0 -z-10 h-full w-full object-cover object-[72%_60%] sm:object-[60%_60%] lg:object-[50%_62%]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(0,29,53,0.4)_0%,rgba(0,29,53,0)_20%,rgba(0,29,53,0.1)_50%,rgba(0,29,53,0.7)_100%)] sm:bg-[linear-gradient(180deg,rgba(0,29,53,0.35)_0%,rgba(0,29,53,0)_16%),linear-gradient(90deg,rgba(0,29,53,0.62)_0%,rgba(0,29,53,0.28)_34%,rgba(0,29,53,0)_52%)]"
        />
        <div className="mx-auto flex h-[100svh] max-h-[920px] min-h-[620px] max-w-7xl items-end px-5 pb-[11vh] pt-28 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-[2.6rem] font-bold leading-[1.04] tracking-[-.045em] text-white [text-shadow:0_2px_24px_rgba(0,20,40,0.45)] sm:text-6xl lg:text-[4.25rem]">
              Welcome to
              <span className="block text-accent">
                Silverfox
                <br />
                Property Management
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-white [text-shadow:0_1px_12px_rgba(0,20,40,0.6)] sm:text-lg sm:leading-8">
              Your property partner in Kenya. We help buyers, sellers and owners{" "}
              <strong className="font-semibold text-white">
                find, buy, sell and manage property
              </strong>{" "}
              with confidence. Whether you're searching for a home, closing a deal or need
              dependable management, we're here to guide you.
            </p>
            <Button asChild variant="cyan" size="lg" className="mt-9 h-12 px-7">
              <a href="#properties">
                Explore properties <ArrowRight />
              </a>
            </Button>
          </div>
        </div>
      </header>

      <ServicesSection />
      <PropertyListings />
      <Enquiries />
      <BlogSection />
      <Testimonials />

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
