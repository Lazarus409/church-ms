"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

const navLinks = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Members", href: "/members" },
];

export default function AttendancePage() {
  const router = useRouter();
  const [services, setServices] = useState([]);
  const [members, setMembers] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [attendance, setAttendance] = useState({});
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [serviceForm, setServiceForm] = useState({
    name: "",
    scheduled_date: "",
  });
  const [saving, setSaving] = useState(false);

  const fetchServices = async () => {
    try {
      const res = await api.get("/attendance/services");
      setServices(res.data);
    } catch {
      router.push("/login");
    }
  };

  const fetchMembers = async () => {
    const res = await api.get("/members/");
    setMembers(res.data);
    const initial = {};
    res.data.forEach((m) => (initial[m.id] = "present"));
    setAttendance(initial);
  };

  useEffect(() => {
    fetchServices();
    fetchMembers();
  }, []);

  const handleCreateService = async () => {
    setSaving(true);
    try {
      await api.post("/attendance/services", serviceForm);
      setShowServiceForm(false);
      setServiceForm({ name: "", scheduled_date: "" });
      fetchServices();
    } catch {
      alert("Error creating service");
    } finally {
      setSaving(false);
    }
  };

  const handleMarkAttendance = async () => {
    if (!selectedService) return alert("Select a service first");
    setSaving(true);
    try {
      const records = members.map((m) => ({
        member_id: m.id,
        status: attendance[m.id] || "absent",
      }));
      await api.post("/attendance/mark", {
        service_id: selectedService,
        records,
      });
      alert("Attendance saved!");
    } catch {
      alert("Error saving attendance");
    } finally {
      setSaving(false);
    }
  };

  const presentCount = Object.values(attendance).filter(
    (v) => v === "present",
  ).length;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-app)" }} className="page-shell">
      <Navbar links={navLinks} />
      <div className="page-content" style={{ maxWidth: 900 }}>
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
              Attendance
            </h1>
            <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>
              Select a service and mark attendance
            </p>
          </div>
          <div className="page-header__actions">
            <button
              onClick={() => setShowServiceForm(!showServiceForm)}
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
              + New Service
            </button>
          </div>
        </div>

        {/* Service Form */}
        {showServiceForm && (
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
              Create Service
            </h3>
            <div style={{ marginBottom: 16 }} className="responsive-grid-2">
              <input
                placeholder="Service name"
                value={serviceForm.name}
                onChange={(e) =>
                  setServiceForm({ ...serviceForm, name: e.target.value })
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
              <input
                type="date"
                value={serviceForm.scheduled_date}
                onChange={(e) =>
                  setServiceForm({
                    ...serviceForm,
                    scheduled_date: e.target.value,
                  })
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
                onClick={handleCreateService}
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
                }}
              >
                {saving ? "Creating..." : "Create Service"}
              </button>
              <button
                onClick={() => setShowServiceForm(false)}
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
            </div>
          </div>
        )}

        {/* Select Service */}
        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: 16,
            padding: 24,
            marginBottom: 20,
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <h3
            style={{
              fontSize: 15,
              fontWeight: 600,
              color: "var(--text-primary)",
              marginBottom: 16,
            }}
          >
            Select Service
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: 12,
            }}
          >
            {services.map((s) => (
              <button
                key={s.id}
                onClick={() => setSelectedService(s.id)}
                style={{
                  padding: "14px 16px",
                  borderRadius: 10,
                  border: `2px solid ${selectedService === s.id ? "var(--gold)" : "var(--border)"}`,
                  background:
                    selectedService === s.id
                      ? "var(--gold-bg)"
                      : "var(--bg-secondary)",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.2s",
                  fontFamily: "var(--font-body)",
                }}
              >
                <p
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: "var(--text-primary)",
                    marginBottom: 4,
                  }}
                >
                  {s.name}
                </p>
                <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
                  {s.scheduled_date}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Mark Attendance */}
        {members.length > 0 && (
          <div
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: 16,
              overflow: "hidden",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <div
              style={{
                padding: "16px 24px",
                borderBottom: "1px solid var(--border)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h3
                style={{
                  fontSize: 15,
                  fontWeight: 600,
                  color: "var(--text-primary)",
                }}
              >
                Mark Attendance
              </h3>
              <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>
                {presentCount} of {members.length} present
              </span>
            </div>
            <div style={{ padding: "8px 0" }}>
              {members.map((m) => (
                <div
                  key={m.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "12px 24px",
                    borderBottom: "1px solid var(--border)",
                  }}
                  className="attendance-member-row"
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 10 }}
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
                      {m.full_name.charAt(0)}
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
                  <div style={{ display: "flex", gap: 8 }} className="attendance-member-actions">
                    {["present", "absent"].map((status) => (
                      <button
                        key={status}
                        onClick={() =>
                          setAttendance({ ...attendance, [m.id]: status })
                        }
                        style={{
                          padding: "6px 16px",
                          borderRadius: 6,
                          border: "none",
                          cursor: "pointer",
                          fontSize: 13,
                          fontWeight: 500,
                          fontFamily: "var(--font-body)",
                          transition: "all 0.15s",
                          background:
                            attendance[m.id] === status
                              ? status === "present"
                                ? "rgba(22,163,74,0.15)"
                                : "rgba(220,38,38,0.15)"
                              : "var(--bg-secondary)",
                          color:
                            attendance[m.id] === status
                              ? status === "present"
                                ? "var(--success)"
                                : "var(--danger)"
                              : "var(--text-muted)",
                          outline:
                            attendance[m.id] === status
                              ? `1px solid ${status === "present" ? "rgba(22,163,74,0.3)" : "rgba(220,38,38,0.3)"}`
                              : "none",
                        }}
                      >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ padding: 20 }}>
              <button
                onClick={handleMarkAttendance}
                disabled={saving || !selectedService}
                style={{
                  width: "100%",
                  padding: 13,
                  background: "var(--gold)",
                  border: "none",
                  borderRadius: 10,
                  color: "#fff",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "var(--font-body)",
                  opacity: saving || !selectedService ? 0.6 : 1,
                }}
              >
                {saving ? "Saving..." : "Save Attendance"}
              </button>
              {!selectedService && (
                <p
                  style={{
                    textAlign: "center",
                    fontSize: 12,
                    color: "var(--text-muted)",
                    marginTop: 8,
                  }}
                >
                  Select a service above to save attendance
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
