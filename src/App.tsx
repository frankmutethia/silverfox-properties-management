import { Component, type ErrorInfo, type ReactNode } from "react";
import Home from "./pages/Home";

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

function StatusPage({
  title,
  message,
  children,
}: {
  title: string;
  message: string;
  children?: ReactNode;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 text-foreground">
      <div className="max-w-md text-center">
        <h1 className="text-3xl font-semibold">{title}</h1>
        <p className="mt-4 text-muted-foreground">{message}</p>
        <div className="mt-6 flex justify-center gap-3">
          {children}
          <a href="/" className="rounded-md border border-input px-4 py-2">
            Go home
          </a>
        </div>
      </div>
    </main>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      {window.location.pathname === "/" ? (
        <Home />
      ) : (
        <StatusPage
          title="404 - Page not found"
          message="The page you're looking for doesn't exist or has been moved."
        />
      )}
    </ErrorBoundary>
  );
}
