import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AutoShop - Your Professional Online Automotive Store",
  description: "Buy quality automotive parts, vehicles, and services online",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/logo-icon-512.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/logo-icon-32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="128x128"
          href="/logo-icon-128.png"
        />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#0A0A0A" />
        <meta name="theme-color" content="#0A0A0A" />
      </head>
      <body>{children}</body>
    </html>
  );
}
