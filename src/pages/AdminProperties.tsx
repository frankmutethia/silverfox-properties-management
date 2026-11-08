import { useState } from "react";
import { ArrowUpRight, ImageOff, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { notifyDeleted, notifyStatusChanged } from "@/lib/notify";
import {
  deleteProperty,
  listAdminProperties,
  propertyCategories,
  propertyPrice,
  togglePropertyPublish,
} from "@/lib/properties";
import type { ApiProperty, PublicationStatus } from "@/lib/types";
import { reportError, useDebounced, useQuery } from "@/lib/use-query";
import { Button } from "@/components/ui/button";
import PropertyForm from "@/components/PropertyForm";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import Pager from "@/components/admin/Pager";
import StatusBadge, { StatusFilter } from "@/components/admin/StatusBadge";
import { LineSkeletons, LoadError } from "@/components/QueryState";

type StatusOption = "all" | PublicationStatus;

export default function AdminProperties() {
  const [status, setStatus] = useState<StatusOption>("all");
  const [type, setType] = useState("");
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const query = useDebounced(search.trim());
  const result = useQuery(
    (signal) =>
      listAdminProperties(
        {
          status: status === "all" ? undefined : status,
          type,
          category,
          search: query,
          page,
          limit: 20,
        },
        signal,
      ),
    [status, type, category, query, page],
  );
  const [editing, setEditing] = useState<ApiProperty | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [deleting, setDeleting] = useState<ApiProperty | null>(null);
  const [toggling, setToggling] = useState<string | null>(null);
  const items = result.data?.items ?? [];

  function filter<T>(set: (value: T) => void) {
    return (value: T) => {
      set(value);
      setPage(1);
    };
  }

  async function toggle(property: ApiProperty) {
    setToggling(property._id);
    try {
      const saved = await togglePropertyPublish(property._id);
      notifyStatusChanged({
        kind: "Property",
        name: saved.name,
        status: saved.status,
        href: `/properties/${saved.slug}`,
      });
      result.reload();
    } catch (error) {
      reportError(error);
    } finally {
      setToggling(null);
    }
  }

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="admin-eyebrow">The Silverfox collection</p>
          <h1 className="admin-title">Properties</h1>
        </div>
        <Button
          onClick={() => {
            setEditing(null);
            setFormOpen(true);
          }}
        >
          <Plus />
          Create property
        </Button>
      </div>
      <p className="mb-6 mt-3 text-sm text-muted-foreground">
        Create and edit listings. Drafts stay private until you publish them.
      </p>
      <StatusFilter
        label="Filter by status"
        value={status}
        onChange={filter(setStatus)}
        options={[
          { value: "all", label: "All" },
          { value: "published", label: "Published" },
          { value: "draft", label: "Drafts" },
        ]}
      />
      <section className="admin-panel mt-5 overflow-hidden">
        <div className="flex flex-wrap items-center gap-3 border-b border-border p-5">
          <div className="relative min-w-0 basis-full sm:flex-1">
            <Search className="absolute left-3 top-3.5 size-4 text-muted-foreground" />
            <input
              type="search"
              aria-label="Search properties"
              className="admin-input pl-10"
              placeholder="Search name, location or reference…"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
            />
          </div>
          <select
            aria-label="Listing category"
            className="admin-input w-auto"
            value={category}
            onChange={(event) => filter(setCategory)(event.target.value)}
          >
            <option value="">All categories</option>
            {Object.entries(propertyCategories).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
            <option value="unconfirmed">Category to be confirmed</option>
          </select>
          <select
            aria-label="Property type"
            className="admin-input w-auto"
            value={type}
            onChange={(event) => filter(setType)(event.target.value)}
          >
            <option value="">All property types</option>
            <option>Apartment</option>
            <option>House</option>
          </select>
        </div>
        {!result.data && result.loading ? (
          <LineSkeletons lines={8} className="p-5" />
        ) : !result.data && result.error ? (
          <LoadError error={result.error} onRetry={result.reload} />
        ) : (
          <div className="relative overflow-x-auto" aria-busy={result.loading}>
            <table className="w-full min-w-[860px] text-left text-sm">
              <thead className="bg-secondary/50 text-[10px] uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th scope="col" className="px-5 py-4">
                    Property
                  </th>
                  <th scope="col" className="px-5 py-4">
                    Location
                  </th>
                  <th scope="col" className="px-5 py-4">
                    Price
                  </th>
                  <th scope="col" className="px-5 py-4">
                    Status
                  </th>
                  <th scope="col" className="px-5 py-4">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {items.map((property) => {
                  const cover = property.images[0];
                  return (
                    <tr key={property._id} className="hover:bg-secondary/30">
                      <td className="p-5">
                        <div className="flex items-center gap-3">
                          {cover ? (
                            <img
                              src={cover.url}
                              alt=""
                              className="h-14 w-16 rounded-lg object-cover"
                            />
                          ) : (
                            <span className="flex h-14 w-16 items-center justify-center rounded-lg bg-secondary">
                              <ImageOff
                                className="size-4 text-muted-foreground"
                                aria-label="No photo"
                              />
                            </span>
                          )}
                          <div className="whitespace-nowrap font-semibold">
                            {property.name}
                            <p className="mt-1 text-xs text-accent">
                              {property.category
                                ? propertyCategories[property.category]
                                : "Category to be confirmed"}
                            </p>
                            <p className="mt-1 text-xs font-normal text-muted-foreground">
                              {property.reference} · {property.type}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 text-xs text-muted-foreground">
                        {property.location ?? "Awaiting confirmation"}
                      </td>
                      <td className="whitespace-nowrap px-5 text-xs">{propertyPrice(property)}</td>
                      <td className="px-5">
                        <StatusBadge status={property.status} />
                      </td>
                      <td className="px-5">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={toggling === property._id}
                            onClick={() => void toggle(property)}
                          >
                            {property.status === "published" ? "Unpublish" : "Publish"}
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            aria-label={`Edit ${property.name}`}
                            onClick={() => {
                              setEditing(property);
                              setFormOpen(true);
                            }}
                          >
                            <Pencil />
                          </Button>
                          {property.status === "published" && (
                            <Button variant="outline" size="icon" asChild>
                              <a
                                href={`/properties/${property.slug}`}
                                target="_blank"
                                rel="noreferrer"
                                aria-label={`View ${property.name} on the website`}
                              >
                                <ArrowUpRight />
                              </a>
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="icon"
                            aria-label={`Delete ${property.name}`}
                            className="text-destructive"
                            onClick={() => setDeleting(property)}
                          >
                            <Trash2 />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {!items.length && (
              <p className="p-12 text-center text-sm text-muted-foreground">
                No properties match these filters.
              </p>
            )}
          </div>
        )}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-5">
          <p role="status" className="py-4 text-xs text-muted-foreground">
            {result.data
              ? `${result.data.pagination.total} ${result.data.pagination.total === 1 ? "property" : "properties"}`
              : ""}
          </p>
          <Pager pagination={result.data?.pagination} onPage={setPage} disabled={result.loading} />
        </div>
      </section>
      <PropertyForm
        property={editing}
        open={formOpen}
        onOpenChange={setFormOpen}
        onSaved={() => result.reload()}
      />
      <ConfirmDialog
        open={deleting !== null}
        onOpenChange={(open) => !open && setDeleting(null)}
        title={`Delete ${deleting?.name ?? "property"}?`}
        description="This permanently removes the listing and its photos from the website and the workspace."
        onConfirm={async () => {
          if (!deleting) return;
          await deleteProperty(deleting._id);
          notifyDeleted("Property", deleting.name);
          if (items.length === 1 && page > 1) setPage(page - 1);
          else result.reload();
        }}
      />
    </>
  );
}
