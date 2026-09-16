import { Html, Head, Main, NextScript } from "next/document";

const themeScript = `
  (() => {
    try {
      const stored = localStorage.getItem("theme");
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      document.documentElement.classList.toggle("dark", stored ? stored === "dark" : prefersDark);
    } catch (_) {}
  })();
`;

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Inline theme script runs before paint to prevent flash */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />

        {/* PWA */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="application-name" content="AutoFix Kenya" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="AutoFix Kenya" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#0F2A4A" />

        {/* Icons */}
        <link rel="icon" href="/logo.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/logo.png" />

        {/* Preconnect to Google Fonts if used */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
