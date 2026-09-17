import { useState } from "react";
import { ArrowLeft, ArrowRight, Expand } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { Property } from "@/data/properties";

export default function PropertyGallery({ property }: { property: Property }) {
  const [active, setActive] = useState(0);
  const photo = property.images[active] ?? property.images[0];
  const multiple = property.images.length > 1;
  const change = (step: number) =>
    setActive((index) => (index + step + property.images.length) % property.images.length);
  return (
    <section id="photos" aria-label="Property photographs">
      <Dialog>
        <div className="relative overflow-hidden rounded-md bg-secondary">
          <DialogTrigger asChild>
            <button
              className="block w-full cursor-zoom-in"
              aria-label={`Enlarge photo of ${property.name}`}
            >
              <img
                src={photo.src}
                alt={photo.alt}
                className="h-[440px] w-full object-contain sm:h-[560px]"
                fetchPriority="high"
              />
              <span className="absolute bottom-4 right-4 flex items-center gap-2 rounded-md bg-background px-3 py-2 text-xs shadow-sm">
                <Expand className="size-4" />
                View photos
              </span>
            </button>
          </DialogTrigger>
        </div>
        <div className="mt-3 flex items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>{photo.alt}</p>
          <p className="shrink-0">
            {active + 1} / {property.images.length}
          </p>
        </div>
        {multiple && (
          <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
            {property.images.map((item, index) => (
              <button
                key={item.src}
                onClick={() => setActive(index)}
                aria-label={`Show photo ${index + 1}`}
                aria-pressed={active === index}
                className={`h-20 w-28 shrink-0 overflow-hidden rounded-sm border-2 ${active === index ? "border-accent" : "border-transparent"}`}
              >
                <img src={item.src} alt={item.alt} className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        )}
        <DialogContent
          className="w-[calc(100%-2rem)] max-w-6xl p-4 pt-10"
          onKeyDown={(event) => {
            if (event.key === "ArrowRight") {
              event.preventDefault();
              change(1);
            }
            if (event.key === "ArrowLeft") {
              event.preventDefault();
              change(-1);
            }
          }}
        >
          <DialogTitle>{property.name}</DialogTitle>
          <DialogDescription>{photo.alt}</DialogDescription>
          <img
            src={photo.src}
            alt={photo.alt}
            className="h-[55vh] w-full object-contain sm:h-[65vh]"
          />
          <div className="flex items-center justify-center gap-5">
            {multiple && (
              <Button
                variant="outline"
                size="icon"
                title="Previous photo"
                aria-label="Previous photo"
                onClick={() => change(-1)}
              >
                <ArrowLeft />
              </Button>
            )}
            <span className="text-sm" aria-live="polite">
              {active + 1} / {property.images.length}
            </span>
            {multiple && (
              <Button
                variant="outline"
                size="icon"
                title="Next photo"
                aria-label="Next photo"
                onClick={() => change(1)}
              >
                <ArrowRight />
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
