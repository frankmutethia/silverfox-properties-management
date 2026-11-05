import { useState } from "react";
import { UserRound, Save } from "lucide-react";
import avatar from "@/assets/staff-avatar.svg";
import { type StaffProfile, saveProfile } from "@/lib/profile";
import { readBlogImage } from "@/lib/blogs";
import { Button } from "@/components/ui/button";

export default function AdminProfile({
  profile,
  onSave,
}: {
  profile: StaffProfile;
  onSave: (profile: StaffProfile) => void;
}) {
  const [form, setForm] = useState(profile);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  async function upload(file?: File) {
    if (!file) return;
    setError("");
    setNotice("");
    setBusy(true);
    try {
      const photo = await readBlogImage(file);
      setForm((current) => ({ ...current, photo }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to read photo.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <p className="admin-eyebrow">Your staff workspace</p>
      <h1 className="admin-title">Profile</h1>
      <p className="mb-8 mt-3 text-sm text-muted-foreground">
        Manage your display information and profile photo.
      </p>
      <div className="grid items-start gap-6 lg:grid-cols-[280px_1fr]">
        <aside className="admin-panel p-6 text-center">
          <img
            src={form.photo ?? avatar}
            alt="Profile preview"
            className="mx-auto size-28 rounded-full border-4 border-accent/15 object-cover"
          />
          <h2 className="mt-5 break-words text-xl font-semibold">{form.name || "Your name"}</h2>
          <p className="mt-2 text-sm text-muted-foreground">Staff workspace</p>
          <div className="mt-6 border-t border-border pt-5 text-left text-sm leading-6 text-muted-foreground">
            Profile details are saved in this browser. Account authentication and shared profiles
            are not connected yet.
          </div>
        </aside>
        <form
          className="admin-panel p-6 sm:p-8"
          onSubmit={(event) => {
            event.preventDefault();
            setError("");
            setNotice("");
            if (busy) return;
            if (!form.name.trim()) {
              setError("Enter your display name.");
              return;
            }
            try {
              const saved = saveProfile({
                ...form,
                name: form.name.trim(),
                email: form.email.trim(),
                phone: form.phone.trim(),
              });
              onSave(saved);
              setForm(saved);
              setNotice("Profile saved in this browser.");
            } catch {
              setError(
                "Unable to save your profile. Check your details or try a smaller photo if browser storage is full.",
              );
            }
          }}
        >
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            <UserRound className="size-5 text-accent" />
            Personal details
          </h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <label className="text-sm font-medium sm:col-span-2">
              Display name *
              <input
                required
                maxLength={100}
                autoComplete="name"
                className="admin-input mt-2"
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
              />
            </label>
            <label className="text-sm font-medium">
              Email address
              <input
                type="email"
                autoComplete="email"
                className="admin-input mt-2"
                value={form.email}
                onChange={(event) => setForm({ ...form, email: event.target.value })}
              />
            </label>
            <label className="text-sm font-medium">
              Phone number
              <input
                type="tel"
                maxLength={30}
                autoComplete="tel"
                className="admin-input mt-2"
                value={form.phone}
                onChange={(event) => setForm({ ...form, phone: event.target.value })}
              />
            </label>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            These contact details do not change your sign-in credentials.
          </p>
          <div className="mt-6 border-t border-border pt-6">
            <label className="block text-sm font-medium">
              Profile photo
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                disabled={busy}
                className="admin-input mt-2"
                onChange={(event) => {
                  void upload(event.target.files?.[0]);
                  event.target.value = "";
                }}
              />
            </label>
            <p className="mt-2 text-xs text-muted-foreground">JPG, PNG or WebP, up to 600 KB.</p>
            {form.photo && (
              <Button
                type="button"
                variant="ghost"
                disabled={busy}
                className="mt-2"
                onClick={() => setForm({ ...form, photo: null })}
              >
                Remove photo
              </Button>
            )}
          </div>
          {error && (
            <p role="alert" className="mt-5 text-sm text-destructive">
              {error}
            </p>
          )}
          <p role="status" className="mt-5 text-sm text-muted-foreground">
            {busy ? "Reading photo…" : notice}
          </p>
          <div className="mt-4 flex flex-wrap justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              disabled={busy}
              onClick={() => {
                setForm(profile);
                setError("");
                setNotice("");
              }}
            >
              Reset changes
            </Button>
            <Button type="submit" disabled={busy}>
              <Save />
              Save profile
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
