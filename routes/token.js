const express = require("express");
const router = express.Router();
const { getTokens } = require("../lib/auth");

// GET tokens by locationId
router.get("/:locationId", async (req, res) => {
  const { locationId } = req.params;

  try {
    const tokenDoc = await getTokens(locationId);

    if (!tokenDoc) {
      return res.status(404).json({ error: "No tokens stored for this locationId" });
    }

    res.json(tokenDoc.tokens); // ✅ Return stored tokens
  } catch (err) {
    console.error("❌ Error fetching tokens:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
