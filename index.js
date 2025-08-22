const express = require("express");
const path = require("path");
const app = express();

app.use(express.json());

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Routes
const initiateAuth = require("./lib/initiate");
const callback = require("./lib/callback");

const crediantals = require("./lib/crediantals");

app.get("/tokens/:locationId", (req, res) => {
  const { locationId } = req.params;

  if (!crediantals.isValid(locationId)) {
    return res.status(401).json({ error: "No valid tokens. Please authenticate again." });
  }

  res.json(crediantals.getTokens(locationId));
});

app.post("/initiate", initiateAuth);
app.get("/oauth/callback", callback);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`App Listening on ${PORT} !`));
