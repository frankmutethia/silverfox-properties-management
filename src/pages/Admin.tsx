import { useEffect, useState, type MouseEvent } from "react";
import {
  ArrowUpRight,
  Building2,
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
  BriefcaseBusiness,
  UserRound,
  MessageSquareQuote,
  UsersRound,
} from "lucide-react";
import AdminDashboard from "@/pages/AdminDashboard";
import AdminProperties from "@/pages/AdminProperties";
import AdminServices from "@/pages/AdminServices";
import AdminEnquiries from "@/pages/AdminEnquiries";
import AdminBlogs from "@/pages/AdminBlogs";
import AdminProfile from "@/pages/AdminProfile";
import AdminTestimonials from "@/pages/AdminTestimonials";
import AdminUsers from "@/pages/AdminUsers";
import { LineSkeletons, LoadError } from "@/components/QueryState";
import { Skeleton } from "@/components/ui/skeleton";
import logo from "@/assets/silverfox-logo.jpg";
import avatar from "@/assets/staff-avatar.svg";
import ThemeToggle from "@/components/ThemeToggle";
import WorkspaceTour from "@/components/admin/WorkspaceTour";
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
import { getMe, logout } from "@/lib/auth";
import { setUnauthorizedHandler } from "@/lib/api";
import type { ApiUser } from "@/lib/types";
import { useQuery } from "@/lib/use-query";

const navigation = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Properties", href: "/admin/properties", icon: Building2 },
  { label: "Services", href: "/admin/services", icon: BriefcaseBusiness },
  { label: "Enquiries", href: "/admin/enquiries", icon: MessageSquareQuote },
  { label: "Blogs", href: "/admin/blogs", icon: FileText },
  { label: "Testimonials", href: "/admin/testimonials", icon: MessageSquareQuote },
  { label: "User Management", href: "/admin/users", icon: UsersRound },
  { label: "Profile", href: "/admin/profile", icon: UserRound },
];

function toSignIn() {
  const next = window.location.pathname;
  window.location.replace(`/staff/login?next=${encodeURIComponent(next)}`);
}

async function signOut() {
  try {
    await logout();
  } catch {
    // The session may already be gone; sign-in is the right destination either way.
  }
  window.location.assign("/staff/login");
}

const normalize = (pathname: string) => pathname.replace(/\/+$/, "") || "/";

/**
 * Guards the staff workspace. The session check and the page's own data load in parallel;
 * any 401 (signed out, expired or revoked session) returns to sign-in.
 */
export default function Admin({ path: initialPath }: { path: string }) {
  useEffect(() => {
    setUnauthorizedHandler(toSignIn);
    return () => setUnauthorizedHandler(null);
  }, []);
  const session = useQuery((signal) => getMe(signal), []);
  const [user, setUser] = useState<ApiUser | null>(null);
  const [path, setPath] = useState(initialPath);

  // Moving between workspace pages swaps the page in place instead of reloading the app,
  // so the session isn't re-checked and only the new page's data is fetched.
  useEffect(() => {
    const onPopState = () => setPath(normalize(window.location.pathname));
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);
  function navigate(event: MouseEvent<HTMLElement>) {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    )
      return;
    const link = (event.target as Element).closest("a");
    if (!link || link.target || link.hasAttribute("download") || link.origin !== location.origin)
      return;
    const next = normalize(link.pathname);
    if (next !== "/admin" && !next.startsWith("/admin/")) return;
    event.preventDefault();
    if (next !== path || link.search)
      window.history.pushState(null, "", link.pathname + link.search);
    setPath(next);
    window.scrollTo({ top: 0 });
  }

  if (session.error && session.error.status !== 401)
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-5">
        <LoadError error={session.error} onRetry={session.reload} />
      </main>
    );
  return (
    <AdminShell
      path={path}
      user={user ?? session.data ?? null}
      onUserChange={setUser}
      onNavigate={navigate}
    />
  );
}

function AdminShell({
  path,
  user,
  onUserChange,
  onNavigate,
}: {
  path: string;
  /** Null while the session check is in flight. */
  user: ApiUser | null;
  onUserChange: (user: ApiUser) => void;
  onNavigate: (event: MouseEvent<HTMLElement>) => void;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [touring, setTouring] = useState(false);
  const tourKey = user ? `silverfox-tour-done:${user._id}` : null;

  // First visit on this device: start the tour once the account is known.
  useEffect(() => {
    if (!tourKey) return;
    let seen = true;
    try {
      seen = localStorage.getItem(tourKey) === "1";
    } catch {
      /* Storage is optional; without it the tour stays on the Help button. */
    }
    if (!seen) setTouring(true);
  }, [tourKey]);
  function closeTour() {
    setTouring(false);
    if (!tourKey) return;
    try {
      localStorage.setItem(tourKey, "1");
    } catch {
      /* Storage is optional. */
    }
  }
  const current = navigation.find((item) => item.href === path);
  const title = current?.label ?? "Page not found";
  useEffect(() => {
    document.title = `${title} | Silverfox Staff`;
    setMobileOpen(false);
  }, [title]);
  function links(compact = false) {
    return (
      <nav aria-label="Staff navigation" className="space-y-2">
        {navigation.map(({ label, href, icon: Icon }) => (
          <a
            key={href}
            href={href}
            data-tour={`nav-${href}`}
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
    <div
      className="admin-shell flex min-h-screen bg-secondary/45 font-sans text-foreground"
      onClick={onNavigate}
    >
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
        <div data-tour="sidebar-footer" className="flex flex-col">
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
          <button
            type="button"
            onClick={() => void signOut()}
            aria-label="Sign out"
            title="Sign out"
            className="flex h-14 shrink-0 items-center justify-center gap-3 border-t border-border text-sm text-destructive hover:bg-secondary"
          >
            <LogOut className="size-4" />
            {!collapsed && "Sign out"}
          </button>
        </div>
      </aside>
      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between gap-3 border-b border-border bg-card/95 px-4 backdrop-blur-xl sm:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="hidden lg:inline-flex"
              data-tour="sidebar-toggle"
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              aria-expanded={!collapsed}
              onClick={() => setCollapsed(!collapsed)}
            >
              {collapsed ? <PanelLeftOpen /> : <PanelLeftClose />}
            </Button>
            <Dialog open={mobileOpen} onOpenChange={setMobileOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden"
                  aria-label="Open sidebar"
                  data-tour="menu"
                >
                  <PanelLeftOpen />
                </Button>
              </DialogTrigger>
              <DialogContent className="left-0 top-0 h-dvh w-72 max-w-[90vw] translate-x-0 translate-y-0 content-start rounded-none">
                <DialogTitle>Silverfox workspace</DialogTitle>
                <DialogDescription>Staff navigation</DialogDescription>
                {links()}
                <button
                  type="button"
                  onClick={() => void signOut()}
                  className="flex min-h-11 items-center gap-3 text-sm text-destructive"
                >
                  <LogOut className="size-4" />
                  Sign out
                </button>
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
            <span data-tour="theme" className="inline-flex rounded-md">
              <ThemeToggle />
            </span>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Help: take the workspace tour"
              title="Help"
              data-tour="help"
              onClick={() => setTouring(true)}
            >
              <CircleHelp />
            </Button>
            <div className="ml-1 border-l border-border pl-3 sm:pl-5">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    data-tour="profile"
                    aria-label="Open your profile menu"
                    className="flex items-center gap-3 rounded-lg text-left"
                  >
                    <img
                      src={user?.photo?.url ?? avatar}
                      alt=""
                      className="size-10 rounded-full border-2 border-accent/25 object-cover"
                    />
                    <span className="hidden sm:block">
                      <span className="block max-w-40 truncate text-sm font-semibold">
                        {user ? user.name : <Skeleton className="h-4 w-28" />}
                      </span>
                      <span className="block max-w-40 truncate text-[11px] text-muted-foreground">
                        {user?.email ?? "Staff workspace"}
                      </span>
                    </span>
                    <ChevronDown className="hidden size-4 text-muted-foreground sm:block" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="truncate">
                    {user?.name ?? "Staff"}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <a href="/admin/profile">
                      <UserRound className="mr-2 size-4" />
                      My profile
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <a href="/">
                      <Globe className="mr-2 size-4" />
                      View website
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => void signOut()}>
                    <LogOut className="mr-2 size-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>
        <main id="main-content" className="mx-auto max-w-[1500px] p-5 sm:p-8 xl:p-10">
          {path === "/admin" ? (
            <AdminDashboard user={user} />
          ) : path === "/admin/properties" ? (
            <AdminProperties />
          ) : path === "/admin/services" ? (
            <AdminServices />
          ) : path === "/admin/enquiries" ? (
            <AdminEnquiries />
          ) : path === "/admin/blogs" ? (
            <AdminBlogs />
          ) : path === "/admin/profile" ? (
            user ? (
              <AdminProfile user={user} onSave={onUserChange} />
            ) : (
              <LineSkeletons lines={8} className="admin-panel p-8" />
            )
          ) : path === "/admin/users" ? (
            <AdminUsers user={user} />
          ) : path === "/admin/testimonials" ? (
            <AdminTestimonials />
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
      <WorkspaceTour open={touring} onClose={closeTour} />
    </div>
  );
}
