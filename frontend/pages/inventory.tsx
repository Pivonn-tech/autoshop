import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import { getProductCardImage } from "../lib/productImages";

interface Product {
  id: number;
  name: string;
  description: string;
  category: string;
  price: number;
  currency?: string;
  stock?: number;
}

const FORMAT = (n: number) =>
  new Intl.NumberFormat("en-KE", { style: "currency", currency: "KES", maximumFractionDigits: 0 }).format(n);

function ArrowRight() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
    </svg>
  );
}
function GridIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
    </svg>
  );
}
function ListIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
  );
}
function StarFill() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function SkeletonCard() {
  return (
    <div style={{ border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden", background: "var(--bg)" }}>
      <div style={{ aspectRatio: "16/10", background: "var(--surface-2)" }} />
      <div style={{ padding: 20, display: "grid", gap: 10 }}>
        {[70, 90, 55, 40].map((w, i) => (
          <div key={i} style={{ height: 12, background: "var(--surface-2)", borderRadius: 4, width: `${w}%`, opacity: 0.6 }} />
        ))}
      </div>
    </div>
  );
}

function ProductCard({ product, view }: { product: Product; view: "grid" | "list" }) {
  const [hovered, setHovered] = useState(false);
  const img = getProductCardImage(product.id);

  if (view === "list") {
    return (
      <Link href={`/product/${product.id}`} style={{ textDecoration: "none" }}>
        <div
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{
            display: "flex", gap: 0, background: "var(--bg)",
            border: `1px solid ${hovered ? "var(--amber)" : "var(--border)"}`,
            borderRadius: 12, overflow: "hidden",
            boxShadow: hovered ? "var(--shadow-lg)" : "var(--shadow-sm)",
            transition: "all 220ms ease",
          }}
        >
          <div style={{ width: 260, flexShrink: 0, position: "relative", overflow: "hidden" }}>
            <Image src={img} alt={product.name} fill style={{ objectFit: "cover", transition: "transform 400ms ease", transform: hovered ? "scale(1.05)" : "scale(1)" }} />
          </div>
          <div style={{ flex: 1, padding: "24px 28px", display: "flex", flexDirection: "column", gap: 10, justifyContent: "center" }}>
            <div style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--amber)", letterSpacing: "0.1em", textTransform: "uppercase" }}>{product.category}</div>
            <h3 style={{ fontFamily: "var(--font-space-grotesk, sans-serif)", fontSize: "1.2rem", fontWeight: 700, color: "var(--text)", margin: 0 }}>{product.name}</h3>
            <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", margin: 0, lineHeight: 1.6, maxWidth: 520 }}>{product.description}</p>
            <div style={{ display: "flex", gap: 3, color: "#FBBF24", marginTop: 2 }}>{[1,2,3,4,5].map(s => <StarFill key={s} />)}<span style={{ color: "var(--text-muted)", fontSize: "0.75rem", marginLeft: 4 }}>(12)</span></div>
          </div>
          <div style={{ padding: "24px 28px", display: "flex", flexDirection: "column", alignItems: "flex-end", justifyContent: "center", gap: 16, flexShrink: 0 }}>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "0.68rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>From</div>
              <div style={{ fontFamily: "var(--font-space-grotesk, sans-serif)", fontSize: "1.4rem", fontWeight: 700, color: "var(--navy)" }}>{FORMAT(product.price)}</div>
            </div>
            {product.stock !== undefined && product.stock < 3 && (
              <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#DC2626", background: "rgba(220,38,38,0.08)", padding: "3px 10px", borderRadius: 20 }}>{product.stock} left</div>
            )}
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 20px", background: hovered ? "var(--amber)" : "var(--navy)", color: "white", borderRadius: 8, fontSize: "0.85rem", fontWeight: 600, transition: "background 180ms ease" }}>
              View Details <ArrowRight />
            </span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/product/${product.id}`} style={{ textDecoration: "none" }}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: "var(--bg)",
          border: `1px solid ${hovered ? "var(--amber)" : "var(--border)"}`,
          borderRadius: 12, overflow: "hidden",
          boxShadow: hovered ? "var(--shadow-xl)" : "var(--shadow-sm)",
          transform: hovered ? "translateY(-4px)" : "none",
          transition: "all 220ms ease", display: "flex", flexDirection: "column",
        }}
      >
        <div style={{ position: "relative", aspectRatio: "16/10", background: "var(--surface)", overflow: "hidden" }}>
          <Image src={img} alt={product.name} fill style={{ objectFit: "cover", transition: "transform 400ms ease", transform: hovered ? "scale(1.05)" : "scale(1)" }} />
          <div style={{ position: "absolute", top: 12, left: 12, background: "var(--navy)", color: "white", fontSize: "0.68rem", fontWeight: 700, padding: "4px 10px", borderRadius: 20, letterSpacing: "0.06em", textTransform: "uppercase" }}>{product.category}</div>
          {product.stock !== undefined && product.stock < 3 && (
            <div style={{ position: "absolute", top: 12, right: 12, background: "#DC2626", color: "white", fontSize: "0.68rem", fontWeight: 700, padding: "4px 10px", borderRadius: 20 }}>{product.stock} left</div>
          )}
        </div>
        <div style={{ padding: 20, flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
          <div>
            <div style={{ fontSize: "0.68rem", fontWeight: 700, color: "var(--amber)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>Melvin Vehicles</div>
            <h3 style={{ fontFamily: "var(--font-space-grotesk, sans-serif)", fontSize: "1rem", fontWeight: 700, color: "var(--text)", margin: 0, lineHeight: 1.3 }}>{product.name}</h3>
          </div>
          <p style={{ fontSize: "0.835rem", color: "var(--text-secondary)", margin: 0, lineHeight: 1.55, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{product.description}</p>
          <div style={{ display: "flex", gap: 3, color: "#FBBF24" }}>{[1,2,3,4,5].map(s => <StarFill key={s} />)}<span style={{ color: "var(--text-muted)", fontSize: "0.72rem", marginLeft: 4 }}>(12)</span></div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto", paddingTop: 12, borderTop: "1px solid var(--border)" }}>
            <div>
              <div style={{ fontSize: "0.68rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>From</div>
              <div style={{ fontFamily: "var(--font-space-grotesk, sans-serif)", fontSize: "1.2rem", fontWeight: 700, color: "var(--navy)" }}>{FORMAT(product.price)}</div>
            </div>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "8px 14px", background: hovered ? "var(--amber)" : "var(--navy)", color: "white", borderRadius: 7, fontSize: "0.78rem", fontWeight: 600, transition: "background 180ms ease" }}>
              View <ArrowRight />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function Inventory() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("newest");
  const [maxPrice, setMaxPrice] = useState(2000000);
  const [category, setCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [filtersReady, setFiltersReady] = useState(false);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`)
      .then(r => r.json())
      .then(d => { setProducts(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  // Initialise filters from URL query params once router is ready
  useEffect(() => {
    if (!router.isReady) return;
    const { q, category: cat, maxPrice: mp, condition } = router.query;
    if (q) setSearchQuery(String(q));
    if (cat) setCategory(String(cat));
    if (mp) setMaxPrice(Number(mp));
    // condition param noted — will be wired when backend supports it
    void condition;
    setFiltersReady(true);
  }, [router.isReady, router.query]);

  const categories = ["All", ...Array.from(new Set(products.map(p => p.category)))];

  const filtered = useMemo(() => {
    return products
      .filter(p => {
        const matchesPrice = p.price <= maxPrice;
        const matchesCategory = category === "All" || p.category === category;
        const matchesSearch = searchQuery === "" ||
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesPrice && matchesCategory && matchesSearch;
      })
      .sort((a, b) => sortBy === "price-low" ? a.price - b.price : sortBy === "price-high" ? b.price - a.price : b.id - a.id);
  }, [products, maxPrice, category, sortBy, searchQuery]);

  const resetFilters = () => {
    setMaxPrice(2000000);
    setCategory("All");
    setSortBy("newest");
    setSearchQuery("");
    router.replace("/inventory", undefined, { shallow: true });
  };

  return (
    <div style={{ background: "var(--bg)", color: "var(--text)", minHeight: "100vh" }}>
      {/* Page hero */}
      <div style={{ background: "var(--navy)", color: "white", paddingBlock: 48 }}>
        <div className="container">
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.78rem", color: "rgba(255,255,255,0.5)", marginBottom: 12 }}>
            <Link href="/" style={{ color: "inherit", textDecoration: "none" }}>Home</Link>
            <span>›</span>
            <span style={{ color: "rgba(255,255,255,0.9)" }}>Vehicle Inventory</span>
          </div>
          <h1 style={{ fontFamily: "var(--font-space-grotesk, sans-serif)", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 700, color: "white", margin: 0, letterSpacing: "-0.02em" }}>
            Vehicle Inventory
          </h1>
          <p style={{ color: "rgba(255,255,255,0.65)", marginTop: 10, fontSize: "1rem", lineHeight: 1.65 }}>
            Commercial trucks, motorcycles &amp; delivery vehicles — inspected, certified, ready for Kenyan roads.
          </p>
        </div>
      </div>

      {/* Main layout */}
      <div className="container" style={{ paddingBlock: 40, display: "grid", gridTemplateColumns: "260px 1fr", gap: 32, alignItems: "start" }}>

        {/* ── Sidebar Filters ── */}
        <aside style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 12, padding: 24, position: "sticky", top: 90, boxShadow: "var(--shadow-sm)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <span style={{ fontFamily: "var(--font-space-grotesk, sans-serif)", fontWeight: 700, fontSize: "1rem", color: "var(--text)" }}>Filters</span>
            <button onClick={resetFilters} style={{ fontSize: "0.78rem", color: "var(--amber)", fontWeight: 600, background: "none", border: "none", cursor: "pointer", padding: 0 }}>
              Reset all
            </button>
          </div>

          {/* Category */}
          <div style={{ paddingBlock: 18, borderBottom: "1px solid var(--border)" }}>
            <div style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 12 }}>Category</div>
            {categories.map(c => (
              <label key={c} style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 0", cursor: "pointer", fontSize: "0.9rem", color: category === c ? "var(--navy)" : "var(--text)", fontWeight: category === c ? 600 : 400 }}>
                <input type="radio" name="category" checked={category === c} onChange={() => setCategory(c)} style={{ accentColor: "var(--navy)", width: 15, height: 15 }} />
                {c}
              </label>
            ))}
          </div>

          {/* Price */}
          <div style={{ paddingBlock: 18, borderBottom: "1px solid var(--border)" }}>
            <div style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 12 }}>Max Price</div>
            <input type="range" min={0} max={2000000} step={50000} value={maxPrice} onChange={e => setMaxPrice(Number(e.target.value))}
              style={{ width: "100%", accentColor: "var(--navy)", marginBottom: 10 }} />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", color: "var(--text-secondary)" }}>
              <span>KSh 0</span><span style={{ fontWeight: 600, color: "var(--navy)" }}>{FORMAT(maxPrice)}</span>
            </div>
          </div>

          {/* Sort */}
          <div style={{ paddingBlock: 18 }}>
            <div style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 12 }}>Sort By</div>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)}
              style={{ width: "100%", height: 44, padding: "0 12px", border: "1.5px solid var(--border)", borderRadius: 8, background: "var(--bg)", color: "var(--text)", fontSize: "0.9rem", outline: "none" }}>
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low → High</option>
              <option value="price-high">Price: High → Low</option>
            </select>
          </div>

          {/* Contact CTA */}
          <div style={{ marginTop: 4, padding: 16, background: "rgba(15,42,74,0.04)", borderRadius: 10, border: "1px solid rgba(15,42,74,0.1)", textAlign: "center" }}>
            <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--navy)", marginBottom: 6 }}>Need help choosing?</div>
            <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginBottom: 10, lineHeight: 1.5 }}>Our team is ready to assist you</div>
            <Link href="/contact" style={{ display: "block", textAlign: "center", padding: "9px 0", background: "var(--navy)", color: "white", borderRadius: 7, fontSize: "0.82rem", fontWeight: 700, textDecoration: "none" }}>
              Contact Us
            </Link>
          </div>
        </aside>

        {/* ── Main Content ── */}
        <main>
          {/* Search bar */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, height: 44, background: "var(--bg)", border: "1.5px solid var(--border)", borderRadius: 9, padding: "0 14px" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, color: "var(--text-muted)" }}>
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              type="text"
              placeholder="Search vehicles by name, type…"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ border: "none", outline: "none", background: "transparent", fontSize: "0.9rem", color: "var(--text)", flex: 1, fontFamily: "inherit" }}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: 0, lineHeight: 1 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            )}
          </div>

          {/* Toolbar */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
            <div style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>
              Showing <strong style={{ color: "var(--text)" }}>{filtered.length}</strong> vehicles
              {category !== "All" && <span> in <strong style={{ color: "var(--navy)" }}>{category}</strong></span>}
              {searchQuery && <span> matching <strong style={{ color: "var(--amber)" }}>"{searchQuery}"</strong></span>}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {[{ v: "grid" as const, icon: <GridIcon /> }, { v: "list" as const, icon: <ListIcon /> }].map(({ v, icon }) => (
                <button key={v} onClick={() => setView(v)}
                  style={{ width: 38, height: 38, borderRadius: 8, border: `1.5px solid ${view === v ? "var(--navy)" : "var(--border)"}`, background: view === v ? "var(--navy)" : "transparent", color: view === v ? "white" : "var(--text-secondary)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 180ms ease" }}>
                  {icon}
                </button>
              ))}
            </div>
          </div>

          {/* Results */}
          {loading || !filtersReady ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 24 }}>
              {[1,2,3,4].map(i => <SkeletonCard key={i} />)}
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "64px 24px", background: "var(--surface)", borderRadius: 12, border: "1px solid var(--border)" }}>
              <div style={{ fontSize: "2.5rem", marginBottom: 12 }}>🔍</div>
              <div style={{ fontWeight: 700, color: "var(--text)", marginBottom: 8 }}>No vehicles match these filters</div>
              <button onClick={resetFilters} style={{ marginTop: 4, padding: "10px 24px", background: "var(--navy)", color: "white", border: "none", borderRadius: 8, fontWeight: 600, cursor: "pointer", fontSize: "0.9rem" }}>
                Clear Filters
              </button>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: view === "grid" ? "repeat(2, minmax(0,1fr))" : "1fr", gap: view === "grid" ? 24 : 16 }}>
              {filtered.map(p => <ProductCard key={p.id} product={p} view={view} />)}
            </div>
          )}
        </main>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .container > div[style*="grid-template-columns: 260px"] {
            grid-template-columns: 1fr !important;
          }
          aside[style*="sticky"] { position: static !important; }
        }
      `}</style>
    </div>
  );
}
