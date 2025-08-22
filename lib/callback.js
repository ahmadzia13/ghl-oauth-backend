const axios = require("axios");
const qs = require("qs");
const store = require("../store");
const crediantals = require("./crediantals"); // ✅ import

async function callback(req, res) {
  const { clientId, clientSecret } = store.get();
  const code = req.query.code;

  if (!code) return res.status(400).json({ error: "Missing code" });

  const redirectUri = process.env.REDIRECT_URI || "http://localhost:3000/oauth/callback";

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

    console.log("OAuth Response:", response.data);

    const { locationId } = response.data;
    if (!locationId) {
      return res.status(400).json({ error: "locationId missing in response" });
    }

    // save credentials
    crediantals.setTokens(locationId, response.data);

    // ✅ Instead of redirect, show a simple page with instructions
    res.send(`
      <h2>Authorization Successful 🎉</h2>
      <p>Your Location ID: <b>${locationId}</b></p>
      <p>Now go to <a href="/tokens/${locationId}">/tokens/${locationId}</a> to get your credentials (valid for 24h).</p>
    `);
  } catch (err) {
    console.error("OAuth Callback Error:", err.response?.data || err.message);
    res.status(500).json({ error: err.response?.data || err.message });
  }
}

module.exports = callback;
