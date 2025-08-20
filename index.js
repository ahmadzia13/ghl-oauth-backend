const express = require('express');
const path = require('path');

const app = express();

// Middleware to parse JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (your index.html)
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.post('/initiate', require('./lib/initiate'));
app.get('/refresh', require('./lib/refresh'));
app.get('/oauth/callback', require('./lib/callback'));

app.listen(process.env.PORT || 3000, () => {
  console.log("App Listening on port", process.env.PORT || 3000);
});
