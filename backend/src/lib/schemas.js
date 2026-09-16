import { z } from "zod";

// ── Appointment ───────────────────────────────────────────────────────────────
export const appointmentSchema = z.object({
  name: z.string().min(2).max(100),
  phone: z.string().min(7).max(20),
  email: z.string().email(),
  make: z.string().min(1).max(60),
  model: z.string().min(1).max(60),
  year: z.string().regex(/^\d{4}$/, "Year must be 4 digits"),
  licensePlate: z.string().min(1).max(20),
  serviceId: z.string().min(1).max(80),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD"),
  time: z.string().min(1).max(20),
  notes: z.string().max(1000).optional().default(""),
});

// ── Cart ──────────────────────────────────────────────────────────────────────
export const addToCartSchema = z.object({
  productId: z.union([z.string(), z.number()]).transform(String),
  quantity: z.number().int().positive().max(99).default(1),
  // For arbitrary (parts catalog) items
  name: z.string().max(200).optional(),
  price: z.number().nonnegative().optional(),
});

export const removeFromCartSchema = z.object({
  productId: z.union([z.string(), z.number()]).transform(String),
});

// ── Checkout ──────────────────────────────────────────────────────────────────
export const checkoutSchema = z.object({
  email: z.string().email(),
  shippingAddress: z.object({
    name: z.string().min(1).max(100),
    phone: z.string().min(7).max(20),
    line1: z.string().min(1).max(200),
    city: z.string().min(1).max(100),
    county: z.string().max(100).optional(),
  }),
  paymentMethod: z.string().default("pending"),
});

// ── Contact ───────────────────────────────────────────────────────────────────
export const contactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().max(20).optional().default(""),
  subject: z.string().max(200).optional().default("General"),
  message: z.string().min(10).max(5000),
});

// ── Car listing ───────────────────────────────────────────────────────────────
export const carListingSchema = z.object({
  userId: z.string().min(1),
  make: z.string().min(1).max(60),
  model: z.string().min(1).max(60),
  year: z.string().regex(/^\d{4}$/).transform(Number),
  mileage: z.string().transform(Number).optional(),
  color: z.string().max(40).optional().default(""),
  bodyType: z.string().max(40).optional().default(""),
  fuelType: z.string().max(40).optional().default(""),
  transmission: z.string().max(40).optional().default(""),
  engineSize: z.string().max(20).optional().default(""),
  condition: z.string().max(40).optional().default(""),
  price: z.string().transform(Number),
  negotiable: z.string().optional().transform((v) => v === "true"),
  title: z.string().min(3).max(200),
  description: z.string().max(5000).optional().default(""),
  features: z.string().optional().default("[]"),
  location: z.string().optional().default("{}"),
  contactPhone: z.string().min(7).max(20),
  contactEmail: z.string().email().optional().or(z.literal("")).optional(),
});

// ── Helper: parse and return 400 on failure ───────────────────────────────────
export function validate(schema, data) {
  const result = schema.safeParse(data);
  if (!result.success) {
    return { ok: false, errors: result.error.flatten().fieldErrors };
  }
  return { ok: true, data: result.data };
}
