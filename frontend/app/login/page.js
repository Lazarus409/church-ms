"use client";
import { useState } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await api.post("/auth/login", form);
      localStorage.setItem("token", res.data.access_token);
      router.push("/dashboard");
    } catch (err) {
      setError(err.response?.data?.detail || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a0f1e",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
        padding: 20,
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Playfair+Display:wght@700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .input-field { width: 100%; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; padding: 14px 16px; color: #fff; font-size: 14px; font-family: inherit; outline: none; transition: border-color 0.2s; }
        .input-field::placeholder { color: #475569; }
        .input-field:focus { border-color: rgba(201,168,76,0.5); }
        .btn-gold { width: 100%; background: linear-gradient(135deg, #c9a84c, #e8c96d); color: #0a0f1e; padding: 14px; border-radius: 10px; font-weight: 600; font-size: 15px; border: none; cursor: pointer; font-family: inherit; transition: opacity 0.2s, transform 0.2s; }
        .btn-gold:hover { opacity: 0.9; transform: translateY(-1px); }
        .btn-gold:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
      `}</style>

      {/* Left decoration */}
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
          maxWidth: 420,
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 8,
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                background: "linear-gradient(135deg, #c9a84c, #e8c96d)",
                borderRadius: 10,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 20,
              }}
            >
              ✝
            </div>
            <span
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 26,
                fontWeight: 700,
                color: "#fff",
              }}
            >
              ChurchMS
            </span>
          </div>
          <p style={{ color: "#64748b", fontSize: 14 }}>
            Sign in to your account
          </p>
        </div>

        {/* Card */}
        <div
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 20,
            padding: "36px 32px",
            backdropFilter: "blur(10px)",
          }}
        >
          {error && (
            <div
              style={{
                background: "rgba(220,38,38,0.1)",
                border: "1px solid rgba(220,38,38,0.2)",
                borderRadius: 10,
                padding: "12px 16px",
                marginBottom: 20,
                color: "#fca5a5",
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
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: 13,
                  fontWeight: 500,
                  color: "#94a3b8",
                  marginBottom: 8,
                }}
              >
                Email
              </label>
              <input
                type="email"
                required
                className="input-field"
                placeholder="you@church.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: 13,
                  fontWeight: 500,
                  color: "#94a3b8",
                  marginBottom: 8,
                }}
              >
                Password
              </label>
              <input
                type="password"
                required
                className="input-field"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-gold"
              style={{ marginTop: 8 }}
            >
              {loading ? "Signing in..." : "Sign In →"}
            </button>
          </form>
        </div>

        <p
          style={{
            textAlign: "center",
            marginTop: 24,
            fontSize: 14,
            color: "#475569",
          }}
        >
          Don't have an account?{" "}
          <Link
            href="/register"
            style={{
              color: "#c9a84c",
              textDecoration: "none",
              fontWeight: 500,
            }}
          >
            Register your church
          </Link>
        </p>

        <p style={{ textAlign: "center", marginTop: 16 }}>
          <Link
            href="/"
            style={{ color: "#334155", textDecoration: "none", fontSize: 13 }}
          >
            ← Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}
