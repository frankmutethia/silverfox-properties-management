import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BriefcaseBusiness,
  Building2,
  Check,
  CircleHelp,
  FileText,
  Globe,
  LayoutDashboard,
  Lightbulb,
  MessageSquareQuote,
  Moon,
  PanelLeftClose,
  Sparkles,
  UserRound,
  UsersRound,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";

type Step = {
  /** `data-tour` values to highlight, in order of preference. None: a centred card. */
  targets?: string[];
  icon: LucideIcon;
  title: string;
  body: ReactNode;
};

const SUPPORT_EMAIL = "Info@silverfoxpropertymanagement.co.ke";

const STEPS: Step[] = [
  {
    icon: Sparkles,
    title: "Welcome to your Silverfox workspace",
    body: (
      <p>
        This short tour shows where everything is and what each part does. It takes about a minute.
        Skip it whenever you like and replay it from the Help button.
      </p>
    ),
  },
  {
    targets: ["nav-/admin", "menu"],
    icon: LayoutDashboard,
    title: "Dashboard",
    body: (
      <p>
        Your overview: totals for properties, services, articles and testimonials, the most recently
        updated properties, testimonials waiting for review and the latest articles.
      </p>
    ),
  },
  {
    targets: ["nav-/admin/properties", "menu"],
    icon: Building2,
    title: "Properties",
    body: (
      <p>
        Create, edit and delete listings. Search by name, location or reference and filter by
        status, listing category or property type. A property needs at least one photo before it can
        be published.
      </p>
    ),
  },
  {
    targets: ["nav-/admin/services", "menu"],
    icon: BriefcaseBusiness,
    title: "Services",
    body: (
      <p>
        The services shown on the website, grouped by category. Create, edit or delete services,
        reorder them with the up and down arrows, and rename each category.
      </p>
    ),
  },
  {
    targets: ["nav-/admin/blogs", "menu"],
    icon: FileText,
    title: "Blogs",
    body: (
      <p>
        Write and publish articles for the journal. Search titles and summaries, filter by status,
        and open published articles on the website.
      </p>
    ),
  },
  {
    targets: ["nav-/admin/testimonials", "menu"],
    icon: MessageSquareQuote,
    title: "Testimonials",
    body: (
      <p>
        Client feedback. Testimonials sent from the website arrive here for review: publish the ones
        to show and delete the rest. You can also add one yourself.
      </p>
    ),
  },
  {
    targets: ["nav-/admin/users", "menu"],
    icon: UsersRound,
    title: "User Management",
    body: (
      <p>
        Everyone who can sign in to this workspace. Use <strong>Add admin</strong> to create an
        account for a colleague with a password you choose; they can change it from their Profile.
      </p>
    ),
  },
  {
    targets: ["nav-/admin/profile", "menu"],
    icon: UserRound,
    title: "Profile",
    body: (
      <p>
        Update your name, contact email, phone number and profile photo, and change your password.
      </p>
    ),
  },
  {
    targets: ["sidebar-toggle", "menu"],
    icon: PanelLeftClose,
    title: "Sidebar",
    body: (
      <p>
        Collapse the sidebar to icons for more room, then expand it again with the same button. On
        smaller screens this button opens the menu instead.
      </p>
    ),
  },
  {
    targets: ["sidebar-footer", "profile"],
    icon: Globe,
    title: "View website and sign out",
    body: (
      <p>
        <strong>View website</strong> opens the public site so you can check what visitors see.{" "}
        <strong>Sign out</strong> ends your session on this device.
      </p>
    ),
  },
  {
    targets: ["theme"],
    icon: Moon,
    title: "Light and dark mode",
    body: <p>Switch between light and dark mode. Your choice is remembered on this device.</p>,
  },
  {
    targets: ["help"],
    icon: CircleHelp,
    title: "Help",
    body: (
      <p>Replay this tour any time. Its last card has quick tips and a link to contact support.</p>
    ),
  },
  {
    targets: ["profile"],
    icon: UserRound,
    title: "Your profile picture",
    body: (
      <p>
        Your photo, name and sign-in email. Click it for <strong>My profile</strong>,{" "}
        <strong>View website</strong> or <strong>Sign out</strong>. Change the photo on your Profile
        page.
      </p>
    ),
  },
  {
    icon: Lightbulb,
    title: "Quick tips before you start",
    body: (
      <ul className="space-y-3">
        <li>
          <strong>Drafts and publishing:</strong> new properties, services, articles and
          testimonials start as drafts. Only published items appear on the website.
        </li>
        <li>
          <strong>Photos:</strong> JPG, PNG or WebP, up to 5 MB each.
        </li>
        <li>
          <strong>Need a hand?</strong>{" "}
          <a
            href={`mailto:${SUPPORT_EMAIL}`}
            className="inline-flex items-center gap-1 font-semibold text-accent underline underline-offset-4"
          >
            Contact support <ArrowUpRight className="size-3.5" aria-hidden="true" />
          </a>
        </li>
      </ul>
    ),
  },
];

const GAP = 16;
const MARGIN = 16;
const PAD = 6;

function findTarget(targets: string[] | undefined) {
  for (const name of targets ?? []) {
    for (const el of document.querySelectorAll<HTMLElement>(`[data-tour="${name}"]`)) {
      const rect = el.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) return { el, fallback: name !== targets?.[0] };
    }
  }
  return null;
}

type Box = { top: number; left: number; width: number; height: number };

function placeCard(target: Box | null, card: { width: number; height: number }) {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const clampX = (x: number) => Math.min(Math.max(x, MARGIN), vw - card.width - MARGIN);
  const clampY = (y: number) => Math.min(Math.max(y, MARGIN), vh - card.height - MARGIN);
  if (!target) return { left: clampX((vw - card.width) / 2), top: clampY((vh - card.height) / 2) };
  const right = target.left + target.width;
  const bottom = target.top + target.height;
  const midY = target.top + target.height / 2 - card.height / 2;
  const midX = target.left + target.width / 2 - card.width / 2;
  const sides = [
    { fits: right + GAP + card.width <= vw - MARGIN, left: right + GAP, top: midY },
    { fits: bottom + GAP + card.height <= vh - MARGIN, left: midX, top: bottom + GAP },
    {
      fits: target.left - GAP - card.width >= MARGIN,
      left: target.left - GAP - card.width,
      top: midY,
    },
    {
      fits: target.top - GAP - card.height >= MARGIN,
      left: midX,
      top: target.top - GAP - card.height,
    },
  ];
  // Header controls sit along the top edge: open the card below them.
  if (bottom < 140) sides.unshift(sides.splice(1, 1)[0]!);
  const side = sides.find((option) => option.fits) ?? sides[1]!;
  return { left: clampX(side.left), top: clampY(side.top) };
}

/**
 * A guided tour of the workspace: each card highlights one part of the screen and explains it.
 * Keyboard: arrow keys move between steps, Escape skips the tour.
 */
export default function WorkspaceTour({
  open,
  onClose,
}: {
  open: boolean;
  /** Called when the tour is finished or skipped. */
  onClose: (finished: boolean) => void;
}) {
  const [index, setIndex] = useState(0);
  const [target, setTarget] = useState<Box | null>(null);
  const [fallback, setFallback] = useState(false);
  const [cardSize, setCardSize] = useState({ width: 380, height: 280 });
  const cardRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const ids = useId();
  const step = STEPS[index]!;
  const last = index === STEPS.length - 1;

  useEffect(() => {
    if (open) setIndex(0);
  }, [open]);

  const measure = useCallback(() => {
    const found = findTarget(step.targets);
    setFallback(Boolean(found?.fallback));
    if (!found) return setTarget(null);
    const rect = found.el.getBoundingClientRect();
    setTarget({
      top: rect.top - PAD,
      left: rect.left - PAD,
      width: rect.width + PAD * 2,
      height: rect.height + PAD * 2,
    });
  }, [step]);

  useLayoutEffect(() => {
    if (!open) return;
    findTarget(step.targets)?.el.scrollIntoView({ block: "nearest" });
    measure();
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, true);
    return () => {
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure, true);
    };
  }, [open, step, measure]);

  useLayoutEffect(() => {
    const card = cardRef.current;
    if (!open || !card) return;
    const observer = new ResizeObserver(() =>
      setCardSize({ width: card.offsetWidth, height: card.offsetHeight }),
    );
    observer.observe(card);
    return () => observer.disconnect();
  }, [open]);

  // Return focus to whatever opened the tour. Declared before the title focus so it
  // records the opener, not the tour's own heading.
  useEffect(() => {
    if (!open) return;
    const opener = document.activeElement as HTMLElement | null;
    return () => opener?.focus?.();
  }, [open]);

  useEffect(() => {
    if (open) titleRef.current?.focus();
  }, [open, index]);

  if (!open) return null;

  const next = () => (last ? onClose(true) : setIndex(index + 1));
  const back = () => setIndex(Math.max(0, index - 1));

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape") {
      event.preventDefault();
      onClose(false);
    } else if (event.key === "ArrowRight" && !(event.target instanceof HTMLButtonElement)) {
      next();
    } else if (event.key === "ArrowLeft" && !(event.target instanceof HTMLButtonElement)) {
      back();
    } else if (event.key === "Tab") {
      // Keep focus inside the card while the tour is open.
      const focusable = cardRef.current?.querySelectorAll<HTMLElement>("button, a[href]");
      if (!focusable?.length) return;
      const first = focusable[0]!;
      const end = focusable[focusable.length - 1]!;
      if (
        event.shiftKey &&
        (document.activeElement === first || document.activeElement === titleRef.current)
      ) {
        event.preventDefault();
        end.focus();
      } else if (!event.shiftKey && document.activeElement === end) {
        event.preventDefault();
        first.focus();
      }
    }
  }

  const position = placeCard(target, cardSize);
  const Icon = step.icon;
  const progress = ((index + 1) / STEPS.length) * 100;

  return createPortal(
    <div className="fixed inset-0 z-[100]" onKeyDown={onKeyDown}>
      {/* Dims everything except the highlighted control and blocks clicks while touring. */}
      {target ? (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed rounded-xl ring-2 ring-accent ring-offset-2 ring-offset-transparent motion-safe:transition-all motion-safe:duration-300"
          style={{ ...target, boxShadow: "0 0 0 9999px rgb(8 15 30 / 0.62)" }}
        />
      ) : (
        <div aria-hidden="true" className="fixed inset-0 bg-[rgb(8_15_30/0.62)]" />
      )}
      <div
        ref={cardRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${ids}-title`}
        aria-describedby={`${ids}-body`}
        className="fixed w-[min(380px,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-border bg-card text-card-foreground shadow-2xl motion-safe:transition-[top,left] motion-safe:duration-300"
        style={position}
      >
        <div className="h-1 bg-secondary">
          <div
            className="h-full bg-accent motion-safe:transition-[width] motion-safe:duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="p-6">
          <div className="flex items-start gap-4">
            <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-accent/15 text-accent">
              <Icon className="size-5" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="text-[11px] font-bold uppercase tracking-[.16em] text-muted-foreground">
                Step {index + 1} of {STEPS.length}
              </p>
              <h2
                ref={titleRef}
                id={`${ids}-title`}
                tabIndex={-1}
                className="mt-1 text-lg font-semibold leading-snug outline-none"
              >
                {step.title}
              </h2>
            </div>
          </div>
          <div
            id={`${ids}-body`}
            className="mt-4 text-sm leading-6 text-muted-foreground [&_strong]:text-foreground"
          >
            {step.body}
            {fallback && (
              <p className="mt-3 rounded-lg bg-secondary px-3 py-2 text-xs">
                On this screen size, it’s inside the highlighted menu.
              </p>
            )}
          </div>
          <div className="mt-5 flex justify-center gap-1.5" aria-hidden="true">
            {STEPS.map((item, dot) => (
              <span
                key={item.title}
                className={`h-1.5 rounded-full motion-safe:transition-all ${dot === index ? "w-5 bg-accent" : dot < index ? "w-1.5 bg-accent/50" : "w-1.5 bg-border"}`}
              />
            ))}
          </div>
        </div>
        <div className="flex items-center justify-between gap-2 border-t border-border bg-secondary/40 px-6 py-4">
          {last ? (
            <span />
          ) : (
            <button
              type="button"
              onClick={() => onClose(false)}
              className="rounded-md text-sm font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              Skip tutorial
            </button>
          )}
          <div className="flex gap-2">
            {index > 0 && (
              <Button type="button" variant="outline" size="sm" onClick={back}>
                <ArrowLeft />
                Back
              </Button>
            )}
            <Button type="button" size="sm" onClick={next}>
              {last ? (
                <>
                  <Check />
                  Finish
                </>
              ) : index === 0 ? (
                <>
                  Start tour
                  <ArrowRight />
                </>
              ) : (
                <>
                  Next
                  <ArrowRight />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
