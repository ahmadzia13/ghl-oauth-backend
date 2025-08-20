let creds = {};
let tokens = {};

module.exports = {
    set: (data) => { creds = data; },
    get: () => creds,

    setTokens: (data) => { tokens = { ...creds, ...data }; },
    getTokens: () => tokens
};
