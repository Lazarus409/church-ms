"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

const navLinks = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Attendance", href: "/attendance" },
];

export default function MembersPage() {
  const router = useRouter();
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    email: "",
    address: "",
    date_joined: "",
  });
  const [saving, setSaving] = useState(false);

  const fetchMembers = async () => {
    try {
      const res = await api.get("/members/");
      setMembers(res.data);
    } catch {
      router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleSearch = async (e) => {
    const val = e.target.value;
    setSearch(val);
    const res = await api.get(`/members/?search=${val}`);
    setMembers(res.data);
  };

  const handleAdd = async () => {
    setSaving(true);
    try {
      await api.post("/members/", form);
      setShowForm(false);
      setForm({
        full_name: "",
        phone: "",
        email: "",
        address: "",
        date_joined: "",
      });
      fetchMembers();
    } catch {
      alert("Error adding member");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this member?")) return;
    await api.delete(`/members/${id}`);
    fetchMembers();
  };

  const handleExportMembers = async () => {
    try {
      const res = await api.get("/export/members", { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "members.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch {
      alert("Export failed");
    }
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
              Members
            </h1>
            <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>
              {members.length} total members
            </p>
          </div>
          <div className="page-header__actions">
            <button
              onClick={() => setShowForm(!showForm)}
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
              }}
            >
              + Add Member
            </button>
          </div>
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Search members by name..."
          value={search}
          onChange={handleSearch}
          style={{
            width: "100%",
            padding: "10px 16px",
            border: "1px solid var(--border)",
            borderRadius: 10,
            background: "var(--bg-card)",
            color: "var(--text-primary)",
            fontSize: 14,
            marginBottom: 20,
            fontFamily: "var(--font-body)",
            outline: "none",
          }}
        />

        {/* Add Form */}
        {showForm && (
          <div
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--gold-border)",
              borderRadius: 16,
              padding: 24,
              marginBottom: 20,
              boxShadow: "var(--shadow-md)",
            }}
          >
            <h3
              style={{
                fontSize: 16,
                fontWeight: 600,
                color: "var(--text-primary)",
                marginBottom: 16,
              }}
            >
              New Member
            </h3>
            <div style={{ marginBottom: 16 }} className="responsive-grid-2">
              {[
                ["full_name", "Full name", "text"],
                ["phone", "Phone number", "text"],
                ["email", "Email address", "email"],
                ["address", "Address", "text"],
              ].map(([field, placeholder, type]) => (
                <input
                  key={field}
                  type={type}
                  placeholder={placeholder}
                  value={form[field]}
                  onChange={(e) =>
                    setForm({ ...form, [field]: e.target.value })
                  }
                  style={{
                    padding: "10px 14px",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                    background: "var(--bg-secondary)",
                    color: "var(--text-primary)",
                    fontSize: 14,
                    fontFamily: "var(--font-body)",
                    outline: "none",
                  }}
                />
              ))}
              <input
                type="date"
                value={form.date_joined}
                onChange={(e) =>
                  setForm({ ...form, date_joined: e.target.value })
                }
                style={{
                  padding: "10px 14px",
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                  background: "var(--bg-secondary)",
                  color: "var(--text-primary)",
                  fontSize: 14,
                  fontFamily: "var(--font-body)",
                  outline: "none",
                }}
              />
            </div>
            <div style={{ display: "flex", gap: 10 }} className="stack-actions">
              <button
                onClick={handleAdd}
                disabled={saving}
                style={{
                  background: "var(--gold)",
                  border: "none",
                  borderRadius: 8,
                  padding: "10px 24px",
                  color: "#fff",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "var(--font-body)",
                  opacity: saving ? 0.7 : 1,
                }}
              >
                {saving ? "Saving..." : "Save Member"}
              </button>
              <button
                onClick={() => setShowForm(false)}
                style={{
                  background: "none",
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                  padding: "10px 24px",
                  color: "var(--text-secondary)",
                  fontSize: 14,
                  cursor: "pointer",
                  fontFamily: "var(--font-body)",
                }}
              >
                Cancel
              </button>
              <div style={{ display: "flex", gap: 12 }}>
                <button
                  onClick={handleExportMembers}
                  style={{
                    background: "rgba(201,168,76,0.1)",
                    border: "1px solid rgba(201,168,76,0.2)",
                    color: "#c9a84c",
                    padding: "10px 18px",
                    borderRadius: 8,
                    fontSize: 14,
                    fontWeight: 500,
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  ↓ Export CSV
                </button>
                <button
                  onClick={() => setShowForm(true)}
                  style={{
                    background: "linear-gradient(135deg, #c9a84c, #e8c96d)",
                    color: "#0a0f1e",
                    padding: "10px 18px",
                    borderRadius: 8,
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: "pointer",
                    border: "none",
                    fontFamily: "inherit",
                  }}
                >
                  + Add Member
                </button>
              </div>
            </div>
          </div>
        )}

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
              Loading members...
            </div>
          ) : members.length === 0 ? (
            <div
              style={{
                padding: 48,
                textAlign: "center",
                color: "var(--text-muted)",
                fontSize: 14,
              }}
            >
              No members yet. Add your first member above.
            </div>
          ) : (
            <div className="table-scroll">
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "var(--bg-secondary)" }}>
                    {["Name", "Phone", "Email", "Status", "Joined", ""].map(
                      (h) => (
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
                      ),
                    )}
                  </tr>
                </thead>
                <tbody>
                  {members.map((m) => (
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
                              m.status === "active"
                                ? "rgba(22,163,74,0.1)"
                                : "rgba(220,38,38,0.1)",
                            color:
                              m.status === "active"
                                ? "var(--success)"
                                : "var(--danger)",
                            border: `1px solid ${m.status === "active" ? "rgba(22,163,74,0.2)" : "rgba(220,38,38,0.2)"}`,
                          }}
                        >
                          {m.status}
                        </span>
                      </td>
                      <td
                        style={{
                          padding: "14px 20px",
                          fontSize: 14,
                          color: "var(--text-secondary)",
                        }}
                      >
                        {m.date_joined || "—"}
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
