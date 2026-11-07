import { Component, useEffect, type ErrorInfo, type ReactNode } from "react";
import Home from "./pages/Home";
import BlogDetail from "./pages/BlogDetail";
import PropertyDetail from "./pages/PropertyDetail";
import SiteHeader from "./components/SiteHeader";
import SiteFooter from "./components/SiteFooter";
import StaffLogin from "./pages/StaffLogin";
import Admin from "./pages/Admin";
import StatusPage, { NotFoundPage } from "./components/StatusPage";
import { LineSkeletons, LoadError } from "./components/QueryState";
import { Toaster } from "./components/ui/sonner";
import { Skeleton } from "./components/ui/skeleton";
import { getPropertyBySlug } from "./lib/properties";
import { getPostBySlug } from "./lib/blog";
import { useQuery } from "./lib/use-query";

class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  override state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  override componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Unable to render the page", error, info.componentStack);
  }

  override render() {
    if (this.state.hasError) {
      return (
        <StatusPage
          title="This page didn't load"
          message="Something went wrong. Please try refreshing the page."
        >
          <button
            className="rounded-md bg-primary px-4 py-2 text-primary-foreground"
            onClick={() => window.location.reload()}
          >
            Try again
          </button>
        </StatusPage>
      );
    }
    return this.props.children;
  }
}

function slugFrom(pathname: string, prefix: string) {
  const match = new RegExp(`^/${prefix}/([^/]+)$`).exec(pathname);
  if (!match?.[1]) return null;
  try {
    return decodeURIComponent(match[1]);
  } catch {
    return null;
  }
}

function DetailLoading() {
  return (
    <main id="main-content" className="mx-auto max-w-7xl px-5 pb-20 pt-16 lg:px-8" aria-busy="true">
      <Skeleton className="mb-4 h-4 w-40" />
      <Skeleton className="mb-8 h-12 w-2/3" />
      <Skeleton className="mb-8 h-[360px] w-full sm:h-[500px]" />
      <LineSkeletons lines={5} className="max-w-3xl" />
    </main>
  );
}

function PropertyRoute({ slug }: { slug: string }) {
  const result = useQuery((signal) => getPropertyBySlug(slug, signal), [slug]);
  if (result.data) return <PropertyDetail property={result.data} />;
  if (result.error?.status === 404) return <NotFoundPage />;
  if (result.error)
    return (
      <main id="main-content" className="mx-auto max-w-7xl px-5 py-16">
        <LoadError error={result.error} onRetry={result.reload} />
      </main>
    );
  return <DetailLoading />;
}

function ArticleRoute({ slug }: { slug: string }) {
  const result = useQuery((signal) => getPostBySlug(slug, signal), [slug]);
  if (result.data) return <BlogDetail post={result.data} />;
  if (result.error?.status === 404) return <NotFoundPage />;
  if (result.error)
    return (
      <main id="main-content" className="mx-auto max-w-5xl px-5 py-16">
        <LoadError error={result.error} onRetry={result.reload} />
      </main>
    );
  return <DetailLoading />;
}

function PublicPage({ pathname }: { pathname: string }) {
  if (pathname === "/") return <Home />;
  const propertySlug = slugFrom(pathname, "properties");
  if (propertySlug) return <PropertyRoute slug={propertySlug} />;
  const articleSlug = slugFrom(pathname, "blogs");
  if (articleSlug) return <ArticleRoute slug={articleSlug} />;
  return <NotFoundPage />;
}

const staffViews = {
  "/staff/login": "login",
  "/staff/forgot-password": "forgot",
  "/staff/reset-password": "reset",
} as const;

export default function App() {
  useEffect(() => {
    // Cross-page hash targets do not exist until React mounts the destination page.
    const frame = requestAnimationFrame(() => {
      const id = window.location.hash.slice(1);
      if (id) document.getElementById(id)?.scrollIntoView({ behavior: "instant" });
    });
    return () => cancelAnimationFrame(frame);
  }, []);
  const pathname = window.location.pathname.replace(/\/+$/, "") || "/";
  const staffView = pathname in staffViews ? staffViews[pathname as keyof typeof staffViews] : null;
  let page: ReactNode;
  if (staffView) page = <StaffLogin view={staffView} />;
  else if (pathname === "/admin" || pathname.startsWith("/admin/"))
    page = <Admin path={pathname} />;
  else
    page = (
      <>
        <SiteHeader />
        <PublicPage pathname={pathname} />
        <SiteFooter />
      </>
    );
  return (
    <ErrorBoundary>
      {page}
      <Toaster position="top-center" richColors closeButton />
    </ErrorBoundary>
  );
}
