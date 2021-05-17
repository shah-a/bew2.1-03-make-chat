$(document).ready(() => {
  const socket = io.connect();

  $('#create-user-btn').click((e) => {
    e.preventDefault();
    const username = $('#username-input').val();
    if (username.length > 0) {
      // Emit new `user event` to the server
      socket.emit('new user', username);
      $('.username-form').remove();
    }
  });

  // Socket listeners
  socket.on('new user', (username) => {
    console.log(`${username} has joined the chat! ✋`);
  })
});
