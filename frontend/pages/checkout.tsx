"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

interface CartItem {
  id: string | number;
  name: string;
  price: number;
  image: string | null;
  quantity: number;
}

const FORMAT = (n: number) =>
  new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    maximumFractionDigits: 0,
  }).format(n);

function CheckIcon() {
  return (
    <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><polyline points="9 12 11 14 15 10" />
    </svg>
  );
}
function TrashIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4h6v2" />
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

export default function Checkout() {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Contact / shipping fields
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const cartId = typeof window !== "undefined" ? localStorage.getItem("cartId") : null;

  const fetchCart = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart`, {
        headers: cartId ? { "x-cart-id": cartId } : {},
      });
      const data = await res.json();
      setCart(data.items || []);
      setTotal(parseFloat(data.total) || 0);
    } catch {
      setCart([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const removeItem = async (productId: string | number) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/remove`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(cartId ? { "x-cart-id": cartId } : {}),
        },
        body: JSON.stringify({ productId }),
      });
      fetchCart();
    } catch { /* silent */ }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(cartId ? { "x-cart-id": cartId } : {}),
        },
        body: JSON.stringify({
          email,
          shippingAddress: { name, phone, address },
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Order failed. Please try again.");
        return;
      }
      // Clear cart from localStorage
      localStorage.removeItem("cartId");
      setOrderId(data.orderId);
      setSubmitted(true);
    } catch {
      setError("Network error — please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Success screen ────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div style={{ background: "var(--bg)", minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", maxWidth: 480, padding: 40 }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}><CheckIcon /></div>
          <h2 style={{ fontFamily: "var(--font-space-grotesk, sans-serif)", fontSize: "1.8rem", fontWeight: 700, color: "var(--text)", marginBottom: 12 }}>
            Order Placed!
          </h2>
          <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: 8 }}>
            Thank you, <strong>{name}</strong>. Your order <strong>{orderId}</strong> has been received.
          </p>
          <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: 28 }}>
            A confirmation will be sent to <strong>{email}</strong>.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/dashboard" style={{ display: "inline-flex", alignItems: "center", gap: 8, height: 48, paddingInline: 24, background: "var(--amber)", color: "white", borderRadius: 8, fontWeight: 700, textDecoration: "none", fontSize: "0.9rem" }}>
              My Dashboard <ArrowRight />
            </Link>
            <Link href="/appointments" style={{ display: "inline-flex", alignItems: "center", gap: 8, height: 48, paddingInline: 24, border: "1.5px solid var(--border)", color: "var(--text-secondary)", borderRadius: 8, fontWeight: 600, textDecoration: "none", fontSize: "0.9rem" }}>
              Book Installation
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── Empty cart ────────────────────────────────────────────────────────────
  if (!loading && cart.length === 0) {
    return (
      <div style={{ background: "var(--bg)", minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", maxWidth: 400, padding: 40 }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 16, color: "var(--text-muted)" }}>
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" />
            </svg>
          </div>
          <h2 style={{ fontFamily: "var(--font-space-grotesk, sans-serif)", fontWeight: 700, color: "var(--text)", marginBottom: 10 }}>Your cart is empty</h2>
          <p style={{ color: "var(--text-secondary)", marginBottom: 24, lineHeight: 1.7 }}>Add vehicles or parts before checking out.</p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            <Link href="/inventory" style={{ display: "inline-flex", alignItems: "center", gap: 8, height: 48, paddingInline: 24, background: "var(--navy)", color: "white", borderRadius: 8, fontWeight: 700, textDecoration: "none", fontSize: "0.9rem" }}>
              Browse Vehicles <ArrowRight />
            </Link>
            <Link href="/parts" style={{ display: "inline-flex", alignItems: "center", gap: 8, height: 48, paddingInline: 24, border: "1.5px solid var(--border)", color: "var(--text-secondary)", borderRadius: 8, fontWeight: 600, textDecoration: "none", fontSize: "0.9rem" }}>
              Browse Parts
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── Main checkout ─────────────────────────────────────────────────────────
  return (
    <div style={{ background: "var(--bg)", color: "var(--text)", minHeight: "100vh" }}>

      {/* Hero */}
      <div style={{ background: "var(--navy)", color: "white", paddingBlock: 48 }}>
        <div className="container">
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.78rem", color: "rgba(255,255,255,0.5)", marginBottom: 12 }}>
            <Link href="/" style={{ color: "inherit", textDecoration: "none" }}>Home</Link>
            <span>›</span>
            <span style={{ color: "rgba(255,255,255,0.9)" }}>Checkout</span>
          </div>
          <h1 style={{ fontFamily: "var(--font-space-grotesk, sans-serif)", fontSize: "clamp(1.8rem, 4vw, 2.6rem)", fontWeight: 700, color: "white", margin: "0 0 10px", letterSpacing: "-0.025em" }}>
            Checkout
          </h1>
          <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "1rem", lineHeight: 1.65, margin: 0 }}>
            Review your order and enter your details to confirm.
          </p>
        </div>
      </div>

      <div className="container" style={{ paddingBlock: 40 }}>
        <form onSubmit={handleSubmit}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 40, alignItems: "start" }}>

            {/* ── Left: contact details ── */}
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

              {/* Contact */}
              <div style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden", boxShadow: "var(--shadow-sm)" }}>
                <div style={{ padding: "18px 24px", borderBottom: "1px solid var(--border)", background: "var(--surface)" }}>
                  <h2 style={{ fontFamily: "var(--font-space-grotesk, sans-serif)", fontWeight: 700, fontSize: "1rem", color: "var(--text)", margin: 0 }}>Contact Details</h2>
                </div>
                <div style={{ padding: 24, display: "grid", gap: 16 }}>
                  {[
                    { label: "Full Name", value: name, set: setName, type: "text", placeholder: "Grace Wanjiku", required: true },
                    { label: "Email Address", value: email, set: setEmail, type: "email", placeholder: "you@example.com", required: true },
                    { label: "Phone Number", value: phone, set: setPhone, type: "tel", placeholder: "+254 7XX XXX XXX", required: true },
                  ].map((f) => (
                    <div key={f.label}>
                      <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, color: "var(--text)", marginBottom: 6 }}>{f.label} {f.required && "*"}</label>
                      <input
                        type={f.type} value={f.value} required={f.required} placeholder={f.placeholder}
                        onChange={(e) => f.set(e.target.value)}
                        style={{ width: "100%", height: 48, paddingInline: 14, background: "var(--bg)", border: "1.5px solid var(--border)", borderRadius: 8, color: "var(--text)", fontSize: "0.9375rem", outline: "none", fontFamily: "inherit", boxSizing: "border-box" }}
                      />
                    </div>
                  ))}
                  <div>
                    <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, color: "var(--text)", marginBottom: 6 }}>Delivery / Collection Address *</label>
                    <textarea
                      value={address} required placeholder="Street, area, city…"
                      onChange={(e) => setAddress(e.target.value)}
                      style={{ width: "100%", height: 88, paddingInline: 14, paddingBlock: 12, background: "var(--bg)", border: "1.5px solid var(--border)", borderRadius: 8, color: "var(--text)", fontSize: "0.9375rem", outline: "none", fontFamily: "inherit", resize: "vertical", boxSizing: "border-box" }}
                    />
                  </div>
                </div>
              </div>

              {/* Payment notice */}
              <div style={{ background: "rgba(232,112,10,0.06)", border: "1.5px solid rgba(232,112,10,0.2)", borderRadius: 10, padding: "16px 20px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 700, color: "var(--navy)", fontSize: "0.875rem", marginBottom: 4 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="5" width="20" height="14" rx="2" />
                    <line x1="2" y1="10" x2="22" y2="10" />
                  </svg>
                  Payment on Collection / Delivery
                </div>
                <div style={{ fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                  Our team will contact you to confirm payment method (M-Pesa, cash, or bank transfer) before dispatch.
                </div>
              </div>
            </div>

            {/* ── Right: order summary ── */}
            <div style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden", boxShadow: "var(--shadow-sm)", position: "sticky", top: 90 }}>
              <div style={{ padding: "18px 24px", borderBottom: "1px solid var(--border)", background: "var(--surface)" }}>
                <h2 style={{ fontFamily: "var(--font-space-grotesk, sans-serif)", fontWeight: 700, fontSize: "1rem", color: "var(--text)", margin: 0 }}>
                  Order Summary ({cart.length} {cart.length === 1 ? "item" : "items"})
                </h2>
              </div>

              <div style={{ padding: "16px 24px" }}>
                {loading ? (
                  <div style={{ color: "var(--text-muted)", fontSize: "0.9rem", textAlign: "center", padding: "20px 0" }}>Loading cart…</div>
                ) : (
                  <>
                    {cart.map((item) => (
                      <div key={String(item.id)} style={{ display: "flex", alignItems: "center", gap: 12, paddingBlock: 12, borderBottom: "1px solid var(--border)" }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 600, fontSize: "0.9rem", color: "var(--text)", marginBottom: 2 }}>{item.name}</div>
                          <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>Qty: {item.quantity}</div>
                        </div>
                        <div style={{ fontFamily: "var(--font-space-grotesk, sans-serif)", fontWeight: 700, color: "var(--navy)", fontSize: "0.9rem", flexShrink: 0 }}>
                          {FORMAT(item.price * item.quantity)}
                        </div>
                        <button type="button" onClick={() => removeItem(item.id)}
                          style={{ width: 30, height: 30, borderRadius: 6, border: "1px solid var(--border)", background: "transparent", color: "var(--text-muted)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
                          <TrashIcon />
                        </button>
                      </div>
                    ))}

                    {/* Total */}
                    <div style={{ paddingTop: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--text)" }}>Total</div>
                      <div style={{ fontFamily: "var(--font-space-grotesk, sans-serif)", fontSize: "1.4rem", fontWeight: 700, color: "var(--navy)" }}>{FORMAT(total)}</div>
                    </div>
                  </>
                )}
              </div>

              {error && (
                <div style={{ margin: "0 24px 16px", padding: "12px 16px", background: "rgba(220,38,38,0.06)", border: "1px solid rgba(220,38,38,0.2)", borderRadius: 8, fontSize: "0.85rem", color: "#DC2626" }}>
                  {error}
                </div>
              )}

              <div style={{ padding: "0 24px 24px", display: "flex", flexDirection: "column", gap: 10 }}>
                <button type="submit" disabled={submitting || loading || cart.length === 0}
                  style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, height: 52, background: "#059669", color: "white", border: "none", borderRadius: 10, fontSize: "0.9375rem", fontWeight: 700, cursor: submitting ? "not-allowed" : "pointer", opacity: submitting ? 0.7 : 1 }}>
                  {submitting ? "Placing Order…" : <>Confirm Order <ArrowRight /></>}
                </button>
                <Link href="/inventory" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, height: 44, border: "1.5px solid var(--border)", color: "var(--text-secondary)", borderRadius: 10, fontSize: "0.875rem", fontWeight: 600, textDecoration: "none" }}>
                  ← Continue Shopping
                </Link>
              </div>
            </div>

          </div>
        </form>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .container > form > div[style*="grid-template-columns: 1fr 380px"] {
            grid-template-columns: 1fr !important;
          }
          div[style*="position: sticky"][style*="top: 90"] { position: static !important; }
        }
      `}</style>
    </div>
  );
}
