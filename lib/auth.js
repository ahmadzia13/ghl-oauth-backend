const mongoose = require("mongoose");
const Client = require("../models/client");

// --- Define Schema for tokens ---
const tokenSchema = new mongoose.Schema({
  locationId: { type: String, unique: true },
  clientId: { type: String, required: true },
  clientSecret: { type: String, required: true },
  tokens: Object, // full OAuth token response
  createdAt: { type: Date, default: Date.now },
});

// ✅ Prevent OverwriteModelError
const Token = mongoose.models.Token || mongoose.model("Token", tokenSchema);

// --- Save client credentials ---
async function saveClient({ clientId, clientSecret, locationId, companyId }) {
  const client = new Client({ clientId, clientSecret, locationId, companyId });
  await client.save();
  console.log("✅ Client saved:", client);
}

// --- Save tokens ---
async function saveTokens(locationId, tokenData) {
  const { clientId, clientSecret, ...tokens } = tokenData;
  
  const saved = await Token.findOneAndUpdate(
    { locationId },
    { clientId, clientSecret, tokens, createdAt: new Date() },
    { upsert: true, new: true }
  );
  console.log("✅ Tokens saved for location:", locationId);
  return saved;
}

// --- Get tokens by locationId ---
async function getTokens(locationId) {
  const tokenDoc = await Token.findOne({ locationId });
  return tokenDoc ? tokenDoc : null;
}

// --- Get client credentials by locationId ---
async function getClientCredentials(locationId) {
  const tokenDoc = await Token.findOne({ locationId });
  return tokenDoc ? {
    clientId: tokenDoc.clientId,
    clientSecret: tokenDoc.clientSecret
  } : null;
}

module.exports = { saveClient, saveTokens, getTokens, getClientCredentials };
