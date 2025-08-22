let storedTokens = null;

function setTokens(newTokens) {
  storedTokens = {
    ...newTokens,
    created_at: Date.now()
  };
}

function getTokens() {
  return storedTokens;
}

function isValid() {
  if (!storedTokens) return false;
  return Date.now() - storedTokens.created_at < 24 * 60 * 60 * 1000; // 24h
}

module.exports = { setTokens, getTokens, isValid };
