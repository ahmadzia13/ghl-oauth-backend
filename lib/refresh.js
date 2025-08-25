const axios = require('axios');
const qs = require('qs');
const { getTokens } = require('./auth');

async function refresh(req, res) {
    const { locationId } = req.body;
    
    if (!locationId) {
        return res.status(400).json({ error: "Missing locationId" });
    }
    
    // Get tokens and client credentials from database
    const tokenDoc = await getTokens(locationId);
    
    if (!tokenDoc || !tokenDoc.tokens) {
        return res.status(400).json({ error: "No tokens found for this location, login again" });
    }
    
    const { refresh_token } = tokenDoc.tokens;
    const { clientId, clientSecret } = tokenDoc;
    
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

        // Update stored tokens in database
        const { saveTokens } = require('./auth');
        await saveTokens(locationId, {
            ...response.data,
            clientId,
            clientSecret
        });

        return res.json({ tokens: response.data });
    } catch (err) {
        return res.status(500).json({ error: err.response?.data || err.message });
    }
}

module.exports = refresh;
