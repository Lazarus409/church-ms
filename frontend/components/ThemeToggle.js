"use client";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") {
      return "light";
    }
    return localStorage.getItem("theme") || "light";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggle = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    localStorage.setItem("theme", next);
    document.documentElement.setAttribute("data-theme", next);
  };

  return (
    <button
      onClick={toggle}
      className="theme-toggle"
      style={{
        background: "var(--gold-bg)",
        border: "1px solid var(--gold-border)",
        borderRadius: 8,
        padding: "6px 12px",
        cursor: "pointer",
        fontSize: 16,
        color: "var(--gold)",
        transition: "all 0.2s",
        display: "flex",
        alignItems: "center",
        gap: 6,
      }}
      title="Toggle theme"
    >
      {theme === "light" ? "🌙" : "☀️"}
    </button>
  );
}
