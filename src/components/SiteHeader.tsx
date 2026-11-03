import { useState } from "react";
import { Menu, Phone, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/silverfox-logo.jpg";
import ThemeToggle from "./ThemeToggle";

const sections = [
  ["Properties", "properties"],
  ["Our Services", "management"],
  ["For owners", "owners"],
  ["For residents", "residents"],
  ["Contact us", "contact"],
] as const;

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-xl">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:bg-background focus:p-3"
      >
        Skip to content
      </a>
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-5 lg:px-8">
        <a href="/#top" aria-label="Silverfox Property Management home" className="shrink-0">
          <img src={logo} alt="Silverfox Property Management" className="h-11 w-auto sm:h-12" />
        </a>
        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-4 text-sm font-medium lg:flex"
        >
          {sections.map(([label, id]) => (
            <a
              key={id}
              href={`/#${id}`}
              className="inline-flex min-h-10 items-center transition-colors hover:text-accent"
            >
              {label}
            </a>
          ))}
        </nav>
        <div className="flex shrink-0 items-center gap-2">
          <ThemeToggle />
          <Button variant="outline" asChild className="hidden sm:inline-flex">
            <a href="/staff/login">Staff Login</a>
          </Button>
          <Button variant="brand" asChild className="hidden xl:inline-flex">
            <a href="tel:+254701507570">
              <Phone />
              0701 507570
            </a>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </div>
      {menuOpen && (
        <nav
          id="mobile-navigation"
          aria-label="Mobile navigation"
          className="flex flex-col gap-1 border-t border-border px-5 py-3 lg:hidden"
        >
          <a
            href="/staff/login"
            className="flex min-h-11 items-center text-sm font-semibold text-primary"
          >
            Staff Login
          </a>
          {sections.map(([label, id]) => (
            <a
              key={id}
              href={`/#${id}`}
              onClick={() => setMenuOpen(false)}
              className="flex min-h-11 items-center text-sm font-medium"
            >
              {label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
