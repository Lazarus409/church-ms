"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import api from "@/lib/api";
import {
  applyBranding,
  DEFAULT_BRANDING,
  emitBrandingUpdate,
  loadBranding,
  saveBranding,
} from "@/lib/branding";

const navLinks = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Members", href: "/members" },
  { label: "Attendance", href: "/attendance" },
];

const upcomingTools = [
  {
    title: "SMS / WhatsApp alerts",
    description:
      "Automatically notify absent members and follow up with families after service.",
    badge: "Coming soon",
  },
  {
    title: "QR code check-in",
    description:
      "Let members scan a code at the door for fast service attendance.",
    badge: "Coming soon",
  },
];

function CsvExportCard({ onExport, memberCount }) {
  return (
    <div
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: 16,
        padding: 24,
        boxShadow: "var(--shadow-sm)",
      }}
    >
      <p
        style={{
          fontSize: 12,
          color: "var(--text-muted)",
          fontWeight: 600,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          marginBottom: 10,
        }}
      >
        Member export
      </p>
      <h3
        style={{
          fontSize: 18,
          fontWeight: 700,
          color: "var(--text-primary)",
          marginBottom: 8,
        }}
      >
        CSV export for member records
      </h3>
      <p style={{ color: "var(--text-secondary)", fontSize: 14, marginBottom: 18 }}>
        Download your current member list for outreach, backups, or spreadsheet
        reporting.
      </p>
      <button
        onClick={onExport}
        disabled={!memberCount}
        style={{
          background: "var(--gold)",
          border: "none",
          borderRadius: 8,
          padding: "10px 18px",
          color: "#fff",
          fontSize: 14,
          fontWeight: 600,
          cursor: memberCount ? "pointer" : "not-allowed",
          opacity: memberCount ? 1 : 0.6,
          fontFamily: "var(--font-body)",
        }}
      >
        Export CSV
      </button>
    </div>
  );
}

export default function SettingsPage() {
  const router = useRouter();
  const [churchId, setChurchId] = useState(null);
  const [memberCount, setMemberCount] = useState(0);
  const [churchName, setChurchName] = useState("");
  const [form, setForm] = useState(DEFAULT_BRANDING);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");

  useEffect(() => {
    let isMounted = true;

    const bootstrap = async () => {
      try {
        const [meRes, membersRes] = await Promise.all([
          api.get("/auth/me"),
          api.get("/members/"),
        ]);

        if (!isMounted) {
          return;
        }

        setChurchId(meRes.data.church_id);
        setChurchName(meRes.data.church_name);
        setMemberCount(Array.isArray(membersRes.data) ? membersRes.data.length : 0);

        const saved = loadBranding(meRes.data.church_id, {
          brandName: meRes.data.church_name,
        });

        setForm(saved);
        applyBranding(saved);
        emitBrandingUpdate(saved);
      } catch {
        router.push("/login");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    bootstrap();

    return () => {
      isMounted = false;
    };
  }, [router]);

  const previewStyles = useMemo(
    () => ({
      background:
        "linear-gradient(135deg, rgba(255,255,255,0.82) 0%, rgba(248,244,234,0.96) 100%)",
      border: `1px solid ${form.primaryColor}33`,
      boxShadow: "var(--shadow-md)",
    }),
    [form.primaryColor],
  );

  const handleSave = async () => {
    if (!churchId) {
      return;
    }

    setSaving(true);
    setStatus("");

    try {
      const normalized = saveBranding(churchId, form);
      applyBranding(normalized);
      emitBrandingUpdate(normalized);
      setStatus("Branding saved for this church.");
    } catch {
      setStatus("Unable to save branding right now.");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    const reset = {
      ...DEFAULT_BRANDING,
      brandName: churchName || DEFAULT_BRANDING.brandName,
    };
    setForm(reset);
    applyBranding(reset);
    emitBrandingUpdate(reset);
    setStatus("Branding reset to defaults.");
  };

  const handleExport = async () => {
    try {
      const res = await api.get("/members/");
      const rows = res.data || [];
      if (!rows.length) {
        setStatus("No members available to export.");
        return;
      }

      const headers = ["Full Name", "Phone", "Email", "Address", "Status", "Joined"];
      const csvRows = [
        headers.join(","),
        ...rows.map((member) =>
          [
            member.full_name,
            member.phone || "",
            member.email || "",
            member.address || "",
            member.status || "",
            member.date_joined || "",
          ]
            .map((value) => {
              const text = String(value).replace(/"/g, '""');
              return `"${text}"`;
            })
            .join(","),
        ),
      ];

      const blob = new Blob([csvRows.join("\n")], {
        type: "text/csv;charset=utf-8;",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${churchName || "church"}-members.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setStatus("Members CSV downloaded.");
    } catch {
      setStatus("Unable to export members right now.");
    }
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--bg-app)",
        }}
        className="page-shell"
      >
        <p style={{ color: "var(--text-muted)", fontSize: 14 }}>
          Loading settings...
        </p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-app)" }} className="page-shell">
      <Navbar links={[...navLinks, { label: "Settings", href: "/settings" }]} />
      <div className="page-content" style={{ maxWidth: 1080 }}>
        <div className="page-header">
          <div>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 26,
                fontWeight: 700,
                color: "var(--text-primary)",
                marginBottom: 4,
              }}
            >
              Settings
            </h1>
            <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>
              Branding, export tools, and monetizable upgrades in one place.
            </p>
          </div>
          <div className="page-header__actions">
            <Link
              href="/members"
              style={{
                textDecoration: "none",
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                borderRadius: 8,
                padding: "10px 16px",
                color: "var(--text-primary)",
                fontSize: 14,
                fontWeight: 600,
              }}
            >
              Back to members
            </Link>
          </div>
        </div>

        {status && (
          <div
            style={{
              background: "var(--gold-bg)",
              border: "1px solid var(--gold-border)",
              color: "var(--text-primary)",
              borderRadius: 12,
              padding: "12px 16px",
              marginBottom: 20,
              fontSize: 14,
            }}
          >
            {status}
          </div>
        )}

        <div className="responsive-grid-2" style={{ alignItems: "start" }}>
          <div
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: 16,
              padding: 24,
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <p
              style={{
                fontSize: 12,
                color: "var(--text-muted)",
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                marginBottom: 10,
              }}
            >
              Custom church branding
            </p>
            <h2
              style={{
                fontSize: 18,
                fontWeight: 700,
                color: "var(--text-primary)",
                marginBottom: 8,
              }}
            >
              Make the product feel like your church
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: 14, marginBottom: 20 }}>
              Update the church name, colors, and logo mark to match your
              identity on every authenticated page.
            </p>

            <div className="responsive-grid-2" style={{ marginBottom: 16 }}>
              <label style={{ display: "grid", gap: 8 }}>
                <span style={{ fontSize: 13, color: "var(--text-secondary)", fontWeight: 500 }}>
                  Church name
                </span>
                <input
                  value={form.brandName}
                  onChange={(e) =>
                    setForm({ ...form, brandName: e.target.value })
                  }
                  placeholder="Grace Chapel"
                  style={{
                    padding: "10px 14px",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                    background: "var(--bg-secondary)",
                    color: "var(--text-primary)",
                    fontSize: 14,
                    outline: "none",
                  }}
                />
              </label>
              <label style={{ display: "grid", gap: 8 }}>
                <span style={{ fontSize: 13, color: "var(--text-secondary)", fontWeight: 500 }}>
                  Logo mark
                </span>
                <input
                  value={form.logoMark}
                  onChange={(e) => setForm({ ...form, logoMark: e.target.value })}
                  placeholder="G"
                  maxLength={3}
                  style={{
                    padding: "10px 14px",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                    background: "var(--bg-secondary)",
                    color: "var(--text-primary)",
                    fontSize: 14,
                    outline: "none",
                  }}
                />
              </label>
            </div>

            <div className="responsive-grid-2" style={{ marginBottom: 16 }}>
              <label style={{ display: "grid", gap: 8 }}>
                <span style={{ fontSize: 13, color: "var(--text-secondary)", fontWeight: 500 }}>
                  Primary color
                </span>
                <input
                  type="color"
                  value={form.primaryColor}
                  onChange={(e) =>
                    setForm({ ...form, primaryColor: e.target.value })
                  }
                  style={{
                    height: 44,
                    padding: 6,
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                    background: "var(--bg-secondary)",
                  }}
                />
              </label>
              <label style={{ display: "grid", gap: 8 }}>
                <span style={{ fontSize: 13, color: "var(--text-secondary)", fontWeight: 500 }}>
                  Accent color
                </span>
                <input
                  type="color"
                  value={form.accentColor}
                  onChange={(e) =>
                    setForm({ ...form, accentColor: e.target.value })
                  }
                  style={{
                    height: 44,
                    padding: 6,
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                    background: "var(--bg-secondary)",
                  }}
                />
              </label>
            </div>

            <label style={{ display: "grid", gap: 8, marginBottom: 20 }}>
              <span style={{ fontSize: 13, color: "var(--text-secondary)", fontWeight: 500 }}>
                Tagline
              </span>
              <input
                value={form.tagline}
                onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                placeholder="A church platform built for growth"
                style={{
                  padding: "10px 14px",
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                  background: "var(--bg-secondary)",
                  color: "var(--text-primary)",
                  fontSize: 14,
                  outline: "none",
                }}
              />
            </label>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button
                onClick={handleSave}
                disabled={saving}
                style={{
                  background: "var(--gold)",
                  border: "none",
                  borderRadius: 8,
                  padding: "10px 18px",
                  color: "#fff",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                  opacity: saving ? 0.75 : 1,
                }}
              >
                {saving ? "Saving..." : "Save branding"}
              </button>
              <button
                onClick={handleReset}
                style={{
                  background: "transparent",
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                  padding: "10px 18px",
                  color: "var(--text-secondary)",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Reset
              </button>
            </div>
          </div>

          <div style={{ display: "grid", gap: 20 }}>
            <div
              style={{
                ...previewStyles,
                borderRadius: 20,
                padding: 24,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  marginBottom: 18,
                }}
              >
                <div
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 12,
                    background: form.primaryColor,
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                  }}
                >
                  {form.logoMark || "C"}
                </div>
                <div>
                  <p style={{ fontSize: 18, fontWeight: 700, color: "var(--text-primary)" }}>
                    {form.brandName || churchName || DEFAULT_BRANDING.brandName}
                  </p>
                  <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>
                    {form.tagline}
                  </p>
                </div>
              </div>

              <div className="responsive-grid-2">
                <div
                  style={{
                    background: "rgba(255,255,255,0.72)",
                    border: `1px solid ${form.primaryColor}22`,
                    borderRadius: 14,
                    padding: 16,
                  }}
                >
                  <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 6 }}>
                    Brand color
                  </p>
                  <p style={{ fontSize: 18, fontWeight: 700, color: "var(--text-primary)" }}>
                    {form.primaryColor}
                  </p>
                </div>
                <div
                  style={{
                    background: "rgba(255,255,255,0.72)",
                    border: `1px solid ${form.accentColor}22`,
                    borderRadius: 14,
                    padding: 16,
                  }}
                >
                  <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 6 }}>
                    Accent color
                  </p>
                  <p style={{ fontSize: 18, fontWeight: 700, color: "var(--text-primary)" }}>
                    {form.accentColor}
                  </p>
                </div>
              </div>
            </div>

            <CsvExportCard onExport={handleExport} memberCount={memberCount} />

            <div
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                borderRadius: 16,
                padding: 24,
                boxShadow: "var(--shadow-sm)",
              }}
            >
              <p
                style={{
                  fontSize: 12,
                  color: "var(--text-muted)",
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  marginBottom: 10,
                }}
              >
                Paid feature roadmap
              </p>
              <h3
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: "var(--text-primary)",
                  marginBottom: 8,
                }}
              >
                Features that help churches pay
              </h3>
              <div style={{ display: "grid", gap: 12, marginTop: 18 }}>
                {upcomingTools.map((tool) => (
                  <div
                    key={tool.title}
                    style={{
                      border: "1px solid var(--border)",
                      borderRadius: 12,
                      padding: 16,
                      background: "var(--bg-secondary)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 12,
                        marginBottom: 6,
                      }}
                    >
                      <h4 style={{ fontSize: 15, fontWeight: 600, color: "var(--text-primary)" }}>
                        {tool.title}
                      </h4>
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 600,
                          color: "var(--gold)",
                          background: "var(--gold-bg)",
                          border: "1px solid var(--gold-border)",
                          borderRadius: 999,
                          padding: "4px 10px",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {tool.badge}
                      </span>
                    </div>
                    <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6 }}>
                      {tool.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
