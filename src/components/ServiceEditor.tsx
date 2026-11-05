import { useEffect, useRef, useState } from "react";
import { cleanRichHtml } from "@/lib/local-services";
import { readBlogImage } from "@/lib/blogs";
import { Bold, Italic, Underline, ListOrdered, List, Undo2, Redo2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export const serviceTextClass =
  "break-words text-sm leading-7 [&_ol]:list-decimal [&_ol]:pl-6 [&_ul]:list-disc [&_ul]:pl-6 [&_h2]:text-2xl [&_h2]:font-bold [&_h3]:text-lg [&_h3]:font-semibold [&_p]:my-2 [&_blockquote]:border-l-2 [&_blockquote]:border-accent [&_blockquote]:pl-4";

export default function ServiceEditor({
  onChange,
  initialHtml = "",
  allowImages = false,
  onBusy,
}: {
  onChange: (html: string) => void;
  initialHtml?: string;
  allowImages?: boolean;
  onBusy?: (busy: boolean) => void;
}) {
  const editor = useRef<HTMLDivElement>(null);
  const selection = useRef<Range | null>(null);
  const [active, setActive] = useState<Record<string, boolean>>({});
  const [images, setImages] = useState<{ src: string; alt: string }[]>([]);
  const [imageError, setImageError] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    if (editor.current) {
      editor.current.innerHTML = cleanRichHtml(initialHtml, allowImages);
      setImages(
        Array.from(editor.current.querySelectorAll("img"), (img) => ({
          src: img.src,
          alt: img.alt,
        })),
      );
    }
  }, [initialHtml, allowImages]);
  function sync() {
    onChange(editor.current?.innerHTML ?? "");
    setImages(
      Array.from(editor.current?.querySelectorAll("img") ?? [], (img) => ({
        src: img.src,
        alt: img.alt,
      })),
    );
  }
  async function insertImages(files: File[]) {
    if (!files.length || busy) return;
    if ((editor.current?.querySelectorAll("img").length ?? 0) + files.length > 5) {
      setImageError("Use up to five images inside the article.");
      return;
    }
    setImageError("");
    setBusy(true);
    onBusy?.(true);
    try {
      const sources = await Promise.all(files.map(readBlogImage));
      command(
        "insertHTML",
        sources.map((src) => `<p><img src="${src}" alt=""></p><p><br></p>`).join(""),
      );
    } catch (error) {
      setImageError(error instanceof Error ? error.message : "Unable to insert image.");
    } finally {
      setBusy(false);
      onBusy?.(false);
    }
  }
  function remember() {
    const current = window.getSelection();
    if (
      current?.rangeCount &&
      editor.current?.contains(current.anchorNode) &&
      editor.current.contains(current.focusNode)
    ) {
      selection.current = current.getRangeAt(0).cloneRange();
      setActive(
        Object.fromEntries(
          ["bold", "italic", "underline", "insertOrderedList", "insertUnorderedList"].map(
            (command) => [command, document.queryCommandState(command)],
          ),
        ),
      );
    }
  }
  function command(name: string, value?: string) {
    editor.current?.focus();
    const current = window.getSelection();
    if (selection.current && editor.current?.contains(selection.current.commonAncestorContainer)) {
      current?.removeAllRanges();
      current?.addRange(selection.current);
    }
    document.execCommand(name, false, value);
    remember();
    sync();
  }
  return (
    <div>
      <p id="service-description-label" className="mb-2 text-sm font-medium">
        Description *
      </p>
      <div className="overflow-hidden rounded-lg border border-input bg-background focus-within:ring-2 focus-within:ring-ring">
        <div
          role="group"
          aria-label="Description formatting"
          className="flex flex-wrap items-center gap-1 border-b border-border bg-secondary/50 p-2"
        >
          {[
            { name: "bold", label: "Bold", icon: Bold },
            { name: "italic", label: "Italic", icon: Italic },
            { name: "underline", label: "Underline", icon: Underline },
            { name: "insertOrderedList", label: "Numbered list", icon: ListOrdered },
            { name: "insertUnorderedList", label: "Bullet list", icon: List },
            { name: "undo", label: "Undo", icon: Undo2 },
            { name: "redo", label: "Redo", icon: Redo2 },
          ].map(({ name, label, icon: Icon }) => (
            <Button
              key={name}
              type="button"
              variant={active[name] ? "secondary" : "ghost"}
              size="icon"
              aria-label={label}
              title={label}
              aria-pressed={name in active ? active[name] : undefined}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => command(name)}
            >
              <Icon />
            </Button>
          ))}
          <select
            aria-label="Text style"
            defaultValue=""
            className="h-10 rounded border border-input bg-background px-2 text-sm"
            onChange={(event) => {
              command("formatBlock", event.target.value);
              event.target.value = "";
            }}
          >
            <option value="" disabled>
              Text style
            </option>
            <option value="p">Paragraph</option>
            <option value="h2">Heading</option>
            <option value="h3">Subheading</option>
            <option value="blockquote">Quote</option>
          </select>
          {allowImages && (
            <label className="cursor-pointer rounded border border-input bg-background px-3 py-2 text-sm">
              Insert images
              <input
                aria-label="Insert article images"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                disabled={busy}
                className="sr-only"
                onChange={(event) => {
                  void insertImages(Array.from(event.target.files ?? []));
                  event.target.value = "";
                }}
              />
            </label>
          )}
          <select
            aria-label="Font size"
            defaultValue=""
            className="h-10 rounded border border-input bg-background px-2 text-sm"
            onChange={(event) => {
              command("fontSize", event.target.value);
              event.target.value = "";
            }}
          >
            <option value="" disabled>
              Font size
            </option>
            <option value="2">14 px</option>
            <option value="3">16 px</option>
            <option value="4">18 px</option>
            <option value="5">24 px</option>
          </select>
          <select
            aria-label="Font family"
            defaultValue=""
            className="h-10 rounded border border-input bg-background px-2 text-sm"
            onChange={(event) => {
              command("fontName", event.target.value);
              event.target.value = "";
            }}
          >
            <option value="" disabled>
              Font family
            </option>
            <option value="sans-serif">Sans serif</option>
            <option value="serif">Serif</option>
          </select>
        </div>
        <div
          ref={editor}
          role="textbox"
          aria-labelledby="service-description-label"
          aria-describedby="service-editor-help"
          aria-multiline="true"
          aria-required="true"
          contentEditable
          suppressContentEditableWarning
          className={`${serviceTextClass} [&_img]:my-4 [&_img]:max-w-full [&_img]:h-auto min-h-52 max-h-80 overflow-y-auto p-4 outline-none`}
          onMouseUp={remember}
          onKeyUp={remember}
          onBlur={remember}
          onInput={() => {
            remember();
            sync();
          }}
          onPaste={(event) => {
            event.preventDefault();
            remember();
            const files = Array.from(event.clipboardData.files).filter((file) =>
              file.type.startsWith("image/"),
            );
            const html = event.clipboardData.getData("text/html");
            if (allowImages && html) {
              const cleaned = cleanRichHtml(html, true);
              const count = new DOMParser()
                .parseFromString(cleaned, "text/html")
                .querySelectorAll("img").length;
              if (count + (editor.current?.querySelectorAll("img").length ?? 0) > 5) {
                setImageError("Use up to five images inside the article.");
                return;
              }
              command("insertHTML", cleaned);
              if (!count && files.length) void insertImages(files);
            } else {
              command("insertText", event.clipboardData.getData("text/plain"));
              if (allowImages && files.length) void insertImages(files);
            }
          }}
          onDrop={(event) => event.preventDefault()}
        />
      </div>
      <p id="service-editor-help" className="mt-2 text-xs text-muted-foreground">
        {allowImages
          ? "Paste text, formatted content or clipboard images. Insert up to five JPG/PNG/WebP images (600 KB each). Add alt text below for every image. Maximum 50,000 characters. Copied web images use their original HTTPS URL."
          : "Select text to format it. Pasted text uses your editor formatting. Maximum 10,000 characters."}
      </p>
      {busy && (
        <p role="status" className="mt-2 text-sm">
          Reading images…
        </p>
      )}
      {imageError && (
        <p role="alert" className="mt-2 text-sm text-destructive">
          {imageError}
        </p>
      )}
      {allowImages &&
        images.map((image, index) => (
          <div
            key={index}
            className="mt-3 flex items-center gap-3 rounded border border-border p-3"
          >
            <img src={image.src} alt="" className="size-12 object-cover" />
            <label className="min-w-0 flex-1 text-xs">
              Article image {index + 1} alt text *
              <input
                required
                maxLength={150}
                className="admin-input mt-1"
                value={image.alt}
                onChange={(event) => {
                  const img = editor.current?.querySelectorAll("img")[index];
                  if (img) img.alt = event.target.value;
                  sync();
                }}
              />
            </label>
            <Button
              type="button"
              variant="ghost"
              disabled={busy}
              aria-label={`Remove article image ${index + 1}`}
              onClick={() => {
                editor.current?.querySelectorAll("img")[index]?.remove();
                sync();
              }}
            >
              Remove
            </Button>
          </div>
        ))}
    </div>
  );
}
