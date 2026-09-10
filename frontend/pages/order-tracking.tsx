"use client";

import SiteHeader from "../components/SiteHeader";
import { NotificationsPanel, ServiceTracker } from "../components/BusinessFeatures";

export default function OrderTracking() {
  return (
    <>
      <SiteHeader />
      <ServiceTracker />
      <section className="business-band">
        <div className="business-container">
          <NotificationsPanel />
        </div>
      </section>
    </>
  );
}
