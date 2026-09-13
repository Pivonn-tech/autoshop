import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    credentials: true,
  }),
);
app.use(express.json());

// In-memory cart storage (will be replaced with database)
const carts = new Map();

// Middleware to track cart sessions
app.use((req, res, next) => {
  const cartId = req.headers["x-cart-id"] || `cart-${Date.now()}`;
  if (!carts.has(cartId)) {
    carts.set(cartId, []);
  }
  req.cartId = cartId;
  res.setHeader("X-Cart-ID", cartId);
  next();
});

// Serve static files from frontend
app.use(express.static(path.join(__dirname, "../../frontend/public")));

// Serve product images from pics folder
app.use("/images", express.static(path.join(__dirname, "../../pics")));

// Product database with Kenyan Shilling pricing - Melvin vehicles
const PRODUCTS_DATA = [
  {
    id: 1,
    name: "Melvin Red Cargo Truck",
    description:
      "Heavy-duty cargo truck for commercial transport and logistics",
    category: "trucks",
    price: 950000,
    currency: "KES",
    stock: 2,
    icon: "🚚",
    make: "Isuzu",
    condition: "used",
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
    description:
      "Three-wheeled cargo motorcycle with canopy roof for urban delivery",
    category: "motorcycles",
    price: 185000,
    currency: "KES",
    stock: 4,
    icon: "🏍️",
    make: "Bajaj",
    condition: "new",
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
    description:
      "Blue three-wheeled cargo motorcycle for commercial operations",
    category: "motorcycles",
    price: 175000,
    currency: "KES",
    stock: 3,
    icon: "🏍️",
    make: "Bajaj",
    condition: "new",
    views: [
      "product3/IMG-20260509-WA0016.jpg",
      "product3/IMG-20260509-WA0021.jpg",
    ],
  },
];

// Get products with images from pics folder
function getProductsFromImages() {
  return PRODUCTS_DATA.map((product) => ({
    ...product,
    image: `/images/${product.views[0]}`, // Primary image (first view)
  }));
}

// Get product with all gallery images
function getProductWithGallery(id) {
  const product = PRODUCTS_DATA.find((p) => p.id === id);
  if (!product) return null;
  return {
    ...product,
    image: `/images/${product.views[0]}`,
    gallery: product.views.map((view) => `/images/${view}`),
  };
}

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "AutoShop Backend is running" });
});

app.get("/api/health", (req, res) => {
  res.json({ status: "OK" });
});

// ── In-memory appointments store ─────────────────────────────────────────────
const appointmentsStore = [];

app.post("/api/appointments", (req, res) => {
  const { name, phone, email, make, model, year, licensePlate, serviceId, date, time, notes } = req.body;

  // Basic validation
  if (!name || !email || !make || !model || !serviceId || !date || !time) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const appointment = {
    id: `APT-${Date.now()}`,
    customerName: name,
    phone: phone || "",
    email,
    vehicle: `${year} ${make} ${model}`,
    licensePlate: licensePlate || "",
    serviceId,
    preferredDate: date,
    preferredTime: time,
    notes: notes || "",
    status: "Pending",
    createdAt: new Date().toISOString(),
  };

  appointmentsStore.push(appointment);

  console.log(`📅 New appointment: ${appointment.id} — ${appointment.customerName} for ${appointment.serviceId} on ${appointment.preferredDate}`);

  res.status(201).json({ success: true, appointment });
});

app.get("/api/appointments", (req, res) => {
  res.json(appointmentsStore);
});

// Dashboard endpoint — returns summary data for the customer dashboard
app.get("/api/dashboard", (req, res) => {
  const recentAppointments = appointmentsStore.slice(-5).reverse().map((a) => ({
    id: a.id,
    service: a.serviceId,
    vehicle: a.vehicle,
    date: a.preferredDate,
    time: a.preferredTime,
    status: a.status,
  }));

  res.json({
    stats: {
      totalAppointments: appointmentsStore.length,
      pendingAppointments: appointmentsStore.filter((a) => a.status === "Pending").length,
      completedAppointments: appointmentsStore.filter((a) => a.status === "Completed").length,
    },
    recentAppointments,
    lastUpdated: new Date().toISOString(),
  });
});

// Products endpoint - NOW SERVES YOUR ACTUAL IMAGES!
app.get("/api/products", (req, res) => {
  const products = getProductsFromImages();
  if (products.length === 0) {
    // Fallback to sample products if no images found
    res.json([
      {
        id: 1,
        name: "Premium Oil Filter",
        price: 24.99,
        image: "/sample.jpg",
        category: "Parts",
        stock: 45,
        icon: "🔩",
      },
      {
        id: 2,
        name: "Brake Pad Set",
        price: 89.99,
        image: "/sample.jpg",
        category: "Parts",
        stock: 28,
        icon: "⚙️",
      },
    ]);
  } else {
    res.json(products);
  }
});

// Get specific product
app.get("/api/products/:id", (req, res) => {
  const product = getProductWithGallery(parseInt(req.params.id));
  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }
  res.json(product);
});

// Cart endpoints
app.get("/api/cart", (req, res) => {
  const cart = carts.get(req.cartId) || [];
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  res.json({ items: cart, total: total.toFixed(2), cartId: req.cartId });
});

app.post("/api/cart/add", (req, res) => {
  const { productId, quantity, name, price } = req.body;
  const cart = carts.get(req.cartId) || [];

  // Try to find a known product first
  const product = getProductWithGallery(parseInt(productId));

  if (product) {
    // Vehicle/known product
    if (quantity > product.stock) {
      return res.status(400).json({ error: "Insufficient stock" });
    }
    const existingItem = cart.find((item) => item.id === productId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({
        id: productId,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: quantity,
      });
    }
  } else if (name && price !== undefined) {
    // Arbitrary item (e.g. parts catalog) — accept name+price directly
    const existingItem = cart.find((item) => item.id === productId);
    if (existingItem) {
      existingItem.quantity += quantity || 1;
    } else {
      cart.push({
        id: productId,
        name,
        price,
        image: null,
        quantity: quantity || 1,
      });
    }
  } else {
    return res.status(404).json({ error: "Product not found" });
  }

  carts.set(req.cartId, cart);
  res.json({ success: true, cart, message: "Item added to cart" });
});

app.post("/api/cart/remove", (req, res) => {
  const { productId } = req.body;
  const cart = carts.get(req.cartId) || [];
  carts.set(
    req.cartId,
    cart.filter((item) => item.id !== productId),
  );
  res.json({ success: true, cart: carts.get(req.cartId) });
});

app.post("/api/cart/clear", (req, res) => {
  carts.set(req.cartId, []);
  res.json({ success: true, message: "Cart cleared" });
});

// Checkout endpoint (Stripe integration ready)
app.post("/api/checkout", async (req, res) => {
  const { email, shippingAddress } = req.body;
  const cart = carts.get(req.cartId) || [];

  if (cart.length === 0) {
    return res.status(400).json({ error: "Cart is empty" });
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // TODO: Integrate Stripe payment here
  // For now, return success (placeholder)
  res.json({
    success: true,
    orderId: `ORDER-${Date.now()}`,
    total: total.toFixed(2),
    email,
    shippingAddress,
    status: "pending_payment",
    message: "Order created. Stripe payment integration coming soon!",
  });
});

// Contact form endpoint
app.post("/api/contact", (req, res) => {
  const { name, email, phone, subject, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: "name, email and message are required" });
  }
  // Log it server-side (replace with email integration when ready)
  console.log(`📬 Contact form — ${name} <${email}> [${subject || "General"}]: ${message.slice(0, 80)}`);
  res.json({ success: true });
});
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../../frontend/public/index.html"));
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
});

app.listen(PORT, () => {
  console.log(`🚀 AutoShop running on http://localhost:${PORT}`);
  console.log(`🌐 Store: http://localhost:${PORT}`);
  console.log(`📊 API: http://localhost:${PORT}/api/products`);
  console.log(`✅ Backend ready to serve your auto shop!`);
  console.log(`📦 Loaded 3 products with gallery views`);
  console.log(`🛒 Cart: POST http://localhost:${PORT}/api/cart/add`);
  console.log(`💳 Checkout: POST http://localhost:${PORT}/api/checkout`);
});
