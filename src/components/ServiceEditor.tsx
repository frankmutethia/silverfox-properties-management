import { useEffect, useId, useRef, useState } from "react";
import { Bold, Italic, Underline, ListOrdered, List, Undo2, Redo2 } from "lucide-react";
import { toast } from "sonner";
import { cleanRichHtml, richTextClass } from "@/lib/rich-text";
import { imageFileProblem, upload, UPLOAD_TYPES, type UploadFolder } from "@/lib/api";
import { ARTICLE_MAX_IMAGES } from "@/lib/blog";
import { reportError } from "@/lib/use-query";
import { Button } from "@/components/ui/button";

/**
 * contentEditable editor limited to the API's rich-text allowlist. With `imageFolder`, it
 * also accepts up to five inline images, uploaded to /media and inserted by https URL.
 */
export default function ServiceEditor({
  label,
  onChange,
  initialHtml = "",
  imageFolder,
  onBusy,
  maxText,
  error,
  errorId,
}: {
  label: string;
  onChange: (html: string) => void;
  initialHtml?: string;
  imageFolder?: UploadFolder;
  onBusy?: (busy: boolean) => void;
  maxText: number;
  error?: string | undefined;
  errorId?: string;
}) {
  const allowImages = imageFolder !== undefined;
  const editor = useRef<HTMLDivElement>(null);
  const selection = useRef<Range | null>(null);
  const [active, setActive] = useState<Record<string, boolean>>({});
  const [images, setImages] = useState<{ src: string; alt: string }[]>([]);
  const [uploadStatus, setUploadStatus] = useState("");
  const ids = useId();
  const labelId = `${ids}-label`;
  const helpId = `${ids}-help`;
  const busy = uploadStatus !== "";

  useEffect(() => {
    if (!editor.current) return;
    editor.current.innerHTML = cleanRichHtml(initialHtml, allowImages);
    onChange(editor.current.innerHTML);
    setImages(
      Array.from(editor.current.querySelectorAll("img"), (img) => ({
        src: img.src,
        alt: img.alt,
      })),
    );
    // Only reset when the starting content changes, not when the parent re-renders.
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const imageCount = () => editor.current?.querySelectorAll("img").length ?? 0;

  async function insertImages(files: File[]) {
    if (!files.length || busy || !imageFolder) return;
    if (imageCount() + files.length > ARTICLE_MAX_IMAGES) {
      toast.error(`Use up to ${ARTICLE_MAX_IMAGES} images inside the article.`);
      return;
    }
    const problem = files.map(imageFileProblem).find(Boolean);
    if (problem) {
      toast.error(problem);
      return;
    }
    onBusy?.(true);
    const urls: string[] = [];
    try {
      for (const [index, file] of files.entries()) {
        const label = files.length > 1 ? `image ${index + 1} of ${files.length}` : "image";
        setUploadStatus(`Uploading ${label}… 0%`);
        const image = await upload(file, imageFolder, (percent) =>
          setUploadStatus(`Uploading ${label}… ${percent}%`),
        );
        urls.push(image.url);
      }
    } catch (uploadError) {
      reportError(uploadError);
    } finally {
      if (urls.length) {
        const html = urls.map((url) => `<p><img src="${url}" alt=""></p><p><br></p>`).join("");
        command("insertHTML", html);
      }
      setUploadStatus("");
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
            (name) => [name, document.queryCommandState(name)],
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
      <p id={labelId} className="mb-2 text-sm font-medium">
        {label} *
      </p>
      <div
        className={`overflow-hidden rounded-lg border bg-background focus-within:ring-2 focus-within:ring-ring ${error ? "border-destructive" : "border-input"}`}
      >
        <div
          role="group"
          aria-label={`${label} formatting`}
          className="flex flex-wrap items-center gap-1 border-b border-border bg-secondary/50 p-2"
        >
          {[
            { name: "bold", text: "Bold", icon: Bold },
            { name: "italic", text: "Italic", icon: Italic },
            { name: "underline", text: "Underline", icon: Underline },
            { name: "insertOrderedList", text: "Numbered list", icon: ListOrdered },
            { name: "insertUnorderedList", text: "Bullet list", icon: List },
            { name: "undo", text: "Undo", icon: Undo2 },
            { name: "redo", text: "Redo", icon: Redo2 },
          ].map(({ name, text, icon: Icon }) => (
            <Button
              key={name}
              type="button"
              variant={active[name] ? "secondary" : "ghost"}
              size="icon"
              aria-label={text}
              title={text}
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
            <label
              className={`rounded border border-input bg-background px-3 py-2 text-sm ${busy ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
            >
              Insert images
              <input
                aria-label="Insert article images"
                type="file"
                accept={UPLOAD_TYPES.join(",")}
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
          aria-labelledby={labelId}
          aria-describedby={error && errorId ? `${helpId} ${errorId}` : helpId}
          aria-invalid={error ? true : undefined}
          aria-multiline="true"
          aria-required="true"
          contentEditable
          suppressContentEditableWarning
          className={`${richTextClass} [&_img]:my-4 [&_img]:h-auto [&_img]:max-w-full min-h-52 max-h-96 overflow-y-auto p-4 outline-none`}
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
              if (count + imageCount() > ARTICLE_MAX_IMAGES) {
                toast.error(`Use up to ${ARTICLE_MAX_IMAGES} images inside the article.`);
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
      <p id={helpId} className="mt-2 text-xs text-muted-foreground">
        {allowImages
          ? `Paste text, formatted content or clipboard images. Insert up to ${ARTICLE_MAX_IMAGES} JPG/PNG/WebP images (5 MB each) and describe each one below. Up to ${maxText.toLocaleString("en-GB")} characters. Copied web images keep their original HTTPS address.`
          : `Select text to format it. Pasted text uses your editor formatting. Up to ${maxText.toLocaleString("en-GB")} characters.`}
      </p>
      {error && (
        <p id={errorId} className="mt-1.5 text-xs text-destructive">
          {error}
        </p>
      )}
      {busy && (
        <p role="status" className="mt-2 text-sm">
          {uploadStatus}
        </p>
      )}
      {allowImages &&
        images.map((image, index) => (
          <div
            key={`${index}-${image.src}`}
            className="mt-3 flex items-center gap-3 rounded border border-border p-3"
          >
            <img src={image.src} alt="" className="size-12 object-cover" />
            <label className="min-w-0 flex-1 text-xs">
              Article image {index + 1} description *
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
