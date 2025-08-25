// lib/db.js

const mongoose = require("mongoose");

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: "oauth-demo",
    });
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
  }
}

module.exports = connectDB;


// Schema for storing client + tokens
const clientSchema = new mongoose.Schema({
  clientId: String,
  clientSecret: String,
  locationId: String,
  accessToken: String,
  refreshToken: String,
  expiresAt: Date,
});

const Client = mongoose.model("Client", clientSchema);

module.exports = { connectDB, Client };
