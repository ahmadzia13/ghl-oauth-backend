const axios = require('axios');
const qs = require('qs');
const config = require('../config.json'); // read your stored credentials

async function callback(req, res) {
  const { clientId, clientSecret } = config; // get credentials from config.json
  const code = req.query.code;

  if (!code) return res.status(400).json({ error: "Missing code" });
  if (!clientId || !clientSecret) return res.status(400).json({ error: "Missing client credentials" });

  const redirectUri = process.env.REDIRECT_URI || "http://localhost:3000/oauth/callback";

  const data = qs.stringify({
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: 'authorization_code',
    code,
    redirect_uri: redirectUri
  });

  try {
    const response = await axios.post(
      'https://services.leadconnectorhq.com/oauth/token',
      data,
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );

    // Save tokens (if you have store.js)
    // store.setTokens(response.data);

    return res.json({
      message: "Tokens received successfully",
      tokens: response.data
    });
  } catch (err) {
    return res.status(500).json({ error: err.response?.data || err.message });
  }
}

module.exports = callback;
