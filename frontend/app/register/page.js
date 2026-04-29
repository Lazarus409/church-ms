"use client";
import { useState } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [dark, setDark] = useState(false);
  const [form, setForm] = useState({
    church_name: "",
    church_email: "",
    full_name: "",
    email: "",
    password: "",
    confirm_password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const t = {
    bg: dark ? "#0a0f1e" : "var(--bg-app)",
    text: dark ? "#fff" : "#0a0f1e",
    muted: dark ? "#94a3b8" : "#64748b",
    cardBg: dark ? "rgba(255,255,255,0.04)" : "#fff",
    cardBorder: dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
    inputBg: dark ? "rgba(255,255,255,0.05)" : "#f8f7f4",
    inputBorder: dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.12)",
    inputColor: dark ? "#fff" : "#0a0f1e",
    inputPlaceholder: dark ? "#475569" : "#94a3b8",
    labelColor: dark ? "#94a3b8" : "#64748b",
    sectionLabel: dark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)",
    sectionBorder: dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)",
    linkMuted: dark ? "#334155" : "#94a3b8",
    toggleBg: dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirm_password) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const res = await api.post("/auth/register", {
        church_name: form.church_name,
        church_email: form.church_email,
        full_name: form.full_name,
        email: form.email,
        password: form.password,
      });
      localStorage.setItem("token", res.data.access_token);
      router.push("/dashboard");
    } catch (err) {
      setError(err.response?.data?.detail || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const Field = ({ label, type = "text", placeholder, value, onChange }) => (
    <div>
      <label
        style={{
          display: "block",
          fontSize: 13,
          fontWeight: 500,
          color: t.labelColor,
          marginBottom: 8,
        }}
      >
        {label}
      </label>
      <input
        type={type}
        required
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        style={{
          width: "100%",
          background: t.inputBg,
          border: `1px solid ${t.inputBorder}`,
          borderRadius: 10,
          padding: "13px 16px",
          color: t.inputColor,
          fontSize: 14,
          fontFamily: "inherit",
          outline: "none",
          transition: "border-color 0.2s",
        }}
        onFocus={(e) => (e.target.style.borderColor = "rgba(201,168,76,0.5)")}
        onBlur={(e) => (e.target.style.borderColor = t.inputBorder)}
      />
    </div>
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        background: t.bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
        padding: 20,
        backgroundAttachment: dark ? "scroll" : "fixed",
        transition: "background 0.3s",
      }}
      className="register-shell"
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Playfair+Display:wght@700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input::placeholder { color: ${t.inputPlaceholder}; }
        @media (max-width: 640px) {
          .register-shell {
            padding: 16px;
            align-items: flex-start;
          }
          .register-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
            margin-bottom: 24px;
          }
          .register-header button {
            align-self: flex-end;
          }
          .register-title h1 {
            font-size: 26px;
          }
          .register-card {
            padding: 22px 18px;
            border-radius: 18px;
          }
          .register-actions {
            flex-direction: column;
          }
          .register-actions button {
            width: 100%;
          }
        }
      `}</style>

      {/* Background glow */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          overflow: "hidden",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -200,
            right: -200,
            width: 600,
            height: 600,
            background:
              "radial-gradient(circle, rgba(201,168,76,0.08) 0%, transparent 70%)",
            borderRadius: "50%",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -200,
            left: -200,
            width: 500,
            height: 500,
            background:
              "radial-gradient(circle, rgba(201,168,76,0.05) 0%, transparent 70%)",
            borderRadius: "50%",
          }}
        />
      </div>

      <div
        style={{
          width: "100%",
          maxWidth: 480,
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 32,
          }}
          className="register-header"
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 36,
                height: 36,
                background: "linear-gradient(135deg, #c9a84c, #e8c96d)",
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 18,
              }}
            >
              ✝
            </div>
            <span
              style={{
                fontFamily: "sans-serif",
                fontSize: 22,
                fontWeight: 700,
                color: t.text,
              }}
            >
              ChurchMS
            </span>
          </div>
          <button
            onClick={() => setDark(!dark)}
            style={{
              background: t.toggleBg,
              border: "none",
              borderRadius: 8,
              padding: "8px 12px",
              cursor: "pointer",
              fontSize: 16,
              color: t.text,
              transition: "background 0.2s",
            }}
          >
            {dark ? "☀️" : "🌙"}
          </button>
        </div>

        {/* Title */}
        <div style={{ marginBottom: 28 }} className="register-title">
          <h1
            style={{
              fontFamily: "sans-serif",
              fontSize: 30,
              fontWeight: 700,
              color: t.text,
              marginBottom: 6,
            }}
          >
            Register your church
          </h1>
          <p style={{ color: t.muted, fontSize: 14 }}>
            Get started free — no credit card required
          </p>
        </div>

        {/* Card */}
        <div
          style={{
            background: t.cardBg,
            border: `1px solid ${t.cardBorder}`,
            borderRadius: 20,
            padding: "32px",
            backdropFilter: "blur(10px)",
          }}
          className="register-card"
        >
          {error && (
            <div
              style={{
                background: "rgba(220,38,38,0.1)",
                border: "1px solid rgba(220,38,38,0.2)",
                borderRadius: 10,
                padding: "12px 16px",
                marginBottom: 20,
                color: dark ? "#fca5a5" : "#dc2626",
                fontSize: 13,
              }}
            >
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: 16 }}
          >
            {/* Church Info Section */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: 4,
              }}
            >
              <div
                style={{ height: 1, flex: 1, background: t.sectionBorder }}
              />
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: t.sectionLabel,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                Church Information
              </span>
              <div
                style={{ height: 1, flex: 1, background: t.sectionBorder }}
              />
            </div>

            <Field
              label="Church name"
              placeholder="Grace Chapel"
              value={form.church_name}
              onChange={(e) =>
                setForm({ ...form, church_name: e.target.value })
              }
            />
            <Field
              label="Church email"
              type="email"
              placeholder="info@gracechapel.com"
              value={form.church_email}
              onChange={(e) =>
                setForm({ ...form, church_email: e.target.value })
              }
            />

            {/* Admin Section */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginTop: 8,
                marginBottom: 4,
              }}
            >
              <div
                style={{ height: 1, flex: 1, background: t.sectionBorder }}
              />
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: t.sectionLabel,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                Admin Account
              </span>
              <div
                style={{ height: 1, flex: 1, background: t.sectionBorder }}
              />
            </div>

            <Field
              label="Your full name"
              placeholder="John Mensah"
              value={form.full_name}
              onChange={(e) => setForm({ ...form, full_name: e.target.value })}
            />
            <Field
              label="Your email"
              type="email"
              placeholder="john@gracechapel.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
              }}
              className="responsive-grid-2"
            >
              <Field
                label="Password"
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
              <Field
                label="Confirm password"
                type="password"
                placeholder="••••••••"
                value={form.confirm_password}
                onChange={(e) =>
                  setForm({ ...form, confirm_password: e.target.value })
                }
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                background: loading
                  ? "rgba(201,168,76,0.5)"
                  : "linear-gradient(135deg, #c9a84c, #e8c96d)",
                color: "#0a0f1e",
                padding: 14,
                borderRadius: 10,
                fontWeight: 600,
                fontSize: 15,
                border: "none",
                cursor: loading ? "not-allowed" : "pointer",
                fontFamily: "inherit",
                transition: "opacity 0.2s",
                marginTop: 8,
              }}
            >
              {loading ? "Creating account..." : "Register Church →"}
            </button>
          </form>
        </div>

        <p
          style={{
            textAlign: "center",
            marginTop: 24,
            fontSize: 14,
            color: t.muted,
          }}
        >
          Already have an account?{" "}
          <Link
            href="/login"
            style={{
              color: "#c9a84c",
              textDecoration: "none",
              fontWeight: 500,
            }}
          >
            Sign in
          </Link>
        </p>
        <p style={{ textAlign: "center", marginTop: 12 }}>
          <Link
            href="/"
            style={{ color: t.linkMuted, textDecoration: "none", fontSize: 13 }}
          >
            ← Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}
