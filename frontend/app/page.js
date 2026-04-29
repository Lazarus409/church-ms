import Link from "next/link";

export default function HomePage() {
  return (
    <div
      style={{
        fontFamily: "'Georgia', serif",
        background: "#0a0f1e",
        minHeight: "100vh",
        color: "#e8e4d9",
      }}
    >
      {/* Navbar */}
      <nav
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "20px 48px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          position: "sticky",
          top: 0,
          zIndex: 100,
          background: "rgba(10,15,30,0.85)",
          backdropFilter: "blur(12px)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "8px",
              background: "linear-gradient(135deg, #c9a84c, #e8c96d)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "16px",
              fontWeight: "bold",
              color: "#0a0f1e",
            }}
          >
            ✦
          </div>
          <span
            style={{
              fontSize: "20px",
              fontWeight: "700",
              letterSpacing: "-0.5px",
              color: "#fff",
            }}
          >
            ChurchMS
          </span>
        </div>
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <Link
            href="/login"
            style={{
              color: "#a0a8b8",
              textDecoration: "none",
              fontSize: "14px",
              fontFamily: "sans-serif",
              fontWeight: 500,
              padding: "8px 16px",
              borderRadius: "8px",
              transition: "color 0.2s",
            }}
          >
            Sign In
          </Link>
          <Link
            href="/register"
            style={{
              background: "linear-gradient(135deg, #c9a84c, #e8c96d)",
              color: "#0a0f1e",
              textDecoration: "none",
              fontSize: "14px",
              fontFamily: "sans-serif",
              fontWeight: "700",
              padding: "10px 22px",
              borderRadius: "10px",
              letterSpacing: "0.2px",
            }}
          >
            Get Started →
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section
        style={{
          textAlign: "center",
          padding: "100px 24px 80px",
          position: "relative",
        }}
      >
        {/* Background glow */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -60%)",
            width: "600px",
            height: "400px",
            background:
              "radial-gradient(ellipse, rgba(201,168,76,0.12) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <h1
          style={{
            fontSize: "clamp(40px, 7vw, 80px)",
            fontFamily: "'Georgia', serif",
            fontWeight: "700",
            lineHeight: 1.1,
            letterSpacing: "-2px",
            marginBottom: "24px",
            color: "#ffffff",
            maxWidth: "800px",
            margin: "0 auto 24px",
          }}
        >
          Manage Your Church
          <br />
          <span style={{ color: "#c9a84c" }}>Simply & Effectively</span>
        </h1>

        <p
          style={{
            fontSize: "18px",
            color: "#7a8299",
            maxWidth: "520px",
            margin: "0 auto 48px",
            lineHeight: 1.7,
            fontFamily: "sans-serif",
            fontWeight: 400,
          }}
        >
          Track members, record attendance, and get powerful insights — all in
          one beautiful platform built for churches.
        </p>

        <div
          style={{
            display: "flex",
            gap: "16px",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <Link
            href="/register"
            style={{
              background: "linear-gradient(135deg, #c9a84c, #e8c96d)",
              color: "#0a0f1e",
              textDecoration: "none",
              fontSize: "16px",
              fontFamily: "sans-serif",
              fontWeight: "700",
              padding: "16px 36px",
              borderRadius: "12px",
              letterSpacing: "0.2px",
            }}
          >
            Start for Free →
          </Link>
          <Link
            href="/login"
            style={{
              border: "1px solid rgba(255,255,255,0.12)",
              color: "#e8e4d9",
              textDecoration: "none",
              fontSize: "16px",
              fontFamily: "sans-serif",
              fontWeight: 500,
              padding: "16px 36px",
              borderRadius: "12px",
              background: "rgba(255,255,255,0.04)",
            }}
          >
            Sign In
          </Link>
        </div>
      </section>

      {/* Stats bar */}
      <section
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "64px",
          padding: "40px 24px",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          flexWrap: "wrap",
        }}
      >
        {[
          { value: "100%", label: "Free to Start" },
          { value: "3", label: "Core Features" },
          { value: "∞", label: "Members Supported" },
          { value: "24/7", label: "Always Online" },
        ].map((s) => (
          <div key={s.label} style={{ textAlign: "center" }}>
            <div
              style={{
                fontSize: "32px",
                fontWeight: "700",
                color: "#c9a84c",
                letterSpacing: "-1px",
                fontFamily: "'Georgia', serif",
              }}
            >
              {s.value}
            </div>
            <div
              style={{
                fontSize: "13px",
                color: "#7a8299",
                fontFamily: "sans-serif",
                marginTop: "4px",
              }}
            >
              {s.label}
            </div>
          </div>
        ))}
      </section>

      {/* Features */}
      <section
        style={{ padding: "100px 24px", maxWidth: "1100px", margin: "0 auto" }}
      >
        <div style={{ textAlign: "center", marginBottom: "64px" }}>
          <h2
            style={{
              fontSize: "clamp(28px, 4vw, 44px)",
              fontWeight: "700",
              letterSpacing: "-1px",
              color: "#fff",
              marginBottom: "16px",
            }}
          >
            Everything your church needs
          </h2>
          <p
            style={{
              color: "#7a8299",
              fontSize: "16px",
              fontFamily: "sans-serif",
            }}
          >
            No complexity. Just the tools that matter.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "24px",
          }}
        >
          {[
            {
              icon: "👥",
              title: "Member Management",
              desc: "Add, search, and manage all your church members. Track who's active, who's new, and never lose a contact again.",
              color: "#3b82f6",
            },
            {
              icon: "📋",
              title: "Attendance Tracking",
              desc: "Mark attendance for every service in seconds. Spot patterns, identify absent members, and follow up automatically.",
              color: "#c9a84c",
            },
            {
              icon: "📊",
              title: "Dashboard & Reports",
              desc: "Beautiful visual reports showing your church's growth, attendance trends, and member activity — updated in real time.",
              color: "#22c55e",
            },
          ].map((f) => (
            <div
              key={f.title}
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "20px",
                padding: "36px",
                transition: "border-color 0.2s",
              }}
            >
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: "14px",
                  background: `${f.color}18`,
                  border: `1px solid ${f.color}30`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "24px",
                  marginBottom: "24px",
                }}
              >
                {f.icon}
              </div>
              <h3
                style={{
                  fontSize: "20px",
                  fontWeight: "700",
                  color: "#fff",
                  marginBottom: "12px",
                  letterSpacing: "-0.3px",
                }}
              >
                {f.title}
              </h3>
              <p
                style={{
                  color: "#7a8299",
                  fontSize: "15px",
                  lineHeight: 1.7,
                  fontFamily: "sans-serif",
                }}
              >
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section
        style={{
          margin: "0 24px 80px",
          maxWidth: "900px",
          marginLeft: "auto",
          marginRight: "auto",
          background:
            "linear-gradient(135deg, rgba(201,168,76,0.12), rgba(201,168,76,0.04))",
          border: "1px solid rgba(201,168,76,0.2)",
          borderRadius: "28px",
          padding: "72px 48px",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            fontSize: "clamp(28px, 4vw, 44px)",
            fontWeight: "700",
            letterSpacing: "-1px",
            color: "#fff",
            marginBottom: "16px",
          }}
        >
          Ready to get started?
        </h2>
        <p
          style={{
            color: "#7a8299",
            fontSize: "16px",
            fontFamily: "sans-serif",
            marginBottom: "36px",
          }}
        >
          Join churches already using ChurchMS. Free to start, no credit card
          required.
        </p>
        <Link
          href="/register"
          style={{
            background: "linear-gradient(135deg, #c9a84c, #e8c96d)",
            color: "#0a0f1e",
            textDecoration: "none",
            fontSize: "16px",
            fontFamily: "sans-serif",
            fontWeight: "700",
            padding: "16px 40px",
            borderRadius: "12px",
          }}
        >
          Register Your Church Free →
        </Link>
      </section>

      {/* Footer */}
      <footer
        style={{
          borderTop: "1px solid rgba(255,255,255,0.06)",
          padding: "32px 48px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div
            style={{
              width: 24,
              height: 24,
              borderRadius: "6px",
              background: "linear-gradient(135deg, #c9a84c, #e8c96d)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "12px",
              color: "#0a0f1e",
              fontWeight: "bold",
            }}
          >
            ✦
          </div>
          <span
            style={{
              color: "#7a8299",
              fontSize: "14px",
              fontFamily: "sans-serif",
            }}
          >
            © 2026 ChurchMS
          </span>
        </div>
        <span
          style={{
            color: "#4a5568",
            fontSize: "13px",
            fontFamily: "sans-serif",
          }}
        >
          Built for churches everywhere.
        </span>
      </footer>
    </div>
  );
}
