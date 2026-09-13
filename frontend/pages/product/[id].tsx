"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getProductImages } from "../../lib/productImages";

interface Product {
  id: number;
  name: string;
  description: string;
  category: string;
  price: number;
  currency: string;
  stock: number;
  icon?: string;
  gallery?: string[];
}

const FORMAT = (n: number) =>
  new Intl.NumberFormat("en-KE", { style: "currency", currency: "KES", maximumFractionDigits: 0 }).format(n);

function StarFill({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}
function ChevronLeft() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}
function ChevronRight() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}
function CartIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" />
    </svg>
  );
}
function HeartIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
    </svg>
  );
}
function CalendarIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}
function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
function ShareIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  );
}

const HIGHLIGHTS = [
  "Built and tested for East African road conditions",
  "Excellent low-end torque for Nairobi traffic",
  "Easy maintenance — parts available nationwide",
  "Fuel-efficient engine reduces operating costs",
  "Ready for business or personal transport",
];

const SPECS = [
  { label: "Engine", value: "1,000cc – 1,200cc" },
  { label: "Fuel Type", value: "Petrol" },
  { label: "Transmission", value: "Manual / Automatic" },
  { label: "Payload", value: "Up to 400 kg" },
  { label: "Warranty", value: "6 months / 10,000 km" },
  { label: "Certification", value: "KEBS Approved" },
];

export default function ProductDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState<"overview" | "specs" | "reviews">("overview");
  const [wishlist, setWishlist] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [cartError, setCartError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`)
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(d => { setProduct(d); setLoading(false); })
      .catch(() => { setProduct(null); setLoading(false); });
  }, [id]);

  if (loading) {
    return (
      <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg)" }}>
        <div style={{ textAlign: "center", color: "var(--text-muted)" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 17H3a2 2 0 01-2-2V9a2 2 0 012-2h3.44L8 4h8l1.56 3H21a2 2 0 012 2v6a2 2 0 01-2 2h-2" />
              <circle cx="7" cy="17" r="2" /><circle cx="17" cy="17" r="2" />
            </svg>
          </div>
          <div style={{ fontWeight: 600 }}>Loading vehicle details…</div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg)" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 16, color: "var(--text-muted)" }}>
            <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              <line x1="11" y1="8" x2="11" y2="14" /><line x1="8" y1="11" x2="14" y2="11" />
            </svg>
          </div>
          <h2 style={{ fontFamily: "var(--font-space-grotesk, sans-serif)", fontWeight: 700, color: "var(--text)", marginBottom: 8 }}>Vehicle Not Found</h2>
          <p style={{ color: "var(--text-secondary)", marginBottom: 24 }}>This vehicle may no longer be available.</p>
          <Link href="/inventory" style={{ display: "inline-flex", padding: "12px 24px", background: "var(--navy)", color: "white", borderRadius: 8, fontWeight: 600, textDecoration: "none", fontSize: "0.9rem" }}>
            Back to Inventory
          </Link>
        </div>
      </div>
    );
  }

  const gallery = product.gallery?.map(s => s.replace(/^\/images/, "")) ?? getProductImages(product.id);
  const currentImg = gallery[activeImg] ?? gallery[0];
  const inStock = product.stock > 0;

  const handleAddToCart = async () => {
    if (!product) return;
    setCartError(null);
    try {
      const cartId = localStorage.getItem("cartId") || undefined;
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(cartId ? { "x-cart-id": cartId } : {}),
        },
        body: JSON.stringify({ productId: product.id, quantity: qty }),
      });
      const data = await res.json();
      if (!res.ok) {
        setCartError(data.error || "Could not add to cart");
        return;
      }
      // Persist the cart ID for this session
      const returnedId = res.headers.get("x-cart-id");
      if (returnedId) localStorage.setItem("cartId", returnedId);
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2500);
    } catch {
      setCartError("Network error — please try again");
    }
  };

  return (
    <div style={{ background: "var(--bg)", color: "var(--text)", minHeight: "100vh" }}>
      {/* Breadcrumb */}
      <div style={{ background: "var(--surface)", borderBottom: "1px solid var(--border)", paddingBlock: 14 }}>
        <div className="container" style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.82rem", color: "var(--text-muted)" }}>
          <Link href="/" style={{ color: "var(--text-secondary)", textDecoration: "none" }}>Home</Link>
          <span>›</span>
          <Link href="/inventory" style={{ color: "var(--text-secondary)", textDecoration: "none" }}>Inventory</Link>
          <span>›</span>
          <span style={{ color: "var(--text)", fontWeight: 500 }}>{product.name}</span>
        </div>
      </div>

      {/* Main content */}
      <div className="container" style={{ paddingBlock: 40 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 48, alignItems: "start" }}>

          {/* ── Left: Image gallery ── */}
          <div>
            {/* Main image */}
            <div style={{ position: "relative", borderRadius: 12, overflow: "hidden", background: "var(--surface)", marginBottom: 12, border: "1px solid var(--border)" }}>
              <div style={{ aspectRatio: "4/3", position: "relative" }}>
                <Image src={currentImg} alt={`${product.name} — image ${activeImg + 1}`} fill style={{ objectFit: "cover" }} priority />
              </div>

              {/* Nav arrows */}
              {gallery.length > 1 && (
                <>
                  <button onClick={() => setActiveImg(i => (i - 1 + gallery.length) % gallery.length)}
                    style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", width: 40, height: 40, borderRadius: "50%", background: "rgba(255,255,255,0.9)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "var(--shadow-md)", color: "var(--navy)" }}>
                    <ChevronLeft />
                  </button>
                  <button onClick={() => setActiveImg(i => (i + 1) % gallery.length)}
                    style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", width: 40, height: 40, borderRadius: "50%", background: "rgba(255,255,255,0.9)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "var(--shadow-md)", color: "var(--navy)" }}>
                    <ChevronRight />
                  </button>
                </>
              )}

              {/* Counter */}
              <div style={{ position: "absolute", bottom: 12, right: 12, background: "rgba(9,30,51,0.7)", color: "white", fontSize: "0.75rem", fontWeight: 600, padding: "4px 10px", borderRadius: 20 }}>
                {activeImg + 1} / {gallery.length}
              </div>
            </div>

            {/* Thumbnails */}
            {gallery.length > 1 && (
              <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(gallery.length, 5)}, 1fr)`, gap: 8 }}>
                {gallery.map((src, i) => (
                  <button key={src + i} onClick={() => setActiveImg(i)}
                    style={{ position: "relative", aspectRatio: "4/3", borderRadius: 8, overflow: "hidden", border: `2px solid ${activeImg === i ? "var(--amber)" : "var(--border)"}`, background: "var(--surface)", cursor: "pointer", padding: 0, transition: "border-color 180ms ease" }}>
                    <Image src={src} alt={`Thumbnail ${i + 1}`} fill style={{ objectFit: "cover" }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Right: Product info ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Header */}
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                <div style={{ display: "flex", gap: 8 }}>
                  <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--amber)", background: "rgba(232,112,10,0.08)", border: "1px solid rgba(232,112,10,0.2)", padding: "3px 10px", borderRadius: 20, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                    {product.category}
                  </span>
                  <span style={{ fontSize: "0.7rem", fontWeight: 700, color: inStock ? "#059669" : "#DC2626", background: inStock ? "rgba(5,150,105,0.08)" : "rgba(220,38,38,0.08)", border: `1px solid ${inStock ? "rgba(5,150,105,0.2)" : "rgba(220,38,38,0.2)"}`, padding: "3px 10px", borderRadius: 20, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                    {inStock ? `In Stock (${product.stock})` : "Out of Stock"}
                  </span>
                </div>
                <button onClick={() => setWishlist(w => !w)}
                  style={{ width: 36, height: 36, borderRadius: 8, border: "1.5px solid var(--border)", background: "transparent", color: wishlist ? "#DC2626" : "var(--text-muted)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 180ms ease" }}>
                  <HeartIcon />
                </button>
              </div>

              <h1 style={{ fontFamily: "var(--font-space-grotesk, sans-serif)", fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 700, color: "var(--text)", margin: "0 0 10px", lineHeight: 1.15, letterSpacing: "-0.02em" }}>
                {product.name}
              </h1>

              {/* Stars */}
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ display: "flex", gap: 2, color: "#FBBF24" }}>{[1,2,3,4,5].map(s => <StarFill key={s} size={14} />)}</div>
                <span style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>4.9 / 5.0</span>
                <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>(12 verified reviews)</span>
              </div>
            </div>

            {/* Price box */}
            <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: 20 }}>
              <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>Starting Price</div>
              <div style={{ fontFamily: "var(--font-space-grotesk, sans-serif)", fontSize: "2rem", fontWeight: 700, color: "var(--navy)", lineHeight: 1, marginBottom: 4 }}>
                {FORMAT(product.price)}
              </div>
              <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                All prices in Kenyan Shillings. Financing available.
              </div>
            </div>

            {/* Quantity + CTA */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {/* Qty */}
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--text)", width: 70 }}>Quantity</div>
                <div style={{ display: "flex", alignItems: "center", gap: 0, border: "1.5px solid var(--border)", borderRadius: 8, overflow: "hidden" }}>
                  <button onClick={() => setQty(q => Math.max(1, q - 1))}
                    style={{ width: 40, height: 40, background: "var(--surface)", border: "none", color: "var(--text)", fontWeight: 700, fontSize: "1.1rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    −
                  </button>
                  <div style={{ width: 44, textAlign: "center", fontSize: "0.95rem", fontWeight: 700, color: "var(--text)" }}>{qty}</div>
                  <button onClick={() => setQty(q => Math.min(product.stock, q + 1))}
                    style={{ width: 40, height: 40, background: "var(--surface)", border: "none", color: "var(--text)", fontWeight: 700, fontSize: "1.1rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    +
                  </button>
                </div>
                <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>{product.stock} available</span>
              </div>

              {/* Buttons */}
              <button onClick={handleAddToCart} disabled={!inStock}
                style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, height: 52, background: addedToCart ? "#059669" : "var(--amber)", color: "white", border: "none", borderRadius: 10, fontSize: "0.9375rem", fontWeight: 700, cursor: inStock ? "pointer" : "not-allowed", transition: "background 200ms ease", opacity: inStock ? 1 : 0.5 }}>
                {addedToCart ? <><CheckIcon /> Added to Cart</> : <><CartIcon /> Add to Cart</>}
              </button>
              {cartError && (
                <div style={{ fontSize: "0.8rem", color: "#DC2626", marginTop: -4 }}>{cartError}</div>
              )}

              <Link href="/appointments" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, height: 48, background: "transparent", color: "var(--navy)", border: "1.5px solid var(--navy)", borderRadius: 10, fontSize: "0.9rem", fontWeight: 600, textDecoration: "none" }}>
                <CalendarIcon /> Book a Test Drive
              </Link>

              <button onClick={() => setWishlist(w => !w)}
                style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, height: 44, background: "transparent", color: wishlist ? "#DC2626" : "var(--text-secondary)", border: "1.5px solid var(--border)", borderRadius: 10, fontSize: "0.875rem", fontWeight: 600, cursor: "pointer", transition: "all 180ms ease" }}>
                <HeartIcon /> {wishlist ? "Saved to Wishlist" : "Add to Wishlist"}
              </button>
            </div>

            {/* Guarantees */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {[
                {
                  icon: (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                  ),
                  text: "6-month warranty",
                },
                {
                  icon: (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />
                    </svg>
                  ),
                  text: "Free inspection",
                },
                {
                  icon: (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
                    </svg>
                  ),
                  text: "Full documentation",
                },
                {
                  icon: (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 17H3a2 2 0 01-2-2V9a2 2 0 012-2h3.44L8 4h8l1.56 3H21a2 2 0 012 2v6a2 2 0 01-2 2h-2" />
                      <circle cx="7" cy="17" r="2" /><circle cx="17" cy="17" r="2" />
                    </svg>
                  ),
                  text: "Test drive available",
                },
              ].map((g, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 12px", background: "var(--surface)", borderRadius: 8, border: "1px solid var(--border)" }}>
                  <span style={{ color: "var(--amber)", flexShrink: 0 }}>{g.icon}</span>
                  <span style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--text)" }}>{g.text}</span>
                </div>
              ))}
            </div>

            {/* Share */}
            <button style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--text-muted)", background: "none", border: "none", cursor: "pointer", fontSize: "0.82rem", width: "fit-content" }}>
              <ShareIcon /> Share this vehicle
            </button>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div style={{ marginTop: 48 }}>
          <div style={{ display: "flex", gap: 0, borderBottom: "2px solid var(--border)", marginBottom: 32 }}>
            {(["overview", "specs", "reviews"] as const).map(t => (
              <button key={t} onClick={() => setActiveTab(t)}
                style={{ padding: "12px 24px", fontSize: "0.9rem", fontWeight: 600, color: activeTab === t ? "var(--navy)" : "var(--text-secondary)", background: "none", border: "none", borderBottom: `2px solid ${activeTab === t ? "var(--amber)" : "transparent"}`, marginBottom: -2, cursor: "pointer", textTransform: "capitalize", transition: "all 180ms ease" }}>
                {t === "overview" ? "Overview" : t === "specs" ? "Specifications" : "Reviews (12)"}
              </button>
            ))}
          </div>

          {activeTab === "overview" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40 }}>
              <div>
                <h3 style={{ fontFamily: "var(--font-space-grotesk, sans-serif)", fontWeight: 700, color: "var(--text)", marginBottom: 16 }}>Description</h3>
                <p style={{ color: "var(--text-secondary)", lineHeight: 1.8, fontSize: "0.9375rem" }}>{product.description}</p>
                <p style={{ color: "var(--text-secondary)", lineHeight: 1.8, fontSize: "0.9375rem", marginTop: 14 }}>
                  This vehicle has been thoroughly inspected by our KEBS-certified technicians and is ready for immediate use. All documentation is in order including logbook, insurance, and service history.
                </p>
              </div>
              <div>
                <h3 style={{ fontFamily: "var(--font-space-grotesk, sans-serif)", fontWeight: 700, color: "var(--text)", marginBottom: 16 }}>Highlights</h3>
                <div style={{ display: "grid", gap: 10 }}>
                  {HIGHLIGHTS.map((h, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                      <div style={{ width: 22, height: 22, borderRadius: "50%", background: "rgba(232,112,10,0.1)", border: "1.5px solid rgba(232,112,10,0.3)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: "var(--amber)", marginTop: 1 }}>
                        <CheckIcon />
                      </div>
                      <span style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "specs" && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
              {SPECS.map((s, i) => (
                <div key={i} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, padding: 20 }}>
                  <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>{s.label}</div>
                  <div style={{ fontFamily: "var(--font-space-grotesk, sans-serif)", fontWeight: 700, fontSize: "1rem", color: "var(--text)" }}>{s.value}</div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "reviews" && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 20 }}>
              {[
                { name: "James Kipchoge", vehicle: "Commercial Operator", rating: 5, comment: "Excellent build quality. Has handled heavy loads across Nairobi without any issues. Very happy with this purchase from AutoFix Kenya.", date: "May 2026" },
                { name: "Amara Okonkwo", vehicle: "Small Business Owner", rating: 5, comment: "The team at AutoFix Kenya was incredibly helpful. Vehicle was exactly as described and the delivery was smooth. Highly recommended!", date: "April 2026" },
                { name: "David Mwangi", vehicle: "Delivery Services", rating: 4, comment: "Great value for money. Fuel consumption is better than expected. The after-sales support from AutoFix is also top notch.", date: "March 2026" },
                { name: "Wanjiku Njeri", vehicle: "Matatu Operator", rating: 5, comment: "This is my second purchase from AutoFix Kenya. Consistent quality and honest pricing. I always recommend them to colleagues.", date: "February 2026" },
              ].map((r, i) => {
                const initials = r.name.split(" ").map(n => n[0]).join("").toUpperCase();
                const colors = ["#0F2A4A","#E8700A","#059669","#7C3AED"];
                return (
                  <div key={i} style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 12, padding: 24, display: "flex", flexDirection: "column", gap: 14 }}>
                    <div style={{ display: "flex", gap: 2, color: "#FBBF24" }}>{Array.from({length:r.rating}).map((_,s) => <StarFill key={s} size={14} />)}</div>
                    <p style={{ fontSize: "0.9375rem", lineHeight: 1.7, color: "var(--text)", margin: 0, fontStyle: "italic" }}>"{r.comment}"</p>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: "auto", paddingTop: 12, borderTop: "1px solid var(--border)" }}>
                      <div style={{ width: 36, height: 36, borderRadius: "50%", background: colors[i % colors.length], color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "0.8rem", flexShrink: 0 }}>{initials}</div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--text)" }}>{r.name}</div>
                        <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{r.vehicle} · {r.date}</div>
                      </div>
                      <div style={{ marginLeft: "auto", fontSize: "0.65rem", fontWeight: 700, color: "#059669", background: "rgba(5,150,105,0.08)", border: "1px solid rgba(5,150,105,0.2)", padding: "2px 8px", borderRadius: 20 }}>VERIFIED</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Back + Related CTA */}
        <div style={{ marginTop: 48, paddingTop: 32, borderTop: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <Link href="/inventory" style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "var(--text-secondary)", textDecoration: "none", fontWeight: 600, fontSize: "0.9rem" }}>
            <ChevronLeft /> Back to Inventory
          </Link>
          <div style={{ display: "flex", gap: 12 }}>
            <Link href="/appointments" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 20px", background: "var(--navy)", color: "white", borderRadius: 8, fontWeight: 600, textDecoration: "none", fontSize: "0.875rem" }}>
              <CalendarIcon /> Book a Service
            </Link>
            <Link href="/contact" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 20px", border: "1.5px solid var(--border)", color: "var(--text-secondary)", borderRadius: 8, fontWeight: 600, textDecoration: "none", fontSize: "0.875rem" }}>
              Make an Enquiry
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .container > div[style*="grid-template-columns: 1.1fr"] {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 640px) {
          .container > div[style*="grid-template-columns: repeat(2, 1fr)"] {
            grid-template-columns: 1fr !important;
          }
          .container > div[style*="grid-template-columns: repeat(3, 1fr)"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
