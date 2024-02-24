const express = require('express');

const app = express();

app.get('/', (req, res) => {
  res.send("API is Running");
})

app.get()

app.listen(3000, console.log("Server started on PORT 3000"));