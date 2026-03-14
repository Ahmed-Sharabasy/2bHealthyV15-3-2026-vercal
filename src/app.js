import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

import env from "./config/env.js";
import mountRoutes from "./routes/index.js";
import globalErrorMiddleware from "./middlewares/globalErrorMiddleware.js";
import AppError from "./utils/AppError.js";

const app = express();

// ── Security headers ────────────────────────────────────────
app.use(helmet());

// ── CORS ────────────────────────────────────────────────────
app.use(cors());

// ── Global rate limiter ─────────────────────────────────────
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: "fail",
    message: "Too many requests, please try again later.",
  },
});
app.use(globalLimiter);

// ── Body parsers ────────────────────────────────────────────
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ── Request logging ─────────────────────────────────────────
if (env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// ── Static files (uploads) ──────────────────────────────────
app.use("/uploads", express.static("uploads"));

// ── Health check ────────────────────────────────────────────
app.get("/api/v1/health-check", (req, res) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Api welcome route
app.get("/", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Welcome to the 2bHealthy API",
  });
});

// ── Mount all API routes ────────────────────────────────────
mountRoutes(app);

// ── 404 handler ─────────────────────────────────────────────
app.all("*", (req, res, next) => {
  next(new AppError(`Cannot find ${req.originalUrl} on this server`, 404));
});

// ── Global error middleware ─────────────────────────────────
app.use(globalErrorMiddleware);

export default app;
