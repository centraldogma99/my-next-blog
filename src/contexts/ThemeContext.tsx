"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";

interface ThemeContextType {
  setTheme: (theme: Theme) => void;
  resolvedTheme: "light" | "dark";
  theme: Theme;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const resolveTheme = (theme: Theme) => {
  if (theme === "system") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }
  return theme;
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isSystem, setIsSystem] = useState(true);
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as Theme;
    if (savedTheme) {
      setResolvedTheme(resolveTheme(savedTheme));
    }
  }, []);

  useEffect(() => {
    const updateToSystemTheme = () => {
      setResolvedTheme(
        window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light",
      );
    };

    if (isSystem) {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      mediaQuery.addEventListener("change", updateToSystemTheme);
      return () =>
        mediaQuery.removeEventListener("change", updateToSystemTheme);
    }
  }, [isSystem]);

  useEffect(() => {
    const root = document.documentElement;
    if (resolvedTheme === "dark") {
      root.classList.remove("light");
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
      root.classList.add("light");
    }
  }, [resolvedTheme]);

  const handleSetTheme = (newTheme: Theme) => {
    if (newTheme === "system") {
      setIsSystem(true);
    } else {
      setIsSystem(false);
      setResolvedTheme(resolveTheme(newTheme));
    }

    localStorage.setItem("theme", newTheme);
  };

  return (
    <ThemeContext.Provider
      value={{
        setTheme: handleSetTheme,
        resolvedTheme,
        theme: isSystem ? "system" : resolvedTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
