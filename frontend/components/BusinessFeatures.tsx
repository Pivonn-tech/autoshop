"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
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
} from "../lib/businessData";

const colors = {
  background: "var(--bg-color)",
  surface: "var(--surface-color)",
  text: "var(--text-color)",
  accent: "var(--accent-color)",
  textSecondary: "var(--text-secondary-color)",
  accent10: "var(--accent-color-10)",
  accent20: "var(--accent-color-20)",
  strong: "var(--surface-strong-color)",
};

function SectionHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="business-section-header">
      <span>{eyebrow}</span>
      <h2>{title}</h2>
      {description ? <p>{description}</p> : null}
    </div>
  );
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="business-stars" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, index) => (
        <span key={index}>{index < rating ? "★" : "☆"}</span>
      ))}
    </div>
  );
}

export function BusinessHomeSections() {
  return (
    <>
      <section className="business-band business-quick-actions">
        <div className="business-container business-action-grid">
          <div>
            <span className="business-eyebrow">Professional auto care</span>
            <h2>Service, sales, parts, and repair updates in one place.</h2>
            <p>
              Book a service, request a quote, track your vehicle, and manage
              your garage without losing the performance-focused look already on
              the site.
            </p>
          </div>
          <div className="business-cta-row">
            <Link className="business-button primary" href="/appointments">
              Book Service
            </Link>
            <Link className="business-button secondary" href="/contact">
              Get Quote
            </Link>
          </div>
          <BusinessHoursCard />
        </div>
      </section>

      <section className="business-band">
        <div className="business-container">
          <SectionHeader
            eyebrow="Featured services"
            title="High-demand workshop services"
            description="Clear price ranges and estimated time windows help customers choose confidently before booking."
          />
          <ServiceCards limit={4} />
        </div>
      </section>

      <ServiceTracker compact />
      <ReviewsSection />
      <NotificationsPanel />
    </>
  );
}

export function BusinessHoursCard() {
  return (
    <aside className="business-card business-hours-card">
      <h3>Business Hours</h3>
      {businessHours.map((item) => (
        <div className="business-hours-row" key={item.day}>
          <span>{item.day}</span>
          <strong>{item.hours}</strong>
        </div>
      ))}
      <p>Emergency diagnostics can be requested from the contact page.</p>
    </aside>
  );
}

export function ServiceCards({ limit }: { limit?: number }) {
  const visibleServices = limit ? services.slice(0, limit) : services;

  return (
    <div className="business-card-grid">
      {visibleServices.map((service) => (
        <article className="business-card service-card" key={service.id}>
          <span className="service-category">{service.category}</span>
          <h3>{service.title}</h3>
          <p>{service.description}</p>
          <dl>
            <div>
              <dt>Duration</dt>
              <dd>{service.duration}</dd>
            </div>
            <div>
              <dt>Price range</dt>
              <dd>{service.priceRange}</dd>
            </div>
          </dl>
          <Link className="business-text-link" href={`/appointments?service=${service.id}`}>
            Schedule service
          </Link>
        </article>
      ))}
    </div>
  );
}

export function ServicesPageContent() {
  return (
    <main className="business-page">
      <section className="business-hero business-container">
        <div>
          <span className="business-eyebrow">Workshop services</span>
          <h1>Professional maintenance and repairs for daily drivers and fleets.</h1>
          <p>
            Choose from common auto shop services, review typical durations and
            price ranges, then book a convenient appointment.
          </p>
          <div className="business-cta-row">
            <Link className="business-button primary" href="/appointments">
              Book Service
            </Link>
            <Link className="business-button secondary" href="/contact">
              Get Quote
            </Link>
          </div>
        </div>
        <BusinessHoursCard />
      </section>

      <section className="business-band">
        <div className="business-container">
          <SectionHeader
            eyebrow="Service menu"
            title="Transparent options before you visit"
          />
          <ServiceCards />
        </div>
      </section>
    </main>
  );
}

export function AppointmentBooking() {
  const [submitted, setSubmitted] = useState(false);
  const [selectedService, setSelectedService] = useState(services[0].id);

  const selectedServiceName = useMemo(
    () => services.find((service) => service.id === selectedService)?.title,
    [selectedService],
  );

  return (
    <main className="business-page">
      <section className="business-hero business-container">
        <div>
          <span className="business-eyebrow">Appointment booking</span>
          <h1>Book a service visit with your vehicle details upfront.</h1>
          <p>
            The form captures the information the workshop needs for a proper
            confirmation and a smoother check-in.
          </p>
        </div>
        <NotificationsPanel compact />
      </section>

      <section className="business-band">
        <div className="business-container booking-layout">
          <form
            className="business-card business-form"
            onSubmit={(event) => {
              event.preventDefault();
              setSubmitted(true);
            }}
          >
            <div className="form-grid">
              <label>
                Customer name
                <input required name="customerName" placeholder="Grace Wanjiku" />
              </label>
              <label>
                Phone number
                <input required name="phone" placeholder="+254 711 204 882" />
              </label>
              <label>
                Email
                <input required name="email" type="email" placeholder="grace@example.com" />
              </label>
              <label>
                Vehicle make
                <input required name="make" placeholder="Toyota" />
              </label>
              <label>
                Vehicle model
                <input required name="model" placeholder="Corolla" />
              </label>
              <label>
                Vehicle year
                <input required name="year" type="number" min="1970" max="2027" placeholder="2020" />
              </label>
              <label>
                License plate
                <input required name="licensePlate" placeholder="KDC 482Q" />
              </label>
              <label>
                Service selection
                <select
                  name="service"
                  value={selectedService}
                  onChange={(event) => setSelectedService(event.target.value)}
                >
                  {services.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.title}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Preferred date
                <input required name="date" type="date" />
              </label>
              <label>
                Preferred time
                <input required name="time" type="time" />
              </label>
            </div>
            <button className="business-button primary" type="submit">
              Confirm Booking
            </button>
            {submitted ? (
              <p className="form-success">
                Booking request received for {selectedServiceName}. A confirmation
                notification has been queued.
              </p>
            ) : null}
          </form>

          <aside className="business-card">
            <h3>What happens next</h3>
            <ul className="business-list">
              <li>Instant booking confirmation is shown on-screen.</li>
              <li>A service advisor reviews your vehicle details.</li>
              <li>Status updates appear in the customer dashboard.</li>
              <li>Invoices and service history are saved after completion.</li>
            </ul>
          </aside>
        </div>
      </section>
    </main>
  );
}

export function CustomerDashboard() {
  return (
    <main className="business-page">
      <section className="business-hero business-container">
        <div>
          <span className="business-eyebrow">Customer dashboard</span>
          <h1>Your appointments, vehicles, service history, and invoices.</h1>
          <p>
            A realistic customer workspace for reviewing bookings, saved
            vehicles, invoice status, and workshop progress.
          </p>
        </div>
        <NotificationsPanel compact />
      </section>

      <section className="business-band">
        <div className="business-container dashboard-grid">
          <DashboardPanel title="Appointments">
            {appointments.map((appointment) => (
              <AppointmentRow key={appointment.id} appointment={appointment} />
            ))}
          </DashboardPanel>

          <DashboardPanel title="Saved Vehicles">
            <VehicleManager />
          </DashboardPanel>

          <DashboardPanel title="Service History">
            {serviceHistory.map((record) => (
              <div className="data-row" key={record.id}>
                <div>
                  <strong>{record.service}</strong>
                  <span>{record.vehicle} · {record.date}</span>
                </div>
                <b>{record.total}</b>
              </div>
            ))}
          </DashboardPanel>

          <DashboardPanel title="Invoices">
            {invoices.map((invoice) => (
              <div className="data-row" key={invoice.id}>
                <div>
                  <strong>{invoice.id}</strong>
                  <span>{invoice.service} · Due {invoice.dueDate}</span>
                </div>
                <b>{invoice.status}</b>
              </div>
            ))}
          </DashboardPanel>
        </div>
      </section>
    </main>
  );
}

function DashboardPanel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="business-card dashboard-panel">
      <h2>{title}</h2>
      <div className="dashboard-panel-body">{children}</div>
    </section>
  );
}

function AppointmentRow({ appointment }: { appointment: Appointment }) {
  return (
    <div className="data-row">
      <div>
        <strong>{appointment.service}</strong>
        <span>
          {appointment.vehicle} · {appointment.preferredDate} at{" "}
          {appointment.preferredTime}
        </span>
      </div>
      <b>{appointment.status}</b>
    </div>
  );
}

export function VehicleManager() {
  const [savedVehicles, setSavedVehicles] = useState(vehicles);

  return (
    <div className="vehicle-manager">
      <form
        className="vehicle-add-form"
        onSubmit={(event) => {
          event.preventDefault();
          const form = new FormData(event.currentTarget);
          setSavedVehicles((current) => [
            {
              id: `veh-${current.length + 1}`,
              make: String(form.get("make") || "Toyota"),
              model: String(form.get("model") || "Corolla"),
              year: Number(form.get("year") || 2020),
              licensePlate: String(form.get("plate") || "KAA 000A"),
              mileage: Number(form.get("mileage") || 0),
              lastServiceDate: String(form.get("lastServiceDate") || "Not recorded"),
              notes: String(form.get("notes") || "No notes yet."),
            },
            ...current,
          ]);
          event.currentTarget.reset();
        }}
      >
        <input name="make" placeholder="Make" />
        <input name="model" placeholder="Model" />
        <input name="year" type="number" placeholder="Year" />
        <input name="plate" placeholder="Plate" />
        <input name="mileage" type="number" placeholder="Mileage" />
        <input name="lastServiceDate" type="date" />
        <textarea name="notes" placeholder="Notes" />
        <button className="business-button secondary" type="submit">
          Add Vehicle
        </button>
      </form>

      {savedVehicles.map((vehicle) => (
        <div className="vehicle-card" key={vehicle.id}>
          <div>
            <strong>
              {vehicle.year} {vehicle.make} {vehicle.model}
            </strong>
            <span>{vehicle.licensePlate}</span>
          </div>
          <p>
            {vehicle.mileage.toLocaleString()} km · Last service:{" "}
            {vehicle.lastServiceDate}
          </p>
          <small>{vehicle.notes}</small>
        </div>
      ))}
    </div>
  );
}

export function ServiceTracker({ compact = false }: { compact?: boolean }) {
  const activeIndex = 2;

  return (
    <section className={compact ? "business-band" : "business-page business-band"}>
      <div className="business-container">
        <SectionHeader
          eyebrow="Service tracker"
          title="Received → Inspection → Repair In Progress → Quality Check → Ready For Pickup"
          description="Customers can see the current workshop stage without calling for an update."
        />
        <div className="tracker">
          {serviceStatuses.map((status, index) => (
            <div
              className={`tracker-step ${index <= activeIndex ? "active" : ""}`}
              key={status}
            >
              <span>{index + 1}</span>
              <strong>{status}</strong>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ReviewsSection() {
  return (
    <section className="business-band">
      <div className="business-container">
        <SectionHeader
          eyebrow="Customer reviews"
          title="Realistic feedback with star ratings"
        />
        <div className="business-card-grid">
          {reviews.map((review) => (
            <article className="business-card review-card" key={review.id}>
              <Stars rating={review.rating} />
              <p>"{review.comment}"</p>
              <strong>{review.name}</strong>
              <span>{review.vehicle}</span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function NotificationsPanel({ compact = false }: { compact?: boolean }) {
  return (
    <aside className={`business-card notifications-panel ${compact ? "compact" : ""}`}>
      <h3>Notifications</h3>
      {notifications.map((notification) => (
        <div className="notification-row" key={notification.id}>
          <span>{notification.type}</span>
          <strong>{notification.title}</strong>
          <p>{notification.message}</p>
        </div>
      ))}
    </aside>
  );
}

export function ContactPageContent() {
  return (
    <main className="business-page">
      <section className="business-hero business-container">
        <div>
          <span className="business-eyebrow">Contact</span>
          <h1>Get a quote, ask a question, or confirm your workshop visit.</h1>
          <p>
            Reach the team by phone, email, or the contact form. The map area is
            ready for a live embed when location details are finalized.
          </p>
        </div>
        <BusinessHoursCard />
      </section>

      <section className="business-band">
        <div className="business-container contact-grid">
          <form className="business-card business-form">
            <label>
              Name
              <input required placeholder="Your name" />
            </label>
            <label>
              Email
              <input required type="email" placeholder="you@example.com" />
            </label>
            <label>
              Phone
              <input placeholder="+254 ..." />
            </label>
            <label>
              Message
              <textarea required placeholder="Tell us what you need" />
            </label>
            <button className="business-button primary" type="submit">
              Send Message
            </button>
          </form>

          <aside className="business-card contact-details">
            <h2>AutoFix Kenya</h2>
            <p><strong>Phone:</strong> +254 700 123 456</p>
            <p><strong>Email:</strong> service@autofixkenya.co.ke</p>
            <BusinessHoursCard />
            <div className="map-placeholder">
              Embedded map placeholder
              <span>Nairobi service center location</span>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

export function AdminDashboard() {
  const adminCards = [
    { label: "Customers", value: "248", detail: "18 new this month" },
    { label: "Vehicles", value: "391", detail: "42 due for service" },
    { label: "Appointments", value: "36", detail: "11 awaiting confirmation" },
    { label: "Services", value: services.length.toString(), detail: "Published menu items" },
    { label: "Inventory", value: "126", detail: "Parts and vehicles tracked" },
    { label: "Payments", value: "KSh 842K", detail: "Collected this month" },
  ];

  return (
    <main className="business-page">
      <section className="business-hero business-container">
        <div>
          <span className="business-eyebrow">Admin dashboard</span>
          <h1>Manage customers, vehicles, appointments, services, inventory, and payments.</h1>
          <p>
            This admin view uses realistic summary data and gives the business a
            professional operations surface without changing the current backend.
          </p>
        </div>
      </section>

      <section className="business-band">
        <div className="business-container">
          <div className="admin-grid">
            {adminCards.map((card) => (
              <article className="business-card admin-card" key={card.label}>
                <span>{card.label}</span>
                <strong>{card.value}</strong>
                <p>{card.detail}</p>
              </article>
            ))}
          </div>

          <div className="business-card admin-table">
            <h2>Today&apos;s Appointment Queue</h2>
            {appointments.map((appointment) => (
              <AppointmentRow key={appointment.id} appointment={appointment} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
