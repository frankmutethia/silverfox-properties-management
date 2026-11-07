import { useMemo } from "react";
import { cleanRichHtml } from "@/lib/rich-text";

/** Renders API-sanitized HTML after re-applying the client allowlist. */
export default function RichText({
  html,
  images = false,
  className,
}: {
  html: string;
  images?: boolean;
  className: string;
}) {
  const clean = useMemo(() => cleanRichHtml(html, images), [html, images]);
  return <div className={className} dangerouslySetInnerHTML={{ __html: clean }} />;
}
