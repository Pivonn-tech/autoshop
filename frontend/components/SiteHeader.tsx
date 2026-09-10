"use client";

import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

export default function SiteHeader() {
  return (
    <nav className="site-header sticky top-0 z-50 bg-brand-primary border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between gap-6">
        <Link href="/" className="text-brand-secondary no-underline text-base md:text-lg font-semibold tracking-wide">
          AUTOFIX KENYA
        </Link>

        <div className="hidden md:flex items-center gap-8 nav-links">
          <Link href="/inventory" className="text-sm text-brand-secondary hover:text-brand-accent no-underline">Vehicles</Link>
          <Link href="/parts" className="text-sm text-brand-secondary hover:text-brand-accent no-underline">Parts</Link>
          <Link href="/services" className="text-sm text-brand-secondary hover:text-brand-accent no-underline">Services</Link>
          <Link href="/appointments" className="text-sm text-brand-secondary hover:text-brand-accent no-underline">Book</Link>
          <Link href="/dashboard" className="text-sm text-brand-secondary hover:text-brand-accent no-underline">Dashboard</Link>
          <Link href="/admin" className="text-sm text-brand-secondary hover:text-brand-accent no-underline">Admin</Link>
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link href="/contact" className="contact-cta hidden md:inline-flex no-underline">
            Contact
          </Link>
        </div>
      </div>
    </nav>
  );
}
