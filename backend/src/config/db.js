// MongoDB connection
// right now basic set up - will update when going to production and add more options for connection like retryWrites, useNewUrlParser, useUnifiedTopology etc
import mongoose from "mongoose";

if (!process.env.MONGO_URL) {
  throw new Error("❌ MONGO_URL not found in .env file");
}

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      serverSelectionTimeoutMS: 5000, // Connection within 5sec or fail
      socketTimeoutMS: 45000,
      family: 4, // IPv4
    });

    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    // Let PM2 / Docker / K8s restart the app
    process.exit(1);
  }
};

// Connection Events
mongoose.connection.on("error", (err) => {
  console.error("❌ MongoDB runtime error:", err);
});
mongoose.connection.on("disconnected", () => {
  console.warn("❌ MongoDB disconnected");
});

// Avoiding any Data leaks after disconnecting the DB
process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log("✅ MongoDB connection closed");
  process.exit(0);
});
