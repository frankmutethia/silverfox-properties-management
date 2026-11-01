import { useState } from "react";
import { ArrowLeft, ArrowRight, Building2, Eye, EyeOff, FileText, ShieldCheck } from "lucide-react";
import photo from "@/assets/precondo-ca-QHDFm084RNk-unsplash.jpg";
import logo from "@/assets/silverfox-logo.jpg";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ThemeToggle";

export default function StaffLogin({ recovery = false }: { recovery?: boolean }) {
  const [visible, setVisible] = useState(false);
  return (
    <main className="staff-login min-h-screen bg-background font-sans text-foreground">
      <section className="relative hidden overflow-hidden bg-brand-surface text-brand-surface-foreground lg:flex lg:flex-col lg:justify-between">
        <img
          src={photo}
          alt="Residential property interior"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-surface via-brand-surface/70 to-brand-surface/20" />
        <a href="/" className="relative m-12 flex w-fit items-center gap-3">
          <img src={logo} alt="Silverfox" className="h-12 rounded bg-white p-1" />
          <span className="text-xs font-semibold uppercase tracking-[.2em]">Staff portal</span>
        </a>
        <div className="relative p-12 xl:p-16">
          <p className="mb-5 text-xs font-semibold uppercase tracking-[.2em] text-accent">
            Every detail. Every home.
          </p>
          <h1 className="max-w-lg font-serif text-5xl leading-tight xl:text-6xl">
            Thoughtful care starts with you.
          </h1>
          <p className="mt-6 max-w-md text-sm leading-7 text-white/75">
            Your workspace for the properties we care for and the stories we share.
          </p>
          <div className="mt-10 space-y-4 border-t border-white/20 pt-7 text-sm">
            <p className="flex items-center gap-3">
              <Building2 className="size-4 text-accent" />
              Keep your property collection organised
            </p>
            <p className="flex items-center gap-3">
              <FileText className="size-4 text-accent" />
              Create useful stories for owners and residents
            </p>
            <p className="flex items-center gap-3">
              <ShieldCheck className="size-4 text-accent" />
              Bring a better standard to property care
            </p>
          </div>
        </div>
      </section>
      <section className="flex min-h-screen flex-col px-6 py-7 sm:px-12">
        <div className="flex items-center justify-between">
          <a
            href="/"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
          >
            <ArrowLeft className="size-4" />
            Back to website
          </a>
          <ThemeToggle />
        </div>
        <div className="mx-auto flex w-full max-w-[410px] flex-1 flex-col justify-center py-14">
          <img src={logo} alt="Silverfox Property Management" className="mb-9 h-14 w-fit rounded" />
          <p className="mb-3 text-xs font-bold uppercase tracking-[.18em] text-accent">
            Silverfox staff portal
          </p>
          <h2 className="text-3xl font-semibold tracking-tight">
            {recovery ? "Let’s get you back in." : "Welcome back."}
          </h2>
          <p className="mb-8 mt-3 text-sm leading-6 text-muted-foreground">
            {recovery
              ? "Contact your administrator for help accessing your staff account."
              : "Sign in to your workspace. A little more clarity, a better day of property care."}
          </p>
          {recovery ? (
            <div className="space-y-6">
              <p className="rounded-lg border border-border bg-secondary p-4 text-sm leading-6">
                Password recovery will be available when staff accounts are connected. No reset
                email is sent from this preview.
              </p>
              <Button asChild className="w-full">
                <a href="mailto:Info@silverfoxpropertymanagement.co.ke?subject=Staff%20account%20access">
                  Contact administrator
                </a>
              </Button>
              <a href="/staff/login" className="block text-center text-sm text-primary">
                Back to sign in
              </a>
            </div>
          ) : (
            <form
              onSubmit={(event) => {
                event.preventDefault();
                window.location.assign("/admin");
              }}
              className="space-y-5"
            >
              <label className="block text-sm font-medium">
                Work email
                <input
                  className="admin-input mt-2"
                  type="email"
                  autoComplete="username"
                  placeholder="you@silverfoxpropertymanagement.co.ke"
                  required
                />
              </label>
              <div>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <label htmlFor="staff-password" className="font-medium">
                    Password
                  </label>
                  <a href="/staff/forgot-password" className="text-primary hover:underline">
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <input
                    id="staff-password"
                    className="admin-input pr-12"
                    type={visible ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setVisible(!visible)}
                    aria-label={visible ? "Hide password" : "Show password"}
                    className="absolute right-1 top-1 flex size-10 items-center justify-center text-muted-foreground"
                  >
                    {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>
              <Button type="submit" className="h-12 w-full">
                Sign in <ArrowRight />
              </Button>
              <p className="border-t border-border pt-6 text-xs leading-6 text-muted-foreground">
                Need a staff account? Contact your Silverfox administrator.
              </p>
            </form>
          )}
        </div>
        <p className="text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Silverfox Property Management
        </p>
      </section>
    </main>
  );
}
