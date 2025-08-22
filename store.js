const config = require('./config.json');

let store = { 
  ...config, 
  tokens: null 
};

module.exports = {
  set: (data) => { 
    store = { ...store, ...data }; 
  },
  get: () => store,
  setTokens: (tokens) => { 
    store.tokens = tokens; 
  },
  getTokens: () => store.tokens || {}, 
  getCredentials: () => ({
    clientId: store.clientId,
    clientSecret: store.clientSecret
  })
};