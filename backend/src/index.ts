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

// Products endpoint (placeholder)
app.get("/api/products", (req, res) => {
  res.json([
    { id: 1, name: "Sample Product", price: 99.99, image: "/sample.jpg" },
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
