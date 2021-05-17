event_handlers = (io, socket, onlineUsers, channels) => {
  socket.on('new user', (username) => {
    // console.log(`${username} has joined the chat! ✋`);
    onlineUsers[username] = socket.id;
    socket["username"] = username;
    // Emit `new user` event to clients
    io.emit('new user', username);
  });

  socket.on('new message', (msg) => {
    // console.log(`${msg.sender}: ${msg.message} 🎤`);
    // Emit `new message` event to clients
    io.emit('new message', msg);
  });

  socket.on('get online users', () => {
    // Emit `get online users` event to clients
    io.emit('get online users', onlineUsers);
  });

  socket.on('disconnect', () => {
    delete onlineUsers[socket.username];
    // Emit `user has left` event to clients
    io.emit('user has left', onlineUsers);
  });

  socket.on('new channel', (newChannel) => {
    // console.log(`New channel: ${newChannel}! 📺`);
    channels[newChannel] = [];
    socket.join(newChannel);
    // Emit `new channel` event to clients
    io.emit('new channel', newChannel);
    // Emit to the client that made the new channel, to change their channel to the one they made.
    socket.emit('user changed channel', {
      channel: newChannel,
      messages: channels[newChannel]
    });
  });
};

module.exports = event_handlers;
