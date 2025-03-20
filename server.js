const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
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
