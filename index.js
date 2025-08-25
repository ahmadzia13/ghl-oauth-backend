const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const { connectDB } = require("./lib/db");
const initiateAuth = require("./lib/initiate");
const callback = require("./lib/callback");
const { getTokens, isExpired, refreshTokens } = require("./lib/crediantals");

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// POST /initiate to start OAuth
app.post("/initiate", initiateAuth);

// GET /oauth/callback for OAuth callback
app.get("/oauth/callback", callback);

// GET /tokens/:locationId → returns tokens and auto-refreshes if expired
app.get("/tokens/:locationId", async (req, res) => {
  try {
    const { locationId } = req.params;
    let tokenDoc = await getTokens(locationId);

    if (!tokenDoc) return res.status(404).json({ error: "No tokens stored" });

    // auto-refresh if expired
    if (await isExpired(locationId)) {
      tokenDoc = await refreshTokens(locationId);
    }

    res.json({
      tokens: tokenDoc.tokens,
      expiresAt: tokenDoc.tokens.expiresAt,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 App Listening on ${PORT} !`));
