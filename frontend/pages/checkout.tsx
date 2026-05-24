"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Link from "next/link";

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

export default function Checkout() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") return;

    if (status === "unauthenticated") {
      router.push(`/auth/login?callbackUrl=/checkout`);
      return;
    }

    setIsLoading(false);
  }, [status, router]);

  if (isLoading || !session) {
    return (
      <div
        style={{
          backgroundColor: "#0A0A0A",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#FFFFFF",
        }}
      >
        <p>Redirecting to login...</p>
      </div>
    );
  }

  const [cartItems] = useState<CartItem[]>([
    { id: 1, name: "Brake Pads Premium", price: 15000, quantity: 2 },
    { id: 2, name: "Oil Filter Pro", price: 3500, quantity: 1 },
  ]);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
  });

  // Cyber/Sport Color Palette
  const colors = {
    background: "#0A0A0A",
    surface: "#1A1A1A",
    text: "#FFFFFF",
    accent: "#FFD700",
    textSecondary: "#666666",
  };

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );
  const shipping = 2500;
  const tax = Math.round(subtotal * 0.16);
  const total = subtotal + shipping + tax;

  const formatKES = (price: number) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div
      style={{
        backgroundColor: colors.background,
        color: colors.text,
        minHeight: "100vh",
      }}
    >
      {/* Navigation */}
      <nav
        style={{
          backgroundColor: colors.surface,
          padding: "1rem 2rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxShadow: `0 4px 6px rgba(0,0,0,0.3)`,
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <Link href="/" style={{ textDecoration: "none" }}>
          <div
            style={{
              fontSize: "1.5rem",
              fontWeight: "bold",
              color: colors.accent,
              cursor: "pointer",
            }}
          >
            AUTOFIX KENYA
          </div>
        </Link>
        <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
          <Link
            href="/parts"
            style={{
              color: colors.text,
              textDecoration: "none",
              cursor: "pointer",
            }}
          >
            Shop Parts
          </Link>
          <Link
            href="/services"
            style={{
              color: colors.text,
              textDecoration: "none",
              cursor: "pointer",
            }}
          >
            Services
          </Link>
        </div>
      </nav>

      {/* Checkout Container - Split Screen Layout (40% / 60%) */}
      <div style={{ display: "flex", minHeight: "calc(100vh - 70px)" }}>
        {/* Left Side - Checkout Form (40%) */}
        <div
          style={{
            width: "40%",
            padding: "3rem",
            backgroundColor: colors.background,
            overflowY: "auto",
          }}
        >
          <h1
            style={{ fontSize: "2rem", fontWeight: 900, marginBottom: "2rem" }}
          >
            Checkout
          </h1>

          {/* Shipping Information */}
          <div style={{ marginBottom: "3rem" }}>
            <h2
              style={{
                fontSize: "1.3rem",
                fontWeight: 900,
                marginBottom: "1.5rem",
                color: colors.accent,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Shipping Address
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
                marginBottom: "1rem",
              }}
            >
              <input
                type="text"
                placeholder="First Name"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
                style={{
                  padding: "0.75rem",
                  backgroundColor: colors.surface,
                  color: colors.text,
                  border: `1px solid ${colors.accent}`,
                  borderRadius: "4px",
                }}
              />
              <input
                type="text"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
                style={{
                  padding: "0.75rem",
                  backgroundColor: colors.surface,
                  color: colors.text,
                  border: `1px solid ${colors.accent}`,
                  borderRadius: "4px",
                }}
              />
            </div>
            <input
              type="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              style={{
                width: "100%",
                padding: "0.75rem",
                backgroundColor: colors.surface,
                color: colors.text,
                border: `1px solid ${colors.accent}`,
                borderRadius: "4px",
                marginBottom: "1rem",
              }}
            />
            <input
              type="tel"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              style={{
                width: "100%",
                padding: "0.75rem",
                backgroundColor: colors.surface,
                color: colors.text,
                border: `1px solid ${colors.accent}`,
                borderRadius: "4px",
                marginBottom: "1rem",
              }}
            />
            <input
              type="text"
              placeholder="Street Address"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              style={{
                width: "100%",
                padding: "0.75rem",
                backgroundColor: colors.surface,
                color: colors.text,
                border: `1px solid ${colors.accent}`,
                borderRadius: "4px",
                marginBottom: "1rem",
              }}
            />
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "2fr 1fr",
                gap: "1rem",
              }}
            >
              <input
                type="text"
                placeholder="City"
                value={formData.city}
                onChange={(e) =>
                  setFormData({ ...formData, city: e.target.value })
                }
                style={{
                  padding: "0.75rem",
                  backgroundColor: colors.surface,
                  color: colors.text,
                  border: `1px solid ${colors.accent}`,
                  borderRadius: "4px",
                }}
              />
              <input
                type="text"
                placeholder="Postal Code"
                value={formData.postalCode}
                onChange={(e) =>
                  setFormData({ ...formData, postalCode: e.target.value })
                }
                style={{
                  padding: "0.75rem",
                  backgroundColor: colors.surface,
                  color: colors.text,
                  border: `1px solid ${colors.accent}`,
                  borderRadius: "4px",
                }}
              />
            </div>
          </div>

          {/* Payment Information */}
          <div style={{ marginBottom: "3rem" }}>
            <h2
              style={{
                fontSize: "1.3rem",
                fontWeight: 900,
                marginBottom: "1.5rem",
                color: colors.accent,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Payment Method
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
                marginBottom: "1rem",
              }}
            >
              <button
                style={{
                  padding: "1rem",
                  backgroundColor: colors.surface,
                  color: colors.text,
                  border: `2px solid ${colors.accent}`,
                  borderRadius: "4px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  textTransform: "uppercase",
                }}
              >
                Card
              </button>
              <button
                style={{
                  padding: "1rem",
                  backgroundColor: colors.background,
                  color: colors.text,
                  border: `2px solid ${colors.textSecondary}`,
                  borderRadius: "4px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  textTransform: "uppercase",
                }}
              >
                M-Pesa
              </button>
            </div>
            <input
              type="text"
              placeholder="Card Number"
              style={{
                width: "100%",
                padding: "0.75rem",
                backgroundColor: colors.surface,
                color: colors.text,
                border: `1px solid ${colors.accent}`,
                borderRadius: "4px",
                marginBottom: "1rem",
              }}
            />
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "2fr 1fr 1fr",
                gap: "1rem",
              }}
            >
              <input
                type="text"
                placeholder="Cardholder Name"
                style={{
                  padding: "0.75rem",
                  backgroundColor: colors.surface,
                  color: colors.text,
                  border: `1px solid ${colors.accent}`,
                  borderRadius: "4px",
                }}
              />
              <input
                type="text"
                placeholder="MM/YY"
                style={{
                  padding: "0.75rem",
                  backgroundColor: colors.surface,
                  color: colors.text,
                  border: `1px solid ${colors.accent}`,
                  borderRadius: "4px",
                }}
              />
              <input
                type="text"
                placeholder="CVV"
                style={{
                  padding: "0.75rem",
                  backgroundColor: colors.surface,
                  color: colors.text,
                  border: `1px solid ${colors.accent}`,
                  borderRadius: "4px",
                }}
              />
            </div>
          </div>
        </div>

        {/* Right Side - Order Summary (60%) */}
        <div
          style={{
            width: "60%",
            backgroundColor: colors.surface,
            padding: "3rem",
            borderLeft: `1px solid ${colors.accent}`,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: 900,
              marginBottom: "2rem",
              color: colors.accent,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            Order Summary
          </h2>

          {/* Cart Items */}
          <div style={{ flex: 1, marginBottom: "2rem" }}>
            {cartItems.map((item) => (
              <div
                key={item.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "1rem",
                  marginBottom: "1rem",
                  backgroundColor: colors.background,
                  borderRadius: "4px",
                  border: `1px solid ${colors.textSecondary}`,
                }}
              >
                <div>
                  <p style={{ fontWeight: 900, marginBottom: "0.25rem" }}>
                    {item.name}
                  </p>
                  <p
                    style={{ color: colors.textSecondary, fontSize: "0.85rem" }}
                  >
                    Qty: {item.quantity}
                  </p>
                </div>
                <p
                  style={{
                    fontWeight: 900,
                    color: colors.accent,
                    fontSize: "1.1rem",
                  }}
                >
                  {formatKES(item.price * item.quantity)}
                </p>
              </div>
            ))}
          </div>

          {/* Summary Lines */}
          <div
            style={{
              paddingTop: "2rem",
              borderTop: `2px solid ${colors.accent}`,
              marginBottom: "2rem",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "1rem",
                paddingBottom: "1rem",
                borderBottom: `1px solid ${colors.textSecondary}`,
              }}
            >
              <span>Subtotal</span>
              <span>{formatKES(subtotal)}</span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "1rem",
                paddingBottom: "1rem",
                borderBottom: `1px solid ${colors.textSecondary}`,
              }}
            >
              <span>Shipping</span>
              <span>{formatKES(shipping)}</span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "1.5rem",
                paddingBottom: "1rem",
                borderBottom: `1px solid ${colors.textSecondary}`,
              }}
            >
              <span>Tax (16%)</span>
              <span>{formatKES(tax)}</span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "1.5rem",
                fontWeight: 900,
                color: colors.accent,
              }}
            >
              <span>Total</span>
              <span>{formatKES(total)}</span>
            </div>
          </div>

          {/* Checkout Button */}
          <button
            style={{
              width: "100%",
              backgroundColor: colors.accent,
              color: colors.background,
              border: "none",
              padding: "1rem",
              borderRadius: "2px",
              fontWeight: 900,
              fontSize: "1rem",
              cursor: "pointer",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              marginBottom: "1rem",
            }}
            onClick={() =>
              alert(
                "Order placed! Order confirmation has been sent to your email.",
              )
            }
          >
            Place Order
          </button>

          <Link
            href="/parts"
            style={{ textDecoration: "none", textAlign: "center" }}
          >
            <button
              style={{
                width: "100%",
                backgroundColor: colors.background,
                color: colors.accent,
                border: `2px solid ${colors.accent}`,
                padding: "1rem",
                borderRadius: "2px",
                fontWeight: 900,
                cursor: "pointer",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Continue Shopping
            </button>
          </Link>

          {/* Security Badge */}
          <div
            style={{
              marginTop: "2rem",
              padding: "1rem",
              backgroundColor: colors.background,
              borderRadius: "4px",
              textAlign: "center",
              border: `1px solid ${colors.accent}`,
            }}
          >
            <p
              style={{
                color: colors.accent,
                fontWeight: 900,
                marginBottom: "0.5rem",
              }}
            >
              ✓ Secure Checkout
            </p>
            <p style={{ color: colors.textSecondary, fontSize: "0.85rem" }}>
              Your payment information is encrypted and secure
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
