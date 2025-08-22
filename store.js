const config = require("./config.json");

let store = {
  baseUrl: config.baseUrl,
  clients: config.clients,
  tokens: {} // store tokens per client
};

module.exports = {
  getClient: (name) => store.clients[name],
  setTokens: (name, tokens) => { store.tokens[name] = tokens; },
  getTokens: (name) => store.tokens[name] || {},
  getAllTokens: () => store.tokens
};
