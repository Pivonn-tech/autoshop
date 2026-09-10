"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

interface Part {
  id: string;
  name: string;
  system: string;
  oem: string;
  price: string;
  priceNum: number;
  stock: number;
  fitment: string;
  description: string;
  icon: string;
}

const PARTS: Part[] = [
  { id: "prt-001", name: "Premium Brake Pad Set", system: "Braking", oem: "BP-4421", price: "KSh 8,500", priceNum: 8500, stock: 18, fitment: "Toyota Corolla, Axio, Fielder", description: "Low-dust ceramic pads for daily driving and city braking. Reduced noise and longer service life.", icon: "🛑" },
  { id: "prt-002", name: "Synthetic Oil Filter", system: "Engine", oem: "OF-1108", price: "KSh 1,800", priceNum: 1800, stock: 42, fitment: "Toyota, Nissan, Mazda petrol engines", description: "High-flow filter for clean oil circulation and longer service intervals.", icon: "🛢️" },
  { id: "prt-003", name: "Front Shock Absorber Pair", system: "Suspension", oem: "SH-9082", price: "KSh 18,900", priceNum: 18900, stock: 7, fitment: "Subaru Forester 2014–2019", description: "Balanced ride-control replacement for worn front suspension. OEM specification.", icon: "🔩" },
  { id: "prt-004", name: "Maintenance-Free Battery", system: "Electrical", oem: "BT-650N", price: "KSh 14,500", priceNum: 14500, stock: 12, fitment: "Most compact and mid-size vehicles", description: "Reliable cold starts with full charging-system test included. 2-year warranty.", icon: "🔋" },
  { id: "prt-005", name: "Timing Belt Kit", system: "Engine", oem: "TB-2290", price: "KSh 12,400", priceNum: 12400, stock: 9, fitment: "Honda Civic, Toyota Corolla 2010–2020", description: "Complete kit with belt, tensioner and idler pulley. Prevents costly engine damage.", icon: "⚙️" },
  { id: "prt-006", name: "Wiper Blade Set", system: "Body", oem: "WB-0320", price: "KSh 2,600", priceNum: 2600, stock: 35, fitment: "Universal fit — most passenger vehicles", description: "All-season silicone blades with improved streak-free performance in heavy rain.", icon: "🌧️" },
];

const SYSTEMS = ["All", ...Array.from(new Set(PARTS.map(p => p.system)))];

function ArrowRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
    </svg>
  );
}
function CartIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" />
    </svg>
  );
}
function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

const SYSTEM_COLORS: Record<string, string> = {
  Braking: "#DC2626",
  Engine: "#059669",
  Suspension: "#7C3AED",
  Electrical: "#E8700A",
  Body: "#0369A1",
};

export default function Parts() {
  const [system, setSystem] = useState("All");
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [hovered, setHovered] = useState<string | null>(null);
  const [addedCart, setAddedCart] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let result = PARTS.filter(p =>
      (system === "All" || p.system === system) &&
      (query === "" || p.name.toLowerCase().includes(query.toLowerCase()) || p.fitment.toLowerCase().includes(query.toLowerCase()))
    );
    if (sortBy === "price-low") result = [...result].sort((a, b) => a.priceNum - b.priceNum);
    if (sortBy === "price-high") result = [...result].sort((a, b) => b.priceNum - a.priceNum);
    if (sortBy === "stock") result = [...result].sort((a, b) => b.stock - a.stock);
    return result;
  }, [system, query, sortBy]);

  const handleAddCart = (id: string) => {
    setAddedCart(id);
    setTimeout(() => setAddedCart(null), 2000);
  };

  return (
    <div style={{ background: "var(--bg)", color: "var(--text)", minHeight: "100vh" }}>

      {/* Hero */}
      <div style={{ background: "var(--navy)", color: "white", paddingBlock: 56 }}>
        <div className="container">
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.78rem", color: "rgba(255,255,255,0.5)", marginBottom: 12 }}>
            <Link href="/" style={{ color: "inherit", textDecoration: "none" }}>Home</Link>
            <span>›</span>
            <span style={{ color: "rgba(255,255,255,0.9)" }}>Parts Catalog</span>
          </div>
          <h1 style={{ fontFamily: "var(--font-space-grotesk, sans-serif)", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 700, color: "white", margin: "0 0 12px", letterSpacing: "-0.025em" }}>
            Genuine Parts Catalog
          </h1>
          <p style={{ color: "rgba(255,255,255,0.65)", lineHeight: 1.7, fontSize: "1rem", maxWidth: 520, margin: 0 }}>
            OEM and quality aftermarket parts for all major vehicle models. Every part tested and backed by our 30-day guarantee.
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <div style={{ background: "var(--surface)", borderBottom: "1px solid var(--border)", paddingBlock: 20, position: "sticky", top: 68, zIndex: 10 }}>
        <div className="container">
          <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
            {/* Search */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, flex: "1 1 200px", minWidth: 160, height: 42, background: "var(--bg)", border: "1.5px solid var(--border)", borderRadius: 8, padding: "0 14px" }}>
              <SearchIcon />
              <input type="text" placeholder="Search parts or vehicle…" value={query} onChange={e => setQuery(e.target.value)}
                style={{ border: "none", outline: "none", background: "transparent", fontSize: "0.875rem", color: "var(--text)", flex: 1, fontFamily: "inherit" }} />
            </div>

            {/* Category tabs */}
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {SYSTEMS.map(s => (
                <button key={s} onClick={() => setSystem(s)}
                  style={{ height: 38, paddingInline: 16, borderRadius: 8, border: `1.5px solid ${system === s ? "var(--navy)" : "var(--border)"}`, background: system === s ? "var(--navy)" : "transparent", color: system === s ? "white" : "var(--text-secondary)", fontSize: "0.83rem", fontWeight: 600, cursor: "pointer", transition: "all 180ms ease" }}>
                  {s}
                </button>
              ))}
            </div>

            {/* Sort */}
            <select value={sortBy} onChange={e => setSortBy(e.target.value)}
              style={{ height: 42, paddingInline: 14, border: "1.5px solid var(--border)", borderRadius: 8, background: "var(--bg)", color: "var(--text)", fontSize: "0.83rem", outline: "none", flexShrink: 0 }}>
              <option value="default">Default Sort</option>
              <option value="price-low">Price: Low → High</option>
              <option value="price-high">Price: High → Low</option>
              <option value="stock">In-Stock First</option>
            </select>

            <div style={{ fontSize: "0.82rem", color: "var(--text-muted)", flexShrink: 0 }}>
              <strong style={{ color: "var(--text)" }}>{filtered.length}</strong> parts
            </div>
          </div>
        </div>
      </div>

      {/* Parts grid */}
      <section style={{ paddingBlock: 40 }}>
        <div className="container">
          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "64px 24px", background: "var(--surface)", borderRadius: 12, border: "1px solid var(--border)" }}>
              <div style={{ fontSize: "2.5rem", marginBottom: 12 }}>🔩</div>
              <div style={{ fontWeight: 700, color: "var(--text)", marginBottom: 8 }}>No parts match your search</div>
              <button onClick={() => { setQuery(""); setSystem("All"); }} style={{ marginTop: 4, padding: "10px 24px", background: "var(--navy)", color: "white", border: "none", borderRadius: 8, fontWeight: 600, cursor: "pointer", fontSize: "0.9rem" }}>
                Clear Filters
              </button>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>
              {filtered.map(part => {
                const catColor = SYSTEM_COLORS[part.system] || "var(--navy)";
                const isHovered = hovered === part.id;
                const isAdded = addedCart === part.id;
                return (
                  <div key={part.id}
                    onMouseEnter={() => setHovered(part.id)}
                    onMouseLeave={() => setHovered(null)}
                    style={{
                      background: "var(--bg)", border: `1px solid ${isHovered ? "var(--amber)" : "var(--border)"}`,
                      borderRadius: 12, overflow: "hidden",
                      boxShadow: isHovered ? "var(--shadow-lg)" : "var(--shadow-sm)",
                      transform: isHovered ? "translateY(-3px)" : "none",
                      transition: "all 220ms ease", display: "flex", flexDirection: "column",
                    }}
                  >
                    {/* Top color bar */}
                    <div style={{ height: 4, background: catColor }} />

                    <div style={{ padding: 24, flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
                      {/* Icon + category */}
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div style={{ width: 48, height: 48, background: `${catColor}12`, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.4rem" }}>
                          {part.icon}
                        </div>
                        <span style={{ fontSize: "0.68rem", fontWeight: 700, color: catColor, background: `${catColor}12`, border: `1px solid ${catColor}30`, padding: "3px 10px", borderRadius: 20, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                          {part.system}
                        </span>
                      </div>

                      {/* Name + OEM */}
                      <div>
                        <h3 style={{ fontFamily: "var(--font-space-grotesk, sans-serif)", fontWeight: 700, fontSize: "1rem", color: "var(--text)", margin: "0 0 4px", lineHeight: 1.3 }}>{part.name}</h3>
                        <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontFamily: "monospace", letterSpacing: "0.05em" }}>OEM: {part.oem}</div>
                      </div>

                      {/* Description */}
                      <p style={{ fontSize: "0.855rem", color: "var(--text-secondary)", margin: 0, lineHeight: 1.6 }}>{part.description}</p>

                      {/* Fitment */}
                      <div style={{ background: "var(--surface)", borderRadius: 7, padding: "8px 12px", fontSize: "0.78rem", color: "var(--text-secondary)" }}>
                        <span style={{ fontWeight: 700, color: "var(--text)" }}>Fits: </span>{part.fitment}
                      </div>

                      {/* Price + stock */}
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto", paddingTop: 12, borderTop: "1px solid var(--border)" }}>
                        <div>
                          <div style={{ fontSize: "0.68rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Price</div>
                          <div style={{ fontFamily: "var(--font-space-grotesk, sans-serif)", fontSize: "1.2rem", fontWeight: 700, color: "var(--navy)" }}>{part.price}</div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontSize: "0.68rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Stock</div>
                          <div style={{ fontWeight: 700, color: part.stock > 10 ? "#059669" : part.stock > 0 ? "#D97706" : "#DC2626", fontSize: "0.9rem" }}>
                            {part.stock > 0 ? `${part.stock} units` : "Out of stock"}
                          </div>
                        </div>
                      </div>

                      {/* CTA buttons */}
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                        <button onClick={() => handleAddCart(part.id)}
                          style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, height: 42, background: isAdded ? "#059669" : "var(--navy)", color: "white", border: "none", borderRadius: 8, fontSize: "0.82rem", fontWeight: 700, cursor: "pointer", transition: "background 180ms ease" }}>
                          <CartIcon /> {isAdded ? "Added!" : "Add to Cart"}
                        </button>
                        <Link href="/appointments" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, height: 42, background: "transparent", color: "var(--navy)", border: "1.5px solid var(--navy)", borderRadius: 8, fontSize: "0.82rem", fontWeight: 700, textDecoration: "none" }}>
                          Install <ArrowRight />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Trust band */}
      <section style={{ background: "var(--surface)", borderTop: "1px solid var(--border)", paddingBlock: 40 }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24 }}>
            {[
              { icon: "✅", title: "Genuine Parts", body: "OEM-certified or quality aftermarket — never counterfeit." },
              { icon: "📦", title: "Fast Delivery", body: "Same-day availability for most items in our catalog." },
              { icon: "🔁", title: "30-Day Returns", body: "Easy returns if the part doesn't fit or has defects." },
              { icon: "🔧", title: "Installation Service", body: "Book a fitting appointment with our certified technicians." },
            ].map((t, i) => (
              <div key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                <div style={{ width: 44, height: 44, background: "var(--navy)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem", flexShrink: 0 }}>{t.icon}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--text)", marginBottom: 3 }}>{t.title}</div>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>{t.body}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Can't find your part */}
      <section style={{ paddingBlock: 56, background: "var(--bg)", borderTop: "1px solid var(--border)", textAlign: "center" }}>
        <div className="container">
          <div style={{ maxWidth: 480, margin: "0 auto" }}>
            <div style={{ fontSize: "2rem", marginBottom: 12 }}>🔎</div>
            <h2 style={{ fontFamily: "var(--font-space-grotesk, sans-serif)", fontWeight: 700, fontSize: "1.4rem", color: "var(--text)", marginBottom: 10 }}>
              Can't find your part?
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.9375rem", lineHeight: 1.7, marginBottom: 24 }}>
              We source parts not listed in our catalog. Contact us with your vehicle details and the part you need — we'll find it.
            </p>
            <Link href="/contact" style={{ display: "inline-flex", alignItems: "center", gap: 8, height: 48, paddingInline: 24, background: "var(--amber)", color: "white", borderRadius: 8, fontWeight: 700, textDecoration: "none", fontSize: "0.9rem" }}>
              Request a Part <ArrowRight />
            </Link>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 768px) {
          .container > div[style*="grid-template-columns: repeat(4"] { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 640px) {
          .container > div[style*="grid-template-columns: repeat(4"] { grid-template-columns: 1fr !important; }
          .container > div[style*="grid-template-columns: repeat(auto-fill"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
