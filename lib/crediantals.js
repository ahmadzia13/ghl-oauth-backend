// lib/crediantals.js

// Store tokens per locationId
let tokenStore = {};  

function setTokens(locationId, newTokens) {
  // save tokens with timestamp
  tokenStore[locationId] = {
    tokens: newTokens,
    savedAt: Date.now()
  };
}

function getTokens(locationId) {
  const entry = tokenStore[locationId];
  if (!entry) return null;

  // check if older than 24 hours
  const age = Date.now() - entry.savedAt;
  if (age > 24 * 60 * 60 * 1000) {
    delete tokenStore[locationId]; // expire
    return null;
  }

  return entry.tokens;
}

function isValid(locationId) {
  return getTokens(locationId) !== null;
}

module.exports = {
  setTokens,
  getTokens,
  isValid
};
