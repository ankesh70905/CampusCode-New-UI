import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const ThemeContext = createContext(null);

function getInitialTheme() {
  const initializedTheme = document.documentElement.dataset.theme;
  return initializedTheme === "dark" ? "dark" : "light";
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme);
  const [storageError, setStorageError] = useState("");

  useEffect(() => {
    const syncTheme = (event) => {
      if (event.key !== "campuscode.theme" || (event.newValue !== "light" && event.newValue !== "dark")) return;
      document.documentElement.dataset.theme = event.newValue;
      document.documentElement.style.colorScheme = event.newValue;
      setTheme(event.newValue);
    };
    window.addEventListener("storage", syncTheme);
    return () => window.removeEventListener("storage", syncTheme);
  }, []);

  const chooseTheme = useCallback((nextTheme) => {
    if (nextTheme !== "light" && nextTheme !== "dark") return;
    document.documentElement.dataset.theme = nextTheme;
    document.documentElement.style.colorScheme = nextTheme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute(
      "content",
      nextTheme === "dark" ? "#101114" : "#f7f7f4",
    );
    setTheme(nextTheme);

    try {
      window.localStorage.setItem("campuscode.theme", nextTheme);
      setStorageError("");
    } catch {
      setStorageError("Theme changed for this visit, but this browser could not save your preference.");
    }
  }, []);

  const value = useMemo(() => ({ theme, chooseTheme, storageError }), [theme, chooseTheme, storageError]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider.");
  return context;
}
