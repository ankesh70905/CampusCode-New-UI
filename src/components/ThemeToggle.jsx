import { Moon, Sun } from "lucide-react";
import { useTheme } from "../state/ThemeProvider.jsx";

export default function ThemeToggle() {
  const { theme, chooseTheme, storageError } = useTheme();

  return (
    <div className="theme-control">
      <span className="visually-hidden" id="theme-control-label">Color theme</span>
      <div className="theme-switch" role="group" aria-labelledby="theme-control-label">
        <button
          type="button"
          className={`theme-option${theme === "light" ? " is-active" : ""}`}
          aria-pressed={theme === "light"}
          onClick={() => chooseTheme("light")}
        >
          <Sun size={15} aria-hidden="true" />
          <span>Light</span>
        </button>
        <button
          type="button"
          className={`theme-option${theme === "dark" ? " is-active" : ""}`}
          aria-pressed={theme === "dark"}
          onClick={() => chooseTheme("dark")}
        >
          <Moon size={15} aria-hidden="true" />
          <span>Dark</span>
        </button>
      </div>
      {storageError && <span className="visually-hidden" role="status">{storageError}</span>}
    </div>
  );
}
