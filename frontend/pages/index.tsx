"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
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

// ── Tab icons ──────────────────────────────────────────────────────────────────
function CarTabIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 17H3a2 2 0 01-2-2V9a2 2 0 012-2h3.44L8 4h8l1.56 3H21a2 2 0 012 2v6a2 2 0 01-2 2h-2" />
      <circle cx="7" cy="17" r="2" /><circle cx="17" cy="17" r="2" />
    </svg>
  );
}
function WrenchTabIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />
    </svg>
  );
}
function ToolsTabIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.07 4.93l-1.41 1.41M4.93 4.93l1.41 1.41M4.93 19.07l1.41-1.41M19.07 19.07l-1.41-1.41M12 2v2M12 20v2M2 12h2M20 12h2" />
    </svg>
  );
}

// ── AI Search Widget ───────────────────────────────────────────────────────────
const EXAMPLE_PROMPTS = [
  "Isuzu truck under KSh 2M",
  "Honda motorcycle good for Nairobi",
  "Toyota Hilux with low mileage",
  "Brake pads for Subaru Forester",
  "Book an oil change service",
  "Pick-up under KSh 1.5M",
];

// Parse the natural language query into a URL
function parseQuery(q: string): string {
  const lower = q.toLowerCase();

  // ── Parts keywords ──
  const partKeywords = ["brake", "oil filter", "shock", "battery", "clutch", "tyre", "tire", "bulb", "belt", "pad", "filter", "absorber", "alternator"];
  const isPart = partKeywords.some((k) => lower.includes(k));

  // ── Service keywords ──
  const svcKeywords = ["service", "repair", "diagnos", "alignment", "detailing", "change", "check", "fix", "book", "appointment"];
  const isService = svcKeywords.some((k) => lower.includes(k));

  if (isPart) {
    const p = new URLSearchParams({ q });
    if (lower.includes("brake")) p.set("system", "Braking");
    else if (lower.includes("engine") || lower.includes("oil") || lower.includes("belt")) p.set("system", "Engine");
    else if (lower.includes("shock") || lower.includes("absorber")) p.set("system", "Suspension");
    else if (lower.includes("battery") || lower.includes("alternator")) p.set("system", "Electrical");
    return `/parts?${p}`;
  }

  if (isService) return `/services?q=${encodeURIComponent(q)}`;

  // ── Vehicle search ──
  const p = new URLSearchParams({ q });

  const makes = ["toyota", "subaru", "mitsubishi", "isuzu", "nissan", "honda", "ford", "mazda", "suzuki", "bajaj", "tvs"];
  const foundMake = makes.find((m) => lower.includes(m));
  if (foundMake) p.set("make", foundMake.charAt(0).toUpperCase() + foundMake.slice(1));

  const cats = [
    { key: "truck", val: "trucks" }, { key: "lorry", val: "trucks" },
    { key: "motorcycle", val: "motorcycles" }, { key: "motorbike", val: "motorcycles" }, { key: "boda", val: "motorcycles" },
    { key: "pickup", val: "pickups" }, { key: "pick-up", val: "pickups" }, { key: "pick up", val: "pickups" },
  ];
  const foundCat = cats.find((c) => lower.includes(c.key));
  if (foundCat) p.set("category", foundCat.val);

  // Budget extraction: "under X" / "below X" / "less than X"
  const budgetMatch = lower.match(/(?:under|below|less than|max|upto|up to)\s*(?:ksh|kes|sh)?\s*([\d,.]+)\s*([mk]?)/i);
  if (budgetMatch) {
    let amount = parseFloat(budgetMatch[1].replace(/,/g, ""));
    const suffix = budgetMatch[2]?.toLowerCase();
    if (suffix === "m") amount *= 1_000_000;
    else if (suffix === "k") amount *= 1_000;
    p.set("maxPrice", String(amount));
  }

  const conditionNew = /\bnew\b/.test(lower);
  const conditionUsed = /\bused\b|\bsecond.?hand\b/.test(lower);
  if (conditionNew) p.set("condition", "new");
  if (conditionUsed) p.set("condition", "used");

  return `/inventory?${p}`;
}

function SearchWidget() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const router = useRouter();

  const handleSearch = () => {
    const trimmed = query.trim();
    if (!trimmed) return;
    setLoading(true);
    // Small delay so the spinner is visible — feels like "thinking"
    setTimeout(() => {
      router.push(parseQuery(trimmed));
    }, 520);
  };

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <div style={{ width: "100%", maxWidth: 860 }}>

      {/* ── Heading ── */}
      <div style={{ marginBottom: 20, textAlign: "center" }}>
        <h2 style={{
          fontFamily: "var(--font-space-grotesk, sans-serif)",
          fontSize: "clamp(1.5rem, 3vw, 2rem)",
          fontWeight: 700,
          color: "white",
          margin: "0 0 8px",
          letterSpacing: "-0.02em",
        }}>
          Let's find your{" "}
          <span style={{
            color: "#E8700A",
            position: "relative",
            display: "inline-block",
          }}>
            perfect vehicle
            <svg style={{ position: "absolute", bottom: -4, left: 0, width: "100%", overflow: "visible" }}
              viewBox="0 0 200 8" preserveAspectRatio="none" height="6">
              <path d="M0 6 Q50 0 100 5 Q150 10 200 4" stroke="#E8700A" strokeWidth="2.5"
                fill="none" strokeLinecap="round" opacity="0.6"/>
            </svg>
          </span>
        </h2>
        <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.5)", margin: 0 }}>
          Describe what you're looking for — make, budget, type, anything
        </p>
      </div>

      {/* ── Input card ── */}
      <div
        style={{
          background: "white",
          borderRadius: 16,
          boxShadow: focused
            ? "0 0 0 3px rgba(232,112,10,0.35), 0 24px 64px rgba(15,42,74,0.32)"
            : "0 24px 64px rgba(15,42,74,0.28)",
          transition: "box-shadow 200ms ease",
          overflow: "hidden",
        }}
      >
        {/* Textarea row */}
        <div style={{ display: "flex", alignItems: "flex-end", padding: "16px 16px 12px 20px", gap: 12 }}>
          {/* Sparkle icon */}
          <div style={{
            width: 36, height: 36, borderRadius: 10, flexShrink: 0, marginBottom: 2,
            background: "linear-gradient(135deg, #6d28d9 0%, #7c3aed 100%)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 2px 8px rgba(109,40,217,0.3)",
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
              <path d="M12 2l1.5 4.5L18 8l-4.5 1.5L12 14l-1.5-4.5L6 8l4.5-1.5L12 2z"/>
              <path d="M19 14l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7.7-2z" opacity="0.7"/>
            </svg>
          </div>

          <textarea
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKey}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="e.g. Isuzu truck under KSh 2M, or Honda motorcycle for Nairobi…"
            rows={1}
            style={{
              flex: 1,
              border: "none",
              outline: "none",
              resize: "none",
              fontSize: "1.05rem",
              color: "#111827",
              fontFamily: "inherit",
              lineHeight: 1.6,
              background: "transparent",
              maxHeight: 120,
              overflow: "auto",
              paddingTop: 6,
            }}
            onInput={(e) => {
              const el = e.currentTarget;
              el.style.height = "auto";
              el.style.height = el.scrollHeight + "px";
            }}
          />

          {/* Search button */}
          <button
            onClick={handleSearch}
            disabled={!query.trim() || loading}
            style={{
              flexShrink: 0,
              height: 44,
              paddingInline: 22,
              borderRadius: 10,
              border: "none",
              background: query.trim() && !loading ? "#E8700A" : "#F3F4F6",
              color: query.trim() && !loading ? "white" : "#9CA3AF",
              fontSize: "0.9rem",
              fontWeight: 700,
              cursor: query.trim() && !loading ? "pointer" : "default",
              display: "flex",
              alignItems: "center",
              gap: 8,
              transition: "all 180ms ease",
              boxShadow: query.trim() && !loading ? "0 2px 10px rgba(232,112,10,0.35)" : "none",
              marginBottom: 2,
            }}
            onMouseEnter={(e) => { if (query.trim() && !loading) (e.currentTarget as HTMLElement).style.background = "#d4620a"; }}
            onMouseLeave={(e) => { if (query.trim() && !loading) (e.currentTarget as HTMLElement).style.background = "#E8700A"; }}
          >
            {loading ? (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ animation: "spin 0.7s linear infinite" }}>
                  <path d="M12 2a10 10 0 0110 10"/>
                </svg>
                Searching…
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                Search
              </>
            )}
          </button>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: "#F3F4F6", marginInline: 20 }} />

        {/* Example chips */}
        <div style={{ padding: "10px 20px 14px", display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
          <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#9CA3AF", letterSpacing: "0.07em", textTransform: "uppercase", marginRight: 4 }}>
            Try:
          </span>
          {EXAMPLE_PROMPTS.map((p) => (
            <button
              key={p}
              onClick={() => { setQuery(p); inputRef.current?.focus(); }}
              style={{
                padding: "5px 12px",
                borderRadius: 999,
                border: "1.5px solid #E5E7EB",
                background: "white",
                color: "#374151",
                fontSize: "0.8rem",
                fontWeight: 500,
                cursor: "pointer",
                transition: "all 150ms ease",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "#E8700A";
                (e.currentTarget as HTMLElement).style.color = "#E8700A";
                (e.currentTarget as HTMLElement).style.background = "rgba(232,112,10,0.05)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "#E5E7EB";
                (e.currentTarget as HTMLElement).style.color = "#374151";
                (e.currentTarget as HTMLElement).style.background = "white";
              }}
            >
              {p}
            </button>
          ))}
        </div>
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
        <div style={{ width: 48, height: 48, background: "rgba(232,112,10,0.08)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--amber)" }}>
          {serviceIconComponents[service.id] || <SvcDefaultIcon />}
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
          <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: "0.72rem", fontWeight: 600, color: "var(--text-muted)", background: "var(--surface)", padding: "3px 8px", borderRadius: 4 }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            {service.duration}
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

// ── Service icons (SVG components) ─────────────────────────────────────────────
function SvcDiagnosticsIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}
function SvcOilIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2v6l3 3-3 3v6" /><ellipse cx="12" cy="19" rx="5" ry="3" />
      <path d="M7 8H4a1 1 0 00-1 1v5a1 1 0 001 1h3" />
    </svg>
  );
}
function SvcBrakeIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="4" />
      <line x1="12" y1="2" x2="12" y2="6" /><line x1="12" y1="18" x2="12" y2="22" />
      <line x1="2" y1="12" x2="6" y2="12" /><line x1="18" y1="12" x2="22" y2="12" />
    </svg>
  );
}
function SvcAlignIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.07 4.93l-1.41 1.41M4.93 4.93l1.41 1.41M4.93 19.07l1.41-1.41M19.07 19.07l-1.41-1.41M12 2v2M12 20v2M2 12h2M20 12h2" />
    </svg>
  );
}
function SvcBatteryIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="18" height="11" rx="2" /><path d="M20 11h2v4h-2" />
      <line x1="7" y1="12" x2="11" y2="12" /><line x1="9" y1="10" x2="9" y2="14" />
    </svg>
  );
}
function SvcDetailIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12c0-4.97 4.03-9 9-9s9 4.03 9 9" />
      <path d="M3 12h3m12 0h3" />
      <path d="M12 3v3m0 12v3" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
function SvcTireIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="3" />
      <line x1="12" y1="2" x2="12" y2="5" /><line x1="12" y1="19" x2="12" y2="22" />
      <line x1="2" y1="12" x2="5" y2="12" /><line x1="19" y1="12" x2="22" y2="12" />
    </svg>
  );
}
function SvcDefaultIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />
    </svg>
  );
}

const serviceIconComponents: Record<string, React.ReactNode> = {
  "engine-diagnostics": <SvcDiagnosticsIcon />,
  "oil-change": <SvcOilIcon />,
  "brake-repair": <SvcBrakeIcon />,
  "wheel-alignment": <SvcAlignIcon />,
  "battery-replacement": <SvcBatteryIcon />,
  "car-detailing": <SvcDetailIcon />,
  "tire-replacement": <SvcTireIcon />,
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
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      ),
      title: "Genuine Parts Guarantee", body: "OEM-certified parts or your money back.",
    },
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          <line x1="11" y1="8" x2="11" y2="14" /><line x1="8" y1="11" x2="14" y2="11" />
        </svg>
      ),
      title: "Expert Diagnostics", body: "Latest OBD tools and trained technicians.",
    },
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
        </svg>
      ),
      title: "Transparent Pricing", body: "Full estimate before any work begins.",
    },
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      ),
      title: "Fast Turnaround", body: "Most services completed same day.",
    },
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
          paddingTop: 72,
          paddingBottom: 64,
        }}
      >
        {/* Decorative circles */}
        <div style={{ position: "absolute", top: -120, right: -120, width: 480, height: 480, borderRadius: "50%", background: "rgba(232,112,10,0.06)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -80, left: -80, width: 320, height: 320, borderRadius: "50%", background: "rgba(255,255,255,0.03)", pointerEvents: "none" }} />

        <div className="container" style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>

          {/* ── Search widget — TOP, center stage ── */}
          <div style={{ width: "100%", maxWidth: 900, marginBottom: 20 }}>
            <SearchWidget />
          </div>

          {/* ── Quick-action pills ── */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center", marginBottom: 40 }}>
            {[
              {
                href: "/inventory?condition=used",
                label: "Shop Used",
                accent: false,
                icon: (
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 17H3a2 2 0 01-2-2V9a2 2 0 012-2h3.44L8 4h8l1.56 3H21a2 2 0 012 2v6a2 2 0 01-2 2h-2"/>
                    <circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/>
                  </svg>
                ),
              },
              {
                href: "/inventory?condition=new",
                label: "Shop New",
                accent: false,
                icon: (
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                  </svg>
                ),
              },
              {
                href: "/inventory?category=trucks",
                label: "Trucks",
                accent: false,
                icon: (
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
                    <circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
                  </svg>
                ),
              },
              {
                href: "/inventory?category=motorcycles",
                label: "Motorcycles",
                accent: false,
                icon: (
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="5.5" cy="17.5" r="3.5"/><circle cx="18.5" cy="17.5" r="3.5"/>
                    <path d="M15 6h-3l-3 6 3 3h6l2-5-5-4z"/>
                  </svg>
                ),
              },
              {
                href: "/contact",
                label: "Get a Quote",
                accent: true,
                icon: (
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
                  </svg>
                ),
              },
            ].map((pill) => (
              <Link
                key={pill.href + pill.label}
                href={pill.href}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 7,
                  height: 36, paddingInline: 16,
                  borderRadius: 999,
                  border: pill.accent ? "1.5px solid rgba(232,112,10,0.5)" : "1.5px solid rgba(255,255,255,0.3)",
                  background: pill.accent ? "rgba(232,112,10,0.15)" : "rgba(255,255,255,0.07)",
                  color: pill.accent ? "#f5a05a" : "white",
                  fontSize: "0.82rem", fontWeight: pill.accent ? 700 : 600,
                  textDecoration: "none",
                  backdropFilter: "blur(6px)",
                  transition: "all 180ms ease",
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLElement;
                  if (pill.accent) { el.style.background = "rgba(232,112,10,0.28)"; }
                  else { el.style.background = "rgba(255,255,255,0.16)"; el.style.borderColor = "rgba(255,255,255,0.55)"; }
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement;
                  if (pill.accent) { el.style.background = "rgba(232,112,10,0.15)"; }
                  else { el.style.background = "rgba(255,255,255,0.07)"; el.style.borderColor = "rgba(255,255,255,0.3)"; }
                }}
              >
                {pill.icon}
                {pill.label}
              </Link>
            ))}
          </div>

          {/* Social proof */}
          <div style={{ display: "flex", alignItems: "center", gap: 16, paddingTop: 24, borderTop: "1px solid rgba(255,255,255,0.1)", marginBottom: 56 }}>
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

          {/* Badge */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(232,112,10,0.15)", border: "1px solid rgba(232,112,10,0.3)", borderRadius: 20, padding: "6px 14px", marginBottom: 24 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#E8700A", display: "block", animation: "pulse 2s infinite" }} />
            <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#E8700A", letterSpacing: "0.1em", textTransform: "uppercase" }}>
              Nairobi's Premier Auto Centre
            </span>
          </div>

          {/* Headline */}
          <h1 style={{ fontFamily: "var(--font-space-grotesk, sans-serif)", fontSize: "clamp(2.4rem, 5.5vw, 4rem)", fontWeight: 700, lineHeight: 1.05, letterSpacing: "-0.025em", color: "white", margin: "0 0 20px", maxWidth: 720 }}>
            Drive With <span style={{ color: "#E8700A" }}>Confidence.</span>
            <br />Service With Trust.
          </h1>

          {/* Subheading */}
          <p style={{ fontSize: "clamp(1rem, 2vw, 1.15rem)", lineHeight: 1.75, color: "rgba(255,255,255,0.72)", maxWidth: 560, margin: "0 0 32px" }}>
            From premium commercial vehicles to expert workshop services and genuine parts — AUTOFIX KENYA is Nairobi's most trusted automotive destination.
          </p>

          {/* CTA buttons */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center" }}>
            <Link
              href="/inventory"
              style={{ display: "inline-flex", alignItems: "center", gap: 8, height: 52, paddingInline: 32, background: "#E8700A", color: "white", borderRadius: 8, fontSize: "0.9375rem", fontWeight: 700, textDecoration: "none", boxShadow: "0 4px 16px rgba(232,112,10,0.4)" }}
            >
              Browse Vehicles <ArrowRight />
            </Link>
            <Link
              href="/appointments"
              style={{ display: "inline-flex", alignItems: "center", gap: 8, height: 52, paddingInline: 32, background: "rgba(255,255,255,0.1)", color: "white", border: "1.5px solid rgba(255,255,255,0.25)", borderRadius: 8, fontSize: "0.9375rem", fontWeight: 600, textDecoration: "none", backdropFilter: "blur(4px)" }}
            >
              Book a Service
            </Link>
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

      {/* ══ BROWSE BY TYPE ═══════════════════════════════════════════════════ */}
      <section style={{ background: "var(--bg)", paddingBlock: 64 }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--amber)", letterSpacing: "0.1em", textTransform: "uppercase", display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <div style={{ width: 20, height: 2, background: "var(--amber)", borderRadius: 2 }} /> Browse By Type <div style={{ width: 20, height: 2, background: "var(--amber)", borderRadius: 2 }} />
            </div>
            <h2 style={{ fontFamily: "var(--font-space-grotesk, sans-serif)", fontSize: "clamp(1.5rem, 3vw, 2.2rem)", fontWeight: 700, color: "var(--text)", margin: 0, letterSpacing: "-0.02em" }}>
              What are you looking for?
            </h2>
          </div>

          <div className="browse-by-type-grid" style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 16 }}>
            {[
              {
                href: "/inventory?category=trucks",
                label: "Cargo Trucks",
                sub: "Commercial fleet",
                illustration: (
                  <svg viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
                    {/* Cab */}
                    <rect x="8" y="28" width="38" height="28" rx="4" fill="var(--navy)" opacity="0.12"/>
                    <rect x="10" y="30" width="34" height="24" rx="3" fill="var(--navy)" opacity="0.2"/>
                    {/* Windshield */}
                    <rect x="14" y="32" width="18" height="12" rx="2" fill="var(--navy)" opacity="0.5"/>
                    {/* Cargo box */}
                    <rect x="46" y="20" width="64" height="36" rx="3" fill="var(--navy)" opacity="0.15"/>
                    <rect x="48" y="22" width="60" height="32" rx="2" fill="var(--navy)" opacity="0.22"/>
                    {/* Cargo lines */}
                    <line x1="68" y1="22" x2="68" y2="54" stroke="var(--navy)" strokeWidth="1.5" opacity="0.3"/>
                    <line x1="88" y1="22" x2="88" y2="54" stroke="var(--navy)" strokeWidth="1.5" opacity="0.3"/>
                    {/* Chassis */}
                    <rect x="8" y="54" width="104" height="5" rx="2" fill="var(--navy)" opacity="0.2"/>
                    {/* Wheels */}
                    <circle cx="28" cy="62" r="9" fill="var(--navy)" opacity="0.18"/>
                    <circle cx="28" cy="62" r="5" fill="var(--navy)" opacity="0.3"/>
                    <circle cx="28" cy="62" r="2" fill="var(--navy)" opacity="0.5"/>
                    <circle cx="88" cy="62" r="9" fill="var(--navy)" opacity="0.18"/>
                    <circle cx="88" cy="62" r="5" fill="var(--navy)" opacity="0.3"/>
                    <circle cx="88" cy="62" r="2" fill="var(--navy)" opacity="0.5"/>
                    <circle cx="106" cy="62" r="9" fill="var(--navy)" opacity="0.18"/>
                    <circle cx="106" cy="62" r="5" fill="var(--navy)" opacity="0.3"/>
                    <circle cx="106" cy="62" r="2" fill="var(--navy)" opacity="0.5"/>
                  </svg>
                ),
              },
              {
                href: "/inventory?category=motorcycles",
                label: "Motorcycles",
                sub: "2 & 3-wheelers",
                illustration: (
                  <svg viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
                    {/* Rear wheel */}
                    <circle cx="82" cy="54" r="18" fill="var(--navy)" opacity="0.12"/>
                    <circle cx="82" cy="54" r="12" fill="var(--navy)" opacity="0.15"/>
                    <circle cx="82" cy="54" r="4" fill="var(--navy)" opacity="0.4"/>
                    {/* Front wheel */}
                    <circle cx="30" cy="54" r="18" fill="var(--navy)" opacity="0.12"/>
                    <circle cx="30" cy="54" r="12" fill="var(--navy)" opacity="0.15"/>
                    <circle cx="30" cy="54" r="4" fill="var(--navy)" opacity="0.4"/>
                    {/* Frame */}
                    <path d="M82 54 L65 28 L48 28 L30 54" stroke="var(--navy)" strokeWidth="4" opacity="0.25" strokeLinecap="round"/>
                    <path d="M65 28 L75 20 L82 30" stroke="var(--navy)" strokeWidth="3.5" opacity="0.25" strokeLinecap="round"/>
                    {/* Seat */}
                    <rect x="48" y="24" width="22" height="6" rx="3" fill="var(--navy)" opacity="0.35"/>
                    {/* Engine */}
                    <rect x="50" y="36" width="20" height="14" rx="3" fill="var(--navy)" opacity="0.2"/>
                    {/* Handlebar */}
                    <line x1="72" y1="18" x2="82" y2="18" stroke="var(--navy)" strokeWidth="3" opacity="0.35" strokeLinecap="round"/>
                  </svg>
                ),
              },
              {
                href: "/inventory?category=pickups",
                label: "Pick-Ups",
                sub: "Double & single cab",
                illustration: (
                  <svg viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
                    {/* Body */}
                    <rect x="10" y="32" width="100" height="26" rx="4" fill="var(--navy)" opacity="0.12"/>
                    {/* Cab */}
                    <path d="M14 32 L22 16 L62 16 L68 32" fill="var(--navy)" opacity="0.2"/>
                    <rect x="24" y="18" width="26" height="14" rx="2" fill="var(--navy)" opacity="0.4"/>
                    {/* Bed */}
                    <rect x="68" y="24" width="38" height="8" rx="2" fill="var(--navy)" opacity="0.12"/>
                    <line x1="80" y1="24" x2="80" y2="32" stroke="var(--navy)" strokeWidth="1.5" opacity="0.25"/>
                    <line x1="94" y1="24" x2="94" y2="32" stroke="var(--navy)" strokeWidth="1.5" opacity="0.25"/>
                    {/* Chassis */}
                    <rect x="10" y="56" width="100" height="4" rx="2" fill="var(--navy)" opacity="0.15"/>
                    {/* Wheels */}
                    <circle cx="30" cy="62" r="10" fill="var(--navy)" opacity="0.18"/>
                    <circle cx="30" cy="62" r="6" fill="var(--navy)" opacity="0.28"/>
                    <circle cx="30" cy="62" r="2.5" fill="var(--navy)" opacity="0.5"/>
                    <circle cx="90" cy="62" r="10" fill="var(--navy)" opacity="0.18"/>
                    <circle cx="90" cy="62" r="6" fill="var(--navy)" opacity="0.28"/>
                    <circle cx="90" cy="62" r="2.5" fill="var(--navy)" opacity="0.5"/>
                  </svg>
                ),
              },
              {
                href: "/parts",
                label: "Parts & Spares",
                sub: "OEM & aftermarket",
                illustration: (
                  <svg viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
                    {/* Large gear */}
                    <circle cx="52" cy="42" r="22" fill="var(--navy)" opacity="0.08"/>
                    <circle cx="52" cy="42" r="16" fill="var(--navy)" opacity="0.12"/>
                    <circle cx="52" cy="42" r="6" fill="var(--navy)" opacity="0.3"/>
                    {/* Gear teeth */}
                    {[0,45,90,135,180,225,270,315].map((deg, i) => {
                      const r = (deg * Math.PI) / 180;
                      const x1 = 52 + 16 * Math.cos(r);
                      const y1 = 42 + 16 * Math.sin(r);
                      const x2 = 52 + 23 * Math.cos(r);
                      const y2 = 42 + 23 * Math.sin(r);
                      return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--navy)" strokeWidth="5" opacity="0.18" strokeLinecap="round"/>;
                    })}
                    {/* Small gear */}
                    <circle cx="82" cy="28" r="13" fill="var(--navy)" opacity="0.08"/>
                    <circle cx="82" cy="28" r="9" fill="var(--navy)" opacity="0.14"/>
                    <circle cx="82" cy="28" r="3.5" fill="var(--navy)" opacity="0.3"/>
                    {[0,60,120,180,240,300].map((deg, i) => {
                      const r = (deg * Math.PI) / 180;
                      const x1 = 82 + 9 * Math.cos(r);
                      const y1 = 28 + 9 * Math.sin(r);
                      const x2 = 82 + 14 * Math.cos(r);
                      const y2 = 28 + 14 * Math.sin(r);
                      return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--navy)" strokeWidth="4" opacity="0.18" strokeLinecap="round"/>;
                    })}
                    {/* Wrench */}
                    <path d="M24 60 L38 46" stroke="var(--navy)" strokeWidth="5" opacity="0.22" strokeLinecap="round"/>
                    <circle cx="40" cy="44" r="5" fill="none" stroke="var(--navy)" strokeWidth="3" opacity="0.25"/>
                  </svg>
                ),
              },
              {
                href: "/services",
                label: "Workshop",
                sub: "All repair services",
                illustration: (
                  <svg viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
                    {/* Building */}
                    <rect x="20" y="28" width="80" height="44" rx="3" fill="var(--navy)" opacity="0.1"/>
                    <rect x="22" y="30" width="76" height="40" rx="2" fill="var(--navy)" opacity="0.1"/>
                    {/* Roof */}
                    <path d="M16 30 L60 10 L104 30" fill="var(--navy)" opacity="0.18"/>
                    {/* Door */}
                    <rect x="48" y="48" width="24" height="22" rx="2" fill="var(--navy)" opacity="0.22"/>
                    {/* Windows */}
                    <rect x="28" y="38" width="16" height="14" rx="2" fill="var(--navy)" opacity="0.3"/>
                    <rect x="76" y="38" width="16" height="14" rx="2" fill="var(--navy)" opacity="0.3"/>
                    {/* Lift/ramp detail */}
                    <line x1="48" y1="70" x2="72" y2="70" stroke="var(--navy)" strokeWidth="2" opacity="0.3"/>
                    {/* Sign text */}
                    <rect x="38" y="14" width="44" height="8" rx="2" fill="var(--amber)" opacity="0.35"/>
                    <line x1="44" y1="18" x2="76" y2="18" stroke="var(--amber)" strokeWidth="2" opacity="0.6" strokeLinecap="round"/>
                  </svg>
                ),
              },
            ].map((cat, i) => (
              <Link key={i} href={cat.href} style={{ textDecoration: "none" }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = "var(--amber)";
                  el.style.boxShadow = "var(--shadow-lg)";
                  el.style.transform = "translateY(-4px)";
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = "var(--border)";
                  el.style.boxShadow = "var(--shadow-sm)";
                  el.style.transform = "none";
                }}
              >
                <div style={{
                  background: "var(--surface)",
                  border: "1.5px solid var(--border)",
                  borderRadius: 14,
                  padding: "20px 16px 18px",
                  textAlign: "center",
                  cursor: "pointer",
                  transition: "all 220ms ease",
                  boxShadow: "var(--shadow-sm)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 12,
                }}>
                  {/* Illustration box */}
                  <div style={{
                    width: "100%",
                    aspectRatio: "3/2",
                    background: "var(--bg)",
                    borderRadius: 8,
                    border: "1px solid var(--border)",
                    overflow: "hidden",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "8px 6px",
                  }}>
                    {cat.illustration}
                  </div>
                  <div>
                    <div style={{ fontFamily: "var(--font-space-grotesk, sans-serif)", fontWeight: 700, fontSize: "0.9rem", color: "var(--text)", marginBottom: 2 }}>
                      {cat.label}
                    </div>
                    <div style={{ fontSize: "0.74rem", color: "var(--text-muted)" }}>{cat.sub}</div>
                  </div>
                </div>
              </Link>
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
                <div style={{ width: 44, height: 44, background: "var(--navy)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: "white" }}>
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
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 12, color: "var(--text-muted)" }}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 17H3a2 2 0 01-2-2V9a2 2 0 012-2h3.44L8 4h8l1.56 3H21a2 2 0 012 2v6a2 2 0 01-2 2h-2" />
                  <circle cx="7" cy="17" r="2" /><circle cx="17" cy="17" r="2" />
                </svg>
              </div>
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
              { icon: <PhoneIcon />, title: "Call Us", body: "0743 645 366 / 0719 233 626", sub: "24/7 — always available", href: "tel:+254743645366" },
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
          .browse-by-type-grid { grid-template-columns: repeat(3, 1fr) !important; }
          .trust-grid { grid-template-columns: repeat(2,1fr) !important; }
          .products-grid { grid-template-columns: repeat(2,1fr) !important; }
          .why-reviews-grid { grid-template-columns: 1fr !important; }
          .contact-grid-3 { grid-template-columns: 1fr !important; }
          .footer-cols { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 640px) {
          .products-grid { grid-template-columns: 1fr !important; }
          .trust-grid { grid-template-columns: 1fr !important; }
          .browse-by-type-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .stats-grid { grid-template-columns: repeat(2,1fr) !important; }
          .footer-cols { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
