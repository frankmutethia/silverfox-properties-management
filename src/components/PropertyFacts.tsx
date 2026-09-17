import { Bath, BedDouble, Ruler } from "lucide-react";
import type { Property } from "@/data/properties";

export default function PropertyFacts({ property }: { property: Property }) {
  return (
    <dl className="grid grid-cols-3 gap-2 border-y border-border py-4">
      {[
        {
          Icon: BedDouble,
          label: "Bedrooms",
          value: property.bedrooms === 0 ? "Studio" : property.bedrooms,
        },
        { Icon: Bath, label: "Bathrooms", value: property.bathrooms },
        {
          Icon: Ruler,
          label: "Space size",
          value: property.areaSqm === null ? null : `${property.areaSqm} m²`,
        },
      ].map(({ Icon, label, value }) => (
        <div key={label} className="min-w-0">
          <dt className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
            <Icon aria-hidden="true" className="size-4 shrink-0" />
            {label}
          </dt>
          <dd className="mt-2 text-xs font-semibold leading-5">{value ?? "To be confirmed"}</dd>
        </div>
      ))}
    </dl>
  );
}
