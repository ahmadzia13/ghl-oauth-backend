const mongoose = require("mongoose");

const TokenSchema = new mongoose.Schema({
  locationId: { type: String, required: true, unique: true },
  clientId: { type: String, required: true },
  clientSecret: { type: String, required: true },
  accessToken: { type: String, required: true },
  refreshToken: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  refreshed: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model("Token", TokenSchema);
