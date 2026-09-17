import garden from "@/assets/ronnie-george-z11gbBo13ro-unsplash.jpg";
import gabled from "@/assets/ian-macdonald-W8z6aiwfi1E-unsplash.jpg";
import veranda from "@/assets/todd-kent-178j8tJrNlc-unsplash.jpg";
import apartmentOne from "@/assets/marlene-celine-nordvik-5q1KnUjtjaM-unsplash.jpg";
import apartmentTwo from "@/assets/malcolm-shadrach-_r80LCluvVM-unsplash.jpg";

export interface PropertyImage {
  src: string;
  alt: string;
  position?: string;
}

export interface Property {
  slug: string;
  reference: string;
  name: string;
  type: "Apartment" | "House";
  location: string | null;
  price: { amount: number; currency: string; period: string } | null;
  areaSqm: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  amenities: string[];
  description: string;
  images: [PropertyImage, ...PropertyImage[]];
}

// Only verified listing facts belong here. A null value means not yet confirmed.
const unconfirmed = {
  location: null,
  price: null,
  areaSqm: null,
  bedrooms: null,
  bathrooms: null,
  amenities: [],
};

export const properties: Property[] = [
  {
    ...unconfirmed,
    slug: "apartment-01",
    reference: "SF-004",
    name: "Apartment 01",
    type: "Apartment",
    description:
      "A contemporary apartment building with contrasting brickwork and glass-fronted balconies, shown in the supplied exterior photograph. Contact our team for the available units, location, floor plans and confirmed specifications.",
    images: [
      {
        src: apartmentOne,
        alt: "Apartment building with contrasting brickwork and glass-fronted balconies",
        position: "50% 65%",
      },
    ],
  },
  {
    ...unconfirmed,
    slug: "apartment-02",
    reference: "SF-005",
    name: "Apartment 02",
    type: "Apartment",
    description:
      "A multi-storey apartment building with light facades, dark vertical detailing and rows of balconies. The supplied photograph shows the building exterior; unit layouts, availability and specifications are awaiting confirmation.",
    images: [
      {
        src: apartmentTwo,
        alt: "Light-coloured apartment towers with dark detailing and balconies",
        position: "50% 90%",
      },
    ],
  },
  {
    ...unconfirmed,
    slug: "garden-residence",
    reference: "SF-001",
    name: "Garden Residence",
    type: "House",
    description:
      "A residential home featured in the Silverfox collection. Explore the exterior photograph and speak with our team for confirmed property information, viewing arrangements and availability.",
    images: [{ src: garden, alt: "Garden Residence exterior" }],
  },
  {
    ...unconfirmed,
    slug: "classic-gabled-home",
    reference: "SF-002",
    name: "Classic Gabled Home",
    type: "House",
    description:
      "A residential home featured in the Silverfox collection. Contact our team for the location, interior photographs, layout and confirmed terms before arranging a viewing.",
    images: [{ src: gabled, alt: "Classic Gabled Home exterior" }],
  },
  {
    ...unconfirmed,
    slug: "veranda-house",
    reference: "SF-003",
    name: "Veranda House",
    type: "House",
    description:
      "A residential home featured in the Silverfox collection. Our team can assist with enquiries about the property, including its location, specifications and viewing availability.",
    images: [{ src: veranda, alt: "Veranda House exterior" }],
  },
];

export function propertyPrice(property: Property) {
  if (!property.price) return "Price on enquiry";
  const { amount, currency, period } = property.price;
  return `${currency} ${new Intl.NumberFormat("en-KE").format(amount)}${period ? ` / ${period}` : ""}`;
}
