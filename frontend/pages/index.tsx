"use client";

import { useEffect, useState, useRef } from "react";
import { useSession, signIn } from "next-auth/react";
import Link from "next/link";
import SiteHeader from "../components/SiteHeader";
import { BusinessHomeSections } from "../components/BusinessFeatures";

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

interface Service {
  id: number;
  title: string;
  description: string;
  icon: string;
  price: string;
}

interface YMMFilter {
  year: string;
  make: string;
  model: string;
}

interface Review {
  id: number;
  name: string;
  rating: number;
  text: string;
  vehicle: string;
}

export default function Home() {
  const { data: session } = useSession();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [ymmFilter, setYMMFilter] = useState<YMMFilter>({
    year: "",
    make: "",
    model: "",
  });
  const [reviews] = useState<Review[]>([
    {
      id: 1,
      name: "James Kipchoge",
      rating: 5,
      text: "Excellent service and competitive prices. The team was professional and courteous.",
      vehicle: "Toyota Corolla 2020",
    },
    {
      id: 2,
      name: "Amara Okonkwo",
      rating: 5,
      text: "Purchased a vehicle here. Great condition, transparent pricing, and honest staff.",
      vehicle: "Nissan X-Trail 2019",
    },
    {
      id: 3,
      name: "David Mwangi",
      rating: 4,
      text: "Quick service appointment booking. Very convenient and efficient.",
      vehicle: "Maintenance Service",
    },
  ]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    fetch("http://localhost:3001/api/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch products:", error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    let animationId: number;
    let time = 0;

    const animate = () => {
      time += 0.01;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Create animated gradient background with dark theme colors
      const gradient = ctx.createLinearGradient(
        0,
        0,
        canvas.width,
        canvas.height,
      );
      gradient.addColorStop(0, "#121212"); // Deep Asphalt
      gradient.addColorStop(0.5, "#1E1E24"); // Gunmetal
      gradient.addColorStop(1, "#121212"); // Deep Asphalt
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Add animated geometric shapes with Electric Blue
      ctx.save();
      ctx.globalAlpha = 0.15;
      ctx.fillStyle = "#0050FF"; // Electric Blue

      // Rotating circles
      for (let i = 0; i < 5; i++) {
        const x = canvas.width / 2 + Math.cos(time + i) * 150;
        const y = canvas.height / 2 + Math.sin(time + i) * 150;
        ctx.beginPath();
        ctx.arc(x, y, 30 + Math.sin(time) * 10, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => cancelAnimationFrame(animationId);
  }, []);

  const services: Service[] = [
    {
      id: 1,
      title: "Vehicle Maintenance",
      description:
        "Regular servicing, oil changes, filter replacements, and preventive care",
      icon: "Maintenance",
      price: "From Ksh 5,000",
    },
    {
      id: 2,
      title: "Brake Service",
      description:
        "Brake pad replacement, rotor resurfacing, fluid flush, and inspection",
      icon: "Brakes",
      price: "From Ksh 8,000",
    },
    {
      id: 3,
      title: "Engine Diagnostics",
      description:
        "Computer diagnostics, troubleshooting, and engine health checks",
      icon: "Diagnostics",
      price: "From Ksh 3,500",
    },
    {
      id: 4,
      title: "Tire Services",
      description:
        "Tire mounting, balancing, rotation, repair, and replacement",
      icon: "Tires",
      price: "From Ksh 2,000",
    },
    {
      id: 5,
      title: "Electrical Repair",
      description:
        "Battery, alternator, starter motor, and wiring system repairs",
      icon: "Electrical",
      price: "From Ksh 4,500",
    },
    {
      id: 6,
      title: "Transmission Service",
      description: "Fluid replacement, filter service, and transmission repair",
      icon: "Transmission",
      price: "From Ksh 12,000",
    },
  ];

  const getServiceIcon = (label: string) => {
    const icons: { [key: string]: string } = {
      Maintenance: "▼",
      Brakes: "●",
      Diagnostics: "◆",
      Tires: "◯",
      Electrical: "✦",
      Transmission: "⬟",
    };
    return icons[label] || "▶";
  };

  const formatKES = (price: number) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Cyber/Sport Color Palette
  const colors = {
    background: "var(--bg-color)", // Deep Black - main page background
    surface: "var(--surface-color)", // Dark Gray - cards and surfaces
    text: "var(--text-color)", // Crisp White - primary typography
    accent: "var(--accent-color)", // High-Octane Yellow - CTAs and highlights
    textSecondary: "var(--text-secondary-color)",
  accent10: "var(--accent-color-10)",
  accent20: "var(--accent-color-20)",
  accent80: "var(--accent-color-80)",
  textSecondary40: "var(--text-secondary-color-40)",
  primary60: "var(--bg-color)",
  dark: "var(--surface-strong-color)", // Muted Gray - secondary text
  };

  return (
    <div
      style={{
        backgroundColor: colors.background,
        color: colors.text,
        minHeight: "100vh",
      }}
    >
      <SiteHeader />

      {/* Hero Section - Split Screen Layout */}
      <section
        style={{
          position: "relative",
          height: "800px",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          backgroundColor: colors.background,
        }}
      >
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: "60%",
            height: "100%",
            zIndex: 1,
            display: "block",
          }}
        />

        {/* Left Side - Business Content (40%) */}
        <div
          style={{
            position: "relative",
            zIndex: 2,
            width: "40%",
            padding: "6rem 4rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: "3rem",
          }}
        >
          {/* Main Headline */}
          <div>
            <h1
              style={{
                fontSize: "3.5rem",
                fontWeight: 900,
                letterSpacing: "-0.02em",
                lineHeight: 1.1,
                color: colors.text,
                marginBottom: "1.5rem",
                fontFamily: "'Helvetica Neue', 'Arial Black', sans-serif",
              }}
            >
              Your Ultimate Destination for Automotive Excellence
            </h1>
            <p
              style={{
                fontSize: "1rem",
                color: colors.textSecondary,
                lineHeight: 1.7,
                maxWidth: "450px",
              }}
            >
              Experience premium vehicles, expert services, and quality parts.
              Engineered for performance. Built for passion.
            </p>
          </div>

          {/* Price Section with Hand-Drawn Arrow */}
          <div
            style={{
              position: "relative",
              display: "inline-block",
              width: "fit-content",
            }}
          >
            {/* Hand-drawn arrow SVG */}
            <svg
              width="100"
              height="70"
              style={{
                position: "absolute",
                top: "-50px",
                left: "-30px",
                zIndex: 3,
              }}
              viewBox="0 0 100 70"
            >
              <path
                d="M 15 55 Q 35 35, 55 15 Q 65 5, 75 2"
                stroke={colors.accent}
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                strokeDasharray="8,4"
              />
              <polygon points="75,2 80,10 70,8" fill={colors.accent} />
            </svg>

            <div
              style={{
                fontSize: "3rem",
                fontWeight: 900,
                color: colors.accent,
                letterSpacing: "-0.01em",
              }}
            >
              From Ksh 185,000
            </div>
            <p
              style={{
                fontSize: "0.9rem",
                color: colors.textSecondary,
                marginTop: "0.75rem",
              }}
            >
              Melvin Three-Wheeler Motorcycle
            </p>
          </div>

          {/* CTA Buttons */}
          <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
            <button
              style={{
                backgroundColor: colors.accent,
                color: colors.background,
                border: "none",
                padding: "1rem 2.5rem",
                borderRadius: "2px",
                fontWeight: 900,
                fontSize: "0.95rem",
                cursor: "pointer",
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.05)";
                e.currentTarget.style.boxShadow = `0 12px 40px rgba(255, 215, 0, 0.3)`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              Explore Now
            </button>
            <Link href="#products">
              <button
                style={{
                  backgroundColor: "transparent",
                  color: colors.accent,
                  border: `2px solid ${colors.accent}`,
                  padding: "0.85rem 2rem",
                  borderRadius: "2px",
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  cursor: "pointer",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = colors.accent;
                  e.currentTarget.style.color = colors.background;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = colors.accent;
                }}
              >
                Learn More
              </button>
            </Link>
          </div>
        </div>

        {/* Right Side - Image/Emotional Appeal (60%) - handled by canvas */}
      </section>

      {/* Spec Cards Dashboard */}
      <section
        style={{
          backgroundColor: colors.background,
          padding: "3rem 4rem",
          borderTop: `1px solid ${colors.surface}`,
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "2rem",
          }}
        >
          {[
            { label: "Top Speed", value: "165 km/h" },
            { label: "Fuel Consumption", value: "3.5 L/100km" },
            { label: "Engine Power", value: "185 bhp" },
            { label: "Acceleration 0-100", value: "7.2 seconds" },
          ].map((spec, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: colors.surface,
                padding: "1.5rem",
                borderRadius: "2px",
                border: `1px solid ${colors.surface}`,
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: "0.8rem",
                  color: colors.textSecondary,
                  textTransform: "uppercase",
                  letterSpacing: "0.15em",
                  marginBottom: "0.75rem",
                }}
              >
                {spec.label}
              </div>
              <div
                style={{
                  fontSize: "1.75rem",
                  fontWeight: 900,
                  color: colors.accent,
                }}
              >
                {spec.value}
              </div>
            </div>
          ))}
        </div>
      </section>

      <BusinessHomeSections />

      {/* Featured Vehicles */}
      <section
        id="products"
        style={{
          backgroundColor: colors.background,
          padding: "4rem 2rem",
          borderTop: `1px solid ${colors.surface}`,
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <h2
            style={{
              fontSize: "2.5rem",
              fontWeight: "bold",
              marginBottom: "3rem",
              textAlign: "center",
              color: colors.text,
            }}
          >
            Featured Vehicles
          </h2>

          {loading ? (
            <div
              style={{
                textAlign: "center",
                fontSize: "1.25rem",
                color: colors.textSecondary,
              }}
            >
              Loading vehicles...
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                gap: "2rem",
              }}
            >
              {products.map((product) => (
                <div
                  key={product.id}
                  style={{
                    backgroundColor: colors.surface,
                    borderRadius: "2px",
                    overflow: "hidden",
                    boxShadow: `0 4px 24px rgba(0,0,0,0.7)`,
                    transition: "all 0.3s ease",
                    cursor: "pointer",
                    border: `1px solid ${colors.surface}`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.03)";
                    e.currentTarget.style.boxShadow = `0 12px 40px rgba(255, 215, 0, 0.2)`;
                    e.currentTarget.style.borderColor = colors.accent;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.boxShadow = `0 4px 24px rgba(0,0,0,0.7)`;
                    e.currentTarget.style.borderColor = colors.surface;
                  }}
                >
                  <div
                    style={{
                      backgroundColor: colors.background,
                      height: "240px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "4rem",
                    }}
                  >
                    {product.icon}
                  </div>

                  <div style={{ padding: "1.5rem" }}>
                    <div
                      style={{
                        color: colors.accent,
                        fontWeight: 900,
                        marginBottom: "0.5rem",
                        fontSize: "0.8rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                      }}
                    >
                      {product.category}
                    </div>
                    <h3
                      style={{
                        fontSize: "1.3rem",
                        fontWeight: "bold",
                        marginBottom: "0.5rem",
                        color: colors.text,
                      }}
                    >
                      {product.name}
                    </h3>
                    <p
                      style={{
                        color: colors.textSecondary,
                        marginBottom: "1rem",
                        fontSize: "0.9rem",
                      }}
                    >
                      {product.description}
                    </p>

                    <div
                      style={{
                        color: colors.textSecondary,
                        marginBottom: "1rem",
                        fontSize: "0.85rem",
                      }}
                    >
                      Stock: {product.stock} | In Stock
                    </div>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: "1rem",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "1.5rem",
                          fontWeight: 900,
                          color: colors.accent,
                        }}
                      >
                        {formatKES(product.price)}
                      </span>
                      <div style={{ display: "flex", gap: "0.75rem" }}>
                        <Link href={`/product/${product.id}`}>
                          <button
                            style={{
                              backgroundColor: colors.accent,
                              color: colors.background,
                              border: "none",
                              padding: "0.75rem 1.5rem",
                              borderRadius: "2px",
                              fontWeight: 900,
                              fontSize: "0.85rem",
                              cursor: "pointer",
                              textTransform: "uppercase",
                              letterSpacing: "0.08em",
                              transition: "all 0.2s ease",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = "scale(1.05)";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = "scale(1)";
                            }}
                          >
                            Details
                          </button>
                        </Link>
                        <button
                          onClick={() => {
                            if (!session) {
                              signIn(undefined, {
                                callbackUrl: "/inventory",
                              });
                            } else {
                              alert("Schedule test drive for " + product.name);
                            }
                          }}
                          style={{
                            backgroundColor: "transparent",
                            color: colors.accent,
                            border: `1px solid ${colors.accent}`,
                            padding: "0.75rem 1.5rem",
                            borderRadius: "2px",
                            fontWeight: 700,
                            fontSize: "0.85rem",
                            cursor: "pointer",
                            textTransform: "uppercase",
                            letterSpacing: "0.08em",
                            transition: "all 0.2s ease",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor =
                              colors.accent;
                            e.currentTarget.style.color = colors.background;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor =
                              "transparent";
                            e.currentTarget.style.color = colors.accent;
                          }}
                        >
                          Test Drive
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Reviews & Social Proof */}
      <section
        style={{
          backgroundColor: colors.background,
          padding: "4rem 2rem",
          borderTop: `1px solid ${colors.surface}`,
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <h2
            style={{
              fontSize: "2.5rem",
              fontWeight: "bold",
              marginBottom: "3rem",
              textAlign: "center",
              color: colors.text,
            }}
          >
            Trusted by Kenya
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "2rem",
              marginBottom: "3rem",
            }}
          >
            {reviews.map((review) => (
              <div
                key={review.id}
                style={{
                  backgroundColor: colors.surface,
                  padding: "2rem",
                  borderRadius: "2px",
                  border: `1px solid ${colors.accent}`,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    gap: "0.25rem",
                    marginBottom: "1rem",
                  }}
                >
                  {Array(review.rating)
                    .fill(0)
                    .map((_, i) => (
                      <span
                        key={i}
                        style={{ color: colors.accent, fontSize: "1.2rem" }}
                      >
                        ★
                      </span>
                    ))}
                </div>
                <p
                  style={{
                    color: colors.textSecondary,
                    marginBottom: "1rem",
                    fontStyle: "italic",
                    fontSize: "0.95rem",
                  }}
                >
                  "{review.text}"
                </p>
                <div
                  style={{
                    fontWeight: 900,
                    marginBottom: "0.25rem",
                    color: colors.text,
                  }}
                >
                  {review.name}
                </div>
                <div
                  style={{ color: colors.textSecondary, fontSize: "0.85rem" }}
                >
                  {review.vehicle}
                </div>
              </div>
            ))}
          </div>

          {/* Certifications */}
          <div
            style={{
              backgroundColor: colors.surface,
              borderRadius: "2px",
              padding: "3rem 2rem",
              textAlign: "center",
              border: `1px solid ${colors.accent}`,
            }}
          >
            <h3
              style={{
                fontSize: "1.5rem",
                fontWeight: 900,
                marginBottom: "2rem",
                color: colors.text,
              }}
            >
              Quality Assured
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                gap: "2rem",
              }}
            >
              <div style={{ padding: "1rem" }}>
                <div
                  style={{
                    fontSize: "2.5rem",
                    marginBottom: "0.5rem",
                    color: colors.accent,
                  }}
                >
                  ✓
                </div>
                <div style={{ fontWeight: 900, color: colors.text }}>
                  OEM Parts
                </div>
                <div
                  style={{
                    color: colors.textSecondary,
                    fontSize: "0.85rem",
                    marginTop: "0.5rem",
                  }}
                >
                  Genuine components
                </div>
              </div>
              <div style={{ padding: "1rem" }}>
                <div
                  style={{
                    fontSize: "2.5rem",
                    marginBottom: "0.5rem",
                    color: colors.accent,
                  }}
                >
                  ✓
                </div>
                <div style={{ fontWeight: 900, color: colors.text }}>
                  Certified Mechanics
                </div>
                <div
                  style={{
                    color: colors.textSecondary,
                    fontSize: "0.85rem",
                    marginTop: "0.5rem",
                  }}
                >
                  Expert technicians
                </div>
              </div>
              <div style={{ padding: "1rem" }}>
                <div
                  style={{
                    fontSize: "2.5rem",
                    marginBottom: "0.5rem",
                    color: colors.accent,
                  }}
                >
                  ✓
                </div>
                <div style={{ fontWeight: 900, color: colors.text }}>
                  Secure Checkout
                </div>
                <div
                  style={{
                    color: colors.textSecondary,
                    fontSize: "0.85rem",
                    marginTop: "0.5rem",
                  }}
                >
                  Safe transactions
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          backgroundColor: colors.surface,
          color: colors.textSecondary,
          padding: "3rem 2rem",
          borderTop: `1px solid ${colors.accent}`,
        }}
      >
        <div
          style={{ maxWidth: "1200px", margin: "0 auto", marginBottom: "2rem" }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "2rem",
              marginBottom: "2rem",
            }}
          >
            <div>
              <h4
                style={{
                  color: colors.accent,
                  fontWeight: 900,
                  marginBottom: "1rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  fontSize: "0.9rem",
                }}
              >
                Company
              </h4>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                }}
              >
                <a
                  href="#"
                  style={{
                    color: colors.textSecondary,
                    textDecoration: "none",
                    fontSize: "0.9rem",
                  }}
                >
                  About Us
                </a>
                <a
                  href="#"
                  style={{
                    color: colors.textSecondary,
                    textDecoration: "none",
                    fontSize: "0.9rem",
                  }}
                >
                  Careers
                </a>
                <a
                  href="#"
                  style={{
                    color: colors.textSecondary,
                    textDecoration: "none",
                    fontSize: "0.9rem",
                  }}
                >
                  Contact
                </a>
              </div>
            </div>
            <div>
              <h4
                style={{
                  color: colors.accent,
                  fontWeight: 900,
                  marginBottom: "1rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  fontSize: "0.9rem",
                }}
              >
                Services
              </h4>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                }}
              >
                <a
                  href="#"
                  style={{
                    color: colors.textSecondary,
                    textDecoration: "none",
                    fontSize: "0.9rem",
                  }}
                >
                  Maintenance
                </a>
                <a
                  href="#"
                  style={{
                    color: colors.textSecondary,
                    textDecoration: "none",
                    fontSize: "0.9rem",
                  }}
                >
                  Repairs
                </a>
                <a
                  href="#"
                  style={{
                    color: colors.textSecondary,
                    textDecoration: "none",
                    fontSize: "0.9rem",
                  }}
                >
                  Parts
                </a>
              </div>
            </div>
            <div>
              <h4
                style={{
                  color: colors.accent,
                  fontWeight: 900,
                  marginBottom: "1rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  fontSize: "0.9rem",
                }}
              >
                Legal
              </h4>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                }}
              >
                <a
                  href="#"
                  style={{
                    color: colors.textSecondary,
                    textDecoration: "none",
                    fontSize: "0.9rem",
                  }}
                >
                  Privacy
                </a>
                <a
                  href="#"
                  style={{
                    color: colors.textSecondary,
                    textDecoration: "none",
                    fontSize: "0.9rem",
                  }}
                >
                  Terms
                </a>
                <a
                  href="#"
                  style={{
                    color: colors.textSecondary,
                    textDecoration: "none",
                    fontSize: "0.9rem",
                  }}
                >
                  Warranty
                </a>
              </div>
            </div>
          </div>
          <div
            style={{
              borderTop: `1px solid ${colors.accent}`,
              paddingTop: "2rem",
              textAlign: "center",
              fontSize: "0.85rem",
            }}
          >
            <p>
              &copy; 2026 AUTOFIX KENYA. All rights reserved. | Performance.
              Excellence. Innovation.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
