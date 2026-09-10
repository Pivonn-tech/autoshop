import type { ReactNode } from "react";
import "./globals.css";
import SiteHeader from "../components/SiteHeader";

export const metadata = {
  title: "AutoShop - Your Professional Online Automotive Store",
  description: "Buy quality automotive parts, vehicles, and services online",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/logo.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/logo.png" />
        <meta name="theme-color" content="#0A0A0A" />
        <script dangerouslySetInnerHTML={{ __html: `(() => {
          function isExtensionError(e) {
            try {
              return !!(e && e.filename && e.filename.startsWith && e.filename.startsWith('chrome-extension://'));
            } catch (_) { return false; }
          }
          window.addEventListener('error', function (e) {
            if (isExtensionError(e)) {
              try { e.stopImmediatePropagation && e.stopImmediatePropagation(); } catch (err) {}
              try { e.preventDefault && e.preventDefault(); } catch (err) {}
              return false;
            }
          }, true);
          window.addEventListener('unhandledrejection', function (e) {
            try {
              const r = e && e.reason;
              const stack = (r && r.stack) || '';
              if (typeof stack === 'string' && stack.indexOf('chrome-extension://') !== -1) {
                try { e.preventDefault && e.preventDefault(); } catch (err) {}
              }
            } catch (_) {}
          }, true);
        })();` }} />
      </head>
      <body>
        <SiteHeader />
        <main>{children}</main>
      </body>
    </html>
  );
}
