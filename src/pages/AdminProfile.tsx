import { useState, type FormEvent } from "react";
import { KeyRound, Save, UserRound } from "lucide-react";
import { toast } from "sonner";
import avatar from "@/assets/staff-avatar.svg";
import { changePassword, PASSWORD_MIN_LENGTH, updateProfile } from "@/lib/auth";
import type { ApiImage, ApiUser } from "@/lib/types";
import { useFieldErrors } from "@/lib/form-errors";
import { Button } from "@/components/ui/button";
import FieldError from "@/components/admin/FieldError";
import ImageField from "@/components/admin/ImageField";

export default function AdminProfile({
  user,
  onSave,
}: {
  user: ApiUser;
  onSave: (user: ApiUser) => void;
}) {
  return (
    <>
      <p className="admin-eyebrow">Your staff workspace</p>
      <h1 className="admin-title">Profile</h1>
      <p className="mb-8 mt-3 text-sm text-muted-foreground">
        Manage your display information, profile photo and password.
      </p>
      <div className="grid items-start gap-6 lg:grid-cols-[280px_1fr]">
        <aside className="admin-panel p-6 text-center">
          <img
            src={user.photo?.url ?? avatar}
            alt=""
            className="mx-auto size-28 rounded-full border-4 border-accent/15 object-cover"
          />
          <h2 className="mt-5 break-words text-xl font-semibold">{user.name}</h2>
          <p className="mt-2 break-words text-sm text-muted-foreground">{user.email}</p>
          {user.lastLoginAt && (
            <p className="mt-6 border-t border-border pt-5 text-xs text-muted-foreground">
              Last signed in{" "}
              {new Intl.DateTimeFormat("en-GB", {
                dateStyle: "medium",
                timeStyle: "short",
              }).format(new Date(user.lastLoginAt))}
            </p>
          )}
        </aside>
        <div className="space-y-6">
          <ProfileForm key={user.updatedAt} user={user} onSave={onSave} />
          <PasswordForm />
        </div>
      </div>
    </>
  );
}

function ProfileForm({ user, onSave }: { user: ApiUser; onSave: (user: ApiUser) => void }) {
  const form = useFieldErrors(["name", "contactEmail", "phone", "photo"]);
  const [photo, setPhoto] = useState<ApiImage | null>(user.photo);
  const [uploading, setUploading] = useState(false);
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy || uploading) return;
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    if (!name) {
      form.setErrors({ name: "Enter your display name." });
      return;
    }
    form.clear();
    setBusy(true);
    try {
      const saved = await updateProfile({
        name,
        contactEmail: String(data.get("contactEmail") ?? "").trim(),
        phone: String(data.get("phone") ?? "").trim(),
        photo: photo && {
          url: photo.url,
          publicId: photo.publicId,
          alt: photo.alt.trim() || `Photo of ${name}`,
        },
      });
      toast.success("Profile saved.");
      onSave(saved);
    } catch (error) {
      form.handle(error);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="admin-panel p-6 sm:p-8" onSubmit={submit} noValidate>
      <h2 className="flex items-center gap-2 text-lg font-semibold">
        <UserRound className="size-5 text-accent" />
        Personal details
      </h2>
      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <label className="text-sm font-medium sm:col-span-2">
          Display name *
          <input
            name="name"
            required
            maxLength={100}
            autoComplete="name"
            className="admin-input mt-2"
            defaultValue={user.name}
            {...form.describe("name")}
          />
          <FieldError form={form} name="name" />
        </label>
        <label className="text-sm font-medium">
          Contact email
          <input
            name="contactEmail"
            type="email"
            autoComplete="email"
            maxLength={255}
            className="admin-input mt-2"
            defaultValue={user.contactEmail}
            {...form.describe("contactEmail")}
          />
          <FieldError form={form} name="contactEmail" />
        </label>
        <label className="text-sm font-medium">
          Phone number
          <input
            name="phone"
            type="tel"
            maxLength={30}
            autoComplete="tel"
            className="admin-input mt-2"
            defaultValue={user.phone}
            {...form.describe("phone")}
          />
          <FieldError form={form} name="phone" />
        </label>
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        These contact details don’t change your sign-in email ({user.email}).
      </p>
      <div className="mt-6 border-t border-border pt-6">
        <ImageField
          label="Profile photo"
          folder="profile"
          value={photo}
          onChange={setPhoto}
          onBusyChange={setUploading}
          altLabel="Photo description"
          altRequired={false}
          error={form.errors["photo"]}
          errorId={form.messageId("photo")}
        />
      </div>
      <div className="mt-6 flex flex-wrap justify-end gap-3">
        <Button type="submit" disabled={busy || uploading}>
          <Save />
          {uploading ? "Uploading photo…" : busy ? "Saving…" : "Save profile"}
        </Button>
      </div>
    </form>
  );
}

function PasswordForm() {
  const form = useFieldErrors(["currentPassword", "newPassword", "confirmPassword"]);
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const element = event.currentTarget;
    const data = new FormData(element);
    const input = {
      currentPassword: String(data.get("currentPassword") ?? ""),
      newPassword: String(data.get("newPassword") ?? ""),
      confirmPassword: String(data.get("confirmPassword") ?? ""),
    };
    const problems: Record<string, string> = {};
    if (!input.currentPassword) problems["currentPassword"] = "Enter your current password.";
    if (input.newPassword.length < PASSWORD_MIN_LENGTH)
      problems["newPassword"] = `Use at least ${PASSWORD_MIN_LENGTH} characters.`;
    if (input.newPassword !== input.confirmPassword)
      problems["confirmPassword"] = "Passwords do not match.";
    form.setErrors(problems);
    if (Object.keys(problems).length) return;
    setBusy(true);
    try {
      toast.success(
        `${await changePassword(input)}. Other devices have been signed out; this one stays signed in.`,
      );
      element.reset();
    } catch (error) {
      // "Current password is incorrect" has no field prefix, so place it explicitly.
      if (/current password/i.test(error instanceof Error ? error.message : "")) {
        form.setErrors({ currentPassword: (error as Error).message });
      } else form.handle(error);
    } finally {
      setBusy(false);
    }
  }

  const field = (name: string, label: string, autoComplete: string) => (
    <label className="text-sm font-medium">
      {label}
      <input
        name={name}
        type="password"
        autoComplete={autoComplete}
        maxLength={200}
        className="admin-input mt-2"
        {...form.describe(name)}
      />
      <FieldError form={form} name={name} />
    </label>
  );

  return (
    <form className="admin-panel p-6 sm:p-8" onSubmit={submit} noValidate>
      <h2 className="flex items-center gap-2 text-lg font-semibold">
        <KeyRound className="size-5 text-accent" />
        Change password
      </h2>
      <div className="mt-6 grid gap-5 sm:grid-cols-3">
        {field("currentPassword", "Current password", "current-password")}
        {field("newPassword", "New password", "new-password")}
        {field("confirmPassword", "Confirm new password", "new-password")}
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        At least {PASSWORD_MIN_LENGTH} characters. Changing it signs out your other devices.
      </p>
      <div className="mt-6 flex justify-end">
        <Button type="submit" disabled={busy}>
          {busy ? "Saving…" : "Change password"}
        </Button>
      </div>
    </form>
  );
}
