const config = require('../config.json');
const crypto = require('crypto');

// In-memory storage for pending OAuth flows
const pendingFlows = {};

async function initiateAuth(req, res) {
  const { clientId, clientSecret, scopes } = req.body;

  if (!clientId || !clientSecret || !scopes) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Generate a unique state parameter to track this OAuth flow
  const state = crypto.randomBytes(16).toString('hex');
  
  // Store client credentials with the state key
  pendingFlows[state] = {
    clientId,
    clientSecret,
    createdAt: Date.now()
  };

  // Clean up old pending flows (older than 1 hour)
  const oneHourAgo = Date.now() - 60 * 60 * 1000;
  Object.keys(pendingFlows).forEach(key => {
    if (pendingFlows[key].createdAt < oneHourAgo) {
      delete pendingFlows[key];
    }
  });

  // Use Railway domain in production, fallback to localhost for dev
  const redirectUri = process.env.REDIRECT_URI || "http://localhost:3000/oauth/callback";

  const authUrl = `${config.baseUrl}/oauth/chooselocation?response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&client_id=${clientId}&scope=${scopes.join(" ")}&state=${state}`;

  return res.json({ url: authUrl });
}

// Export the pendingFlows for use in callback
module.exports = { initiateAuth, pendingFlows };