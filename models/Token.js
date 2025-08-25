// models/Token.js
const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema({
  locationId: { type: String, required: true, unique: true },
  clientId: { type: String, required: true },
  clientSecret: { type: String, required: true },
  tokens: Object,
  createdAt: { type: Date, default: Date.now },
});