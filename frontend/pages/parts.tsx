"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import SiteHeader from "../components/SiteHeader";

interface Part {
  id: string;
  name: string;
  system: string;
  oem: string;
  price: string;
  stock: number;
  fitment: string;
  description: string;
}

const parts: Part[] = [
  {
    id: "prt-001",
    name: "Premium Brake Pad Set",
    system: "Braking",
    oem: "BP-4421",
    price: "KSh 8,500",
    stock: 18,
    fitment: "Toyota Corolla, Axio, Fielder",
    description: "Low-dust ceramic pads for daily driving and city braking.",
  },
  {
    id: "prt-002",
    name: "Synthetic Oil Filter",
    system: "Engine",
    oem: "OF-1108",
    price: "KSh 1,800",
    stock: 42,
    fitment: "Toyota, Nissan, Mazda petrol engines",
    description: "High-flow filter for clean oil circulation and longer service intervals.",
  },
  {
    id: "prt-003",
    name: "Front Shock Absorber Pair",
    system: "Suspension",
    oem: "SH-9082",
    price: "KSh 18,900",
    stock: 7,
    fitment: "Subaru Forester 2014-2019",
    description: "Balanced ride-control replacement for worn front suspension.",
  },
  {
    id: "prt-004",
    name: "Maintenance Battery",
    system: "Electrical",
    oem: "BT-650N",
    price: "KSh 14,500",
    stock: 12,
    fitment: "Most compact and mid-size vehicles",
    description: "Reliable cold starts with full charging-system test included.",
  },
];

export default function Parts() {
  const [selectedSystem, setSelectedSystem] = useState("All");
  const systems = ["All", "Braking", "Engine", "Suspension", "Electrical"];
  const filteredParts = useMemo(
    () =>
      selectedSystem === "All"
        ? parts
        : parts.filter((part) => part.system === selectedSystem),
    [selectedSystem],
  );

  return (
    <>
      <SiteHeader />
      <main className="business-page">
        <section className="business-hero business-container">
          <div>
            <span className="business-eyebrow">Parts catalog</span>
            <h1>Quality automotive parts with service-ready fitment notes.</h1>
            <p>
              Browse common workshop parts, check stock, and continue to
              checkout or book installation.
            </p>
            <div className="business-cta-row">
              <Link className="business-button primary" href="/checkout">
                Checkout
              </Link>
              <Link className="business-button secondary" href="/appointments">
                Book Installation
              </Link>
            </div>
          </div>
        </section>

        <section className="business-band">
          <div className="business-container">
            <div className="business-cta-row" style={{ marginBottom: "24px" }}>
              {systems.map((system) => (
                <button
                  className={`business-button ${system === selectedSystem ? "primary" : "secondary"}`}
                  key={system}
                  type="button"
                  onClick={() => setSelectedSystem(system)}
                >
                  {system}
                </button>
              ))}
            </div>

            <div className="business-card-grid">
              {filteredParts.map((part) => (
                <article className="business-card service-card" key={part.id}>
                  <span className="service-category">{part.system}</span>
                  <h3>{part.name}</h3>
                  <p>{part.description}</p>
                  <dl>
                    <div>
                      <dt>OEM</dt>
                      <dd>{part.oem}</dd>
                    </div>
                    <div>
                      <dt>Stock</dt>
                      <dd>{part.stock} available</dd>
                    </div>
                    <div>
                      <dt>Fitment</dt>
                      <dd>{part.fitment}</dd>
                    </div>
                    <div>
                      <dt>Price</dt>
                      <dd>{part.price}</dd>
                    </div>
                  </dl>
                  <Link className="business-text-link" href="/checkout">
                    Add to checkout
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
