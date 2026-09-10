export type ServiceStatus =
  | "Received"
  | "Inspection"
  | "Repair In Progress"
  | "Quality Check"
  | "Ready For Pickup";

export interface AutoService {
  id: string;
  title: string;
  description: string;
  duration: string;
  priceRange: string;
  category: string;
}

export interface CustomerVehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  mileage: number;
  lastServiceDate: string;
  notes: string;
}

export interface Appointment {
  id: string;
  customerName: string;
  phone: string;
  email: string;
  vehicle: string;
  licensePlate: string;
  service: string;
  preferredDate: string;
  preferredTime: string;
  status: ServiceStatus;
}

export interface ServiceRecord {
  id: string;
  vehicle: string;
  service: string;
  date: string;
  mileage: number;
  technician: string;
  total: string;
  notes: string;
}

export interface Invoice {
  id: string;
  customer: string;
  service: string;
  amount: string;
  status: "Paid" | "Pending" | "Overdue";
  dueDate: string;
}

export interface Review {
  id: string;
  name: string;
  vehicle: string;
  rating: number;
  comment: string;
}

export const businessHours = [
  { day: "Monday - Friday", hours: "8:00 AM - 6:00 PM" },
  { day: "Saturday", hours: "9:00 AM - 4:00 PM" },
  { day: "Sunday", hours: "Emergency bookings only" },
];

export const services: AutoService[] = [
  {
    id: "engine-diagnostics",
    title: "Engine Diagnostics",
    description:
      "Computer scanning, fault-code interpretation, engine performance checks, and clear repair recommendations.",
    duration: "45 - 75 minutes",
    priceRange: "KSh 3,500 - 8,000",
    category: "Diagnostics",
  },
  {
    id: "oil-change",
    title: "Oil Change",
    description:
      "Oil and filter replacement, fluid top-ups, leak inspection, and basic under-bonnet health check.",
    duration: "30 - 45 minutes",
    priceRange: "KSh 4,500 - 9,500",
    category: "Maintenance",
  },
  {
    id: "brake-repair",
    title: "Brake Repair",
    description:
      "Brake pad replacement, rotor inspection, fluid check, noise diagnosis, and stopping-distance safety review.",
    duration: "1.5 - 3 hours",
    priceRange: "KSh 8,000 - 28,000",
    category: "Safety",
  },
  {
    id: "wheel-alignment",
    title: "Wheel Alignment",
    description:
      "Four-wheel alignment, steering correction, tire wear review, and suspension geometry adjustment.",
    duration: "45 - 90 minutes",
    priceRange: "KSh 3,000 - 7,500",
    category: "Tires",
  },
  {
    id: "battery-replacement",
    title: "Battery Replacement",
    description:
      "Battery health test, charging-system check, fitment, terminal cleaning, and responsible battery disposal.",
    duration: "20 - 40 minutes",
    priceRange: "KSh 9,000 - 24,000",
    category: "Electrical",
  },
  {
    id: "car-detailing",
    title: "Car Detailing",
    description:
      "Exterior wash, interior vacuum, upholstery refresh, dashboard treatment, polishing, and optional engine-bay clean.",
    duration: "2 - 5 hours",
    priceRange: "KSh 6,000 - 22,000",
    category: "Care",
  },
  {
    id: "tire-replacement",
    title: "Tire Replacement",
    description:
      "Tire inspection, replacement, balancing, valve replacement, pressure setting, and safe disposal of old tires.",
    duration: "45 - 90 minutes",
    priceRange: "KSh 5,500 - 38,000",
    category: "Tires",
  },
];

export const serviceStatuses: ServiceStatus[] = [
  "Received",
  "Inspection",
  "Repair In Progress",
  "Quality Check",
  "Ready For Pickup",
];

export const vehicles: CustomerVehicle[] = [
  {
    id: "veh-001",
    make: "Toyota",
    model: "Corolla",
    year: 2020,
    licensePlate: "KDC 482Q",
    mileage: 64200,
    lastServiceDate: "2026-05-18",
    notes: "Uses synthetic oil. Customer prefers Saturday appointments.",
  },
  {
    id: "veh-002",
    make: "Subaru",
    model: "Forester",
    year: 2018,
    licensePlate: "KCY 118M",
    mileage: 88350,
    lastServiceDate: "2026-04-10",
    notes: "Check suspension noise during next inspection.",
  },
];

export const appointments: Appointment[] = [
  {
    id: "APT-1042",
    customerName: "Grace Wanjiku",
    phone: "+254 711 204 882",
    email: "grace@example.com",
    vehicle: "2020 Toyota Corolla",
    licensePlate: "KDC 482Q",
    service: "Oil Change",
    preferredDate: "2026-06-24",
    preferredTime: "10:00",
    status: "Inspection",
  },
  {
    id: "APT-1043",
    customerName: "Daniel Otieno",
    phone: "+254 722 552 129",
    email: "daniel@example.com",
    vehicle: "2018 Subaru Forester",
    licensePlate: "KCY 118M",
    service: "Brake Repair",
    preferredDate: "2026-06-25",
    preferredTime: "14:00",
    status: "Repair In Progress",
  },
];

export const serviceHistory: ServiceRecord[] = [
  {
    id: "SRV-8841",
    vehicle: "2020 Toyota Corolla",
    service: "Oil Change + Inspection",
    date: "2026-05-18",
    mileage: 62100,
    technician: "M. Kariuki",
    total: "KSh 7,800",
    notes: "Replaced oil filter and topped brake fluid.",
  },
  {
    id: "SRV-8817",
    vehicle: "2018 Subaru Forester",
    service: "Wheel Alignment",
    date: "2026-04-10",
    mileage: 86100,
    technician: "A. Njoroge",
    total: "KSh 5,500",
    notes: "Front toe corrected. Rear tires rotated.",
  },
];

export const invoices: Invoice[] = [
  {
    id: "INV-5201",
    customer: "Grace Wanjiku",
    service: "Oil Change + Inspection",
    amount: "KSh 7,800",
    status: "Paid",
    dueDate: "2026-05-18",
  },
  {
    id: "INV-5233",
    customer: "Daniel Otieno",
    service: "Brake Repair",
    amount: "KSh 18,400",
    status: "Pending",
    dueDate: "2026-06-25",
  },
];

export const reviews: Review[] = [
  {
    id: "rev-001",
    name: "Mercy Njeri",
    vehicle: "Mazda CX-5",
    rating: 5,
    comment:
      "Clear estimates, quick updates, and the car was ready exactly when promised.",
  },
  {
    id: "rev-002",
    name: "Peter Kamau",
    vehicle: "Toyota Hilux",
    rating: 5,
    comment:
      "The dashboard made it easy to follow the repair stages. Very professional team.",
  },
  {
    id: "rev-003",
    name: "Aisha Hassan",
    vehicle: "Nissan Note",
    rating: 4,
    comment:
      "Good pricing and excellent detailing work. I appreciated the booking confirmation.",
  },
];

export const notifications = [
  {
    id: "not-001",
    title: "Booking confirmed",
    message: "Your oil change appointment is booked for Jun 24 at 10:00.",
    type: "Confirmation",
  },
  {
    id: "not-002",
    title: "Service update",
    message: "KCY 118M has moved to Repair In Progress.",
    type: "Service",
  },
  {
    id: "not-003",
    title: "Invoice ready",
    message: "Invoice INV-5233 is ready for review in your dashboard.",
    type: "Billing",
  },
];
