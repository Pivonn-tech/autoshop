"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { services } from "../lib/businessData";

function ArrowRight() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
    </svg>
  );
}
function CheckCircle() {
  return (
    <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><polyline points="9 12 11 14 15 10" />
    </svg>
  );
}

// ── Service icon SVG components ────────────────────────────────────────────────
function SvcDiagnosticsIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}
function SvcOilIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2v6l3 3-3 3v6" /><ellipse cx="12" cy="19" rx="5" ry="3" />
      <path d="M7 8H4a1 1 0 00-1 1v5a1 1 0 001 1h3" />
    </svg>
  );
}
function SvcBrakeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="4" />
      <line x1="12" y1="2" x2="12" y2="6" /><line x1="12" y1="18" x2="12" y2="22" />
      <line x1="2" y1="12" x2="6" y2="12" /><line x1="18" y1="12" x2="22" y2="12" />
    </svg>
  );
}
function SvcAlignIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.07 4.93l-1.41 1.41M4.93 4.93l1.41 1.41M4.93 19.07l1.41-1.41M19.07 19.07l-1.41-1.41M12 2v2M12 20v2M2 12h2M20 12h2" />
    </svg>
  );
}
function SvcBatteryIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="18" height="11" rx="2" /><path d="M20 11h2v4h-2" />
      <line x1="7" y1="12" x2="11" y2="12" /><line x1="9" y1="10" x2="9" y2="14" />
    </svg>
  );
}
function SvcDetailIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M8 14s1.5 2 4 2 4-2 4-2" />
      <line x1="9" y1="9" x2="9.01" y2="9" /><line x1="15" y1="9" x2="15.01" y2="9" />
    </svg>
  );
}
function SvcTireIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="3" />
      <line x1="12" y1="2" x2="12" y2="5" /><line x1="12" y1="19" x2="12" y2="22" />
      <line x1="2" y1="12" x2="5" y2="12" /><line x1="19" y1="12" x2="22" y2="12" />
    </svg>
  );
}
function SvcDefaultIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />
    </svg>
  );
}

const SERVICE_ICON_MAP: Record<string, React.ReactNode> = {
  "engine-diagnostics": <SvcDiagnosticsIcon />,
  "oil-change": <SvcOilIcon />,
  "brake-repair": <SvcBrakeIcon />,
  "wheel-alignment": <SvcAlignIcon />,
  "battery-replacement": <SvcBatteryIcon />,
  "car-detailing": <SvcDetailIcon />,
  "tire-replacement": <SvcTireIcon />,
};

const STEPS = ["Your Info", "Vehicle", "Service & Time", "Confirm"];

interface FormData {
  name: string;
  phone: string;
  email: string;
  make: string;
  model: string;
  year: string;
  licensePlate: string;
  serviceId: string;
  date: string;
  time: string;
  notes: string;
}

const TIMES = ["8:00 AM","9:00 AM","10:00 AM","11:00 AM","12:00 PM","1:00 PM","2:00 PM","3:00 PM","4:00 PM","5:00 PM"];
const MAKES = ["Toyota","Subaru","Nissan","Honda","Mazda","Mitsubishi","Isuzu","Ford","Volkswagen","Hyundai","KIA","BMW","Mercedes","Other"];

export default function Appointments() {
  const router = useRouter();
  const preselectedService = router.query.service as string;

  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [form, setForm] = useState<FormData>({
    name: "", phone: "", email: "",
    make: "", model: "", year: "", licensePlate: "",
    serviceId: preselectedService || "",
    date: "", time: "", notes: "",
  });

  const set = (key: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm(f => ({ ...f, [key]: e.target.value }));
    setErrors(err => ({ ...err, [key]: undefined }));
  };

  const validate = (stepIndex: number): boolean => {
    const e: Partial<FormData> = {};
    if (stepIndex === 0) {
      if (!form.name.trim()) e.name = "Name is required";
      if (!form.phone.trim()) e.phone = "Phone is required";
      if (!form.email.trim() || !form.email.includes("@")) e.email = "Valid email required";
    }
    if (stepIndex === 1) {
      if (!form.make) e.make = "Make is required";
      if (!form.model.trim()) e.model = "Model is required";
      if (!form.year.trim()) e.year = "Year is required";
      if (!form.licensePlate.trim()) e.licensePlate = "Plate is required";
    }
    if (stepIndex === 2) {
      if (!form.serviceId) e.serviceId = "Please select a service";
      if (!form.date) e.date = "Please pick a date";
      if (!form.time) e.time = "Please pick a time";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => { if (validate(step)) setStep(s => s + 1); };
  const back = () => setStep(s => s - 1);
  const submit = async () => {
    if (!validate(2)) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/appointments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setSubmitError(data.error || "Booking failed. Please try again.");
        setSubmitting(false);
        return;
      }
      setSubmitted(true);
    } catch {
      setSubmitError("Network error — please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const selectedService = services.find(s => s.id === form.serviceId);
  const today = new Date().toISOString().split("T")[0];

  const inputStyle: React.CSSProperties = {
    width: "100%", height: 48, paddingInline: 14,
    background: "var(--bg)", border: "1.5px solid var(--border)",
    borderRadius: 8, color: "var(--text)", fontSize: "0.9375rem", outline: "none",
    fontFamily: "inherit", transition: "border-color 180ms ease",
  };
  const errorStyle: React.CSSProperties = { fontSize: "0.78rem", color: "#DC2626", marginTop: 4 };
  const labelStyle: React.CSSProperties = { fontSize: "0.875rem", fontWeight: 600, color: "var(--text)", marginBottom: 6, display: "block" };

  if (submitted) {
    return (
      <div style={{ background: "var(--bg)", minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", maxWidth: 480, padding: 40 }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}><CheckCircle /></div>
          <h2 style={{ fontFamily: "var(--font-space-grotesk, sans-serif)", fontSize: "1.8rem", fontWeight: 700, color: "var(--text)", marginBottom: 12 }}>
            Booking Confirmed!
          </h2>
          <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: 8 }}>
            Thank you, <strong>{form.name}</strong>. Your appointment for{" "}
            <strong>{selectedService?.title}</strong> on{" "}
            <strong>{form.date}</strong> at <strong>{form.time}</strong> has been received.
          </p>
          <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: 28 }}>
            We'll send a confirmation to <strong>{form.email}</strong> shortly.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/order-tracking" style={{ display: "inline-flex", alignItems: "center", gap: 8, height: 48, paddingInline: 24, background: "var(--amber)", color: "white", borderRadius: 8, fontWeight: 700, textDecoration: "none", fontSize: "0.9rem" }}>
              Track My Service <ArrowRight />
            </Link>
            <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 8, height: 48, paddingInline: 24, border: "1.5px solid var(--border)", color: "var(--text-secondary)", borderRadius: 8, fontWeight: 600, textDecoration: "none", fontSize: "0.9rem" }}>
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: "var(--bg)", color: "var(--text)", minHeight: "100vh" }}>

      {/* Hero */}
      <div style={{ background: "var(--navy)", color: "white", paddingBlock: 48 }}>
        <div className="container">
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.78rem", color: "rgba(255,255,255,0.5)", marginBottom: 12 }}>
            <Link href="/" style={{ color: "inherit", textDecoration: "none" }}>Home</Link>
            <span>›</span>
            <span style={{ color: "rgba(255,255,255,0.9)" }}>Book a Service</span>
          </div>
          <h1 style={{ fontFamily: "var(--font-space-grotesk, sans-serif)", fontSize: "clamp(1.8rem, 4vw, 2.6rem)", fontWeight: 700, color: "white", margin: "0 0 10px", letterSpacing: "-0.025em" }}>
            Book a Service Appointment
          </h1>
          <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "1rem", lineHeight: 1.65, margin: 0 }}>
            Most appointments confirmed within 2 hours. Same-day slots often available.
          </p>
        </div>
      </div>

      {/* Stepper */}
      <div style={{ background: "var(--surface)", borderBottom: "1px solid var(--border)", paddingBlock: 24 }}>
        <div className="container">
          <div style={{ display: "flex", alignItems: "center", maxWidth: 600, margin: "0 auto" }}>
            {STEPS.map((label, i) => (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, position: "relative" }}>
                {/* connector line */}
                {i < STEPS.length - 1 && (
                  <div style={{ position: "absolute", top: 20, left: "50%", right: "-50%", height: 2, background: i < step ? "var(--amber)" : "var(--border)", zIndex: 0 }} />
                )}
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: i < step ? "var(--navy)" : i === step ? "var(--amber)" : "var(--surface-2)", border: `2px solid ${i <= step ? (i === step ? "var(--amber)" : "var(--navy)") : "var(--border)"}`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "0.875rem", color: i <= step ? "white" : "var(--text-muted)", zIndex: 1, transition: "all 220ms ease" }}>
                  {i < step ? "✓" : i + 1}
                </div>
                <div style={{ fontSize: "0.72rem", fontWeight: 600, color: i === step ? "var(--navy)" : "var(--text-muted)", letterSpacing: "0.04em", whiteSpace: "nowrap" }}>
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="container" style={{ paddingBlock: 48 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 40, alignItems: "start" }}>

          {/* Main form panel */}
          <div style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 16, overflow: "hidden", boxShadow: "var(--shadow-sm)" }}>
            <div style={{ padding: "24px 28px", borderBottom: "1px solid var(--border)", background: "var(--surface)" }}>
              <h2 style={{ fontFamily: "var(--font-space-grotesk, sans-serif)", fontWeight: 700, fontSize: "1.1rem", color: "var(--text)", margin: 0 }}>
                Step {step + 1}: {STEPS[step]}
              </h2>
            </div>

            <div style={{ padding: "28px" }}>
              {/* ── Step 0: Your Info ── */}
              {step === 0 && (
                <div style={{ display: "grid", gap: 20 }}>
                  <div>
                    <label style={labelStyle}>Full Name *</label>
                    <input style={inputStyle} placeholder="e.g. Grace Wanjiku" value={form.name} onChange={set("name")} />
                    {errors.name && <div style={errorStyle}>{errors.name}</div>}
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    <div>
                      <label style={labelStyle}>Phone Number *</label>
                      <input style={inputStyle} placeholder="+254 7XX XXX XXX" value={form.phone} onChange={set("phone")} />
                      {errors.phone && <div style={errorStyle}>{errors.phone}</div>}
                    </div>
                    <div>
                      <label style={labelStyle}>Email Address *</label>
                      <input style={inputStyle} type="email" placeholder="you@example.com" value={form.email} onChange={set("email")} />
                      {errors.email && <div style={errorStyle}>{errors.email}</div>}
                    </div>
                  </div>
                </div>
              )}

              {/* ── Step 1: Vehicle ── */}
              {step === 1 && (
                <div style={{ display: "grid", gap: 20 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    <div>
                      <label style={labelStyle}>Vehicle Make *</label>
                      <select style={{ ...inputStyle, appearance: "none" }} value={form.make} onChange={set("make")}>
                        <option value="">Select make…</option>
                        {MAKES.map(m => <option key={m}>{m}</option>)}
                      </select>
                      {errors.make && <div style={errorStyle}>{errors.make}</div>}
                    </div>
                    <div>
                      <label style={labelStyle}>Model *</label>
                      <input style={inputStyle} placeholder="e.g. Corolla, Forester" value={form.model} onChange={set("model")} />
                      {errors.model && <div style={errorStyle}>{errors.model}</div>}
                    </div>
                    <div>
                      <label style={labelStyle}>Year *</label>
                      <input style={inputStyle} placeholder="e.g. 2019" type="number" min="1990" max="2026" value={form.year} onChange={set("year")} />
                      {errors.year && <div style={errorStyle}>{errors.year}</div>}
                    </div>
                    <div>
                      <label style={labelStyle}>License Plate *</label>
                      <input style={inputStyle} placeholder="e.g. KDC 482Q" value={form.licensePlate} onChange={set("licensePlate")} />
                      {errors.licensePlate && <div style={errorStyle}>{errors.licensePlate}</div>}
                    </div>
                  </div>
                </div>
              )}

              {/* ── Step 2: Service & Time ── */}
              {step === 2 && (
                <div style={{ display: "grid", gap: 24 }}>
                  <div>
                    <label style={labelStyle}>Select Service *</label>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                      {services.map(s => (
                        <button key={s.id} onClick={() => { setForm(f => ({ ...f, serviceId: s.id })); setErrors(e => ({ ...e, serviceId: undefined })); }}
                          style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", border: `1.5px solid ${form.serviceId === s.id ? "var(--amber)" : "var(--border)"}`, borderRadius: 10, background: form.serviceId === s.id ? "rgba(232,112,10,0.06)" : "var(--bg)", cursor: "pointer", textAlign: "left", transition: "all 180ms ease" }}>
                          <span style={{ color: "var(--amber)", flexShrink: 0 }}>{SERVICE_ICON_MAP[s.id] || <SvcDefaultIcon />}</span>
                          <div>
                            <div style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--text)" }}>{s.title}</div>
                            <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>{s.priceRange}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                    {errors.serviceId && <div style={errorStyle}>{errors.serviceId}</div>}
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    <div>
                      <label style={labelStyle}>Preferred Date *</label>
                      <input style={inputStyle} type="date" min={today} value={form.date} onChange={set("date")} />
                      {errors.date && <div style={errorStyle}>{errors.date}</div>}
                    </div>
                    <div>
                      <label style={labelStyle}>Preferred Time *</label>
                      <select style={{ ...inputStyle, appearance: "none" }} value={form.time} onChange={set("time")}>
                        <option value="">Select time…</option>
                        {TIMES.map(t => <option key={t}>{t}</option>)}
                      </select>
                      {errors.time && <div style={errorStyle}>{errors.time}</div>}
                    </div>
                  </div>

                  <div>
                    <label style={labelStyle}>Additional Notes (optional)</label>
                    <textarea style={{ ...inputStyle, height: 96, paddingBlock: 12, resize: "vertical" }} placeholder="Describe any symptoms, special requests, or things we should know…" value={form.notes} onChange={set("notes")} />
                  </div>
                </div>
              )}

              {/* ── Step 3: Confirm ── */}
              {step === 3 && (
                <div style={{ display: "grid", gap: 16 }}>
                  <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, margin: 0 }}>
                    Please review your booking details below before confirming.
                  </p>
                  {[
                    { label: "Name", value: form.name },
                    { label: "Contact", value: `${form.phone}  ·  ${form.email}` },
                    { label: "Vehicle", value: `${form.year} ${form.make} ${form.model} — ${form.licensePlate}` },
                    { label: "Service", value: selectedService ? (
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                          <span style={{ color: "var(--amber)" }}>{SERVICE_ICON_MAP[selectedService.id] || <SvcDefaultIcon />}</span>
                          {selectedService.title} ({selectedService.priceRange})
                        </span>
                      ) : "—" },
                    { label: "Date & Time", value: `${form.date}  at  ${form.time}` },
                    ...(form.notes ? [{ label: "Notes", value: form.notes }] : []),
                  ].map((row, i) => (
                    <div key={i} style={{ display: "flex", gap: 16, paddingBlock: 12, borderBottom: "1px solid var(--border)" }}>
                      <div style={{ width: 110, flexShrink: 0, fontSize: "0.8rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", paddingTop: 1 }}>{row.label}</div>
                      <div style={{ fontSize: "0.9375rem", color: "var(--text)", lineHeight: 1.5 }}>{row.value}</div>
                    </div>
                  ))}

                  <div style={{ marginTop: 4, padding: 16, background: "rgba(5,150,105,0.06)", border: "1px solid rgba(5,150,105,0.2)", borderRadius: 10 }}>
                    <div style={{ fontSize: "0.875rem", color: "#059669", fontWeight: 600, lineHeight: 1.6 }}>
                      ✓ By confirming, you agree to our service terms. You'll receive a confirmation SMS & email.
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Navigation */}
            <div style={{ padding: "20px 28px", borderTop: "1px solid var(--border)", display: "flex", justifyContent: "space-between", gap: 12 }}>
              {step > 0 ? (
                <button onClick={back} style={{ height: 48, paddingInline: 24, border: "1.5px solid var(--border)", background: "transparent", color: "var(--text-secondary)", borderRadius: 8, fontWeight: 600, cursor: "pointer", fontSize: "0.9rem" }}>
                  ← Back
                </button>
              ) : <div />}
              {step === 3 && submitError && (
                <div style={{ padding: "12px 16px", background: "rgba(220,38,38,0.06)", border: "1px solid rgba(220,38,38,0.2)", borderRadius: 8, fontSize: "0.85rem", color: "#DC2626", marginBottom: 8 }}>
                  {submitError}
                </div>
              )}
              {step < 3 ? (
                <button onClick={next} style={{ display: "flex", alignItems: "center", gap: 8, height: 48, paddingInline: 28, background: "var(--amber)", color: "white", border: "none", borderRadius: 8, fontWeight: 700, cursor: "pointer", fontSize: "0.9rem" }}>
                  Continue <ArrowRight />
                </button>
              ) : (
                <button onClick={submit} disabled={submitting} style={{ display: "flex", alignItems: "center", gap: 8, height: 48, paddingInline: 28, background: "#059669", color: "white", border: "none", borderRadius: 8, fontWeight: 700, cursor: submitting ? "not-allowed" : "pointer", opacity: submitting ? 0.7 : 1, fontSize: "0.9rem" }}>
                  {submitting ? "Confirming…" : "Confirm Booking ✓"}
                </button>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16, position: "sticky", top: 90 }}>
            {/* Selected service */}
            {selectedService ? (
              <div style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 12, padding: 20, boxShadow: "var(--shadow-sm)" }}>
                <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--amber)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>Selected Service</div>
                <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
                  <div style={{ width: 44, height: 44, background: "rgba(232,112,10,0.08)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--amber)" }}>
                    {SERVICE_ICON_MAP[selectedService.id] || <SvcDefaultIcon />}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, color: "var(--text)", fontSize: "0.95rem" }}>{selectedService.title}</div>
                    <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>{selectedService.category}</div>
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <div style={{ background: "var(--surface)", borderRadius: 8, padding: "10px 12px" }}>
                    <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: 600, marginBottom: 2 }}>DURATION</div>
                    <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text)" }}>{selectedService.duration}</div>
                  </div>
                  <div style={{ background: "var(--surface)", borderRadius: 8, padding: "10px 12px" }}>
                    <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: 600, marginBottom: 2 }}>PRICE</div>
                    <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--navy)" }}>{selectedService.priceRange}</div>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ background: "var(--surface)", border: "1.5px dashed var(--border)", borderRadius: 12, padding: 20, textAlign: "center" }}>
                <div style={{ display: "flex", justifyContent: "center", marginBottom: 8, color: "var(--text-muted)" }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />
                  </svg>
                </div>
                <div style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>Select a service in Step 3</div>
              </div>
            )}

            {/* Contact */}
            <div style={{ background: "var(--navy)", borderRadius: 12, padding: 20, color: "white" }}>
              <div style={{ fontWeight: 700, fontSize: "0.9rem", marginBottom: 6 }}>Need help booking?</div>
              <div style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.65)", lineHeight: 1.6, marginBottom: 14 }}>
                Call us and we'll set up your appointment over the phone.
              </div>
              <a href="tel:+254743645366" style={{ display: "flex", alignItems: "center", gap: 8, height: 40, paddingInline: 16, background: "rgba(255,255,255,0.1)", color: "white", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 8, fontSize: "0.875rem", fontWeight: 600, textDecoration: "none" }}>
                0743 645 366
              </a>
            </div>

            {/* Hours */}
            <div style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 12, padding: 20, boxShadow: "var(--shadow-sm)" }}>
              <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>Workshop Hours</div>
              {[
                { d: "Mon – Fri", h: "8:00 AM – 6:00 PM" },
                { d: "Saturday", h: "9:00 AM – 4:00 PM" },
                { d: "Sunday", h: "Emergency only" },
              ].map((r, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", paddingBlock: 8, borderTop: i > 0 ? "1px solid var(--border)" : "none", fontSize: "0.85rem" }}>
                  <span style={{ color: "var(--text-secondary)" }}>{r.d}</span>
                  <span style={{ fontWeight: 600, color: "var(--text)" }}>{r.h}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .container > div[style*="grid-template-columns: 1fr 340px"] {
            grid-template-columns: 1fr !important;
          }
          div[style*="position: sticky"][style*="top: 90"] { position: static !important; }
        }
        @media (max-width: 640px) {
          div[style*="grid-template-columns: 1fr 1fr"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
