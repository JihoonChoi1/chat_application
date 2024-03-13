const express = require('express');
const { chats } = require("./data/data");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const { notFound, errorHandler } = require('./middleware/errorMiddleware');


const app = express();
dotenv.config();
connectDB();

app.use(express.json());


app.get("/", (req, res) => {
  res.send("API is Running");
});

app.get("/api/chat", (req, res) => {
  res.send(chats);
});

app.get('/api/chat/:id', (req, res) => {
  const singleChat = chats.find(c => c._id === req.params.id);
  res.send(singleChat);
})


app.use('/api/user', userRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3000


app.listen(3000, console.log(`Server started on PORT ${PORT}`));