const axios = require("axios");
const qs = require("qs");
const crediantals = require("./crediantals");
const store = require("../store");

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

    // ✅ extract locationId from the token payload
    const locationId = response.data.locationId || response.data.location_id;

    if (!locationId) {
      return res.status(400).json({ error: "No locationId returned in token response" });
    }

    // ✅ store tokens against that locationId
    crediantals.setTokens(locationId, response.data);

   // ✅ tell user clearly
res.send(`
  <h2>✅ Authentication Successful!</h2>
  <p>Your <b>Location ID</b> is: <code>${locationId}</code></p>
  <p>You can visit this link anytime (valid for 24 hours) to get your credentials:</p>
  <a href="http://localhost:3000/tokens/${locationId}">
    http://localhost:3000/tokens/${locationId}
  </a>
  <p>Thanks 🙌</p>
`);

  } catch (err) {
    console.error("OAuth Callback Error:", err.response?.data || err.message);
    res.status(500).json({ error: err.response?.data || err.message });
  }
}

module.exports = callback;
