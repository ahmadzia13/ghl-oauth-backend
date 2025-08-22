const express = require("express");
const path = require("path");
const app = express();
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

const initiateAuth = require("./lib/initiate");
const callback = require("./lib/callback");
const crediantals = require("./lib/crediantals");
const store = require("./store"); // has clientId & clientSecret

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Auto-refresh tokens when expired
app.get("/tokens/:locationId", async (req, res) => {
  const { locationId } = req.params;
  const creds = crediantals.getTokens(locationId);

  if (!creds) {
    return res.status(404).json({ error: "No tokens stored for this locationId" });
  }

  if (crediantals.isExpired(locationId)) {
    try {
      const { clientId, clientSecret } = store.get();
      const newTokens = await crediantals.refreshTokens(locationId, clientId, clientSecret);
      return res.json({ tokens: newTokens, refreshed: true });
    } catch (err) {
      return res.status(500).json({ error: err.response?.data || err.message });
    }
  }

  return res.json({ tokens: creds.tokens, refreshed: false });
});

app.post("/initiate", initiateAuth);
app.get("/oauth/callback", callback);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`App Listening on ${PORT} !`));
