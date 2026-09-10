"use client";

import Link from "next/link";
import SiteHeader from "../components/SiteHeader";

const orderItems = [
  { name: "Brake Pad Set", qty: 1, price: "KSh 8,500" },
  { name: "Synthetic Oil Service", qty: 1, price: "KSh 7,800" },
];

export default function Checkout() {
  return (
    <>
      <SiteHeader />
      <main className="business-page">
        <section className="business-hero business-container">
          <div>
            <span className="business-eyebrow">Checkout</span>
            <h1>Review your order and continue with a secure payment.</h1>
            <p>
              This checkout keeps the existing shopping flow available while the
              business dashboard tracks invoices and service updates.
            </p>
          </div>
        </section>

        <section className="business-band">
          <div className="business-container booking-layout">
            <div className="business-card">
              <h2>Order Summary</h2>
              {orderItems.map((item) => (
                <div className="data-row" key={item.name}>
                  <div>
                    <strong>{item.name}</strong>
                    <span>Quantity: {item.qty}</span>
                  </div>
                  <b>{item.price}</b>
                </div>
              ))}
              <div className="data-row">
                <div>
                  <strong>Total</strong>
                  <span>Includes estimated service and parts cost</span>
                </div>
                <b>KSh 16,300</b>
              </div>
              <Link className="business-button primary" href="/dashboard">
                Complete Order
              </Link>
            </div>

            <aside className="business-card">
              <h2>Need installation?</h2>
              <p>
                Book a service appointment after checkout so the workshop can
                prepare parts and reserve a bay.
              </p>
              <Link className="business-button secondary" href="/appointments">
                Book Installation
              </Link>
            </aside>
          </div>
        </section>
      </main>
    </>
  );
}
