const express = require("express");
const path = require("path");
const app = express();

app.use(express.json());

// 👇 Serve static files from public folder
app.use(express.static(path.join(__dirname, "public")));

// If someone visits "/", serve index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Your routes
const initiateAuth = require("./lib/initiate");
const callback = require("./lib/callback");

app.post("/initiate", initiateAuth);
app.get("/oauth/callback", callback);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`App Listening on ${PORT} !`));