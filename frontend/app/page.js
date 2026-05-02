"use client";
import Link from "next/link";
import { useState } from "react";

export default function HomePage() {
  const [dark, setDark] = useState(false);

  const t = {
    bg: dark ? "#0a0f1e" : "var(--bg-app)",
    text: dark ? "#fff" : "#0a0f1e",
    muted: dark ? "#94a3b8" : "#64748b",
    subtle: dark ? "#64748b" : "#94a3b8",
    navBg: dark ? "rgba(10,15,30,0.8)" : "rgba(248,247,244,0.8)",
    navBorder: dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.08)",
    cardBg: dark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
    cardBorder: dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)",
    cardHover: dark ? "rgba(201,168,76,0.3)" : "rgba(201,168,76,0.4)",
    previewBg: dark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)",
    previewBorder: dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
    statBg: dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)",
    statBorder: dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)",
    rowBorder: dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.06)",
    rowText: dark ? "#cbd5e1" : "#334155",
    footerBorder: dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.08)",
    footerText: dark ? "#334155" : "#94a3b8",
    toggleBg: dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
    outlineBorder: dark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)",
    badgeBg: dark ? "rgba(201,168,76,0.1)" : "rgba(201,168,76,0.15)",
  };

  return (
    <div
      style={{
        fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
        background: t.bg,
        minHeight: "100vh",
        backgroundAttachment: dark ? "scroll" : "fixed",
        color: t.text,
        transition: "background 0.3s, color 0.3s",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Playfair+Display:wght@700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .btn-primary { background: linear-gradient(135deg, #c9a84c, #e8c96d); color: #0a0f1e; padding: 12px 28px; border-radius: 8px; font-weight: 600; font-size: 14px; text-decoration: none; transition: opacity 0.2s, transform 0.2s; display: inline-block; }
        .btn-primary:hover { opacity: 0.9; transform: translateY(-1px); }
        .feature-card { border-radius: 16px; padding: 32px; transition: border-color 0.3s, transform 0.3s; }
        .feature-card:hover { transform: translateY(-4px); }
        .home-preview-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 12px;
          margin-bottom: 16px;
        }
        .home-features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 20px;
        }
        @media (max-width: 900px) {
          .home-nav {
            padding: 16px 20px;
            flex-wrap: wrap;
          }
          .home-nav-actions {
            width: 100%;
            justify-content: flex-start;
            gap: 12px;
            flex-wrap: wrap;
          }
          .home-nav-actions .btn-primary {
            margin-top: 4px;
          }
        }
        @media (max-width: 768px) {
          .home-hero {
            padding: 72px 20px 56px;
          }
          .home-hero h1 {
            font-size: clamp(34px, 12vw, 48px);
          }
          .home-hero-actions {
            width: 100%;
          }
          .home-hero-actions > * {
            width: 100%;
          }
          .home-preview {
            padding: 0 16px;
            margin-bottom: 56px;
          }
          .home-preview-grid {
            grid-template-columns: 1fr 1fr;
          }
          .home-features {
            padding: 0 16px;
          }
          .home-footer {
            padding: 20px 16px 28px;
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }
        }
        @media (max-width: 540px) {
          .home-nav-actions {
            gap: 10px;
          }
          .home-nav-actions .btn-primary {
            width: 100%;
            text-align: center;
          }
          .home-hero {
            padding: 64px 16px 48px;
          }
          .home-hero-actions {
            flex-direction: column;
          }
          .home-hero-actions > * {
            width: 100%;
          }
          .home-preview-grid {
            grid-template-columns: 1fr;
          }
          .home-preview-grid > div {
            padding: 14px 16px;
          }
          .home-features-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      {/* Navbar */}
      <nav
        style={{
          padding: "20px 40px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: `1px solid ${t.navBorder}`,
          backdropFilter: "blur(10px)",
          position: "sticky",
          top: 0,
          zIndex: 100,
          background: t.navBg,
        }}
        className="home-nav"
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              width: 32,
              height: 32,
              background: "linear-gradient(135deg, #c9a84c, #e8c96d)",
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 16,
            }}
          >
            ✝
          </div>
          <span
            style={{
              fontFamily: "'sans-serif'",
              fontSize: 20,
              fontWeight: 700,
              color: t.text,
            }}
          >
            ChurchMS
          </span>
        </div>
        <div
          style={{ display: "flex", gap: 24, alignItems: "center" }}
          className="home-nav-actions"
        >
          <a
            href="#features"
            style={{
              color: t.muted,
              textDecoration: "none",
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            Features
          </a>
          <Link
            href="/login"
            style={{
              color: t.muted,
              textDecoration: "none",
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            Sign In
          </Link>

          {/* Theme Toggle */}
          <button
            onClick={() => setDark(!dark)}
            style={{
              background: t.toggleBg,
              border: "none",
              borderRadius: 8,
              padding: "8px 12px",
              cursor: "pointer",
              fontSize: 16,
              display: "flex",
              alignItems: "center",
              gap: 6,
              color: t.text,
              transition: "background 0.2s",
            }}
          >
            {dark ? "☀️" : "🌙"}
          </button>

          <Link href="/register" className="btn-primary">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section
        style={{
          textAlign: "center",
          padding: "100px 40px 80px",
          maxWidth: 800,
          margin: "0 auto",
        }}
        className="home-hero"
      >
        <h1
          style={{
            fontFamily: "sans-serif",
            fontSize: "clamp(40px, 6vw, 68px)",
            fontWeight: 700,
            lineHeight: 1.1,
            marginBottom: 24,
            color: t.text,
          }}
        >
          Manage Your Church
          <br />
          <span style={{ color: "#c9a84c" }}>Simply & Effectively</span>
        </h1>
        <p
          style={{
            fontSize: 18,
            color: t.muted,
            lineHeight: 1.7,
            maxWidth: 560,
            margin: "0 auto 40px",
          }}
        >
          Track members, record attendance, and get powerful insights — all in
          one beautiful platform built for churches of every size.
        </p>
        <div
          style={{
            display: "flex",
            gap: 16,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
          className="home-hero-actions"
        >
          <Link href="/register" className="btn-primary">
            Get Started
          </Link>
          <Link
            href="/login"
            style={{
              border: `1px solid ${t.outlineBorder}`,
              color: t.text,
              padding: "12px 28px",
              borderRadius: 8,
              fontWeight: 500,
              fontSize: 14,
              textDecoration: "none",
              display: "inline-block",
            }}
          >
            Sign In
          </Link>
        </div>
        <p style={{ marginTop: 20, fontSize: 13, color: t.subtle }}>
          No credit card required · Free to get started
        </p>
      </section>

      {/* Mock Dashboard Preview */}
      <section
        style={{ maxWidth: 1000, margin: "0 auto 80px", padding: "0 40px" }}
        className="home-preview"
      >
        <div
          style={{
            background: t.previewBg,
            border: `1px solid ${t.previewBorder}`,
            borderRadius: 20,
            padding: 24,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 1,
              background:
                "linear-gradient(90deg, transparent, rgba(201,168,76,0.4), transparent)",
            }}
          />
          <div className="home-preview-grid">
            {[
              ["Total Members", "248", "+12%"],
              ["Active Members", "231", "+8%"],
              ["Services", "8", "this month"],
              ["Attendance", "87%", "+5%"],
            ].map(([label, val, change]) => (
              <div
                key={label}
                style={{
                  background: t.statBg,
                  border: `1px solid ${t.statBorder}`,
                  borderRadius: 12,
                  padding: "16px 20px",
                }}
              >
                <p
                  style={{
                    fontSize: 11,
                    color: t.subtle,
                    marginBottom: 8,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  {label}
                </p>
                <p
                  style={{
                    fontSize: 24,
                    fontWeight: 600,
                    marginBottom: 4,
                    color: t.text,
                  }}
                >
                  {val}
                </p>
                <p style={{ fontSize: 12, color: "#c9a84c" }}>{change}</p>
              </div>
            ))}
          </div>
          <div
            style={{
              background: t.statBg,
              borderRadius: 12,
              padding: "16px 20px",
              border: `1px solid ${t.statBorder}`,
            }}
          >
            {[
              ["Sunday Service", "Apr 27", "142 present"],
              ["Bible Study", "Apr 24", "67 present"],
              ["Youth Service", "Apr 21", "89 present"],
            ].map(([name, date, count]) => (
              <div
                key={name}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "10px 0",
                  borderBottom: `1px solid ${t.rowBorder}`,
                  fontSize: 13,
                }}
              >
                <span style={{ color: t.rowText }}>{name}</span>
                <span style={{ color: t.subtle }}>{date}</span>
                <span style={{ color: "#c9a84c" }}>{count}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section
        id="features"
        style={{ maxWidth: 1000, margin: "0 auto 80px", padding: "0 40px" }}
        className="home-features"
      >
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div
            style={{
              background: t.badgeBg,
              border: "1px solid rgba(201,168,76,0.25)",
              color: "#c9a84c",
              padding: "6px 16px",
              borderRadius: 100,
              fontSize: 12,
              fontWeight: 500,
              display: "inline-block",
              marginBottom: 16,
            }}
          >
            Features
          </div>
          <h2
            style={{
              fontFamily: "sans-serif",
              fontSize: "clamp(28px, 4vw, 40px)",
              fontWeight: 700,
              color: t.text,
            }}
          >
            Everything your church needs
          </h2>
        </div>
        <div className="home-features-grid">
          {[
            {
              icon: "👥",
              title: "Member Management",
              desc: "Add, search, and manage all your church members. Track who's active, who's new, and who needs follow-up.",
            },
            {
              icon: "📋",
              title: "Attendance Tracking",
              desc: "Mark attendance for every service in seconds. Bulk check-in and individual tracking supported.",
            },
            {
              icon: "📊",
              title: "Dashboard & Reports",
              desc: "Beautiful analytics showing growth, attendance trends, and member activity over time.",
            },
            {
              icon: "🏛️",
              title: "Multi-Church Ready",
              desc: "Built to support multiple churches. Each church sees only their own data — completely isolated.",
            },
            {
              icon: "🔐",
              title: "Role-Based Access",
              desc: "Admin, pastor, and worker roles. Control who can see and edit what in your system.",
            },
            {
              icon: "📱",
              title: "Works Everywhere",
              desc: "Access from any device — phone, tablet, or desktop. No app download needed.",
            },
          ].map(({ icon, title, desc }) => (
            <div
              key={title}
              className="feature-card"
              style={{
                background: t.cardBg,
                border: `1px solid ${t.cardBorder}`,
              }}
            >
              <div style={{ fontSize: 28, marginBottom: 16 }}>{icon}</div>
              <h3
                style={{
                  fontSize: 17,
                  fontWeight: 600,
                  marginBottom: 10,
                  color: t.text,
                }}
              >
                {title}
              </h3>
              <p style={{ fontSize: 14, color: t.muted, lineHeight: 1.6 }}>
                {desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ textAlign: "center", padding: "60px 40px 80px" }}>
        <h2
          style={{
            fontFamily: "sans-serif",
            fontSize: "clamp(28px, 4vw, 44px)",
            fontWeight: 700,
            marginBottom: 16,
            color: t.text,
          }}
        >
          Ready to get started?
        </h2>
        <p style={{ color: t.muted, fontSize: 16, marginBottom: 32 }}>
          Register your church in under 2 minutes.
        </p>
        <Link
          href="/register"
          className="btn-primary"
          style={{ fontSize: 16, padding: "14px 36px" }}
        >
          Register Your Church →
        </Link>
      </section>

      {/* Footer */}
      <footer
        style={{
          borderTop: `1px solid ${t.footerBorder}`,
          padding: "24px 40px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
        className="home-footer"
      >
        <span
          style={{
            fontFamily: "'Playfair Display', serif",
            color: "#c9a84c",
            fontSize: 16,
            fontWeight: 700,
          }}
        >
          ChurchMS
        </span>
        <span style={{ color: t.footerText, fontSize: 13 }}>
          © 2026 ChurchMS. Built for churches everywhere.
        </span>
        <div style={{ display: "flex", gap: 20 }}>
          <Link
            href="/login"
            style={{ color: t.muted, fontSize: 13, textDecoration: "none" }}
          >
            Sign In
          </Link>
          <Link
            href="/register"
            style={{ color: t.muted, fontSize: 13, textDecoration: "none" }}
          >
            Register
          </Link>
        </div>
      </footer>
    </div>
  );
}
