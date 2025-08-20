const express = require('express');
const app = express();
const path = require('path');

// Serve HTML from "public" folder
app.use(express.static(path.join(__dirname, 'public')));

app.get('/initiate', require('./lib/initiate'));
app.get('/refresh', require('./lib/refresh'));
app.get('/oauth/callback', require('./lib/callback'));

app.listen(process.env.PORT || 3000, () => {
    console.log("App Listening on port", process.env.PORT || 3000);
});
