const axios = require("axios");
const qs = require("qs");

let tokensStore = {}; // { locationId: { tokens, expiresAt } }

function setTokens(locationId, tokens) {
  // set expiry (24h from now)
  tokensStore[locationId] = {
    tokens,
   expiresAt: Date.now() + 24 * 60 * 60 * 1000,
  };
}

function getTokens(locationId) {
  return tokensStore[locationId];
}

function isExpired(locationId) {
  const entry = tokensStore[locationId];
  if (!entry) return true;
  return Date.now() > entry.expiresAt;
}

// refresh with refresh_token
async function refreshTokens(locationId, clientId, clientSecret) {
  const entry = tokensStore[locationId];
  if (!entry) throw new Error("No tokens stored for this locationId");

  const { refresh_token } = entry.tokens;
  if (!refresh_token) throw new Error("No refresh_token available");

  const data = qs.stringify({
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: "refresh_token",
    refresh_token,
  });

  const response = await axios.post(
    "https://services.leadconnectorhq.com/oauth/token",
    data,
    { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
  );

  setTokens(locationId, response.data); // update with new tokens
  return response.data;
}

module.exports = {
  setTokens,
  getTokens,
  isExpired,
  refreshTokens,
};
