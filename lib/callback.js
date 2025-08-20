const axios = require('axios');
const qs = require('qs');
const store = require('../store');

async function callback(req, res) {
    const { clientId, clientSecret } = store.get();
    const code = req.query.code;

    if (!code) return res.status(400).json({ error: "Missing code" });

    const redirectUri = process.env.REDIRECT_URI || "http://localhost:3000/oauth/callback";

    const data = qs.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'authorization_code',
        code,
        user_type: 'Location',
        redirect_uri: redirectUri
    });

    try {
        const response = await axios.post(
            'https://services.leadconnectorhq.com/oauth/token',
            data,
            { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
        );

        // save refresh_token
        store.setTokens(response.data);

        return res.json({ tokens: response.data });
    } catch (err) {
        return res.status(500).json({ error: err.response?.data || err.message });
    }
}

module.exports = callback;
