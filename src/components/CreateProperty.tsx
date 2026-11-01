import { useState, type FormEvent } from "react";
import { Plus, Upload, X } from "lucide-react";
import type { Property, PropertyImage } from "@/data/properties";
import { saveLocalProperty } from "@/lib/local-properties";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "./ui/dialog";

export default function CreateProperty({
  properties,
  onCreated,
}: {
  properties: Property[];
  onCreated: (items: Property[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const [photos, setPhotos] = useState<PropertyImage[]>([]);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);
  async function upload(files: File[]) {
    setError("");
    if (
      photos.length + files.length > 5 ||
      files.some(
        (file) =>
          !["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size > 600000,
      )
    ) {
      setError("Choose up to 5 JPG, PNG or WebP photos, each under 600 KB.");
      return;
    }
    setLoading(true);
    try {
      const images = await Promise.all(
        files.map(
          (file) =>
            new Promise<PropertyImage>((resolve, reject) => {
              const reader = new FileReader();
              reader.onerror = () => reject(new Error("Unable to read photo"));
              reader.onload = () => {
                const image = new Image();
                image.onload = () =>
                  resolve({ src: String(reader.result), alt: file.name.replace(/\.[^.]+$/, "") });
                image.onerror = () => reject(new Error("Invalid image"));
                image.src = String(reader.result);
              };
              reader.readAsDataURL(file);
            }),
        ),
      );
      setPhotos((current) => [...current, ...images]);
    } catch {
      setError("A photo could not be read. Please choose a valid image.");
    } finally {
      setLoading(false);
    }
  }
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const data = new FormData(event.currentTarget);
    const value = (name: string) => String(data.get(name) ?? "").trim();
    const numeric = (name: string) => (value(name) === "" ? null : Number(value(name)));
    if (!value("name") || !value("reference") || !value("description") || !photos.length) {
      setError("Add a property name, reference, description and at least one photo.");
      return;
    }
    if (
      properties.some((item) => item.reference.toLowerCase() === value("reference").toLowerCase())
    ) {
      setError("This property reference already exists. Use a unique reference.");
      return;
    }
    const amount = numeric("amount");
    const property: Property = {
      slug: `local-${crypto.randomUUID()}`,
      reference: value("reference"),
      name: value("name"),
      type: value("type") as Property["type"],
      location: value("location") || null,
      price:
        amount === null ? null : { amount, currency: value("currency"), period: value("period") },
      areaSqm: numeric("area"),
      bedrooms: numeric("bedrooms"),
      bathrooms: numeric("bathrooms"),
      amenities: [
        ...new Set(
          value("amenities")
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),
        ),
      ],
      description: value("description"),
      images: photos as Property["images"],
    };
    try {
      onCreated(saveLocalProperty(property));
      setOpen(false);
      setPhotos([]);
      setNotice(`${property.name} created and saved in this browser.`);
    } catch {
      setError(
        "Unable to save: browser storage is full or unavailable. Try fewer or smaller photos. Your form is still here.",
      );
    }
  }
  const field = (name: string, label: string, required = false, type = "text") => (
    <label className="block text-sm font-medium">
      {label}
      {required && " *"}
      <input
        name={name}
        className="admin-input mt-2"
        required={required}
        type={type}
        min={type === "number" ? "0" : undefined}
        step={
          type === "number"
            ? name === "bedrooms" || name === "bathrooms"
              ? "1"
              : "0.01"
            : undefined
        }
        maxLength={type === "text" ? 150 : undefined}
      />
    </label>
  );
  return (
    <div>
      <Dialog
        open={open}
        onOpenChange={(next) => {
          if (!loading) {
            setOpen(next);
            setError("");
          }
        }}
      >
        <DialogTrigger asChild>
          <Button>
            <Plus />
            Create property
          </Button>
        </DialogTrigger>
        <DialogContent className="max-h-[90dvh] max-w-[calc(100%-2rem)] overflow-y-auto sm:max-w-3xl">
          <DialogTitle>Create property</DialogTitle>
          <DialogDescription>
            Add a home to your collection. Fields marked * are required. Saved locally in this
            browser.
          </DialogDescription>
          <form onSubmit={submit} className="space-y-6">
            <fieldset className="grid gap-4 sm:grid-cols-2">
              <legend className="mb-4 text-xs font-bold uppercase tracking-wider text-accent">
                Property details
              </legend>
              {field("name", "Property name", true)}
              {field("reference", "Reference", true)}
              <label className="block text-sm font-medium">
                Property type *
                <select name="type" className="admin-input mt-2">
                  <option>Apartment</option>
                  <option>House</option>
                </select>
              </label>
              {field("location", "Location")}
              <label className="block text-sm font-medium sm:col-span-2">
                Description *
                <textarea
                  name="description"
                  required
                  className="admin-input mt-2 min-h-28"
                  maxLength={10000}
                />
              </label>
            </fieldset>
            <fieldset className="grid gap-4 sm:grid-cols-3">
              <legend className="mb-4 text-xs font-bold uppercase tracking-wider text-accent">
                Pricing & specifications
              </legend>
              {field("amount", "Price", false, "number")}
              <label className="block text-sm font-medium">
                Currency
                <select name="currency" className="admin-input mt-2">
                  <option>KES</option>
                  <option>USD</option>
                </select>
              </label>
              <label className="block text-sm font-medium">
                Price period
                <select name="period" className="admin-input mt-2">
                  <option value="month">Per month</option>
                  <option value="year">Per year</option>
                  <option value="">Sale price</option>
                </select>
              </label>
              {field("bedrooms", "Bedrooms (0 for studio)", false, "number")}
              {field("bathrooms", "Bathrooms", false, "number")}
              {field("area", "Floor area (m²)", false, "number")}
              <p className="text-xs text-muted-foreground sm:col-span-3">
                Leave unconfirmed prices and specifications blank.
              </p>
            </fieldset>
            <label className="block text-sm font-medium">
              Amenities
              <input
                name="amenities"
                className="admin-input mt-2"
                placeholder="Parking, balcony, garden"
                maxLength={1500}
              />
              <span className="mt-2 block text-xs text-muted-foreground">
                Separate amenities with commas.
              </span>
            </label>
            <div>
              <label className="block text-sm font-medium">
                <span className="mb-2 flex items-center gap-2">
                  <Upload className="size-4" />
                  Property photos *
                </span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  disabled={loading || photos.length >= 5}
                  className="admin-input"
                  onChange={(event) => {
                    void upload(Array.from(event.target.files ?? []));
                    event.target.value = "";
                  }}
                />
              </label>
              <p className="mt-2 text-xs text-muted-foreground">
                Up to 5 photos, 600 KB each. The first photo is the cover.
              </p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {photos.map((photo, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 rounded-lg border border-border p-2"
                  >
                    <img src={photo.src} alt={photo.alt} className="size-16 rounded object-cover" />
                    <label className="min-w-0 flex-1 text-xs">
                      Photo {index + 1} description
                      <input
                        className="admin-input mt-1"
                        value={photo.alt}
                        required
                        onChange={(event) =>
                          setPhotos(
                            photos.map((item, i) =>
                              i === index ? { ...item, alt: event.target.value } : item,
                            ),
                          )
                        }
                      />
                    </label>
                    <Button
                      variant="ghost"
                      size="icon"
                      type="button"
                      aria-label={`Remove photo ${index + 1}`}
                      onClick={() => setPhotos(photos.filter((_, i) => i !== index))}
                    >
                      <X />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
            <div className="flex justify-end gap-3 border-t border-border pt-5">
              <Button
                type="button"
                variant="outline"
                disabled={loading}
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Reading photos…" : "Create property"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      <p role="status" className="mt-2 max-w-sm text-xs text-muted-foreground">
        {notice}
      </p>
    </div>
  );
}
