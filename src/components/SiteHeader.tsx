import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/silverfox-logo.jpg";
import ThemeToggle from "./ThemeToggle";

/** Home page sections, in the order they appear on the page. */
const sections = [
  ["Services", "management"],
  ["Properties", "properties"],
  ["Enquire", "enquiries"],
  ["Blog", "blogs"],
  ["Testimonials", "testimonials"],
  ["Contact", "contact"],
] as const;

type SectionId = (typeof sections)[number][1];

/** Which home page section is in the middle of the screen, for highlighting its link. */
function useCurrentSection(enabled: boolean) {
  const [current, setCurrent] = useState<SectionId | null>(null);
  useEffect(() => {
    if (!enabled) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries)
          if (entry.isIntersecting) setCurrent(entry.target.id as SectionId);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    const watch = () => {
      for (const [, id] of sections) {
        const element = document.getElementById(id);
        if (element) observer.observe(element);
      }
    };
    watch();
    // Some sections render after their data loads.
    const retry = window.setTimeout(watch, 1500);
    const onScroll = () => window.scrollY < 200 && setCurrent(null);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      observer.disconnect();
      window.clearTimeout(retry);
      window.removeEventListener("scroll", onScroll);
    };
  }, [enabled]);
  return current;
}

/**
 * With `overlay` (the home page), the header sits transparently over the hero photo until the
 * visitor scrolls or opens the menu, then turns into the usual solid bar, and the link for the
 * section in view is highlighted.
 */
export default function SiteHeader({ overlay = false }: { overlay?: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const current = useCurrentSection(overlay);
  useEffect(() => {
    if (!overlay) return;
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [overlay]);
  const clear = overlay && !scrolled && !menuOpen;
  return (
    <header
      className={`sticky top-0 z-40 border-b transition-colors duration-300 ${clear ? "border-white/15 bg-transparent text-white" : "border-border bg-background/95 backdrop-blur-xl"}`}
    >
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:bg-background focus:p-3"
      >
        Skip to content
      </a>
      <div className="flex h-20 items-center justify-between gap-6 px-5 sm:px-8 lg:grid lg:grid-cols-[1fr_auto_1fr] lg:px-10 2xl:px-14">
        <a
          href="/#top"
          aria-label="Silverfox Property Management home"
          className="shrink-0 justify-self-start"
        >
          <img src={logo} alt="Silverfox Property Management" className="h-11 w-auto sm:h-12" />
        </a>
        <nav aria-label="Main navigation" className="hidden lg:block">
          <ul className="flex items-center gap-1 text-sm font-medium xl:gap-2">
            {sections.map(([label, id]) => {
              const active = current === id;
              return (
                <li key={id}>
                  <a
                    href={`/#${id}`}
                    aria-current={active ? "location" : undefined}
                    className={`relative inline-flex min-h-10 items-center rounded-full px-3.5 transition-colors xl:px-4 ${
                      clear
                        ? "text-white/90 hover:bg-white/10 hover:text-white"
                        : active
                          ? "bg-accent/10 text-accent"
                          : "text-foreground/80 hover:bg-secondary hover:text-foreground"
                    }`}
                  >
                    {label}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="flex shrink-0 items-center gap-2 justify-self-end sm:gap-3">
          <ThemeToggle />
          <Button
            variant="outline"
            asChild
            className={`hidden sm:inline-flex ${clear ? "border-white/40 bg-white/10 text-white backdrop-blur hover:bg-white/20 hover:text-white" : ""}`}
          >
            <a href="/staff/login">Staff Login</a>
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
          className="flex flex-col gap-1 border-t border-border px-5 py-3 sm:px-8 lg:hidden"
        >
          {sections.map(([label, id]) => (
            <a
              key={id}
              href={`/#${id}`}
              onClick={() => setMenuOpen(false)}
              aria-current={current === id ? "location" : undefined}
              className={`flex min-h-11 items-center text-sm font-medium ${current === id ? "text-accent" : ""}`}
            >
              {label}
            </a>
          ))}
          <a
            href="/staff/login"
            className="mt-1 flex min-h-11 items-center border-t border-border pt-1 text-sm font-semibold text-primary sm:hidden"
          >
            Staff Login
          </a>
        </nav>
      )}
    </header>
  );
}
