import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
  }),
);
app.use(express.json());

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "AutoShop Backend is running" });
});

app.get("/api/health", (req, res) => {
  res.json({ status: "OK" });
});

// Products endpoint with real automotive products in Kenyan Shilling
app.get("/api/products", (req, res) => {
  res.json([
    {
      id: 1,
      name: "Melvin Red Cargo Truck",
      description: "Heavy-duty cargo truck for commercial transport",
      price: 950000,
      currency: "KES",
      image: "/products/product1.jpg",
    },
    {
      id: 2,
      name: "Melvin Three-Wheeler Motorcycle",
      description: "Three-wheeled cargo motorcycle with canopy roof",
      price: 185000,
      currency: "KES",
      image: "/products/product2.jpg",
    },
    {
      id: 3,
      name: "Melvin Blue Motorcycle",
      description: "Blue three-wheeled cargo motorcycle",
      price: 175000,
      currency: "KES",
      image: "/products/product3.jpg",
    },
  ]);
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
});

app.listen(PORT, () => {
  console.log(`🚀 AutoShop Backend running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
});
