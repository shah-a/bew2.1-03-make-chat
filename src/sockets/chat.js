module.exports = (io, socket) => {
  socket.on('new user', (username) => {
    // console.log(`${username} has joined the chat! ✋`);
    io.emit('new user', username);
  });

  socket.on('new message', (msg) => {
    // console.log(`${msg.sender}: ${msg.message} 🎤`);
    io.emit('new message', msg);
  });
};
