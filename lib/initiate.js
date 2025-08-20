const configStore = require('../store'); // small file to keep data in memory for now

async function initiateAuth(req, res) {
    const { clientId, clientSecret, scopes } = req.body;

    if (!clientId || !clientSecret) {
        return res.status(400).json({ error: "clientId and clientSecret required" });
    }

    // save them temporarily
    configStore.set({
        clientId,
        clientSecret,
        scopes
    });

    const redirectUri = "http://localhost:3000/oauth/callback";

    const authUrl = `https://services.leadconnectorhq.com/oauth/chooselocation?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join(' ')}`;

    return res.json({ url: authUrl });
}

module.exports = initiateAuth;
