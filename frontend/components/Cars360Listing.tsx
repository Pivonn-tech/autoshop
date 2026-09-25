import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

interface Product {
  id: number;
  name: string;
  description: string;
  category: string;
  price: number;
  currency: string;
  stock: number;
  make?: string;
  model?: string;
  year?: number;
  mileage?: string;
  transmission?: string;
  fuelType?: string;
  color?: string;
  image?: string;
  gallery?: string[];
}

interface FilterState {
  make: string;
  model: string;
  minYear: string;
  maxYear: string;
  minPrice: string;
  maxPrice: string;
  minMileage: string;
  maxMileage: string;
  location: string;
  color: string;
  transmission: string;
  condition: string;
  sort: string;
}

function ChevronDown() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

function ImageGallery({ images }: { images: string[] | undefined }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const displayImages = images && images.length > 0 ? images : ["/placeholder-vehicle.jpg"];

  return (
    <div style={{ position: "relative", aspectRatio: "16/10", background: "#F3F4F6", borderRadius: "8px", overflow: "hidden", marginBottom: 12 }}>
      <img
        src={displayImages[activeIndex]}
        alt="vehicle"
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
        onError={(e) => { (e.currentTarget as HTMLImageElement).src = "/placeholder-vehicle.jpg"; }}
      />

      {/* Image counter */}
      <div style={{
        position: "absolute",
        top: 12,
        right: 12,
        background: "rgba(0,0,0,0.6)",
        color: "white",
        padding: "4px 10px",
        borderRadius: "4px",
        fontSize: "0.75rem",
        fontWeight: 600,
      }}>
        {activeIndex + 1} / {displayImages.length}
      </div>

      {/* Navigation arrows */}
      {displayImages.length > 1 && (
        <>
          <button
            onClick={() => setActiveIndex((activeIndex - 1 + displayImages.length) % displayImages.length)}
            style={{
              position: "absolute",
              left: 12,
              top: "50%",
              transform: "translateY(-50%)",
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.9)",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#0F2A4A",
              fontSize: "1.2rem",
              lineHeight: 1,
              zIndex: 10,
              transition: "all 200ms ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "white";
              (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 8px rgba(0,0,0,0.2)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.9)";
              (e.currentTarget as HTMLElement).style.boxShadow = "none";
            }}
          >
            ‹
          </button>
          <button
            onClick={() => setActiveIndex((activeIndex + 1) % displayImages.length)}
            style={{
              position: "absolute",
              right: 12,
              top: "50%",
              transform: "translateY(-50%)",
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.9)",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#0F2A4A",
              fontSize: "1.2rem",
              lineHeight: 1,
              zIndex: 10,
              transition: "all 200ms ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "white";
              (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 8px rgba(0,0,0,0.2)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.9)";
              (e.currentTarget as HTMLElement).style.boxShadow = "none";
            }}
          >
            ›
          </button>
        </>
      )}
    </div>
  );
}

function ProductCard({ product, isSponsor = false }: { product: Product; isSponsor?: boolean }) {
  return (
    <div style={{
      background: "white",
      border: "1px solid #E5E7EB",
      borderRadius: "8px",
      overflow: "hidden",
      transition: "all 200ms ease",
      boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
    }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 16px rgba(0,0,0,0.1)";
        (e.currentTarget as HTMLElement).style.borderColor = "#D1D5DB";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = "0 1px 2px rgba(0,0,0,0.05)";
        (e.currentTarget as HTMLElement).style.borderColor = "#E5E7EB";
      }}
    >
      {/* Sponsor badge */}
      {isSponsor && (
        <div style={{
          background: "#FEF3C7",
          color: "#92400E",
          padding: "8px 12px",
          fontSize: "0.75rem",
          fontWeight: 700,
          textAlign: "center",
          borderBottom: "1px solid #FCD34D",
        }}>
          ✨ SPONSORED - FEATURED LISTING
        </div>
      )}

      {/* Image Gallery */}
      <ImageGallery images={product.gallery} />

      {/* Content */}
      <div style={{ padding: "16px" }}>
        {/* Header */}
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>
            {product.category}
          </div>
          <Link href={`/product/${product.id}`} style={{ textDecoration: "none" }}>
            <h3 style={{
              margin: 0,
              fontSize: "1.1rem",
              fontWeight: 700,
              color: "#0F2A4A",
              cursor: "pointer",
              transition: "color 200ms ease",
            }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.color = "#E8700A";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.color = "#0F2A4A";
              }}
            >
              {product.name}
            </h3>
          </Link>
          <div style={{ fontSize: "0.8rem", color: "#9CA3AF", marginTop: 4 }}>
            {product.year} {product.make} {product.model}
          </div>
        </div>

        {/* Stats */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 8,
          marginBottom: 12,
          paddingBottom: 12,
          borderBottom: "1px solid #F3F4F6",
        }}>
          <div>
            <div style={{ fontSize: "0.75rem", color: "#9CA3AF", fontWeight: 600 }}>MILEAGE</div>
            <div style={{ fontSize: "0.9rem", fontWeight: 600, color: "#0F2A4A" }}>{product.mileage || "N/A"} km</div>
          </div>
          <div>
            <div style={{ fontSize: "0.75rem", color: "#9CA3AF", fontWeight: 600 }}>TRANSMISSION</div>
            <div style={{ fontSize: "0.9rem", fontWeight: 600, color: "#0F2A4A" }}>{product.transmission || "N/A"}</div>
          </div>
        </div>

        {/* Price */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: "0.75rem", color: "#9CA3AF", fontWeight: 600, marginBottom: 4 }}>SELLING PRICE</div>
          <div style={{ fontSize: "1.35rem", fontWeight: 700, color: "#0F2A4A" }}>
            KES {new Intl.NumberFormat("en-KE").format(product.price)}
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
          <button style={{
            padding: "10px 12px",
            fontSize: "0.8rem",
            fontWeight: 600,
            color: "#0F2A4A",
            background: "white",
            border: "1.5px solid #0F2A4A",
            borderRadius: "6px",
            cursor: "pointer",
            transition: "all 200ms ease",
          }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "#F3F4F6";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "white";
            }}
          >
            Contact Seller
          </button>
          <button style={{
            padding: "10px 12px",
            fontSize: "0.8rem",
            fontWeight: 600,
            color: "white",
            background: "#0F2A4A",
            border: "1.5px solid #0F2A4A",
            borderRadius: "6px",
            cursor: "pointer",
            transition: "all 200ms ease",
          }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "#0d1f2f";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "#0F2A4A";
            }}
          >
            View Details
          </button>
        </div>

        {/* Additional Services */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 8 }}>
          {[
            "💰 Apply for Financing",
            "🔍 Get Inspection",
            "⏱️ Mileage Verification",
            "🛡️ Get Insurance",
          ].map((service, i) => (
            <button
              key={i}
              style={{
                padding: "8px 12px",
                fontSize: "0.75rem",
                fontWeight: 500,
                color: "#6B7280",
                background: "#F9FAFB",
                border: "1px solid #E5E7EB",
                borderRadius: "6px",
                cursor: "pointer",
                transition: "all 200ms ease",
                textAlign: "left",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = "#F3F4F6";
                (e.currentTarget as HTMLElement).style.color = "#0F2A4A";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = "#F9FAFB";
                (e.currentTarget as HTMLElement).style.color = "#6B7280";
              }}
            >
              {service}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Cars360Listing() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtersMobileOpen, setFiltersMobileOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    make: "",
    model: "",
    minYear: "",
    maxYear: "",
    minPrice: "",
    maxPrice: "",
    minMileage: "",
    maxMileage: "",
    location: "",
    color: "",
    transmission: "",
    condition: "",
    sort: "all",
  });
  const [page, setPage] = useState(1);
  const itemsPerPage = 12;
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch products
  useEffect(() => {
    const fetch_products = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`);
        const data = await res.json();
        setProducts(data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setLoading(false);
      }
    };
    fetch_products();
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = [...products];

    // Filter logic
    if (filters.make) filtered = filtered.filter(p => p.make?.toLowerCase() === filters.make.toLowerCase());
    if (filters.minPrice) filtered = filtered.filter(p => p.price >= parseFloat(filters.minPrice));
    if (filters.maxPrice) filtered = filtered.filter(p => p.price <= parseFloat(filters.maxPrice));
    if (filters.minYear) filtered = filtered.filter(p => (p.year || 0) >= parseInt(filters.minYear));
    if (filters.maxYear) filtered = filtered.filter(p => (p.year || 0) <= parseInt(filters.maxYear));
    if (filters.transmission) filtered = filtered.filter(p => p.transmission?.toLowerCase().includes(filters.transmission.toLowerCase()));
    if (filters.color) filtered = filtered.filter(p => p.color?.toLowerCase() === filters.color.toLowerCase());

    // Sorting
    if (filters.sort === "price-low") filtered.sort((a, b) => a.price - b.price);
    if (filters.sort === "price-high") filtered.sort((a, b) => b.price - a.price);
    if (filters.sort === "year-new") filtered.sort((a, b) => (b.year || 0) - (a.year || 0));

    setFilteredProducts(filtered);
    setPage(1);
  }, [filters, products]);

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const paginatedProducts = filteredProducts.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  return (
    <div style={{ background: "#F9FAFB", minHeight: "calc(100vh - 200px)" }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "24px 20px", display: "grid", gridTemplateColumns: "1fr", gap: 24 }}>
        {/* Filters Sidebar (Desktop) + Mobile Filter Button */}
        <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 24 }}>
          {/* Desktop Filters Sidebar */}
          <div style={{ display: "none" }} className="desktop-filters">
            <div style={{
              background: "white",
              border: "1px solid #E5E7EB",
              borderRadius: "8px",
              padding: "20px",
              height: "fit-content",
              position: "sticky",
              top: 120,
            }}>
              <h3 style={{ margin: "0 0 16px", fontSize: "1.1rem", fontWeight: 700, color: "#0F2A4A" }}>Filters</h3>

              {/* Make */}
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#0F2A4A", marginBottom: 8 }}>
                  Select Make
                </label>
                <select
                  value={filters.make}
                  onChange={(e) => handleFilterChange("make", e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    border: "1.5px solid #E5E7EB",
                    borderRadius: "6px",
                    fontSize: "0.9rem",
                    background: "white",
                    cursor: "pointer",
                  }}
                >
                  <option value="">Any</option>
                  <option value="Isuzu">Isuzu</option>
                  <option value="Toyota">Toyota</option>
                  <option value="Nissan">Nissan</option>
                  <option value="BMW">BMW</option>
                  <option value="Land Rover">Land Rover</option>
                  <option value="Bajaj">Bajaj</option>
                </select>
              </div>

              {/* Year Range */}
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#0F2A4A", marginBottom: 8 }}>
                  Min Year
                </label>
                <select
                  value={filters.minYear}
                  onChange={(e) => handleFilterChange("minYear", e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    border: "1.5px solid #E5E7EB",
                    borderRadius: "6px",
                    fontSize: "0.9rem",
                    background: "white",
                    cursor: "pointer",
                  }}
                >
                  <option value="">Any Year</option>
                  {[2026, 2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015].map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#0F2A4A", marginBottom: 8 }}>
                  Min Price (KES)
                </label>
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.minPrice}
                  onChange={(e) => handleFilterChange("minPrice", e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    border: "1.5px solid #E5E7EB",
                    borderRadius: "6px",
                    fontSize: "0.9rem",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#0F2A4A", marginBottom: 8 }}>
                  Max Price (KES)
                </label>
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.maxPrice}
                  onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    border: "1.5px solid #E5E7EB",
                    borderRadius: "6px",
                    fontSize: "0.9rem",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              {/* Transmission */}
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#0F2A4A", marginBottom: 8 }}>
                  Transmission
                </label>
                <select
                  value={filters.transmission}
                  onChange={(e) => handleFilterChange("transmission", e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    border: "1.5px solid #E5E7EB",
                    borderRadius: "6px",
                    fontSize: "0.9rem",
                    background: "white",
                    cursor: "pointer",
                  }}
                >
                  <option value="">Any Transmission</option>
                  <option value="manual">Manual</option>
                  <option value="automatic">Automatic</option>
                  <option value="cvt">CVT</option>
                </select>
              </div>

              {/* Color */}
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#0F2A4A", marginBottom: 8 }}>
                  Color
                </label>
                <select
                  value={filters.color}
                  onChange={(e) => handleFilterChange("color", e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    border: "1.5px solid #E5E7EB",
                    borderRadius: "6px",
                    fontSize: "0.9rem",
                    background: "white",
                    cursor: "pointer",
                  }}
                >
                  <option value="">Any Color</option>
                  <option value="red">Red</option>
                  <option value="blue">Blue</option>
                  <option value="white">White</option>
                  <option value="black">Black</option>
                  <option value="silver">Silver</option>
                </select>
              </div>

              {/* Clear Filters */}
              <button
                onClick={() => setFilters({
                  make: "", model: "", minYear: "", maxYear: "", minPrice: "", maxPrice: "",
                  minMileage: "", maxMileage: "", location: "", color: "", transmission: "", condition: "", sort: "all"
                })}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  color: "#E8700A",
                  background: "rgba(232, 112, 10, 0.1)",
                  border: "1px solid rgba(232, 112, 10, 0.3)",
                  borderRadius: "6px",
                  cursor: "pointer",
                  transition: "all 200ms ease",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "rgba(232, 112, 10, 0.15)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "rgba(232, 112, 10, 0.1)";
                }}
              >
                Clear Filters
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div>
            {/* Listing Header with Mobile Filter Button */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
              <div>
                <h2 style={{ margin: "0 0 4px", fontSize: "1.5rem", fontWeight: 700, color: "#0F2A4A" }}>
                  All Vehicles
                </h2>
                <p style={{ margin: 0, fontSize: "0.9rem", color: "#6B7280" }}>
                  {filteredProducts.length} cars
                </p>
              </div>

              <div style={{ display: "flex", alignItems: "flex-end", gap: 12, flexWrap: "wrap" }}>
                {/* Mobile Filter Button */}
                <button
                  onClick={() => setFiltersMobileOpen(!filtersMobileOpen)}
                  style={{
                    display: "none",
                    padding: "10px 16px",
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    color: "#0F2A4A",
                    background: "white",
                    border: "1.5px solid #0F2A4A",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                  className="mobile-filter-btn"
                >
                  🔍 Filters
                </button>

                {/* Sort Dropdown */}
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#0F2A4A", marginBottom: 6 }}>
                    Sort by
                  </label>
                  <select
                    value={filters.sort}
                    onChange={(e) => handleFilterChange("sort", e.target.value)}
                    style={{
                      padding: "10px 12px",
                      border: "1.5px solid #E5E7EB",
                      borderRadius: "6px",
                      fontSize: "0.9rem",
                      background: "white",
                      cursor: "pointer",
                      minWidth: 160,
                    }}
                  >
                    <option value="all">All</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="year-new">Newest First</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Loading */}
            {loading && (
              <div style={{ textAlign: "center", padding: "40px 20px", color: "#9CA3AF" }}>
                Loading vehicles...
              </div>
            )}

            {/* Product Grid */}
            {!loading && (
              <>
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                  gap: 20,
                  marginBottom: 40,
                }}>
                  {paginatedProducts.map((product, idx) => (
                    <ProductCard key={product.id} product={product} isSponsor={idx === 0} />
                  ))}
                </div>

                {/* No Results */}
                {filteredProducts.length === 0 && (
                  <div style={{ textAlign: "center", padding: "60px 20px", color: "#9CA3AF" }}>
                    <p style={{ fontSize: "1.1rem", marginBottom: 8 }}>No vehicles found matching your criteria.</p>
                    <button
                      onClick={() => setFilters({
                        make: "", model: "", minYear: "", maxYear: "", minPrice: "", maxPrice: "",
                        minMileage: "", maxMileage: "", location: "", color: "", transmission: "", condition: "", sort: "all"
                      })}
                      style={{
                        padding: "10px 20px",
                        fontSize: "0.9rem",
                        fontWeight: 600,
                        color: "#E8700A",
                        background: "rgba(232, 112, 10, 0.1)",
                        border: "1px solid rgba(232, 112, 10, 0.3)",
                        borderRadius: "6px",
                        cursor: "pointer",
                      }}
                    >
                      Clear Filters
                    </button>
                  </div>
                )}

                {/* Pagination */}
                {filteredProducts.length > 0 && (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 40 }}>
                    {page > 1 && (
                      <button
                        onClick={() => setPage(page - 1)}
                        style={{
                          padding: "8px 12px",
                          border: "1px solid #E5E7EB",
                          background: "white",
                          borderRadius: "6px",
                          cursor: "pointer",
                          fontSize: "0.9rem",
                          fontWeight: 500,
                          color: "#0F2A4A",
                        }}
                      >
                        ← Previous
                      </button>
                    )}

                    {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
                      const pageNum = i + 1;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setPage(pageNum)}
                          style={{
                            width: 36,
                            height: 36,
                            borderRadius: "6px",
                            border: pageNum === page ? "none" : "1px solid #E5E7EB",
                            background: pageNum === page ? "#0F2A4A" : "white",
                            color: pageNum === page ? "white" : "#0F2A4A",
                            fontSize: "0.9rem",
                            fontWeight: 600,
                            cursor: "pointer",
                          }}
                        >
                          {pageNum}
                        </button>
                      );
                    })}

                    {page < totalPages && (
                      <button
                        onClick={() => setPage(page + 1)}
                        style={{
                          padding: "8px 12px",
                          border: "1px solid #E5E7EB",
                          background: "white",
                          borderRadius: "6px",
                          cursor: "pointer",
                          fontSize: "0.9rem",
                          fontWeight: 500,
                          color: "#0F2A4A",
                        }}
                      >
                        Next →
                      </button>
                    )}
                  </div>
                )}

                {/* Loading More */}
                {page < totalPages && (
                  <div style={{ textAlign: "center", padding: "20px", color: "#9CA3AF", fontSize: "0.9rem" }}>
                    Loading more vehicles...
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 1024px) {
          .desktop-filters {
            display: none !important;
          }
        }
        @media (max-width: 768px) {
          .mobile-filter-btn {
            display: inline-block !important;
          }
        }
      `}</style>
    </div>
  );
}
