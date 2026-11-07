import { useId, useState } from "react";
import { Upload, X } from "lucide-react";
import { upload, UPLOAD_TYPES, type UploadFolder } from "@/lib/api";
import type { ApiImage } from "@/lib/types";
import { reportError } from "@/lib/use-query";
import { Button } from "@/components/ui/button";

/**
 * A single optional image: uploads to POST /media as soon as a file is chosen, then
 * collects alt text. The image is attached to the record when the form is saved.
 */
export default function ImageField({
  label,
  folder,
  value,
  onChange,
  onBusyChange,
  altLabel = "Image description",
  altRequired = true,
  error,
  errorId,
}: {
  label: string;
  folder: UploadFolder;
  value: ApiImage | null;
  onChange: (image: ApiImage | null) => void;
  onBusyChange?: (busy: boolean) => void;
  altLabel?: string;
  altRequired?: boolean;
  error?: string | undefined;
  errorId?: string;
}) {
  const [progress, setProgress] = useState<number | null>(null);
  const helpId = useId();
  const busy = progress !== null;

  async function choose(file: File | undefined) {
    if (!file) return;
    setProgress(0);
    onBusyChange?.(true);
    try {
      const image = await upload(file, folder, setProgress);
      onChange({ ...image, alt: value?.alt ?? "" });
    } catch (uploadError) {
      reportError(uploadError);
    } finally {
      setProgress(null);
      onBusyChange?.(false);
    }
  }

  return (
    <div className="rounded-lg border border-dashed border-border p-4">
      <label className="block text-sm font-medium">
        <span className="mb-2 flex items-center gap-2">
          <Upload className="size-4" aria-hidden="true" />
          {label}
        </span>
        <input
          type="file"
          accept={UPLOAD_TYPES.join(",")}
          disabled={busy}
          aria-describedby={helpId}
          className="admin-input"
          onChange={(event) => {
            void choose(event.target.files?.[0]);
            event.target.value = "";
          }}
        />
      </label>
      <p id={helpId} className="mt-2 text-xs text-muted-foreground">
        JPG, PNG or WebP, up to 5 MB.{value ? " Choosing another file replaces this image." : ""}
      </p>
      {busy && (
        <div className="mt-3" role="status">
          <progress className="h-2 w-full accent-accent" max={100} value={progress} />
          <span className="text-xs text-muted-foreground">Uploading… {progress}%</span>
        </div>
      )}
      {value && (
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <img
            src={value.url}
            alt={value.alt || "Selected image preview"}
            className="h-24 w-32 rounded object-cover"
          />
          <label className="min-w-0 flex-1 text-sm font-medium">
            {altLabel}
            {altRequired && " *"}
            <input
              required={altRequired}
              maxLength={150}
              value={value.alt}
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? errorId : undefined}
              className="admin-input mt-2"
              onChange={(event) => onChange({ ...value, alt: event.target.value })}
            />
            {error && (
              <span id={errorId} className="mt-1.5 block text-xs font-normal text-destructive">
                {error}
              </span>
            )}
          </label>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Remove image"
            disabled={busy}
            onClick={() => onChange(null)}
          >
            <X />
          </Button>
        </div>
      )}
    </div>
  );
}
