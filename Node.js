const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Load click count from file
const loadClicks = () => {
  try {
    const data = fs.readFileSync('clicks.json', 'utf8');
    return JSON.parse(data).clicks;
  } catch (error) {
    return 0;
  }
};

// Save click count to file
const saveClicks = (clicks) => {
  fs.writeFileSync('clicks.json', JSON.stringify({ clicks }));
};

// Get the current click count
app.get('/clicks', (req, res) => {
  const clicks = loadClicks();
  res.json({ clicks });
});

// Increment the click count
app.post('/clicks', (req, res) => {
  let clicks = loadClicks();
  clicks += 1;
  saveClicks(clicks);
  res.json({ clicks });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
