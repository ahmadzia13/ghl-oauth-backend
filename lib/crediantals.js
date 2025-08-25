const axios = require("axios");
const qs = require("qs");

let tokensStore = {}; // { locationId: { tokens, expiresAt, refreshed } }

function setTokens(locationId, tokens, refreshed = 0) {
 tokensStore[locationId] = {
  tokens,
  expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours from now
  refreshed: tokensStore[locationId]?.refreshed ? tokensStore[locationId].refreshed + 1 : 0,
  
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

  const { refresh_token, refreshed = 0 } = entry.tokens;
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

  setTokens(locationId, response.data, refreshed + 1); // update tokens + increment refreshed
  console.log(`✅ Auto-refreshed tokens for ${locationId} (count: ${refreshed + 1})`);

  return tokensStore[locationId];
}

module.exports = {
  setTokens,
  getTokens,
  isExpired,
  refreshTokens,
};
