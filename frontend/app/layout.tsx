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
        <link rel="icon" href="/logo.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/logo.png" />
        <meta name="theme-color" content="#0A0A0A" />
      </head>
      <body>{children}</body>
    </html>
  );
}
