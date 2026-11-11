import {
  Briefcase,
  BriefcaseBusiness,
  Building2,
  Calculator,
  ClipboardCheck,
  FileCheck2,
  FileText,
  Hammer,
  Handshake,
  House,
  KeyRound,
  Landmark,
  ScrollText,
  Search,
  ShieldCheck,
  Users,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { api, getAllPages, type Query } from "./api";
import { plainText } from "./rich-text";
import type { ApiService, ServiceGroup, ServiceInput } from "./types";

// Icons staff can choose for a service. The API stores the lucide-react name; only these
// are bundled, so unknown names fall back to a neutral icon.
export const serviceIcons: Record<string, LucideIcon> = {
  Search,
  FileCheck2,
  Handshake,
  ScrollText,
  KeyRound,
  ShieldCheck,
  Building2,
  Wrench,
  House,
  Landmark,
  ClipboardCheck,
  Users,
  Hammer,
  Calculator,
  FileText,
  Briefcase,
};

export function serviceIcon(name: string | null): LucideIcon {
  return (name ? serviceIcons[name] : undefined) ?? BriefcaseBusiness;
}

// ---------- Public ----------

export const getPublishedServices = (signal?: AbortSignal) =>
  api
    .get<{ categories?: ServiceGroup[]; services: ApiService[] }>("/services", {}, signal)
    .then(
      (data) =>
        data.services ??
        (data.categories ?? []).flatMap((group) =>
          group.services.map((service) => ({ ...service, category: group.title })),
        ),
    );

// ---------- Staff ----------

/** Every service, drafts included, in display order. */
export const listAllAdminServices = (query: Query = {}, signal?: AbortSignal) =>
  getAllPages<ApiService>("/services/admin/all", "services", query, signal);

export const createService = (input: ServiceInput) =>
  api.post<{ service: ApiService }>("/services", input).then((data) => data.service);

export const updateService = (id: string, input: Partial<ServiceInput>) =>
  api.patch<{ service: ApiService }>(`/services/${id}`, input).then((data) => data.service);

export const toggleServicePublish = (id: string) =>
  api.patch<{ service: ApiService }>(`/services/${id}/publish`).then((data) => data.service);

export const reorderServices = (ids: string[]) => api.patch<object>("/services/reorder", { ids });

export const deleteService = (id: string) => api.del<object>(`/services/${id}`);

// ---------- Service pages ----------

const slugify = (text: string) =>
  text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);

/** Readable link to a service's page, e.g. /services/tax-returns-made-simple-6731f0c2… */
export const serviceHref = (service: Pick<ApiService, "_id" | "title">) =>
  `/services/${[slugify(service.title), service._id].filter(Boolean).join("-")}`;

/** The service id at the end of a /services/… link. */
export const serviceIdFrom = (segment: string) => /([a-f0-9]{24})$/i.exec(segment)?.[1] ?? null;

/** A short plain-text summary for cards, without repeating the title at the start. */
export function serviceSummary(service: Pick<ApiService, "title" | "description">) {
  const text = plainText(service.description);
  const words = (value: string) =>
    value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, " ")
      .trim();
  const title = words(service.title);
  const lead = text.split(/(?<=[.!?:])\s+/)[0] ?? "";
  return title && words(lead) === title ? text.slice(lead.length).trim() : text;
}
