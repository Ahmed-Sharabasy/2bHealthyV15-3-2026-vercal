import app from "./src/app.js";
import connectDB from "./src/config/db.js";
import env from "./src/config/env.js";

// ── Handle uncaught exceptions ──────────────────────────────
process.on("uncaughtException", (err) => {
  console.error("💥 UNCAUGHT EXCEPTION — Shutting down...");
  console.error(err.name, err.message);
  process.exit(1);
});

// ── Connect to MongoDB then start server ────────────────────
const startServer = async () => {
  await connectDB();

  const server = app.listen(env.PORT, () => {
    console.log(
      `🚀 Server running in ${env.NODE_ENV} mode on port ${env.PORT}`,
    );
  });

  // ── Handle unhandled promise rejections ─────────────────
  process.on("unhandledRejection", (err) => {
    console.error("💥 UNHANDLED REJECTION — Shutting down...");
    console.error(err.name, err.message);
    server.close(() => process.exit(1));
  });

  // ── Graceful shutdown on SIGTERM ────────────────────────
  process.on("SIGTERM", () => {
    console.log("👋 SIGTERM received. Shutting down gracefully...");
    server.close(() => {
      console.log("💤 Process terminated.");
    });
  });
};

startServer();
