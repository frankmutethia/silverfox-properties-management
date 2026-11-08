import { useState, type FormEvent } from "react";
import { ArrowDown, ArrowUp, ArrowUpRight, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { notifyDeleted, notifyStatusChanged } from "@/lib/notify";
import {
  deleteService,
  getServiceCategories,
  listAllAdminServices,
  reorderServices,
  serviceIcon,
  toggleServicePublish,
  updateServiceCategory,
} from "@/lib/services";
import { richTextClass } from "@/lib/rich-text";
import type {
  ApiService,
  ApiServiceCategory,
  PublicationStatus,
  ServiceCategoryNumber,
} from "@/lib/types";
import { reportError, useQuery } from "@/lib/use-query";
import { useFieldErrors } from "@/lib/form-errors";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import ServiceForm from "@/components/ServiceForm";
import RichText from "@/components/RichText";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import FieldError from "@/components/admin/FieldError";
import StatusBadge, { StatusFilter } from "@/components/admin/StatusBadge";
import { LineSkeletons, LoadError } from "@/components/QueryState";

type StatusOption = "all" | PublicationStatus;

async function loadServices(signal: AbortSignal) {
  const [categories, services] = await Promise.all([
    getServiceCategories(signal),
    listAllAdminServices({}, signal),
  ]);
  return { categories, services };
}

export default function AdminServices() {
  const result = useQuery((signal) => loadServices(signal), []);
  const [status, setStatus] = useState<StatusOption>("all");
  const [editing, setEditing] = useState<ApiService | null>(null);
  const [formCategory, setFormCategory] = useState<ServiceCategoryNumber>("01");
  const [formOpen, setFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ApiServiceCategory | null>(null);
  const [deleting, setDeleting] = useState<ApiService | null>(null);
  const [working, setWorking] = useState<string | null>(null);
  const categories = result.data?.categories ?? [];
  const services = result.data?.services ?? [];
  const inCategory = (number: string) =>
    services
      .filter((service) => service.category === number)
      .sort((a, b) => a.sortOrder - b.sortOrder);

  async function move(service: ApiService, step: number) {
    const group = inCategory(service.category);
    const index = group.findIndex((item) => item._id === service._id);
    const target = index + step;
    if (index < 0 || target < 0 || target >= group.length) return;
    const reordered = [...group];
    reordered.splice(index, 1);
    reordered.splice(target, 0, service);
    // sortOrder is global, so send every service in category order.
    const ordered = categories.flatMap((category) =>
      category.number === service.category ? reordered : inCategory(category.number),
    );
    const sortOrders = new Map(ordered.map((item, position) => [item._id, position]));
    result.setData(
      (current) =>
        current && {
          ...current,
          services: current.services.map((item) => ({
            ...item,
            sortOrder: sortOrders.get(item._id) ?? item.sortOrder,
          })),
        },
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

  function openForm(service: ApiService | null, category: ServiceCategoryNumber) {
    setEditing(service);
    setFormCategory(category);
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
          <Button onClick={() => openForm(null, "01")} disabled={!categories.length}>
            <Plus />
            Create service
          </Button>
        </div>
      </div>
      <p className="mb-6 mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
        Edit categories and services, and set the order they appear in on the website. Only
        published services are shown publicly.
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
        <div className="mt-6 grid items-start gap-6 xl:grid-cols-2">
          {categories.map((category) => {
            const group = inCategory(category.number);
            const visible = group.filter((item) => status === "all" || item.status === status);
            const published = group.filter((item) => item.status === "published").length;
            return (
              <section key={category.number} className="admin-panel overflow-hidden">
                <div className="border-b border-border bg-secondary/50 p-6">
                  <div className="flex items-start justify-between gap-3">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-accent">
                      Category {category.number} · {published} published ·{" "}
                      {group.length - published} drafts
                    </p>
                    <Button variant="ghost" size="sm" onClick={() => setEditingCategory(category)}>
                      <Pencil />
                      Edit category
                    </Button>
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
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openForm(service, service.category)}
                          >
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
                    No {status === "all" ? "" : `${status} `}services in this category.
                  </p>
                )}
                <div className="border-t border-border p-4">
                  <Button variant="ghost" size="sm" onClick={() => openForm(null, category.number)}>
                    <Plus />
                    Add a service to this category
                  </Button>
                </div>
              </section>
            );
          })}
        </div>
      )}
      <ServiceForm
        service={editing}
        categories={categories}
        defaultCategory={formCategory}
        open={formOpen}
        onOpenChange={setFormOpen}
        onSaved={() => result.reload()}
      />
      <CategoryForm
        category={editingCategory}
        onClose={() => setEditingCategory(null)}
        onSaved={(saved) => {
          result.setData(
            (current) =>
              current && {
                ...current,
                categories: current.categories.map((item) =>
                  item.number === saved.number ? saved : item,
                ),
              },
          );
          setEditingCategory(null);
        }}
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

function CategoryForm({
  category,
  onClose,
  onSaved,
}: {
  category: ApiServiceCategory | null;
  onClose: () => void;
  onSaved: (category: ApiServiceCategory) => void;
}) {
  const form = useFieldErrors(["title", "description"]);
  const [busy, setBusy] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!category) return;
    const data = new FormData(event.currentTarget);
    const title = String(data.get("title") ?? "").trim();
    const description = String(data.get("description") ?? "").trim();
    const problems: Record<string, string> = {};
    if (!title) problems["title"] = "Enter a category title.";
    if (!description) problems["description"] = "Enter a short description.";
    form.setErrors(problems);
    if (Object.keys(problems).length) return;
    setBusy(true);
    try {
      const saved = await updateServiceCategory(category.number, { title, description });
      toast.success("Category updated", {
        description: `“${saved.title}” heading and introduction are saved.`,
      });
      onSaved(saved);
    } catch (error) {
      form.handle(error);
    } finally {
      setBusy(false);
    }
  }
  return (
    <Dialog
      open={category !== null}
      onOpenChange={(open) => {
        if (!open && !busy) {
          form.clear();
          onClose();
        }
      }}
    >
      <DialogContent className="max-w-[calc(100%-2rem)] sm:max-w-xl">
        <DialogTitle>Edit category {category?.number}</DialogTitle>
        <DialogDescription>
          The heading and introduction shown above its services.
        </DialogDescription>
        <form onSubmit={submit} className="space-y-5" noValidate>
          <label className="block text-sm font-medium">
            Title *
            <input
              name="title"
              required
              maxLength={150}
              defaultValue={category?.title ?? ""}
              className="admin-input mt-2"
              {...form.describe("title")}
            />
            <FieldError form={form} name="title" />
          </label>
          <label className="block text-sm font-medium">
            Description *
            <textarea
              name="description"
              required
              maxLength={1000}
              rows={4}
              defaultValue={category?.description ?? ""}
              className="admin-input mt-2"
              {...form.describe("description")}
            />
            <FieldError form={form} name="description" />
          </label>
          <div className="flex justify-end gap-3 border-t border-border pt-4">
            <Button type="button" variant="outline" disabled={busy} onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={busy}>
              {busy ? "Saving…" : "Save category"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
