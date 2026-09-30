import "../app/globals.css";
import type { AppProps } from "next/app";
import dynamic from "next/dynamic";
import { SessionProvider } from "next-auth/react";
import { useEffect, useState } from "react";
import { useMaintenance } from "../lib/useMaintenance";

const SiteHeader = dynamic(() => import("../components/SiteHeader"), {
  ssr: false,
  loading: () => <div style={{ height: "180px", background: "#0F2A4A" }} />,
});

const MaintenancePage = dynamic(() => import("../components/MaintenancePage"), {
  ssr: false,
  loading: () => (
    <div style={{ height: "100vh", background: "#1e293b", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ color: "#94a3b8" }}>Loading...</div>
    </div>
  ),
});

function AppContent({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  const { maintenance, loading } = useMaintenance();

  if (!loading && maintenance.enabled) {
    return <MaintenancePage />;
  }

  return (
    <SessionProvider session={session}>
      <SiteHeader />
      <Component {...pageProps} />
    </SessionProvider>
  );
}

export default function App(props: AppProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return <AppContent {...props} />;
}

