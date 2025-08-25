const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const { connectDB } = require("./lib/db");
const { initiateAuth } = require("./lib/initiate");
const callback = require("./lib/callback");
const { getTokens, isExpired, refreshTokens } = require("./lib/crediantals");
const { getTokens: getTokensFromDB } = require("./lib/auth");
const refresh = require("./lib/refresh");
const clients = require("./routes/clients");

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// POST /initiate to start OAuth
app.post("/initiate", initiateAuth);

// GET /oauth/callback for OAuth callback
app.get("/oauth/callback", callback);

// POST /refresh to refresh tokens
app.post("/refresh", refresh);

// Client management routes
app.use("/clients", clients);

// GET /tokens/:locationId → returns tokens and auto-refreshes if expired
app.get("/tokens/:locationId", async (req, res) => {
  try {
    const { locationId } = req.params;
    
    // Get tokens from database
    const tokenDoc = await getTokensFromDB(locationId);

    if (!tokenDoc) return res.status(404).json({ error: "No tokens stored" });

    let tokens = tokenDoc.tokens;
    
    // auto-refresh if expired
    if (isExpired(locationId)) {
      const refreshedTokenDoc = await refreshTokens(locationId);
      tokens = refreshedTokenDoc.tokens;
    } else {
      // Get tokens from memory if not expired
      const memoryTokens = getTokens(locationId);
      if (memoryTokens) {
        tokens = memoryTokens.tokens;
      }
    }

    res.json({
      tokens: tokens,
      expiresAt: tokens.expiresAt,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 App Listening on ${PORT} !`));
