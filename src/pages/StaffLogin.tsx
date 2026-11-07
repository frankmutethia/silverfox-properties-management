import { useState, type FormEvent, type ReactNode } from "react";
import { ArrowLeft, ArrowRight, Building2, Eye, EyeOff, FileText, ShieldCheck } from "lucide-react";
import photo from "@/assets/precondo-ca-QHDFm084RNk-unsplash.jpg";
import logo from "@/assets/silverfox-logo.jpg";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ThemeToggle";
import FieldError from "@/components/admin/FieldError";
import { forgotPassword, login, PASSWORD_MIN_LENGTH, resetPassword } from "@/lib/auth";
import { useFieldErrors } from "@/lib/form-errors";
import { toApiError } from "@/lib/api";

type View = "login" | "forgot" | "reset";

const headings: Record<View, { title: string; intro: string }> = {
  login: {
    title: "Welcome back.",
    intro: "Sign in to your workspace. A little more clarity, a better day of property care.",
  },
  forgot: {
    title: "Let’s get you back in.",
    intro: "Enter your work email and we’ll send you a link to choose a new password.",
  },
  reset: {
    title: "Choose a new password.",
    intro: `Use at least ${PASSWORD_MIN_LENGTH} characters. Resetting signs you out on every device.`,
  },
};

/** Only same-site admin paths are allowed as the post-login destination. */
function nextPath() {
  const next = new URLSearchParams(window.location.search).get("next") ?? "";
  return /^\/admin(\/[\w-]*)*$/.test(next) ? next : "/admin";
}

export default function StaffLogin({ view }: { view: View }) {
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
          <h2 className="text-3xl font-semibold tracking-tight">{headings[view].title}</h2>
          <p className="mb-8 mt-3 text-sm leading-6 text-muted-foreground">
            {headings[view].intro}
          </p>
          {view === "login" ? <LoginForm /> : view === "forgot" ? <ForgotForm /> : <ResetForm />}
        </div>
        <p className="text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Silverfox Property Management
        </p>
      </section>
    </main>
  );
}

function Alert({ children }: { children: ReactNode }) {
  return (
    <p role="alert" className="text-sm text-destructive">
      {children}
    </p>
  );
}

function PasswordInput({
  id,
  name,
  autoComplete,
  describe,
  minLength,
}: {
  id: string;
  name: string;
  autoComplete: string;
  describe: ReturnType<ReturnType<typeof useFieldErrors>["describe"]>;
  minLength?: number;
}) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative">
      <input
        id={id}
        name={name}
        className="admin-input pr-12"
        type={visible ? "text" : "password"}
        autoComplete={autoComplete}
        required
        minLength={minLength}
        maxLength={200}
        {...describe}
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
  );
}

function LoginForm() {
  const form = useFieldErrors(["email", "password"]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setBusy(true);
    setError("");
    form.clear();
    try {
      await login(
        String(data.get("email") ?? "").trim(),
        String(data.get("password") ?? ""),
        data.get("remember") === "on",
      );
      window.location.assign(nextPath());
    } catch (loginError) {
      // 401 wrong credentials, 403 deactivated, 429 too many attempts: show the API's words.
      setError(toApiError(loginError).message);
      setBusy(false);
    }
  }
  return (
    <form onSubmit={submit} className="space-y-5">
      <label className="block text-sm font-medium">
        Work email
        <input
          name="email"
          className="admin-input mt-2"
          type="email"
          autoComplete="username"
          placeholder="you@silverfoxpropertymanagement.co.ke"
          required
          maxLength={255}
          {...form.describe("email")}
        />
        <FieldError form={form} name="email" />
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
        <PasswordInput
          id="staff-password"
          name="password"
          autoComplete="current-password"
          describe={form.describe("password")}
        />
        <FieldError form={form} name="password" />
      </div>
      <label className="flex items-center gap-3 text-sm">
        <input name="remember" type="checkbox" className="size-4 accent-primary" />
        Remember me for 30 days
      </label>
      {error && <Alert>{error}</Alert>}
      <Button type="submit" className="h-12 w-full" disabled={busy}>
        {busy ? "Signing in…" : "Sign in"} <ArrowRight />
      </Button>
      <p className="border-t border-border pt-6 text-xs leading-6 text-muted-foreground">
        Need a staff account? Contact your Silverfox administrator.
      </p>
    </form>
  );
}

function ForgotForm() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const email = String(new FormData(event.currentTarget).get("email") ?? "").trim();
    setBusy(true);
    setError("");
    try {
      setMessage(await forgotPassword(email));
    } catch (requestError) {
      setError(toApiError(requestError).message);
    } finally {
      setBusy(false);
    }
  }
  if (message)
    return (
      <div className="space-y-6">
        <p
          role="status"
          className="rounded-lg border border-border bg-secondary p-4 text-sm leading-6"
        >
          {message} The link is valid for 60 minutes and can be used once.
        </p>
        <a href="/staff/login" className="block text-center text-sm text-primary">
          Back to sign in
        </a>
      </div>
    );
  return (
    <form onSubmit={submit} className="space-y-5">
      <label className="block text-sm font-medium">
        Work email
        <input
          name="email"
          className="admin-input mt-2"
          type="email"
          autoComplete="username"
          required
          maxLength={255}
        />
      </label>
      {error && <Alert>{error}</Alert>}
      <Button type="submit" className="h-12 w-full" disabled={busy}>
        {busy ? "Sending…" : "Send reset link"}
      </Button>
      <a href="/staff/login" className="block text-center text-sm text-primary">
        Back to sign in
      </a>
    </form>
  );
}

function ResetForm() {
  const token = new URLSearchParams(window.location.search).get("token") ?? "";
  const form = useFieldErrors(["newPassword", "confirmPassword", "token"]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const newPassword = String(data.get("newPassword") ?? "");
    const confirmPassword = String(data.get("confirmPassword") ?? "");
    const problems: Record<string, string> = {};
    if (newPassword.length < PASSWORD_MIN_LENGTH)
      problems["newPassword"] = `Use at least ${PASSWORD_MIN_LENGTH} characters.`;
    if (newPassword !== confirmPassword) problems["confirmPassword"] = "Passwords do not match.";
    form.setErrors(problems);
    setError("");
    if (Object.keys(problems).length) return;
    setBusy(true);
    try {
      setMessage(await resetPassword({ token, newPassword, confirmPassword }));
    } catch (resetError) {
      setError(toApiError(resetError).message);
    } finally {
      setBusy(false);
    }
  }
  if (!token)
    return (
      <div className="space-y-6">
        <Alert>
          This reset link is incomplete. Request a new link and use it within 60 minutes.
        </Alert>
        <a href="/staff/forgot-password" className="block text-center text-sm text-primary">
          Request a new link
        </a>
      </div>
    );
  if (message)
    return (
      <div className="space-y-6">
        <p
          role="status"
          className="rounded-lg border border-border bg-secondary p-4 text-sm leading-6"
        >
          {message}
        </p>
        <Button asChild className="h-12 w-full">
          <a href="/staff/login">
            Sign in <ArrowRight />
          </a>
        </Button>
      </div>
    );
  return (
    <form onSubmit={submit} className="space-y-5" noValidate>
      <div>
        <label htmlFor="new-password" className="mb-2 block text-sm font-medium">
          New password
        </label>
        <PasswordInput
          id="new-password"
          name="newPassword"
          autoComplete="new-password"
          minLength={PASSWORD_MIN_LENGTH}
          describe={form.describe("newPassword")}
        />
        <FieldError form={form} name="newPassword" />
      </div>
      <div>
        <label htmlFor="confirm-password" className="mb-2 block text-sm font-medium">
          Confirm new password
        </label>
        <PasswordInput
          id="confirm-password"
          name="confirmPassword"
          autoComplete="new-password"
          describe={form.describe("confirmPassword")}
        />
        <FieldError form={form} name="confirmPassword" />
      </div>
      {error && (
        <div className="space-y-2">
          <Alert>{error}</Alert>
          <a href="/staff/forgot-password" className="text-sm text-primary">
            Request a new link
          </a>
        </div>
      )}
      <Button type="submit" className="h-12 w-full" disabled={busy}>
        {busy ? "Saving…" : "Reset password"}
      </Button>
    </form>
  );
}
