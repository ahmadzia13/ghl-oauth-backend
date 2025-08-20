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
