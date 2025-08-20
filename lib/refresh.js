const axios = require('axios');
const qs = require('qs');
const store = require('../store');

async function refresh(req, res) {
    const { clientId, clientSecret, refresh_token } = store.getTokens();

    if (!refresh_token) {
        return res.status(400).json({ error: "No refresh token, login again" });
    }

    const data = qs.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'refresh_token',
        refresh_token
    });

    try {
        const response = await axios.post(
            'https://services.leadconnectorhq.com/oauth/token',
            data,
            { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
        );

        // update stored tokens
        store.setTokens(response.data);

        return res.json({ tokens: response.data });
    } catch (err) {
        return res.status(500).json({ error: err.response?.data || err.message });
    }
}

module.exports = refresh;
