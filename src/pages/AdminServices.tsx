import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Eye,
  EyeOff,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { notifyDeleted, notifyStatusChanged } from "@/lib/notify";
import {
  deleteService,
  listAllAdminServices,
  reorderServices,
  serviceIcon,
  toggleServicePublish,
} from "@/lib/services";
import { richTextClass } from "@/lib/rich-text";
import type { ApiService, PublicationStatus } from "@/lib/types";
import { reportError, useQuery } from "@/lib/use-query";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import ServiceForm from "@/components/ServiceForm";
import RichText from "@/components/RichText";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import StatusBadge, { StatusFilter } from "@/components/admin/StatusBadge";
import { LoadError } from "@/components/QueryState";

type StatusOption = "all" | PublicationStatus;

/** Every service, drafts included, each managed as its own card. */
export default function AdminServices() {
  const result = useQuery((signal) => listAllAdminServices({}, signal), []);
  const [status, setStatus] = useState<StatusOption>("all");
  const [editing, setEditing] = useState<ApiService | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [deleting, setDeleting] = useState<ApiService | null>(null);
  const [working, setWorking] = useState<string | null>(null);
  const services = [...(result.data ?? [])].sort((a, b) => a.sortOrder - b.sortOrder);
  const visible = services.filter((item) => status === "all" || item.status === status);
  const published = services.filter((item) => item.status === "published").length;

  async function move(service: ApiService, step: number) {
    const index = services.findIndex((item) => item._id === service._id);
    const target = index + step;
    if (index < 0 || target < 0 || target >= services.length) return;
    const ordered = [...services];
    ordered.splice(index, 1);
    ordered.splice(target, 0, service);
    const sortOrders = new Map(ordered.map((item, position) => [item._id, position]));
    result.setData(
      (current) =>
        current &&
        current.map((item) => ({ ...item, sortOrder: sortOrders.get(item._id) ?? item.sortOrder })),
    );
    setWorking(service._id);
    try {
      await reorderServices(ordered.map((item) => item._id));
    } catch (error) {
      reportError(error);
      result.reload();
    } finally {
      setWorking(null);
    }
  }

  async function toggle(service: ApiService) {
    setWorking(service._id);
    try {
      const saved = await toggleServicePublish(service._id);
      notifyStatusChanged({
        kind: "Service",
        name: saved.title,
        status: saved.status,
        href: "/#management",
      });
      result.reload();
    } catch (error) {
      reportError(error);
    } finally {
      setWorking(null);
    }
  }

  function openForm(service: ApiService | null) {
    setEditing(service);
    setFormOpen(true);
  }

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="admin-eyebrow">The Silverfox offering</p>
          <h1 className="admin-title">Services</h1>
        </div>
        <div className="flex flex-wrap items-start gap-3">
          <Button asChild variant="outline">
            <a href="/#management">
              View on website <ArrowUpRight />
            </a>
          </Button>
          <Button onClick={() => openForm(null)}>
            <Plus />
            Create service
          </Button>
        </div>
      </div>
      <p className="mb-6 mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
        Each card is one service. Published services appear on the website in the order shown here.
      </p>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <StatusFilter
          label="Filter by status"
          value={status}
          onChange={setStatus}
          options={[
            { value: "all", label: "All" },
            { value: "published", label: "Published" },
            { value: "draft", label: "Drafts" },
          ]}
        />
        {result.data && (
          <p className="text-xs font-semibold uppercase tracking-wider text-accent" role="status">
            {published} published · {services.length - published}{" "}
            {services.length - published === 1 ? "draft" : "drafts"}
          </p>
        )}
      </div>
      {status !== "all" && (
        <p className="mt-3 text-xs text-muted-foreground">
          Show all services to change their order.
        </p>
      )}

      {!result.data && result.loading ? (
        <div className="mt-6 grid gap-6 md:grid-cols-2 2xl:grid-cols-3" aria-busy="true">
          {[0, 1, 2].map((index) => (
            <Skeleton key={index} className="h-[380px] rounded-2xl" />
          ))}
        </div>
      ) : !result.data && result.error ? (
        <LoadError error={result.error} onRetry={result.reload} className="admin-panel mt-6" />
      ) : (
        <ol className="mt-6 grid gap-6 md:grid-cols-2 2xl:grid-cols-3">
          {visible.map((service) => {
            const index = services.indexOf(service);
            return (
              <li key={service._id} className="flex">
                <ServiceCard
                  service={service}
                  position={index + 1}
                  busy={working === service._id}
                  canMove={status === "all" && working === null}
                  first={index === 0}
                  last={index === services.length - 1}
                  onMove={(step) => void move(service, step)}
                  onToggle={() => void toggle(service)}
                  onEdit={() => openForm(service)}
                  onDelete={() => setDeleting(service)}
                />
              </li>
            );
          })}
          <li className="flex">
            <button
              type="button"
              onClick={() => openForm(null)}
              className="flex min-h-[220px] w-full flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-border p-6 text-sm font-semibold text-muted-foreground transition-colors hover:border-accent hover:bg-accent/5 hover:text-accent"
            >
              <span className="flex size-12 items-center justify-center rounded-full bg-secondary">
                <Plus className="size-5" aria-hidden="true" />
              </span>
              {services.length ? "Create another service" : "Create your first service"}
            </button>
          </li>
        </ol>
      )}
      {result.data && !visible.length && status !== "all" && (
        <p className="mt-4 text-sm text-muted-foreground">No {status} services to show.</p>
      )}

      <ServiceForm
        service={editing}
        open={formOpen}
        onOpenChange={setFormOpen}
        onSaved={() => result.reload()}
      />
      <ConfirmDialog
        open={deleting !== null}
        onOpenChange={(open) => !open && setDeleting(null)}
        title={`Delete ${deleting?.title ?? "service"}?`}
        description="This permanently removes the service and its image. To hide it temporarily, unpublish it instead."
        onConfirm={async () => {
          if (!deleting) return;
          await deleteService(deleting._id);
          notifyDeleted("Service", deleting.title);
          result.reload();
        }}
      />
    </>
  );
}

function ServiceCard({
  service,
  position,
  busy,
  canMove,
  first,
  last,
  onMove,
  onToggle,
  onEdit,
  onDelete,
}: {
  service: ApiService;
  position: number;
  busy: boolean;
  canMove: boolean;
  first: boolean;
  last: boolean;
  onMove: (step: number) => void;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const Icon = serviceIcon(service.icon);
  const category = String(service.category || "").trim();
  const isPublished = service.status === "published";
  return (
    <article
      className={`admin-panel flex w-full flex-col overflow-hidden ${isPublished ? "" : "border-dashed"}`}
    >
      <div className="relative aspect-[16/9] shrink-0 overflow-hidden bg-gradient-to-br from-accent/15 via-secondary to-secondary">
        {service.image ? (
          <img
            src={service.image.url}
            alt={service.image.alt}
            loading="lazy"
            className={`absolute inset-0 size-full object-cover ${isPublished ? "" : "opacity-70 grayscale"}`}
          />
        ) : (
          <span className="absolute inset-0 flex items-center justify-center">
            <Icon className="size-14 text-accent/40" aria-hidden="true" />
          </span>
        )}
        <span className="absolute left-3 top-3 flex size-10 items-center justify-center rounded-xl bg-card/95 text-accent shadow-sm">
          <Icon className="size-5" aria-hidden="true" />
        </span>
        <span className="absolute right-3 top-3 rounded-full bg-card shadow-sm">
          <StatusBadge status={service.status} />
        </span>
        <span className="absolute bottom-3 left-3 rounded-full bg-card/95 px-2.5 py-1 text-[11px] font-semibold text-muted-foreground shadow-sm">
          #{position}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        {category && (
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-accent">
            {category}
          </p>
        )}
        <h2 className="mt-1 break-words text-lg font-semibold leading-snug">{service.title}</h2>
        <RichText
          images={false}
          html={service.description}
          className={`${richTextClass} mt-2 line-clamp-4 text-sm text-muted-foreground [&_p]:my-0`}
        />
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border bg-secondary/40 px-4 py-3">
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            aria-label={`Move ${service.title} earlier`}
            title="Move earlier"
            disabled={!canMove || first}
            onClick={() => onMove(-1)}
          >
            <ArrowLeft />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label={`Move ${service.title} later`}
            title="Move later"
            disabled={!canMove || last}
            onClick={() => onMove(1)}
          >
            <ArrowRight />
          </Button>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <Button variant="outline" size="sm" disabled={busy} onClick={onToggle}>
            {isPublished ? <EyeOff /> : <Eye />}
            {isPublished ? "Unpublish" : "Publish"}
          </Button>
          <Button variant="outline" size="sm" onClick={onEdit}>
            <Pencil />
            Edit
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="text-destructive"
            aria-label={`Delete ${service.title}`}
            title="Delete"
            onClick={onDelete}
          >
            <Trash2 />
          </Button>
        </div>
      </div>
    </article>
  );
}
