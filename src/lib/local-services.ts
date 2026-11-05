import { z } from "zod";

// Rebuild supported formatting instead of trusting stored or pasted HTML.
export function cleanServiceHtml(html: string) {
  return cleanRichHtml(html);
}

export function cleanRichHtml(html: string, images = false) {
  const source = new DOMParser().parseFromString(html, "text/html");
  const output = document.createElement("div");
  const allowed = new Set([
    "P",
    "DIV",
    "BR",
    "B",
    "STRONG",
    "I",
    "EM",
    "U",
    "OL",
    "UL",
    "LI",
    "H2",
    "H3",
    "BLOCKQUOTE",
    "SPAN",
    "FONT",
  ]);
  function copy(node: Node, parent: HTMLElement) {
    if (node.nodeType === Node.TEXT_NODE) {
      parent.append(document.createTextNode(node.textContent ?? ""));
      return;
    }
    if (
      !(node instanceof HTMLElement) ||
      ["SCRIPT", "STYLE", "IFRAME", "OBJECT", "SVG", "MATH"].includes(node.tagName)
    )
      return;
    if (images && node.tagName === "IMG") {
      const src = node.getAttribute("src") ?? "";
      if (
        /^https:\/\//i.test(src) ||
        (/^data:image\/(jpeg|png|webp);base64,[a-z0-9+/=\s]+$/i.test(src) && src.length <= 850000)
      ) {
        const img = document.createElement("img");
        img.src = src;
        img.alt = (node.getAttribute("alt") ?? "").slice(0, 150);
        parent.append(img);
      }
      return;
    }
    if (!allowed.has(node.tagName)) {
      node.childNodes.forEach((child) => copy(child, parent));
      return;
    }
    const element = document.createElement(
      node.tagName === "FONT" ? "span" : node.tagName.toLowerCase(),
    );
    const sizes: Record<string, string> = { "2": "14px", "3": "16px", "4": "18px", "5": "24px" };
    const size = sizes[node.getAttribute("size") ?? ""] ?? node.style.fontSize;
    if (["14px", "16px", "18px", "24px"].includes(size)) element.style.fontSize = size;
    const font = node.getAttribute("face") ?? node.style.fontFamily;
    if (["serif", "sans-serif"].includes(font)) element.style.fontFamily = font;
    if (["bold", "700"].includes(node.style.fontWeight)) element.style.fontWeight = "bold";
    if (node.style.fontStyle === "italic") element.style.fontStyle = "italic";
    node.childNodes.forEach((child) => copy(child, element));
    parent.append(element);
  }
  source.body.childNodes.forEach((child) => copy(child, output));
  return output.innerHTML;
}

const serviceSchema = z.object({
  id: z.string().min(1),
  category: z.enum(["01", "02"]),
  title: z.string().trim().min(1).max(150),
  description: z
    .string()
    .max(50000)
    .transform(cleanServiceHtml)
    .refine((html) => {
      const doc = new DOMParser().parseFromString(html, "text/html");
      const text = doc.body.textContent?.trim() ?? "";
      return text.length > 0 && text.length <= 10000;
    }, "Enter a description of up to 10,000 characters."),
  image: z
    .object({
      src: z
        .string()
        .max(850000)
        .regex(/^data:image\/(jpeg|png|webp);base64,/),
      alt: z.string().trim().min(1).max(150),
    })
    .nullable(),
});
export type LocalService = z.infer<typeof serviceSchema>;
const key = "silverfox-local-services";

export function readLocalServices(): LocalService[] {
  try {
    const data: unknown = JSON.parse(localStorage.getItem(key) ?? "[]");
    if (!Array.isArray(data)) return [];
    return data.flatMap((item) => {
      const result = serviceSchema.safeParse(item);
      return result.success ? [result.data] : [];
    });
  } catch {
    return [];
  }
}

export function saveLocalService(service: LocalService) {
  const next = [...readLocalServices(), serviceSchema.parse(service)];
  localStorage.setItem(key, JSON.stringify(next));
  return next;
}
