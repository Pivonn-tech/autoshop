import Link from "next/link";
import { useState, useEffect } from "react";
import {
  appointments,
  businessHours,
  invoices,
  notifications,
  reviews,
  serviceHistory,
  services,
  serviceStatuses,
  vehicles,
  type Appointment,
  type CustomerVehicle,
} from "../lib/businessData";

// ── Icons ──────────────────────────────────────────────────────────────────────
function ArrowRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
    </svg>
  );
}
function PlusIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}
function CarIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 17H3a2 2 0 01-2-2V9a2 2 0 012-2h3.44L8 4h8l1.56 3H21a2 2 0 012 2v6a2 2 0 01-2 2h-2" />
      <circle cx="7" cy="17" r="2" /><circle cx="17" cy="17" r="2" />
    </svg>
  );
}
function CalIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}
function InvoiceIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
    </svg>
  );
}
function HistoryIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="1 4 1 10 7 10" />
      <path d="M3.51 15a9 9 0 102.13-9.36L1 10" />
    </svg>
  );
}
function BellIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 01-3.46 0" />
    </svg>
  );
}
function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
function StarFill({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}
function UsersIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" />
    </svg>
  );
}
function TruckIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
      <circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  );
}
function WrenchIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />
    </svg>
  );
}
function PackageIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <line x1="16.5" y1="9.4" x2="7.5" y2="4.21" />
      <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 002 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  );
}
function DollarIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
    </svg>
  );
}

// ── Status badge helper ────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { bg: string; color: string }> = {
    "Received": { bg: "rgba(3,105,161,0.08)", color: "#0369A1" },
    "Inspection": { bg: "rgba(217,119,6,0.08)", color: "#D97706" },
    "Repair In Progress": { bg: "rgba(232,112,10,0.1)", color: "#E8700A" },
    "Quality Check": { bg: "rgba(124,58,237,0.08)", color: "#7C3AED" },
    "Ready For Pickup": { bg: "rgba(5,150,105,0.08)", color: "#059669" },
    "Paid": { bg: "rgba(5,150,105,0.08)", color: "#059669" },
    "Pending": { bg: "rgba(217,119,6,0.08)", color: "#D97706" },
    "Overdue": { bg: "rgba(220,38,38,0.08)", color: "#DC2626" },
    "confirmed": { bg: "rgba(5,150,105,0.08)", color: "#059669" },
    "cancelled": { bg: "rgba(220,38,38,0.08)", color: "#DC2626" },
  };
  const style = map[status] || { bg: "var(--surface-2)", color: "var(--text-muted)" };
  return (
    <span style={{ fontSize: "0.7rem", fontWeight: 700, color: style.color, background: style.bg, padding: "3px 10px", borderRadius: 20, letterSpacing: "0.06em", textTransform: "uppercase", whiteSpace: "nowrap" }}>
      {status}
    </span>
  );
}

// ── Panel wrapper ──────────────────────────────────────────────────────────────
function DashPanel({ icon, title, action, children }: { icon: React.ReactNode; title: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden", boxShadow: "var(--shadow-sm)", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid var(--border)", background: "var(--surface)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: "var(--navy)", color: "var(--amber)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {icon}
          </div>
          <span style={{ fontFamily: "var(--font-space-grotesk, sans-serif)", fontWeight: 700, fontSize: "0.95rem", color: "var(--text)" }}>{title}</span>
        </div>
        {action}
      </div>
      <div style={{ padding: "16px 20px", flex: 1 }}>{children}</div>
    </div>
  );
}

// ── Row separator ──────────────────────────────────────────────────────────────
function DataRow({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "10px 0", borderBottom: "1px solid var(--border)" }}>
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  CUSTOMER DASHBOARD
// ─────────────────────────────────────────────────────────────────────────────
export function CustomerDashboard() {
  // Live data fetched from /api/dashboard (falls back to static on error/unauthed)
  const [dashData, setDashData] = useState<{
    appointments: typeof appointments;
    serviceHistory: typeof serviceHistory;
    invoices: typeof invoices;
    savedVehicles: CustomerVehicle[];
    notifications: typeof notifications;
    demo?: boolean;
  }>({
    appointments,
    serviceHistory,
    invoices,
    savedVehicles: vehicles,
    notifications,
    demo: true,
  });
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((r) => r.json())
      .then((data) => { setDashData(data); setDataLoading(false); })
      .catch(() => setDataLoading(false));
  }, []);

  const liveAppointments = dashData.appointments;
  const liveServiceHistory = dashData.serviceHistory;
  const liveInvoices = dashData.invoices;
  const liveNotifications = dashData.notifications;

  const [savedVehicles, setSavedVehicles] = useState<CustomerVehicle[]>(vehicles);
  // Sync savedVehicles from API once loaded
  useEffect(() => {
    if (!dataLoading) setSavedVehicles(dashData.savedVehicles);
  }, [dataLoading]);

  const [addingVehicle, setAddingVehicle] = useState(false);
  const [newVehicle, setNewVehicle] = useState({ make: "", model: "", year: "", plate: "" });

  const handleAddVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVehicle.make || !newVehicle.model) return;
    setSavedVehicles(prev => [{
      id: `veh-${Date.now()}`,
      make: newVehicle.make,
      model: newVehicle.model,
      year: parseInt(newVehicle.year) || new Date().getFullYear(),
      licensePlate: newVehicle.plate || "—",
      mileage: 0,
      lastServiceDate: "Not yet serviced",
      notes: "",
    }, ...prev]);
    setNewVehicle({ make: "", model: "", year: "", plate: "" });
    setAddingVehicle(false);
  };

  return (
    <div style={{ background: "var(--bg)", color: "var(--text)", minHeight: "100vh" }}>
      {/* Page header */}
      <div style={{ background: "var(--navy)", paddingBlock: 48 }}>
        <div className="container">
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.78rem", color: "rgba(255,255,255,0.5)", marginBottom: 12 }}>
            <Link href="/" style={{ color: "inherit", textDecoration: "none" }}>Home</Link>
            <span>›</span>
            <span style={{ color: "rgba(255,255,255,0.9)" }}>My Dashboard</span>
          </div>
          <h1 style={{ fontFamily: "var(--font-space-grotesk, sans-serif)", fontSize: "clamp(1.6rem, 4vw, 2.4rem)", fontWeight: 700, color: "white", margin: "0 0 10px", letterSpacing: "-0.02em" }}>
            My Dashboard
          </h1>
          <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.95rem", lineHeight: 1.65, margin: 0 }}>
            Track appointments, manage your vehicles, and review your service history.
          </p>
        </div>
      </div>

      {/* Notification strip */}
      <div style={{ background: "rgba(232,112,10,0.06)", borderBottom: "1px solid rgba(232,112,10,0.15)", paddingBlock: 12 }}>
        <div className="container" style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#E8700A", textTransform: "uppercase", letterSpacing: "0.06em", flexShrink: 0 }}>Latest</span>
          <span style={{ fontSize: "0.875rem", color: "var(--text)" }}>
            {liveNotifications[0].title} — {liveNotifications[0].message}
          </span>
        </div>
      </div>

      {/* Dashboard grid */}
      <div className="container" style={{ paddingBlock: 40 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 20 }}>

          {/* Appointments */}
          <DashPanel icon={<CalIcon />} title="Appointments"
            action={
              <Link href="/appointments" style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: "0.78rem", fontWeight: 700, color: "var(--amber)", textDecoration: "none" }}>
                Book New <ArrowRight />
              </Link>
            }
          >
            {liveAppointments.map((apt) => (
              <DataRow key={apt.id}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--text)", marginBottom: 2 }}>{apt.service}</div>
                  <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>{apt.vehicle} · {apt.preferredDate} at {apt.preferredTime}</div>
                </div>
                <StatusBadge status={apt.status} />
              </DataRow>
            ))}
            <Link href="/order-tracking" style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 12, fontSize: "0.8rem", fontWeight: 600, color: "var(--navy)", textDecoration: "none" }}>
              Track service progress <ArrowRight />
            </Link>
          </DashPanel>

          {/* My Garage */}
          <DashPanel icon={<CarIcon />} title="My Garage"
            action={
              <button onClick={() => setAddingVehicle(v => !v)}
                style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: "0.78rem", fontWeight: 700, color: "var(--amber)", background: "none", border: "none", cursor: "pointer" }}>
                <PlusIcon /> Add Vehicle
              </button>
            }
          >
            {addingVehicle && (
              <form onSubmit={handleAddVehicle} style={{ marginBottom: 16, padding: 14, background: "var(--surface)", borderRadius: 8, border: "1px solid var(--border)", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {[
                  { name: "make", placeholder: "Make (e.g. Toyota)", val: newVehicle.make, key: "make" as const },
                  { name: "model", placeholder: "Model (e.g. Corolla)", val: newVehicle.model, key: "model" as const },
                  { name: "year", placeholder: "Year (e.g. 2020)", val: newVehicle.year, key: "year" as const },
                  { name: "plate", placeholder: "Plate (e.g. KDC 482Q)", val: newVehicle.plate, key: "plate" as const },
                ].map(f => (
                  <input key={f.name} placeholder={f.placeholder} value={f.val}
                    onChange={e => setNewVehicle(v => ({ ...v, [f.key]: e.target.value }))}
                    style={{ height: 38, paddingInline: 10, border: "1.5px solid var(--border)", borderRadius: 6, background: "var(--bg)", color: "var(--text)", fontSize: "0.82rem", outline: "none", fontFamily: "inherit" }} />
                ))}
                <div style={{ gridColumn: "1/-1", display: "flex", gap: 8 }}>
                  <button type="submit" style={{ flex: 1, height: 36, background: "var(--navy)", color: "white", border: "none", borderRadius: 6, fontSize: "0.82rem", fontWeight: 700, cursor: "pointer" }}>
                    Save Vehicle
                  </button>
                  <button type="button" onClick={() => setAddingVehicle(false)} style={{ height: 36, paddingInline: 12, border: "1.5px solid var(--border)", background: "transparent", color: "var(--text-muted)", borderRadius: 6, fontSize: "0.82rem", cursor: "pointer" }}>
                    Cancel
                  </button>
                </div>
              </form>
            )}
            {savedVehicles.map((v) => (
              <div key={v.id} style={{ padding: "10px 0", borderBottom: "1px solid var(--border)" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                  <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--text)" }}>{v.year} {v.make} {v.model}</div>
                  <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--navy)", background: "rgba(15,42,74,0.06)", padding: "2px 8px", borderRadius: 12 }}>{v.licensePlate}</span>
                </div>
                <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: 3 }}>
                  {v.mileage.toLocaleString()} km · Last service: {v.lastServiceDate}
                </div>
                {v.notes && <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: 3, fontStyle: "italic" }}>{v.notes}</div>}
              </div>
            ))}
          </DashPanel>

          {/* Service History */}
          <DashPanel icon={<HistoryIcon />} title="Service History">
            {liveServiceHistory.map((record) => (
              <DataRow key={record.id}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--text)", marginBottom: 2 }}>{record.service}</div>
                  <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>{record.vehicle} · {record.date} · {record.mileage.toLocaleString()} km</div>
                  {record.notes && <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: 2 }}>{record.notes}</div>}
                </div>
                <span style={{ fontFamily: "var(--font-space-grotesk, sans-serif)", fontWeight: 700, fontSize: "0.9rem", color: "var(--navy)", flexShrink: 0 }}>{record.total}</span>
              </DataRow>
            ))}
          </DashPanel>

          {/* Invoices */}
          <DashPanel icon={<InvoiceIcon />} title="Invoices">
            {liveInvoices.map((inv) => (
              <DataRow key={inv.id}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--text)", marginBottom: 2 }}>{inv.id} — {inv.service}</div>
                  <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>{inv.customer} · Due {inv.dueDate}</div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4, flexShrink: 0 }}>
                  <span style={{ fontFamily: "var(--font-space-grotesk, sans-serif)", fontWeight: 700, fontSize: "0.9rem", color: "var(--navy)" }}>{inv.amount}</span>
                  <StatusBadge status={inv.status} />
                </div>
              </DataRow>
            ))}
          </DashPanel>
        </div>

        {/* Notifications */}
        <div style={{ marginTop: 20 }}>
          <DashPanel icon={<BellIcon />} title="Notifications">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
              {liveNotifications.map((n) => (
                <div key={n.id} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, padding: "14px 16px" }}>
                  <div style={{ fontSize: "0.68rem", fontWeight: 700, color: "var(--amber)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>{n.type}</div>
                  <div style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--text)", marginBottom: 4 }}>{n.title}</div>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: 1.55 }}>{n.message}</div>
                </div>
              ))}
            </div>
          </DashPanel>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .container > div[style*="grid-template-columns: repeat(2, 1fr)"] { grid-template-columns: 1fr !important; }
          div[style*="grid-template-columns: repeat(3, 1fr)"] { grid-template-columns: 1fr !important; }
          div[style*="gridTemplateColumns: 1fr 1fr"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  SERVICE TRACKER
// ─────────────────────────────────────────────────────────────────────────────
export function ServiceTracker({ compact = false }: { compact?: boolean }) {
  const activeIndex = 2;

  const content = (
    <div style={{ background: "var(--bg)", color: "var(--text)" }}>
      <div style={{ background: "var(--navy)", paddingBlock: compact ? 32 : 48, marginBottom: 0 }}>
        <div className="container">
          {!compact && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.78rem", color: "rgba(255,255,255,0.5)", marginBottom: 12 }}>
              <Link href="/" style={{ color: "inherit", textDecoration: "none" }}>Home</Link>
              <span>›</span>
              <span style={{ color: "rgba(255,255,255,0.9)" }}>Order Tracking</span>
            </div>
          )}
          <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--amber)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>
            Service Tracker
          </div>
          <h2 style={{ fontFamily: "var(--font-space-grotesk, sans-serif)", fontSize: compact ? "1.4rem" : "clamp(1.6rem, 3vw, 2.2rem)", fontWeight: 700, color: "white", margin: "0 0 8px", letterSpacing: "-0.02em" }}>
            Your Vehicle's Service Progress
          </h2>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.9rem", margin: 0 }}>
            Ref: APT-1043 · 2018 Subaru Forester · KCY 118M
          </p>
        </div>
      </div>

      <div style={{ background: "var(--surface)", borderBottom: "1px solid var(--border)", paddingBlock: 32 }}>
        <div className="container">
          {/* Progress bar */}
          <div style={{ position: "relative", display: "flex", alignItems: "flex-start", marginBottom: 16 }}>
            {/* Track line */}
            <div style={{ position: "absolute", top: 23, left: "10%", right: "10%", height: 3, background: "var(--border)", borderRadius: 2 }} />
            <div style={{ position: "absolute", top: 23, left: "10%", width: `${(activeIndex / (serviceStatuses.length - 1)) * 80}%`, height: 3, background: "var(--amber)", borderRadius: 2, transition: "width 600ms ease" }} />

            {serviceStatuses.map((status, i) => {
              const isDone = i < activeIndex;
              const isActive = i === activeIndex;
              return (
                <div key={status} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 10, position: "relative", zIndex: 1 }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: "50%",
                    background: isDone ? "var(--navy)" : isActive ? "var(--amber)" : "white",
                    border: `3px solid ${isDone ? "var(--navy)" : isActive ? "var(--amber)" : "var(--border)"}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontWeight: 700, fontSize: "0.875rem",
                    color: isDone || isActive ? "white" : "var(--text-muted)",
                    boxShadow: isActive ? "0 0 0 4px rgba(232,112,10,0.2)" : "none",
                    transition: "all 400ms ease",
                  }}>
                    {isDone ? <CheckIcon /> : i + 1}
                  </div>
                  <div style={{ fontSize: "0.72rem", fontWeight: 600, color: isActive ? "var(--navy)" : isDone ? "var(--text)" : "var(--text-muted)", textAlign: "center", lineHeight: 1.3, letterSpacing: "0.01em" }}>
                    {status}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Active step callout */}
          <div style={{ marginTop: 24, display: "flex", alignItems: "center", gap: 14, padding: "14px 20px", background: "rgba(232,112,10,0.06)", border: "1.5px solid rgba(232,112,10,0.2)", borderRadius: 10 }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "var(--amber)", flexShrink: 0, animation: "pulse 2s infinite" }} />
            <div>
              <div style={{ fontWeight: 700, color: "var(--navy)", fontSize: "0.9rem" }}>
                Currently: {serviceStatuses[activeIndex]}
              </div>
              <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: 2 }}>
                Your Brake Repair is in progress. Estimated completion: Today by 4:00 PM.
              </div>
            </div>
          </div>
        </div>
      </div>

      {!compact && (
        <div className="container" style={{ paddingBlock: 32 }}>
          <DashPanel icon={<BellIcon />} title="Recent Notifications">
            <div style={{ display: "grid", gap: 0 }}>
              {notifications.map((n) => (
                <DataRow key={n.id}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--text)" }}>{n.title}</div>
                    <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)", marginTop: 2 }}>{n.message}</div>
                  </div>
                  <span style={{ fontSize: "0.68rem", fontWeight: 700, color: "var(--amber)", background: "rgba(232,112,10,0.08)", padding: "3px 10px", borderRadius: 20, textTransform: "uppercase", letterSpacing: "0.06em", flexShrink: 0 }}>
                    {n.type}
                  </span>
                </DataRow>
              ))}
            </div>
          </DashPanel>
        </div>
      )}

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.45} }
      `}</style>
    </div>
  );

  return content;
}

// ─────────────────────────────────────────────────────────────────────────────
//  ADMIN DASHBOARD
// ─────────────────────────────────────────────────────────────────────────────
export function AdminDashboard() {
  const metrics = [
    { label: "Total Customers", value: "248", delta: "+18 this month", icon: <UsersIcon />, color: "#0369A1" },
    { label: "Vehicles Tracked", value: "391", delta: "42 due for service", icon: <TruckIcon />, color: "#7C3AED" },
    { label: "Open Appointments", value: "36", delta: "11 awaiting confirm", icon: <CalIcon />, color: "#E8700A" },
    { label: "Active Services", value: String(services.length), delta: "Published to catalog", icon: <WrenchIcon />, color: "#059669" },
    { label: "Parts in Stock", value: "126", delta: "3 low-stock alerts", icon: <PackageIcon />, color: "#DC2626" },
    { label: "Monthly Revenue", value: "KSh 842K", delta: "↑ 12% vs last month", icon: <DollarIcon />, color: "#059669" },
  ];

  const [activeTab, setActiveTab] = useState<"appointments" | "services">("appointments");

  return (
    <div style={{ background: "var(--bg)", color: "var(--text)", minHeight: "100vh" }}>

      {/* Header */}
      <div style={{ background: "var(--navy)", paddingBlock: 48 }}>
        <div className="container">
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.78rem", color: "rgba(255,255,255,0.5)", marginBottom: 12 }}>
            <Link href="/" style={{ color: "inherit", textDecoration: "none" }}>Home</Link>
            <span>›</span>
            <span style={{ color: "rgba(255,255,255,0.9)" }}>Admin Dashboard</span>
          </div>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
            <div>
              <h1 style={{ fontFamily: "var(--font-space-grotesk, sans-serif)", fontSize: "clamp(1.6rem, 4vw, 2.4rem)", fontWeight: 700, color: "white", margin: "0 0 8px", letterSpacing: "-0.02em" }}>
                Admin Dashboard
              </h1>
              <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.9rem", margin: 0 }}>
                AUTOFIX KENYA — Operations Overview
              </p>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <Link href="/appointments" style={{ display: "inline-flex", alignItems: "center", gap: 6, height: 40, paddingInline: 16, background: "var(--amber)", color: "white", borderRadius: 8, fontSize: "0.82rem", fontWeight: 700, textDecoration: "none" }}>
                <CalIcon /> New Booking
              </Link>
              <Link href="/inventory" style={{ display: "inline-flex", alignItems: "center", gap: 6, height: 40, paddingInline: 16, background: "rgba(255,255,255,0.1)", color: "white", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 8, fontSize: "0.82rem", fontWeight: 600, textDecoration: "none" }}>
                <PackageIcon /> Inventory
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingBlock: 40 }}>

        {/* Metric cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 32 }}>
          {metrics.map((m, i) => (
            <div key={i} style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 12, padding: "20px 24px", boxShadow: "var(--shadow-sm)", display: "flex", alignItems: "flex-start", gap: 16 }}>
              <div style={{ width: 48, height: 48, borderRadius: 10, background: `${m.color}12`, border: `1.5px solid ${m.color}25`, display: "flex", alignItems: "center", justifyContent: "center", color: m.color, flexShrink: 0 }}>
                {m.icon}
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>{m.label}</div>
                <div style={{ fontFamily: "var(--font-space-grotesk, sans-serif)", fontSize: "1.75rem", fontWeight: 700, color: "var(--text)", lineHeight: 1 }}>{m.value}</div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: 4 }}>{m.delta}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden", boxShadow: "var(--shadow-sm)" }}>
          <div style={{ display: "flex", borderBottom: "1px solid var(--border)", background: "var(--surface)" }}>
            {(["appointments", "services"] as const).map(t => (
              <button key={t} onClick={() => setActiveTab(t)}
                style={{ flex: 1, height: 48, fontSize: "0.875rem", fontWeight: 600, color: activeTab === t ? "var(--navy)" : "var(--text-secondary)", background: "none", border: "none", borderBottom: `2px solid ${activeTab === t ? "var(--amber)" : "transparent"}`, cursor: "pointer", textTransform: "capitalize", transition: "all 180ms ease" }}>
                {t === "appointments" ? `Today's Appointments (${appointments.length})` : `Service Catalog (${services.length})`}
              </button>
            ))}
          </div>

          <div style={{ padding: "16px 20px" }}>
            {activeTab === "appointments" && (
              <div>
                {/* Table header */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr 120px", gap: 12, padding: "8px 12px", background: "var(--surface)", borderRadius: 8, marginBottom: 8 }}>
                  {["ID", "Customer", "Vehicle", "Service", "Status"].map(h => (
                    <div key={h} style={{ fontSize: "0.68rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>{h}</div>
                  ))}
                </div>
                {appointments.map((apt) => (
                  <div key={apt.id} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr 120px", gap: 12, padding: "12px", borderBottom: "1px solid var(--border)", alignItems: "center" }}>
                    <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--navy)", fontFamily: "monospace" }}>{apt.id}</div>
                    <div>
                      <div style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--text)" }}>{apt.customerName}</div>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{apt.phone}</div>
                    </div>
                    <div style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>{apt.vehicle}</div>
                    <div style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>{apt.service} · {apt.preferredTime}</div>
                    <StatusBadge status={apt.status} />
                  </div>
                ))}
              </div>
            )}

            {activeTab === "services" && (
              <div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 100px 1fr 120px", gap: 12, padding: "8px 12px", background: "var(--surface)", borderRadius: 8, marginBottom: 8 }}>
                  {["Service", "Category", "Price Range", "Duration"].map(h => (
                    <div key={h} style={{ fontSize: "0.68rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>{h}</div>
                  ))}
                </div>
                {services.map((svc) => (
                  <div key={svc.id} style={{ display: "grid", gridTemplateColumns: "1fr 100px 1fr 120px", gap: 12, padding: "12px", borderBottom: "1px solid var(--border)", alignItems: "center" }}>
                    <div style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--text)" }}>{svc.title}</div>
                    <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--amber)", background: "rgba(232,112,10,0.08)", padding: "3px 10px", borderRadius: 20, textAlign: "center" }}>{svc.category}</span>
                    <div style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>{svc.priceRange}</div>
                    <div style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>{svc.duration}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick links */}
        <div style={{ marginTop: 24, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
          {[
            {
              label: "View Inventory",
              href: "/inventory",
              icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="16.5" y1="9.4" x2="7.5" y2="4.21" />
                  <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 002 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" />
                </svg>
              ),
            },
            {
              label: "Service Tracker",
              href: "/order-tracking",
              icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="1 4 1 10 7 10" />
                  <path d="M3.51 15a9 9 0 102.13-9.36L1 10" />
                </svg>
              ),
            },
            {
              label: "Book Appointment",
              href: "/appointments",
              icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              ),
            },
            {
              label: "Contact / Support",
              href: "/contact",
              icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                </svg>
              ),
            },
          ].map((l, i) => (
            <Link key={i} href={l.href} style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 16px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, textDecoration: "none", fontSize: "0.875rem", fontWeight: 600, color: "var(--text)", transition: "all 180ms ease" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--amber)"; (e.currentTarget as HTMLElement).style.background = "rgba(232,112,10,0.04)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"; (e.currentTarget as HTMLElement).style.background = "var(--surface)"; }}>
              <span style={{ color: "var(--amber)", flexShrink: 0 }}>{l.icon}</span>
              {l.label}
            </Link>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .container > div[style*="grid-template-columns: repeat(3, 1fr)"] { grid-template-columns: repeat(2, 1fr) !important; }
          .container > div[style*="grid-template-columns: repeat(4, 1fr)"] { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 640px) {
          .container > div[style*="grid-template-columns: repeat(3, 1fr)"] { grid-template-columns: 1fr !important; }
          .container > div[style*="grid-template-columns: repeat(4, 1fr)"] { grid-template-columns: 1fr 1fr !important; }
          div[style*="grid-template-columns: 1fr 1fr 1fr 1fr"] { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  LEGACY EXPORTS — kept so existing pages that import them don't break
// ─────────────────────────────────────────────────────────────────────────────
export function NotificationsPanel({ compact = false }: { compact?: boolean }) {
  return (
    <div style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 12, padding: 20 }}>
      <div style={{ fontFamily: "var(--font-space-grotesk, sans-serif)", fontWeight: 700, fontSize: "0.95rem", color: "var(--text)", marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
        <BellIcon /> Notifications
      </div>
      {notifications.slice(0, compact ? 2 : 3).map((n) => (
        <div key={n.id} style={{ padding: "10px 0", borderBottom: "1px solid var(--border)" }}>
          <div style={{ fontSize: "0.68rem", fontWeight: 700, color: "var(--amber)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>{n.type}</div>
          <div style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--text)", marginBottom: 2 }}>{n.title}</div>
          <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>{n.message}</div>
        </div>
      ))}
    </div>
  );
}

export function ReviewsSection() {
  return (
    <section style={{ paddingBlock: 64, background: "var(--surface)", borderTop: "1px solid var(--border)" }}>
      <div className="container">
        <div style={{ fontFamily: "var(--font-space-grotesk, sans-serif)", fontWeight: 700, fontSize: "clamp(1.5rem, 3vw, 2rem)", color: "var(--text)", marginBottom: 32 }}>Customer Reviews</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          {reviews.map((r) => {
            const initials = r.name.split(" ").map(n => n[0]).join("").slice(0,2).toUpperCase();
            return (
              <div key={r.id} style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 12, padding: 24, boxShadow: "var(--shadow-sm)" }}>
                <div style={{ display: "flex", gap: 2, color: "#FBBF24", marginBottom: 10 }}>
                  {Array.from({length: r.rating}).map((_, i) => <StarFill key={i} />)}
                </div>
                <p style={{ fontSize: "0.9375rem", lineHeight: 1.7, color: "var(--text)", margin: "0 0 14px", fontStyle: "italic" }}>"{r.comment}"</p>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--navy)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "0.8rem" }}>{initials}</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--text)" }}>{r.name}</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{r.vehicle}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// Stub exports for any remaining imports
export function BusinessHomeSections() { return null; }
export function BusinessHoursCard() { return null; }
export function ServiceCards({ limit }: { limit?: number }) { return null; }
export function ServicesPageContent() { return null; }
export function AppointmentBooking() { return null; }
export function VehicleManager() { return null; }
export function ContactPageContent() { return null; }
