import Link from "next/link";

export default function HomePage() {
  return (
    <div
      style={{
        fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
        background: "#0a0f1e",
        minHeight: "100vh",
        color: "#fff",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Playfair+Display:wght@700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .nav-link { color: #94a3b8; text-decoration: none; font-size: 14px; font-weight: 500; transition: color 0.2s; }
        .nav-link:hover { color: #fff; }
        .btn-primary { background: linear-gradient(135deg, #c9a84c, #e8c96d); color: #0a0f1e; padding: 12px 28px; border-radius: 8px; font-weight: 600; font-size: 14px; text-decoration: none; transition: opacity 0.2s, transform 0.2s; display: inline-block; }
        .btn-primary:hover { opacity: 0.9; transform: translateY(-1px); }
        .btn-outline { border: 1px solid rgba(255,255,255,0.15); color: #fff; padding: 12px 28px; border-radius: 8px; font-weight: 500; font-size: 14px; text-decoration: none; transition: background 0.2s; display: inline-block; }
        .btn-outline:hover { background: rgba(255,255,255,0.05); }
        .feature-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 16px; padding: 32px; transition: border-color 0.3s, transform 0.3s; }
        .feature-card:hover { border-color: rgba(201,168,76,0.3); transform: translateY(-4px); }
        .gold { color: #c9a84c; }
        .badge { background: rgba(201,168,76,0.1); border: 1px solid rgba(201,168,76,0.25); color: #c9a84c; padding: 6px 16px; border-radius: 100px; font-size: 12px; font-weight: 500; display: inline-block; margin-bottom: 24px; }
      `}</style>

      {/* Navbar */}
      <nav
        style={{
          padding: "20px 40px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          backdropFilter: "blur(10px)",
          position: "sticky",
          top: 0,
          zIndex: 100,
          background: "rgba(10,15,30,0.8)",
        }}
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
              fontFamily: "'Playfair Display', serif",
              fontSize: 20,
              fontWeight: 700,
            }}
          >
            ChurchMS
          </span>
        </div>
        <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
          <a href="#features" className="nav-link">
            Features
          </a>
          <Link href="/login" className="nav-link">
            Sign In
          </Link>
          <Link href="/register" className="btn-primary">
            Get Started Free
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
      >
        <div className="badge">✦ Built for African Churches</div>
        <h1
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(40px, 6vw, 68px)",
            fontWeight: 700,
            lineHeight: 1.1,
            marginBottom: 24,
          }}
        >
          Manage Your Church
          <br />
          <span className="gold">Simply & Effectively</span>
        </h1>
        <p
          style={{
            fontSize: 18,
            color: "#94a3b8",
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
        >
          <Link href="/register" className="btn-primary">
            Start for Free →
          </Link>
          <Link href="/login" className="btn-outline">
            Sign In
          </Link>
        </div>
        <p style={{ marginTop: 20, fontSize: 13, color: "#475569" }}>
          No credit card required · Free to get started
        </p>
      </section>

      {/* Mock Dashboard Preview */}
      <section
        style={{ maxWidth: 1000, margin: "0 auto 80px", padding: "0 40px" }}
      >
        <div
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
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
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 12,
              marginBottom: 16,
            }}
          >
            {[
              ["Total Members", "248", "+12%"],
              ["Active Members", "231", "+8%"],
              ["Services", "8", "this month"],
              ["Attendance", "87%", "+5%"],
            ].map(([label, val, change]) => (
              <div
                key={label}
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: 12,
                  padding: "16px 20px",
                }}
              >
                <p
                  style={{
                    fontSize: 11,
                    color: "#64748b",
                    marginBottom: 8,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  {label}
                </p>
                <p style={{ fontSize: 24, fontWeight: 600, marginBottom: 4 }}>
                  {val}
                </p>
                <p style={{ fontSize: 12, color: "#c9a84c" }}>{change}</p>
              </div>
            ))}
          </div>
          <div
            style={{
              background: "rgba(255,255,255,0.02)",
              borderRadius: 12,
              padding: "16px 20px",
              border: "1px solid rgba(255,255,255,0.05)",
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
                  borderBottom: "1px solid rgba(255,255,255,0.04)",
                  fontSize: 13,
                }}
              >
                <span style={{ color: "#cbd5e1" }}>{name}</span>
                <span style={{ color: "#64748b" }}>{date}</span>
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
      >
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div className="badge">Features</div>
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(28px, 4vw, 40px)",
              fontWeight: 700,
            }}
          >
            Everything your church needs
          </h2>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 20,
          }}
        >
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
            <div key={title} className="feature-card">
              <div style={{ fontSize: 28, marginBottom: 16 }}>{icon}</div>
              <h3 style={{ fontSize: 17, fontWeight: 600, marginBottom: 10 }}>
                {title}
              </h3>
              <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.6 }}>
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
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(28px, 4vw, 44px)",
            fontWeight: 700,
            marginBottom: 16,
          }}
        >
          Ready to get started?
        </h2>
        <p style={{ color: "#64748b", fontSize: 16, marginBottom: 32 }}>
          Register your church in under 2 minutes. Free forever to start.
        </p>
        <Link
          href="/register"
          className="btn-primary"
          style={{ fontSize: 16, padding: "14px 36px" }}
        >
          Register Your Church Free →
        </Link>
      </section>

      {/* Footer */}
      <footer
        style={{
          borderTop: "1px solid rgba(255,255,255,0.06)",
          padding: "24px 40px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
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
        <span style={{ color: "#334155", fontSize: 13 }}>
          © 2026 ChurchMS. Built for churches everywhere.
        </span>
        <div style={{ display: "flex", gap: 20 }}>
          <Link
            href="/login"
            style={{ color: "#475569", fontSize: 13, textDecoration: "none" }}
          >
            Sign In
          </Link>
          <Link
            href="/register"
            style={{ color: "#475569", fontSize: 13, textDecoration: "none" }}
          >
            Register
          </Link>
        </div>
      </footer>
    </div>
  );
}
