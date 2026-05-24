"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Link from "next/link";
import SiteHeader from "../components/SiteHeader";

const colors = {
  background: "#0A0A0A",
  surface: "#1A1A1A",
  text: "#FFFFFF",
  accent: "#FFD700",
      <SiteHeader />
      status: "shipped",
      estimatedDelivery: "2024-05-26",
    },
    {
      id: "ORD-003",
      date: "2024-05-15",
      items: [{ id: "4", product: "Battery", quantity: 1, price: 12000 }],
      total: 15500,
      status: "processing",
      estimatedDelivery: "2024-05-28",
    },
  ];

  const statusConfig: Record<
    string,
    { color: string; icon: string; description: string }
  > = {
    pending: {
      color: "#f97316",
      icon: "⏳",
      description: "Order confirmed, preparing for shipment",
    },
    processing: {
      color: "#3b82f6",
      icon: "📦",
      description: "Your order is being prepared",
    },
    shipped: {
      color: "#f59e0b",
      icon: "🚚",
      description: "Your order is on the way",
    },
    delivered: {
      color: "#10b981",
      icon: "✓",
      description: "Order delivered",
    },
  };

  const formatKES = (price: number) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-KE", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div
      style={{
        backgroundColor: colors.background,
        minHeight: "100vh",
        color: colors.text,
      }}
    >
      {/* Navigation */}
      <nav
        style={{
          backgroundColor: colors.surface,
          padding: "1rem 2rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxShadow: `0 4px 6px rgba(0,0,0,0.3)`,
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <Link href="/" style={{ textDecoration: "none" }}>
          <div
            style={{
              fontSize: "1.5rem",
              fontWeight: "bold",
              color: colors.accent,
              cursor: "pointer",
            }}
          >
            AUTOFIX KENYA
          </div>
        </Link>
        <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
          <Link
            href="/my-garage"
            style={{
              color: colors.text,
              textDecoration: "none",
              cursor: "pointer",
            }}
          >
            My Garage
          </Link>
          <Link
            href="/parts"
            style={{
              color: colors.text,
              textDecoration: "none",
              cursor: "pointer",
            }}
          >
            Parts
          </Link>
          <Link
            href="/services"
            style={{
              color: colors.text,
              textDecoration: "none",
              cursor: "pointer",
            }}
          >
            Services
          </Link>
        </div>
      </nav>

      {/* Content */}
      <div
        style={{ maxWidth: "1200px", margin: "0 auto", padding: "3rem 2rem" }}
      >
        <h1
          style={{
            fontSize: "2.5rem",
            fontWeight: "bold",
            marginBottom: "0.5rem",
          }}
        >
          Order Tracking
        </h1>
        <p style={{ color: colors.textSecondary, marginBottom: "2rem" }}>
          Monitor your parts orders in real-time
        </p>

        {orders.length === 0 ? (
          <div
            style={{
              backgroundColor: colors.surface,
              borderRadius: "0.5rem",
              padding: "2rem",
              textAlign: "center",
              color: colors.textSecondary,
            }}
          >
            <p>No orders found. Start shopping!</p>
            <Link href="/parts" style={{ textDecoration: "none" }}>
              <button
                style={{
                  marginTop: "1rem",
                  padding: "0.75rem 1.5rem",
                  backgroundColor: colors.accent,
                  color: colors.background,
                  border: "none",
                  borderRadius: "0.5rem",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                Shop Parts
              </button>
            </Link>
          </div>
        ) : (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
          >
            {orders.map((order) => {
              const status = statusConfig[order.status];
              return (
                <div
                  key={order.id}
                  style={{
                    backgroundColor: colors.surface,
                    borderRadius: "0.5rem",
                    padding: "1.5rem",
                    borderLeft: `4px solid ${status.color}`,
                  }}
                >
                  {/* Header */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(200px, 1fr))",
                      gap: "1rem",
                      marginBottom: "1rem",
                    }}
                  >
                    <div>
                      <p
                        style={{
                          color: colors.textSecondary,
                          fontSize: "0.875rem",
                          margin: 0,
                        }}
                      >
                        Order ID
                      </p>
                      <p
                        style={{
                          color: colors.accent,
                          fontWeight: "bold",
                          fontSize: "1rem",
                          margin: "0.25rem 0 0 0",
                        }}
                      >
                        {order.id}
                      </p>
                    </div>
                    <div>
                      <p
                        style={{
                          color: colors.textSecondary,
                          fontSize: "0.875rem",
                          margin: 0,
                        }}
                      >
                        Order Date
                      </p>
                      <p
                        style={{
                          color: colors.text,
                          fontWeight: "600",
                          margin: "0.25rem 0 0 0",
                        }}
                      >
                        {formatDate(order.date)}
                      </p>
                    </div>
                    <div>
                      <p
                        style={{
                          color: colors.textSecondary,
                          fontSize: "0.875rem",
                          margin: 0,
                        }}
                      >
                        Total
                      </p>
                      <p
                        style={{
                          color: colors.accent,
                          fontWeight: "bold",
                          fontSize: "1rem",
                          margin: "0.25rem 0 0 0",
                        }}
                      >
                        {formatKES(order.total)}
                      </p>
                    </div>
                  </div>

                  {/* Status */}
                  <div
                    style={{
                      backgroundColor: status.color + "20",
                      border: `1px solid ${status.color}40`,
                      borderRadius: "0.5rem",
                      padding: "1rem",
                      marginBottom: "1rem",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.75rem",
                        marginBottom: "0.5rem",
                      }}
                    >
                      <span style={{ fontSize: "1.5rem" }}>{status.icon}</span>
                      <span
                        style={{
                          color: status.color,
                          fontWeight: "600",
                          textTransform: "capitalize",
                        }}
                      >
                        {order.status}
                      </span>
                    </div>
                    <p
                      style={{
                        color: colors.textSecondary,
                        fontSize: "0.875rem",
                        margin: 0,
                      }}
                    >
                      {status.description}
                    </p>
                    {order.estimatedDelivery && (
                      <p
                        style={{
                          color: colors.textSecondary,
                          fontSize: "0.875rem",
                          margin: "0.5rem 0 0 0",
                        }}
                      >
                        Est. Delivery: {formatDate(order.estimatedDelivery)}
                      </p>
                    )}
                  </div>

                  {/* Items */}
                  <div
                    style={{
                      backgroundColor: colors.background,
                      borderRadius: "0.5rem",
                      padding: "1rem",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "0.875rem",
                        fontWeight: "600",
                        marginBottom: "0.75rem",
                        margin: 0,
                      }}
                    >
                      Items ({order.items.length})
                    </p>
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          paddingBottom: "0.5rem",
                          borderBottom: `1px solid ${colors.textSecondary}20`,
                          fontSize: "0.875rem",
                        }}
                      >
                        <div>
                          <p style={{ margin: 0, color: colors.text }}>
                            {item.product}
                          </p>
                          <p
                            style={{
                              margin: "0.25rem 0 0 0",
                              color: colors.textSecondary,
                              fontSize: "0.75rem",
                            }}
                          >
                            Qty: {item.quantity}
                          </p>
                        </div>
                        <p
                          style={{
                            margin: 0,
                            color: colors.accent,
                            fontWeight: "600",
                          }}
                        >
                          {formatKES(item.price)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Back Button */}
        <div style={{ marginTop: "2rem" }}>
          <Link href="/my-garage" style={{ textDecoration: "none" }}>
            <button
              style={{
                padding: "0.75rem 1.5rem",
                backgroundColor: colors.surface,
                border: `1px solid ${colors.accent}`,
                borderRadius: "0.5rem",
                color: colors.accent,
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = colors.accent;
                e.currentTarget.style.color = colors.background;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = colors.surface;
                e.currentTarget.style.color = colors.accent;
              }}
            >
              ← Back to Dashboard
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
