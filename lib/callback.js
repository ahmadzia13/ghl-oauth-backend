const axios = require("axios");
const qs = require("qs");
const { setTokens } = require("./crediantals"); // ⬅️ use your file

async function callback(req, res) {
  const code = req.query.code;

  if (!code) return res.status(400).json({ error: "Missing code" });

  const clientId = process.env.CLIENT_ID;
  const clientSecret = process.env.CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return res.status(500).json({ error: "Client credentials not set in .env" });
  }

  const redirectUri =
    process.env.REDIRECT_URI || "http://localhost:3000/oauth/callback";

  const data = qs.stringify({
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: "authorization_code",
    code,
    user_type: "Location",
    redirect_uri: redirectUri,
  });

  try {
    const response = await axios.post(
      "https://services.leadconnectorhq.com/oauth/token",
      data,
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    const locationId = response.data.locationId || response.data.location_id;
    if (!locationId) {
      return res.status(400).json({ error: "No locationId returned in token response" });
    }

    // ✅ save tokens in memory
    setTokens(locationId, response.data);

    res.send(`
      <h2>✅ Authentication Successful!</h2>
      <p>Your <b>Location ID</b> is: <code>${locationId}</code></p>
      <a href="http://localhost:3000/tokens/${locationId}">
        View Tokens
      </a>
    `);
  } catch (err) {
    console.error("OAuth Callback Error:", err.response?.data || err.message);
    res.status(500).json({ error: err.response?.data || err.message });
  }
}

module.exports = callback;
