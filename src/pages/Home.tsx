import { ArrowRight, Building2, Check, Mail, Phone, ShieldCheck, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import kitchen from "@/assets/aaron-huber-G7sE2S4Lab4-unsplash.jpg";
import living from "@/assets/spacejoy-IH7wPsjwomc-unsplash.jpg";
import view from "@/assets/infinite-views-79NjpXDOJU8-unsplash.jpg";
import PropertyListings from "@/components/PropertyListings";

export default function Home() {
  return (
    <main id="main-content" className="min-h-screen bg-background text-foreground">
      <header id="top" className="pb-16 pt-14 lg:pb-24 lg:pt-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <p className="mb-6 text-xs font-bold uppercase tracking-[0.18em] text-accent">
            Property care, thoughtfully delivered
          </p>
          <div className="grid items-end gap-10 lg:grid-cols-[1.45fr_.75fr]">
            <h1 className="max-w-4xl font-serif text-5xl leading-[1.02] text-primary sm:text-6xl lg:text-8xl">
              A better standard of <span className="italic text-accent">property care.</span>
            </h1>
            <p className="max-w-lg text-base leading-7 text-muted-foreground lg:pb-2 lg:text-lg">
              Silverfox brings owners and residents together through responsive management,
              considered maintenance, and a genuine respect for every home.
            </p>
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <Button variant="brand" size="lg" asChild>
              <a href="#properties">
                Explore properties <ArrowRight />
              </a>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <a href="#contact">Talk to our team</a>
            </Button>
          </div>
        </div>
        <div className="mx-auto mt-14 max-w-[1480px] px-0 sm:px-5">
          <img
            src={kitchen}
            alt="Bright contemporary kitchen with island"
            className="h-[47vh] min-h-96 w-full object-cover sm:rounded-md lg:h-[62vh]"
          />
        </div>
      </header>

      <PropertyListings />

      <section id="management" className="bg-card py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="grid gap-10 border-b border-border pb-14 lg:grid-cols-[1fr_.75fr] lg:items-end">
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
          <div className="grid gap-10 pt-14 md:grid-cols-3">
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
                <article key={String(number)} className="border-t border-border pt-6">
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
          <div className="order-1 flex items-center px-5 py-9 sm:px-8 md:order-2 md:px-10 lg:px-12 lg:py-12">
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

      <section id="residents" className="py-20 lg:py-28">
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
              className="aspect-[4/5] w-full rounded-sm object-cover"
            />
            <img
              src={kitchen}
              alt="Carefully maintained contemporary kitchen"
              loading="lazy"
              className="aspect-[4/5] w-full rounded-sm object-cover sm:mt-12"
            />
          </div>
        </div>
      </section>

      <section id="contact" className="bg-secondary py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-5 text-center lg:px-8">
          <p className="mb-5 text-xs font-bold uppercase tracking-[0.18em] text-accent">
            Start a conversation
          </p>
          <h2 className="mx-auto max-w-3xl font-serif text-4xl text-primary sm:text-6xl">
            Property management, made more personal.
          </h2>
          <p className="mx-auto mt-6 max-w-xl leading-7 text-muted-foreground">
            Whether you own a property or are looking for a place to call home, we would be pleased
            to hear from you.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Button variant="brand" size="lg" asChild>
              <a href="mailto:Info@silverfoxpropertymanagement.co.ke">
                <Mail />
                Email us
              </a>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <a href="tel:+254701507570">
                <Phone />
                Call us
              </a>
            </Button>
          </div>
          <div className="mt-6 flex flex-col items-center justify-center gap-2 text-sm text-muted-foreground sm:flex-row sm:gap-6">
            <a
              href="mailto:Info@silverfoxpropertymanagement.co.ke"
              className="max-w-full break-words transition-colors hover:text-foreground"
            >
              Info@silverfoxpropertymanagement.co.ke
            </a>
            <a href="tel:+254701507570" className="transition-colors hover:text-foreground">
              0701 507570
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
