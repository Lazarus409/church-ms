"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

const navLinks = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Members", href: "/members" },
  { label: "Attendance", href: "/attendance" },
];

export default function NewMembersPage() {
  const router = useRouter();
  const [newMembers, setNewMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [churchId, setChurchId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setChurchId(payload.church_id);
    } catch {}

    api
      .get("/new-members/")
      .then((res) => setNewMembers(res.data))
      .catch(() => router.push("/login"))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Remove this visitor record?")) return;
    await api.delete(`/new-members/${id}`);
    setNewMembers((prev) => prev.filter((m) => m.id !== id));
  };

  const visitorUrl =
    churchId && typeof window !== "undefined"
      ? `${window.location.origin}/checkin/${churchId}`
      : "";

  const copyLink = () => {
    navigator.clipboard.writeText(visitorUrl);
    alert("Check-in link copied! Share this with visitors.");
  };

  return (
    <div
      style={{ minHeight: "100vh", background: "var(--bg-app)" }}
      className="page-shell"
    >
      <Navbar links={navLinks} />
      <div className="page-content">
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
              New Visitors
            </h1>
            <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>
              {newMembers.length} total visitors recorded
            </p>
          </div>
        </div>

        {/* Visitor Link Card */}
        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--gold-border)",
            borderRadius: 16,
            padding: 24,
            marginBottom: 24,
          }}
        >
          <h3
            style={{
              fontSize: 15,
              fontWeight: 600,
              color: "var(--text-primary)",
              marginBottom: 8,
            }}
          >
            📲 Church Check-in Link
          </h3>
          <p
            style={{
              color: "var(--text-secondary)",
              fontSize: 13,
              marginBottom: 16,
            }}
          >
            Share this link or use the QR code at your entrance. Members check
            in and visitors register automatically.
          </p>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <div
              style={{
                flex: 1,
                background: "var(--bg-secondary)",
                border: "1px solid var(--border)",
                borderRadius: 8,
                padding: "10px 14px",
                fontSize: 13,
                color: "var(--text-secondary)",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {visitorUrl}
            </div>
            <button
              onClick={copyLink}
              style={{
                background: "var(--gold)",
                border: "none",
                borderRadius: 8,
                padding: "10px 20px",
                color: "#fff",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "var(--font-body)",
                whiteSpace: "nowrap",
              }}
            >
              Copy Link
            </button>
          </div>
        </div>

        {/* Table */}
        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: 16,
            overflow: "hidden",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          {loading ? (
            <div
              style={{
                padding: 32,
                textAlign: "center",
                color: "var(--text-muted)",
                fontSize: 14,
              }}
            >
              Loading...
            </div>
          ) : newMembers.length === 0 ? (
            <div
              style={{
                padding: 48,
                textAlign: "center",
                color: "var(--text-muted)",
                fontSize: 14,
              }}
            >
              No visitors yet. Share your check-in link to get started.
            </div>
          ) : (
            <div className="table-scroll">
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "var(--bg-secondary)" }}>
                    {[
                      "Name",
                      "Phone",
                      "Email",
                      "Reason",
                      "Added to Members",
                      "Date",
                      "",
                    ].map((h) => (
                      <th
                        key={h}
                        style={{
                          padding: "12px 20px",
                          textAlign: "left",
                          fontSize: 12,
                          fontWeight: 500,
                          color: "var(--text-muted)",
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {newMembers.map((m) => (
                    <tr
                      key={m.id}
                      style={{ borderTop: "1px solid var(--border)" }}
                    >
                      <td style={{ padding: "14px 20px" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                          }}
                        >
                          <div
                            style={{
                              width: 32,
                              height: 32,
                              borderRadius: "50%",
                              background: "var(--gold-bg)",
                              border: "1px solid var(--gold-border)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: 12,
                              fontWeight: 600,
                              color: "var(--gold)",
                            }}
                          >
                            {m.full_name.charAt(0).toUpperCase()}
                          </div>
                          <span
                            style={{
                              fontSize: 14,
                              fontWeight: 500,
                              color: "var(--text-primary)",
                            }}
                          >
                            {m.full_name}
                          </span>
                        </div>
                      </td>
                      <td
                        style={{
                          padding: "14px 20px",
                          fontSize: 14,
                          color: "var(--text-secondary)",
                        }}
                      >
                        {m.phone || "—"}
                      </td>
                      <td
                        style={{
                          padding: "14px 20px",
                          fontSize: 14,
                          color: "var(--text-secondary)",
                        }}
                      >
                        {m.email || "—"}
                      </td>
                      <td style={{ padding: "14px 20px" }}>
                        <span
                          style={{
                            padding: "3px 10px",
                            borderRadius: 100,
                            fontSize: 12,
                            fontWeight: 500,
                            background:
                              m.reason === "worship"
                                ? "var(--gold-bg)"
                                : "rgba(100,116,139,0.1)",
                            color:
                              m.reason === "worship"
                                ? "var(--gold)"
                                : "var(--text-secondary)",
                            border: `1px solid ${m.reason === "worship" ? "var(--gold-border)" : "rgba(100,116,139,0.2)"}`,
                          }}
                        >
                          {m.reason === "worship"
                            ? "🙏 Joining"
                            : "👋 Passing by"}
                        </span>
                      </td>
                      <td style={{ padding: "14px 20px" }}>
                        <span
                          style={{
                            padding: "3px 10px",
                            borderRadius: 100,
                            fontSize: 12,
                            fontWeight: 500,
                            background: m.added_to_members
                              ? "rgba(22,163,74,0.1)"
                              : "rgba(100,116,139,0.1)",
                            color: m.added_to_members
                              ? "var(--success)"
                              : "var(--text-muted)",
                            border: `1px solid ${m.added_to_members ? "rgba(22,163,74,0.2)" : "rgba(100,116,139,0.2)"}`,
                          }}
                        >
                          {m.added_to_members ? "✓ Yes" : "— No"}
                        </span>
                      </td>
                      <td
                        style={{
                          padding: "14px 20px",
                          fontSize: 13,
                          color: "var(--text-muted)",
                        }}
                      >
                        {new Date(m.created_at).toLocaleDateString()}
                      </td>
                      <td style={{ padding: "14px 20px" }}>
                        <button
                          onClick={() => handleDelete(m.id)}
                          style={{
                            background: "none",
                            border: "none",
                            color: "var(--danger)",
                            fontSize: 13,
                            cursor: "pointer",
                            fontFamily: "var(--font-body)",
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
