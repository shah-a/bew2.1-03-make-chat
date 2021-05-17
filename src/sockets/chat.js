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
    channels[msg.channel].push({ sender: msg.sender, message: msg.message });
    // Emit `new message` event to clients in `msg.channel`
    io.to(msg.channel).emit('new message', msg);
  });

  socket.on('get online users', () => {
    // Emit `get online users` event to the new client
    socket.emit('get online users', onlineUsers);
  });

  socket.on('get existing channels', () => {
    // Emit `get existing channels` event to the new client
    socket.emit('get existing channels', channels);
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

  socket.on('user changed channel', (newChannel) => {
    socket.join(newChannel);
    socket.emit('user changed channel', {
      channel: newChannel,
      messages: channels[newChannel]
    });
  });
};

module.exports = event_handlers;
