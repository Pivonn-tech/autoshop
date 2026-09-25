import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

const colors = {
  background: "var(--bg-color)",
  surface: "var(--surface-color)",
  text: "var(--text-color)",
  accent: "var(--accent-color)",
  textSecondary: "var(--text-secondary-color)",
  accent10: "var(--accent-color-10)",
  accent20: "var(--accent-color-20)",
  accent80: "var(--accent-color-80)",
  textSecondary40: "var(--text-secondary-color-40)",
  primary60: "var(--bg-color)",
  dark: "var(--surface-strong-color)",
};

export default function AuthErrorPage() {
  const router = useRouter();
  const [error, setError] = useState<string | undefined>();
  
  useEffect(() => {
    if (router.isReady && typeof router.query.error === "string") {
      setError(router.query.error);
    }
  }, [router.isReady, router.query]);

  const errorMessages: Record<string, string> = {
    Callback: "There was a problem signing in. Please try again.",
    OAuthSignin: "Unable to sign in with that OAuth provider.",
    OAuthCallback: "The OAuth callback failed. Please try again.",
    EmailCreateAccount: "Could not create an account with that email.",
    EmailSignin: "The email provider is not available.",
    EmailSignInError: "Could not sign in with that email.",
    CredentialsSignin: "Email or password is incorrect.",
    SessionCallback: "Your session is invalid.",
    AccessDenied: "Access was denied.",
  };

  const errorMessage = error
    ? errorMessages[error] || "An error occurred. Please try again."
    : "An error occurred. Please try again.";

  return (
    <div
      style={{
        backgroundColor: colors.background,
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
      }}
    >
      <div
        style={{
          backgroundColor: colors.surface,
          borderRadius: "1rem",
          padding: "3rem",
          maxWidth: "500px",
          width: "100%",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.8)",
          border: `1px solid #ff4444`,
          textAlign: "center",
        }}
      >
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "1rem", color: "#ff4444" }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
        </div>
        <h1
          style={{
            fontSize: "1.5rem",
            fontWeight: "bold",
            marginBottom: "0.5rem",
            color: "#ff4444",
          }}
        >
          Authentication Error
        </h1>
        <p
          style={{
            color: colors.textSecondary,
            marginBottom: "2rem",
            fontSize: "0.95rem",
          }}
        >
          {errorMessage}
        </p>

        <div style={{ display: "flex", gap: "1rem" }}>
          <Link href="/auth/login" style={{ flex: 1, textDecoration: "none" }}>
            <button
              style={{
                width: "100%",
                padding: "0.75rem",
                backgroundColor: colors.accent,
                color: colors.background,
                border: "none",
                borderRadius: "0.5rem",
                fontWeight: "700",
                cursor: "pointer",
              }}
            >
              Try Again
            </button>
          </Link>
          <Link href="/" style={{ flex: 1, textDecoration: "none" }}>
            <button
              style={{
                width: "100%",
                padding: "0.75rem",
                backgroundColor: colors.surface,
                color: colors.accent,
                border: `1px solid ${colors.accent}`,
                borderRadius: "0.5rem",
                fontWeight: "700",
                cursor: "pointer",
              }}
            >
              Go Home
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
