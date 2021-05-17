const http = require('http');
const { join } = require('path');
const express = require('express');
const exphbs = require('express-handlebars');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.use(express.static(join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.render('index.handlebars');
})

io.on("connection", (socket) => {
  console.log("🔌 New user connected! 🔌");
})

server.listen('3000', () => {
  console.log('Server listening on Port 3000');
})
