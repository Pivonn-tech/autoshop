"use client";

import { useState } from "react";
import Link from "next/link";
import { businessHours } from "../lib/businessData";

function ArrowRight() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
    </svg>
  );
}
function CheckCircle() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><polyline points="9 12 11 14 15 10" />
    </svg>
  );
}

interface ContactForm {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export default function Contact() {
  const [form, setForm] = useState<ContactForm>({ name: "", email: "", phone: "", subject: "", message: "" });
  const [errors, setErrors] = useState<Partial<ContactForm>>({});
  const [submitted, setSubmitted] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);

  const set = (key: keyof ContactForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(f => ({ ...f, [key]: e.target.value }));
    setErrors(er => ({ ...er, [key]: undefined }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Partial<ContactForm> = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.email.trim() || !form.email.includes("@")) errs.email = "Valid email required";
    if (!form.message.trim() || form.message.length < 10) errs.message = "Please write at least 10 characters";
    setErrors(errs);
    if (Object.keys(errs).length === 0) setSubmitted(true);
  };

  const inputBase: React.CSSProperties = {
    width: "100%", height: 48, paddingInline: 14,
    background: "var(--bg)", borderRadius: 8,
    color: "var(--text)", fontSize: "0.9375rem", outline: "none",
    fontFamily: "inherit", transition: "border-color 180ms ease, box-shadow 180ms ease",
  };
  const getInputStyle = (field: string, extra?: React.CSSProperties): React.CSSProperties => ({
    ...inputBase,
    border: `1.5px solid ${errors[field as keyof ContactForm] ? "#DC2626" : focused === field ? "var(--navy)" : "var(--border)"}`,
    boxShadow: focused === field ? "0 0 0 3px rgba(15,42,74,0.1)" : "none",
    ...extra,
  });

  const contactCards = [
    { icon: "📞", title: "Call Us", value: "+254 700 123 456", sub: "Mon–Fri, 8AM – 6PM", href: "tel:+254700123456", hoverColor: "#059669" },
    { icon: "📧", title: "Email Us", value: "service@autofixkenya.co.ke", sub: "Response within 2 hours", href: "mailto:service@autofixkenya.co.ke", hoverColor: "#0369A1" },
    { icon: "💬", title: "WhatsApp", value: "+254 700 123 456", sub: "Chat with us instantly", href: "https://wa.me/254700123456", hoverColor: "#059669" },
    { icon: "📍", title: "Visit Us", value: "Industrial Area, Nairobi", sub: "Near the KRA offices", href: "#map", hoverColor: "#E8700A" },
  ];

  return (
    <div style={{ background: "var(--bg)", color: "var(--text)", minHeight: "100vh" }}>

      {/* Hero */}
      <div style={{ background: "var(--navy)", paddingBlock: 56 }}>
        <div className="container">
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.78rem", color: "rgba(255,255,255,0.5)", marginBottom: 12 }}>
            <Link href="/" style={{ color: "inherit", textDecoration: "none" }}>Home</Link>
            <span>›</span>
            <span style={{ color: "rgba(255,255,255,0.9)" }}>Contact Us</span>
          </div>
          <h1 style={{ fontFamily: "var(--font-space-grotesk, sans-serif)", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 700, color: "white", margin: "0 0 12px", letterSpacing: "-0.025em" }}>
            Get In Touch
          </h1>
          <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "1rem", lineHeight: 1.7, maxWidth: 520, margin: 0 }}>
            Have a question, need a quote, or want to book a service? We're here for you — reach out any way that works best.
          </p>
        </div>
      </div>

      {/* Contact cards */}
      <div style={{ background: "var(--surface)", borderBottom: "1px solid var(--border)", paddingBlock: 40 }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
            {contactCards.map((card, i) => (
              <a key={i} href={card.href}
                style={{ textDecoration: "none" }}
                onMouseEnter={e => { (e.currentTarget.firstChild as HTMLElement).style.borderColor = card.hoverColor; (e.currentTarget.firstChild as HTMLElement).style.transform = "translateY(-3px)"; (e.currentTarget.firstChild as HTMLElement).style.boxShadow = "var(--shadow-lg)"; }}
                onMouseLeave={e => { (e.currentTarget.firstChild as HTMLElement).style.borderColor = "var(--border)"; (e.currentTarget.firstChild as HTMLElement).style.transform = "none"; (e.currentTarget.firstChild as HTMLElement).style.boxShadow = "var(--shadow-sm)"; }}
              >
                <div style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 12, padding: 24, textAlign: "center", transition: "all 220ms ease", boxShadow: "var(--shadow-sm)", cursor: "pointer" }}>
                  <div style={{ fontSize: "1.8rem", marginBottom: 12 }}>{card.icon}</div>
                  <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>{card.title}</div>
                  <div style={{ fontFamily: "var(--font-space-grotesk, sans-serif)", fontWeight: 700, fontSize: "0.9rem", color: "var(--text)", marginBottom: 4, wordBreak: "break-all" }}>{card.value}</div>
                  <div style={{ fontSize: "0.775rem", color: "var(--text-muted)" }}>{card.sub}</div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Form + Sidebar */}
      <section style={{ paddingBlock: 64 }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 48, alignItems: "start" }}>

            {/* ── Contact form ── */}
            {submitted ? (
              <div style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 16, padding: 48, textAlign: "center", boxShadow: "var(--shadow-sm)" }}>
                <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}><CheckCircle /></div>
                <h2 style={{ fontFamily: "var(--font-space-grotesk, sans-serif)", fontWeight: 700, fontSize: "1.6rem", color: "var(--text)", marginBottom: 10 }}>
                  Message Sent!
                </h2>
                <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, maxWidth: 400, margin: "0 auto 24px" }}>
                  Thank you, <strong>{form.name}</strong>. We received your message and will get back to you at <strong>{form.email}</strong> within 2 hours during business hours.
                </p>
                <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                  <Link href="/appointments" style={{ display: "inline-flex", alignItems: "center", gap: 8, height: 48, paddingInline: 24, background: "var(--amber)", color: "white", borderRadius: 8, fontWeight: 700, textDecoration: "none", fontSize: "0.9rem" }}>
                    Book a Service <ArrowRight />
                  </Link>
                  <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 8, height: 48, paddingInline: 24, border: "1.5px solid var(--border)", color: "var(--text-secondary)", borderRadius: 8, fontWeight: 600, textDecoration: "none", fontSize: "0.9rem" }}>
                    Back to Home
                  </Link>
                </div>
              </div>
            ) : (
              <div style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 16, overflow: "hidden", boxShadow: "var(--shadow-sm)" }}>
                <div style={{ padding: "24px 28px", background: "var(--surface)", borderBottom: "1px solid var(--border)" }}>
                  <h2 style={{ fontFamily: "var(--font-space-grotesk, sans-serif)", fontWeight: 700, fontSize: "1.2rem", color: "var(--text)", margin: 0 }}>
                    Send Us a Message
                  </h2>
                  <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", margin: "6px 0 0" }}>
                    We'll respond within 2 hours during business hours.
                  </p>
                </div>

                <form onSubmit={handleSubmit} style={{ padding: 28, display: "grid", gap: 20 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, color: "var(--text)", marginBottom: 6 }}>Full Name *</label>
                      <input style={getInputStyle("name")} placeholder="Grace Wanjiku" value={form.name} onChange={set("name")} onFocus={() => setFocused("name")} onBlur={() => setFocused(null)} />
                      {errors.name && <div style={{ fontSize: "0.78rem", color: "#DC2626", marginTop: 4 }}>{errors.name}</div>}
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, color: "var(--text)", marginBottom: 6 }}>Email Address *</label>
                      <input type="email" style={getInputStyle("email")} placeholder="you@example.com" value={form.email} onChange={set("email")} onFocus={() => setFocused("email")} onBlur={() => setFocused(null)} />
                      {errors.email && <div style={{ fontSize: "0.78rem", color: "#DC2626", marginTop: 4 }}>{errors.email}</div>}
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, color: "var(--text)", marginBottom: 6 }}>Phone (optional)</label>
                      <input style={getInputStyle("phone")} placeholder="+254 7XX XXX XXX" value={form.phone} onChange={set("phone")} onFocus={() => setFocused("phone")} onBlur={() => setFocused(null)} />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, color: "var(--text)", marginBottom: 6 }}>Subject</label>
                      <select style={getInputStyle("subject", { appearance: "none" })} value={form.subject} onChange={set("subject")} onFocus={() => setFocused("subject")} onBlur={() => setFocused(null)}>
                        <option value="">Select a topic…</option>
                        <option>General Enquiry</option>
                        <option>Service Booking</option>
                        <option>Parts Request</option>
                        <option>Vehicle Purchase</option>
                        <option>Complaint or Feedback</option>
                        <option>Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, color: "var(--text)", marginBottom: 6 }}>Your Message *</label>
                    <textarea
                      style={{
                        ...getInputStyle("message", { height: 140, paddingBlock: 14, resize: "vertical" }),
                        height: 140,
                      }}
                      placeholder="Tell us how we can help you…"
                      value={form.message}
                      onChange={set("message")}
                      onFocus={() => setFocused("message")}
                      onBlur={() => setFocused(null)}
                    />
                    {errors.message && <div style={{ fontSize: "0.78rem", color: "#DC2626", marginTop: 4 }}>{errors.message}</div>}
                  </div>

                  <button type="submit"
                    style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, height: 52, background: "var(--amber)", color: "white", border: "none", borderRadius: 10, fontSize: "0.9375rem", fontWeight: 700, cursor: "pointer", transition: "background 180ms ease" }}
                    onMouseEnter={e => (e.currentTarget.style.background = "#f07b1a")}
                    onMouseLeave={e => (e.currentTarget.style.background = "var(--amber)")}>
                    Send Message <ArrowRight />
                  </button>
                </form>
              </div>
            )}

            {/* ── Sidebar ── */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16, position: "sticky", top: 90 }}>
              {/* Business hours */}
              <div style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 12, padding: 24, boxShadow: "var(--shadow-sm)" }}>
                <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--amber)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>Business Hours</div>
                {businessHours.map((h, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", paddingBlock: 10, borderBottom: i < businessHours.length - 1 ? "1px solid var(--border)" : "none", fontSize: "0.875rem" }}>
                    <span style={{ color: "var(--text-secondary)" }}>{h.day}</span>
                    <span style={{ fontWeight: 600, color: "var(--text)" }}>{h.hours}</span>
                  </div>
                ))}
              </div>

              {/* Address */}
              <div style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 12, padding: 24, boxShadow: "var(--shadow-sm)" }}>
                <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--amber)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 14 }}>Our Location</div>
                <div style={{ fontSize: "0.9375rem", fontWeight: 600, color: "var(--text)", marginBottom: 4 }}>AutoFix Kenya Workshop</div>
                <div style={{ fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.65 }}>
                  Industrial Area, Nairobi<br />
                  Near KRA offices, off Enterprise Road<br />
                  Nairobi, Kenya
                </div>
                <div id="map" style={{ marginTop: 16, background: "linear-gradient(135deg, #0F2A4A 0%, #1a3a5c 100%)", borderRadius: 10, padding: 24, textAlign: "center", minHeight: 120, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  <div style={{ fontSize: "1.8rem" }}>📍</div>
                  <div style={{ fontWeight: 700, color: "white", fontSize: "0.9rem" }}>AutoFix Kenya</div>
                  <div style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.6)" }}>Industrial Area, Nairobi</div>
                  <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer"
                    style={{ marginTop: 8, display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 14px", background: "var(--amber)", color: "white", borderRadius: 6, fontSize: "0.78rem", fontWeight: 700, textDecoration: "none" }}>
                    Open in Maps <ArrowRight />
                  </a>
                </div>
              </div>

              {/* Quick CTA */}
              <div style={{ background: "var(--navy)", borderRadius: 12, padding: 20 }}>
                <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "white", marginBottom: 8 }}>Ready to book?</div>
                <div style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.65)", lineHeight: 1.6, marginBottom: 14 }}>
                  Skip the message — book your service appointment right now.
                </div>
                <Link href="/appointments" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, height: 44, background: "var(--amber)", color: "white", borderRadius: 8, fontWeight: 700, textDecoration: "none", fontSize: "0.875rem" }}>
                  Book Appointment <ArrowRight />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ strip */}
      <section style={{ background: "var(--surface)", borderTop: "1px solid var(--border)", paddingBlock: 56 }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <h2 style={{ fontFamily: "var(--font-space-grotesk, sans-serif)", fontWeight: 700, fontSize: "clamp(1.4rem, 3vw, 2rem)", color: "var(--text)", margin: 0, letterSpacing: "-0.02em" }}>
              Frequently Asked Questions
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 20, maxWidth: 900, margin: "0 auto" }}>
            {[
              { q: "Do I need an appointment?", a: "Walk-ins are welcome, but booking ensures you get your preferred time slot and reduces waiting." },
              { q: "How long does a service take?", a: "It varies by service. An oil change takes 30–45 mins; a full brake repair 1.5–3 hours. We'll give you an ETA at drop-off." },
              { q: "Do you use genuine parts?", a: "Yes. We use OEM and certified-quality aftermarket parts only. All parts come with a warranty and documentation." },
              { q: "Is there a warranty on repairs?", a: "All repairs come with a 30-day or 1,000 km warranty (whichever comes first), at no extra cost." },
            ].map((faq, i) => (
              <div key={i} style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 12, padding: 24, boxShadow: "var(--shadow-sm)" }}>
                <div style={{ fontWeight: 700, fontSize: "0.9375rem", color: "var(--text)", marginBottom: 8 }}>Q: {faq.q}</div>
                <div style={{ fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.65 }}>{faq.a}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 900px) {
          .container > div[style*="grid-template-columns: 1fr 360px"] { grid-template-columns: 1fr !important; }
          .container > div[style*="grid-template-columns: repeat(4, 1fr)"] { grid-template-columns: repeat(2, 1fr) !important; }
          .container > div[style*="grid-template-columns: repeat(2, 1fr)"] { grid-template-columns: 1fr !important; }
          div[style*="position: sticky"][style*="top: 90"] { position: static !important; }
        }
        @media (max-width: 640px) {
          .container > div[style*="grid-template-columns: repeat(4, 1fr)"] { grid-template-columns: 1fr 1fr !important; }
          div[style*="gridTemplateColumns: 1fr 1fr"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
