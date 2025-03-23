// Import required modules
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const fs = require('fs');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');

// Initialize app and server
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: /^https:\/\/(?:.*\.)?adminplayz\.com$/,
    methods: ['GET', 'POST']
  }
});

// Basic security with Helmet
app.use(helmet());

// Logging with Morgan
app.use(morgan('combined'));

// Rate limiting to prevent DDoS attacks (1000 requests per minute)
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 1000,
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/clicks', limiter);

// CORS protection
app.use(cors({
  origin: /^https:\/\/(?:.*\.)?adminplayz\.com$/
}));

// Serve JSON requests
app.use(express.json());

// Define constants
const PORT = process.env.PORT || 3000;
const STORAGE_FILE = './clicks.json';

// Initialize click count with safe read
let clicks = 0;
if (fs.existsSync(STORAGE_FILE)) {
  try {
    const data = JSON.parse(fs.readFileSync(STORAGE_FILE, 'utf8'));
    if (typeof data.clicks === 'number' && data.clicks >= 0) {
      clicks = data.clicks;
    }
  } catch (error) {
    console.error('Error reading storage file:', error);
  }
}

// Save clicks safely
function saveClicks() {
  fs.writeFile(STORAGE_FILE, JSON.stringify({ clicks }), (err) => {
    if (err) {
      console.error('Error writing to storage file:', err);
    }
  });
}

// Routes
app.get('/clicks', (req, res) => {
  res.json({ clicks });
});

app.post('/clicks/increment', (req, res) => {
  clicks += 1;
  saveClicks();
  io.emit('updateClicks', clicks);
  res.json({ clicks });
});

app.post('/clicks/decrement', (req, res) => {
  if (clicks > 0) {
    clicks -= 1;
    saveClicks();
    io.emit('updateClicks', clicks);
  }
  res.json({ clicks });
});

app.post('/clicks/reset', (req, res) => {
  clicks = 0;
  saveClicks();
  io.emit('updateClicks', clicks);
  res.json({ clicks });
});

// WebSocket connection management
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  socket.emit('updateClicks', clicks);

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
