"use client";

import { useState } from "react";
import Link from "next/link";
import { services, reviews, businessHours } from "../lib/businessData";

function ArrowRight() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
    </svg>
  );
}
function StarFill({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}
function ClockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

const SERVICE_ICONS: Record<string, string> = {
  "engine-diagnostics": "🔍",
  "oil-change": "🛢️",
  "brake-repair": "🔧",
  "wheel-alignment": "⚙️",
  "battery-replacement": "🔋",
  "car-detailing": "✨",
  "tire-replacement": "🔄",
};

const ALL_CATS = ["All", ...Array.from(new Set(services.map(s => s.category)))];

export default function Services() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [hovered, setHovered] = useState<string | null>(null);

  const filtered = activeCategory === "All" ? services : services.filter(s => s.category === activeCategory);

  return (
    <div style={{ background: "var(--bg)", color: "var(--text)", minHeight: "100vh" }}>

      {/* Hero */}
      <div style={{ background: "var(--navy)", color: "white", paddingBlock: 64 }}>
        <div className="container">
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.78rem", color: "rgba(255,255,255,0.5)", marginBottom: 12 }}>
            <Link href="/" style={{ color: "inherit", textDecoration: "none" }}>Home</Link>
            <span>›</span>
            <span style={{ color: "rgba(255,255,255,0.9)" }}>Services</span>
          </div>
          <div style={{ maxWidth: 640 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(232,112,10,0.15)", border: "1px solid rgba(232,112,10,0.3)", borderRadius: 20, padding: "5px 14px", marginBottom: 20, fontSize: "0.72rem", fontWeight: 700, color: "#E8700A", letterSpacing: "0.1em", textTransform: "uppercase" }}>
              Workshop Services
            </div>
            <h1 style={{ fontFamily: "var(--font-space-grotesk, sans-serif)", fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 700, color: "white", margin: "0 0 16px", lineHeight: 1.05, letterSpacing: "-0.025em" }}>
              Expert Care for Every Vehicle
            </h1>
            <p style={{ color: "rgba(255,255,255,0.68)", lineHeight: 1.75, fontSize: "1.05rem", margin: "0 0 28px" }}>
              From routine maintenance to complex repairs — our KEBS-certified technicians handle it all with precision, transparency, and guaranteed quality.
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Link href="/appointments" style={{ display: "inline-flex", alignItems: "center", gap: 8, height: 48, paddingInline: 24, background: "#E8700A", color: "white", borderRadius: 8, fontSize: "0.9rem", fontWeight: 700, textDecoration: "none" }}>
                Book a Service <ArrowRight />
              </Link>
              <a href="tel:+254700123456" style={{ display: "inline-flex", alignItems: "center", gap: 8, height: 48, paddingInline: 24, background: "rgba(255,255,255,0.1)", color: "white", border: "1.5px solid rgba(255,255,255,0.25)", borderRadius: 8, fontSize: "0.9rem", fontWeight: 600, textDecoration: "none" }}>
                Call +254 700 123 456
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div style={{ background: "var(--surface)", borderBottom: "1px solid var(--border)", paddingBlock: 24 }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 0 }}>
            {[
              { n: "7", label: "Services Offered" },
              { n: "30 min", label: "Fastest Turnaround" },
              { n: "98%", label: "Customer Satisfaction" },
              { n: "Free", label: "30-day Repair Warranty" },
            ].map((s, i) => (
              <div key={i} style={{ textAlign: "center", padding: "16px 12px", borderRight: i < 3 ? "1px solid var(--border)" : "none" }}>
                <div style={{ fontFamily: "var(--font-space-grotesk, sans-serif)", fontSize: "1.6rem", fontWeight: 700, color: "var(--navy)", lineHeight: 1 }}>{s.n}</div>
                <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Services grid */}
      <section style={{ paddingBlock: 64 }}>
        <div className="container">
          {/* Category filter */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 40 }}>
            {ALL_CATS.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                style={{ height: 38, paddingInline: 18, borderRadius: 8, border: `1.5px solid ${activeCategory === cat ? "var(--navy)" : "var(--border)"}`, background: activeCategory === cat ? "var(--navy)" : "transparent", color: activeCategory === cat ? "white" : "var(--text-secondary)", fontSize: "0.875rem", fontWeight: 600, cursor: "pointer", transition: "all 180ms ease" }}>
                {cat}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>
            {filtered.map(service => (
              <div key={service.id}
                onMouseEnter={() => setHovered(service.id)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  background: "var(--bg)", border: `1px solid ${hovered === service.id ? "var(--amber)" : "var(--border)"}`,
                  borderRadius: 12, padding: 28, display: "flex", flexDirection: "column", gap: 14,
                  boxShadow: hovered === service.id ? "var(--shadow-lg)" : "var(--shadow-sm)",
                  transform: hovered === service.id ? "translateY(-3px)" : "none",
                  transition: "all 220ms ease",
                }}
              >
                {/* Icon + category */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ width: 52, height: 52, background: "rgba(232,112,10,0.08)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem" }}>
                    {SERVICE_ICONS[service.id] || "🔧"}
                  </div>
                  <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--amber)", background: "rgba(232,112,10,0.08)", border: "1px solid rgba(232,112,10,0.2)", padding: "3px 10px", borderRadius: 20, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                    {service.category}
                  </span>
                </div>

                {/* Title + desc */}
                <div>
                  <h3 style={{ fontFamily: "var(--font-space-grotesk, sans-serif)", fontWeight: 700, fontSize: "1.05rem", color: "var(--text)", margin: "0 0 8px" }}>{service.title}</h3>
                  <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", margin: 0, lineHeight: 1.65 }}>{service.description}</p>
                </div>

                {/* Meta */}
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: "auto" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: "0.78rem", color: "var(--text-muted)", background: "var(--surface)", padding: "4px 10px", borderRadius: 6, fontWeight: 500 }}>
                    <ClockIcon /> {service.duration}
                  </div>
                  <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--navy)", background: "rgba(15,42,74,0.06)", padding: "4px 10px", borderRadius: 6 }}>
                    {service.priceRange}
                  </div>
                </div>

                {/* CTA */}
                <Link href={`/appointments?service=${service.id}`}
                  style={{ display: "flex", alignItems: "center", gap: 6, paddingTop: 14, borderTop: "1px solid var(--border)", color: hovered === service.id ? "var(--amber)" : "var(--navy)", fontWeight: 700, fontSize: "0.875rem", textDecoration: "none", transition: "color 180ms ease" }}>
                  Book This Service <ArrowRight />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section style={{ background: "var(--navy)", paddingBlock: 72 }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--amber)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>Simple Process</div>
            <h2 style={{ fontFamily: "var(--font-space-grotesk, sans-serif)", fontSize: "clamp(1.6rem, 3vw, 2.4rem)", fontWeight: 700, color: "white", margin: 0, letterSpacing: "-0.02em" }}>
              How It Works
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 32 }}>
            {[
              { step: "01", title: "Book Online", body: "Choose your service and preferred date & time through our simple booking form." },
              { step: "02", title: "Drop Off", body: "Bring your vehicle to our Industrial Area workshop in Nairobi. We'll verify everything." },
              { step: "03", title: "We Work", body: "Our certified technicians perform the service with OEM-grade parts and precision tools." },
              { step: "04", title: "Collect", body: "We notify you when ready. Pick up your vehicle with a full digital service report." },
            ].map((s, i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "var(--font-space-grotesk, sans-serif)", fontSize: "2.5rem", fontWeight: 700, color: "var(--amber)", lineHeight: 1, marginBottom: 12 }}>{s.step}</div>
                <h3 style={{ fontFamily: "var(--font-space-grotesk, sans-serif)", fontWeight: 700, fontSize: "1.05rem", color: "white", marginBottom: 10 }}>{s.title}</h3>
                <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.6)", lineHeight: 1.65, margin: 0 }}>{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section style={{ paddingBlock: 72, background: "var(--surface)", borderTop: "1px solid var(--border)" }}>
        <div className="container">
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 40, flexWrap: "wrap", gap: 16 }}>
            <div>
              <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--amber)", letterSpacing: "0.1em", textTransform: "uppercase", display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <div style={{ width: 20, height: 2, background: "var(--amber)", borderRadius: 2 }} /> Customer Reviews
              </div>
              <h2 style={{ fontFamily: "var(--font-space-grotesk, sans-serif)", fontSize: "clamp(1.6rem, 3vw, 2.2rem)", fontWeight: 700, color: "var(--text)", margin: 0, letterSpacing: "-0.02em" }}>
                What Our Customers Say
              </h2>
            </div>
            <div style={{ display: "flex", gap: 4, color: "#FBBF24", alignItems: "center" }}>
              {[1,2,3,4,5].map(s => <StarFill key={s} size={18} />)}
              <span style={{ fontWeight: 700, fontSize: "1.1rem", color: "var(--text)", marginLeft: 8 }}>4.9 / 5.0</span>
              <span style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginLeft: 6 }}>based on 240+ reviews</span>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {reviews.map(r => {
              const initials = r.name.split(" ").map(n => n[0]).join("").slice(0,2).toUpperCase();
              const avatarColors = ["#0F2A4A","#E8700A","#059669"];
              const bg = avatarColors[r.name.charCodeAt(0) % avatarColors.length];
              return (
                <div key={r.id} style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 12, padding: 24, display: "flex", flexDirection: "column", gap: 14, boxShadow: "var(--shadow-sm)" }}>
                  <div style={{ display: "flex", gap: 2, color: "#FBBF24" }}>{Array.from({length:r.rating}).map((_,i) => <StarFill key={i} />)}</div>
                  <p style={{ fontSize: "0.9375rem", lineHeight: 1.7, color: "var(--text)", margin: 0, fontStyle: "italic" }}>"{r.comment}"</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: "auto", paddingTop: 12, borderTop: "1px solid var(--border)" }}>
                    <div style={{ width: 40, height: 40, borderRadius: "50%", background: bg, color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "0.9rem", flexShrink: 0 }}>{initials}</div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--text)" }}>{r.name}</div>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{r.vehicle} Owner</div>
                    </div>
                    <div style={{ marginLeft: "auto", fontSize: "0.65rem", fontWeight: 700, color: "#059669", background: "rgba(5,150,105,0.08)", border: "1px solid rgba(5,150,105,0.2)", padding: "2px 8px", borderRadius: 20 }}>VERIFIED</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section style={{ paddingBlock: 64, background: "var(--bg)", borderTop: "1px solid var(--border)" }}>
        <div className="container" style={{ textAlign: "center" }}>
          <h2 style={{ fontFamily: "var(--font-space-grotesk, sans-serif)", fontSize: "clamp(1.6rem, 3vw, 2.4rem)", fontWeight: 700, color: "var(--text)", marginBottom: 12, letterSpacing: "-0.02em" }}>
            Ready to Book Your Service?
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "1rem", lineHeight: 1.7, marginBottom: 28, maxWidth: 480, marginInline: "auto" }}>
            Most appointments confirmed within 2 hours. Same-day slots are often available.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/appointments" style={{ display: "inline-flex", alignItems: "center", gap: 8, height: 52, paddingInline: 28, background: "var(--amber)", color: "white", borderRadius: 10, fontSize: "0.9375rem", fontWeight: 700, textDecoration: "none" }}>
              Book Now <ArrowRight />
            </Link>
            <Link href="/contact" style={{ display: "inline-flex", alignItems: "center", gap: 8, height: 52, paddingInline: 28, border: "1.5px solid var(--border)", color: "var(--text-secondary)", borderRadius: 10, fontSize: "0.9375rem", fontWeight: 600, textDecoration: "none" }}>
              Ask a Question
            </Link>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 768px) {
          .container > div[style*="grid-template-columns: repeat(4"] { grid-template-columns: repeat(2, 1fr) !important; }
          .container > div[style*="grid-template-columns: repeat(3"] { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 640px) {
          .container > div[style*="grid-template-columns: repeat(4"] { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </div>
  );
}
