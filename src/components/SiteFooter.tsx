import logo from "@/assets/silverfox-logo.jpg";

export default function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background py-12 font-sans">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 md:grid-cols-[1fr_.65fr_1fr] lg:px-8">
        <div>
          <a href="/" aria-label="Silverfox home">
            <img src={logo} alt="Silverfox Property Management" className="h-12 w-auto" />
          </a>
          <p className="mt-4 max-w-sm text-sm leading-6 text-muted-foreground">
            Professional property care for owners and residents.
          </p>
        </div>
        <nav
          aria-label="Footer navigation"
          className="flex flex-col items-start gap-3 text-sm text-muted-foreground"
        >
          <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-primary">
            Explore Silverfox
          </p>
          <a href="/#properties" className="hover:text-primary">
            Our properties
          </a>
          <a href="/#management" className="hover:text-primary">
            Property management
          </a>
          <a href="/#owners" className="hover:text-primary">
            For property owners
          </a>
          <a href="/#residents" className="hover:text-primary">
            For residents
          </a>
          <a href="/staff/login" className="hover:text-primary">
            Staff Login
          </a>
        </nav>
        <div className="min-w-0 text-sm text-muted-foreground md:text-right">
          <address className="mb-4 flex flex-col gap-3 not-italic">
            <a
              href="mailto:Info@silverfoxpropertymanagement.co.ke"
              className="inline-flex min-h-10 items-center break-words hover:text-foreground md:justify-end"
            >
              Info@silverfoxpropertymanagement.co.ke
            </a>
            <a
              href="tel:+254701507570"
              className="inline-flex min-h-10 items-center hover:text-foreground md:justify-end"
            >
              0701 507570
            </a>
          </address>
          <p>&copy; {new Date().getFullYear()} Silverfox Property Management</p>
          <p className="mt-2">All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
