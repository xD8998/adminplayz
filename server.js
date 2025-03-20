const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: /^https:\/\/(?:.*\.)?adminplayz\.com$/,
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 3000;

// In-memory storage for clicks
let clicks = 0;

// Handle CORS using express
app.use(cors({
  origin: /^https:\/\/(?:.*\.)?adminplayz\.com$/,
}));

// Get current click count
app.get('/clicks', (req, res) => {
  res.json({ clicks });
});

// Increment click count
app.post('/clicks', (req, res) => {
  clicks += 1;
  io.emit('updateClicks', clicks); // Notify all clients
  res.json({ clicks });
});

// WebSocket connection
io.on('connection', (socket) => {
  console.log('A user connected');
  socket.emit('updateClicks', clicks); // Send current count on connection

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
