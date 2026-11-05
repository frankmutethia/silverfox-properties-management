import { cleanRichHtml } from "./local-services";

export type BlogImage = { src: string; alt: string };
export type Draft = {
  id: string;
  title: string;
  body: string;
  updated: string;
  format: "html";
  cover: BlogImage | null;
};
const key = "silverfox-blog-drafts";
export function plainBlogText(html: string) {
  return new DOMParser().parseFromString(html, "text/html").body.textContent ?? "";
}
export function readDrafts(): Draft[] {
  try {
    const data: unknown = JSON.parse(localStorage.getItem(key) ?? "[]");
    if (!Array.isArray(data)) return [];
    return data.flatMap((item) => {
      if (
        !item ||
        typeof item.id !== "string" ||
        typeof item.title !== "string" ||
        typeof item.body !== "string" ||
        typeof item.updated !== "string"
      )
        return [];
      const legacy = document.createElement("div");
      legacy.textContent = item.body;
      const body =
        item.format === "html"
          ? cleanRichHtml(item.body, true)
          : legacy.innerHTML.replace(/\n/g, "<br>");
      const cover =
        item.cover &&
        typeof item.cover.src === "string" &&
        /^data:image\/(jpeg|png|webp);base64,/.test(item.cover.src) &&
        typeof item.cover.alt === "string"
          ? item.cover
          : null;
      return [
        {
          id: item.id,
          title: item.title,
          body,
          updated: item.updated,
          format: "html" as const,
          cover,
        },
      ];
    });
  } catch {
    return [];
  }
}
export function saveDrafts(drafts: Draft[]) {
  localStorage.setItem(key, JSON.stringify(drafts));
}
export async function readBlogImage(file: File): Promise<string> {
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size > 600000)
    throw new Error("Choose a JPG, PNG or WebP image up to 600 KB.");
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Unable to read image."));
    reader.onload = () => {
      const img = new Image();
      img.onload = () => resolve(String(reader.result));
      img.onerror = () => reject(new Error("This image could not be opened."));
      img.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
}
