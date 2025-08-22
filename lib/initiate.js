const config = require("../config.json");

async function initiateAuth(req, res) {
  let { client, scopes } = req.body || {};

  // ✅ fallback to default client if none provided
  if (!client || !config.clients[client]) {
    client = "A"; // default client
  }

  // ✅ fallback to default scopes if none provided
  if (!scopes || !Array.isArray(scopes) || scopes.length === 0) {
    scopes = ["locations.read"]; // pick your default scopes here
  }

  const redirectUri =
    process.env.REDIRECT_URI || "http://localhost:3000/oauth/callback";

  const { clientId } = config.clients[client];

  const authUrl = `${config.baseUrl}/oauth/chooselocation?response_type=code&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&client_id=${clientId}&scope=${scopes.join(" ")}&state=${client}`;

  return res.json({ url: authUrl });
}

module.exports = initiateAuth;
