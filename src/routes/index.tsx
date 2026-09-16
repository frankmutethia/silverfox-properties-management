import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Building2, Check, ChevronDown, Menu, ShieldCheck, Wrench, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import logoAsset from "@/assets/silverfox-logo.jpg.asset.json";
import kitchenAsset from "@/assets/aaron-huber-G7sE2S4Lab4-unsplash.jpg.asset.json";
import livingAsset from "@/assets/spacejoy-IH7wPsjwomc-unsplash.jpg.asset.json";
import viewAsset from "@/assets/infinite-views-79NjpXDOJU8-unsplash.jpg.asset.json";
import houseOneAsset from "@/assets/ronnie-george-z11gbBo13ro-unsplash.jpg.asset.json";
import houseTwoAsset from "@/assets/ian-macdonald-W8z6aiwfi1E-unsplash.jpg.asset.json";
import houseThreeAsset from "@/assets/todd-kent-178j8tJrNlc-unsplash.jpg.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Silverfox Property Management | Homes, Well Managed" },
      { name: "description", content: "Discover attentive residential property management and homes cared for by Silverfox Property Management." },
      { property: "og:title", content: "Silverfox Property Management" },
      { property: "og:description", content: "Thoughtful property care for owners and residents." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const properties = [
  { image: houseOneAsset.url, title: "Garden Residence", label: "Single-family home" },
  { image: houseTwoAsset.url, title: "Classic Gabled Home", label: "Residential property" },
  { image: houseThreeAsset.url, title: "Veranda House", label: "Managed residence" },
];

function Index() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [location, setLocation] = useState("All locations");
  const [type, setType] = useState("All property types");

  const browse = () => document.querySelector("#properties")?.scrollIntoView({ behavior: "smooth" });

  return (
    <main className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <nav className="sticky top-0 z-50 border-b border-border/70 bg-background/90 backdrop-blur-xl" aria-label="Main navigation">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 lg:px-8">
          <a href="#top" aria-label="Silverfox Property Management home" className="shrink-0">
            <img src={logoAsset.url} alt="Silverfox Property Management" className="h-11 w-auto sm:h-12" />
          </a>
          <div className="hidden items-center gap-8 text-sm font-medium md:flex">
            <a href="#properties" className="transition-colors hover:text-accent">Properties</a>
            <a href="#management" className="transition-colors hover:text-accent">Management</a>
            <a href="#owners" className="transition-colors hover:text-accent">For owners</a>
            <a href="#contact" className="transition-colors hover:text-accent">Contact</a>
          </div>
          <div className="hidden items-center gap-3 md:flex">
            <Button variant="ghost" asChild><a href="#residents">Resident support</a></Button>
            <Button variant="brand" asChild><a href="#owners">Owner enquiry</a></Button>
          </div>
          <Button variant="ghost" size="icon" className="md:hidden" aria-label={menuOpen ? "Close menu" : "Open menu"} onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X /> : <Menu />}
          </Button>
        </div>
        {menuOpen && (
          <div className="border-t border-border bg-background px-5 py-5 md:hidden">
            <div className="flex flex-col gap-4 text-sm font-medium">
              {[['Properties', '#properties'], ['Management', '#management'], ['For owners', '#owners'], ['Resident support', '#residents'], ['Contact', '#contact']].map(([label, href]) => (
                <a key={href} href={href} onClick={() => setMenuOpen(false)}>{label}</a>
              ))}
            </div>
          </div>
        )}
      </nav>

      <header id="top" className="pb-16 pt-14 lg:pb-24 lg:pt-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <p className="mb-6 text-xs font-bold uppercase tracking-[0.18em] text-accent">Property care, thoughtfully delivered</p>
          <div className="grid items-end gap-10 lg:grid-cols-[1.45fr_.75fr]">
            <h1 className="max-w-4xl font-serif text-5xl leading-[1.02] text-primary sm:text-6xl lg:text-8xl">
              A better standard of <span className="italic text-accent">property care.</span>
            </h1>
            <p className="max-w-lg text-base leading-7 text-muted-foreground lg:pb-2 lg:text-lg">
              Silverfox brings owners and residents together through responsive management, considered maintenance, and a genuine respect for every home.
            </p>
          </div>

          <div className="relative z-10 mx-auto mt-12 grid max-w-4xl gap-1 rounded-md bg-card p-2 shadow-2xl ring-1 ring-border sm:grid-cols-[1fr_1fr_auto]">
            <label className="flex flex-col gap-1 border-b border-border px-4 py-2 sm:border-b-0 sm:border-r">
              <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">Location</span>
              <span className="flex items-center justify-between gap-2">
                <select value={location} onChange={(event) => setLocation(event.target.value)} className="w-full appearance-none bg-transparent text-sm font-medium outline-none">
                  <option>All locations</option><option>Urban homes</option><option>Suburban homes</option>
                </select><ChevronDown className="size-4 text-muted-foreground" />
              </span>
            </label>
            <label className="flex flex-col gap-1 px-4 py-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">Property type</span>
              <span className="flex items-center justify-between gap-2">
                <select value={type} onChange={(event) => setType(event.target.value)} className="w-full appearance-none bg-transparent text-sm font-medium outline-none">
                  <option>All property types</option><option>Single-family home</option><option>Apartment</option>
                </select><ChevronDown className="size-4 text-muted-foreground" />
              </span>
            </label>
            <Button variant="cyan" size="lg" onClick={browse} className="h-full min-h-12">Browse homes <ArrowRight /></Button>
          </div>
        </div>
        <div className="mx-auto mt-14 max-w-[1480px] px-0 sm:px-5">
          <img src={kitchenAsset.url} alt="Bright contemporary kitchen with island" className="h-[47vh] min-h-96 w-full object-cover sm:rounded-md lg:h-[62vh]" />
        </div>
      </header>

      <section id="management" className="bg-card py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="grid gap-10 border-b border-border pb-14 lg:grid-cols-[1fr_.75fr] lg:items-end">
            <div>
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-accent">How we manage</p>
              <h2 className="font-serif text-4xl text-primary sm:text-5xl">Care that protects value.</h2>
            </div>
            <p className="border-l-2 border-accent/40 pl-6 leading-7 text-muted-foreground">From daily communication to long-term planning, we look after the details that keep properties performing and people feeling at home.</p>
          </div>
          <div className="grid gap-10 pt-14 md:grid-cols-3">
            {[
              [ShieldCheck, "01", "Thoughtful stewardship", "Clear oversight and consistent care shaped around each property and owner."],
              [Wrench, "02", "Proactive maintenance", "Routine attention and timely coordination help prevent small issues becoming costly ones."],
              [Building2, "03", "Resident experience", "Responsive, respectful support creates better tenancies and well-cared-for homes."],
            ].map(([Icon, number, title, copy]) => {
              const ServiceIcon = Icon as typeof ShieldCheck;
              return <article key={String(number)} className="border-t border-border pt-6">
                <div className="mb-7 flex items-center justify-between"><ServiceIcon className="size-5 text-accent" /><span className="font-serif text-2xl text-primary/30">{String(number)}</span></div>
                <h3 className="mb-3 text-lg font-semibold text-primary">{String(title)}</h3>
                <p className="text-sm leading-6 text-muted-foreground">{String(copy)}</p>
              </article>;
            })}
          </div>
        </div>
      </section>

      <section id="properties" className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="mb-12 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div><p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-accent">Selected homes</p><h2 className="font-serif text-4xl text-primary sm:text-5xl">Spaces under our care</h2></div>
            <p className="max-w-sm text-sm leading-6 text-muted-foreground">A glimpse of the residential spaces that inspire our standard of service.</p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {properties.map((property, index) => (
              <article key={property.title} className={index === 1 ? "md:mt-12" : ""}>
                <div className="overflow-hidden rounded-sm"><img src={property.image} alt={property.title} loading="lazy" className="aspect-[4/3] w-full object-cover transition-transform duration-500 hover:scale-[1.03]" /></div>
                <div className="flex items-start justify-between border-b border-border py-5"><div><h3 className="font-serif text-2xl text-primary">{property.title}</h3><p className="mt-1 text-sm text-muted-foreground">{property.label}</p></div><span className="text-xs font-semibold text-accent">0{index + 1}</span></div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-primary text-primary-foreground">
        <div className="grid lg:grid-cols-2">
          <img src={livingAsset.url} alt="Warm modern living room with plants" loading="lazy" className="h-full min-h-[460px] w-full object-cover" />
          <div id="owners" className="flex items-center px-6 py-20 sm:px-12 lg:px-20">
            <div className="max-w-xl">
              <p className="mb-5 text-xs font-bold uppercase tracking-[0.18em] text-accent">For property owners</p>
              <h2 className="font-serif text-4xl leading-tight sm:text-5xl">Confidence in every detail.</h2>
              <p className="mt-6 leading-7 text-primary-foreground/70">Your property deserves attentive management and clear communication. We provide a dependable point of contact for the work that protects your investment.</p>
              <ul className="mt-8 grid gap-4 text-sm sm:grid-cols-2">
                {["Property oversight", "Maintenance coordination", "Resident communication", "Clear reporting"].map((item) => <li key={item} className="flex items-center gap-3"><Check className="size-4 text-accent" />{item}</li>)}
              </ul>
              <Button variant="cyan" size="lg" asChild className="mt-10"><a href="#contact">Discuss your property <ArrowRight /></a></Button>
            </div>
          </div>
        </div>
      </section>

      <section id="residents" className="py-20 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 lg:grid-cols-12 lg:items-center lg:px-8">
          <div className="lg:col-span-5"><p className="mb-5 text-xs font-bold uppercase tracking-[0.18em] text-accent">For residents</p><h2 className="font-serif text-4xl text-primary sm:text-5xl">A home supported with care.</h2><p className="mt-6 max-w-md leading-7 text-muted-foreground">Good management should feel simple: clear communication, considerate service, and help when you need it.</p><Button variant="brand" size="lg" asChild className="mt-8"><a href="#contact">Contact the team <ArrowRight /></a></Button></div>
          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-7"><img src={viewAsset.url} alt="Light-filled living room with city view" loading="lazy" className="aspect-[4/5] w-full rounded-sm object-cover" /><img src={kitchenAsset.url} alt="Carefully maintained contemporary kitchen" loading="lazy" className="aspect-[4/5] w-full rounded-sm object-cover sm:mt-12" /></div>
        </div>
      </section>

      <section id="contact" className="bg-secondary py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-5 text-center lg:px-8">
          <p className="mb-5 text-xs font-bold uppercase tracking-[0.18em] text-accent">Start a conversation</p>
          <h2 className="mx-auto max-w-3xl font-serif text-4xl text-primary sm:text-6xl">Property management, made more personal.</h2>
          <p className="mx-auto mt-6 max-w-xl leading-7 text-muted-foreground">Whether you own a property or are looking for a place to call home, we would be pleased to hear from you.</p>
          <div className="mt-9 flex flex-wrap justify-center gap-3"><Button variant="brand" size="lg" asChild><a href="mailto:info@silverfoxproperties.com">Owner enquiry</a></Button><Button variant="outline" size="lg" asChild><a href="mailto:info@silverfoxproperties.com">Resident enquiry</a></Button></div>
          <p className="mt-4 text-xs text-muted-foreground">Email address shown as a temporary contact until your official details are supplied.</p>
        </div>
      </section>

      <footer className="border-t border-border bg-background py-12">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-10 px-5 sm:flex-row sm:items-end lg:px-8">
          <div><img src={logoAsset.url} alt="Silverfox Property Management" className="h-12 w-auto" /><p className="mt-4 max-w-sm text-sm leading-6 text-muted-foreground">Professional property care for owners and residents.</p></div>
          <div className="text-sm text-muted-foreground sm:text-right"><p>© 2026 Silverfox Property Management</p><p className="mt-2">All rights reserved.</p></div>
        </div>
      </footer>
    </main>
  );
}
