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
app.set('views', join(__dirname, 'views'));

app.use(express.static(join(__dirname, 'static')));

app.get('/', (req, res) => {
  res.render('home');
})

const onlineUsers = {};
const channels = { "General": [] };

io.on("connection", (socket) => {
  // console.log("🔌 New user connected! 🔌");
  require('./sockets/chat')(io, socket, onlineUsers, channels);
})

server.listen('3000', () => {
  console.log('Server listening on Port 3000');
})
