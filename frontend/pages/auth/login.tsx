"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
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

export default function LoginPage() {
  const router = useRouter();
  const callbackUrl =
    typeof router.query.callbackUrl === "string"
      ? router.query.callbackUrl
      : "/my-garage";
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isSignUp, setIsSignUp] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
      } else if (result?.ok) {
        router.push(callbackUrl);
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

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
      {/* Modal Container */}
      <div
        style={{
          backgroundColor: colors.surface,
          borderRadius: "1rem",
          padding: "3rem",
          maxWidth: "500px",
          width: "100%",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.8)",
          border: `1px solid ${colors.accent}40`,
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <h1
              style={{
                fontSize: "1.5rem",
                fontWeight: "900",
                color: colors.accent,
                margin: "0 0 0.5rem 0",
                cursor: "pointer",
              }}
            >
              AUTOFIX KENYA
            </h1>
          </Link>
          <p
            style={{
              color: colors.textSecondary,
              margin: 0,
              fontSize: "0.875rem",
            }}
          >
            {isSignUp ? "Create your account" : "Welcome back"}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div
            style={{
              backgroundColor: "#7f1d1d",
              color: "#fecaca",
              padding: "0.75rem",
              borderRadius: "0.5rem",
              marginBottom: "1rem",
              fontSize: "0.875rem",
              textAlign: "center",
            }}
          >
            {error}
          </div>
        )}

        {/* OAuth Buttons */}
        <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem" }}>
          <button
            onClick={() => signIn("google", { callbackUrl })}
            style={{
              flex: 1,
              padding: "0.75rem",
              backgroundColor: colors.surface,
              border: `1px solid ${colors.textSecondary}`,
              borderRadius: "0.5rem",
              color: colors.text,
              cursor: "pointer",
              fontWeight: "500",
              transition: "all 0.3s ease",
              fontSize: "0.875rem",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = colors.accent;
              e.currentTarget.style.backgroundColor = colors.accent10;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = colors.textSecondary;
              e.currentTarget.style.backgroundColor = colors.surface;
            }}
          >
            Google
          </button>
          <button
            onClick={() => signIn("github", { callbackUrl })}
            style={{
              flex: 1,
              padding: "0.75rem",
              backgroundColor: colors.surface,
              border: `1px solid ${colors.textSecondary}`,
              borderRadius: "0.5rem",
              color: colors.text,
              cursor: "pointer",
              fontWeight: "500",
              transition: "all 0.3s ease",
              fontSize: "0.875rem",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = colors.accent;
              e.currentTarget.style.backgroundColor = colors.accent10;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = colors.textSecondary;
              e.currentTarget.style.backgroundColor = colors.surface;
            }}
          >
            GitHub
          </button>
        </div>

        {/* Divider */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            marginBottom: "1.5rem",
          }}
        >
          <div
            style={{
              flex: 1,
              height: "1px",
              backgroundColor: colors.textSecondary40,
            }}
          />
          <span style={{ color: colors.textSecondary, fontSize: "0.875rem" }}>
            or
          </span>
          <div
            style={{
              flex: 1,
              height: "1px",
              backgroundColor: colors.textSecondary40,
            }}
          />
        </div>

        {/* Form */}
        <form
          onSubmit={handleSignIn}
          style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          <div>
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                color: colors.text,
                fontSize: "0.875rem",
                fontWeight: "500",
              }}
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "0.75rem",
                backgroundColor: colors.background,
                border: `1px solid ${colors.textSecondary}40`,
                borderRadius: "0.5rem",
                color: colors.text,
                fontSize: "1rem",
                boxSizing: "border-box",
                transition: "all 0.3s ease",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = colors.accent;
                e.currentTarget.style.boxShadow = `0 0 0 3px ${colors.accent}20`;
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = colors.textSecondary40;
                e.currentTarget.style.boxShadow = "none";
              }}
            />
          </div>

          <div>
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                color: colors.text,
                fontSize: "0.875rem",
                fontWeight: "500",
              }}
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "0.75rem",
                backgroundColor: colors.background,
                border: `1px solid ${colors.textSecondary}40`,
                borderRadius: "0.5rem",
                color: colors.text,
                fontSize: "1rem",
                boxSizing: "border-box",
                transition: "all 0.3s ease",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = colors.accent;
                e.currentTarget.style.boxShadow = `0 0 0 3px ${colors.accent}20`;
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = colors.textSecondary40;
                e.currentTarget.style.boxShadow = "none";
              }}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              padding: "0.75rem",
              backgroundColor: colors.accent,
              color: colors.background,
              border: "none",
              borderRadius: "0.5rem",
              fontWeight: "700",
              fontSize: "1rem",
              cursor: isLoading ? "not-allowed" : "pointer",
              opacity: isLoading ? 0.6 : 1,
              transition: "all 0.3s ease",
              marginTop: "0.5rem",
            }}
            onMouseEnter={(e) => {
              if (!isLoading) {
                e.currentTarget.style.boxShadow = `0 0 20px ${colors.accent}60`;
                e.currentTarget.style.transform = "translateY(-2px)";
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Sign Up Link */}
        <p
          style={{
            textAlign: "center",
            color: colors.textSecondary,
            marginTop: "1rem",
            fontSize: "0.875rem",
          }}
        >
          Don't have an account?{" "}
          <Link
            href="/auth/signup"
            style={{
              color: colors.accent,
              textDecoration: "none",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  );
}
