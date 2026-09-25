import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import pinoHttp from "pino-http";

import logger from "./lib/logger.js";
import { prisma } from "./db/prisma.js";
import {
  appointmentSchema,
  addToCartSchema,
  removeFromCartSchema,
  checkoutSchema,
  contactSchema,
  validate,
} from "./lib/schemas.js";
import { sendAppointmentConfirmation, sendOrderReceipt } from "./lib/mailer.js";
import carListingsRouter from "./routes/carListings.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const IS_PROD = process.env.NODE_ENV === "production";

// ── Security headers ──────────────────────────────────────────────────────────
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }, // allow images from frontend
    contentSecurityPolicy: false, // frontend handles its own CSP
  })
);

// ── Request logging ───────────────────────────────────────────────────────────
app.use(pinoHttp({ logger, autoLogging: { ignore: (req) => req.url === "/health" } }));

// ── CORS ──────────────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || (IS_PROD ? false : "*"),
    credentials: true,
  })
);

app.use(express.json({ limit: "2mb" }));

// ── Rate limiters ─────────────────────────────────────────────────────────────
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
});

const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests, please try again later." },
});

app.use(generalLimiter);

// ── Static files ──────────────────────────────────────────────────────────────
app.use(express.static(path.join(__dirname, "../../frontend/public")));
app.use("/images", express.static(path.join(__dirname, "../../pics")));
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// ── Product data (static catalog) ─────────────────────────────────────────────
const PRODUCTS_DATA = [
  {
    id: 1,
    name: "Melvin Red Cargo Truck",
    description: "Heavy-duty cargo truck for commercial transport and logistics",
    fullDescription: `The Melvin Red Cargo Truck is a workhorse purpose-built for Kenya's demanding roads and high-volume commercial operations. Powered by a robust Isuzu diesel engine, it delivers exceptional torque at low RPM — ideal for loaded runs up the steep gradients of Limuru, the congested streets of Nairobi CBD, or long-haul routes to Mombasa.\n\nThis particular unit has been professionally inspected by our KEBS-certified workshop team. All mechanical systems — brakes, steering, suspension, and drivetrain — have been serviced and certified roadworthy. The cargo bed has been treated with anti-rust coating and features reinforced side panels rated for up to 3,000 kg of evenly distributed load.\n\nFinancing options are available through our partner lenders, with repayment periods of up to 48 months. Logbook, comprehensive insurance, and a 6-month/10,000 km drivetrain warranty are included in the purchase price.`,
    category: "trucks",
    price: 950000,
    currency: "KES",
    stock: 2,
    make: "Isuzu",
    model: "NKR 55",
    year: 2019,
    condition: "used",
    bodyType: "Cargo Truck",
    fuelType: "Diesel",
    transmission: "Manual – 5-speed",
    engineSize: "3,600cc turbo diesel",
    payload: "3,000 kg",
    mileage: "87,000 km",
    color: "Red",
    warranty: "6 months / 10,000 km",
    certification: "KEBS Approved",
    sponsorshipTier: "sponsored",
    location: "Karen",
    specs: [
      { label: "Make & Model", value: "Isuzu NKR 55" },
      { label: "Year", value: "2019" },
      { label: "Engine", value: "3,600cc Turbo Diesel" },
      { label: "Transmission", value: "Manual – 5-speed" },
      { label: "Fuel Type", value: "Diesel" },
      { label: "Payload", value: "3,000 kg" },
      { label: "Mileage", value: "87,000 km" },
      { label: "Color", value: "Red" },
      { label: "Condition", value: "Used – Inspected" },
      { label: "Warranty", value: "6 months / 10,000 km" },
      { label: "Certification", value: "KEBS Approved" },
      { label: "Body Type", value: "Flatbed / Cargo" },
    ],
    highlights: [
      "Isuzu turbo diesel engine — proven reliability across East Africa",
      "Payload rated at 3,000 kg — ideal for heavy commercial loads",
      "Serviced & KEBS-certified before sale",
      "Reinforced anti-rust cargo bed with side panels",
      "Logbook, insurance & full documentation included",
      "Financing available — up to 48-month repayment",
    ],
    views: [
      "product1/IMG-20260509-WA0008.jpg",
      "product1/IMG-20260509-WA0009.jpg",
      "product1/IMG-20260509-WA0017.jpg",
      "product1/IMG-20260509-WA0018.jpg",
      "product1/IMG-20260509-WA0019.jpg",
      "product1/IMG-20260509-WA0020.jpg",
    ],
  },
  {
    id: 2,
    name: "Melvin Three-Wheeler Motorcycle",
    description: "Three-wheeled cargo motorcycle with canopy roof for urban delivery",
    fullDescription: `The Melvin Three-Wheeler (Tuk-Tuk) is the most popular last-mile delivery and urban transport solution across Kenyan towns. This Bajaj-powered unit comes fitted with a weather-resistant canopy roof, a lockable cargo bay, and comfortable padded seating for up to 3 passengers — making it equally suited for goods delivery or personal transport operations.\n\nNew from the factory, it ships with full Bajaj Kenya warranty coverage and is ready for immediate NTSA registration. Fuel efficiency of approximately 35–40 km per litre makes it one of the most cost-effective commercial vehicles on Kenyan roads. Spare parts are widely available at all major towns nationwide.\n\nIdeal for supermarkets, pharmacies, boda-boda upgrade operators, courier services, and market traders. Bulk pricing available for fleet orders of 3 units and above.`,
    category: "motorcycles",
    price: 185000,
    currency: "KES",
    stock: 4,
    make: "Bajaj",
    model: "RE Compact",
    year: 2026,
    condition: "new",
    bodyType: "Three-Wheeler / Tuk-Tuk",
    fuelType: "Petrol",
    transmission: "Automatic – CVT",
    engineSize: "216cc single-cylinder",
    payload: "500 kg",
    mileage: "0 km (brand new)",
    color: "Yellow / Black",
    warranty: "1 year Bajaj Kenya warranty",
    certification: "NTSA Approved",
    sponsorshipTier: "standard",
    location: "Nairobi CBD",
    specs: [
      { label: "Make & Model", value: "Bajaj RE Compact" },
      { label: "Year", value: "2026" },
      { label: "Engine", value: "216cc Single-Cylinder Petrol" },
      { label: "Transmission", value: "Automatic – CVT" },
      { label: "Fuel Type", value: "Petrol" },
      { label: "Payload", value: "500 kg" },
      { label: "Fuel Economy", value: "~38 km/litre" },
      { label: "Color", value: "Yellow / Black" },
      { label: "Condition", value: "Brand New" },
      { label: "Warranty", value: "1 year Bajaj Kenya" },
      { label: "Certification", value: "NTSA Approved" },
      { label: "Body Type", value: "Three-Wheeler / Tuk-Tuk" },
    ],
    highlights: [
      "Brand new — 0 km, straight from Bajaj Kenya",
      "216cc fuel-efficient engine: ~38 km per litre",
      "Canopy roof protects cargo and passengers from rain",
      "Lockable cargo bay — secure deliveries",
      "CVT automatic transmission — easy to drive anywhere",
      "Spare parts available at all major towns countrywide",
      "Bulk fleet discounts for 3+ units",
    ],
    views: [
      "product2/IMG-20260509-WA0010.jpg",
      "product2/IMG-20260509-WA0011.jpg",
      "product2/IMG-20260509-WA0012.jpg",
      "product2/IMG-20260509-WA0013.jpg",
      "product2/IMG-20260509-WA0014.jpg",
      "product2/IMG-20260509-WA0015.jpg",
    ],
  },
  {
    id: 3,
    name: "Melvin Blue Motorcycle",
    description: "Blue three-wheeled cargo motorcycle for commercial operations",
    fullDescription: `The Melvin Blue Three-Wheeler is a nimble, dependable cargo tuk-tuk designed for businesses that need a compact but capable delivery solution. Finished in a distinctive blue livery, it is perfect for branding as a company fleet vehicle or running independently as a delivery service.\n\nNew and NTSA-registered ready, this unit features a semi-enclosed passenger/cargo area, wide rear axle for stability on uneven terrain, and a front-mounted storage basket. The 216cc Bajaj engine is easy to service with parts available from any Bajaj dealer or local garage across Kenya.\n\nWhether you're running an e-commerce delivery operation, a catering service, or a general goods transport business, the Melvin Blue provides an excellent return on investment with low running costs and near-zero downtime. Available for test ride at our Nairobi showroom.`,
    category: "motorcycles",
    price: 175000,
    currency: "KES",
    stock: 3,
    make: "Bajaj",
    model: "RE Cargo",
    year: 2026,
    condition: "new",
    bodyType: "Three-Wheeler / Cargo",
    fuelType: "Petrol",
    transmission: "Automatic – CVT",
    engineSize: "216cc single-cylinder",
    payload: "450 kg",
    mileage: "0 km (brand new)",
    color: "Blue / White",
    warranty: "1 year Bajaj Kenya warranty",
    certification: "NTSA Approved",
    sponsorshipTier: "standard",
    location: "Ridgeways",
    specs: [
      { label: "Make & Model", value: "Bajaj RE Cargo" },
      { label: "Year", value: "2026" },
      { label: "Engine", value: "216cc Single-Cylinder Petrol" },
      { label: "Transmission", value: "Automatic – CVT" },
      { label: "Fuel Type", value: "Petrol" },
      { label: "Payload", value: "450 kg" },
      { label: "Fuel Economy", value: "~40 km/litre" },
      { label: "Color", value: "Blue / White" },
      { label: "Condition", value: "Brand New" },
      { label: "Warranty", value: "1 year Bajaj Kenya" },
      { label: "Certification", value: "NTSA Approved" },
      { label: "Body Type", value: "Three-Wheeler / Cargo" },
    ],
    highlights: [
      "Brand new — 0 km, direct from Bajaj Kenya",
      "Best-in-class fuel economy: ~40 km per litre",
      "Distinctive blue livery — ideal for fleet branding",
      "Wide rear axle for stability on rough terrain",
      "Low maintenance — parts available nationwide",
      "NTSA registration assistance included",
      "Test ride available at our Nairobi showroom",
    ],
    views: [
      "product3/IMG-20260509-WA0016.jpg",
      "product3/IMG-20260509-WA0021.jpg",
    ],
  },
];

function getProductsFromImages() {
  return PRODUCTS_DATA.map((p) => ({ ...p, image: `/images/${p.views[0]}` }));
}

function getProductWithGallery(id) {
  const p = PRODUCTS_DATA.find((x) => x.id === id);
  if (!p) return null;
  return { ...p, image: `/images/${p.views[0]}`, gallery: p.views.map((v) => `/images/${v}`) };
}

// ── Cart helpers ──────────────────────────────────────────────────────────────

/**
 * Resolve (or create) a Cart row given userId and/or sessionKey.
 * - Authenticated: look up by userId, merge anonymous cart if session key present.
 * - Anonymous: look up by sessionKey, create if missing.
 */
async function resolveCart(userId, sessionKey) {
  if (userId) {
    // Try to find the user's persistent cart
    let cart = await prisma.cart.findFirst({
      where: { userId },
      include: { items: true },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
        include: { items: true },
      });
    }

    // If there was also an anonymous session cart, merge its items in
    if (sessionKey) {
      const anonCart = await prisma.cart.findUnique({
        where: { sessionKey },
        include: { items: true },
      });
      if (anonCart && anonCart.id !== cart.id) {
        for (const item of anonCart.items) {
          await upsertCartItem(cart.id, item.productId, item.name, item.price, item.image, item.quantity);
        }
        await prisma.cart.delete({ where: { id: anonCart.id } });
        // Re-fetch after merge
        cart = await prisma.cart.findUnique({ where: { id: cart.id }, include: { items: true } });
      }
    }

    return cart;
  }

  // Anonymous
  if (sessionKey) {
    let cart = await prisma.cart.findUnique({
      where: { sessionKey },
      include: { items: true },
    });
    if (!cart) {
      cart = await prisma.cart.create({
        data: { sessionKey },
        include: { items: true },
      });
    }
    return cart;
  }

  // Create a brand-new anonymous cart
  return prisma.cart.create({ data: {}, include: { items: true } });
}

async function upsertCartItem(cartId, productId, name, price, image, quantity) {
  const existing = await prisma.cartItem.findUnique({
    where: { cartId_productId: { cartId, productId } },
  });
  if (existing) {
    return prisma.cartItem.update({
      where: { id: existing.id },
      data: { quantity: existing.quantity + quantity },
    });
  }
  return prisma.cartItem.create({
    data: { cartId, productId, name, price, image, quantity },
  });
}

// ── Middleware: attach cart to request ────────────────────────────────────────
app.use(async (req, res, next) => {
  const sessionKey = req.headers["x-cart-id"] || null;
  req.sessionKey = sessionKey;
  // userId would come from JWT/session validation — for now left as optional
  req.cartUserId = null;
  next();
});

// ── Health ────────────────────────────────────────────────────────────────────
app.get("/health", (req, res) => res.json({ status: "OK", uptime: process.uptime() }));
app.get("/api/health", (req, res) => res.json({ status: "OK" }));

// ── Car listings ──────────────────────────────────────────────────────────────
app.use("/api/car-listings", carListingsRouter);

// ── Appointments ──────────────────────────────────────────────────────────────
app.post("/api/appointments", strictLimiter, async (req, res) => {
  const validation = validate(appointmentSchema, req.body);
  if (!validation.ok) {
    return res.status(400).json({ error: "Validation failed", fields: validation.errors });
  }

  const { name, phone, email, make, model, year, licensePlate, serviceId, date, time, notes } =
    validation.data;

  try {
    const appointment = await prisma.appointment.create({
      data: {
        customerName: name,
        phone,
        email,
        vehicle: `${year} ${make} ${model}`,
        licensePlate,
        serviceId,
        preferredDate: new Date(date),
        preferredTime: time,
        notes,
        status: "Pending",
      },
    });

    logger.info({ appointmentId: appointment.id, customer: name, service: serviceId }, "Appointment created");

    // Fire-and-forget confirmation email
    sendAppointmentConfirmation(appointment).catch(() => {});

    return res.status(201).json({ success: true, appointment });
  } catch (err) {
    logger.error({ err }, "Failed to create appointment");
    return res.status(500).json({ error: IS_PROD ? "Server error" : err.message });
  }
});

app.get("/api/appointments", async (req, res) => {
  try {
    const appointments = await prisma.appointment.findMany({
      orderBy: { createdAt: "desc" },
    });
    return res.json(appointments);
  } catch (err) {
    logger.error({ err }, "Failed to fetch appointments");
    return res.status(500).json({ error: IS_PROD ? "Server error" : err.message });
  }
});

// ── Dashboard ─────────────────────────────────────────────────────────────────
app.get("/api/dashboard", async (req, res) => {
  try {
    const [total, pending, completed] = await Promise.all([
      prisma.appointment.count(),
      prisma.appointment.count({ where: { status: "Pending" } }),
      prisma.appointment.count({ where: { status: "Completed" } }),
    ]);

    const recent = await prisma.appointment.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        serviceId: true,
        vehicle: true,
        preferredDate: true,
        preferredTime: true,
        status: true,
      },
    });

    return res.json({
      stats: { totalAppointments: total, pendingAppointments: pending, completedAppointments: completed },
      recentAppointments: recent.map((a) => ({
        id: a.id,
        service: a.serviceId,
        vehicle: a.vehicle,
        date: a.preferredDate,
        time: a.preferredTime,
        status: a.status,
      })),
      lastUpdated: new Date().toISOString(),
    });
  } catch (err) {
    logger.error({ err }, "Dashboard error");
    return res.status(500).json({ error: IS_PROD ? "Server error" : err.message });
  }
});

// ── Products ──────────────────────────────────────────────────────────────────
app.get("/api/products", (req, res) => {
  const { make, minPrice, maxPrice, minYear, maxYear, transmission, color, sort } = req.query;
  
  let products = getProductsFromImages();
  
  // Apply filters
  if (make) {
    products = products.filter(p => p.make?.toLowerCase() === make.toLowerCase());
  }
  if (minPrice) {
    const min = parseFloat(minPrice);
    products = products.filter(p => p.price >= min);
  }
  if (maxPrice) {
    const max = parseFloat(maxPrice);
    products = products.filter(p => p.price <= max);
  }
  if (minYear) {
    const min = parseInt(minYear);
    products = products.filter(p => (p.year || 0) >= min);
  }
  if (maxYear) {
    const max = parseInt(maxYear);
    products = products.filter(p => (p.year || 0) <= max);
  }
  if (transmission) {
    products = products.filter(p => p.transmission?.toLowerCase().includes(transmission.toLowerCase()));
  }
  if (color) {
    products = products.filter(p => p.color?.toLowerCase() === color.toLowerCase());
  }
  
  // Apply sorting
  if (sort === "price-low") {
    products.sort((a, b) => a.price - b.price);
  } else if (sort === "price-high") {
    products.sort((a, b) => b.price - a.price);
  } else if (sort === "year-new") {
    products.sort((a, b) => (b.year || 0) - (a.year || 0));
  } else if (sort === "deals") {
    // Sponsored/featured items first
    products.sort((a, b) => {
      if (a.sponsorshipTier === "sponsored" && b.sponsorshipTier !== "sponsored") return -1;
      if (a.sponsorshipTier !== "sponsored" && b.sponsorshipTier === "sponsored") return 1;
      return 0;
    });
  }
  
  return res.json(products);
});

app.get("/api/products/:id", (req, res) => {
  const product = getProductWithGallery(parseInt(req.params.id));
  if (!product) return res.status(404).json({ error: "Product not found" });
  return res.json(product);
});

// ── Cart ──────────────────────────────────────────────────────────────────────
app.get("/api/cart", async (req, res) => {
  try {
    const cart = await resolveCart(req.cartUserId, req.sessionKey);
    const total = cart.items.reduce((s, i) => s + i.price * i.quantity, 0);

    res.setHeader("X-Cart-ID", cart.sessionKey || cart.id);
    return res.json({ items: cart.items, total: total.toFixed(2), cartId: cart.sessionKey || cart.id });
  } catch (err) {
    logger.error({ err }, "Cart fetch error");
    return res.status(500).json({ error: IS_PROD ? "Server error" : err.message });
  }
});

app.post("/api/cart/add", async (req, res) => {
  const validation = validate(addToCartSchema, req.body);
  if (!validation.ok) {
    return res.status(400).json({ error: "Validation failed", fields: validation.errors });
  }

  const { productId, quantity, name: customName, price: customPrice } = validation.data;

  try {
    const cart = await resolveCart(req.cartUserId, req.sessionKey);

    const knownProduct = getProductWithGallery(parseInt(productId));
    let itemName, itemPrice, itemImage;

    if (knownProduct) {
      if (quantity > knownProduct.stock) {
        return res.status(400).json({ error: "Insufficient stock" });
      }
      itemName = knownProduct.name;
      itemPrice = knownProduct.price;
      itemImage = knownProduct.image;
    } else if (customName && customPrice !== undefined) {
      itemName = customName;
      itemPrice = customPrice;
      itemImage = null;
    } else {
      return res.status(404).json({ error: "Product not found" });
    }

    await upsertCartItem(cart.id, productId, itemName, itemPrice, itemImage, quantity);

    const updated = await prisma.cart.findUnique({
      where: { id: cart.id },
      include: { items: true },
    });

    res.setHeader("X-Cart-ID", updated.sessionKey || updated.id);
    return res.json({ success: true, cart: updated.items, message: "Item added to cart" });
  } catch (err) {
    logger.error({ err }, "Cart add error");
    return res.status(500).json({ error: IS_PROD ? "Server error" : err.message });
  }
});

app.post("/api/cart/remove", async (req, res) => {
  const validation = validate(removeFromCartSchema, req.body);
  if (!validation.ok) {
    return res.status(400).json({ error: "Validation failed", fields: validation.errors });
  }

  try {
    const cart = await resolveCart(req.cartUserId, req.sessionKey);
    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id, productId: validation.data.productId },
    });
    const updated = await prisma.cart.findUnique({
      where: { id: cart.id },
      include: { items: true },
    });
    res.setHeader("X-Cart-ID", updated.sessionKey || updated.id);
    return res.json({ success: true, cart: updated.items });
  } catch (err) {
    logger.error({ err }, "Cart remove error");
    return res.status(500).json({ error: IS_PROD ? "Server error" : err.message });
  }
});

app.post("/api/cart/clear", async (req, res) => {
  try {
    const cart = await resolveCart(req.cartUserId, req.sessionKey);
    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    res.setHeader("X-Cart-ID", cart.sessionKey || cart.id);
    return res.json({ success: true, message: "Cart cleared" });
  } catch (err) {
    logger.error({ err }, "Cart clear error");
    return res.status(500).json({ error: IS_PROD ? "Server error" : err.message });
  }
});

// ── Checkout (payment pending — stores order and sends receipt) ───────────────
app.post("/api/checkout", strictLimiter, async (req, res) => {
  const validation = validate(checkoutSchema, req.body);
  if (!validation.ok) {
    return res.status(400).json({ error: "Validation failed", fields: validation.errors });
  }

  const { email, shippingAddress, paymentMethod } = validation.data;

  try {
    const cart = await resolveCart(req.cartUserId, req.sessionKey);

    if (!cart.items.length) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    const total = cart.items.reduce((s, i) => s + i.price * i.quantity, 0);

    // Persist order (payment integration to be added)
    const order = await prisma.order.create({
      data: {
        // userId null for guest checkout
        userId: req.cartUserId || null,
        items: cart.items.map((i) => ({
          productId: i.productId,
          name: i.name,
          price: i.price,
          quantity: i.quantity,
        })),
        total,
        status: "pending_payment",
        shippingAddress,
        paymentMethod,
      },
    });

    // Clear the cart after order creation
    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });

    logger.info({ orderId: order.id, total }, "Order created");

    // Fire-and-forget receipt email
    sendOrderReceipt(order, cart.items, email, shippingAddress.name).catch(() => {});

    return res.json({
      success: true,
      orderId: order.id,
      total: total.toFixed(2),
      email,
      status: "pending_payment",
      message: "Order created. Payment integration coming soon!",
    });
  } catch (err) {
    logger.error({ err }, "Checkout error");
    return res.status(500).json({ error: IS_PROD ? "Server error" : err.message });
  }
});

// ── Contact ───────────────────────────────────────────────────────────────────
app.post("/api/contact", strictLimiter, async (req, res) => {
  const validation = validate(contactSchema, req.body);
  if (!validation.ok) {
    return res.status(400).json({ error: "Validation failed", fields: validation.errors });
  }

  const { name, email, phone, subject, message } = validation.data;
  logger.info({ name, email, subject }, `Contact form submission: ${message.slice(0, 80)}`);
  return res.json({ success: true });
});

// ── Fallback ──────────────────────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../../frontend/public/index.html"));
});

app.use((req, res) => res.status(404).json({ error: "Endpoint not found" }));

// ── Global error handler ──────────────────────────────────────────────────────
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, _next) => {
  logger.error({ err, url: req.url, method: req.method }, "Unhandled error");
  return res.status(500).json({ error: IS_PROD ? "Internal server error" : err.message });
});

// ── Start ─────────────────────────────────────────────────────────────────────
app.listen(PORT, async () => {
  logger.info({ port: PORT, env: process.env.NODE_ENV }, "AutoShop API started");
  // Verify DB connection
  try {
    await prisma.$queryRaw`SELECT 1`;
    logger.info("Database connection OK");
  } catch (err) {
    logger.error({ err }, "Database connection FAILED");
  }
});
