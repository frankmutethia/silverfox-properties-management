import logo from "@/assets/silverfox-logo.jpg";

export default function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background py-12">
      <div className="mx-auto grid max-w-7xl gap-8 px-5 md:grid-cols-2 lg:px-8">
        <div>
          <a href="/" aria-label="Silverfox home">
            <img src={logo} alt="Silverfox Property Management" className="h-12 w-auto" />
          </a>
          <p className="mt-4 max-w-sm text-sm leading-6 text-muted-foreground">
            Professional property care for owners and residents.
          </p>
        </div>
        <div className="min-w-0 text-sm text-muted-foreground md:text-right">
          <address className="mb-4 flex flex-col gap-3 not-italic">
            <a
              href="mailto:Info@silverfoxpropertymanagement.co.ke"
              className="break-words hover:text-foreground"
            >
              Info@silverfoxpropertymanagement.co.ke
            </a>
            <a href="tel:+254701507570" className="hover:text-foreground">
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
