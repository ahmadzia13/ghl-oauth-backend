const express = require("express");
const router = express.Router();
const Client = require("../models/client");

// GET all clients
router.get("/", async (req, res) => {
  try {
    const clients = await Client.find({}, { clientId: 1, locationId: 1, companyId: 1 });
    res.json(clients);
  } catch (err) {
    console.error("Error fetching clients:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET a specific client by locationId
router.get("/:locationId", async (req, res) => {
  try {
    const { locationId } = req.params;
    const client = await Client.findOne({ locationId });
    
    if (!client) {
      return res.status(404).json({ error: "Client not found" });
    }
    
    res.json(client);
  } catch (err) {
    console.error("Error fetching client:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// POST create a new client (for testing purposes)
router.post("/", async (req, res) => {
  try {
    const { clientId, clientSecret, locationId, companyId } = req.body;
    
    // Check if client already exists
    const existingClient = await Client.findOne({ 
      $or: [
        { locationId },
        { clientId }
      ]
    });
    
    if (existingClient) {
      return res.status(400).json({ error: "Client with this locationId or clientId already exists" });
    }
    
    const client = new Client({ clientId, clientSecret, locationId, companyId });
    await client.save();
    
    res.status(201).json(client);
  } catch (err) {
    console.error("Error creating client:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// DELETE a client by locationId
router.delete("/:locationId", async (req, res) => {
  try {
    const { locationId } = req.params;
    const client = await Client.findOneAndDelete({ locationId });
    
    if (!client) {
      return res.status(404).json({ error: "Client not found" });
    }
    
    res.json({ message: "Client deleted successfully" });
  } catch (err) {
    console.error("Error deleting client:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
