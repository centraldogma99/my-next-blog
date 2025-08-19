"use client";

import { useTheme } from "@/contexts/ThemeContext";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const handleToggle = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <button
      onClick={handleToggle}
      className="p-[10px] rounded-lg bg-[var(--color-bg-secondary)] hover:bg-[var(--color-primary-hover)] hover:text-white border border-[var(--color-border)] hover:border-[var(--color-primary)] transition-all duration-200"
      title={`현재: ${theme === "dark" ? "다크" : "라이트"} 모드`}
    >
      {theme === "dark" ? (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="text-yellow-500 transition-transform duration-300 hover:rotate-12"
        >
          <path d="M21.64 13a1 1 0 0 0-1.05-.14 8.05 8.05 0 0 1-3.37.73A8.15 8.15 0 0 1 9.08 5.49a8.59 8.59 0 0 1 .25-2A1 1 0 0 0 8 2.36a10.14 10.14 0 1 0 14 11.69 1 1 0 0 0-.36-1.05zM12 19a8 8 0 0 1-8-8 8.07 8.07 0 0 1 .27-2.07 10.07 10.07 0 0 0 1.07 8.58A10.14 10.14 0 0 0 17.4 20a8 8 0 0 1-5.4-1z" />
        </svg>
      ) : (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="text-orange-400 transition-transform duration-300 hover:rotate-180"
        >
          <path d="M12 4a1 1 0 0 0 1-1V2a1 1 0 0 0-2 0v1a1 1 0 0 0 1 1z" />
          <path d="M12 20a1 1 0 0 0-1 1v1a1 1 0 0 0 2 0v-1a1 1 0 0 0-1-1z" />
          <path d="M4.93 5.64l.71-.71a1 1 0 1 0-1.42-1.42l-.71.71a1 1 0 0 0 0 1.42 1 1 0 0 0 1.42 0z" />
          <path d="M19.07 18.36l-.71.71a1 1 0 0 0 0 1.42 1 1 0 0 0 1.42 0l.71-.71a1 1 0 0 0 0-1.42 1 1 0 0 0-1.42 0z" />
          <path d="M4 12a1 1 0 0 0-1-1H2a1 1 0 0 0 0 2h1a1 1 0 0 0 1-1z" />
          <path d="M22 11h-1a1 1 0 0 0 0 2h1a1 1 0 0 0 0-2z" />
          <path d="M5.64 19.07a1 1 0 0 0-.71-.29 1 1 0 0 0-.71.29 1 1 0 0 0 0 1.42l.71.71a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42z" />
          <path d="M18.36 4.93a1 1 0 0 0 1.42 0l.71-.71a1 1 0 0 0 0-1.42 1 1 0 0 0-1.42 0l-.71.71a1 1 0 0 0 0 1.42z" />
          <circle cx="12" cy="12" r="5" />
        </svg>
      )}
    </button>
  );
}
