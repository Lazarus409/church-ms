"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

export default function CheckinPage() {
  const { church_id } = useParams();
  const [step, setStep] = useState("choice"); // choice | member | visitor | done
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState("");
  const [fullName, setFullName] = useState("");
  const [visitorForm, setVisitorForm] = useState({
    full_name: "",
    phone: "",
    email: "",
    reason: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const API = "https://church-ms-production.up.railway.app";

  useEffect(() => {
    fetch(`${API}/attendance/services/public/${church_id}`)
      .then((r) => r.json())
      .then((data) => setServices(data))
      .catch(() => {});
  }, [church_id]);

  const handleMemberCheckin = async () => {
    if (!fullName.trim()) {
      setError("Please enter your full name");
      return;
    }
    if (!selectedService) {
      setError("Please select a service");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API}/attendance/checkin-by-name`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          church_id: parseInt(church_id),
          service_id: parseInt(selectedService),
          full_name: fullName.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Check-in failed");
      setResult({ success: true, message: data.message, name: fullName });
      setStep("done");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVisitorSubmit = async () => {
    if (!visitorForm.full_name.trim()) {
      setError("Please enter your full name");
      return;
    }
    if (!visitorForm.reason) {
      setError("Please select your reason for visiting");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API}/new-members/register/${church_id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(visitorForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Failed");
      setResult({
        success: true,
        message: data.message,
        joining: visitorForm.reason === "worship",
      });
      setStep("done");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const bg = "#0a0f1e";
  const card = "rgba(255,255,255,0.04)";
  const border = "rgba(255,255,255,0.08)";
  const gold = "#c9a84c";
  const muted = "#64748b";
  const text = "#fff";

  const inputStyle = {
    width: "100%",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 10,
    padding: "13px 16px",
    color: text,
    fontSize: 15,
    fontFamily: "inherit",
    outline: "none",
  };
  const btnGold = {
    width: "100%",
    background: `linear-gradient(135deg, ${gold}, #e8c96d)`,
    color: "#0a0f1e",
    padding: 14,
    borderRadius: 10,
    fontWeight: 700,
    fontSize: 16,
    border: "none",
    cursor: "pointer",
    fontFamily: "inherit",
    marginTop: 8,
  };
  const btnOutline = {
    width: "100%",
    background: "transparent",
    border: `1px solid ${border}`,
    color: text,
    padding: 14,
    borderRadius: 10,
    fontWeight: 500,
    fontSize: 15,
    cursor: "pointer",
    fontFamily: "inherit",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'DM Sans', sans-serif",
        padding: 20,
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input::placeholder { color: #475569; }
        select option { background: #1e293b; }
        .reason-btn { width: 100%; padding: 16px 20px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.03); color: #94a3b8; font-size: 14px; font-family: inherit; cursor: pointer; text-align: left; transition: all 0.2s; display: flex; align-items: center; gap: 14px; }
        .reason-btn.selected { border-color: rgba(201,168,76,0.5); background: rgba(201,168,76,0.08); color: #fff; }
        .reason-btn:hover { border-color: rgba(201,168,76,0.3); }
        .choice-btn { width: 100%; padding: 24px 20px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.03); color: #fff; font-family: inherit; cursor: pointer; text-align: center; transition: all 0.2s; }
        .choice-btn:hover { border-color: rgba(201,168,76,0.4); background: rgba(201,168,76,0.06); transform: translateY(-2px); }
      `}</style>

      <div style={{ width: "100%", maxWidth: 440 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div
            style={{
              width: 52,
              height: 52,
              background: `linear-gradient(135deg, ${gold}, #e8c96d)`,
              borderRadius: 14,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 26,
              margin: "0 auto 14px",
            }}
          >
            ✝
          </div>
          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 26,
              fontWeight: 700,
              color: text,
              marginBottom: 6,
            }}
          >
            Welcome!
          </h1>
          <p style={{ color: muted, fontSize: 14 }}>
            Please check in to today's service
          </p>
        </div>

        {/* Error */}
        {error && (
          <div
            style={{
              background: "rgba(220,38,38,0.1)",
              border: "1px solid rgba(220,38,38,0.2)",
              borderRadius: 10,
              padding: "12px 16px",
              marginBottom: 16,
              color: "#fca5a5",
              fontSize: 13,
            }}
          >
            {error}
          </div>
        )}

        {/* STEP: Choice */}
        {step === "choice" && (
          <div
            style={{
              background: card,
              border: `1px solid ${border}`,
              borderRadius: 20,
              padding: 28,
            }}
          >
            <p
              style={{
                color: muted,
                fontSize: 14,
                marginBottom: 20,
                textAlign: "center",
              }}
            >
              Are you a member or visiting for the first time?
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <button className="choice-btn" onClick={() => setStep("member")}>
                <div style={{ fontSize: 36, marginBottom: 10 }}>👤</div>
                <p style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>
                  I'm a Member
                </p>
                <p style={{ color: muted, fontSize: 13 }}>
                  Check in with your name
                </p>
              </button>
              <button className="choice-btn" onClick={() => setStep("visitor")}>
                <div style={{ fontSize: 36, marginBottom: 10 }}>👋</div>
                <p style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>
                  First Time Visitor
                </p>
                <p style={{ color: muted, fontSize: 13 }}>
                  Register as a new visitor
                </p>
              </button>
            </div>
          </div>
        )}

        {/* STEP: Member check-in */}
        {step === "member" && (
          <div
            style={{
              background: card,
              border: `1px solid ${border}`,
              borderRadius: 20,
              padding: 28,
            }}
          >
            <button
              onClick={() => {
                setStep("choice");
                setError("");
              }}
              style={{
                background: "none",
                border: "none",
                color: muted,
                fontSize: 13,
                cursor: "pointer",
                fontFamily: "inherit",
                marginBottom: 20,
                padding: 0,
              }}
            >
              ← Back
            </button>
            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 22,
                color: text,
                marginBottom: 6,
              }}
            >
              Member Check-in
            </h2>
            <p style={{ color: muted, fontSize: 13, marginBottom: 24 }}>
              Enter your name exactly as it appears in the church records
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
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
                  Your Full Name
                </label>
                <input
                  style={inputStyle}
                  placeholder="e.g. Kofi Boateng"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
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
                  Select Service
                </label>
                <select
                  style={{ ...inputStyle }}
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                >
                  <option value="">Choose today's service...</option>
                  {services.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} — {s.scheduled_date}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleMemberCheckin}
                disabled={loading}
                style={btnGold}
              >
                {loading ? "Checking in..." : "Check In →"}
              </button>
            </div>
          </div>
        )}

        {/* STEP: Visitor form */}
        {step === "visitor" && (
          <div
            style={{
              background: card,
              border: `1px solid ${border}`,
              borderRadius: 20,
              padding: 28,
            }}
          >
            <button
              onClick={() => {
                setStep("choice");
                setError("");
              }}
              style={{
                background: "none",
                border: "none",
                color: muted,
                fontSize: 13,
                cursor: "pointer",
                fontFamily: "inherit",
                marginBottom: 20,
                padding: 0,
              }}
            >
              ← Back
            </button>
            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 22,
                color: text,
                marginBottom: 6,
              }}
            >
              Welcome, Visitor!
            </h2>
            <p style={{ color: muted, fontSize: 13, marginBottom: 24 }}>
              Please fill in your details so we can get to know you
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
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
                  Full Name *
                </label>
                <input
                  style={inputStyle}
                  placeholder="Your full name"
                  value={visitorForm.full_name}
                  onChange={(e) =>
                    setVisitorForm({
                      ...visitorForm,
                      full_name: e.target.value,
                    })
                  }
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
                  Phone Number
                </label>
                <input
                  style={inputStyle}
                  placeholder="Your phone number"
                  value={visitorForm.phone}
                  onChange={(e) =>
                    setVisitorForm({ ...visitorForm, phone: e.target.value })
                  }
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
                  Email (optional)
                </label>
                <input
                  style={inputStyle}
                  type="email"
                  placeholder="Your email"
                  value={visitorForm.email}
                  onChange={(e) =>
                    setVisitorForm({ ...visitorForm, email: e.target.value })
                  }
                />
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: 13,
                    fontWeight: 500,
                    color: "#94a3b8",
                    marginBottom: 12,
                  }}
                >
                  Reason for visiting *
                </label>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 10 }}
                >
                  <button
                    type="button"
                    className={`reason-btn ${visitorForm.reason === "worship" ? "selected" : ""}`}
                    onClick={() =>
                      setVisitorForm({ ...visitorForm, reason: "worship" })
                    }
                  >
                    <span style={{ fontSize: 24 }}>🙏</span>
                    <div>
                      <p style={{ fontWeight: 600, marginBottom: 2 }}>
                        I want to worship here
                      </p>
                      <p style={{ fontSize: 12, color: muted }}>
                        I'd like to join this church family
                      </p>
                    </div>
                  </button>
                  <button
                    type="button"
                    className={`reason-btn ${visitorForm.reason === "passing" ? "selected" : ""}`}
                    onClick={() =>
                      setVisitorForm({ ...visitorForm, reason: "passing" })
                    }
                  >
                    <span style={{ fontSize: 24 }}>👋</span>
                    <div>
                      <p style={{ fontWeight: 600, marginBottom: 2 }}>
                        Just passing by
                      </p>
                      <p style={{ fontSize: 12, color: muted }}>
                        Visiting for today only
                      </p>
                    </div>
                  </button>
                </div>
              </div>

              <button
                onClick={handleVisitorSubmit}
                disabled={loading}
                style={btnGold}
              >
                {loading ? "Submitting..." : "Submit →"}
              </button>
            </div>
          </div>
        )}

        {/* STEP: Done */}
        {step === "done" && result && (
          <div
            style={{
              background: card,
              border: `1px solid ${border}`,
              borderRadius: 20,
              padding: 40,
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 56, marginBottom: 16 }}>
              {result.success ? "✅" : "❌"}
            </div>
            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 24,
                color: text,
                marginBottom: 12,
              }}
            >
              {result.joining
                ? "Welcome to the family!"
                : result.success
                  ? "You're checked in!"
                  : "Oops!"}
            </h2>
            <p
              style={{
                color: muted,
                fontSize: 15,
                lineHeight: 1.6,
                marginBottom: 24,
              }}
            >
              {result.message}
            </p>
            <div
              style={{
                background: "rgba(201,168,76,0.08)",
                border: "1px solid rgba(201,168,76,0.15)",
                borderRadius: 12,
                padding: 16,
                marginBottom: 24,
              }}
            >
              <p style={{ color: gold, fontSize: 14 }}>God bless you 🌟</p>
            </div>
            <button
              onClick={() => {
                setStep("choice");
                setFullName("");
                setVisitorForm({
                  full_name: "",
                  phone: "",
                  email: "",
                  reason: "",
                });
                setError("");
                setResult(null);
              }}
              style={btnOutline}
            >
              ← Back to start
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
