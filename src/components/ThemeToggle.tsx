import { useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "./ui/button";

export default function ThemeToggle() {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains("dark"));
  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("silverfox-theme", next ? "dark" : "light");
    } catch {
      /* Storage is optional. */
    }
  }
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggle}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      title={dark ? "Light mode" : "Dark mode"}
    >
      {dark ? <Sun /> : <Moon />}
    </Button>
  );
}
