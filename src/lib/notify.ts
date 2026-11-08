import { toast } from "sonner";
import type { TestimonialStatus } from "./types";

// Consistent success messages for staff actions: a short title saying what happened,
// a description naming the item, and a "View" link when it is live on the website.

export type ContentKind = "Property" | "Service" | "Article" | "Testimonial";

interface Item {
  kind: ContentKind;
  /** Name shown in the message, e.g. the property name or article title. */
  name: string;
  status: TestimonialStatus;
  /** Public page for the item, offered as "View" when it is published. */
  href?: string;
}

function success(title: string, description: string, href?: string) {
  toast.success(title, {
    description,
    ...(href
      ? { action: { label: "View", onClick: () => window.open(href, "_blank", "noopener") } }
      : {}),
  });
}

const quoted = (name: string) => `“${name}”`;
const viewLink = ({ status, href }: Item) => (status === "published" ? href : undefined);

export function notifyCreated(item: Item) {
  if (item.status === "published")
    success(
      `${item.kind} published`,
      `${quoted(item.name)} is now live on the website.`,
      viewLink(item),
    );
  else
    success(
      `${item.kind} saved as a draft`,
      `${quoted(item.name)} stays private until you publish it.`,
    );
}

export function notifyUpdated(item: Item) {
  success(
    `${item.kind} updated`,
    item.status === "published"
      ? `Your changes to ${quoted(item.name)} are live on the website.`
      : `Your changes to ${quoted(item.name)} are saved.`,
    viewLink(item),
  );
}

export function notifyStatusChanged(item: Item) {
  if (item.status === "published")
    success(
      `${item.kind} published`,
      `${quoted(item.name)} is now live on the website.`,
      viewLink(item),
    );
  else
    success(
      `${item.kind} moved to drafts`,
      `${quoted(item.name)} is hidden from the website until you publish it again.`,
    );
}

export function notifyDeleted(kind: ContentKind, name: string) {
  success(`${kind} deleted`, `${quoted(name)} has been permanently removed.`);
}
