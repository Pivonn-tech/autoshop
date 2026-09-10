"use client";

import Image from "next/image";
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
  icon: string;
  image?: string;
  gallery?: string[];
}

const colors = {
  background: "var(--bg-color)",
  surface: "var(--surface-color)",
  text: "var(--text-color)",
  accent: "var(--accent-color)",
  textSecondary: "var(--text-secondary-color)",
  accent10: "var(--accent-color-10)",
  primary60: "var(--bg-color)",
  dark: "var(--surface-strong-color)",
};

const formatKES = (price: number) => {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    minimumFractionDigits: 0,
  }).format(price);
};

export default function ProductDetails() {
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    fetch(`http://localhost:3001/api/products/${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Product ${id} not found`);
        }
        return res.json();
      })
      .then((data: Product) => {
        setProduct(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch product:", error);
        setProduct(null);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div
        style={{
          backgroundColor: colors.background,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p style={{ color: colors.text, fontSize: "1.25rem" }}>
          Loading product details...
        </p>
      </div>
    );
  }

  if (!product) {
    return (
      <div
        style={{
          backgroundColor: colors.background,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p style={{ color: colors.accent, fontSize: "1.25rem" }}>
          Product not found
        </p>
      </div>
    );
  }

  const gallery =
    product.gallery?.map((src) => src.replace(/^\/images/, "")) ??
    getProductImages(product.id);
  const activeImage = gallery[selectedImageIndex] ?? gallery[0];

  return (
    <div
      style={{
        backgroundColor: colors.background,
        color: colors.text,
        minHeight: "100vh",
      }}
    >
      <nav
        style={{
          backgroundColor: colors.surface,
          padding: "1rem 2rem",
          display: "flex",
          alignItems: "center",
          boxShadow: `0 4px 6px rgba(0,0,0,0.3)`,
        }}
      >
        <button
          onClick={() => router.back()}
          style={{
            backgroundColor: colors.accent,
            color: colors.background,
            border: "none",
            padding: "0.65rem 1.1rem",
            borderRadius: "0.75rem",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          ← Back to inventory
        </button>
      </nav>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.1fr 0.9fr",
            gap: "2.5rem",
            alignItems: "start",
          }}
        >
          <div>
            <div
              style={{
                backgroundColor: colors.surface,
                borderRadius: "1rem",
                overflow: "hidden",
                marginBottom: "1rem",
                minHeight: "420px",
                position: "relative",
              }}
            >
              <Image
                src={activeImage}
                alt={`${product.name} image ${selectedImageIndex + 1}`}
                width={1200}
                height={800}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))",
                gap: "0.75rem",
              }}
            >
              {gallery.map((src, index) => (
                <button
                  key={src}
                  onClick={() => setSelectedImageIndex(index)}
                  style={{
                    borderRadius: "0.85rem",
                    overflow: "hidden",
                    border:
                      selectedImageIndex === index
                        ? `2px solid ${colors.accent}`
                        : "2px solid transparent",
                    backgroundColor: colors.surface,
                    cursor: "pointer",
                    minHeight: "100px",
                    padding: 0,
                  }}
                >
                  <Image
                    src={src}
                    alt={`${product.name} thumbnail ${index + 1}`}
                    width={320}
                    height={220}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <div style={{ marginBottom: "1rem" }}>
              <span
                style={{
                  color: colors.accent,
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.14em",
                }}
              >
                {product.category}
              </span>
            </div>

            <h1
              style={{
                fontSize: "2.6rem",
                fontWeight: 900,
                marginBottom: "1rem",
              }}
            >
              {product.name}
            </h1>

            <p
              style={{
                color: colors.textSecondary,
                fontSize: "1.05rem",
                marginBottom: "1.75rem",
                lineHeight: 1.75,
              }}
            >
              {product.description}
            </p>

            <div
              style={{
                backgroundColor: colors.surface,
                padding: "1.5rem",
                borderRadius: "1rem",
                border: `1px solid ${colors.accent}`,
                marginBottom: "1.75rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "1rem",
                  marginBottom: "1rem",
                }}
              >
                <div>
                  <p
                    style={{
                      fontSize: "0.9rem",
                      color: colors.textSecondary,
                      marginBottom: "0.5rem",
                    }}
                  >
                    Price
                  </p>
                  <p
                    style={{
                      fontSize: "2rem",
                      fontWeight: 900,
                      color: colors.accent,
                    }}
                  >
                    {formatKES(product.price)}
                  </p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p
                    style={{
                      fontSize: "0.9rem",
                      color: colors.textSecondary,
                      marginBottom: "0.5rem",
                    }}
                  >
                    Availability
                  </p>
                  <p
                    style={{
                      fontWeight: 700,
                      color: product.stock > 0 ? "#10b981" : "#ef4444",
                    }}
                  >
                    {product.stock > 0
                      ? `In stock (${product.stock})`
                      : "Out of stock"}
                  </p>
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "auto auto",
                  gap: "1rem",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                  }}
                >
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    style={{
                      backgroundColor: colors.background,
                      color: colors.text,
                      border: `1px solid ${colors.accent}`,
                      borderRadius: "0.75rem",
                      padding: "0.8rem 1rem",
                      cursor: quantity <= 1 ? "not-allowed" : "pointer",
                      fontWeight: 700,
                    }}
                  >
                    −
                  </button>
                  <span style={{ fontSize: "1.1rem", width: "2rem", textAlign: "center" }}>
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                    style={{
                      backgroundColor: colors.background,
                      color: colors.text,
                      border: `1px solid ${colors.accent}`,
                      borderRadius: "0.75rem",
                      padding: "0.8rem 1rem",
                      cursor: quantity >= product.stock ? "not-allowed" : "pointer",
                      fontWeight: 700,
                    }}
                  >
                    +
                  </button>
                </div>

                <div style={{ textAlign: "right", color: colors.textSecondary }}>
                  <p style={{ margin: 0 }}>Max available units</p>
                  <p style={{ margin: 0, fontWeight: 700 }}>{product.stock}</p>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "2rem" }}>
              <button
                disabled={product.stock === 0}
                style={{
                  backgroundColor: colors.accent,
                  color: colors.background,
                  border: "none",
                  padding: "1rem 1.75rem",
                  borderRadius: "0.85rem",
                  fontWeight: 900,
                  cursor: product.stock > 0 ? "pointer" : "not-allowed",
                  flex: 1,
                  minWidth: "150px",
                }}
              >
                🛒 Add to Cart
              </button>
              <button
                style={{
                  backgroundColor: "transparent",
                  color: colors.accent,
                  border: `2px solid ${colors.accent}`,
                  padding: "1rem 1.75rem",
                  borderRadius: "0.85rem",
                  fontWeight: 900,
                  cursor: "pointer",
                  flex: 1,
                  minWidth: "150px",
                }}
              >
                ❤️ Wishlist
              </button>
            </div>

            <div
              style={{
                backgroundColor: colors.surface,
                padding: "1.5rem",
                borderRadius: "1rem",
                border: `1px solid ${colors.accent}`,
              }}
            >
              <h3
                style={{
                  fontSize: "1.25rem",
                  fontWeight: 900,
                  marginBottom: "1rem",
                  color: colors.accent,
                }}
              >
                Product Highlights
              </h3>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, color: colors.textSecondary }}>
                <li style={{ padding: "0.65rem 0", borderBottom: `1px solid ${colors.textSecondary}` }}>
                  ✓ Durable cargo design built for Kenyan roads
                </li>
                <li style={{ padding: "0.65rem 0", borderBottom: `1px solid ${colors.textSecondary}` }}>
                  ✓ Excellent low-end torque and maneuverability
                </li>
                <li style={{ padding: "0.65rem 0", borderBottom: `1px solid ${colors.textSecondary}` }}>
                  ✓ Easy maintenance and affordable service.
                </li>
                <li style={{ padding: "0.65rem 0" }}>
                  ✓ Ready for business or personal transport.
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div style={{ marginTop: "3rem", paddingTop: "2rem", borderTop: `1px solid ${colors.surface}` }}>
          <h2 style={{ fontSize: "1.75rem", fontWeight: 900, marginBottom: "1rem" }}>
            More Details
          </h2>
          <p style={{ color: colors.textSecondary, lineHeight: 1.75 }}>
            These photos were captured from the actual vehicles in your showroom. Flip between gallery thumbnails to view styling, cargo space, and ride comfort.
          </p>
        </div>
      </div>
    </div>
  );
}
