const mongoose = require("mongoose");

// --- Define Schema for clients ---
const clientSchema = new mongoose.Schema({
  clientId: String,
  clientSecret: String,
  locationId: String,
});

// --- Define Schema for tokens ---
const tokenSchema = new mongoose.Schema({
  locationId: { type: String, unique: true },
  tokens: Object, // full OAuth token response
  createdAt: { type: Date, default: Date.now },
});

// ✅ Prevent OverwriteModelError
const Client = mongoose.models.Client || mongoose.model("Client", clientSchema);
const Token = mongoose.models.Token || mongoose.model("Token", tokenSchema);

// --- Save client credentials ---
async function saveClient({ clientId, clientSecret, locationId }) {
  const client = new Client({ clientId, clientSecret, locationId });
  await client.save();
  console.log("✅ Client saved:", client);
}

// --- Save tokens ---
async function saveTokens(locationId, tokens) {
  const saved = await Token.findOneAndUpdate(
    { locationId },
    { tokens, createdAt: new Date() },
    { upsert: true, new: true }
  );
  console.log("✅ Tokens saved for location:", locationId);
  return saved;
}

// --- Get tokens by locationId ---
async function getTokens(locationId) {
  const tokenDoc = await Token.findOne({ locationId });
  return tokenDoc ? tokenDoc.tokens : null;
}

module.exports = { saveClient, saveTokens, getTokens };
