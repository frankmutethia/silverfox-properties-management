import { useId, useState, type FormEvent } from "react";
import { UserPlus, UsersRound } from "lucide-react";
import { toast } from "sonner";
import avatar from "@/assets/staff-avatar.svg";
import { PASSWORD_MIN_LENGTH } from "@/lib/auth";
import { createUser, listUsers } from "@/lib/users";
import type { ApiUser } from "@/lib/types";
import { useFieldErrors } from "@/lib/form-errors";
import { useQuery } from "@/lib/use-query";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { LineSkeletons, LoadError } from "@/components/QueryState";
import PasswordInput from "@/components/PasswordInput";
import FieldError from "@/components/admin/FieldError";
import StatusBadge from "@/components/admin/StatusBadge";

const formatDate = (value: string | null, withTime = false) =>
  value
    ? new Intl.DateTimeFormat("en-GB", {
        dateStyle: "medium",
        ...(withTime ? { timeStyle: "short" as const } : {}),
      }).format(new Date(value))
    : "Never";

/** Staff accounts: everyone who can sign in to the workspace. Every account is an admin. */
export default function AdminUsers({ user }: { user: ApiUser | null }) {
  const result = useQuery((signal) => listUsers(signal), []);
  const [open, setOpen] = useState(false);
  const users = result.data ?? [];

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="admin-eyebrow">Your team</p>
          <h1 className="admin-title">User Management</h1>
        </div>
        <Button onClick={() => setOpen(true)}>
          <UserPlus />
          Add admin
        </Button>
      </div>
      <p className="mb-8 mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
        Everyone listed here can sign in to the Silverfox workspace with full admin access.
      </p>

      <section className="admin-panel overflow-hidden">
        <div className="flex items-center justify-between gap-3 border-b border-border p-5">
          <div className="flex items-center gap-3">
            <UsersRound className="size-5 text-accent" aria-hidden="true" />
            <h2 className="font-semibold">Staff accounts</h2>
          </div>
          {result.data && (
            <span className="text-xs text-muted-foreground" role="status">
              {users.length} {users.length === 1 ? "account" : "accounts"}
            </span>
          )}
        </div>
        {!result.data && result.loading ? (
          <LineSkeletons lines={4} className="p-5" />
        ) : !result.data && result.error ? (
          <LoadError error={result.error} onRetry={result.reload} />
        ) : (
          <div className="overflow-x-auto" aria-busy={result.loading}>
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-secondary/50 text-[10px] uppercase tracking-wider text-muted-foreground">
                <tr>
                  {["Name", "Sign-in email", "Status", "Last signed in", "Added"].map((label) => (
                    <th key={label} scope="col" className="px-5 py-4">
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {users.map((account) => (
                  <tr key={account._id} className="hover:bg-secondary/30">
                    <td className="p-5">
                      <div className="flex items-center gap-3">
                        <img
                          src={account.photo?.url ?? avatar}
                          alt=""
                          className="size-10 rounded-full border border-border object-cover"
                        />
                        <div className="min-w-0">
                          <p className="truncate font-semibold">{account.name}</p>
                          {account._id === user?._id && <p className="text-xs text-accent">You</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 text-muted-foreground">{account.email}</td>
                    <td className="px-5">
                      {account.isActive ? (
                        <StatusBadge status="published" label="Active" />
                      ) : (
                        <StatusBadge status="draft" label="Deactivated" />
                      )}
                    </td>
                    <td className="px-5 text-muted-foreground">
                      {formatDate(account.lastLoginAt, true)}
                    </td>
                    <td className="px-5 text-muted-foreground">{formatDate(account.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <AddAdminDialog
        open={open}
        onOpenChange={setOpen}
        onCreated={(created) => {
          result.setData((current) => (current ? [...current, created] : [created]));
          toast.success("Admin added", {
            description: `${created.name} can now sign in with ${created.email} and the password you set.`,
          });
        }}
      />
    </>
  );
}

function AddAdminDialog({
  open,
  onOpenChange,
  onCreated,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: (user: ApiUser) => void;
}) {
  const [busy, setBusy] = useState(false);
  return (
    <Dialog open={open} onOpenChange={(next) => !busy && onOpenChange(next)}>
      <DialogContent className="max-h-[90dvh] max-w-[calc(100%-2rem)] overflow-y-auto sm:max-w-lg">
        <DialogTitle>Add an admin</DialogTitle>
        <DialogDescription>
          Create a sign-in for a colleague. Share the password with them securely; they can change
          it from their Profile after signing in.
        </DialogDescription>
        {open && (
          <AddAdminForm
            busy={busy}
            setBusy={setBusy}
            onCancel={() => onOpenChange(false)}
            onCreated={(user) => {
              onCreated(user);
              onOpenChange(false);
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function AddAdminForm({
  busy,
  setBusy,
  onCancel,
  onCreated,
}: {
  busy: boolean;
  setBusy: (busy: boolean) => void;
  onCancel: () => void;
  onCreated: (user: ApiUser) => void;
}) {
  const form = useFieldErrors(["name", "email", "password", "confirmPassword"]);
  const ids = useId();

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const data = new FormData(event.currentTarget);
    const input = {
      name: String(data.get("name") ?? "").trim(),
      email: String(data.get("email") ?? "").trim(),
      password: String(data.get("password") ?? ""),
      confirmPassword: String(data.get("confirmPassword") ?? ""),
    };
    const problems: Record<string, string> = {};
    if (!input.name) problems["name"] = "Enter their name.";
    if (!/^\S+@\S+\.\S+$/.test(input.email)) problems["email"] = "Enter a valid email address.";
    if (input.password.length < PASSWORD_MIN_LENGTH)
      problems["password"] = `Use at least ${PASSWORD_MIN_LENGTH} characters.`;
    if (input.password !== input.confirmPassword)
      problems["confirmPassword"] = "Passwords do not match.";
    form.setErrors(problems);
    if (Object.keys(problems).length) return;
    setBusy(true);
    try {
      onCreated(await createUser(input));
    } catch (error) {
      form.handle(error);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-5" noValidate>
      <label className="block text-sm font-medium">
        Full name *
        <input
          name="name"
          required
          maxLength={100}
          autoComplete="off"
          className="admin-input mt-2"
          {...form.describe("name")}
        />
        <FieldError form={form} name="name" />
      </label>
      <label className="block text-sm font-medium">
        Sign-in email *
        <input
          name="email"
          type="email"
          required
          maxLength={255}
          autoComplete="off"
          placeholder="name@silverfoxpropertymanagement.co.ke"
          className="admin-input mt-2"
          {...form.describe("email")}
        />
        <FieldError form={form} name="email" />
      </label>
      <div className="text-sm font-medium">
        <label htmlFor={`${ids}-password`}>Password *</label>
        <PasswordInput
          id={`${ids}-password`}
          name="password"
          label="Password"
          autoComplete="new-password"
          minLength={PASSWORD_MIN_LENGTH}
          className="mt-2"
          {...form.describe("password")}
        />
        <FieldError form={form} name="password" />
      </div>
      <div className="text-sm font-medium">
        <label htmlFor={`${ids}-confirm`}>Confirm password *</label>
        <PasswordInput
          id={`${ids}-confirm`}
          name="confirmPassword"
          label="Confirm password"
          autoComplete="new-password"
          className="mt-2"
          {...form.describe("confirmPassword")}
        />
        <FieldError form={form} name="confirmPassword" />
      </div>
      <p className="text-xs text-muted-foreground">
        At least {PASSWORD_MIN_LENGTH} characters. The new admin gets the same access as you.
      </p>
      <div className="flex justify-end gap-3 border-t border-border pt-4">
        <Button type="button" variant="outline" disabled={busy} onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={busy}>
          <UserPlus />
          {busy ? "Creating…" : "Create admin"}
        </Button>
      </div>
    </form>
  );
}
