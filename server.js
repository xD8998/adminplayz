const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: /^https:\/\/(?:.*\.)?adminplayz\.com$/,
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 3000;
const STORAGE_FILE = './clicks.json';

// Initialize clicks from storage
let clicks = 0;
try {
  if (fs.existsSync(STORAGE_FILE)) {
    const data = JSON.parse(fs.readFileSync(STORAGE_FILE, 'utf8'));
    clicks = data.clicks || 0;
  }
} catch (error) {
  console.error('Error reading storage file:', error);
}

// Handle CORS using express
app.use(cors({
  origin: /^https:\/\/(?:.*\.)?adminplayz\.com$/,
}));

// Get current click count
app.get('/clicks', (req, res) => {
  res.json({ clicks });
});

// Increment click count and save to file
app.post('/clicks', (req, res) => {
  clicks += 1;
  fs.writeFileSync(STORAGE_FILE, JSON.stringify({ clicks }));
  io.emit('updateClicks', clicks);
  res.json({ clicks });
});

// WebSocket connection
io.on('connection', (socket) => {
  console.log('A user connected');
  socket.emit('updateClicks', clicks);

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
