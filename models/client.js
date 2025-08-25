const mongoose = require("mongoose");

const ClientSchema = new mongoose.Schema({
  clientId: String,
  clientSecret: String,
  locationId: { type: String, unique: true },
  tokens: Object   // 👈 so we can store access/refresh tokens
});

// Prevent OverwriteModelError
module.exports = mongoose.models.Client || mongoose.model("Client", ClientSchema);
