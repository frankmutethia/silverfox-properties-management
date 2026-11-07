import type { ReactNode } from "react";

export default function StatusPage({
  title,
  message,
  children,
}: {
  title: string;
  message: string;
  children?: ReactNode;
}) {
  return (
    <main
      id="main-content"
      className="flex min-h-[70vh] items-center justify-center bg-background px-4 py-16 text-foreground"
    >
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

export function NotFoundPage() {
  return (
    <StatusPage
      title="404 - Page not found"
      message="The page you're looking for doesn't exist or has been moved."
    />
  );
}
