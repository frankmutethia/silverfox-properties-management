import { useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpRight, Pencil, Plus, Trash2 } from "lucide-react";
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
import ServiceForm from "@/components/ServiceForm";
import RichText from "@/components/RichText";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import StatusBadge, { StatusFilter } from "@/components/admin/StatusBadge";
import { LineSkeletons, LoadError } from "@/components/QueryState";

type StatusOption = "all" | PublicationStatus;

async function loadServices(signal: AbortSignal) {
  return listAllAdminServices({}, signal);
}

export default function AdminServices() {
  const result = useQuery((signal) => loadServices(signal), []);
  const [status, setStatus] = useState<StatusOption>("all");
  const [editing, setEditing] = useState<ApiService | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [deleting, setDeleting] = useState<ApiService | null>(null);
  const [working, setWorking] = useState<string | null>(null);
  const categories = [
    { number: "", title: "All services", description: "Create and manage individual services." },
  ];
  const services = result.data ?? [];
  const inCategory = (number: string) =>
    services
      .filter((service) => number === "" || service.category === number)
      .sort((a, b) => a.sortOrder - b.sortOrder);

  async function move(service: ApiService, step: number) {
    const group = inCategory("");
    const index = group.findIndex((item) => item._id === service._id);
    const target = index + step;
    if (index < 0 || target < 0 || target >= group.length) return;
    const reordered = [...group];
    reordered.splice(index, 1);
    reordered.splice(target, 0, service);
    // sortOrder is global, so send every service in category order.
    const ordered = reordered;
    const sortOrders = new Map(ordered.map((item, position) => [item._id, position]));
    result.setData(
      (current) =>
        current &&
        current.map((item) => ({
          ...item,
          sortOrder: sortOrders.get(item._id) ?? item.sortOrder,
        })),
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
        Create individual services with an optional category. Only published services are shown
        publicly.
      </p>
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
      {status !== "all" && (
        <p className="mt-3 text-xs text-muted-foreground">
          Show all services to change their order.
        </p>
      )}
      {!result.data && result.loading ? (
        <div className="mt-6 grid gap-6 xl:grid-cols-2">
          <LineSkeletons lines={10} className="admin-panel p-6" />
          <LineSkeletons lines={10} className="admin-panel p-6" />
        </div>
      ) : !result.data && result.error ? (
        <LoadError error={result.error} onRetry={result.reload} className="admin-panel mt-6" />
      ) : (
        <div className="mt-6 grid items-start gap-6">
          {categories.map((category) => {
            const group = inCategory(category.number);
            const visible = group.filter((item) => status === "all" || item.status === status);
            const published = group.filter((item) => item.status === "published").length;
            return (
              <section key={category.number} className="admin-panel overflow-hidden">
                <div className="border-b border-border bg-secondary/50 p-6">
                  <div className="flex items-start justify-between gap-3">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-accent">
                      {published} published · {group.length - published} drafts
                    </p>
                  </div>
                  <h2 className="text-xl font-semibold">{category.title}</h2>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    {category.description}
                  </p>
                </div>
                <ol className="divide-y divide-border px-6">
                  {visible.map((service) => {
                    const Icon = serviceIcon(service.icon);
                    const index = group.indexOf(service);
                    return (
                      <li key={service._id} className="py-6">
                        <div className="flex gap-4">
                          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                            <Icon className="size-5" aria-hidden="true" />
                          </span>
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="break-words text-sm font-semibold">{service.title}</h3>
                              <StatusBadge status={service.status} />
                            </div>
                            {service.image && (
                              <img
                                src={service.image.url}
                                alt={service.image.alt}
                                className="mt-3 aspect-[16/9] w-full max-w-sm rounded-lg object-cover"
                              />
                            )}
                            <RichText
                              images
                              html={service.description}
                              className={`${richTextClass} mt-2 text-muted-foreground`}
                            />
                          </div>
                        </div>
                        <div className="mt-4 flex flex-wrap gap-2 pl-14">
                          <Button
                            variant="outline"
                            size="icon"
                            aria-label={`Move ${service.title} up`}
                            disabled={status !== "all" || index === 0 || working !== null}
                            onClick={() => void move(service, -1)}
                          >
                            <ArrowUp />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            aria-label={`Move ${service.title} down`}
                            disabled={
                              status !== "all" || index === group.length - 1 || working !== null
                            }
                            onClick={() => void move(service, 1)}
                          >
                            <ArrowDown />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={working === service._id}
                            onClick={() => void toggle(service)}
                          >
                            {service.status === "published" ? "Unpublish" : "Publish"}
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => openForm(service)}>
                            <Pencil />
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-destructive"
                            onClick={() => setDeleting(service)}
                          >
                            <Trash2 />
                            Delete
                          </Button>
                        </div>
                      </li>
                    );
                  })}
                </ol>
                {!visible.length && (
                  <p className="p-6 text-sm text-muted-foreground">
                    No {status === "all" ? "" : `${status} `}services to show.
                  </p>
                )}
                <div className="border-t border-border p-4">
                  <Button variant="ghost" size="sm" onClick={() => openForm(null)}>
                    <Plus />
                    Create service
                  </Button>
                </div>
              </section>
            );
          })}
        </div>
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
