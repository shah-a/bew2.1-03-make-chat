module.exports = (io, socket, onlineUsers) => {
  socket.on('new user', (username) => {
    // console.log(`${username} has joined the chat! ✋`);
    onlineUsers[username] = socket.id;
    socket["username"] = username;
    io.emit('new user', username);
  });

  socket.on('new message', (msg) => {
    // console.log(`${msg.sender}: ${msg.message} 🎤`);
    io.emit('new message', msg);
  });

  socket.on('get online users', () => {
    io.emit('get online users', onlineUsers);
  });

  socket.on('disconnect', () => {
    delete onlineUsers[socket.username];
    io.emit('user has left', onlineUsers);
  });
};
