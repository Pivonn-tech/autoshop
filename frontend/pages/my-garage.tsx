"use client";

import { useState } from "react";
import Link from "next/link";

interface Vehicle {
  id: number;
  year: number;
  make: string;
  model: string;
  vin: string;
  mileage: number;
}

interface Order {
  id: string;
  date: string;
  items: string;
  total: number;
  status: "Delivered" | "Processing" | "Shipped";
}

interface ServiceRecord {
  id: string;
  date: string;
  service: string;
  cost: number;
  nextDue: string;
  mileage: number;
}

export default function MyGarage() {
  const [vehicles] = useState<Vehicle[]>([
    {
      id: 1,
      year: 2020,
      make: "Toyota",
      model: "Corolla",
      vin: "JT2BF18K1X0000001",
      mileage: 45230,
    },
    {
      id: 2,
      year: 2018,
      make: "Nissan",
      model: "X-Trail",
      vin: "JN1BF18J18X123456",
      mileage: 78540,
    },
  ]);

  const [orders] = useState<Order[]>([
    {
      id: "ORD-001",
      date: "2024-05-10",
      items: "2x Brake Pads, 1x Oil Filter",
      total: 36500,
      status: "Delivered",
    },
    {
      id: "ORD-002",
      date: "2024-05-05",
      items: "1x Air Filter",
      total: 4200,
      status: "Delivered",
    },
  ]);

  const [serviceRecords] = useState<ServiceRecord[]>([
    {
      id: "SRV-001",
      date: "2024-04-15",
      service: "Oil Change",
      cost: 5500,
      nextDue: "2024-07-15",
      mileage: 45000,
    },
    {
      id: "SRV-002",
      date: "2024-03-20",
      service: "Brake Service",
      cost: 12000,
      nextDue: "2025-03-20",
      mileage: 44500,
    },
  ]);

  const [activeTab, setActiveTab] = useState<
    "vehicles" | "orders" | "services"
  >("vehicles");

  // Cyber/Sport Color Palette
  const colors = {
    background: "#0A0A0A",
    surface: "#1A1A1A",
    text: "#FFFFFF",
    accent: "#FFD700",
    textSecondary: "#666666",
  };

  const formatKES = (price: number) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered":
        return "#10b981";
      case "Shipped":
        return colors.accent;
      case "Processing":
        return "#3b82f6";
      default:
        return colors.textSecondary;
    }
  };

  return (
    <div
      style={{
        backgroundColor: colors.background,
        color: colors.text,
        minHeight: "100vh",
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
            href="/inventory"
            style={{
              color: colors.text,
              textDecoration: "none",
              cursor: "pointer",
            }}
          >
            Inventory
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
          <Link
            href="/my-garage"
            style={{
              color: colors.accent,
              textDecoration: "none",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            My Garage
          </Link>
        </div>
      </nav>

      <div
        style={{ maxWidth: "1200px", margin: "0 auto", padding: "3rem 2rem" }}
      >
        {/* Header */}
        <div style={{ marginBottom: "3rem" }}>
          <h1
            style={{
              fontSize: "2.5rem",
              fontWeight: 900,
              marginBottom: "0.5rem",
            }}
          >
            My Garage
          </h1>
          <p style={{ color: colors.textSecondary, fontSize: "1.1rem" }}>
            Manage your vehicles, order history, and maintenance records
          </p>
        </div>

        {/* Tab Navigation */}
        <div
          style={{
            display: "flex",
            gap: "1rem",
            marginBottom: "3rem",
            borderBottom: `2px solid ${colors.surface}`,
          }}
        >
          {(["vehicles", "orders", "services"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                paddingBottom: "1rem",
                backgroundColor: "transparent",
                color: activeTab === tab ? colors.accent : colors.textSecondary,
                border: "none",
                borderBottom:
                  activeTab === tab ? `3px solid ${colors.accent}` : "none",
                fontWeight: activeTab === tab ? 900 : "bold",
                cursor: "pointer",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                fontSize: "0.95rem",
              }}
            >
              {tab === "vehicles" && "Saved Vehicles"}
              {tab === "orders" && "Order History"}
              {tab === "services" && "Service Records"}
            </button>
          ))}
        </div>

        {/* Vehicles Tab */}
        {activeTab === "vehicles" && (
          <div>
            <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: 900,
                marginBottom: "2rem",
              }}
            >
              Your Vehicles
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
                gap: "2rem",
              }}
            >
              {vehicles.map((vehicle) => (
                <div
                  key={vehicle.id}
                  style={{
                    backgroundColor: colors.surface,
                    padding: "2rem",
                    borderRadius: "2px",
                    border: `1px solid ${colors.accent}`,
                  }}
                >
                  <h3
                    style={{
                      fontSize: "1.3rem",
                      fontWeight: 900,
                      marginBottom: "1rem",
                      color: colors.accent,
                    }}
                  >
                    {vehicle.year} {vehicle.make} {vehicle.model}
                  </h3>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.75rem",
                      marginBottom: "1.5rem",
                    }}
                  >
                    <div>
                      <p
                        style={{
                          color: colors.textSecondary,
                          fontSize: "0.85rem",
                          marginBottom: "0.25rem",
                        }}
                      >
                        VIN
                      </p>
                      <p
                        style={{ fontFamily: "monospace", fontSize: "0.9rem" }}
                      >
                        {vehicle.vin}
                      </p>
                    </div>
                    <div>
                      <p
                        style={{
                          color: colors.textSecondary,
                          fontSize: "0.85rem",
                          marginBottom: "0.25rem",
                        }}
                      >
                        Mileage
                      </p>
                      <p style={{ fontSize: "1.1rem", fontWeight: 900 }}>
                        {vehicle.mileage.toLocaleString()} km
                      </p>
                    </div>
                  </div>
                  <button
                    style={{
                      width: "100%",
                      backgroundColor: colors.accent,
                      color: colors.background,
                      border: "none",
                      padding: "0.75rem",
                      borderRadius: "2px",
                      fontWeight: 900,
                      cursor: "pointer",
                      textTransform: "uppercase",
                    }}
                  >
                    View Details
                  </button>
                </div>
              ))}
              <div
                style={{
                  backgroundColor: colors.surface,
                  padding: "2rem",
                  borderRadius: "2px",
                  border: `2px dashed ${colors.accent}`,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = colors.accent;
                  e.currentTarget.style.color = colors.background;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = colors.surface;
                  e.currentTarget.style.color = colors.text;
                }}
              >
                <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
                  +
                </div>
                <p
                  style={{
                    fontWeight: 900,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  Add Vehicle
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === "orders" && (
          <div>
            <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: 900,
                marginBottom: "2rem",
              }}
            >
              Order History
            </h2>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
              }}
            >
              {orders.map((order) => (
                <div
                  key={order.id}
                  style={{
                    backgroundColor: colors.surface,
                    padding: "1.5rem",
                    borderRadius: "2px",
                    border: `1px solid ${colors.textSecondary}`,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <p
                      style={{
                        color: colors.accent,
                        fontWeight: 900,
                        marginBottom: "0.25rem",
                      }}
                    >
                      {order.id}
                    </p>
                    <p
                      style={{
                        color: colors.textSecondary,
                        fontSize: "0.9rem",
                        marginBottom: "0.5rem",
                      }}
                    >
                      {order.date}
                    </p>
                    <p style={{ fontSize: "0.95rem", minWidth: "300px" }}>
                      {order.items}
                    </p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p
                      style={{
                        color: colors.textSecondary,
                        fontSize: "0.85rem",
                        marginBottom: "0.5rem",
                      }}
                    >
                      Status
                    </p>
                    <p
                      style={{
                        color: getStatusColor(order.status),
                        fontWeight: 900,
                        marginBottom: "0.75rem",
                        textTransform: "uppercase",
                      }}
                    >
                      {order.status}
                    </p>
                    <p
                      style={{
                        fontSize: "1.2rem",
                        fontWeight: 900,
                        color: colors.accent,
                      }}
                    >
                      {formatKES(order.total)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Services Tab */}
        {activeTab === "services" && (
          <div>
            <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: 900,
                marginBottom: "2rem",
              }}
            >
              Service & Maintenance Records
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
                gap: "2rem",
              }}
            >
              {serviceRecords.map((record) => (
                <div
                  key={record.id}
                  style={{
                    backgroundColor: colors.surface,
                    padding: "1.5rem",
                    borderRadius: "2px",
                    border: `1px solid ${colors.accent}`,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "start",
                      marginBottom: "1rem",
                    }}
                  >
                    <div>
                      <p
                        style={{
                          color: colors.accent,
                          fontWeight: 900,
                          marginBottom: "0.25rem",
                        }}
                      >
                        {record.service}
                      </p>
                      <p
                        style={{
                          color: colors.textSecondary,
                          fontSize: "0.85rem",
                        }}
                      >
                        {record.id}
                      </p>
                    </div>
                    <p
                      style={{
                        color: colors.accent,
                        fontSize: "1.1rem",
                        fontWeight: 900,
                      }}
                    >
                      {formatKES(record.cost)}
                    </p>
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "1rem",
                      borderTop: `1px solid ${colors.textSecondary}`,
                      paddingTop: "1rem",
                      marginBottom: "1rem",
                    }}
                  >
                    <div>
                      <p
                        style={{
                          color: colors.textSecondary,
                          fontSize: "0.75rem",
                          marginBottom: "0.25rem",
                          textTransform: "uppercase",
                        }}
                      >
                        Service Date
                      </p>
                      <p style={{ fontWeight: 900 }}>{record.date}</p>
                    </div>
                    <div>
                      <p
                        style={{
                          color: colors.textSecondary,
                          fontSize: "0.75rem",
                          marginBottom: "0.25rem",
                          textTransform: "uppercase",
                        }}
                      >
                        Mileage
                      </p>
                      <p style={{ fontWeight: 900 }}>
                        {record.mileage.toLocaleString()} km
                      </p>
                    </div>
                  </div>

                  <div
                    style={{
                      padding: "1rem",
                      backgroundColor: colors.background,
                      borderRadius: "4px",
                      border: `1px dashed ${colors.accent}`,
                    }}
                  >
                    <p
                      style={{
                        color: colors.textSecondary,
                        fontSize: "0.75rem",
                        marginBottom: "0.25rem",
                        textTransform: "uppercase",
                      }}
                    >
                      Next Due
                    </p>
                    <p
                      style={{
                        fontSize: "1rem",
                        fontWeight: 900,
                        color: colors.accent,
                      }}
                    >
                      {record.nextDue}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
