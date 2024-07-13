const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors()); // Enable CORS for all routes

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*', // Allow all origins
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
    credentials: true,
  }
});

const PORT = process.env.PORT || 3000;

let rooms = {};

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('createRoom', () => {
    const roomId = Math.random().toString(36).substring(2, 7); // Generate a random room ID
    rooms[roomId] = { players: [socket.id] };
    socket.join(roomId);
    socket.emit('roomCreated', roomId);
  });

  socket.on('joinRoom', (roomId) => {
    if (rooms[roomId] && rooms[roomId].players.length === 1) {
      rooms[roomId].players.push(socket.id);
      socket.join(roomId);
      io.in(roomId).emit('startGame', roomId);
    } else {
      socket.emit('roomFull');
    }
  });

  socket.on('move', (data) => {
    const { roomId, board, isXNext } = data;
    io.in(roomId).emit('moveMade', { board, isXNext });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
    // Handle room cleanup if needed
  });
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
