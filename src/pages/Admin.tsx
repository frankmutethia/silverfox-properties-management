import { useEffect, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Building2,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  FileText,
  Globe,
  House,
  LayoutDashboard,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  Search,
} from "lucide-react";
import { properties, propertyPrice } from "@/data/properties";
import CreateProperty from "@/components/CreateProperty";
import PropertyGallery from "@/components/PropertyGallery";
import PropertyFacts from "@/components/PropertyFacts";
import { readLocalProperties } from "@/lib/local-properties";
import logo from "@/assets/silverfox-logo.jpg";
import avatar from "@/assets/staff-avatar.svg";
import ThemeToggle from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navigation = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Properties", href: "/admin/properties", icon: Building2 },
  { label: "Blogs", href: "/admin/blogs", icon: FileText },
];
type Draft = { id: string; title: string; body: string; updated: string };
const draftKey = "silverfox-blog-drafts";
function readDrafts(): Draft[] {
  try {
    const data: unknown = JSON.parse(localStorage.getItem(draftKey) ?? "[]");
    return Array.isArray(data)
      ? data.filter(
          (item): item is Draft =>
            item &&
            typeof item.id === "string" &&
            typeof item.title === "string" &&
            typeof item.body === "string" &&
            typeof item.updated === "string",
        )
      : [];
  } catch {
    return [];
  }
}

export default function Admin({ path }: { path: string }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [localProperties, setLocalProperties] = useState(readLocalProperties);
  const collection = [...properties, ...localProperties];
  const [drafts, setDrafts] = useState(readDrafts);
  const current = navigation.find((item) => item.href === path);
  const title = current?.label ?? "Page not found";
  useEffect(() => {
    document.title = `${title} | Silverfox Staff`;
  }, [title]);
  function links(compact = false) {
    return (
      <nav aria-label="Staff navigation" className="space-y-2">
        {navigation.map(({ label, href, icon: Icon }) => (
          <a
            key={href}
            href={href}
            title={compact ? label : undefined}
            aria-label={compact ? label : undefined}
            aria-current={path === href ? "page" : undefined}
            className={`flex min-h-12 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors ${path === href ? "bg-accent/15 text-accent" : "text-muted-foreground hover:bg-secondary hover:text-foreground"} ${compact ? "justify-center" : ""}`}
          >
            <Icon className="size-5 shrink-0" />
            {!compact && label}
          </a>
        ))}
      </nav>
    );
  }
  return (
    <div className="admin-shell flex min-h-screen bg-secondary/45 font-sans text-foreground">
      <aside
        className={`sticky top-0 hidden h-screen shrink-0 flex-col border-r border-border bg-card transition-[width] lg:flex ${collapsed ? "w-20" : "w-64"}`}
      >
        <a
          href="/admin"
          aria-label="Silverfox staff dashboard"
          className="flex h-20 shrink-0 items-center justify-center border-b border-border px-4"
        >
          {collapsed ? (
            <House className="size-7 text-primary" />
          ) : (
            <img src={logo} alt="Silverfox Property Management" className="h-12 rounded" />
          )}
        </a>
        <div className="flex-1 px-4 py-8">
          {!collapsed && (
            <p className="mb-4 px-3 text-[10px] font-bold uppercase tracking-[.18em] text-muted-foreground">
              Workspace
            </p>
          )}
          {links(collapsed)}
        </div>
        <a
          href="/"
          title="View website"
          className="flex h-16 items-center justify-center gap-3 border-t border-border text-sm text-muted-foreground hover:text-primary"
        >
          <Globe className="size-4" />
          {!collapsed && (
            <>
              View website <ArrowUpRight className="size-4" />
            </>
          )}
        </a>
        <a
          href="/staff/login"
          aria-label="Logout"
          title="Logout"
          className="flex h-14 shrink-0 items-center justify-center gap-3 border-t border-border text-sm text-destructive hover:bg-secondary"
        >
          <LogOut className="size-4" />
          {!collapsed && "Logout"}
        </a>
      </aside>
      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between gap-3 border-b border-border bg-card/95 px-4 backdrop-blur-xl sm:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="hidden lg:inline-flex"
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              aria-expanded={!collapsed}
              onClick={() => setCollapsed(!collapsed)}
            >
              {collapsed ? <PanelLeftOpen /> : <PanelLeftClose />}
            </Button>
            <Dialog open={mobileOpen} onOpenChange={setMobileOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open sidebar">
                  <PanelLeftOpen />
                </Button>
              </DialogTrigger>
              <DialogContent className="left-0 top-0 h-dvh w-72 max-w-[90vw] translate-x-0 translate-y-0 content-start rounded-none">
                <DialogTitle>Silverfox workspace</DialogTitle>
                <DialogDescription>Staff navigation</DialogDescription>
                {links()}
                <a
                  href="/staff/login"
                  className="flex min-h-11 items-center gap-3 text-sm text-destructive"
                >
                  <LogOut className="size-4" />
                  Logout
                </a>
                <a href="/" className="mt-6 text-sm text-muted-foreground">
                  View website
                </a>
              </DialogContent>
            </Dialog>
            <span className="hidden text-sm text-muted-foreground sm:inline">Workspace</span>
            <ChevronRight className="hidden size-3 text-muted-foreground sm:block" />
            <span className="truncate text-sm font-semibold">{title}</span>
          </div>
          <div className="flex items-center gap-1 sm:gap-3">
            <ThemeToggle />
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Help and support">
                  <CircleHelp />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-[calc(100%-2rem)] sm:max-w-lg">
                <DialogTitle>A little help, whenever you need it.</DialogTitle>
                <DialogDescription>Your guide to the Silverfox workspace.</DialogDescription>
                <div className="space-y-4 text-sm leading-6">
                  <p>
                    <strong>Properties:</strong> browse the website’s current collection and review
                    missing listing information.
                  </p>
                  <p>
                    <strong>Blogs:</strong> write and save drafts in this browser. Drafts are not
                    published to the website.
                  </p>
                  <p>
                    <strong>Account access:</strong> this is an interface preview. Secure staff
                    accounts are not connected yet.
                  </p>
                  <Button asChild>
                    <a href="mailto:Info@silverfoxpropertymanagement.co.ke">
                      Contact support <ArrowUpRight />
                    </a>
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            <div className="ml-1 border-l border-border pl-3 sm:pl-5">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    aria-label="Open administrator profile"
                    className="flex items-center gap-3 rounded-lg text-left"
                  >
                    <img
                      src={avatar}
                      alt="Administrator avatar"
                      className="size-10 rounded-full border-2 border-accent/25"
                    />
                    <span className="hidden sm:block">
                      <span className="block text-sm font-semibold">Administrator</span>
                      <span className="block text-[11px] text-muted-foreground">
                        Staff workspace
                      </span>
                    </span>
                    <ChevronDown className="hidden size-4 text-muted-foreground sm:block" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Administrator</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <a href="/">
                      <Globe className="mr-2 size-4" />
                      View website
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <a href="/staff/login">
                      <LogOut className="mr-2 size-4" />
                      Logout
                    </a>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>
        <main id="main-content" className="mx-auto max-w-[1500px] p-5 sm:p-8 xl:p-10">
          {path === "/admin" ? (
            <Dashboard drafts={drafts} properties={collection} />
          ) : path === "/admin/properties" ? (
            <Properties properties={collection} onCreated={setLocalProperties} />
          ) : path === "/admin/blogs" ? (
            <Blogs drafts={drafts} onSave={setDrafts} />
          ) : (
            <div className="admin-panel p-10">
              <h1 className="text-2xl font-semibold">Page not found</h1>
              <a href="/admin" className="mt-4 inline-block text-primary underline">
                Back to dashboard
              </a>
            </div>
          )}
        </main>
        <footer className="mx-5 flex flex-wrap justify-between gap-2 border-t border-border py-5 text-[11px] text-muted-foreground sm:mx-8">
          <span>Silverfox Property Management</span>
          <span>Staff workspace</span>
        </footer>
      </div>
    </div>
  );
}

function Dashboard({
  drafts,
  properties,
}: {
  drafts: Draft[];
  properties: import("@/data/properties").Property[];
}) {
  const apartments = properties.filter((property) => property.type === "Apartment").length;
  return (
    <>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="mb-2 text-xs font-semibold text-accent">
            {new Intl.DateTimeFormat("en-GB", {
              weekday: "long",
              day: "numeric",
              month: "long",
              timeZone: "Africa/Nairobi",
            }).format(new Date())}
          </p>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Welcome back, Administrator<span className="text-accent">.</span>
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            A clear view of your properties and the stories behind them.
          </p>
        </div>
        <Button variant="outline" asChild>
          <a href="/">
            View website <ArrowUpRight />
          </a>
        </Button>
      </div>
      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: "Total properties",
            count: properties.length,
            detail: "Website listings and local drafts",
            icon: Building2,
          },
          {
            label: "Apartments",
            count: apartments,
            detail: "Spaces for modern living",
            icon: LayoutDashboard,
          },
          {
            label: "Houses",
            count: properties.length - apartments,
            detail: "Homes in the collection",
            icon: House,
          },
          {
            label: "Blog drafts",
            count: drafts.length,
            detail: "Saved in this browser",
            icon: FileText,
          },
        ].map(({ label, count, detail, icon: Icon }) => (
          <article key={label} className="admin-panel p-5">
            <div className="mb-6 flex items-center justify-between">
              <span className="rounded-xl bg-accent/10 p-3 text-accent">
                <Icon className="size-5" />
              </span>
              <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                {label === "Blog drafts" ? "Local" : "Collection"}
              </span>
            </div>
            <p className="text-3xl font-semibold tracking-tight">
              {count.toString().padStart(2, "0")}
            </p>
            <h2 className="mb-1 mt-2 text-sm font-semibold">{label}</h2>
            <p className="text-xs text-muted-foreground">{detail}</p>
          </article>
        ))}
      </div>
      <div className="grid items-start gap-6 xl:grid-cols-[1.7fr_1fr]">
        <section className="admin-panel overflow-hidden">
          <div className="flex items-center justify-between gap-3 border-b border-border p-5">
            <div>
              <h2 className="font-semibold">Property collection</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                A closer look at the homes we represent.
              </p>
            </div>
            <a
              href="/admin/properties"
              className="flex shrink-0 items-center gap-1 text-xs font-semibold text-primary"
            >
              View all <ArrowRight className="size-3" />
            </a>
          </div>
          <div className="divide-y divide-border">
            {properties.slice(0, 4).map((property) => (
              <a
                href={
                  propertiesFromWebsite(property.slug)
                    ? `/properties/${property.slug}`
                    : `/admin/properties?view=${property.slug}`
                }
                key={property.slug}
                className="flex items-center gap-4 p-5 hover:bg-secondary/50"
              >
                <img
                  src={property.images[0].src}
                  alt={property.images[0].alt}
                  className="h-14 w-20 rounded-lg object-cover"
                />
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-sm font-semibold">{property.name}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {property.reference} · {property.type}
                  </p>
                </div>
                <span className="hidden rounded-full bg-secondary px-3 py-1 text-[10px] text-muted-foreground sm:block">
                  {propertiesFromWebsite(property.slug) ? "Details pending" : "Local draft"}
                </span>
                <ArrowUpRight className="size-4 shrink-0 text-muted-foreground" />
              </a>
            ))}
          </div>
        </section>
        <div className="space-y-6">
          <section className="admin-panel p-6">
            <p className="mb-4 text-[10px] font-bold uppercase tracking-[.16em] text-accent">
              Next on your list
            </p>
            <h2 className="text-lg font-semibold">Make every listing count.</h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              The collection is ready for confirmed locations, pricing and specifications. Complete
              information helps people find their next home.
            </p>
            <a
              href="/admin/properties"
              className="mt-5 flex items-center gap-2 text-sm font-semibold text-primary"
            >
              Review properties <ArrowRight className="size-4" />
            </a>
          </section>
          <section className="admin-panel p-6">
            <div className="mb-4 flex items-center gap-3">
              <FileText className="size-5 text-accent" />
              <h2 className="font-semibold">From the journal</h2>
            </div>
            <p className="text-sm leading-6 text-muted-foreground">
              {drafts.length
                ? `${drafts.length} draft${drafts.length === 1 ? " is" : "s are"} ready for your next edit.`
                : "Good advice starts with a first draft. Share your perspective on better property care."}
            </p>
            <Button variant="outline" asChild className="mt-5">
              <a href="/admin/blogs">
                <Plus />
                {drafts.length ? "Open blogs" : "Write your first blog"}
              </a>
            </Button>
          </section>
        </div>
      </div>
    </>
  );
}

function propertiesFromWebsite(slug: string) {
  return properties.some((item) => item.slug === slug);
}

function Properties({
  properties,
  onCreated,
}: {
  properties: import("@/data/properties").Property[];
  onCreated: (items: import("@/data/properties").Property[]) => void;
}) {
  const selected = properties.find(
    (item) => item.slug === new URLSearchParams(window.location.search).get("view"),
  );
  const [query, setQuery] = useState("");
  const [type, setType] = useState("");
  const results = properties.filter(
    (item) =>
      (!type || item.type === type) &&
      `${item.name} ${item.reference} ${item.location ?? ""}`
        .toLowerCase()
        .includes(query.trim().toLowerCase()),
  );
  return (
    <>
      {selected && (
        <Dialog defaultOpen>
          <DialogContent className="max-h-[90dvh] max-w-[calc(100%-2rem)] overflow-y-auto sm:max-w-3xl">
            <DialogTitle>{selected.name}</DialogTitle>
            <DialogDescription>
              {selected.reference} · Local draft · {selected.location ?? "Location to be confirmed"}
            </DialogDescription>
            <PropertyGallery property={selected} />
            <PropertyFacts property={selected} />
            <p className="font-semibold">{propertyPrice(selected)}</p>
            <p className="text-sm leading-6">{selected.description}</p>
            <p className="text-sm text-muted-foreground">
              Amenities: {selected.amenities.join(", ") || "To be confirmed"}
            </p>
          </DialogContent>
        </Dialog>
      )}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="admin-eyebrow">The Silverfox collection</p>
          <h1 className="admin-title">Properties</h1>
        </div>
        <CreateProperty properties={properties} onCreated={onCreated} />
      </div>
      <p className="mb-8 mt-3 text-sm text-muted-foreground">
        Review your collection, create a property, or explore listing details.
      </p>
      <section className="admin-panel overflow-hidden">
        <div className="flex flex-wrap items-center gap-3 border-b border-border p-5">
          <div className="relative min-w-0 basis-full sm:flex-1">
            <Search className="absolute left-3 top-3.5 size-4 text-muted-foreground" />
            <input
              aria-label="Search properties"
              className="admin-input pl-10"
              placeholder="Search name, location or reference…"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
          <select
            aria-label="Property type"
            className="admin-input w-auto"
            value={type}
            onChange={(event) => setType(event.target.value)}
          >
            <option value="">All property types</option>
            <option>Apartment</option>
            <option>House</option>
          </select>
        </div>
        <div className="relative overflow-x-auto">
          <table className="w-full min-w-[800px] text-left text-sm">
            <thead className="bg-secondary/50 text-[10px] uppercase tracking-wider text-muted-foreground">
              <tr>
                {["Property", "Location", "Price", "Status", ""].map((label) => (
                  <th key={label} scope="col" className="px-5 py-4">
                    {label || <span className="sr-only">View listing</span>}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {results.map((property) => (
                <tr key={property.slug} className="hover:bg-secondary/30">
                  <td className="p-5">
                    <div className="flex items-center gap-3">
                      <img
                        src={property.images[0].src}
                        alt=""
                        className="h-14 w-16 rounded-lg object-cover"
                      />
                      <div className="whitespace-nowrap font-semibold">
                        {property.name}
                        <p className="mt-1 text-xs font-normal text-muted-foreground">
                          {property.reference} · {property.type}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 text-xs text-muted-foreground">
                    {property.location ?? "Awaiting confirmation"}
                  </td>
                  <td className="whitespace-nowrap px-5 text-xs">{propertyPrice(property)}</td>
                  <td className="px-5">
                    <span className="whitespace-nowrap rounded-full bg-secondary px-3 py-1 text-[10px] text-muted-foreground">
                      {propertiesFromWebsite(property.slug) ? "Details pending" : "Local draft"}
                    </span>
                  </td>
                  <td className="px-5">
                    <a
                      href={
                        propertiesFromWebsite(property.slug)
                          ? `/properties/${property.slug}`
                          : `/admin/properties?view=${property.slug}`
                      }
                      aria-label={`View ${property.name}`}
                      className="flex size-10 items-center justify-center rounded-lg border border-border hover:bg-secondary"
                    >
                      <ArrowUpRight className="size-4" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!results.length && (
          <p className="p-12 text-center text-sm text-muted-foreground">
            No properties match your search. Try another name or type.
          </p>
        )}
        <p role="status" className="border-t border-border px-5 py-4 text-xs text-muted-foreground">
          {results.length} of {properties.length} properties · New properties are saved in this
          browser.
        </p>
      </section>
    </>
  );
}

function Blogs({ drafts, onSave }: { drafts: Draft[]; onSave: (drafts: Draft[]) => void }) {
  const [editor, setEditor] = useState(false);
  const [id, setId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [notice, setNotice] = useState("");
  function edit(draft?: Draft) {
    setId(draft?.id ?? null);
    setTitle(draft?.title ?? "");
    setBody(draft?.body ?? "");
    setNotice("");
    setEditor(true);
  }
  return (
    <>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="admin-eyebrow">The Silverfox journal</p>
          <h1 className="admin-title">Blogs</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Ideas, insights and a little inspiration for better property care.
          </p>
        </div>
        <Button onClick={() => edit()}>
          <Plus />
          New blog
        </Button>
      </div>
      <p className="mb-6 text-xs leading-6 text-muted-foreground">
        Drafts are saved on this browser only. Publishing and shared storage are not connected yet.
      </p>
      <p role="status" className="mb-4 text-sm text-primary">
        {!editor && notice}
      </p>
      {drafts.length ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {drafts.map((draft) => (
            <article className="admin-panel p-6" key={draft.id}>
              <span className="rounded-full bg-accent/10 px-3 py-1 text-xs text-primary">
                Draft
              </span>
              <h2 className="mt-5 break-words text-xl font-semibold">{draft.title}</h2>
              <p className="mt-3 line-clamp-3 break-words text-sm leading-6 text-muted-foreground">
                {draft.body}
              </p>
              <p className="mt-5 text-xs text-muted-foreground">
                Last saved {new Date(draft.updated).toLocaleDateString("en-GB")}
              </p>
              <Button variant="outline" className="mt-5" onClick={() => edit(draft)}>
                Edit draft <ArrowRight />
              </Button>
            </article>
          ))}
        </div>
      ) : (
        <section className="admin-panel flex min-h-[390px] flex-col items-center justify-center p-8 text-center">
          <span className="mb-6 rounded-2xl bg-accent/10 p-5 text-accent">
            <FileText className="size-8" />
          </span>
          <h2 className="text-xl font-semibold">Your next story starts here.</h2>
          <p className="mb-7 mt-3 max-w-sm text-sm leading-6 text-muted-foreground">
            Share helpful advice, property insights and stories that bring owners and residents
            closer to home.
          </p>
          <Button onClick={() => edit()}>
            <Plus />
            Create your first draft
          </Button>
        </section>
      )}
      <Dialog open={editor} onOpenChange={setEditor}>
        <DialogContent className="max-h-[90dvh] max-w-[calc(100%-2rem)] overflow-y-auto sm:max-w-2xl">
          <DialogTitle>{id ? "Edit blog draft" : "A new story"}</DialogTitle>
          <DialogDescription>
            Write for the Silverfox journal. Save your work as a local draft.
          </DialogDescription>
          <form
            className="space-y-5"
            onSubmit={(event) => {
              event.preventDefault();
              if (!title.trim() || !body.trim()) {
                setNotice("Add a title and some content before saving.");
                return;
              }
              const draft = {
                id: id ?? crypto.randomUUID(),
                title: title.trim(),
                body: body.trim(),
                updated: new Date().toISOString(),
              };
              const next = [draft, ...drafts.filter((item) => item.id !== draft.id)];
              try {
                localStorage.setItem(draftKey, JSON.stringify(next));
                onSave(next);
                setEditor(false);
                setNotice("Draft saved in this browser.");
              } catch {
                setNotice(
                  "Your draft could not be saved. Browser storage may be full or unavailable. Keep this window open and copy your work.",
                );
              }
            }}
          >
            <label className="block text-sm font-medium">
              Title
              <input
                className="admin-input mt-2"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Give your story a title"
                maxLength={160}
                required
              />
            </label>
            <label className="block text-sm font-medium">
              Content
              <textarea
                className="admin-input mt-2 min-h-56 resize-y"
                value={body}
                onChange={(event) => setBody(event.target.value)}
                placeholder="Start with something worth sharing…"
                required
              />
            </label>
            <p role="status" className="text-sm text-muted-foreground">
              {notice}
            </p>
            <div className="flex justify-end gap-3">
              <Button variant="outline" type="button" onClick={() => setEditor(false)}>
                Cancel
              </Button>
              <Button type="submit">
                <CheckCircle2 />
                Save draft
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
