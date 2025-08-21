// store.js
let tokens = {};

module.exports = {
  setTokens: (id, data) => {
    tokens[id] = data;
  },
  getTokens: (id) => {
    return tokens[id];
  }
};

// In store.js
const config = require('./config.json');
let store = { ...config, tokens: null };

module.exports = {
  set: (data) => { store = { ...store, ...data }; },
  get: () => store,
  setTokens: (tokens) => { store.tokens = tokens; }
};
