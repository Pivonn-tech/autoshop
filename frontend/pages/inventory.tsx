"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";
import SiteHeader from "../components/SiteHeader";
import { getProductCardImage } from "../lib/productImages";

interface Product {
  id: number;
  name: string;
  description: string;
  category: string;
  price: number;
  currency?: string;
  stock?: number;
  bodyType?: string;
  drivetrain?: string;
}

interface FilterState {
  priceMin: number;
  priceMax: number;
  bodyType: string;
  drivetrain: string;
  sortBy: string;
}

const colors = {
  background: "var(--bg-color)",
  surface: "var(--surface-color)",
  text: "var(--text-color)",
  accent: "var(--accent-color)",
  textSecondary: "var(--text-secondary-color)",
  accent10: "var(--accent-color-10)",
  accent20: "var(--accent-color-20)",
  accent80: "var(--accent-color-80)",
  textSecondary40: "var(--text-secondary-color-40)",
  primary60: "var(--bg-color)",
  dark: "var(--surface-strong-color)",
};

const defaultFilters: FilterState = {
  priceMin: 0,
  priceMax: 2000000,
  bodyType: "",
  drivetrain: "",
  sortBy: "newest",
};

export default function Inventory() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    fetch("http://localhost:3001/api/products")
      .then((response) => response.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch inventory:", error);
        setProducts([]);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    applyFilters(products, filters);
  }, [products, filters]);

  const formatKES = (price: number) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const applyFilters = (items: Product[], currentFilters: FilterState) => {
    const filtered = items
      .filter((product) => product.price <= currentFilters.priceMax)
      .sort((a, b) => {
        if (currentFilters.sortBy === "price-low") {
          return a.price - b.price;
        }
        if (currentFilters.sortBy === "price-high") {
          return b.price - a.price;
        }
        return b.id - a.id;
      });

    setFilteredProducts(filtered);
  };

  const handleFilterChange = <K extends keyof FilterState>(
    key: K,
    value: FilterState[K]
  ) => {
    setFilters((previous) => ({ ...previous, [key]: value }));
  };

  const renderProductCard = (product: Product) => {
    const imageUrl = getProductCardImage(product.id);
    const isGrid = viewMode === "grid";

    return (
      <div
        key={product.id}
        style={{
          backgroundColor: colors.surface,
          borderRadius: "0.85rem",
          overflow: "hidden",
          boxShadow: "0 10px 40px rgba(0,0,0,0.25)",
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
          cursor: "pointer",
          border: `1px solid ${colors.surface}`,
          display: "flex",
          flexDirection: isGrid ? "column" : "row",
          alignItems: isGrid ? undefined : "stretch",
          minHeight: isGrid ? undefined : "250px",
        }}
        onMouseEnter={(e) => {
          const target = e.currentTarget as HTMLDivElement;
          target.style.transform = "scale(1.02)";
          target.style.boxShadow = "0 18px 60px rgba(255, 215, 0, 0.18)";
          target.style.borderColor = colors.accent;
        }}
        onMouseLeave={(e) => {
          const target = e.currentTarget as HTMLDivElement;
          target.style.transform = "scale(1)";
          target.style.boxShadow = "0 10px 40px rgba(0,0,0,0.25)";
          target.style.borderColor = colors.surface;
        }}
      >
        <div
          style={{
            position: "relative",
            flex: isGrid ? "0 0 auto" : "0 0 320px",
            height: isGrid ? "220px" : "100%",
            minWidth: isGrid ? undefined : "320px",
          }}
        >
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            sizes={isGrid ? "(max-width: 640px) 100vw, 320px" : "320px"}
            style={{ objectFit: "cover" }}
          />
        </div>

        <div
          style={{
            padding: "1.5rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div>
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
            <h2
              style={{
                fontSize: "1.35rem",
                fontWeight: 900,
                marginBottom: "0.75rem",
                color: colors.text,
              }}
            >
              {product.name}
            </h2>
            <p
              style={{
                color: colors.textSecondary,
                marginBottom: "1rem",
                fontSize: "0.95rem",
                lineHeight: "1.5",
              }}
            >
              {product.description}
            </p>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "1rem",
              marginTop: "1rem",
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
            <Link href={`/product/${product.id}`}>
              <button
                type="button"
                style={{
                  backgroundColor: colors.accent,
                  color: colors.background,
                  border: "none",
                  padding: "0.85rem 1.4rem",
                  borderRadius: "0.75rem",
                  fontWeight: 900,
                  fontSize: "0.85rem",
                  cursor: "pointer",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                Details
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={{ backgroundColor: colors.background, color: colors.text }}>
      <SiteHeader />
      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "2rem" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "2rem" }}>
          <aside
            style={{
              width: "100%",
              maxWidth: "280px",
              backgroundColor: colors.surface,
              padding: "2rem",
              borderRadius: "0.75rem",
              border: `1px solid ${colors.accent}`,
              minHeight: "380px",
            }}
          >
            <h2
              style={{
                fontSize: "1.35rem",
                fontWeight: 900,
                marginBottom: "1.5rem",
                color: colors.accent,
              }}
            >
              Filter Inventory
            </h2>

            <div style={{ marginBottom: "1.75rem" }}>
              <label
                style={{
                  display: "block",
                  fontWeight: 900,
                  marginBottom: "0.75rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  fontSize: "0.85rem",
                }}
              >
                Max Price
              </label>
              <input
                type="range"
                min={0}
                max={2000000}
                step={50000}
                value={filters.priceMax}
                onChange={(e) =>
                  handleFilterChange("priceMax", Number(e.target.value))
                }
                style={{ width: "100%", marginBottom: "0.75rem" }}
              />
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "0.85rem",
                  color: colors.textSecondary,
                }}
              >
                <span>Ksh 0</span>
                <span>{formatKES(filters.priceMax)}</span>
              </div>
            </div>

            <div style={{ marginBottom: "1.75rem" }}>
              <label
                style={{
                  display: "block",
                  fontWeight: 900,
                  marginBottom: "0.75rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  fontSize: "0.85rem",
                }}
              >
                Sort By
              </label>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.85rem",
                  borderRadius: "0.5rem",
                  backgroundColor: colors.background,
                  color: colors.text,
                  border: `1px solid ${colors.accent}`,
                  cursor: "pointer",
                }}
              >
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>

            <button
              type="button"
              onClick={() => setFilters(defaultFilters)}
              style={{
                width: "100%",
                backgroundColor: colors.accent,
                color: colors.background,
                border: "none",
                borderRadius: "0.65rem",
                padding: "0.9rem",
                fontWeight: 900,
                cursor: "pointer",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Reset Filters
            </button>
          </aside>

          <main style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                marginBottom: "2rem",
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-between",
                gap: "1rem",
                alignItems: "center",
              }}
            >
              <div>
                <h1
                  style={{
                    fontSize: "2.5rem",
                    fontWeight: 900,
                    marginBottom: "0.5rem",
                  }}
                >
                  Vehicle Inventory
                </h1>
                <p style={{ color: colors.textSecondary, fontSize: "1rem" }}>
                  {filteredProducts.length} vehicles available
                </p>
              </div>

              <div style={{ display: "flex", gap: "0.75rem" }}>
                {(["grid", "list"] as const).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setViewMode(mode)}
                    style={{
                      backgroundColor:
                        viewMode === mode ? colors.accent : colors.surface,
                      color:
                        viewMode === mode ? colors.background : colors.text,
                      border: `1px solid ${colors.accent}`,
                      borderRadius: "0.75rem",
                      padding: "0.85rem 1.1rem",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    {mode === "grid" ? "Grid View" : "List View"}
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "3rem",
                  color: colors.textSecondary,
                }}
              >
                Loading vehicles...
              </div>
            ) : filteredProducts.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "3rem",
                  color: colors.textSecondary,
                }}
              >
                No vehicles match your filters.
              </div>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    viewMode === "grid"
                      ? "repeat(auto-fill, minmax(320px, 1fr))"
                      : "1fr",
                  gap: "2rem",
                }}
              >
                {filteredProducts.map(renderProductCard)}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
