"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

const navLinks = [
  { label: "Members", href: "/members" },
  { label: "Attendance", href: "/attendance" },
];

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    api
      .get("/dashboard/stats")
      .then((res) => setStats(res.data))
      .catch(() => router.push("/login"))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
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
          Loading dashboard...
        </p>
      </div>
    );

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-app)" }} className="page-shell">
      <Navbar links={navLinks} />
      <div className="page-content">
        <div style={{ marginBottom: 28 }}>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 26,
              fontWeight: 700,
              color: "var(--text-primary)",
              marginBottom: 4,
            }}
          >
            Dashboard
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>
            Overview of your church activity
          </p>
        </div>

        {/* Stat Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 16,
            marginBottom: 28,
          }}
        >
          {[
            {
              label: "Total Members",
              value: stats?.total_members ?? 0,
              color: "var(--accent-light)",
            },
            {
              label: "Active Members",
              value: stats?.active_members ?? 0,
              color: "var(--success)",
            },
            {
              label: "Inactive Members",
              value: stats?.inactive_members ?? 0,
              color: "var(--danger)",
            },
            {
              label: "Total Services",
              value: stats?.total_services ?? 0,
              color: "var(--gold)",
            },
          ].map(({ label, value, color }) => (
            <div
              key={label}
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                borderRadius: 12,
                padding: "20px 24px",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              <p
                style={{
                  fontSize: 12,
                  color: "var(--text-muted)",
                  fontWeight: 500,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  marginBottom: 10,
                }}
              >
                {label}
              </p>
              <p
                style={{ fontSize: 36, fontWeight: 600, color, lineHeight: 1 }}
              >
                {value}
              </p>
            </div>
          ))}
        </div>

        {/* Attendance Table */}
        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: 16,
            boxShadow: "var(--shadow-sm)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "20px 24px",
              borderBottom: "1px solid var(--border)",
            }}
          >
            <h2
              style={{
                fontSize: 16,
                fontWeight: 600,
                color: "var(--text-primary)",
              }}
            >
              Recent Attendance
            </h2>
          </div>
          {!stats?.attendance_trend?.length ? (
            <div
              style={{
                padding: 32,
                textAlign: "center",
                color: "var(--text-muted)",
                fontSize: 14,
              }}
            >
              No attendance data yet.
            </div>
          ) : (
            <div className="table-scroll">
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "var(--bg-secondary)" }}>
                    {["Service", "Date", "Present"].map((h) => (
                      <th
                        key={h}
                        style={{
                          padding: "12px 24px",
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
                  {stats.attendance_trend.map((row, i) => (
                    <tr key={i} style={{ borderTop: "1px solid var(--border)" }}>
                      <td
                        style={{
                          padding: "14px 24px",
                          fontSize: 14,
                          color: "var(--text-primary)",
                          fontWeight: 500,
                        }}
                      >
                        {row.service}
                      </td>
                      <td
                        style={{
                          padding: "14px 24px",
                          fontSize: 14,
                          color: "var(--text-secondary)",
                        }}
                      >
                        {row.date}
                      </td>
                      <td style={{ padding: "14px 24px" }}>
                        <span
                          style={{
                            background: "var(--gold-bg)",
                            color: "var(--gold)",
                            border: "1px solid var(--gold-border)",
                            padding: "3px 10px",
                            borderRadius: 100,
                            fontSize: 13,
                            fontWeight: 500,
                          }}
                        >
                          {row.present}
                        </span>
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
