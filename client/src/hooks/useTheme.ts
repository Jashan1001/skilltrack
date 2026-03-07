import { useEffect, useState } from "react";

export const useTheme = () => {
  const getInitialTheme = () => {
    const saved = localStorage.getItem("theme");

    if (saved === "dark" || saved === "light") return saved;

    if (window.matchMedia("(prefers-color-scheme: dark)").matches)
      return "dark";

    return "light";
  };

  const [theme, setTheme] = useState<"dark" | "light">(getInitialTheme);

  useEffect(() => {
    const root = document.documentElement;

    root.classList.toggle("dark", theme === "dark");

    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return { theme, toggleTheme };
};