import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

/** Password field with a button that shows or hides what has been typed. */
export default function PasswordInput({
  id,
  name,
  label,
  autoComplete,
  minLength,
  required = true,
  className,
  ...aria
}: {
  id: string;
  name: string;
  /** Used for the toggle's accessible name, e.g. "Show new password". */
  label: string;
  autoComplete: string;
  minLength?: number;
  required?: boolean;
  className?: string;
  "aria-invalid"?: true | undefined;
  "aria-describedby"?: string | undefined;
}) {
  const [visible, setVisible] = useState(false);
  return (
    <div className={cn("relative", className)}>
      <input
        id={id}
        name={name}
        className="admin-input pr-12"
        type={visible ? "text" : "password"}
        autoComplete={autoComplete}
        required={required}
        minLength={minLength}
        maxLength={200}
        autoCapitalize="none"
        spellCheck={false}
        {...aria}
      />
      <button
        type="button"
        onClick={() => setVisible(!visible)}
        aria-label={`${visible ? "Hide" : "Show"} ${label.toLowerCase()}`}
        aria-pressed={visible}
        aria-controls={id}
        title={visible ? "Hide password" : "Show password"}
        className="absolute right-1 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
      >
        {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      </button>
    </div>
  );
}
