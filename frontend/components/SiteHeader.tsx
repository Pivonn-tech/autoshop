import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import ThemeToggle from "./ThemeToggle";

// ─── Icon components ──────────────────────────────────────────────────────────
function MenuIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 01-8 0" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function ChevronDown() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
    </svg>
  );
}

// ─── Nav structure ────────────────────────────────────────────────────────────
const navItems = [
  {
    label: "Vehicles",
    href: "/inventory",
    dropdown: [
      { label: "Browse Inventory", href: "/inventory", desc: "All vehicles in stock" },
      { label: "Commercial Trucks", href: "/inventory?category=trucks", desc: "Cargo & delivery trucks" },
      { label: "Motorcycles", href: "/inventory?category=motorcycles", desc: "2 & 3-wheelers" },
      { label: "View All →", href: "/inventory", desc: "" },
    ],
  },
  {
    label: "Parts",
    href: "/parts",
    dropdown: [
      { label: "All Parts", href: "/parts", desc: "Full catalog" },
      { label: "Brakes & Safety", href: "/parts?system=Braking", desc: "Pads, rotors, fluid" },
      { label: "Engine & Oil", href: "/parts?system=Engine", desc: "Filters, belts, seals" },
      { label: "Suspension", href: "/parts?system=Suspension", desc: "Shocks, bushings" },
      { label: "Electrical", href: "/parts?system=Electrical", desc: "Batteries, alternators" },
    ],
  },
  {
    label: "Services",
    href: "/services",
    dropdown: [
      { label: "All Services", href: "/services", desc: "Our full workshop menu" },
      { label: "Engine Diagnostics", href: "/services", desc: "OBD scan & analysis" },
      { label: "Oil Change", href: "/services", desc: "Quick service from KSh 4,500" },
      { label: "Brake Repair", href: "/services", desc: "Full brake system service" },
      { label: "Car Detailing", href: "/services", desc: "Interior & exterior" },
    ],
  },
  { label: "Book", href: "/appointments" },
  { label: "Sell Car", href: "/sell-car" },
  { label: "Track Order", href: "/order-tracking" },
];

// ─── Dropdown Panel ───────────────────────────────────────────────────────────
function NavDropdown({ items }: { items: typeof navItems[0]["dropdown"] }) {
  if (!items) return null;
  return (
    <div
      style={{
        position: "absolute",
        top: "calc(100% + 8px)",
        left: "50%",
        transform: "translateX(-50%)",
        background: "var(--bg)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-lg)",
        boxShadow: "var(--shadow-xl)",
        minWidth: 260,
        padding: "8px",
        zIndex: 200,
      }}
    >
      {items.map((item) => (
        <Link
          key={item.href + item.label}
          href={item.href}
          style={{
            display: "block",
            padding: "10px 14px",
            borderRadius: "var(--radius-md)",
            textDecoration: "none",
            transition: "background var(--transition)",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background = "var(--surface)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = "transparent";
          }}
        >
          <span style={{ display: "block", fontSize: "0.9rem", fontWeight: 600, color: "var(--text)" }}>
            {item.label}
          </span>
          {item.desc && (
            <span style={{ display: "block", fontSize: "0.78rem", color: "var(--text-muted)", marginTop: 2 }}>
              {item.desc}
            </span>
          )}
        </Link>
      ))}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function SiteHeader() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [openMobileSection, setOpenMobileSection] = useState<string | null>(null);
  const [cartCount, setCartCount] = useState(0);
  const searchRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Load real cart count from backend (or localStorage fallback)
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const cartId = localStorage.getItem("cartId");
        const headers: Record<string, string> = {};
        if (cartId) headers["x-cart-id"] = cartId;
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart`, { headers });
        if (res.ok) {
          const data = await res.json();
          const returned = res.headers.get("x-cart-id");
          if (returned) localStorage.setItem("cartId", returned);
          setCartCount(data.items?.reduce((sum: number, i: { quantity: number }) => sum + i.quantity, 0) ?? 0);
        }
      } catch {
        // silently ignore — badge just won't show
      }
    };
    fetchCart();
    // Refresh whenever the route changes (e.g. after adding to cart)
    router.events?.on("routeChangeComplete", fetchCart);
    return () => router.events?.off("routeChangeComplete", fetchCart);
  }, [router.events]);

  // Scroll detection
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Close drawer on route change
  useEffect(() => {
    setDrawerOpen(false);
    setActiveDropdown(null);
  }, [router.pathname]);

  // Focus search input when opened
  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-nav-item]")) setActiveDropdown(null);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Prevent body scroll when drawer open
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/inventory?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  const isActive = (href: string) =>
    router.pathname === href || router.pathname.startsWith(href + "/");

  return (
    <>
      {/* ── Top announcement bar ── */}
      <div
        style={{
          background: "var(--navy)",
          color: "rgba(255,255,255,0.82)",
          fontSize: "0.8rem",
          padding: "8px 0",
          textAlign: "center",
          letterSpacing: "0.01em",
        }}
      >
        <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 20 }}>
          <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <PhoneIcon />
            <a href="tel:+254743645366" style={{ color: "inherit", textDecoration: "none" }}>
              0743 645 366 / 0719 233 626
            </a>
          </span>
          <span style={{ opacity: 0.3 }}>|</span>
          <span>Open 24/7 — We're always here for you</span>
          <span style={{ opacity: 0.3 }}>|</span>
          <Link href="/appointments" style={{ color: "var(--amber)", fontWeight: 600, textDecoration: "none" }}>
            Book a Service →
          </Link>
        </div>
      </div>

      {/* ── Main header ── */}
      <header
        className={`site-header${scrolled ? " scrolled" : ""}`}
        style={{
          boxShadow: scrolled ? "var(--shadow-md)" : "none",
        }}
      >
        <div
          className="container"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 24,
            height: 68,
          }}
        >
          {/* Logo */}
          <Link
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              textDecoration: "none",
              flexShrink: 0,
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                background: "var(--navy)",
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1rem",
                fontWeight: 900,
                color: "var(--amber)",
                fontFamily: "var(--font-space-grotesk, sans-serif)",
                letterSpacing: "-0.02em",
              }}
            >
              AF
            </div>
            <div>
              <div
                style={{
                  fontFamily: "var(--font-space-grotesk, sans-serif)",
                  fontSize: "1.05rem",
                  fontWeight: 700,
                  color: "var(--text)",
                  lineHeight: 1.1,
                  letterSpacing: "0.02em",
                }}
              >
                AUTOFIX
              </div>
              <div
                style={{
                  fontSize: "0.65rem",
                  fontWeight: 600,
                  color: "var(--amber)",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  lineHeight: 1,
                }}
              >
                KENYA
              </div>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              flex: 1,
              justifyContent: "center",
            }}
            className="hidden-mobile"
          >
            {navItems.map((item) => (
              <div
                key={item.href}
                data-nav-item
                style={{ position: "relative" }}
                onMouseEnter={() => item.dropdown && setActiveDropdown(item.label)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  href={item.href}
                  className={`nav-link${isActive(item.href) ? " active" : ""}`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    padding: "8px 12px",
                    borderRadius: "var(--radius-md)",
                  }}
                >
                  {item.label}
                  {item.dropdown && <ChevronDown />}
                </Link>
                {item.dropdown && activeDropdown === item.label && (
                  <NavDropdown items={item.dropdown} />
                )}
              </div>
            ))}

            {/* AI Assistant pill */}
            <Link
              href="/ai-assistant"
              className="ai-pill"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                height: 34,
                paddingInline: 14,
                borderRadius: 999,
                background: "linear-gradient(135deg, #6d28d9 0%, #7c3aed 100%)",
                color: "white",
                fontSize: "0.8rem",
                fontWeight: 700,
                textDecoration: "none",
                letterSpacing: "0.01em",
                flexShrink: 0,
                boxShadow: "0 2px 8px rgba(109,40,217,0.35)",
                transition: "all 180ms ease",
                position: "relative",
                overflow: "hidden",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 16px rgba(109,40,217,0.55)"; (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 8px rgba(109,40,217,0.35)"; (e.currentTarget as HTMLElement).style.transform = "none"; }}
            >
              {/* Shimmer sweep */}
              <span className="ai-pill-shimmer" aria-hidden="true" />
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l1.5 4.5L18 8l-4.5 1.5L12 14l-1.5-4.5L6 8l4.5-1.5L12 2z" opacity="0.95"/>
                <path d="M19 14l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7.7-2z" opacity="0.8"/>
                <path d="M5 17l.4 1.2 1.2.4-1.2.4L5 20.2l-.4-1.2-1.2-.4 1.2-.4L5 17z" opacity="0.65"/>
              </svg>
              AI Assistant
            </Link>
          </nav>

          {/* Right actions */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
            {/* Search toggle */}
            <button
              onClick={() => setSearchOpen((v) => !v)}
              aria-label="Search"
              style={{
                width: 40,
                height: 40,
                borderRadius: "var(--radius-md)",
                border: "1.5px solid var(--border)",
                background: "transparent",
                color: "var(--text-secondary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all var(--transition)",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "var(--navy)";
                (e.currentTarget as HTMLElement).style.color = "var(--navy)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
                (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)";
              }}
            >
              <SearchIcon />
            </button>

            {/* Cart */}
            <Link
              href="/checkout"
              aria-label="Cart"
              style={{
                width: 40,
                height: 40,
                borderRadius: "var(--radius-md)",
                border: "1.5px solid var(--border)",
                background: "transparent",
                color: "var(--text-secondary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textDecoration: "none",
                position: "relative",
                transition: "all var(--transition)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "var(--navy)";
                (e.currentTarget as HTMLElement).style.color = "var(--navy)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
                (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)";
              }}
            >
              <CartIcon />
              {/* Cart badge */}
              {cartCount > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: -6,
                  right: -6,
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  background: "var(--amber)",
                  color: "white",
                  fontSize: "0.65rem",
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "2px solid var(--bg)",
                }}
              >
                {cartCount > 99 ? "99+" : cartCount}
              </span>
              )}
            </Link>

            {/* Account */}
            <Link
              href="/dashboard"
              aria-label="Account"
              className="hidden-mobile"
              style={{
                width: 40,
                height: 40,
                borderRadius: "var(--radius-md)",
                border: "1.5px solid var(--border)",
                background: "transparent",
                color: "var(--text-secondary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textDecoration: "none",
                transition: "all var(--transition)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "var(--navy)";
                (e.currentTarget as HTMLElement).style.color = "var(--navy)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
                (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)";
              }}
            >
              <UserIcon />
            </Link>

            <ThemeToggle />

            {/* Book CTA */}
            <Link
              href="/appointments"
              className="btn btn-primary btn-sm hidden-mobile"
              style={{ textDecoration: "none" }}
            >
              Book Service
            </Link>

            {/* Hamburger */}
            <button
              onClick={() => setDrawerOpen(true)}
              aria-label="Open menu"
              className="show-mobile"
              style={{
                width: 40,
                height: 40,
                borderRadius: "var(--radius-md)",
                border: "1.5px solid var(--border)",
                background: "transparent",
                color: "var(--text)",
                display: "none",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              <MenuIcon />
            </button>
          </div>
        </div>

        {/* ── Search bar expansion ── */}
        <div
          style={{
            overflow: "hidden",
            maxHeight: searchOpen ? 72 : 0,
            transition: "max-height 250ms cubic-bezier(0.4,0,0.2,1)",
            borderTop: searchOpen ? "1px solid var(--border)" : "none",
          }}
        >
          <form onSubmit={handleSearch}>
            <div
              className="container"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                height: 72,
              }}
            >
              <SearchIcon />
              <input
                ref={searchRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search vehicles, parts, services…"
                style={{
                  flex: 1,
                  height: 44,
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  fontSize: "1rem",
                  color: "var(--text)",
                  fontFamily: "inherit",
                }}
              />
              <button
                type="submit"
                className="btn btn-primary btn-sm"
              >
                Search
              </button>
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                style={{
                  color: "var(--text-muted)",
                  fontSize: "1.25rem",
                  lineHeight: 1,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "4px 8px",
                }}
              >
                ✕
              </button>
            </div>
          </form>
        </div>
      </header>

      {/* ── Mobile Drawer ── */}
      {drawerOpen && (
        <div className="mobile-drawer">
          {/* Overlay */}
          <div
            className="mobile-drawer-overlay"
            onClick={() => setDrawerOpen(false)}
          />
          {/* Panel */}
          <div className="mobile-drawer-panel">
            {/* Header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "20px 20px",
                borderBottom: "1px solid var(--border)",
              }}
            >
              <Link
                href="/"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  textDecoration: "none",
                }}
                onClick={() => setDrawerOpen(false)}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    background: "var(--navy)",
                    borderRadius: 6,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 900,
                    color: "var(--amber)",
                    fontSize: "0.85rem",
                    fontFamily: "var(--font-space-grotesk, sans-serif)",
                  }}
                >
                  AF
                </div>
                <span
                  style={{
                    fontFamily: "var(--font-space-grotesk, sans-serif)",
                    fontWeight: 700,
                    fontSize: "1rem",
                    color: "var(--text)",
                    letterSpacing: "0.02em",
                  }}
                >
                  AUTOFIX KENYA
                </span>
              </Link>
              <button
                onClick={() => setDrawerOpen(false)}
                aria-label="Close menu"
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "var(--radius-md)",
                  border: "1.5px solid var(--border)",
                  background: "transparent",
                  color: "var(--text-secondary)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                <CloseIcon />
              </button>
            </div>

            {/* Search in drawer */}
            <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)" }}>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (searchQuery.trim()) {
                    router.push(`/inventory?q=${encodeURIComponent(searchQuery.trim())}`);
                    setDrawerOpen(false);
                    setSearchQuery("");
                  }
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  background: "var(--surface)",
                  border: "1.5px solid var(--border)",
                  borderRadius: "var(--radius-md)",
                  padding: "0 14px",
                  height: 44,
                }}
              >
                <SearchIcon />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search…"
                  style={{
                    flex: 1,
                    border: "none",
                    outline: "none",
                    background: "transparent",
                    fontSize: "0.9rem",
                    color: "var(--text)",
                    fontFamily: "inherit",
                  }}
                />
              </form>
            </div>

            {/* Nav links */}
            <nav style={{ flex: 1, overflowY: "auto", padding: "8px 0" }}>
              {navItems.map((item) => (
                <div key={item.href}>
                  {item.dropdown ? (
                    <>
                      <button
                        onClick={() =>
                          setOpenMobileSection(
                            openMobileSection === item.label ? null : item.label
                          )
                        }
                        style={{
                          width: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "14px 20px",
                          background: "transparent",
                          border: "none",
                          cursor: "pointer",
                          fontSize: "0.95rem",
                          fontWeight: 600,
                          color: "var(--text)",
                          textAlign: "left",
                        }}
                      >
                        {item.label}
                        <span
                          style={{
                            transform:
                              openMobileSection === item.label
                                ? "rotate(180deg)"
                                : "rotate(0)",
                            transition: "transform var(--transition)",
                            display: "flex",
                          }}
                        >
                          <ChevronDown />
                        </span>
                      </button>
                      {openMobileSection === item.label && (
                        <div
                          style={{
                            background: "var(--surface)",
                            borderTop: "1px solid var(--border)",
                            borderBottom: "1px solid var(--border)",
                          }}
                        >
                          {item.dropdown.map((sub) => (
                            <Link
                              key={sub.href + sub.label}
                              href={sub.href}
                              onClick={() => setDrawerOpen(false)}
                              style={{
                                display: "block",
                                padding: "12px 32px",
                                fontSize: "0.875rem",
                                color: "var(--text-secondary)",
                                textDecoration: "none",
                                borderBottom: "1px solid var(--border)",
                              }}
                            >
                              {sub.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      onClick={() => setDrawerOpen(false)}
                      style={{
                        display: "block",
                        padding: "14px 20px",
                        fontSize: "0.95rem",
                        fontWeight: 600,
                        color: isActive(item.href) ? "var(--amber)" : "var(--text)",
                        textDecoration: "none",
                        borderBottom: "1px solid var(--border)",
                      }}
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}

              {/* Extra links */}
              <div style={{ padding: "8px 0", borderTop: "1px solid var(--border)", marginTop: 8 }}>
                {[
                  { label: "My Dashboard", href: "/dashboard" },
                  { label: "Admin Panel", href: "/admin" },
                  { label: "Contact Us", href: "/contact" },
                ].map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setDrawerOpen(false)}
                    style={{
                      display: "block",
                      padding: "13px 20px",
                      fontSize: "0.9rem",
                      color: "var(--text-secondary)",
                      textDecoration: "none",
                    }}
                  >
                    {link.label}
                  </Link>
                ))}
                {/* AI Assistant */}
                <Link
                  href="/ai-assistant"
                  onClick={() => setDrawerOpen(false)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    margin: "10px 20px 4px",
                    padding: "10px 16px",
                    borderRadius: 999,
                    background: "linear-gradient(135deg, #6d28d9 0%, #7c3aed 100%)",
                    color: "white",
                    fontSize: "0.875rem",
                    fontWeight: 700,
                    textDecoration: "none",
                    width: "fit-content",
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2a4 4 0 014 4v2a4 4 0 01-8 0V6a4 4 0 014-4z"/>
                    <path d="M9 21h6M12 17v4"/>
                    <path d="M5 9a7 7 0 0014 0"/>
                  </svg>
                  AI Assistant
                </Link>
              </div>
            </nav>

            {/* Drawer footer */}
            <div
              style={{
                padding: "16px 20px",
                borderTop: "1px solid var(--border)",
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              <Link
                href="/appointments"
                onClick={() => setDrawerOpen(false)}
                className="btn btn-primary"
                style={{ width: "100%", textDecoration: "none", justifyContent: "center" }}
              >
                Book a Service
              </Link>
              <Link
                href="/auth/login"
                onClick={() => setDrawerOpen(false)}
                className="btn btn-ghost"
                style={{ width: "100%", textDecoration: "none", justifyContent: "center" }}
              >
                Sign In
              </Link>
              <div style={{ display: "flex", justifyContent: "center", paddingTop: 4 }}>
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Responsive styles injected ── */}
      <style>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
        }
        @media (min-width: 769px) {
          .show-mobile { display: none !important; }
          .hidden-mobile { display: flex !important; }
        }

        /* ── AI pill shimmer ── */
        .ai-pill-shimmer {
          position: absolute;
          top: 0; left: -100%;
          width: 60%;
          height: 100%;
          background: linear-gradient(
            105deg,
            transparent 20%,
            rgba(255,255,255,0.28) 50%,
            transparent 80%
          );
          animation: ai-shimmer 2.6s ease-in-out infinite;
          pointer-events: none;
        }
        @keyframes ai-shimmer {
          0%   { left: -100%; }
          45%  { left: 140%; }
          100% { left: 140%; }
        }

        /* Sparkle pulse on the star icon */
        .ai-pill svg {
          animation: ai-sparkle 2.6s ease-in-out infinite;
          transform-origin: center;
        }
        @keyframes ai-sparkle {
          0%, 100% { transform: scale(1) rotate(0deg); opacity: 1; }
          40%       { transform: scale(1.25) rotate(18deg); opacity: 1; }
          55%       { transform: scale(0.9) rotate(-6deg); opacity: 0.85; }
          70%       { transform: scale(1.05) rotate(4deg); opacity: 1; }
        }
      `}</style>
    </>
  );
}
