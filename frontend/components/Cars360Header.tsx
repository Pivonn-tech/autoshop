import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

function MenuIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
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

const navItems = [
  { label: "Home", href: "/" },
  { label: "Hot Deals", href: "/inventory?sort=deals" },
  { label: "Find a Car", href: "/inventory" },
  { label: "E-Mobility", href: "/inventory?category=motorcycles" },
  { label: "Find a Part", href: "/parts" },
  { label: "Our Services", href: "/services" },
  { label: "Events", href: "#" },
  { label: "News", href: "#" },
];

export default function Cars360Header() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <>
      {/* Top Info Bar */}
      <div
        style={{
          background: "#0F2A4A",
          color: "white",
          fontSize: "0.85rem",
          padding: "12px 0",
          textAlign: "center",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 24, flexWrap: "wrap", maxWidth: "1400px", margin: "0 auto", padding: "0 20px" }}>
          <span>Welcome to Cars360 Kenya's Largest Car Marketplace</span>
          <span style={{ opacity: 0.3 }}>•</span>
          <a href="tel:+254709335023" style={{ color: "inherit", textDecoration: "none", fontWeight: 600 }}>+254 709 335 023</a>
        </div>
      </div>

      {/* Main Header */}
      <header
        style={{
          background: "white",
          borderBottom: scrolled ? "1px solid #E5E7EB" : "none",
          boxShadow: scrolled ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
          position: "sticky",
          top: 0,
          zIndex: 100,
          transition: "all 200ms ease",
        }}
      >
        <div
          style={{
            maxWidth: "1400px",
            margin: "0 auto",
            padding: "12px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 20,
          }}
        >
          {/* Logo */}
          <Link href="/" style={{ textDecoration: "none", flexShrink: 0 }}>
            <div style={{
              fontFamily: "var(--font-space-grotesk, sans-serif)",
              fontSize: "1.4rem",
              fontWeight: 900,
              color: "#0F2A4A",
              letterSpacing: "-0.02em",
            }}>
              CARS360
            </div>
          </Link>

          {/* Desktop Nav */}
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
              <Link
                key={item.href}
                href={item.href}
                style={{
                  padding: "8px 14px",
                  fontSize: "0.9rem",
                  fontWeight: 500,
                  color: "#374151",
                  textDecoration: "none",
                  borderRadius: "6px",
                  transition: "all 200ms ease",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "rgba(15,42,74,0.05)";
                  (e.currentTarget as HTMLElement).style.color = "#0F2A4A";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "transparent";
                  (e.currentTarget as HTMLElement).style.color = "#374151";
                }}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
            <Link
              href="/auth/signup"
              style={{
                padding: "8px 16px",
                fontSize: "0.9rem",
                fontWeight: 600,
                color: "#0F2A4A",
                textDecoration: "none",
                borderRadius: "6px",
                border: "1.5px solid #0F2A4A",
                transition: "all 200ms ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = "#F3F4F6";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = "transparent";
              }}
              className="hidden-mobile"
            >
              Sign Up
            </Link>

            <Link
              href="/auth/login"
              style={{
                padding: "8px 18px",
                fontSize: "0.9rem",
                fontWeight: 600,
                color: "white",
                textDecoration: "none",
                background: "#0F2A4A",
                borderRadius: "6px",
                transition: "all 200ms ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = "#0d1f2f";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = "#0F2A4A";
              }}
              className="hidden-mobile"
            >
              Log In
            </Link>

            {/* Mobile Menu */}
            <button
              onClick={() => setDrawerOpen(true)}
              style={{
                width: 40,
                height: 40,
                borderRadius: "6px",
                border: "1.5px solid #D1D5DB",
                background: "white",
                color: "#0F2A4A",
                display: "none",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
              className="show-mobile"
            >
              <MenuIcon />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {drawerOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 200,
          }}
        >
          {/* Overlay */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(0,0,0,0.5)",
            }}
            onClick={() => setDrawerOpen(false)}
          />

          {/* Panel */}
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width: "80%",
              maxWidth: 300,
              background: "white",
              boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "16px 20px",
                borderBottom: "1px solid #E5E7EB",
              }}
            >
              <div style={{
                fontFamily: "var(--font-space-grotesk, sans-serif)",
                fontSize: "1.2rem",
                fontWeight: 900,
                color: "#0F2A4A",
              }}>
                CARS360
              </div>
              <button
                onClick={() => setDrawerOpen(false)}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "6px",
                  border: "1.5px solid #D1D5DB",
                  background: "transparent",
                  color: "#6B7280",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                <CloseIcon />
              </button>
            </div>

            {/* Nav Links */}
            <nav style={{ flex: 1, overflowY: "auto", padding: "8px 0" }}>
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setDrawerOpen(false)}
                  style={{
                    display: "block",
                    padding: "14px 20px",
                    fontSize: "0.95rem",
                    fontWeight: 500,
                    color: "#374151",
                    textDecoration: "none",
                    borderBottom: "1px solid #F3F4F6",
                    transition: "all 200ms ease",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "#F9FAFB";
                    (e.currentTarget as HTMLElement).style.color = "#0F2A4A";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "transparent";
                    (e.currentTarget as HTMLElement).style.color = "#374151";
                  }}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Auth Links */}
            <div style={{ padding: "16px 20px", borderTop: "1px solid #E5E7EB", display: "flex", gap: 12, flexDirection: "column" }}>
              <Link
                href="/auth/signup"
                style={{
                  padding: "10px 16px",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  color: "#0F2A4A",
                  textDecoration: "none",
                  border: "1.5px solid #0F2A4A",
                  borderRadius: "6px",
                  textAlign: "center",
                  transition: "all 200ms ease",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "#F3F4F6";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "transparent";
                }}
              >
                Sign Up
              </Link>
              <Link
                href="/auth/login"
                style={{
                  padding: "10px 16px",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  color: "white",
                  textDecoration: "none",
                  background: "#0F2A4A",
                  borderRadius: "6px",
                  textAlign: "center",
                  transition: "all 200ms ease",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "#0d1f2f";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "#0F2A4A";
                }}
              >
                Log In
              </Link>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @media (max-width: 768px) {
          .hidden-mobile {
            display: none !important;
          }
          .show-mobile {
            display: flex !important;
          }
        }
        @media (min-width: 769px) {
          .show-mobile {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}
