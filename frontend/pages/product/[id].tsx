"use client";

import { useRouter } from "next/router";
import { useEffect, useState } from "react";

interface Product {
  id: number;
  name: string;
  description: string;
  category: string;
  price: number;
  currency: string;
  stock: number;
  icon: string;
  views: string[];
}

export default function ProductDetails() {
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    fetch("http://localhost:3001/api/products")
      .then((res) => res.json())
      .then((data) => {
        const found = data.find(
          (p: Product) => p.id === parseInt(id as string),
        );
        setProduct(found);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch product:", error);
        setLoading(false);
      });
  }, [id]);

  const formatKES = (price: number) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Cyber/Sport Color Palette
  const colors = {
    background: "#0A0A0A",
    surface: "#1A1A1A",
    text: "#FFFFFF",
    accent: "#FFD700",
    textSecondary: "#666666",
  };

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

  return (
    <div
      style={{
        backgroundColor: colors.background,
        color: colors.text,
        minHeight: "100vh",
      }}
    >
      {/* Header */}
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
            padding: "0.5rem 1rem",
            borderRadius: "4px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          ← Back
        </button>
      </nav>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "3rem",
            alignItems: "start",
          }}
        >
          {/* Product Gallery */}
          <div>
            {/* Main Image */}
            <div
              style={{
                backgroundColor: colors.surface,
                borderRadius: "8px",
                padding: "2rem",
                marginBottom: "1.5rem",
                height: "400px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "8rem",
              }}
            >
              {product.icon}
            </div>

            {/* Image Thumbnails */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: "0.5rem",
              }}
            >
              {product.views.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  style={{
                    backgroundColor:
                      selectedImageIndex === index
                        ? colors.accent
                        : colors.surface,
                    border: `2px solid ${selectedImageIndex === index ? colors.accent : "transparent"}`,
                    borderRadius: "4px",
                    padding: "0.75rem",
                    cursor: "pointer",
                    fontSize: "1.5rem",
                  }}
                >
                  📷
                </button>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div>
            <div style={{ marginBottom: "1rem" }}>
              <span
                style={{
                  color: colors.accent,
                  fontWeight: "bold",
                  fontSize: "0.9rem",
                }}
              >
                {product.category}
              </span>
            </div>

            <h1
              style={{
                fontSize: "2.5rem",
                fontWeight: "bold",
                marginBottom: "1rem",
              }}
            >
              {product.name}
            </h1>

            <p
              style={{
                color: colors.textSecondary,
                fontSize: "1.1rem",
                marginBottom: "2rem",
                lineHeight: "1.6",
              }}
            >
              {product.description}
            </p>

            {/* Price */}
            <div style={{ marginBottom: "2rem" }}>
              <p
                style={{ color: colors.textSecondary, marginBottom: "0.5rem" }}
              >
                Price
              </p>
              <p
                style={{
                  fontSize: "2.5rem",
                  fontWeight: "bold",
                  color: colors.accent,
                }}
              >
                {formatKES(product.price)}
              </p>
            </div>

            {/* Availability */}
            <div style={{ marginBottom: "2rem" }}>
              <p
                style={{ color: colors.textSecondary, marginBottom: "0.5rem" }}
              >
                Availability
              </p>
              <p
                style={{
                  color: product.stock > 0 ? "#10b981" : "#ef4444",
                  fontWeight: "bold",
                }}
              >
                {product.stock > 0
                  ? `In Stock - ${product.stock} units available`
                  : "Out of Stock"}
              </p>
            </div>

            {/* Quantity Selector */}
            <div style={{ marginBottom: "2rem" }}>
              <p
                style={{ color: colors.textSecondary, marginBottom: "0.5rem" }}
              >
                Quantity
              </p>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  marginBottom: "1rem",
                }}
              >
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  style={{
                    backgroundColor: colors.surface,
                    color: colors.text,
                    border: "none",
                    padding: "0.5rem 1rem",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                >
                  −
                </button>
                <span
                  style={{
                    fontSize: "1.1rem",
                    minWidth: "2rem",
                    textAlign: "center",
                  }}
                >
                  {quantity}
                </span>
                <button
                  onClick={() =>
                    setQuantity(Math.min(product.stock, quantity + 1))
                  }
                  disabled={quantity >= product.stock}
                  style={{
                    backgroundColor: colors.surface,
                    color: colors.text,
                    border: "none",
                    padding: "0.5rem 1rem",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div
              style={{
                display: "flex",
                gap: "1rem",
                marginBottom: "2rem",
              }}
            >
              <button
                disabled={product.stock === 0}
                style={{
                  backgroundColor: colors.accent,
                  color: colors.background,
                  border: "none",
                  padding: "1rem 2rem",
                  borderRadius: "4px",
                  fontWeight: "bold",
                  fontSize: "1rem",
                  cursor: product.stock > 0 ? "pointer" : "not-allowed",
                  opacity: product.stock > 0 ? 1 : 0.5,
                  flex: 1,
                }}
              >
                🛒 Add to Cart
              </button>
              <button
                style={{
                  backgroundColor: "transparent",
                  color: colors.accent,
                  border: `2px solid ${colors.accent}`,
                  padding: "1rem 2rem",
                  borderRadius: "4px",
                  fontWeight: "bold",
                  fontSize: "1rem",
                  cursor: "pointer",
                  flex: 1,
                }}
              >
                ❤️ Wishlist
              </button>
            </div>

            {/* Specifications */}
            <div
              style={{
                backgroundColor: colors.surface,
                padding: "1.5rem",
                borderRadius: "8px",
                marginBottom: "2rem",
                border: `1px solid ${colors.accent}`,
              }}
            >
              <h3
                style={{
                  fontSize: "1.25rem",
                  fontWeight: "bold",
                  marginBottom: "1rem",
                  color: colors.accent,
                }}
              >
                Key Features
              </h3>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                }}
              >
                <li
                  style={{
                    padding: "0.5rem 0",
                    borderBottom: `1px solid ${colors.textSecondary}`,
                  }}
                >
                  ✓ Premium Build Quality
                </li>
                <li
                  style={{
                    padding: "0.5rem 0",
                    borderBottom: `1px solid ${colors.primary60}`,
                  }}
                >
                  ✓ Comprehensive Warranty
                </li>
                <li
                  style={{
                    padding: "0.5rem 0",
                    borderBottom: `1px solid ${colors.primary60}`,
                  }}
                >
                  ✓ Professional Installation Available
                </li>
                <li style={{ padding: "0.5rem 0" }}>✓ 24/7 Customer Support</li>
              </ul>
            </div>

            {/* Contact Section */}
            <div
              style={{
                backgroundColor: colors.dark,
                padding: "1.5rem",
                borderRadius: "8px",
                border: `2px solid ${colors.accent10}`,
              }}
            >
              <h3
                style={{
                  fontSize: "1.1rem",
                  fontWeight: "bold",
                  marginBottom: "1rem",
                }}
              >
                Have Questions?
              </h3>
              <p style={{ color: colors.textSecondary, marginBottom: "1rem" }}>
                Our sales team is ready to help. Contact us today!
              </p>
              <button
                style={{
                  backgroundColor: colors.accent10,
                  color: colors.primary60,
                  border: "none",
                  padding: "0.75rem 1.5rem",
                  borderRadius: "4px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  width: "100%",
                }}
              >
                📞 Contact Sales Team
              </button>
            </div>
          </div>
        </div>

        {/* Related Products Placeholder */}
        <div
          style={{
            marginTop: "4rem",
            paddingTop: "2rem",
            borderTop: `1px solid ${colors.secondary30}`,
          }}
        >
          <h2
            style={{
              fontSize: "1.75rem",
              fontWeight: "bold",
              marginBottom: "2rem",
            }}
          >
            Related Products
          </h2>
          <p style={{ color: colors.textSecondary }}>
            More premium vehicles and services coming soon!
          </p>
        </div>
      </div>
    </div>
  );
}
