const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

// Define a regex to match allowed origins (adminplayz.com and subdomains)
const allowedOriginRegex = /^https:\/\/(?:.*\.)?adminplayz\.com$/;

app.use(cors({
  origin: function (origin, callback) {
    // For non-browser requests (or if no origin is provided), you may allow them.
    if (!origin) return callback(null, true);

    if (allowedOriginRegex.test(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));

app.use(express.json());

// In-memory storage for clicks
let clicks = 0;

// Get the current click count
app.get('/clicks', (req, res) => {
  res.json({ clicks });
});

// Increment the click count
app.post('/clicks', (req, res) => {
  clicks += 1;
  res.json({ clicks });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
