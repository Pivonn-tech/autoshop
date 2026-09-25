import "../app/globals.css";
import type { AppProps } from "next/app";
import dynamic from "next/dynamic";
import { SessionProvider } from "next-auth/react";

const SiteHeader = dynamic(() => import("../components/SiteHeader"), {
  ssr: false,
  loading: () => <div style={{ height: "180px", background: "#0F2A4A" }} />,
});

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <SiteHeader />
      <Component {...pageProps} />
    </SessionProvider>
  );
}
