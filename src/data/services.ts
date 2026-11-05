import {
  Search,
  FileCheck2,
  Handshake,
  ScrollText,
  KeyRound,
  ShieldCheck,
  Building2,
  Wrench,
} from "lucide-react";

export const serviceGroups = [
  {
    number: "01",
    title: "Property Purchase Services",
    description:
      "Professional support for clients buying or selling property, from the initial search through completion.",
    services: [
      {
        icon: Search,
        title: "Property search & acquisition support",
        copy: "Targeted property searches, shortlisting and buyer representation aligned with your requirements and investment priorities.",
      },
      {
        icon: FileCheck2,
        title: "Due diligence coordination",
        copy: "Structured review and coordination of ownership, property and transaction documentation before a purchase proceeds.",
      },
      {
        icon: Handshake,
        title: "Buyer & seller representation",
        copy: "Professional representation for property sales and purchases, with clear coordination between the parties throughout the transaction.",
      },
      {
        icon: ScrollText,
        title: "Agreements & transfer support",
        copy: "Drafting and coordination of sale and lease agreements, together with practical assistance during the property transfer process.",
      },
    ],
  },
  {
    number: "02",
    title: "Property Management Services",
    description:
      "Consistent administration and oversight designed to protect the property and support effective tenancies.",
    services: [
      {
        icon: KeyRound,
        title: "Tenancy agreement administration",
        copy: "Preparation and administration of tenancy agreements, renewals and the records required for a clear landlord–tenant relationship.",
      },
      {
        icon: ShieldCheck,
        title: "Tenancy notices & transitions",
        copy: "Preparation and coordination of tenancy and eviction notices, with attention to agreed terms and the applicable process.",
      },
      {
        icon: Building2,
        title: "Property & resident oversight",
        copy: "A dependable point of contact for occupancy matters, resident communication and the routine administration of managed properties.",
      },
      {
        icon: Wrench,
        title: "Maintenance coordination",
        copy: "Timely coordination of maintenance needs and service providers to help preserve condition, usability and long-term property value.",
      },
    ],
  },
];
