import { useId, useState, type Dispatch, type SetStateAction } from "react";
import { ArrowDown, ArrowUp, Upload, X } from "lucide-react";
import { imageFileProblem, upload, UPLOAD_TYPES } from "@/lib/api";
import type { PropertyImage } from "@/lib/types";
import { toast } from "sonner";
import { reportError } from "@/lib/use-query";
import { Button } from "@/components/ui/button";

export const MAX_PROPERTY_PHOTOS = 5;

interface Pending {
  key: string;
  name: string;
  progress: number;
}

/** Ordered property photos: upload through /media, reorder, describe, remove. First = cover. */
export default function PhotoListField({
  photos,
  setPhotos,
  onBusyChange,
  error,
  errorId,
}: {
  photos: PropertyImage[];
  setPhotos: Dispatch<SetStateAction<PropertyImage[]>>;
  onBusyChange: (busy: boolean) => void;
  error?: string | undefined;
  errorId: string;
}) {
  const [pending, setPending] = useState<Pending[]>([]);
  const helpId = useId();
  const slots = MAX_PROPERTY_PHOTOS - photos.length - pending.length;

  async function add(files: File[]) {
    if (!files.length) return;
    if (files.length > slots) {
      toast.error(`Add up to ${MAX_PROPERTY_PHOTOS} photos in total.`);
      return;
    }
    const problem = files.map(imageFileProblem).find(Boolean);
    if (problem) {
      toast.error(problem);
      return;
    }
    const batch = files.map((file) => ({
      file,
      key: crypto.randomUUID(),
    }));
    setPending((current) => [
      ...current,
      ...batch.map(({ file, key }) => ({ key, name: file.name, progress: 0 })),
    ]);
    onBusyChange(true);
    await Promise.all(
      batch.map(async ({ file, key }) => {
        try {
          const image = await upload(file, "properties", (progress) =>
            setPending((current) =>
              current.map((item) => (item.key === key ? { ...item, progress } : item)),
            ),
          );
          setPhotos((current) => [...current, { ...image, alt: "" }]);
        } catch (uploadError) {
          reportError(uploadError);
        } finally {
          setPending((current) => current.filter((item) => item.key !== key));
        }
      }),
    );
    onBusyChange(false);
  }

  function move(index: number, step: number) {
    setPhotos((current) => {
      const next = [...current];
      const [item] = next.splice(index, 1);
      if (item) next.splice(index + step, 0, item);
      return next;
    });
  }

  return (
    <div>
      <label className="block text-sm font-medium">
        <span className="mb-2 flex items-center gap-2">
          <Upload className="size-4" aria-hidden="true" />
          Property photos
        </span>
        <input
          type="file"
          accept={UPLOAD_TYPES.join(",")}
          multiple
          disabled={slots <= 0}
          aria-describedby={error ? `${helpId} ${errorId}` : helpId}
          aria-invalid={error ? true : undefined}
          className="admin-input"
          onChange={(event) => {
            void add(Array.from(event.target.files ?? []));
            event.target.value = "";
          }}
        />
      </label>
      <p id={helpId} className="mt-2 text-xs text-muted-foreground">
        Up to {MAX_PROPERTY_PHOTOS} JPG, PNG or WebP photos, 5 MB each. The first photo is the
        cover. At least one photo is needed to publish.
      </p>
      {error && (
        <p id={errorId} className="mt-1.5 text-xs text-destructive">
          {error}
        </p>
      )}
      <ol className="mt-3 grid gap-3">
        {photos.map((photo, index) => (
          <li
            key={photo.url}
            className="flex flex-wrap items-center gap-3 rounded-lg border border-border p-2 sm:flex-nowrap"
          >
            <img
              src={photo.url}
              alt=""
              style={{ objectPosition: photo.position ?? undefined }}
              className="size-16 shrink-0 rounded object-cover"
            />
            <label className="min-w-0 flex-1 text-xs font-medium">
              {index === 0 ? "Cover photo" : `Photo ${index + 1}`} description *
              <input
                className="admin-input mt-1"
                value={photo.alt}
                required
                maxLength={150}
                onChange={(event) =>
                  setPhotos((current) =>
                    current.map((item, i) =>
                      i === index ? { ...item, alt: event.target.value } : item,
                    ),
                  )
                }
              />
            </label>
            <div className="flex shrink-0 gap-1">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label={`Move photo ${index + 1} earlier`}
                disabled={index === 0}
                onClick={() => move(index, -1)}
              >
                <ArrowUp />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label={`Move photo ${index + 1} later`}
                disabled={index === photos.length - 1}
                onClick={() => move(index, 1)}
              >
                <ArrowDown />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label={`Remove photo ${index + 1}`}
                onClick={() => setPhotos((current) => current.filter((_, i) => i !== index))}
              >
                <X />
              </Button>
            </div>
          </li>
        ))}
        {pending.map((item) => (
          <li key={item.key} className="rounded-lg border border-dashed border-border p-3">
            <p className="truncate text-xs" role="status">
              Uploading {item.name}… {item.progress}%
            </p>
            <progress className="mt-2 h-2 w-full" max={100} value={item.progress} />
          </li>
        ))}
      </ol>
    </div>
  );
}
