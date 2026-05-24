"use client";

import { useState } from "react";
import Link from "next/link";

interface Service {
  id: number;
  title: string;
  description: string;
  price: number;
  duration: string;
  icon: string;
}

export default function Services() {
  const [selectedService, setSelectedService] = useState<number | null>(null);
  const [bookingStep, setBookingStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  // Cyber/Sport Color Palette
  const colors = {
    background: "#0A0A0A",
    surface: "#1A1A1A",
    text: "#FFFFFF",
    accent: "#FFD700",
    textSecondary: "#666666",
  };

  const services: Service[] = [
    {
      id: 1,
      title: "Oil Change Service",
      description:
        "Complete oil and filter replacement with fluid top-ups. Includes multi-point inspection.",
      price: 5500,
      duration: "45 minutes",
      icon: "⚙️",
    },
    {
      id: 2,
      title: "Brake Service",
      description:
        "Brake pad replacement, rotor inspection, fluid flush, and brake system diagnostics.",
      price: 12000,
      duration: "2 hours",
      icon: "🛑",
    },
    {
      id: 3,
      title: "Engine Diagnostics",
      description:
        "Computer diagnostics, error code reading, and comprehensive engine health analysis.",
      price: 4500,
      duration: "1 hour",
      icon: "🔍",
    },
    {
      id: 4,
      title: "Tire Service",
      description:
        "Tire mounting, balancing, rotation, repair, and wheel alignment.",
      price: 3500,
      duration: "1.5 hours",
      icon: "🔧",
    },
    {
      id: 5,
      title: "AC Service",
      description:
        "Air conditioning refrigerant recharge, filter replacement, and system inspection.",
      price: 7500,
      duration: "1 hour",
      icon: "❄️",
    },
    {
      id: 6,
      title: "Transmission Service",
      description:
        "Fluid replacement, filter service, and transmission system inspection.",
      price: 15000,
      duration: "3 hours",
      icon: "⚡",
    },
  ];

  const formatKES = (price: number) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const timeSlots = [
    "09:00",
    "10:00",
    "11:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
  ];

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
              color: colors.accent,
              textDecoration: "none",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Services
          </Link>
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
        </div>
      </nav>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem" }}>
        <h1
          style={{
            fontSize: "2.5rem",
            fontWeight: 900,
            marginBottom: "0.5rem",
          }}
        >
          Service & Maintenance
        </h1>
        <p
          style={{
            color: colors.textSecondary,
            fontSize: "1.1rem",
            marginBottom: "3rem",
          }}
        >
          Expert technicians ready to service your vehicle with precision
        </p>

        {selectedService === null ? (
          // Service Selection View
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "2rem",
            }}
          >
            {services.map((service) => (
              <div
                key={service.id}
                style={{
                  backgroundColor: colors.surface,
                  padding: "2rem",
                  borderRadius: "2px",
                  border: `1px solid ${colors.accent}`,
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.02)";
                  e.currentTarget.style.boxShadow = `0 12px 40px rgba(255, 215, 0, 0.2)`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow = "none";
                }}
                onClick={() => setSelectedService(service.id)}
              >
                <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>
                  {service.icon}
                </div>
                <h3
                  style={{
                    fontSize: "1.3rem",
                    fontWeight: 900,
                    marginBottom: "0.5rem",
                  }}
                >
                  {service.title}
                </h3>
                <p
                  style={{
                    color: colors.textSecondary,
                    marginBottom: "1.5rem",
                    fontSize: "0.95rem",
                    minHeight: "3rem",
                  }}
                >
                  {service.description}
                </p>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "1.5rem",
                    paddingTop: "1rem",
                    borderTop: `1px solid ${colors.textSecondary}`,
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
                      Duration
                    </p>
                    <p style={{ fontWeight: 900 }}>{service.duration}</p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p
                      style={{
                        color: colors.textSecondary,
                        fontSize: "0.85rem",
                        marginBottom: "0.25rem",
                      }}
                    >
                      Starting at
                    </p>
                    <p
                      style={{
                        fontSize: "1.5rem",
                        fontWeight: 900,
                        color: colors.accent,
                      }}
                    >
                      {formatKES(service.price)}
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
                    letterSpacing: "0.05em",
                  }}
                >
                  Book Now
                </button>
              </div>
            ))}
          </div>
        ) : (
          // Booking Modal
          <div
            style={{
              maxWidth: "600px",
              margin: "0 auto",
              backgroundColor: colors.surface,
              padding: "2rem",
              borderRadius: "2px",
              border: `2px solid ${colors.accent}`,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "2rem",
              }}
            >
              <h2 style={{ fontSize: "1.8rem", fontWeight: 900 }}>
                Book Service
              </h2>
              <button
                onClick={() => {
                  setSelectedService(null);
                  setBookingStep(1);
                }}
                style={{
                  backgroundColor: "transparent",
                  color: colors.accent,
                  border: "none",
                  fontSize: "1.5rem",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                ✕
              </button>
            </div>

            {/* Progress Indicator */}
            <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem" }}>
              {[1, 2, 3].map((step) => (
                <div
                  key={step}
                  style={{
                    flex: 1,
                    height: "4px",
                    backgroundColor:
                      bookingStep >= step ? colors.accent : colors.background,
                    borderRadius: "2px",
                  }}
                />
              ))}
            </div>

            {bookingStep === 1 && (
              <div>
                <p
                  style={{
                    color: colors.textSecondary,
                    marginBottom: "1rem",
                    textTransform: "uppercase",
                    fontSize: "0.85rem",
                    fontWeight: 900,
                    letterSpacing: "0.05em",
                  }}
                >
                  Step 1: Confirm Service
                </p>
                <div
                  style={{
                    backgroundColor: colors.background,
                    padding: "1.5rem",
                    borderRadius: "4px",
                    marginBottom: "2rem",
                    border: `1px solid ${colors.accent}`,
                  }}
                >
                  <p
                    style={{
                      color: colors.textSecondary,
                      marginBottom: "0.5rem",
                    }}
                  >
                    Selected Service
                  </p>
                  <p style={{ fontSize: "1.3rem", fontWeight: 900 }}>
                    {services.find((s) => s.id === selectedService)?.title}
                  </p>
                </div>
                <button
                  onClick={() => setBookingStep(2)}
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
                  Continue
                </button>
              </div>
            )}

            {bookingStep === 2 && (
              <div>
                <p
                  style={{
                    color: colors.textSecondary,
                    marginBottom: "1rem",
                    textTransform: "uppercase",
                    fontSize: "0.85rem",
                    fontWeight: 900,
                    letterSpacing: "0.05em",
                  }}
                >
                  Step 2: Select Date & Time
                </p>
                <div style={{ marginBottom: "1.5rem" }}>
                  <label
                    style={{
                      display: "block",
                      fontWeight: 900,
                      marginBottom: "0.5rem",
                    }}
                  >
                    Date
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      backgroundColor: colors.background,
                      color: colors.text,
                      border: `1px solid ${colors.accent}`,
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  />
                </div>
                <div style={{ marginBottom: "2rem" }}>
                  <label
                    style={{
                      display: "block",
                      fontWeight: 900,
                      marginBottom: "0.75rem",
                    }}
                  >
                    Time Slot
                  </label>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(80px, 1fr))",
                      gap: "0.5rem",
                    }}
                  >
                    {timeSlots.map((time) => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        style={{
                          backgroundColor:
                            selectedTime === time
                              ? colors.accent
                              : colors.background,
                          color:
                            selectedTime === time
                              ? colors.background
                              : colors.text,
                          border: `1px solid ${colors.accent}`,
                          padding: "0.75rem",
                          borderRadius: "4px",
                          fontWeight: "bold",
                          cursor: "pointer",
                        }}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
                <div style={{ display: "flex", gap: "1rem" }}>
                  <button
                    onClick={() => setBookingStep(1)}
                    style={{
                      flex: 1,
                      backgroundColor: colors.background,
                      color: colors.accent,
                      border: `1px solid ${colors.accent}`,
                      padding: "0.75rem",
                      borderRadius: "2px",
                      fontWeight: 900,
                      cursor: "pointer",
                      textTransform: "uppercase",
                    }}
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setBookingStep(3)}
                    disabled={!selectedDate || !selectedTime}
                    style={{
                      flex: 1,
                      backgroundColor:
                        selectedDate && selectedTime
                          ? colors.accent
                          : colors.textSecondary,
                      color: colors.background,
                      border: "none",
                      padding: "0.75rem",
                      borderRadius: "2px",
                      fontWeight: 900,
                      cursor:
                        selectedDate && selectedTime
                          ? "pointer"
                          : "not-allowed",
                      textTransform: "uppercase",
                    }}
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {bookingStep === 3 && (
              <div>
                <p
                  style={{
                    color: colors.textSecondary,
                    marginBottom: "1rem",
                    textTransform: "uppercase",
                    fontSize: "0.85rem",
                    fontWeight: 900,
                    letterSpacing: "0.05em",
                  }}
                >
                  Step 3: Confirm Booking
                </p>
                <div
                  style={{
                    backgroundColor: colors.background,
                    padding: "1.5rem",
                    borderRadius: "4px",
                    marginBottom: "2rem",
                    border: `1px solid ${colors.accent}`,
                  }}
                >
                  <p
                    style={{
                      marginBottom: "1rem",
                      paddingBottom: "1rem",
                      borderBottom: `1px solid ${colors.textSecondary}`,
                    }}
                  >
                    <strong>Service:</strong>{" "}
                    {services.find((s) => s.id === selectedService)?.title}
                  </p>
                  <p
                    style={{
                      marginBottom: "1rem",
                      paddingBottom: "1rem",
                      borderBottom: `1px solid ${colors.textSecondary}`,
                    }}
                  >
                    <strong>Date:</strong> {selectedDate}
                  </p>
                  <p style={{ marginBottom: "1rem" }}>
                    <strong>Time:</strong> {selectedTime}
                  </p>
                  <p
                    style={{
                      marginTop: "1rem",
                      paddingTop: "1rem",
                      borderTop: `1px solid ${colors.accent}`,
                      fontSize: "1.2rem",
                      fontWeight: 900,
                      color: colors.accent,
                    }}
                  >
                    Total:{" "}
                    {formatKES(
                      services.find((s) => s.id === selectedService)?.price ||
                        0,
                    )}
                  </p>
                </div>
                <div style={{ display: "flex", gap: "1rem" }}>
                  <button
                    onClick={() => setBookingStep(2)}
                    style={{
                      flex: 1,
                      backgroundColor: colors.background,
                      color: colors.accent,
                      border: `1px solid ${colors.accent}`,
                      padding: "0.75rem",
                      borderRadius: "2px",
                      fontWeight: 900,
                      cursor: "pointer",
                      textTransform: "uppercase",
                    }}
                  >
                    Back
                  </button>
                  <button
                    onClick={() => {
                      alert(
                        "Booking confirmed! You will receive a confirmation email shortly.",
                      );
                      setSelectedService(null);
                      setBookingStep(1);
                    }}
                    style={{
                      flex: 1,
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
                    Confirm Booking
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
