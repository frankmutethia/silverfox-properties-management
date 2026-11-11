import { useState, type FormEvent } from "react";
import { submitEnquiry } from "@/lib/enquiries";
import { useFieldErrors } from "@/lib/form-errors";
import { Button } from "@/components/ui/button";
import FieldError from "@/components/admin/FieldError";

/** The public enquiry form. Service pages pass their own heading and a prefilled message. */
export default function Enquiries({
  heading = "How can we help?",
  intro = "Tell us about the property or service you have in mind. Our team will review your message.",
  defaultMessage = "",
}: {
  heading?: string;
  intro?: string;
  defaultMessage?: string;
}) {
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const formErrors = useFieldErrors(["name", "message"]);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    setNotice("");
    const name = String(data.get("name") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();
    const problems: Record<string, string> = {};
    if (!name) problems["name"] = "Enter your name.";
    if (!message) problems["message"] = "Enter your enquiry.";
    formErrors.setErrors(problems);
    if (Object.keys(problems).length) return;
    setBusy(true);
    try {
      const result = await submitEnquiry({ name, message });
      form.reset();
      formErrors.clear();
      setNotice(result.message || "Thank you. Your enquiry has been received by our team.");
    } catch (err) {
      formErrors.handle(err);
    } finally {
      setBusy(false);
    }
  }
  return (
    <section id="enquiries" className="border-y border-border bg-card py-16 lg:py-20">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 lg:grid-cols-2 lg:px-8">
        <div>
          <p className="mb-4 text-xs font-bold uppercase tracking-widest text-accent">Enquiries</p>
          <h2 className="text-4xl font-bold tracking-tight text-primary">{heading}</h2>
          <p className="mt-5 max-w-md leading-7 text-muted-foreground">{intro}</p>
        </div>
        <form
          onSubmit={submit}
          className="space-y-5 rounded-xl border border-border bg-background p-6 sm:p-8"
        >
          <label className="block text-sm font-medium">
            Your name *
            <input
              name="name"
              autoComplete="name"
              required
              maxLength={100}
              className="admin-input mt-2"
              {...formErrors.describe("name")}
            />
            <FieldError form={formErrors} name="name" />
          </label>
          <label className="block text-sm font-medium">
            Your enquiry *
            <textarea
              name="message"
              required
              maxLength={5000}
              rows={6}
              className="admin-input mt-2"
              placeholder="What would you like to know?"
              defaultValue={defaultMessage}
              {...formErrors.describe("message")}
            />
            <FieldError form={formErrors} name="message" />
          </label>
          {notice && (
            <p role="status" className="text-sm text-primary">
              {notice}
            </p>
          )}
          <Button disabled={busy} type="submit">
            {busy ? "Sending…" : "Submit enquiry"}
          </Button>
        </form>
      </div>
    </section>
  );
}
