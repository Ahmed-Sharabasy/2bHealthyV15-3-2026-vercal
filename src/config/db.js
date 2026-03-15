import mongoose from "mongoose";
import env from "./env.js";

/**
 * Cached connection for serverless environments (Vercel).
 * Prevents creating a new connection on every invocation.
 */
let cached = global.__mongooseConnection;

if (!cached) {
  cached = global.__mongooseConnection = { conn: null, promise: null };
}

const connectDB = async () => {
  // If we already have a ready connection, reuse it
  if (cached.conn && cached.conn.readyState === 1) {
    return cached.conn;
  }

  // If a connection attempt is already in progress, await it
  if (!cached.promise) {
    const opts = {
      bufferCommands: false, // Fail immediately if not connected (prevents 10s timeout)
      serverSelectionTimeoutMS: 5000, // Fail fast if MongoDB Atlas is unreachable
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
      maxPoolSize: 10,
    };

    cached.promise = mongoose
      .connect(env.MONGO_URI, opts)
      .then((m) => {
        console.log(`✅ MongoDB connected: ${m.connection.host}`);
        return m.connection;
      })
      .catch((err) => {
        // Reset the promise so the next invocation retries
        cached.promise = null;
        throw err;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    console.error(`❌ MongoDB connection error: ${error.message}`);
    throw error;
  }

  return cached.conn;
};

export default connectDB;
