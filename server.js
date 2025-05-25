// server.js
import express from "express";
import dotenv from "dotenv";
import rateLimiter from "./src/middleware/rateLimiter.js";
import swaggerDocs from "./src/docs/swagger.js";
import authRoutes from "./routes/auth.js";
import bookRoutes from "./routes/books.js";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 6000;

app.use(express.json());
app.use(rateLimiter);
app.use(cors());

app.get("/", (req, res) => {
  console.log("✅ Root endpoint hit");
  res.send("Welcome to Book Review API!");
});

app.get("/health", (req, res) => {
  console.log("✅ Health check endpoint hit");
  res.json({ status: "OK", port: PORT });
});

swaggerDocs(app);

app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
// app.use("/api/reviews", reviewRoutes); // Add this if needed

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
