import { CircleAlert, CircleCheck, Info, LoaderCircle, TriangleAlert, X } from "lucide-react";
import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const badge = "flex size-8 items-center justify-center rounded-full [&_svg]:size-[18px]";

/** Notification cards styled with the site's design tokens (light and dark). */
const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className="toaster group"
      gap={10}
      icons={{
        success: (
          <span className={`${badge} bg-emerald-600/12 text-emerald-700 dark:text-emerald-400`}>
            <CircleCheck />
          </span>
        ),
        error: (
          <span className={`${badge} bg-destructive/12 text-destructive`}>
            <CircleAlert />
          </span>
        ),
        warning: (
          <span className={`${badge} bg-amber-500/15 text-amber-700 dark:text-amber-400`}>
            <TriangleAlert />
          </span>
        ),
        info: (
          <span className={`${badge} bg-accent/15 text-accent`}>
            <Info />
          </span>
        ),
        loading: (
          <span className={`${badge} bg-secondary text-muted-foreground`}>
            <LoaderCircle className="animate-spin" />
          </span>
        ),
        close: <X className="size-4" />,
      }}
      toastOptions={{
        unstyled: true,
        classNames: {
          toast:
            "group relative flex w-full items-start gap-3 overflow-hidden rounded-xl border border-border bg-card p-4 pr-11 font-sans text-card-foreground shadow-lg shadow-primary/10 before:absolute before:inset-y-0 before:left-0 before:w-1 sm:w-[380px]",
          success: "before:bg-emerald-600",
          error: "before:bg-destructive",
          warning: "before:bg-amber-500",
          info: "before:bg-accent",
          icon: "mt-0.5 shrink-0",
          content: "min-w-0 flex-1",
          title: "text-sm font-semibold leading-5 text-foreground",
          description: "mt-1 text-[13px] leading-5 text-muted-foreground break-words",
          actionButton:
            "mt-0.5 shrink-0 self-center rounded-md border border-input bg-background px-3 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-secondary",
          closeButton:
            "absolute! left-auto! right-2.5 top-2.5 flex size-7 items-center justify-center rounded-md border-0! bg-transparent! text-muted-foreground! transition-colors hover:bg-secondary! hover:text-foreground!",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
