"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import ThemeToggle from "./ThemeToggle";

export default function Navbar({ links = [] }) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <nav
      style={{
        background: "var(--bg-nav)",
        backdropFilter: "blur(12px)",
      }}
      className="app-navbar"
    >
      <Link
        href="/"
        style={{
          textDecoration: "none",
        }}
        className="app-navbar__brand"
      >
        <div
          style={{
            width: 30,
            height: 30,
            background: "var(--gold)",
            borderRadius: 8,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 14,
            color: "#fff",
            fontWeight: 700,
          }}
        >
          ✝
        </div>
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 18,
            fontWeight: 700,
            color: "var(--text-primary)",
          }}
        >
          ChurchMS
        </span>
      </Link>

      <button
        type="button"
        className="app-navbar__menuButton"
        onClick={() => setMenuOpen((open) => !open)}
        aria-expanded={menuOpen}
        aria-label="Toggle navigation menu"
      >
        {menuOpen ? "✕" : "☰"}
      </button>

      <div className="app-navbar__desktop">
        {links.map(({ label, href }) => (
          <Link
            key={href}
            href={href}
            style={{
              color: "var(--text-secondary)",
              textDecoration: "none",
              fontSize: 14,
              fontWeight: 500,
              padding: "6px 12px",
              borderRadius: 6,
              transition: "all 0.2s",
            }}
          >
            {label}
          </Link>
        ))}
        <div className="theme-toggle">
          <ThemeToggle />
        </div>
        {links.length > 0 && (
          <button
            onClick={logout}
            style={{
              background: "none",
              border: "1px solid var(--border)",
              borderRadius: 6,
              padding: "6px 14px",
              fontSize: 14,
              color: "var(--danger)",
              cursor: "pointer",
              fontFamily: "var(--font-body)",
            }}
          >
            Logout
          </button>
        )}
      </div>

      {menuOpen && (
        <div className="app-navbar__mobilePanel">
          {links.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              style={{
                color: "var(--text-secondary)",
                textDecoration: "none",
                fontSize: 14,
                fontWeight: 500,
                padding: "10px 12px",
                borderRadius: 8,
                transition: "all 0.2s",
                border: "1px solid var(--border)",
                background: "var(--bg-card)",
                display: "flex",
                justifyContent: "center",
              }}
            >
              {label}
            </Link>
          ))}
          <div className="theme-toggle">
            <ThemeToggle />
          </div>
          {links.length > 0 && (
            <button
              onClick={logout}
              style={{
                background: "none",
                border: "1px solid var(--border)",
                borderRadius: 8,
                padding: "10px 14px",
                fontSize: 14,
                color: "var(--danger)",
                cursor: "pointer",
                fontFamily: "var(--font-body)",
              }}
            >
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
