import app from "../src/app.js";
import connectDB from "../src/config/db.js";

/**
 * Vercel Serverless Function entry point.
 * Connects to MongoDB (with caching) before handling each request.
 */
export default async function handler(req, res) {
  try {
    await connectDB();
  } catch (err) {
    console.error("❌ Failed to connect to MongoDB:", err.message);
    return res.status(503).json({
      status: "error",
      message: "Database connection failed. Please try again shortly.",
    });
  }

  // Delegate to Express app
  return app(req, res);
}
