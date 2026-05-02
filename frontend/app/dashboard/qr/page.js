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

export default function QRPage() {
  const router = useRouter();
  const [churchId, setChurchId] = useState(null);
  const [qrUrl, setQrUrl] = useState(null);
  const [checkinUrl, setCheckinUrl] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const id = payload.church_id;
      setChurchId(id);
      setCheckinUrl(`${window.location.origin}/checkin/${id}`);
      setQrUrl(
        `https://church-ms-production.up.railway.app/export/qr/entrance/${id}`,
      );
    } catch {
      router.push("/login");
    }
  }, []);

  const downloadQR = () => {
    const link = document.createElement("a");
    link.href = qrUrl;
    link.download = "church-entrance-qr.png";
    link.click();
  };

  const copyLink = () => {
    navigator.clipboard.writeText(checkinUrl);
    alert("Check-in link copied!");
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
              Entrance QR Code
            </h1>
            <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>
              Print and place this at your church entrance
            </p>
          </div>
        </div>

        <div style={{ maxWidth: 500, margin: "0 auto" }}>
          {/* QR Code */}
          <div
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--gold-border)",
              borderRadius: 20,
              padding: 32,
              textAlign: "center",
              marginBottom: 20,
            }}
          >
            <p
              style={{
                color: "var(--text-secondary)",
                fontSize: 13,
                marginBottom: 20,
              }}
            >
              Members and visitors scan this to check in or register
            </p>
            {qrUrl && (
              <div
                style={{
                  background: "#fff",
                  borderRadius: 16,
                  padding: 16,
                  display: "inline-block",
                  marginBottom: 20,
                }}
              >
                <img
                  src={qrUrl}
                  alt="Church QR Code"
                  style={{ width: 200, height: 200, display: "block" }}
                />
              </div>
            )}
            <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
              <button
                onClick={downloadQR}
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
                ↓ Download QR
              </button>
              <button
                onClick={copyLink}
                style={{
                  background: "rgba(201,168,76,0.1)",
                  border: "1px solid rgba(201,168,76,0.2)",
                  color: "#c9a84c",
                  padding: "10px 24px",
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: 500,
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                Copy Link
              </button>
            </div>
          </div>

          {/* Instructions */}
          <div
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: 16,
              padding: 24,
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
              How it works
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {[
                ["1", "Print the QR code and place it at your church entrance"],
                [
                  "2",
                  "Members scan it and enter their name — attendance marked automatically",
                ],
                [
                  "3",
                  "First time visitors scan it and fill a short registration form",
                ],
                ["4", "All check-ins and visitors appear in your dashboard"],
              ].map(([num, text]) => (
                <div
                  key={num}
                  style={{ display: "flex", gap: 12, alignItems: "flex-start" }}
                >
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      background: "rgba(201,168,76,0.1)",
                      border: "1px solid rgba(201,168,76,0.2)",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 12,
                      fontWeight: 700,
                      color: "#c9a84c",
                      flexShrink: 0,
                    }}
                  >
                    {num}
                  </div>
                  <p
                    style={{
                      color: "var(--text-secondary)",
                      fontSize: 14,
                      lineHeight: 1.5,
                      paddingTop: 4,
                    }}
                  >
                    {text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
