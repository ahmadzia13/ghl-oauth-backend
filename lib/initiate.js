const store = require("../store");

async function initiateAuth(req, res) {
  const { clientId, clientSecret, scopes } = req.body;

  if (!clientId || !clientSecret || !scopes) {
    return res.status(400).json({ error: "Missing fields" });
  }

  // Save client credentials in store
  store.set({ clientId, clientSecret });

  // Build the OAuth authorization URL
  const authUrl = `https://services.leadconnectorhq.com/oauth/authorize?response_type=code&client_id=${clientId}&scope=${scopes.join(" ")}&redirect_uri=http://localhost:3000/oauth/callback`;

  res.json({ url: authUrl });
}

module.exports = initiateAuth;
