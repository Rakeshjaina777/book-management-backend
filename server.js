// server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import rateLimiter from "./src/middleware/rateLimiter.js";
import swaggerDocs from "./src/docs/swagger.js";
import authRoutes from "./routes/auth.js";
import bookRoutes from "./routes/books.js";
import reviewRoutes from "./routes/reviews.js";
import searchRoutes from "./routes/search.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 6000;

// === MIDDLEWARE ===
console.log("🧩 Setting up middleware...");
app.use(cors());
app.use(express.json());
app.use(rateLimiter);

// === ROOT ENDPOINT ===
app.get("/", (req, res) => {
  console.log("📥 GET / - Root endpoint hit");
  res.send("📚 Welcome to Book Review API!");
});

// === HEALTH CHECK ===
app.get("/health", (req, res) => {
  console.log("🩺 GET /health - Health check hit");
  res.json({ status: "OK", port: PORT });
});

// === SWAGGER ===
console.log("📄 Swagge documentation initialized...");
swaggerDocs(app);

// === ROUTES ===
console.log("🚦 Registering routes...");
app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/search", searchRoutes);

// === START SERVER ===
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
