"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

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

interface FilterState {
  priceMin: number;
  priceMax: number;
  bodyType: string;
  drivetrain: string;
  sortBy: string;
}

export default function Inventory() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>({
    priceMin: 0,
    priceMax: 2000000,
    bodyType: "",
    drivetrain: "",
    sortBy: "newest",
  });

  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  // Cyber/Sport Color Palette
  const colors = {
    background: "#0A0A0A",
    surface: "#1A1A1A",
    text: "#FFFFFF",
    accent: "#FFD700",
    textSecondary: "#666666",
  };

  useEffect(() => {
    fetch("http://localhost:3001/api/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
        applyFilters(data, filters);
      })
      .catch((error) => {
        console.error("Failed to fetch products:", error);
        setLoading(false);
      });
  }, []);

  const applyFilters = (
    productsToFilter: Product[],
    filterState: FilterState,
  ) => {
    let result = productsToFilter.filter(
      (p) => p.price >= filterState.priceMin && p.price <= filterState.priceMax,
    );

    if (filterState.sortBy === "price-low") {
      result.sort((a, b) => a.price - b.price);
    } else if (filterState.sortBy === "price-high") {
      result.sort((a, b) => b.price - a.price);
    }

    setFilteredProducts(result);
  };

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    applyFilters(products, newFilters);
  };

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
            href="/inventory"
            style={{
              color: colors.accent,
              textDecoration: "none",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Inventory
          </Link>
          <Link
            href="/parts"
            style={{
              color: colors.text,
              textDecoration: "none",
              cursor: "pointer",
            }}
          >
            Parts
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

      <div style={{ display: "flex", maxWidth: "1400px", margin: "0 auto" }}>
        {/* Sidebar Filters */}
        <aside
          style={{
            width: "280px",
            backgroundColor: colors.surface,
            padding: "2rem",
            borderRight: `1px solid ${colors.accent}`,
            height: "fit-content",
            position: "sticky",
            top: "80px",
          }}
        >
          <h3
            style={{
              fontSize: "1.3rem",
              fontWeight: 900,
              marginBottom: "1.5rem",
              color: colors.accent,
            }}
          >
            FILTERS
          </h3>

          {/* Price Range */}
          <div style={{ marginBottom: "2rem" }}>
            <label
              style={{
                display: "block",
                fontWeight: 900,
                marginBottom: "0.75rem",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                fontSize: "0.9rem",
              }}
            >
              Price Range
            </label>
            <input
              type="range"
              min="0"
              max="2000000"
              step="50000"
              value={filters.priceMax}
              onChange={(e) =>
                handleFilterChange("priceMax", parseInt(e.target.value))
              }
              style={{ width: "100%", marginBottom: "0.5rem" }}
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

          {/* Sort Options */}
          <div style={{ marginBottom: "2rem" }}>
            <label
              style={{
                display: "block",
                fontWeight: 900,
                marginBottom: "0.75rem",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                fontSize: "0.9rem",
              }}
            >
              Sort By
            </label>
            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange("sortBy", e.target.value)}
              style={{
                width: "100%",
                padding: "0.75rem",
                backgroundColor: colors.background,
                color: colors.text,
                border: `1px solid ${colors.accent}`,
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              <option value="newest">Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>

          {/* Reset Filters */}
          <button
            onClick={() => {
              const defaultFilters = {
                priceMin: 0,
                priceMax: 2000000,
                bodyType: "",
                drivetrain: "",
                sortBy: "newest",
              };
              setFilters(defaultFilters);
              applyFilters(products, defaultFilters);
            }}
            style={{
              width: "100%",
              backgroundColor: colors.accent,
              color: colors.background,
              border: "none",
              padding: "0.75rem",
              borderRadius: "4px",
              fontWeight: 900,
              cursor: "pointer",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            Reset Filters
          </button>
        </aside>

        {/* Main Content */}
        <main style={{ flex: 1, padding: "2rem" }}>
          <div style={{ marginBottom: "2rem" }}>
            <h1
              style={{
                fontSize: "2.5rem",
                fontWeight: 900,
                marginBottom: "0.5rem",
              }}
            >
              Vehicle Inventory
            </h1>
            <p style={{ color: colors.textSecondary, fontSize: "1.1rem" }}>
              {filteredProducts.length} vehicles available
            </p>
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
              No vehicles match your filters
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
                gap: "2rem",
              }}
            >
              {filteredProducts.map((product) => (
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
                          }}
                        >
                          Details
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
