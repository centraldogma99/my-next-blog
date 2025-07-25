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
      className="p-2 rounded-md border hover:bg-gray-100 dark:hover:bg-gray-800"
      title={`현재: ${theme === "dark" ? "다크" : "라이트"} 모드`}
    >
      {theme === "dark" ? "🌙" : "☀️"}
    </button>
  );
}
