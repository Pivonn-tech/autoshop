import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

interface Appointment {
  id: string;
  customerName: string;
  vehicle: string;
  licensePlate: string;
  serviceId: string;
  preferredDate: string;
  preferredTime: string;
  status: string;
  notes: string;
  createdAt: string;
}

const SERVICE_LABELS: Record<string, string> = {
  "engine-diagnostics": "Engine Diagnostics",
  "oil-change": "Oil Change",
  "brake-repair": "Brake Repair",
  "wheel-alignment": "Wheel Alignment",
  "battery-replacement": "Battery Replacement",
  "car-detailing": "Car Detailing",
  "tire-replacement": "Tire Replacement",
};

const STATUS_STEPS = [
  "Booked",
  "Vehicle Received",
  "Diagnosing",
  "In Progress",
  "Quality Check",
  "Ready for Pickup",
  "Completed",
];

const STATUS_MAP: Record<string, number> = {
  Pending: 1,
  Booked: 1,
  "Vehicle Received": 2,
  Diagnosing: 3,
  "In Progress": 4,
  "Quality Check": 5,
  "Ready for Pickup": 6,
  Completed: 6,
};

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function ArrowRight() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

export default function OrderTracking() {
  const router = useRouter();
  const [ref, setRef] = useState("");
  const [loading, setLoading] = useState(false);
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  // Pre-fill from URL query ?ref=APT-xxx
  useEffect(() => {
    if (router.isReady && router.query.ref) {
      const r = String(router.query.ref);
      setRef(r);
      lookup(r);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady]);

  const lookup = async (refOverride?: string) => {
    const refVal = (refOverride ?? ref).trim().toUpperCase();
    if (!refVal) return;
    setLoading(true);
    setError(null);
    setSearched(false);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/appointments`);
      if (!res.ok) throw new Error("server error");
      const all: Appointment[] = await res.json();
      const found = all.find(
        (a) =>
          a.id.toUpperCase() === refVal ||
          a.id.toUpperCase().includes(refVal)
      );
      if (found) {
        setAppointment(found);
      } else {
        setAppointment(null);
        setError(`No appointment found for reference "${refVal}". Check the ID and try again.`);
      }
    } catch {
      setError("Could not reach the server. Please try again.");
    } finally {
      setLoading(false);
      setSearched(true);
    }
  };

  const activeStep = appointment ? (STATUS_MAP[appointment.status] ?? 1) : 0;

  return (
    <div style={{ background: "var(--bg)", color: "var(--text)", minHeight: "100vh" }}>
      {/* Hero */}
      <div style={{ background: "var(--navy)", paddingBlock: 48 }}>
        <div className="container">
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.78rem", color: "rgba(255,255,255,0.5)", marginBottom: 12 }}>
            <Link href="/" style={{ color: "inherit", textDecoration: "none" }}>Home</Link>
            <span>›</span>
            <span style={{ color: "rgba(255,255,255,0.9)" }}>Order Tracking</span>
          </div>
          <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--amber)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>
            Service Tracker
          </div>
          <h1 style={{ fontFamily: "var(--font-space-grotesk, sans-serif)", fontSize: "clamp(1.6rem, 3vw, 2.4rem)", fontWeight: 700, color: "white", margin: "0 0 10px", letterSpacing: "-0.02em" }}>
            Track Your Vehicle's Service
          </h1>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.95rem", margin: 0 }}>
            Enter the reference number from your booking confirmation to see real-time progress.
          </p>
        </div>
      </div>

      {/* Lookup form */}
      <div style={{ background: "var(--surface)", borderBottom: "1px solid var(--border)", paddingBlock: 32 }}>
        <div className="container">
          <div style={{ maxWidth: 560, margin: "0 auto" }}>
            <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, color: "var(--text)", marginBottom: 8 }}>
              Appointment Reference Number
            </label>
            <div style={{ display: "flex", gap: 10 }}>
              <input
                type="text"
                value={ref}
                onChange={e => { setRef(e.target.value); setSearched(false); setError(null); setAppointment(null); }}
                onKeyDown={e => e.key === "Enter" && lookup()}
                placeholder="e.g. APT-1748293010768"
                style={{
                  flex: 1, height: 52, paddingInline: 16,
                  background: "var(--bg)", border: "1.5px solid var(--border)",
                  borderRadius: 10, color: "var(--text)", fontSize: "0.9375rem",
                  outline: "none", fontFamily: "monospace", letterSpacing: "0.04em",
                }}
              />
              <button
                onClick={() => lookup()}
                disabled={!ref.trim() || loading}
                style={{
                  height: 52, paddingInline: 24, background: ref.trim() && !loading ? "var(--amber)" : "var(--border)",
                  color: ref.trim() && !loading ? "white" : "var(--text-muted)",
                  border: "none", borderRadius: 10, fontWeight: 700, fontSize: "0.9rem",
                  cursor: ref.trim() && !loading ? "pointer" : "default", display: "flex",
                  alignItems: "center", gap: 8, transition: "all 180ms ease", flexShrink: 0,
                }}
              >
                {loading ? "Searching…" : <><span>Track</span> <ArrowRight /></>}
              </button>
            </div>
            <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: 8 }}>
              Your reference number was sent to your email after booking — it starts with <strong>APT-</strong>
            </p>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="container" style={{ paddingBlock: 48 }}>

        {/* Error state */}
        {searched && error && (
          <div style={{ maxWidth: 560, margin: "0 auto", textAlign: "center", padding: "40px 24px", background: "var(--surface)", borderRadius: 12, border: "1px solid var(--border)" }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 12, color: "var(--text-muted)" }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </div>
            <div style={{ fontWeight: 700, color: "var(--text)", marginBottom: 8 }}>{error}</div>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", lineHeight: 1.65, marginBottom: 20 }}>
              Can't find your booking? Give us a call and we'll look it up for you.
            </p>
            <a href="tel:+254743645366" style={{ display: "inline-flex", alignItems: "center", gap: 8, height: 44, paddingInline: 20, background: "var(--navy)", color: "white", borderRadius: 8, fontWeight: 700, textDecoration: "none", fontSize: "0.875rem" }}>
              Call 0743 645 366
            </a>
          </div>
        )}

        {/* Found appointment */}
        {appointment && (
          <div style={{ maxWidth: 720, margin: "0 auto", display: "flex", flexDirection: "column", gap: 24 }}>

            {/* Summary card */}
            <div style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 14, overflow: "hidden", boxShadow: "var(--shadow-sm)" }}>
              <div style={{ padding: "20px 24px", background: "var(--surface)", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
                <div>
                  <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--amber)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>Booking Reference</div>
                  <div style={{ fontFamily: "monospace", fontSize: "1.1rem", fontWeight: 700, color: "var(--navy)", letterSpacing: "0.05em" }}>{appointment.id}</div>
                </div>
                <span style={{
                  padding: "6px 16px", borderRadius: 20, fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase",
                  background: appointment.status === "Completed" ? "rgba(5,150,105,0.1)" : "rgba(232,112,10,0.1)",
                  color: appointment.status === "Completed" ? "#059669" : "var(--amber)",
                  border: `1px solid ${appointment.status === "Completed" ? "rgba(5,150,105,0.3)" : "rgba(232,112,10,0.3)"}`,
                }}>
                  {appointment.status}
                </span>
              </div>
              <div style={{ padding: "20px 24px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                {[
                  { label: "Customer", value: appointment.customerName },
                  { label: "Vehicle", value: appointment.vehicle },
                  { label: "License Plate", value: appointment.licensePlate || "—" },
                  { label: "Service", value: SERVICE_LABELS[appointment.serviceId] || appointment.serviceId },
                  { label: "Appointment Date", value: appointment.preferredDate },
                  { label: "Appointment Time", value: appointment.preferredTime },
                  ...(appointment.notes ? [{ label: "Notes", value: appointment.notes }] : []),
                ].map((row, i) => (
                  <div key={i}>
                    <div style={{ fontSize: "0.68rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 3 }}>{row.label}</div>
                    <div style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--text)" }}>{row.value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Progress tracker */}
            <div style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 14, padding: 28, boxShadow: "var(--shadow-sm)" }}>
              <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--amber)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 20 }}>Service Progress</div>

              {/* Track */}
              <div style={{ position: "relative", display: "flex", alignItems: "flex-start" }}>
                <div style={{ position: "absolute", top: 23, left: "5%", right: "5%", height: 3, background: "var(--border)", borderRadius: 2 }} />
                <div style={{
                  position: "absolute", top: 23, left: "5%",
                  width: `${Math.min(((activeStep - 1) / (STATUS_STEPS.length - 1)) * 90, 90)}%`,
                  height: 3, background: appointment.status === "Completed" ? "#059669" : "var(--amber)",
                  borderRadius: 2, transition: "width 600ms ease",
                }} />
                {STATUS_STEPS.map((step, i) => {
                  const stepNum = i + 1;
                  const isDone = stepNum < activeStep;
                  const isActive = stepNum === activeStep;
                  return (
                    <div key={step} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 10, position: "relative", zIndex: 1 }}>
                      <div style={{
                        width: 46, height: 46, borderRadius: "50%",
                        background: isDone ? "var(--navy)" : isActive ? (appointment.status === "Completed" ? "#059669" : "var(--amber)") : "var(--bg)",
                        border: `3px solid ${isDone ? "var(--navy)" : isActive ? (appointment.status === "Completed" ? "#059669" : "var(--amber)") : "var(--border)"}`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontWeight: 700, fontSize: "0.85rem",
                        color: isDone || isActive ? "white" : "var(--text-muted)",
                        boxShadow: isActive ? `0 0 0 5px ${appointment.status === "Completed" ? "rgba(5,150,105,0.18)" : "rgba(232,112,10,0.18)"}` : "none",
                        transition: "all 400ms ease",
                      }}>
                        {isDone ? <CheckIcon /> : stepNum}
                      </div>
                      <div style={{ fontSize: "0.65rem", fontWeight: 600, color: isActive ? "var(--navy)" : isDone ? "var(--text-secondary)" : "var(--text-muted)", textAlign: "center", lineHeight: 1.3, letterSpacing: "0.01em" }}>
                        {step}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Active step callout */}
              <div style={{ marginTop: 28, display: "flex", alignItems: "center", gap: 14, padding: "14px 20px", background: appointment.status === "Completed" ? "rgba(5,150,105,0.06)" : "rgba(232,112,10,0.06)", border: `1.5px solid ${appointment.status === "Completed" ? "rgba(5,150,105,0.2)" : "rgba(232,112,10,0.2)"}`, borderRadius: 10 }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: appointment.status === "Completed" ? "#059669" : "var(--amber)", flexShrink: 0, animation: appointment.status !== "Completed" ? "pulse 2s infinite" : "none" }} />
                <div>
                  <div style={{ fontWeight: 700, color: "var(--navy)", fontSize: "0.9rem" }}>
                    Currently: {appointment.status}
                  </div>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: 2 }}>
                    {appointment.status === "Completed"
                      ? "Your vehicle service is complete. Please collect your vehicle."
                      : `Your ${SERVICE_LABELS[appointment.serviceId] || "service"} appointment is scheduled for ${appointment.preferredDate} at ${appointment.preferredTime}.`}
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Link href="/appointments" style={{ display: "inline-flex", alignItems: "center", gap: 8, height: 48, paddingInline: 24, background: "var(--amber)", color: "white", borderRadius: 8, fontWeight: 700, textDecoration: "none", fontSize: "0.875rem" }}>
                Book Another Service <ArrowRight />
              </Link>
              <a href="tel:+254743645366" style={{ display: "inline-flex", alignItems: "center", gap: 8, height: 48, paddingInline: 24, border: "1.5px solid var(--border)", color: "var(--text-secondary)", borderRadius: 8, fontWeight: 600, textDecoration: "none", fontSize: "0.875rem" }}>
                Call Workshop
              </a>
            </div>
          </div>
        )}

        {/* Empty / prompt state */}
        {!searched && !appointment && !loading && (
          <div style={{ maxWidth: 480, margin: "0 auto", textAlign: "center", paddingTop: 16 }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 16, color: "var(--text-muted)" }}>
              <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
              </svg>
            </div>
            <h2 style={{ fontFamily: "var(--font-space-grotesk, sans-serif)", fontWeight: 700, fontSize: "1.3rem", color: "var(--text)", marginBottom: 8 }}>Enter your reference above</h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", lineHeight: 1.65 }}>
              Your <strong>APT-</strong> reference number was included in the confirmation shown after booking. If you've lost it, call us and we'll look it up.
            </p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @media (max-width: 640px) {
          div[style*="grid-template-columns: 1fr 1fr"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
