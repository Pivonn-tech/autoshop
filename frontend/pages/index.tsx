import { useState, useEffect, useRef } from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";

// ── Icons ──────────────────────────────────────────────────────────────────────
function ArrowRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
    </svg>
  );
}
function ClockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
function StarIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}
function LiveIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
      <circle cx="12" cy="12" r="4" />
    </svg>
  );
}

// ── Auction Countdown Timer ────────────────────────────────────────────────────
function AuctionCountdown({ hours = 2, minutes = 45, seconds = 30 }) {
  const [time, setTime] = useState({ h: hours, m: minutes, s: seconds });

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(prev => {
        let { h, m, s } = prev;
        s--;
        if (s < 0) { s = 59; m--; }
        if (m < 0) { m = 59; h--; }
        if (h < 0) { h = 0; m = 0; s = 0; clearInterval(timer); }
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "0.75rem", fontWeight: 700, color: "var(--red-accent)" }}>
      <ClockIcon />
      <span>{String(time.h).padStart(2, '0')}:{String(time.m).padStart(2, '0')}:{String(time.s).padStart(2, '0')}</span>
      <LiveIcon />
    </div>
  );
}

// ── Hero Section: Universal Search Funnel ──────────────────────────────────────
function HeroFunnel() {
  const [activeTab, setActiveTab] = useState<"buy" | "auction" | "service">("buy");
  const [searchParams, setSearchParams] = useState({
    year: "2024",
    make: "Toyota",
    model: "Hilux",
    budget: "2.5M",
  });

  const tabs = [
    { id: "buy", label: "Buy Cars", icon: "car" },
    { id: "auction", label: "Live Auctions", icon: "bolt" },
    { id: "service", label: "Book Service", icon: "wrench" },
  ];

  return (
    <section
      style={{
        position: "relative",
        minHeight: "600px",
        background: "linear-gradient(rgba(26, 30, 36, 0.9), rgba(26, 30, 36, 0.95)), url('/car-hero-bg.jpg') center/cover",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "80px 20px",
      }}
    >
      <div className="container-wide" style={{ maxWidth: "1200px", width: "100%" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          {/* Hero Title */}
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <h1 style={{
              fontFamily: "var(--font-space-grotesk, sans-serif)",
              fontSize: "clamp(2rem, 4vw, 3.5rem)",
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              marginBottom: "16px",
              background: "linear-gradient(135deg, #FFFFFF 0%, #F3F4F6 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>
              Find & Own Your Dream Vehicle
            </h1>
            <p style={{
              fontSize: "1.1rem",
              color: "rgba(255,255,255,0.8)",
              maxWidth: "600px",
              margin: "0 auto",
              lineHeight: 1.6,
            }}>
              Kenya's premier automotive marketplace. Browse thousands of vehicles, bid in live auctions, or book expert services.
            </p>
          </div>

          {/* Tabbed Search Widget */}
          <div style={{
            background: "white",
            borderRadius: "16px",
            boxShadow: "0 32px 64px rgba(0,0,0,0.25)",
            overflow: "hidden",
          }}>
            {/* Tabs */}
            <div style={{
              display: "flex",
              borderBottom: "2px solid var(--surface)",
            }}>
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  style={{
                    flex: 1,
                    padding: "20px",
                    background: activeTab === tab.id ? "white" : "var(--surface)",
                    border: "none",
                    fontSize: "0.95rem",
                    fontWeight: 600,
                    color: activeTab === tab.id ? "var(--charcoal)" : "var(--text-secondary)",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    borderBottom: activeTab === tab.id ? "3px solid var(--red-accent)" : "3px solid transparent",
                    transition: "all 200ms ease",
                  }}
                >
                  <span style={{ fontSize: "1.2rem" }}>{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Search Form */}
            <div style={{ padding: "32px" }}>
              {activeTab === "buy" && (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "8px" }}>
                      Year
                    </label>
                    <select
                      value={searchParams.year}
                      onChange={(e) => setSearchParams({...searchParams, year: e.target.value})}
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        border: "1.5px solid var(--border)",
                        borderRadius: "8px",
                        fontSize: "0.9rem",
                        color: "var(--text)",
                        background: "white",
                      }}
                    >
                      {[2024, 2023, 2022, 2021, 2020, 2019, 2018].map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "8px" }}>
                      Make
                    </label>
                    <select
                      value={searchParams.make}
                      onChange={(e) => setSearchParams({...searchParams, make: e.target.value})}
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        border: "1.5px solid var(--border)",
                        borderRadius: "8px",
                        fontSize: "0.9rem",
                        color: "var(--text)",
                        background: "white",
                      }}
                    >
                      {["Toyota", "Honda", "Mazda", "Subaru", "Isuzu", "Mitsubishi", "Nissan", "Suzuki"].map(make => (
                        <option key={make} value={make}>{make}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "8px" }}>
                      Model
                    </label>
                    <select
                      value={searchParams.model}
                      onChange={(e) => setSearchParams({...searchParams, model: e.target.value})}
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        border: "1.5px solid var(--border)",
                        borderRadius: "8px",
                        fontSize: "0.9rem",
                        color: "var(--text)",
                        background: "white",
                      }}
                    >
                      {["Hilux", "Land Cruiser", "Rav4", "Corolla", "Camry", "Noah", "Wish"].map(model => (
                        <option key={model} value={model}>{model}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "8px" }}>
                      Max Budget
                    </label>
                    <select
                      value={searchParams.budget}
                      onChange={(e) => setSearchParams({...searchParams, budget: e.target.value})}
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        border: "1.5px solid var(--border)",
                        borderRadius: "8px",
                        fontSize: "0.9rem",
                        color: "var(--text)",
                        background: "white",
                      }}
                    >
                      {["1.5M", "2M", "2.5M", "3M", "3.5M", "4M", "4.5M", "5M+"].map(budget => (
                        <option key={budget} value={budget}>KSh {budget}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {activeTab === "auction" && (
                <div style={{ textAlign: "center", padding: "20px" }}>
                  <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", marginBottom: "20px" }}>
                    Browse live vehicle auctions with real-time bidding and countdown timers.
                  </p>
                </div>
              )}

              {activeTab === "service" && (
                <div style={{ textAlign: "center", padding: "20px" }}>
                  <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", marginBottom: "20px" }}>
                    Book professional automotive services with certified mechanics.
                  </p>
                </div>
              )}

              {/* Search Button */}
              <div style={{ marginTop: "32px", textAlign: "center" }}>
                <Link
                  href={activeTab === "buy" ? "/inventory" : activeTab === "auction" ? "/auctions" : "/services"}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "10px",
                    padding: "16px 40px",
                    background: "var(--red-accent)",
                    color: "white",
                    borderRadius: "10px",
                    fontSize: "1rem",
                    fontWeight: 700,
                    textDecoration: "none",
                    transition: "all 200ms ease",
                    boxShadow: "0 8px 24px rgba(229,27,36,0.3)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#c51620";
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 12px 32px rgba(229,27,36,0.4)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "var(--red-accent)";
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 8px 24px rgba(229,27,36,0.3)";
                  }}
                >
                  <span>{activeTab === "buy" ? "Search Inventory" : activeTab === "auction" ? "Browse Auctions" : "Book Service"}</span>
                  <ArrowRight />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Live Auction Card ──────────────────────────────────────────────────────────
function AuctionCard({ 
  title, 
  currentBid, 
  image = "/car-placeholder.jpg",
  timeLeft = "2h 45m",
  live = true 
}: { 
  title: string; 
  currentBid: string; 
  image?: string;
  timeLeft?: string;
  live?: boolean;
}) {
  return (
    <div style={{
      background: "white",
      border: "1px solid var(--border)",
      borderRadius: "12px",
      overflow: "hidden",
      transition: "all 250ms ease",
      boxShadow: "0 4px 16px rgba(0,0,0,0.05)",
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = "translateY(-6px)";
      e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.1)";
      e.currentTarget.style.borderColor = "var(--red-accent)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = "translateY(0)";
      e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.05)";
      e.currentTarget.style.borderColor = "var(--border)";
    }}>
      {/* Image Container */}
      <div style={{ position: "relative", aspectRatio: "16/10", overflow: "hidden" }}>
        <img
          src={image}
          alt={title}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        
        {/* Live Badge */}
        {live && (
          <div style={{
            position: "absolute",
            top: "12px",
            left: "12px",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "6px 12px",
            background: "var(--red-accent)",
            color: "white",
            borderRadius: "20px",
            fontSize: "0.7rem",
            fontWeight: 700,
            letterSpacing: "0.05em",
            animation: "pulse 2s infinite",
          }}>
            <LiveIcon />
            LIVE
          </div>
        )}

        {/* Countdown */}
        <div style={{
          position: "absolute",
          top: "12px",
          right: "12px",
          padding: "6px 12px",
          background: "rgba(26,30,36,0.9)",
          color: "white",
          borderRadius: "8px",
          fontSize: "0.8rem",
          fontWeight: 600,
          display: "flex",
          alignItems: "center",
          gap: "6px",
        }}>
          <ClockIcon />
          <span>{timeLeft}</span>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: "20px" }}>
        <h3 style={{
          fontFamily: "var(--font-space-grotesk, sans-serif)",
          fontSize: "1rem",
          fontWeight: 700,
          color: "var(--text)",
          margin: "0 0 12px 0",
          lineHeight: 1.3,
        }}>
          {title}
        </h3>

        {/* Current Bid */}
        <div style={{ marginBottom: "20px" }}>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Current Bid
          </div>
          <div style={{
            fontFamily: "var(--font-space-grotesk, sans-serif)",
            fontSize: "1.25rem",
            fontWeight: 800,
            color: "var(--red-accent)",
          }}>
            {currentBid}
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: "flex", gap: "10px" }}>
          <button style={{
            flex: 1,
            padding: "12px 16px",
            background: "var(--red-accent)",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "0.85rem",
            fontWeight: 700,
            cursor: "pointer",
            transition: "all 200ms ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#c51620";
            e.currentTarget.style.transform = "translateY(-2px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "var(--red-accent)";
            e.currentTarget.style.transform = "translateY(0)";
          }}>
            Place Bid
          </button>
          <button style={{
            padding: "12px 16px",
            background: "transparent",
            color: "var(--text-secondary)",
            border: "1.5px solid var(--border)",
            borderRadius: "8px",
            fontSize: "0.85rem",
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 200ms ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "var(--charcoal)";
            e.currentTarget.style.color = "var(--charcoal)";
            e.currentTarget.style.background = "var(--surface)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "var(--border)";
            e.currentTarget.style.color = "var(--text-secondary)";
            e.currentTarget.style.background = "transparent";
          }}>
            View
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Live Auctions Zone ─────────────────────────────────────────────────────────
function LiveAuctionsZone() {
  const auctions = [
    { 
      title: "2022 Toyota Hilux 4x4 Double Cab", 
      currentBid: "KSh 3.8M", 
      timeLeft: "1h 24m",
      bids: 42,
      image: "/hilux-auction.jpg"
    },
    { 
      title: "2020 Subaru Forester XT Turbo", 
      currentBid: "KSh 2.9M", 
      timeLeft: "45m 12s",
      bids: 28,
      image: "/forester-auction.jpg"
    },
    { 
      title: "2023 Isuzu D-Max Pickup", 
      currentBid: "KSh 4.2M", 
      timeLeft: "3h 12m",
      bids: 31,
      image: "/dmax-auction.jpg"
    },
    { 
      title: "2019 Honda CR-V EX Executive", 
      currentBid: "KSh 2.5M", 
      timeLeft: "56m 30s",
      bids: 19,
      image: "/crv-auction.jpg"
    },
  ];

  return (
    <section style={{ padding: "80px 20px", background: "var(--surface)" }}>
      <div className="container-wide" style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Section Header */}
        <div style={{ marginBottom: "48px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
            <div>
              <div style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "0.75rem",
                fontWeight: 700,
                color: "var(--red-accent)",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                marginBottom: "12px",
              }}>
                <div style={{ width: "20px", height: "2px", background: "var(--red-accent)" }} />
                Live Auctions
              </div>
              <h2 style={{
                fontFamily: "var(--font-space-grotesk, sans-serif)",
                fontSize: "clamp(1.5rem, 3vw, 2.5rem)",
                fontWeight: 800,
                color: "var(--text)",
                margin: 0,
                lineHeight: 1.2,
              }}>
                Bid in Real-Time
              </h2>
              <p style={{
                fontSize: "1rem",
                color: "var(--text-secondary)",
                maxWidth: "600px",
                marginTop: "12px",
                lineHeight: 1.6,
              }}>
                Join active auctions with countdown timers and competitive bidding. Don't miss out on great deals!
              </p>
            </div>
            <Link
              href="/auctions"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "12px 24px",
                background: "var(--charcoal)",
                color: "white",
                borderRadius: "8px",
                fontSize: "0.9rem",
                fontWeight: 600,
                textDecoration: "none",
                transition: "all 200ms ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#2a3540";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "var(--charcoal)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              View All Auctions <ArrowRight />
            </Link>
          </div>
        </div>

        {/* Auction Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "24px",
        }}>
          {auctions.map((auction, index) => (
            <AuctionCard
              key={index}
              title={auction.title}
              currentBid={auction.currentBid}
              timeLeft={auction.timeLeft}
            />
          ))}
        </div>

        {/* Auction Stats */}
        <div style={{
          marginTop: "48px",
          padding: "32px",
          background: "var(--charcoal)",
          borderRadius: "12px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "24px",
          textAlign: "center",
        }}>
          <div>
            <div style={{
              fontFamily: "var(--font-space-grotesk, sans-serif)",
              fontSize: "2rem",
              fontWeight: 800,
              color: "var(--red-accent)",
              marginBottom: "8px",
            }}>
              24+
            </div>
            <div style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.8)" }}>
              Active Auctions
            </div>
          </div>
          <div>
            <div style={{
              fontFamily: "var(--font-space-grotesk, sans-serif)",
              fontSize: "2rem",
              fontWeight: 800,
              color: "var(--red-accent)",
              marginBottom: "8px",
            }}>
              KSh 58M
            </div>
            <div style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.8)" }}>
              Total Value
            </div>
          </div>
          <div>
            <div style={{
              fontFamily: "var(--font-space-grotesk, sans-serif)",
              fontSize: "2rem",
              fontWeight: 800,
              color: "var(--red-accent)",
              marginBottom: "8px",
            }}>
              142+
            </div>
            <div style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.8)" }}>
              Active Bidders
            </div>
          </div>
          <div>
            <div style={{
              fontFamily: "var(--font-space-grotesk, sans-serif)",
              fontSize: "2rem",
              fontWeight: 800,
              color: "var(--red-accent)",
              marginBottom: "8px",
            }}>
              12+
            </div>
            <div style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.8)" }}>
              Ending Today
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Main Page Component ────────────────────────────────────────────────────────
export default function HomePage() {
  return (
    <div style={{ background: "var(--bg)", color: "var(--text)" }}>
      <Head>
        <title>AutoShop Kenya — Automotive Marketplace & Live Auctions</title>
        <meta name="description" content="Kenya's premier automotive marketplace. Buy vehicles, bid in live auctions, sell your car, and book expert services." />
        <meta property="og:title" content="AutoShop Kenya — Automotive Marketplace & Live Auctions" />
        <meta property="og:description" content="Kenya's premier automotive marketplace. Buy vehicles, bid in live auctions, sell your car, and book expert services." />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/og-image.jpg" />
      </Head>

      {/* 1. Hero Section with Universal Search Funnel */}
      <HeroFunnel />

      {/* 2. Live Auctions Zone */}
      <LiveAuctionsZone />

      {/* 3. Dual-Action Banners (Sell vs Service) */}
      <section style={{ padding: "80px 20px" }}>
        <div className="container-wide" style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "24px",
            height: "320px",
          }}>
            {/* Sell Your Car */}
            <div style={{
              background: "var(--surface)",
              borderRadius: "16px",
              padding: "48px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}>
              <div style={{ marginBottom: "24px" }}>
                <div style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  color: "var(--charcoal)",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  marginBottom: "12px",
                }}>
                  <div style={{ width: "20px", height: "2px", background: "var(--charcoal)" }} />
                  Sell or Trade
                </div>
                <h3 style={{
                  fontFamily: "var(--font-space-grotesk, sans-serif)",
                  fontSize: "1.75rem",
                  fontWeight: 800,
                  color: "var(--text)",
                  margin: "0 0 12px 0",
                }}>
                  Want to Sell Your Car?
                </h3>
                <p style={{ fontSize: "1rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                  Get an instant valuation online. We offer competitive prices and handle all paperwork.
                </p>
              </div>
              <Link
                href="/sell-car"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "14px 32px",
                  background: "var(--charcoal)",
                  color: "white",
                  borderRadius: "8px",
                  fontSize: "0.95rem",
                  fontWeight: 700,
                  textDecoration: "none",
                  width: "fit-content",
                  transition: "all 200ms ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#2a3540";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "var(--charcoal)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                Get Valuation <ArrowRight />
              </Link>
            </div>

            {/* Book Service */}
            <div style={{
              background: "var(--charcoal)",
              borderRadius: "16px",
              padding: "48px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}>
              <div style={{ marginBottom: "24px" }}>
                <div style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  color: "var(--red-accent)",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  marginBottom: "12px",
                }}>
                  <div style={{ width: "20px", height: "2px", background: "var(--red-accent)" }} />
                  Expert Service
                </div>
                <h3 style={{
                  fontFamily: "var(--font-space-grotesk, sans-serif)",
                  fontSize: "1.75rem",
                  fontWeight: 800,
                  color: "white",
                  margin: "0 0 12px 0",
                }}>
                  Schedule a Service
                </h3>
                <p style={{ fontSize: "1rem", color: "rgba(255,255,255,0.8)", lineHeight: 1.6 }}>
                  Certified mechanics you can trust. Book diagnostics, repairs, or maintenance online.
                </p>
              </div>
              <Link
                href="/services"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "14px 32px",
                  background: "var(--red-accent)",
                  color: "white",
                  borderRadius: "8px",
                  fontSize: "0.95rem",
                  fontWeight: 700,
                  textDecoration: "none",
                  width: "fit-content",
                  transition: "all 200ms ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#c51620";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "var(--red-accent)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                Book Now <ArrowRight />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Curated Showroom with Carousels */}
      <section style={{ padding: "80px 20px", background: "var(--surface)" }}>
        <div className="container-wide" style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ marginBottom: "48px" }}>
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "0.75rem",
              fontWeight: 700,
              color: "var(--red-accent)",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginBottom: "12px",
            }}>
              <div style={{ width: "20px", height: "2px", background: "var(--red-accent)" }} />
              Featured Selection
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
              <h2 style={{
                fontFamily: "var(--font-space-grotesk, sans-serif)",
                fontSize: "clamp(1.5rem, 3vw, 2.5rem)",
                fontWeight: 800,
                color: "var(--text)",
                margin: 0,
                lineHeight: 1.2,
              }}>
                Curated Showroom
              </h2>
              <div style={{ display: "flex", gap: "8px" }}>
                <button 
                  onClick={() => {}}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "8px 16px",
                    background: "var(--charcoal)",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 200ms ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#2a3540";
                    e.currentTarget.style.transform = "translateY(-1px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "var(--charcoal)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  View All Vehicles
                  <ArrowRight />
                </button>
              </div>
            </div>
            <p style={{
              fontSize: "1rem",
              color: "var(--text-secondary)",
              maxWidth: "600px",
              marginTop: "12px",
              lineHeight: 1.6,
            }}>
              Hand-picked vehicles from our inventory. Updated daily with best deals.
            </p>
          </div>

          {/* Tabbed Carousel Navigation */}
          <div style={{ marginBottom: "32px" }}>
            <div style={{
              display: "flex",
              gap: "0",
              borderBottom: "2px solid var(--border)",
            }}>
              {["Trending Vehicles", "Price Drops", "Local Inventory", "Premium Picks"].map((tab, index) => (
                <button
                  key={tab}
                  onClick={() => {}}
                  style={{
                    padding: "14px 24px",
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    color: index === 0 ? "var(--charcoal)" : "var(--text-secondary)",
                    background: "none",
                    border: "none",
                    borderBottom: index === 0 ? "3px solid var(--red-accent)" : "3px solid transparent",
                    marginBottom: "-2px",
                    cursor: "pointer",
                    transition: "all 200ms ease",
                    whiteSpace: "nowrap",
                  }}
                  onMouseEnter={(e) => {
                    if (index !== 0) {
                      e.currentTarget.style.color = "var(--charcoal)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (index !== 0) {
                      e.currentTarget.style.color = "var(--text-secondary)";
                    }
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Carousel Grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "24px",
            marginBottom: "48px",
          }}>
            {[
              {
                title: "2023 Toyota Land Cruiser V8",
                price: "KSh 18.5M",
                location: "Nairobi",
                mileage: "12,500 km",
                rating: 4.8,
                image: "/landcruiser.jpg",
                badge: "Popular",
                featured: true,
              },
              {
                title: "2021 Subaru Outback Touring",
                price: "KSh 4.2M",
                location: "Mombasa",
                mileage: "35,000 km",
                rating: 4.5,
                image: "/outback.jpg",
                badge: "Price Drop",
                discount: "12%",
              },
              {
                title: "2022 Mazda CX-5 Signature",
                price: "KSh 5.8M",
                location: "Kisumu",
                mileage: "18,500 km",
                rating: 4.7,
                image: "/cx5.jpg",
                badge: "Local",
                local: true,
              },
              {
                title: "2020 Mercedes-Benz GLE 350",
                price: "KSh 12.5M",
                location: "Nairobi",
                mileage: "42,000 km",
                rating: 4.9,
                image: "/gle.jpg",
                badge: "Premium",
                premium: true,
              },
              {
                title: "2023 Isuzu D-Max V-Cross",
                price: "KSh 6.5M",
                location: "Nakuru",
                mileage: "8,200 km",
                rating: 4.6,
                image: "/dmax-vcross.jpg",
                badge: "New",
                new: true,
              },
              {
                title: "2021 Nissan Patrol V8",
                price: "KSh 15.2M",
                location: "Nairobi",
                mileage: "28,500 km",
                rating: 4.7,
                image: "/patrol.jpg",
                badge: "Luxury",
                luxury: true,
              },
            ].map((vehicle, index) => (
              <div
                key={index}
                style={{
                  background: "white",
                  border: "1px solid var(--border)",
                  borderRadius: "12px",
                  overflow: "hidden",
                  transition: "all 250ms ease",
                  position: "relative",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.05)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-6px)";
                  e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.12)";
                  e.currentTarget.style.borderColor = "var(--red-accent)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.05)";
                  e.currentTarget.style.borderColor = "var(--border)";
                }}
              >
                {/* Vehicle Image */}
                <div style={{ position: "relative", aspectRatio: "16/9", overflow: "hidden" }}>
                  <img
                    src={vehicle.image}
                    alt={vehicle.title}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                  
                  {/* Badge */}
                  <div style={{
                    position: "absolute",
                    top: "12px",
                    left: "12px",
                    padding: "6px 12px",
                    background: vehicle.badge === "Price Drop" ? "var(--red-accent)" : 
                              vehicle.badge === "Premium" || vehicle.badge === "Luxury" ? "var(--charcoal)" : 
                              "var(--success)",
                    color: "white",
                    borderRadius: "20px",
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    letterSpacing: "0.05em",
                  }}>
                    {vehicle.badge}
                  </div>

                  {/* Discount Tag */}
                  {vehicle.discount && (
                    <div style={{
                      position: "absolute",
                      top: "12px",
                      right: "12px",
                      padding: "6px 12px",
                      background: "rgba(229,27,36,0.95)",
                      color: "white",
                      borderRadius: "20px",
                      fontSize: "0.7rem",
                      fontWeight: 800,
                      letterSpacing: "0.05em",
                    }}>
                      -{vehicle.discount}
                    </div>
                  )}

                  {/* Favorite Button */}
                  <button style={{
                    position: "absolute",
                    bottom: "12px",
                    right: "12px",
                    width: "36px",
                    height: "36px",
                    background: "rgba(255,255,255,0.9)",
                    border: "none",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    transition: "all 200ms ease",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "white";
                    e.currentTarget.style.transform = "scale(1.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.9)";
                    e.currentTarget.style.transform = "scale(1)";
                  }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                  </button>
                </div>

                {/* Vehicle Details */}
                <div style={{ padding: "20px" }}>
                  {/* Title & Rating */}
                  <div style={{ marginBottom: "12px" }}>
                    <h3 style={{
                      fontFamily: "var(--font-space-grotesk, sans-serif)",
                      fontSize: "1rem",
                      fontWeight: 700,
                      color: "var(--text)",
                      margin: "0 0 8px 0",
                      lineHeight: 1.3,
                      height: "2.6em",
                      overflow: "hidden",
                      display: "-webkit-box",
                      WebkitLineClamp: "2",
                      WebkitBoxOrient: "vertical",
                    }}>
                      {vehicle.title}
                    </h3>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill={i < Math.floor(vehicle.rating) ? "#FBBF24" : "#E5E7EB"}
                          >
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                          </svg>
                        ))}
                      </div>
                      <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                        {vehicle.rating}/5
                      </span>
                    </div>
                  </div>

                  {/* Price */}
                  <div style={{ marginBottom: "16px" }}>
                    <div style={{
                      fontFamily: "var(--font-space-grotesk, sans-serif)",
                      fontSize: "1.5rem",
                      fontWeight: 800,
                      color: "var(--charcoal)",
                      marginBottom: "4px",
                    }}>
                      {vehicle.price}
                    </div>
                    {vehicle.discount && (
                      <div style={{
                        fontSize: "0.85rem",
                        color: "var(--text-muted)",
                        textDecoration: "line-through",
                      }}>
                        KSh {(parseFloat(vehicle.price.replace('KSh ', '').replace('M', '')) / (1 - parseFloat(vehicle.discount) / 100)).toFixed(1)}M
                      </div>
                    )}
                  </div>

                  {/* Specs */}
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "12px",
                    marginBottom: "20px",
                    padding: "12px",
                    background: "var(--surface)",
                    borderRadius: "8px",
                  }}>
                    <div>
                      <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginBottom: "4px" }}>Location</div>
                      <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text)" }}>{vehicle.location}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginBottom: "4px" }}>Mileage</div>
                      <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text)" }}>{vehicle.mileage}</div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div style={{ display: "flex", gap: "10px" }}>
                    <button style={{
                      flex: 1,
                      padding: "12px 16px",
                      background: "var(--red-accent)",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      fontSize: "0.85rem",
                      fontWeight: 700,
                      cursor: "pointer",
                      transition: "all 200ms ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#c51620";
                      e.currentTarget.style.transform = "translateY(-2px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "var(--red-accent)";
                      e.currentTarget.style.transform = "translateY(0)";
                    }}
                    >
                      View Details
                    </button>
                    <button style={{
                      padding: "12px 16px",
                      background: "transparent",
                      color: "var(--text-secondary)",
                      border: "1.5px solid var(--border)",
                      borderRadius: "8px",
                      fontSize: "0.85rem",
                      fontWeight: 600,
                      cursor: "pointer",
                      transition: "all 200ms ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "var(--charcoal)";
                      e.currentTarget.style.color = "var(--charcoal)";
                      e.currentTarget.style.background = "var(--surface)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "var(--border)";
                      e.currentTarget.style.color = "var(--text-secondary)";
                      e.currentTarget.style.background = "transparent";
                    }}
                    >
                      Contact
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Showroom Categories */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "20px",
            marginBottom: "48px",
          }}>
            {[
              { label: "SUVs & 4x4s", count: "328", icon: "truck" },
              { label: "Sedans", count: "195", icon: "car" },
              { label: "Pickup Trucks", count: "142", icon: "truck" },
              { label: "Luxury Vehicles", count: "78", icon: "sport-car" },
              { label: "Commercial", count: "56", icon: "van" },
            ].map((category, index) => (
              <div
                key={index}
                style={{
                  background: "white",
                  border: "1px solid var(--border)",
                  borderRadius: "12px",
                  padding: "20px",
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  transition: "all 200ms ease",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--red-accent)";
                  e.currentTarget.style.transform = "translateY(-3px)";
                  e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.08)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--border)";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div style={{
                  width: "48px",
                  height: "48px",
                  background: "var(--surface)",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.5rem",
                }}>
                  {category.icon}
                </div>
                <div>
                  <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--text)", marginBottom: "4px" }}>
                    {category.label}
                  </div>
                  <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                    {category.count} vehicles
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Trust Indicators */}
          <div style={{
            background: "var(--charcoal)",
            borderRadius: "16px",
            padding: "32px",
            color: "white",
          }}>
            <div style={{ textAlign: "center", marginBottom: "32px" }}>
              <h3 style={{
                fontFamily: "var(--font-space-grotesk, sans-serif)",
                fontSize: "1.5rem",
                fontWeight: 800,
                margin: "0 0 12px 0",
              }}>
                Why Buy With Confidence
              </h3>
              <p style={{ color: "rgba(255,255,255,0.8)", maxWidth: "600px", margin: "0 auto" }}>
                Every vehicle undergoes comprehensive inspection and comes with our satisfaction guarantee.
              </p>
            </div>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "24px",
              textAlign: "center",
            }}>
              <div>
                <div style={{
                  width: "60px",
                  height: "60px",
                  background: "rgba(229,27,36,0.1)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px",
                }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--red-accent)" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                </div>
                <div style={{ fontSize: "0.9rem", fontWeight: 600 }}>Verified Inspections</div>
              </div>
              <div>
                <div style={{
                  width: "60px",
                  height: "60px",
                  background: "rgba(229,27,36,0.1)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px",
                }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--red-accent)" strokeWidth="2">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                  </svg>
                </div>
                <div style={{ fontSize: "0.9rem", fontWeight: 600 }}>Transparent History</div>
              </div>
              <div>
                <div style={{
                  width: "60px",
                  height: "60px",
                  background: "rgba(229,27,36,0.1)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px",
                }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--red-accent)" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>
                <div style={{ fontSize: "0.9rem", fontWeight: 600 }}>Secure Transactions</div>
              </div>
              <div>
                <div style={{
                  width: "60px",
                  height: "60px",
                  background: "rgba(229,27,36,0.1)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px",
                }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--red-accent)" strokeWidth="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </div>
                <div style={{ fontSize: "0.9rem", fontWeight: 600 }}>7-Day Return Policy</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Trust & Footer (Charcoal Background) */}
      <footer style={{
        background: "var(--charcoal)",
        color: "rgba(255,255,255,0.8)",
        padding: "80px 20px 40px",
      }}>
        <div className="container-wide" style={{ maxWidth: "1200px", margin: "0 auto" }}>
          {/* Main Footer Content */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "48px",
            marginBottom: "48px",
            paddingBottom: "48px",
            borderBottom: "1px solid rgba(255,255,255,0.1)",
          }}>
            {/* Brand & Description */}
            <div>
              <div style={{
                fontFamily: "var(--font-space-grotesk, sans-serif)",
                fontSize: "1.5rem",
                fontWeight: 800,
                color: "white",
                marginBottom: "16px",
                letterSpacing: "0.05em",
              }}>
                AutoShop Kenya
              </div>
              <p style={{
                fontSize: "0.9rem",
                lineHeight: 1.6,
                marginBottom: "20px",
                color: "rgba(255,255,255,0.6)",
              }}>
                Kenya's premier automotive marketplace. Connecting buyers, sellers, and service providers with trust and transparency.
              </p>
              <div style={{ display: "flex", gap: "12px" }}>
                <a href="#" style={{
                  width: "40px",
                  height: "40px",
                  background: "rgba(255,255,255,0.1)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  textDecoration: "none",
                  transition: "all 200ms ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "var(--red-accent)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
                >
                  <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </a>
                <a href="#" style={{
                  width: "40px",
                  height: "40px",
                  background: "rgba(255,255,255,0.1)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  textDecoration: "none",
                  transition: "all 200ms ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "var(--red-accent)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
                >
                  <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.405a1.44 1.44 0 112.881.001 1.44 1.44 0 01-2.881-.001z" />
                  </svg>
                </a>
                <a href="#" style={{
                  width: "40px",
                  height: "40px",
                  background: "rgba(255,255,255,0.1)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  textDecoration: "none",
                  transition: "all 200ms ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "var(--red-accent)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
                >
                  <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 style={{
                fontSize: "0.875rem",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.9)",
                marginBottom: "20px",
              }}>
                Marketplace
              </h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {["Browse Inventory", "Live Auctions", "Sell Your Car", "Price Trends", "Dealer Directory"].map((link) => (
                  <li key={link} style={{ marginBottom: "10px" }}>
                    <a href="#" style={{
                      fontSize: "0.9rem",
                      color: "rgba(255,255,255,0.6)",
                      textDecoration: "none",
                      transition: "all 200ms ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "white";
                      e.currentTarget.style.paddingLeft = "4px";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "rgba(255,255,255,0.6)";
                      e.currentTarget.style.paddingLeft = "0";
                    }}
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div>
              <h4 style={{
                fontSize: "0.875rem",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.9)",
                marginBottom: "20px",
              }}>
                Services
              </h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {["Book Service", "Vehicle Inspection", "Insurance Quotes", "Financing", "Parts Store"].map((link) => (
                  <li key={link} style={{ marginBottom: "10px" }}>
                    <a href="#" style={{
                      fontSize: "0.9rem",
                      color: "rgba(255,255,255,0.6)",
                      textDecoration: "none",
                      transition: "all 200ms ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "white";
                      e.currentTarget.style.paddingLeft = "4px";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "rgba(255,255,255,0.6)";
                      e.currentTarget.style.paddingLeft = "0";
                    }}
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 style={{
                fontSize: "0.875rem",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.9)",
                marginBottom: "20px",
              }}>
                Contact Us
              </h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                <li style={{ marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
                  <svg width="14" height="14" fill="rgba(255,255,255,0.6)" viewBox="0 0 24 24">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                  </svg>
                  <span style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.6)" }}>support@autoshop.ke</span>
                </li>
                <li style={{ marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
                  <svg width="14" height="14" fill="rgba(255,255,255,0.6)" viewBox="0 0 24 24">
                    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                  </svg>
                  <span style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.6)" }}>+254 700 123 456</span>
                </li>
                <li style={{ marginBottom: "12px", display: "flex", alignItems: "flex-start", gap: "8px" }}>
                  <svg width="14" height="14" fill="rgba(255,255,255,0.6)" viewBox="0 0 24 24" style={{ marginTop: "2px" }}>
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                  </svg>
                  <span style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.6)" }}>Nairobi, Kenya<br />Mon - Fri: 8am - 6pm</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Footer */}
          <div style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "20px",
          }}>
            <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.4)" }}>
              © {new Date().getFullYear()} AutoShop Kenya. All rights reserved.
            </div>
            <div style={{ display: "flex", gap: "24px" }}>
              <a href="#" style={{
                fontSize: "0.8rem",
                color: "rgba(255,255,255,0.6)",
                textDecoration: "none",
                transition: "color 200ms ease",
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = "white"}
              onMouseLeave={(e) => e.currentTarget.style.color = "rgba(255,255,255,0.6)"}
              >
                Privacy Policy
              </a>
              <a href="#" style={{
                fontSize: "0.8rem",
                color: "rgba(255,255,255,0.6)",
                textDecoration: "none",
                transition: "color 200ms ease",
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = "white"}
              onMouseLeave={(e) => e.currentTarget.style.color = "rgba(255,255,255,0.6)"}
              >
                Terms of Service
              </a>
              <a href="#" style={{
                fontSize: "0.8rem",
                color: "rgba(255,255,255,0.6)",
                textDecoration: "none",
                transition: "color 200ms ease",
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = "white"}
              onMouseLeave={(e) => e.currentTarget.style.color = "rgba(255,255,255,0.6)"}
              >
                Cookie Policy
              </a>
            </div>
          </div>

          {/* Trust Badges */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
            gap: "16px",
            marginTop: "40px",
            paddingTop: "40px",
            borderTop: "1px solid rgba(255,255,255,0.1)",
          }}>
            <div style={{ textAlign: "center" }}>
              <div style={{
                width: "48px",
                height: "48px",
                background: "rgba(229,27,36,0.1)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 12px",
              }}>
                <svg width="20" height="20" fill="var(--red-accent)" viewBox="0 0 24 24">
                  <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
                </svg>
              </div>
              <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.8)" }}>Secure Platform</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{
                width: "48px",
                height: "48px",
                background: "rgba(229,27,36,0.1)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 12px",
              }}>
                <svg width="20" height="20" fill="var(--red-accent)" viewBox="0 0 24 24">
                  <path d="M9 17l3-3 3 3M12 12v9m0-9H9m3 0h3m2-5a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.8)" }}>Verified Sellers</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{
                width: "48px",
                height: "48px",
                background: "rgba(229,27,36,0.1)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 12px",
              }}>
                <svg width="20" height="20" fill="var(--red-accent)" viewBox="0 0 24 24">
                  <path d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.8)" }}>Quality Assurance</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{
                width: "48px",
                height: "48px",
                background: "rgba(229,27,36,0.1)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 12px",
              }}>
                <svg width="20" height="20" fill="var(--red-accent)" viewBox="0 0 24 24">
                  <path d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                </svg>
              </div>
              <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.8)" }}>24/7 Support</div>
            </div>
          </div>
        </div>
      </footer>

      {/* Global Styles */}
      <style jsx global>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}