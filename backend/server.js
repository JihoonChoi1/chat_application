const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const messageRoutes = require('./routes/messageRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

dotenv.config({ path: path.join(__dirname, '.env') });
connectDB();

const app = express();

app.use(express.json());

app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/message', messageRoutes);

const rootDir = path.resolve();

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(rootDir, 'frontend', 'dist')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(rootDir, 'frontend', 'dist', 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send('API is Running');
  });
}

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 8000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

const server = app.listen(PORT, () => console.log(`Server started on PORT ${PORT}`));

const io = require('socket.io')(server, {
  pingTimeout: 60000,
  cors: {
    origin: CLIENT_URL,
  },
});

io.on('connection', (socket) => {
  socket.on('setup', (userData) => {
    socket.join(userData._id);
    socket.emit('connected');
  });

  socket.on('join chat', (room) => {
    socket.join(room);
  });

  socket.on('typing', (room) => socket.in(room).emit('typing'));
  socket.on('stop typing', (room) => socket.in(room).emit('stop typing'));

  socket.on('new message', (newMessageReceived) => {
    const chat = newMessageReceived.chat;
    if (!chat.users) {
      return console.log('chat.users not defined');
    }
    chat.users.forEach((user) => {
      if (user._id === newMessageReceived.sender._id) {
        return;
      }
      socket.in(user._id).emit('message received', newMessageReceived);
    });
  });

  socket.on('disconnect', () => {
    socket.removeAllListeners();
  });
});
