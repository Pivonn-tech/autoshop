"use client";

import Link from "next/link";
import { useState } from "react";

type Colors = {
  background?: string;
  surface?: string;
  text?: string;
  accent?: string;
};

export default function SiteHeader({
  colors = {
    background: "#0A0A0A",
    surface: "#1A1A1A",
    text: "#FFFFFF",
    accent: "#FFD700",
  },
}: {
  colors?: Colors;
}) {
  const [logoFailed, setLogoFailed] = useState(false);

  return (
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
      <Link
        href="/"
        style={{
          textDecoration: "none",
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
        }}
      >
        {logoFailed ? (
          <span
            style={{
              color: colors.accent,
              fontSize: "1.25rem",
              fontWeight: 800,
              letterSpacing: "0.08em",
            }}
          >
            AUTOFIX KENYA
          </span>
        ) : (
          <img
            src="/logo.png"
            alt="AutoShop"
            style={{ height: 40, width: "auto", maxWidth: "100%" }}
            onError={() => setLogoFailed(true)}
          />
        )}
      </Link>

      <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
        <Link href="/inventory" style={{ color: colors.text, textDecoration: "none", cursor: "pointer" }}>
          Inventory
        </Link>
        <Link href="/parts" style={{ color: colors.text, textDecoration: "none", cursor: "pointer" }}>
          Parts
        </Link>
        <Link href="/services" style={{ color: colors.text, textDecoration: "none", cursor: "pointer" }}>
          Services
        </Link>
        <button
          style={{
            backgroundColor: colors.accent,
            color: colors.background,
            border: "none",
            padding: "0.5rem 1.5rem",
            borderRadius: "4px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Contact
        </button>
      </div>
    </nav>
  );
}
