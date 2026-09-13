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

export default function SignupPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.message || "Registration failed");
        return;
      }

      // Auto-login after successful registration
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
      } else if (result?.ok) {
        router.push("/my-garage");
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
            Create your account to start shopping
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

        {/* OAuth Buttons — Google/GitHub not yet configured; hidden until credentials are added to .env */}

        {/* Form */}
        <form
          onSubmit={handleSignUp}
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
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
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
              minLength={8}
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
            <p
              style={{
                color: colors.textSecondary,
                fontSize: "0.75rem",
                margin: "0.25rem 0 0 0",
              }}
            >
              At least 8 characters
            </p>
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
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
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
            {isLoading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        {/* Sign In Link */}
        <p
          style={{
            textAlign: "center",
            color: colors.textSecondary,
            marginTop: "1rem",
            fontSize: "0.875rem",
          }}
        >
          Already have an account?{" "}
          <Link
            href="/auth/login"
            style={{
              color: colors.accent,
              textDecoration: "none",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
}
