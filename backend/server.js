// backend/server.js
const express = require('express');
const http = require('http');
const cors = require('cors');
const dotenv = require('dotenv');
const { Server } = require('socket.io');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to Database and start server
const startServer = async () => {
  await connectDB();
  
  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

const app = express();
const server = http.createServer(app);

// Setup Socket.IO
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

app.set('io', io); // so routes can access io

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Socket.IO Connection Logic
require('./socket')(io);

// Routes mounting
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/opportunities', require('./routes/opportunities'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/connections', require('./routes/connections'));
app.use('/api/contact-requests', require('./routes/contactRequests'));

// Basic route
app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;

startServer();
