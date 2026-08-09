import { useEffect } from "react";
import { useUserPreferencesStore } from "@/store/user-preferences";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme, reducedMotion } = useUserPreferencesStore();

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove(
      "light",
      "dark",
      "theme-nord",
      "theme-sage",
      "theme-slate",
    );

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      root.classList.add(systemTheme);
    } else if (theme === "nord") {
      root.classList.add("dark", "theme-nord");
    } else if (theme === "sage") {
      root.classList.add("dark", "theme-sage");
    } else if (theme === "slate") {
      root.classList.add("dark", "theme-slate");
    } else {
      root.classList.add(theme);
    }

    if (reducedMotion) {
      root.classList.add("reduce-motion");
    } else {
      root.classList.remove("reduce-motion");
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      if (theme === "system") {
        root.classList.remove("light", "dark");
        root.classList.add(e.matches ? "dark" : "light");
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme, reducedMotion]);

  return <>{children}</>;
}
