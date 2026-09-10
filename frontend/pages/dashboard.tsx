"use client";

import SiteHeader from "../components/SiteHeader";
import { CustomerDashboard, ServiceTracker } from "../components/BusinessFeatures";

export default function Dashboard() {
  return (
    <>
      <SiteHeader />
      <CustomerDashboard />
      <ServiceTracker compact />
    </>
  );
}
