"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { services, reviews } from "../lib/businessData";
import { getProductCardImage } from "../lib/productImages";

interface Product {
  id: number;
  name: string;
  description: string;
  category: string;
  price: number;
  currency: string;
  stock: number;
}

// ── icons ──────────────────────────────────────────────────────────────────────
function ArrowRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
    </svg>
  );
}
function StarFill() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}
function CheckCircle() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><polyline points="9 12 11 14 15 10" />
    </svg>
  );
}
function PhoneIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 014.1 13.88 19.79 19.79 0 011.03 5.25 2 2 0 013 3h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L7.09 10.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
    </svg>
  );
}
function MailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );
}
function MapPinIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
    </svg>
  );
}

// ── Search Widget ──────────────────────────────────────────────────────────────
const VEHICLE_MAKES = ["Any Make", "Toyota", "Subaru", "Mitsubishi", "Isuzu", "Nissan", "Honda", "Ford", "Mazda"];
const PART_CATS = ["All Categories", "Braking", "Engine", "Suspension", "Electrical", "Body"];
const SVC_CATS = ["All Services", "Diagnostics", "Maintenance", "Safety", "Tires", "Electrical", "Care"];
const PRICE_RANGES = ["Any Price", "Under KSh 10k", "KSh 10k – 50k", "KSh 50k – 200k", "KSh 200k – 500k", "Over KSh 500k"];

function SearchWidget() {
  const [tab, setTab] = useState<"vehicles" | "parts" | "services">("vehicles");
  const [col1, setCol1] = useState("");
  const [col2, setCol2] = useState("");

  const tabDefs = [
    { id: "vehicles" as const, emoji: "🚗", label: "Vehicles" },
    { id: "parts" as const, emoji: "🔧", label: "Parts" },
    { id: "services" as const, emoji: "🛠️", label: "Services" },
  ];

  const col1Options = tab === "vehicles" ? VEHICLE_MAKES : tab === "parts" ? PART_CATS : SVC_CATS;
  const col2Options = tab === "vehicles" ? PRICE_RANGES : ["Any Budget", "Under KSh 5k", "KSh 5k–20k", "KSh 20k–80k", "Over KSh 80k"];
  const col1Label = tab === "vehicles" ? "Make" : tab === "parts" ? "Category" : "Service Type";
  const col2Label = tab === "vehicles" ? "Price Range" : "Budget";

  const handleSearch = () => {
    if (tab === "vehicles") {
      const p = new URLSearchParams();
      if (col1 && !col1.startsWith("Any")) p.set("make", col1);
      if (col2 && !col2.startsWith("Any")) p.set("price", col2);
      window.location.href = `/inventory?${p}`;
    } else if (tab === "parts") {
      const p = new URLSearchParams();
      if (col1 && !col1.startsWith("All")) p.set("system", col1);
      window.location.href = `/parts?${p}`;
    } else {
      const p = new URLSearchParams();
      if (col1 && !col1.startsWith("All")) p.set("category", col1);
      window.location.href = `/services?${p}`;
    }
  };

  const selectStyle: React.CSSProperties = {
    width: "100%",
    height: 48,
    paddingInline: 14,
    background: "white",
    border: "1.5px solid #E5E7EB",
    borderRadius: 8,
    color: "#111827",
    fontSize: "0.9375rem",
    outline: "none",
    appearance: "none",
    backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%234B5563'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E\")",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 12px center",
    backgroundSize: 16,
    paddingRight: 36,
    cursor: "pointer",
  };

  return (
    <div
      style={{
        background: "white",
        borderRadius: 16,
        boxShadow: "0 20px 60px rgba(15,42,74,0.22)",
        overflow: "hidden",
        width: "100%",
        maxWidth: 680,
      }}
    >
      {/* Tabs */}
      <div style={{ display: "flex", borderBottom: "1px solid #E5E7EB" }}>
        {tabDefs.map((t) => (
          <button
            key={t.id}
            onClick={() => { setTab(t.id); setCol1(""); setCol2(""); }}
            style={{
              flex: 1,
              height: 52,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              fontSize: "0.85rem",
              fontWeight: 600,
              color: tab === t.id ? "#0F2A4A" : "#6B7280",
              background: tab === t.id ? "white" : "#F5F7FA",
              border: "none",
              borderBottom: `3px solid ${tab === t.id ? "#E8700A" : "transparent"}`,
              cursor: "pointer",
              transition: "all 180ms ease",
            }}
          >
            <span>{t.emoji}</span> {t.label}
          </button>
        ))}
      </div>

      {/* Fields */}
      <div style={{ padding: "20px 24px 24px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "#374151" }}>{col1Label}</label>
          <select value={col1} onChange={(e) => setCol1(e.target.value)} style={selectStyle}>
            {col1Options.map((o) => <option key={o}>{o}</option>)}
          </select>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "#374151" }}>{col2Label}</label>
          <select value={col2} onChange={(e) => setCol2(e.target.value)} style={selectStyle}>
            {col2Options.map((o) => <option key={o}>{o}</option>)}
          </select>
        </div>
        <button
          onClick={handleSearch}
          style={{
            gridColumn: "1 / -1",
            height: 48,
            background: "#E8700A",
            color: "white",
            border: "none",
            borderRadius: 8,
            fontSize: "0.9375rem",
            fontWeight: 700,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            transition: "background 180ms ease",
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#f07b1a")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "#E8700A")}
        >
          Search {tab === "vehicles" ? "Vehicles" : tab === "parts" ? "Parts" : "Services"}
          <ArrowRight />
        </button>
      </div>

      {/* Quick links */}
      <div style={{ padding: "12px 24px 16px", borderTop: "1px solid #F5F7FA", display: "flex", gap: 16, flexWrap: "wrap" }}>
        <span style={{ fontSize: "0.78rem", color: "#9CA3AF", fontWeight: 600 }}>POPULAR:</span>
        {(tab === "vehicles"
          ? ["Toyota Corolla", "Subaru Forester", "Isuzu Truck"]
          : tab === "parts"
          ? ["Brake Pads", "Oil Filter", "Shock Absorbers"]
          : ["Oil Change", "Engine Diagnostics", "Wheel Alignment"]
        ).map((q) => (
          <Link
            key={q}
            href={tab === "vehicles" ? `/inventory?q=${encodeURIComponent(q)}` : tab === "parts" ? "/parts" : "/services"}
            style={{ fontSize: "0.8rem", color: "#0F2A4A", fontWeight: 500, textDecoration: "none" }}
          >
            {q}
          </Link>
        ))}
      </div>
    </div>
  );
}

// ── Vehicle Card ───────────────────────────────────────────────────────────────
function VehicleCard({ product }: { product: Product }) {
  const [hovered, setHovered] = useState(false);
  const imgSrc = getProductCardImage(product.id);
  const formatted = new Intl.NumberFormat("en-KE", { style: "currency", currency: "KES", maximumFractionDigits: 0 }).format(product.price);

  return (
    <Link
      href={`/product/${product.id}`}
      style={{ textDecoration: "none" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        style={{
          background: "var(--bg)",
          border: `1px solid ${hovered ? "var(--amber)" : "var(--border)"}`,
          borderRadius: 12,
          overflow: "hidden",
          transition: "all 220ms ease",
          boxShadow: hovered ? "var(--shadow-xl)" : "var(--shadow-sm)",
          transform: hovered ? "translateY(-4px)" : "none",
          cursor: "pointer",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Image */}
        <div style={{ position: "relative", aspectRatio: "16/10", background: "var(--surface)", overflow: "hidden" }}>
          <img
            src={imgSrc}
            alt={product.name}
            style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 400ms ease", transform: hovered ? "scale(1.05)" : "scale(1)" }}
            onError={(e) => { (e.currentTarget as HTMLImageElement).src = "/placeholder-vehicle.jpg"; }}
          />
          {/* Badge */}
          <div style={{ position: "absolute", top: 12, left: 12, background: "var(--navy)", color: "white", fontSize: "0.68rem", fontWeight: 700, padding: "4px 10px", borderRadius: 20, letterSpacing: "0.06em", textTransform: "uppercase" }}>
            {product.category}
          </div>
          {product.stock < 3 && (
            <div style={{ position: "absolute", top: 12, right: 12, background: "#DC2626", color: "white", fontSize: "0.68rem", fontWeight: 700, padding: "4px 10px", borderRadius: 20 }}>
              {product.stock} left
            </div>
          )}
        </div>

        {/* Body */}
        <div style={{ padding: 20, flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
          <div>
            <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--amber)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4 }}>
              Melvin Vehicles
            </div>
            <h3 style={{ fontFamily: "var(--font-space-grotesk, sans-serif)", fontSize: "1rem", fontWeight: 700, color: "var(--text)", margin: 0, lineHeight: 1.3 }}>
              {product.name}
            </h3>
          </div>
          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", margin: 0, lineHeight: 1.55, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
            {product.description}
          </p>

          {/* Stars */}
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            {[1,2,3,4,5].map((s) => (
              <span key={s} style={{ color: "#FBBF24", fontSize: "0.8rem" }}><StarFill /></span>
            ))}
            <span style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginLeft: 4 }}>(12 reviews)</span>
          </div>

          {/* Price + CTA */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto", paddingTop: 12, borderTop: "1px solid var(--border)" }}>
            <div>
              <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Starting from</div>
              <div style={{ fontFamily: "var(--font-space-grotesk, sans-serif)", fontSize: "1.25rem", fontWeight: 700, color: "var(--navy)" }}>
                {formatted}
              </div>
            </div>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "8px 16px",
                background: hovered ? "var(--amber)" : "var(--navy)",
                color: "white",
                borderRadius: 8,
                fontSize: "0.8rem",
                fontWeight: 600,
                transition: "background 180ms ease",
              }}
            >
              View <ArrowRight />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

// ── Service Card ───────────────────────────────────────────────────────────────
function ServiceCard({ service }: { service: (typeof services)[0] }) {
  const [hovered, setHovered] = useState(false);
  return (
    <Link href={`/appointments?service=${service.id}`} style={{ textDecoration: "none" }}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <div style={{
        background: "var(--bg)", border: `1px solid ${hovered ? "var(--amber)" : "var(--border)"}`,
        borderRadius: 12, padding: 24, transition: "all 220ms ease",
        boxShadow: hovered ? "var(--shadow-lg)" : "var(--shadow-sm)",
        transform: hovered ? "translateY(-3px)" : "none",
        display: "flex", flexDirection: "column", gap: 14, height: "100%",
      }}>
        <div style={{ width: 48, height: 48, background: "rgba(232,112,10,0.08)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.4rem" }}>
          {serviceIcons[service.id] || "🔧"}
        </div>
        <div>
          <div style={{ fontSize: "0.68rem", fontWeight: 700, color: "var(--amber)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>
            {service.category}
          </div>
          <h3 style={{ fontFamily: "var(--font-space-grotesk, sans-serif)", fontSize: "1rem", fontWeight: 700, color: "var(--text)", margin: 0 }}>
            {service.title}
          </h3>
        </div>
        <p style={{ fontSize: "0.855rem", color: "var(--text-secondary)", margin: 0, lineHeight: 1.6, flex: 1 }}>
          {service.description}
        </p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <span style={{ fontSize: "0.72rem", fontWeight: 600, color: "var(--text-muted)", background: "var(--surface)", padding: "3px 8px", borderRadius: 4 }}>
            ⏱ {service.duration}
          </span>
          <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--navy)", background: "rgba(15,42,74,0.06)", padding: "3px 8px", borderRadius: 4 }}>
            {service.priceRange}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, color: hovered ? "var(--amber)" : "var(--navy)", fontWeight: 600, fontSize: "0.85rem", marginTop: "auto" }}>
          Book Now <ArrowRight />
        </div>
      </div>
    </Link>
  );
}

// ── Review Card ────────────────────────────────────────────────────────────────
function ReviewCard({ review }: { review: (typeof reviews)[0] }) {
  const initials = review.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
  const colors = ["#0F2A4A", "#E8700A", "#059669", "#7C3AED"];
  const bg = colors[review.name.charCodeAt(0) % colors.length];
  return (
    <div style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 12, padding: 28, display: "flex", flexDirection: "column", gap: 16, boxShadow: "var(--shadow-sm)" }}>
      {/* Stars */}
      <div style={{ display: "flex", gap: 3, color: "#FBBF24" }}>
        {Array.from({ length: review.rating }).map((_, i) => <StarFill key={i} />)}
        {Array.from({ length: 5 - review.rating }).map((_, i) => (
          <svg key={i} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" strokeWidth="1.5">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        ))}
      </div>
      {/* Quote */}
      <p style={{ fontSize: "1rem", lineHeight: 1.7, color: "var(--text)", margin: 0, fontStyle: "italic" }}>
        "{review.comment}"
      </p>
      {/* Author */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: "auto", paddingTop: 12, borderTop: "1px solid var(--border)" }}>
        <div style={{ width: 40, height: 40, borderRadius: "50%", background: bg, color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "0.9rem", flexShrink: 0 }}>
          {initials}
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--text)" }}>{review.name}</div>
          <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>{review.vehicle} Owner</div>
        </div>
        <div style={{ marginLeft: "auto", background: "rgba(5,150,105,0.08)", color: "#059669", fontSize: "0.68rem", fontWeight: 700, padding: "3px 8px", borderRadius: 20, border: "1px solid rgba(5,150,105,0.2)" }}>
          VERIFIED
        </div>
      </div>
    </div>
  );
}

// ── Service icons map (module-level) ────────────────────────────────────────────
const serviceIcons: Record<string, string> = {
  "engine-diagnostics": "🔍",
  "oil-change": "🛢️",
  "brake-repair": "🔧",
  "wheel-alignment": "⚙️",
  "battery-replacement": "🔋",
  "car-detailing": "✨",
  "tire-replacement": "🔄",
};

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`)
      .then((r) => r.json())
      .then((data) => { setProducts(data); setLoadingProducts(false); })
      .catch(() => setLoadingProducts(false));
  }, []);

  const stats = [
    { number: "5,000+", label: "Vehicles Serviced" },
    { number: "12 yrs", label: "In Business" },
    { number: "98%", label: "Satisfaction Rate" },
    { number: "50+", label: "Certified Technicians" },
  ];

  const trustItems = [
    { icon: "🛡️", title: "Genuine Parts Guarantee", body: "OEM-certified parts or your money back." },
    { icon: "🔬", title: "Expert Diagnostics", body: "Latest OBD tools and trained technicians." },
    { icon: "📋", title: "Transparent Pricing", body: "Full estimate before any work begins." },
    { icon: "⚡", title: "Fast Turnaround", body: "Most services completed same day." },
  ];

  const whyItems = [
    "Kenya's most trusted independent workshop since 2014",
    "ISO-certified workshop procedures and tooling",
    "Licensed by Kenya Bureau of Standards (KEBS)",
    "Free 30-day / 1,000 km warranty on all repairs",
    "Digital service records accessible via your dashboard",
    "Genuine & OEM-grade parts — never aftermarket unknowns",
  ];

  return (
    <div style={{ background: "var(--bg)", color: "var(--text)" }}>

      {/* ══ HERO ══════════════════════════════════════════════════════════════ */}
      <section
        style={{
          position: "relative",
          background: "linear-gradient(135deg, #091e33 0%, #0F2A4A 45%, #1a3a5c 100%)",
          color: "white",
          overflow: "hidden",
          paddingTop: 80,
          paddingBottom: 0,
        }}
      >
        {/* Decorative circles */}
        <div style={{ position: "absolute", top: -120, right: -120, width: 480, height: 480, borderRadius: "50%", background: "rgba(232,112,10,0.06)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -80, left: -80, width: 320, height: 320, borderRadius: "50%", background: "rgba(255,255,255,0.03)", pointerEvents: "none" }} />

        <div className="container" style={{ position: "relative", zIndex: 2 }}>
          <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(300px,560px)", gap: 64, alignItems: "center" }}>
            {/* Left copy */}
            <div style={{ paddingBottom: 80 }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(232,112,10,0.15)", border: "1px solid rgba(232,112,10,0.3)", borderRadius: 20, padding: "6px 14px", marginBottom: 24 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#E8700A", display: "block", animation: "pulse 2s infinite" }} />
                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#E8700A", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                  Nairobi's Premier Auto Centre
                </span>
              </div>

              <h1 style={{ fontFamily: "var(--font-space-grotesk, sans-serif)", fontSize: "clamp(2.2rem, 5vw, 3.8rem)", fontWeight: 700, lineHeight: 1.05, letterSpacing: "-0.025em", color: "white", margin: "0 0 20px" }}>
                Drive With <span style={{ color: "#E8700A" }}>Confidence.</span>
                <br />Service With Trust.
              </h1>

              <p style={{ fontSize: "clamp(1rem, 2vw, 1.15rem)", lineHeight: 1.75, color: "rgba(255,255,255,0.72)", maxWidth: 480, margin: "0 0 36px" }}>
                From premium commercial vehicles to expert workshop services and genuine parts — AUTOFIX KENYA is Nairobi's most trusted automotive destination.
              </p>

              <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                <Link
                  href="/inventory"
                  style={{ display: "inline-flex", alignItems: "center", gap: 8, height: 52, paddingInline: 28, background: "#E8700A", color: "white", borderRadius: 8, fontSize: "0.9375rem", fontWeight: 700, textDecoration: "none", boxShadow: "0 4px 16px rgba(232,112,10,0.4)" }}
                >
                  Browse Vehicles <ArrowRight />
                </Link>
                <Link
                  href="/appointments"
                  style={{ display: "inline-flex", alignItems: "center", gap: 8, height: 52, paddingInline: 28, background: "rgba(255,255,255,0.1)", color: "white", border: "1.5px solid rgba(255,255,255,0.25)", borderRadius: 8, fontSize: "0.9375rem", fontWeight: 600, textDecoration: "none", backdropFilter: "blur(4px)" }}
                >
                  Book a Service
                </Link>
              </div>

              {/* Social proof */}
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 36, paddingTop: 28, borderTop: "1px solid rgba(255,255,255,0.1)" }}>
                <div style={{ display: "flex" }}>
                  {["MN","PK","AH","DO","GW"].map((init, i) => (
                    <div key={i} style={{ width: 36, height: 36, borderRadius: "50%", background: ["#0F2A4A","#E8700A","#059669","#7C3AED","#DC2626"][i], border: "2px solid rgba(255,255,255,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.7rem", fontWeight: 700, color: "white", marginLeft: i === 0 ? 0 : -10, zIndex: 5 - i }}>
                      {init}
                    </div>
                  ))}
                </div>
                <div>
                  <div style={{ display: "flex", gap: 2, color: "#FBBF24", marginBottom: 2 }}>
                    {[1,2,3,4,5].map((s) => <StarFill key={s} />)}
                  </div>
                  <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.65)" }}>
                    Trusted by <strong style={{ color: "white" }}>5,000+</strong> Kenyan drivers
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Search widget */}
            <div style={{ paddingBottom: 40, display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "rgba(255,255,255,0.55)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>
                Find What You Need
              </div>
              <SearchWidget />
            </div>
          </div>
        </div>
      </section>

      {/* ══ STATS BAND ════════════════════════════════════════════════════════ */}
      <section style={{ background: "var(--navy)", paddingBlock: 40 }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 0 }}>
            {stats.map((s, i) => (
              <div
                key={i}
                style={{
                  textAlign: "center",
                  padding: "20px 16px",
                  borderRight: i < stats.length - 1 ? "1px solid rgba(255,255,255,0.1)" : "none",
                }}
              >
                <div style={{ fontFamily: "var(--font-space-grotesk, sans-serif)", fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)", fontWeight: 700, color: "#E8700A", lineHeight: 1 }}>
                  {s.number}
                </div>
                <div style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.6)", marginTop: 6, letterSpacing: "0.02em" }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ TRUST BAND ════════════════════════════════════════════════════════ */}
      <section style={{ background: "var(--surface)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", paddingBlock: 36 }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24 }}>
            {trustItems.map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                <div style={{ width: 44, height: 44, background: "var(--navy)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem", flexShrink: 0, color: "white" }}>
                  {item.icon}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--text)", marginBottom: 3 }}>{item.title}</div>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>{item.body}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FEATURED VEHICLES ════════════════════════════════════════════════ */}
      <section style={{ paddingBlock: 80, background: "var(--bg)" }}>
        <div className="container">
          {/* Header */}
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 40, flexWrap: "wrap", gap: 16 }}>
            <div>
              <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--amber)", letterSpacing: "0.1em", textTransform: "uppercase", display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <div style={{ width: 20, height: 2, background: "var(--amber)", borderRadius: 2 }} /> Featured Inventory
              </div>
              <h2 style={{ fontFamily: "var(--font-space-grotesk, sans-serif)", fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)", fontWeight: 700, color: "var(--text)", margin: 0, lineHeight: 1.1, letterSpacing: "-0.02em" }}>
                Top Vehicles in Stock
              </h2>
              <p style={{ color: "var(--text-secondary)", marginTop: 10, fontSize: "1rem", lineHeight: 1.7, maxWidth: 520 }}>
                Handpicked commercial vehicles and motorcycles — inspected, certified, and ready for Kenyan roads.
              </p>
            </div>
            <Link href="/inventory" style={{ display: "inline-flex", alignItems: "center", gap: 8, height: 44, paddingInline: 20, border: "1.5px solid var(--navy)", color: "var(--navy)", borderRadius: 8, fontSize: "0.875rem", fontWeight: 600, textDecoration: "none", whiteSpace: "nowrap" }}>
              View All Inventory <ArrowRight />
            </Link>
          </div>

          {/* Grid */}
          {loadingProducts ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
              {[1,2,3].map((i) => (
                <div key={i} style={{ border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden", background: "var(--surface)" }}>
                  <div style={{ aspectRatio: "16/10", background: "var(--surface-2)", animation: "pulse 1.5s infinite" }} />
                  <div style={{ padding: 20, display: "grid", gap: 10 }}>
                    {[80, 60, 40].map((w) => (
                      <div key={w} style={{ height: 14, background: "var(--surface-2)", borderRadius: 4, width: `${w}%`, animation: "pulse 1.5s infinite" }} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))", gap: 24 }}>
              {products.map((p) => <VehicleCard key={p.id} product={p} />)}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "60px 24px", color: "var(--text-muted)", background: "var(--surface)", borderRadius: 12, border: "1px solid var(--border)" }}>
              <div style={{ fontSize: "2.5rem", marginBottom: 12 }}>🚗</div>
              <div style={{ fontWeight: 600 }}>Vehicles loading… Make sure the backend is running on port 3001.</div>
            </div>
          )}
        </div>
      </section>

      {/* ══ SERVICES ══════════════════════════════════════════════════════════ */}
      <section style={{ paddingBlock: 80, background: "var(--surface)", borderTop: "1px solid var(--border)" }}>
        <div className="container">
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 40, flexWrap: "wrap", gap: 16 }}>
            <div>
              <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--amber)", letterSpacing: "0.1em", textTransform: "uppercase", display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <div style={{ width: 20, height: 2, background: "var(--amber)", borderRadius: 2 }} /> Workshop Services
              </div>
              <h2 style={{ fontFamily: "var(--font-space-grotesk, sans-serif)", fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)", fontWeight: 700, color: "var(--text)", margin: 0, lineHeight: 1.1, letterSpacing: "-0.02em" }}>
                Expert Care for Every Vehicle
              </h2>
              <p style={{ color: "var(--text-secondary)", marginTop: 10, fontSize: "1rem", lineHeight: 1.7, maxWidth: 520 }}>
                Our certified technicians handle everything from quick oil changes to full engine overhauls.
              </p>
            </div>
            <Link href="/services" style={{ display: "inline-flex", alignItems: "center", gap: 8, height: 44, paddingInline: 20, border: "1.5px solid var(--navy)", color: "var(--navy)", borderRadius: 8, fontSize: "0.875rem", fontWeight: 600, textDecoration: "none", whiteSpace: "nowrap" }}>
              All Services <ArrowRight />
            </Link>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
            {services.slice(0, 6).map((s) => <ServiceCard key={s.id} service={s} />)}
          </div>
        </div>
      </section>

      {/* ══ WHY AUTOFIX + REVIEWS ════════════════════════════════════════════ */}
      <section style={{ paddingBlock: 80, background: "var(--bg)" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "start" }}>
            {/* Why us */}
            <div>
              <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--amber)", letterSpacing: "0.1em", textTransform: "uppercase", display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                <div style={{ width: 20, height: 2, background: "var(--amber)", borderRadius: 2 }} /> Why AutoFix Kenya
              </div>
              <h2 style={{ fontFamily: "var(--font-space-grotesk, sans-serif)", fontSize: "clamp(1.8rem, 3vw, 2.4rem)", fontWeight: 700, color: "var(--text)", lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: 24 }}>
                Nairobi's Most Trusted Workshop
              </h2>
              <div style={{ display: "grid", gap: 14 }}>
                {whyItems.map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                    <div style={{ width: 24, height: 24, borderRadius: "50%", background: "rgba(232,112,10,0.1)", border: "1.5px solid rgba(232,112,10,0.3)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                      <CheckCircle />
                    </div>
                    <span style={{ fontSize: "0.9375rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>{item}</span>
                  </div>
                ))}
              </div>

              {/* CTA block */}
              <div style={{ marginTop: 36, padding: 24, background: "var(--navy)", borderRadius: 12, display: "grid", gap: 12 }}>
                <div style={{ fontFamily: "var(--font-space-grotesk, sans-serif)", fontWeight: 700, fontSize: "1.1rem", color: "white" }}>
                  Ready to book your service?
                </div>
                <div style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.65)" }}>
                  Most appointments confirmed within 2 hours. Same-day slots often available.
                </div>
                <Link href="/appointments" style={{ display: "inline-flex", alignItems: "center", gap: 8, height: 44, paddingInline: 20, background: "#E8700A", color: "white", borderRadius: 8, fontSize: "0.875rem", fontWeight: 700, textDecoration: "none", width: "fit-content" }}>
                  Book a Service <ArrowRight />
                </Link>
              </div>
            </div>

            {/* Reviews */}
            <div>
              <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--amber)", letterSpacing: "0.1em", textTransform: "uppercase", display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                <div style={{ width: 20, height: 2, background: "var(--amber)", borderRadius: 2 }} /> Customer Reviews
              </div>
              <h2 style={{ fontFamily: "var(--font-space-grotesk, sans-serif)", fontSize: "clamp(1.8rem, 3vw, 2.4rem)", fontWeight: 700, color: "var(--text)", lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: 24 }}>
                What Our Customers Say
              </h2>
              <div style={{ display: "grid", gap: 16 }}>
                {reviews.map((r) => <ReviewCard key={r.id} review={r} />)}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ PARTS CTA BAND ═══════════════════════════════════════════════════ */}
      <section style={{ background: "var(--surface)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", paddingBlock: 56 }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto", alignItems: "center", gap: 32 }}>
            <div>
              <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--amber)", letterSpacing: "0.1em", textTransform: "uppercase", display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <div style={{ width: 20, height: 2, background: "var(--amber)", borderRadius: 2 }} /> Genuine Parts
              </div>
              <h2 style={{ fontFamily: "var(--font-space-grotesk, sans-serif)", fontSize: "clamp(1.5rem, 3vw, 2.2rem)", fontWeight: 700, color: "var(--text)", margin: 0, letterSpacing: "-0.02em" }}>
                OEM & Quality Aftermarket Parts
              </h2>
              <p style={{ color: "var(--text-secondary)", marginTop: 10, fontSize: "0.9375rem", lineHeight: 1.7, maxWidth: 580 }}>
                Brake pads, oil filters, shock absorbers, batteries and more. Every part tested and guaranteed for Kenyan roads.
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, flexShrink: 0 }}>
              <Link href="/parts" style={{ display: "inline-flex", alignItems: "center", gap: 8, height: 48, paddingInline: 24, background: "var(--navy)", color: "white", borderRadius: 8, fontSize: "0.9rem", fontWeight: 700, textDecoration: "none", whiteSpace: "nowrap" }}>
                Browse Parts <ArrowRight />
              </Link>
              <Link href="/contact" style={{ display: "inline-flex", alignItems: "center", gap: 8, height: 44, paddingInline: 24, border: "1.5px solid var(--border)", color: "var(--text-secondary)", borderRadius: 8, fontSize: "0.875rem", fontWeight: 600, textDecoration: "none", whiteSpace: "nowrap", justifyContent: "center" }}>
                Request a Part
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══ CONTACT QUICK ════════════════════════════════════════════════════ */}
      <section style={{ paddingBlock: 80, background: "var(--bg)" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--amber)", letterSpacing: "0.1em", textTransform: "uppercase", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 12 }}>
              <div style={{ width: 20, height: 2, background: "var(--amber)", borderRadius: 2 }} /> Get In Touch <div style={{ width: 20, height: 2, background: "var(--amber)", borderRadius: 2 }} />
            </div>
            <h2 style={{ fontFamily: "var(--font-space-grotesk, sans-serif)", fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)", fontWeight: 700, color: "var(--text)", letterSpacing: "-0.02em" }}>
              Visit Us in Nairobi
            </h2>
            <p style={{ color: "var(--text-secondary)", marginTop: 10, fontSize: "1rem", lineHeight: 1.7 }}>
              Walk in or book ahead — we're here when you need us.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, maxWidth: 900, margin: "0 auto" }}>
            {[
              { icon: <PhoneIcon />, title: "Call Us", body: "+254 700 123 456", sub: "Mon–Fri 8AM–6PM", href: "tel:+254700123456" },
              { icon: <MailIcon />, title: "Email Us", body: "service@autofixkenya.co.ke", sub: "Response within 2 hours", href: "mailto:service@autofixkenya.co.ke" },
              { icon: <MapPinIcon />, title: "Visit Us", body: "Industrial Area, Nairobi", sub: "Near the KRA offices", href: "/contact" },
            ].map((c, i) => (
              <a key={i} href={c.href} style={{ textDecoration: "none" }}>
                <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: 28, textAlign: "center", transition: "all 220ms ease", cursor: "pointer" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--amber)"; (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-lg)"; (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; (e.currentTarget as HTMLElement).style.transform = "none"; }}
                >
                  <div style={{ width: 48, height: 48, background: "var(--navy)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", color: "white", margin: "0 auto 16px" }}>
                    {c.icon}
                  </div>
                  <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>{c.title}</div>
                  <div style={{ fontFamily: "var(--font-space-grotesk, sans-serif)", fontWeight: 700, fontSize: "1rem", color: "var(--text)", marginBottom: 4 }}>{c.body}</div>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{c.sub}</div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FOOTER ════════════════════════════════════════════════════════════ */}
      <footer style={{ background: "#091e33", color: "rgba(255,255,255,0.65)" }}>
        {/* Top */}
        <div style={{ paddingBlock: 64, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <div className="container">
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 48 }}>
              {/* Brand */}
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 36, height: 36, background: "#E8700A", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, color: "white", fontFamily: "var(--font-space-grotesk, sans-serif)" }}>
                    AF
                  </div>
                  <div>
                    <div style={{ fontFamily: "var(--font-space-grotesk, sans-serif)", fontWeight: 700, fontSize: "1rem", color: "white", letterSpacing: "0.05em" }}>AUTOFIX KENYA</div>
                    <div style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.4)", letterSpacing: "0.08em" }}>TRUSTED SINCE 2014</div>
                  </div>
                </div>
                <p style={{ fontSize: "0.875rem", lineHeight: 1.7, maxWidth: 320 }}>
                  Nairobi's premier automotive centre for vehicle sales, workshop services, and genuine parts. Certified technicians, transparent pricing, guaranteed quality.
                </p>
                <div style={{ display: "flex", gap: 10 }}>
                  {["FB", "TW", "IG", "YT"].map((s) => (
                    <div key={s} style={{ width: 32, height: 32, borderRadius: 6, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.65rem", fontWeight: 700, color: "rgba(255,255,255,0.5)", cursor: "pointer" }}>
                      {s}
                    </div>
                  ))}
                </div>
              </div>

              {/* Vehicles */}
              <div>
                <div style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.9)", marginBottom: 16 }}>Vehicles</div>
                {["Browse Inventory", "Commercial Trucks", "Motorcycles", "New Arrivals", "Special Offers"].map((l) => (
                  <Link key={l} href="/inventory" style={{ display: "block", fontSize: "0.875rem", color: "rgba(255,255,255,0.5)", marginBottom: 10, textDecoration: "none", transition: "color 180ms ease" }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#E8700A")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.5)")}>
                    {l}
                  </Link>
                ))}
              </div>

              {/* Services */}
              <div>
                <div style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.9)", marginBottom: 16 }}>Services</div>
                {["All Services", "Engine Diagnostics", "Oil Change", "Brake Repair", "Car Detailing", "Book Appointment"].map((l) => (
                  <Link key={l} href={l === "Book Appointment" ? "/appointments" : "/services"} style={{ display: "block", fontSize: "0.875rem", color: "rgba(255,255,255,0.5)", marginBottom: 10, textDecoration: "none", transition: "color 180ms ease" }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#E8700A")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.5)")}>
                    {l}
                  </Link>
                ))}
              </div>

              {/* Company */}
              <div>
                <div style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.9)", marginBottom: 16 }}>Company</div>
                {[["About Us", "/contact"], ["Parts Catalog", "/parts"], ["Track Order", "/order-tracking"], ["Dashboard", "/dashboard"], ["Contact", "/contact"], ["Admin", "/admin"]].map(([l, h]) => (
                  <Link key={l} href={h} style={{ display: "block", fontSize: "0.875rem", color: "rgba(255,255,255,0.5)", marginBottom: 10, textDecoration: "none", transition: "color 180ms ease" }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#E8700A")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.5)")}>
                    {l}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingBlock: 24, gap: 16, flexWrap: "wrap" }}>
          <div style={{ fontSize: "0.8125rem" }}>
            © {new Date().getFullYear()} AutoFix Kenya Ltd. All rights reserved.
          </div>
          <div style={{ display: "flex", gap: 20, fontSize: "0.8125rem" }}>
            {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((l) => (
              <span key={l} style={{ cursor: "pointer", transition: "color 180ms ease" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#E8700A")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.4)")}>
                {l}
              </span>
            ))}
          </div>
        </div>
      </footer>

      {/* Pulse animation */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @media (max-width: 900px) {
          .hero-grid { grid-template-columns: 1fr !important; }
          .stats-grid { grid-template-columns: repeat(2,1fr) !important; }
          .trust-grid { grid-template-columns: repeat(2,1fr) !important; }
          .products-grid { grid-template-columns: repeat(2,1fr) !important; }
          .why-reviews-grid { grid-template-columns: 1fr !important; }
          .contact-grid-3 { grid-template-columns: 1fr !important; }
          .footer-cols { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 640px) {
          .products-grid { grid-template-columns: 1fr !important; }
          .trust-grid { grid-template-columns: 1fr !important; }
          .stats-grid { grid-template-columns: repeat(2,1fr) !important; }
          .footer-cols { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
