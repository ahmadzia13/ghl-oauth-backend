const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema({
  clientId: { type: String, required: true },
  clientSecret: { type: String, required: true },
  locationId: { type: String, required: true, unique: true },
  companyId: String, // optional
});

const Client = mongoose.models.Client || mongoose.model("Client", clientSchema);
module.exports = Client;