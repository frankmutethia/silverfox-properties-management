import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { ApiError } from "@/lib/api";
import { createProperty, propertyCategories, updateProperty } from "@/lib/properties";
import type {
  ApiProperty,
  PropertyCategory,
  PropertyImage,
  PropertyInput,
  PropertyType,
  PublicationStatus,
} from "@/lib/types";
import { useFieldErrors, type FieldErrors } from "@/lib/form-errors";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "./ui/dialog";
import FieldError from "./admin/FieldError";
import PhotoListField from "./admin/PhotoListField";

const fields = [
  "name",
  "reference",
  "category",
  "type",
  "location",
  "neighbourhood",
  "description",
  "amount",
  "currency",
  "period",
  "bedrooms",
  "bathrooms",
  "area",
  "amenities",
  "photos",
] as const;

const aliases = {
  "price.amount": "amount",
  "price.currency": "currency",
  "price.period": "period",
  price: "amount",
  areaSqm: "area",
  images: "photos",
};

/** Create or edit a property. `property` null = create. */
export default function PropertyForm({
  property,
  open,
  onOpenChange,
  onSaved,
}: {
  property: ApiProperty | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved: (property: ApiProperty) => void;
}) {
  const [busy, setBusy] = useState(false);
  return (
    <Dialog open={open} onOpenChange={(next) => !busy && onOpenChange(next)}>
      <DialogContent className="max-h-[90dvh] max-w-[calc(100%-2rem)] overflow-y-auto sm:max-w-3xl">
        <DialogTitle>{property ? `Edit ${property.name}` : "Create property"}</DialogTitle>
        <DialogDescription>
          Fields marked * are required. Leave unconfirmed prices and specifications blank.
        </DialogDescription>
        <PropertyFormBody
          key={property?._id ?? "new"}
          property={property}
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

function PropertyFormBody({
  property,
  busy,
  setBusy,
  onCancel,
  onSaved,
}: {
  property: ApiProperty | null;
  busy: boolean;
  setBusy: (busy: boolean) => void;
  onCancel: () => void;
  onSaved: (property: ApiProperty) => void;
}) {
  const form = useFieldErrors(fields, aliases);
  const [category, setCategory] = useState<string>(property ? (property.category ?? "") : "sale");
  const [photos, setPhotos] = useState<PropertyImage[]>(property?.images ?? []);
  const [uploading, setUploading] = useState(false);
  // Imported listings may not have a confirmed category or location yet; editing other
  // details shouldn't force staff to invent them.
  const categoryRequired = !property || property.category !== null;
  const locationRequired = !property || property.location !== null;

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy || uploading) return;
    const data = new FormData(event.currentTarget);
    const text = (name: string) => String(data.get(name) ?? "").trim();
    const number = (name: string) => (text(name) === "" ? null : Number(text(name)));
    const status = ((event.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null)
      ?.value as PublicationStatus | undefined;

    const problems: Record<string, string> = {};
    if (!text("name")) problems["name"] = "Enter the property name.";
    if (!text("reference")) problems["reference"] = "Enter a unique reference, e.g. SF-006.";
    if (categoryRequired && !category) problems["category"] = "Choose a listing category.";
    if (locationRequired && !text("location")) problems["location"] = "Enter the location.";
    if (!text("description")) problems["description"] = "Describe the property.";
    if (photos.some((photo) => !photo.alt.trim())) problems["photos"] = "Describe every photo.";
    if (status === "published" && !photos.length)
      problems["photos"] = "Add at least one photo before publishing.";
    const amenities = [
      ...new Set(
        text("amenities")
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
      ),
    ];
    if (amenities.length > 40 || amenities.some((item) => item.length > 80))
      problems["amenities"] = "Use up to 40 amenities of up to 80 characters each.";
    form.setErrors(problems);
    if (Object.keys(problems).length) {
      toast.error("Please correct the highlighted fields.");
      return;
    }

    const amount = number("amount");
    const input: PropertyInput = {
      name: text("name"),
      reference: text("reference"),
      type: text("type") as PropertyType,
      neighbourhood: text("neighbourhood") || null,
      description: text("description"),
      price:
        amount === null || category === "managed"
          ? null
          : {
              amount,
              currency: text("currency") || "KES",
              period: category === "rent" ? (text("period") as "month" | "year") : "",
            },
      bedrooms: number("bedrooms"),
      bathrooms: number("bathrooms"),
      areaSqm: number("area"),
      amenities,
      images: photos.map(({ url, publicId, alt, position }) => ({
        url,
        publicId,
        alt: alt.trim(),
        ...(position ? { position } : {}),
      })),
    };
    if (category) input.category = category as PropertyCategory;
    if (text("location")) input.location = text("location");

    setBusy(true);
    try {
      const saved = property
        ? await updateProperty(property._id, input)
        : await createProperty({ ...input, status: status ?? "draft" });
      toast.success(
        property
          ? `${saved.name} updated.`
          : `${saved.name} created as ${saved.status === "published" ? "a published listing" : "a draft"}.`,
      );
      onSaved(saved);
    } catch (error) {
      if (error instanceof ApiError && error.status === 409 && /reference/i.test(error.message)) {
        form.setErrors({ reference: "This reference is already used by another property." });
        toast.error(error.message);
      } else form.handle(error);
    } finally {
      setBusy(false);
    }
  }

  const disabled = busy || uploading;
  return (
    <form onSubmit={submit} className="space-y-6" noValidate>
      <fieldset className="grid gap-4 sm:grid-cols-2">
        <legend className="mb-4 text-xs font-bold uppercase tracking-wider text-accent">
          Property details
        </legend>
        <TextField
          form={form}
          name="name"
          label="Property name"
          required
          maxLength={150}
          defaultValue={property?.name}
        />
        <TextField
          form={form}
          name="reference"
          label="Reference"
          required
          maxLength={40}
          defaultValue={property?.reference}
          placeholder="SF-006"
        />
        <label className="block text-sm font-medium sm:col-span-2">
          Listing category{categoryRequired && " *"}
          <select
            name="category"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="admin-input mt-2"
            {...form.describe("category")}
          >
            {!category && <option value="">Choose a category</option>}
            {Object.entries(propertyCategories).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <span className="mt-2 block text-xs font-normal text-muted-foreground">
            The purpose of the listing. Property type describes the building itself.
          </span>
          <FieldError form={form} name="category" />
        </label>
        <label className="block text-sm font-medium">
          Property type *
          <select
            name="type"
            defaultValue={property?.type ?? "Apartment"}
            className="admin-input mt-2"
            {...form.describe("type")}
          >
            <option>Apartment</option>
            <option>House</option>
          </select>
          <FieldError form={form} name="type" />
        </label>
        <TextField
          form={form}
          name="location"
          label="Location / area"
          required={locationRequired}
          maxLength={200}
          defaultValue={property?.location}
        />
        <label className="block text-sm font-medium sm:col-span-2">
          Neighbourhood & viewing directions
          <textarea
            name="neighbourhood"
            className="admin-input mt-2 min-h-20"
            maxLength={2000}
            defaultValue={property?.neighbourhood ?? ""}
            placeholder="Nearby landmarks, access and useful location details"
            {...form.describe("neighbourhood")}
          />
          <FieldError form={form} name="neighbourhood" />
        </label>
        <label className="block text-sm font-medium sm:col-span-2">
          Description *
          <textarea
            name="description"
            required
            className="admin-input mt-2 min-h-28"
            maxLength={5000}
            defaultValue={property?.description ?? ""}
            {...form.describe("description")}
          />
          <FieldError form={form} name="description" />
        </label>
      </fieldset>
      <fieldset className="grid gap-4 sm:grid-cols-3">
        <legend className="mb-4 text-xs font-bold uppercase tracking-wider text-accent">
          Pricing & specifications
        </legend>
        {category === "managed" ? (
          <p className="text-sm text-muted-foreground sm:col-span-3">
            This is a managed portfolio property, not an offer for sale or rent. No public price is
            shown.
          </p>
        ) : (
          <>
            <NumberField
              form={form}
              name="amount"
              label={category === "rent" ? "Rent amount" : "Price"}
              defaultValue={property?.price?.amount}
              step="0.01"
            />
            <label className="block text-sm font-medium">
              Currency
              <select
                name="currency"
                defaultValue={property?.price?.currency ?? "KES"}
                className="admin-input mt-2"
                {...form.describe("currency")}
              >
                <option>KES</option>
                <option>USD</option>
              </select>
              <FieldError form={form} name="currency" />
            </label>
            {category === "rent" && (
              <label className="block text-sm font-medium">
                Price period
                <select
                  name="period"
                  defaultValue={property?.price?.period || "month"}
                  className="admin-input mt-2"
                  {...form.describe("period")}
                >
                  <option value="month">Per month</option>
                  <option value="year">Per year</option>
                </select>
                <FieldError form={form} name="period" />
              </label>
            )}
          </>
        )}
        <NumberField
          form={form}
          name="bedrooms"
          label="Bedrooms (0 for studio)"
          defaultValue={property?.bedrooms}
          step="1"
        />
        <NumberField
          form={form}
          name="bathrooms"
          label="Bathrooms"
          defaultValue={property?.bathrooms}
          step="1"
        />
        <NumberField
          form={form}
          name="area"
          label="Floor area (m²)"
          defaultValue={property?.areaSqm}
          step="0.01"
        />
      </fieldset>
      <label className="block text-sm font-medium">
        Amenities
        <input
          name="amenities"
          className="admin-input mt-2"
          placeholder="Parking, balcony, garden"
          maxLength={3500}
          defaultValue={property?.amenities.join(", ") ?? ""}
          {...form.describe("amenities")}
        />
        <span className="mt-2 block text-xs font-normal text-muted-foreground">
          Separate amenities with commas.
        </span>
        <FieldError form={form} name="amenities" />
      </label>
      <PhotoListField
        photos={photos}
        setPhotos={setPhotos}
        onBusyChange={setUploading}
        error={form.errors["photos"]}
        errorId={form.messageId("photos")}
      />
      <div className="flex flex-wrap justify-end gap-3 border-t border-border pt-5">
        <Button type="button" variant="outline" disabled={busy} onClick={onCancel}>
          Cancel
        </Button>
        {property ? (
          <Button type="submit" disabled={disabled}>
            {uploading ? "Uploading photos…" : busy ? "Saving…" : "Save changes"}
          </Button>
        ) : (
          <>
            <Button type="submit" value="draft" variant="outline" disabled={disabled}>
              {busy ? "Saving…" : "Save draft"}
            </Button>
            <Button type="submit" value="published" disabled={disabled}>
              {uploading ? "Uploading photos…" : "Save and publish"}
            </Button>
          </>
        )}
      </div>
    </form>
  );
}

function TextField({
  form,
  name,
  label,
  required = false,
  maxLength,
  defaultValue,
  placeholder,
}: {
  form: FieldErrors;
  name: string;
  label: string;
  required?: boolean;
  maxLength: number;
  defaultValue?: string | null | undefined;
  placeholder?: string;
}) {
  return (
    <label className="block text-sm font-medium">
      {label}
      {required && " *"}
      <input
        name={name}
        className="admin-input mt-2"
        required={required}
        maxLength={maxLength}
        defaultValue={defaultValue ?? ""}
        placeholder={placeholder}
        {...form.describe(name)}
      />
      <FieldError form={form} name={name} />
    </label>
  );
}

function NumberField({
  form,
  name,
  label,
  defaultValue,
  step,
}: {
  form: FieldErrors;
  name: string;
  label: string;
  defaultValue: number | null | undefined;
  step: string;
}) {
  return (
    <label className="block text-sm font-medium">
      {label}
      <input
        name={name}
        type="number"
        min="0"
        step={step}
        className="admin-input mt-2"
        defaultValue={defaultValue ?? ""}
        {...form.describe(name)}
      />
      <FieldError form={form} name={name} />
    </label>
  );
}
