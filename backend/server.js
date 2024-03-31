const express = require('express');
const { chats } = require("./data/data");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const { notFound, errorHandler } = require('./middleware/errorMiddleware');


const app = express();
dotenv.config();
connectDB();

app.use(express.json());


app.get("/", (req, res) => {
  res.send("API is Running");
});

app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/message', messageRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3000


app.listen(3000, console.log(`Server started on PORT ${PORT}`));