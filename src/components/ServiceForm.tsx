import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { notifyCreated, notifyUpdated } from "@/lib/notify";
import { createService, serviceIcons, updateService } from "@/lib/services";
import { plainText } from "@/lib/rich-text";
import type {
  ApiImage,
  ApiService,
  ApiServiceCategory,
  PublicationStatus,
  ServiceCategoryNumber,
  ServiceInput,
} from "@/lib/types";
import { useFieldErrors } from "@/lib/form-errors";
import ServiceEditor from "./ServiceEditor";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "./ui/dialog";
import FieldError from "./admin/FieldError";
import ImageField from "./admin/ImageField";

const MAX_TEXT = 10_000;

/** Create or edit a service. `service` null = create. */
export default function ServiceForm({
  service,
  categories,
  defaultCategory,
  open,
  onOpenChange,
  onSaved,
}: {
  service: ApiService | null;
  categories: ApiServiceCategory[];
  defaultCategory: ServiceCategoryNumber;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved: (service: ApiService) => void;
}) {
  const [busy, setBusy] = useState(false);
  return (
    <Dialog open={open} onOpenChange={(next) => !busy && onOpenChange(next)}>
      <DialogContent className="max-h-[90dvh] max-w-[calc(100%-2rem)] overflow-y-auto sm:max-w-3xl">
        <DialogTitle>{service ? "Edit service" : "Create service"}</DialogTitle>
        <DialogDescription>
          Fields marked * are required. New services are added at the end of their category.
        </DialogDescription>
        <ServiceFormBody
          key={service?._id ?? "new"}
          service={service}
          categories={categories}
          defaultCategory={defaultCategory}
          busy={busy}
          setBusy={setBusy}
          onCancel={() => onOpenChange(false)}
          onSaved={(saved) => {
            onSaved(saved);
            onOpenChange(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}

function ServiceFormBody({
  service,
  categories,
  defaultCategory,
  busy,
  setBusy,
  onCancel,
  onSaved,
}: {
  service: ApiService | null;
  categories: ApiServiceCategory[];
  defaultCategory: ServiceCategoryNumber;
  busy: boolean;
  setBusy: (busy: boolean) => void;
  onCancel: () => void;
  onSaved: (service: ApiService) => void;
}) {
  const form = useFieldErrors(["title", "category", "icon", "description", "image"]);
  const [description, setDescription] = useState(service?.description ?? "");
  const [image, setImage] = useState<ApiImage | null>(service?.image ?? null);
  const [uploading, setUploading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy || uploading) return;
    const data = new FormData(event.currentTarget);
    const status = ((event.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null)
      ?.value as PublicationStatus | undefined;
    const title = String(data.get("title") ?? "").trim();
    const text = plainText(description);
    const problems: Record<string, string> = {};
    if (!title) problems["title"] = "Enter a service title.";
    if (!text || text.length > MAX_TEXT)
      problems["description"] =
        `Write a description of up to ${MAX_TEXT.toLocaleString("en-GB")} characters.`;
    if (image && !image.alt.trim()) problems["image"] = "Describe the image.";
    form.setErrors(problems);
    if (Object.keys(problems).length) {
      toast.error("Please correct the highlighted fields.");
      return;
    }
    const input: ServiceInput = {
      title,
      category: String(data.get("category")) as ServiceCategoryNumber,
      icon: String(data.get("icon") ?? "") || null,
      description,
      image: image && { ...image, alt: image.alt.trim() },
    };
    setBusy(true);
    try {
      const saved = service
        ? await updateService(service._id, input)
        : await createService({ ...input, status: status ?? "draft" });
      const item = {
        kind: "Service" as const,
        name: saved.title,
        status: saved.status,
        href: "/#management",
      };
      if (service) notifyUpdated(item);
      else notifyCreated(item);
      onSaved(saved);
    } catch (error) {
      form.handle(error);
    } finally {
      setBusy(false);
    }
  }

  const disabled = busy || uploading;
  return (
    <form onSubmit={submit} className="space-y-5" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-medium sm:col-span-2">
          Service title *
          <input
            name="title"
            required
            maxLength={150}
            defaultValue={service?.title ?? ""}
            className="admin-input mt-2"
            {...form.describe("title")}
          />
          <FieldError form={form} name="title" />
        </label>
        <label className="text-sm font-medium">
          Service category *
          <select
            name="category"
            defaultValue={service?.category ?? defaultCategory}
            className="admin-input mt-2"
            {...form.describe("category")}
          >
            {categories.map((category) => (
              <option key={category.number} value={category.number}>
                {category.title}
              </option>
            ))}
          </select>
          <FieldError form={form} name="category" />
        </label>
        <label className="text-sm font-medium">
          Icon
          <select
            name="icon"
            defaultValue={service?.icon ?? ""}
            className="admin-input mt-2"
            {...form.describe("icon")}
          >
            <option value="">Default (briefcase)</option>
            {Object.keys(serviceIcons).map((name) => (
              <option key={name} value={name}>
                {name.replace(/([a-z])([A-Z0-9])/g, "$1 $2")}
              </option>
            ))}
            {service?.icon && !(service.icon in serviceIcons) && (
              <option value={service.icon}>{service.icon}</option>
            )}
          </select>
          <FieldError form={form} name="icon" />
        </label>
      </div>
      <ServiceEditor
        label="Description"
        initialHtml={service?.description ?? ""}
        onChange={setDescription}
        maxText={MAX_TEXT}
        error={form.errors["description"]}
        errorId={form.messageId("description")}
      />
      <ImageField
        label="Service image (optional)"
        folder="services"
        value={image}
        onChange={setImage}
        onBusyChange={setUploading}
        error={form.errors["image"]}
        errorId={form.messageId("image")}
      />
      <div className="flex flex-wrap justify-end gap-3 border-t border-border pt-4">
        <Button type="button" variant="outline" disabled={busy} onClick={onCancel}>
          Cancel
        </Button>
        {service ? (
          <Button type="submit" disabled={disabled}>
            {busy ? "Saving…" : "Save changes"}
          </Button>
        ) : (
          <>
            <Button type="submit" value="draft" variant="outline" disabled={disabled}>
              {busy ? "Saving…" : "Save draft"}
            </Button>
            <Button type="submit" value="published" disabled={disabled}>
              Save and publish
            </Button>
          </>
        )}
      </div>
    </form>
  );
}
