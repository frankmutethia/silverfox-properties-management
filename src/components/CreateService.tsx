import { useState, type FormEvent } from "react";
import { Plus, Upload, X } from "lucide-react";
import { serviceGroups } from "@/data/services";
import { cleanServiceHtml, saveLocalService, type LocalService } from "@/lib/local-services";
import ServiceEditor from "./ServiceEditor";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "./ui/dialog";

export default function CreateService({
  onCreated,
}: {
  onCreated: (services: LocalService[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<LocalService["image"]>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  function changeOpen(next: boolean) {
    if (loading) return;
    setOpen(next);
    setDescription("");
    setImage(null);
    setError("");
  }
  async function upload(file?: File) {
    if (!file) return;
    setError("");
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size > 600000) {
      setError("Choose a JPG, PNG or WebP image under 600 KB.");
      return;
    }
    setLoading(true);
    try {
      const src = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = () => reject(new Error("Image unreadable"));
        reader.onload = () => {
          const photo = new Image();
          photo.onload = () => resolve(String(reader.result));
          photo.onerror = () => reject(new Error("Invalid image"));
          photo.src = String(reader.result);
        };
        reader.readAsDataURL(file);
      });
      setImage({ src, alt: "" });
    } catch {
      setError("This image could not be read. Please choose another image.");
    } finally {
      setLoading(false);
    }
  }
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const title = String(data.get("title") ?? "").trim();
    const html = cleanServiceHtml(description);
    const text = new DOMParser().parseFromString(html, "text/html").body.textContent?.trim() ?? "";
    if (
      !title ||
      !text ||
      text.length > 10000 ||
      html.length > 50000 ||
      (image && !image.alt.trim())
    ) {
      setError(
        "Enter a title and description (up to 10,000 characters), and describe the image if uploaded.",
      );
      return;
    }
    try {
      const next = saveLocalService({
        id: crypto.randomUUID(),
        title,
        category: data.get("category") as "01" | "02",
        description: html,
        image,
      });
      onCreated(next);
      changeOpen(false);
      setNotice(`${title} saved as a local draft.`);
    } catch {
      setError(
        "Unable to save. Browser storage may be full or unavailable. Try a smaller image; your form is still here.",
      );
    }
  }
  return (
    <div>
      <Dialog open={open} onOpenChange={changeOpen}>
        <DialogTrigger asChild>
          <Button>
            <Plus />
            Create service
          </Button>
        </DialogTrigger>
        <DialogContent className="max-h-[90dvh] max-w-[calc(100%-2rem)] overflow-y-auto sm:max-w-3xl">
          <DialogTitle>Create service</DialogTitle>
          <DialogDescription>
            Add a service to a category. Fields marked * are required. Drafts are saved in this
            browser.
          </DialogDescription>
          <form onSubmit={submit} className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-medium">
                Service title *
                <input name="title" required maxLength={150} className="admin-input mt-2" />
              </label>
              <label className="text-sm font-medium">
                Service category *
                <select name="category" required className="admin-input mt-2">
                  {serviceGroups.map((group) => (
                    <option key={group.number} value={group.number}>
                      {group.title}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <ServiceEditor onChange={setDescription} />
            <div className="rounded-lg border border-dashed border-border p-4">
              <label className="block text-sm font-medium">
                <span className="mb-2 flex items-center gap-2">
                  <Upload className="size-4" />
                  Service image (optional)
                </span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  disabled={loading}
                  className="admin-input"
                  onChange={(event) => {
                    void upload(event.target.files?.[0]);
                    event.target.value = "";
                  }}
                />
              </label>
              <p className="mt-2 text-xs text-muted-foreground">
                Choose an image relevant to the selected category. JPG, PNG or WebP, up to 600 KB.
              </p>
              {image && (
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <img
                    src={image.src}
                    alt={image.alt || "Selected service image preview"}
                    className="h-24 w-32 rounded object-cover"
                  />
                  <label className="min-w-0 flex-1 text-sm">
                    Image description *
                    <input
                      required
                      maxLength={150}
                      value={image.alt}
                      className="admin-input mt-2"
                      onChange={(event) => setImage({ ...image, alt: event.target.value })}
                    />
                  </label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label="Remove service image"
                    disabled={loading}
                    onClick={() => setImage(null)}
                  >
                    <X />
                  </Button>
                </div>
              )}
            </div>
            {error && (
              <p role="alert" className="text-sm text-destructive">
                {error}
              </p>
            )}
            <div className="flex justify-end gap-3 border-t border-border pt-4">
              <Button
                type="button"
                variant="outline"
                disabled={loading}
                onClick={() => changeOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Reading image…" : "Create service"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      <p role="status" className="mt-2 max-w-xs text-xs text-muted-foreground">
        {notice}
      </p>
    </div>
  );
}
