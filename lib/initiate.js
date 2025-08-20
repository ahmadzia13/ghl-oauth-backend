const config = require('../config.json');

async function initiateAuth(req, res) {
  const { clientId, clientSecret, scopes } = req.body;

  if (!clientId || !clientSecret || !scopes) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const redirectUri = "http://localhost:3000/oauth/callback";

  const authUrl = `${config.baseUrl}/oauth/chooselocation?response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&client_id=${clientId}&scope=${scopes.join(" ")}`;

  return res.json({ url: authUrl });
}

module.exports = initiateAuth;
