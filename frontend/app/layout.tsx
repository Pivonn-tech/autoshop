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
      <body>{children}</body>
    </html>
  );
}
