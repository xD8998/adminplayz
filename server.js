const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;
const filePath = 'clicks.json';

app.use(cors());
app.use(express.json());

// Ensure the clicks file exists
if (!fs.existsSync(filePath)) {
  fs.writeFileSync(filePath, JSON.stringify({ clicks: 0 }));
}

// Load click count from file
const loadClicks = () => {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    const json = JSON.parse(data);
    return json.clicks || 0;
  } catch (error) {
    console.error('Error reading clicks.json:', error);
    return 0;
  }
};

// Save click count to file
const saveClicks = (clicks) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify({ clicks }));
  } catch (error) {
    console.error('Error writing to clicks.json:', error);
  }
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
