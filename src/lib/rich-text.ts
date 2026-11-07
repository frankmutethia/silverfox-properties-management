// Mirrors the API's rich-text allowlist. The server sanitizes everything it stores; this
// copy keeps the editor honest and is a second line of defence before rendering HTML.

const allowedTags = new Set([
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
const droppedTags = ["SCRIPT", "STYLE", "IFRAME", "OBJECT", "SVG", "MATH", "TEXTAREA", "TITLE"];
const fontSizes: Record<string, string> = { "2": "14px", "3": "16px", "4": "18px", "5": "24px" };

/** Rebuilds HTML from the allowlist. With `images`, keeps `<img>` that use an https:// URL. */
export function cleanRichHtml(html: string, images = false) {
  const source = new DOMParser().parseFromString(html, "text/html");
  const output = document.createElement("div");
  function copy(node: Node, parent: HTMLElement) {
    if (node.nodeType === Node.TEXT_NODE) {
      parent.append(document.createTextNode(node.textContent ?? ""));
      return;
    }
    if (!(node instanceof HTMLElement) || droppedTags.includes(node.tagName)) return;
    if (node.tagName === "IMG") {
      const src = node.getAttribute("src") ?? "";
      if (images && /^https:\/\//i.test(src)) {
        const img = document.createElement("img");
        img.src = src;
        img.alt = (node.getAttribute("alt") ?? "").trim().slice(0, 150);
        parent.append(img);
      }
      return;
    }
    if (!allowedTags.has(node.tagName)) {
      node.childNodes.forEach((child) => copy(child, parent));
      return;
    }
    const element = document.createElement(
      node.tagName === "FONT" ? "span" : node.tagName.toLowerCase(),
    );
    const size = fontSizes[node.getAttribute("size") ?? ""] ?? node.style.fontSize;
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

/** Visible text of an HTML fragment, with whitespace collapsed. */
export function plainText(html: string) {
  const body = new DOMParser().parseFromString(
    html.replace(/<(br|\/p|\/div|\/li|\/h2|\/h3)\b[^>]*>/gi, " $&"),
    "text/html",
  ).body;
  return (body.textContent ?? "").replace(/\s+/g, " ").trim();
}

export const richTextClass =
  "break-words text-sm leading-7 [&_ol]:list-decimal [&_ol]:pl-6 [&_ul]:list-disc [&_ul]:pl-6 [&_h2]:text-2xl [&_h2]:font-bold [&_h3]:text-lg [&_h3]:font-semibold [&_p]:my-2 [&_blockquote]:border-l-2 [&_blockquote]:border-accent [&_blockquote]:pl-4";

export const articleTextClass =
  "break-words leading-8 text-foreground/80 [&_h2]:mb-4 [&_h2]:mt-9 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-primary [&_h3]:mb-3 [&_h3]:mt-7 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-primary [&_p]:my-4 [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6 [&_blockquote]:my-6 [&_blockquote]:border-l-2 [&_blockquote]:border-accent [&_blockquote]:pl-5 [&_img]:my-6 [&_img]:h-auto [&_img]:w-full [&_img]:rounded-xl";
