import { useState } from "react";
import { toast } from "sonner";
import { getEnquiries, retryEnquiryEmail } from "@/lib/enquiries";
import type { ApiEnquiry, EnquiryEmailStatus } from "@/lib/types";
import { reportError, useQuery } from "@/lib/use-query";
import { Button } from "@/components/ui/button";
import { LoadError, LineSkeletons } from "@/components/QueryState";
import Pager from "@/components/admin/Pager";

const statusStyles: Record<EnquiryEmailStatus, string> = {
  pending: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
  sent: "bg-emerald-600/12 text-emerald-700 dark:text-emerald-300",
  failed: "bg-destructive/10 text-destructive",
};

function EmailStatus({ status }: { status: EnquiryEmailStatus }) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-[11px] font-semibold capitalize ${statusStyles[status]}`}
    >
      {status}
    </span>
  );
}

export default function AdminEnquiries() {
  const [page, setPage] = useState(1);
  const result = useQuery((signal) => getEnquiries(page, signal), [page]);
  const [busy, setBusy] = useState<string | null>(null);

  async function retry(enquiry: ApiEnquiry) {
    setBusy(enquiry._id);
    try {
      const saved = await retryEnquiryEmail(enquiry._id);
      if (saved.emailStatus === "sent")
        toast.success("Email sent", {
          description: `Notification for ${saved.name}'s enquiry was delivered to the inbox.`,
        });
      else
        toast.error("Email still not sent", {
          description: saved.emailError ?? "The email couldn't be sent.",
        });
      result.setData(
        (current) =>
          current && {
            ...current,
            items: current.items.map((item) => (item._id === saved._id ? saved : item)),
          },
      );
    } catch (error) {
      reportError(error);
    } finally {
      setBusy(null);
    }
  }

  return (
    <>
      <p className="admin-eyebrow">Your conversations</p>
      <h1 className="admin-title">Enquiries</h1>
      <p className="mb-8 mt-3 text-sm text-muted-foreground">
        Messages submitted through the website and their notification status.
      </p>
      {!result.data && result.loading ? (
        <LineSkeletons lines={8} className="admin-panel p-6" />
      ) : !result.data && result.error ? (
        <LoadError error={result.error} onRetry={result.reload} />
      ) : result.data?.items.length === 0 ? (
        <div className="admin-panel p-8 text-muted-foreground">No enquiries yet.</div>
      ) : (
        <div className="space-y-4" aria-busy={result.loading}>
          {result.error && <LoadError error={result.error} onRetry={result.reload} />}
          {result.data?.items.map((enquiry) => (
            <article key={enquiry._id} className="admin-panel p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold">{enquiry.name}</h2>
                  <time
                    className="mt-1 block text-sm text-muted-foreground"
                    dateTime={enquiry.createdAt}
                  >
                    {new Date(enquiry.createdAt).toLocaleString()}
                  </time>
                </div>
                <EmailStatus status={enquiry.emailStatus} />
              </div>
              <p className="mt-4 whitespace-pre-wrap break-words leading-7">{enquiry.message}</p>
              {enquiry.emailStatus === "failed" && (
                <p className="mt-4 rounded-lg bg-destructive/5 px-4 py-3 text-sm text-destructive">
                  <strong className="font-semibold">Email not sent:</strong>{" "}
                  {enquiry.emailError ?? "The reason wasn't recorded. Retry to see why."} The
                  enquiry is saved here either way.
                </p>
              )}
              {enquiry.emailStatus !== "sent" && (
                <Button
                  className="mt-4"
                  variant="outline"
                  disabled={busy !== null}
                  onClick={() => void retry(enquiry)}
                >
                  {busy === enquiry._id ? "Retrying…" : "Retry email"}
                </Button>
              )}
            </article>
          ))}
          <Pager pagination={result.data?.pagination} onPage={setPage} disabled={result.loading} />
        </div>
      )}
    </>
  );
}
