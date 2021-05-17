$(document).ready(() => {
  const socket = io.connect();
  socket.emit('get online users');
  socket.emit('get existing channels');

  // Set "General" as default channel, and enable channel-switching
  socket.emit('user changed channel', 'General');
  $(document).on('click', '.channel', (e) => {
    const newChannel = e.target.textContent;
    socket.emit('user changed channel', newChannel);
  });

  let currentUser;

  $('#create-user-btn').click((e) => {
    e.preventDefault();
    const username = $('#username-input').val();
    if (username.length > 0) {
      currentUser = username;
      // Emit new `user event` to the server
      socket.emit('new user', username);
      $('.username-form').remove();
      // Make the main page visible
      $('.main-container').css('display', 'flex');
    }
  });

  $('#send-chat-btn').click((e) => {
    e.preventDefault();
    const channel = $('.channel-current').text();
    const message = $('#chat-input').val();
    if (message.length > 0) {
      // Emit `new message` event to the server
      socket.emit('new message', {
        sender: currentUser,
        message: message,
        channel: channel
      });
      $('#chat-input').val("");
    }
  });

  $('#new-channel-btn').click(() => {
    const newChannel = $('#new-channel-input').val();
    if (newChannel.length > 0) {
      // Emit `new channel` event to the server
      socket.emit('new channel', newChannel);
      $('#new-channel-input').val("");
    }
  });

  // Socket listeners
  socket.on('new user', (username) => {
    // console.log(`${username} has joined the chat! ✋`);
    // Add the new user to the online users div
    $('.users-online').append(`<div class="user-online">${username}</div>`);
  })

  socket.on('new message', (msg) => {
    // console.log(`${msg.sender}: ${msg.message} 🎤`);
    // Append new message for all sockets to see
    const currentChannel = $('.channel-current').text();
    if (currentChannel === msg.channel) {
      $('.message-container').append(`
      <div class="message">
        <p class="message-user">${msg.sender}: </p>
        <p class="message-text">${msg.message}</p>
      </div>
    `);
    }
  });

  socket.on('get online users', (onlineUsers) => {
    for (username in onlineUsers) {
      $('.users-online').append(`<div class="user-online">${username}</div>`);
    }
  });

  socket.on('get existing channels', (channels) => {
    for (channel in channels) {
      if (channel === "General") {
        continue;
      }
      $('.channels').append(`<div class="channel">${channel}</div>`);
    }
  });

  socket.on('user has left', (onlineUsers) => {
    $('.users-online').empty();
    for (username in onlineUsers) {
      $('.users-online').append(`<div class="user-online">${username}</div>`);
    }
  });

  socket.on('new channel', (newChannel) => {
    $('.channels').append(`<div class="channel">${newChannel}</div>`);
  });

  socket.on('user changed channel', (data) => {
    $('.channel-current').addClass('channel');
    $('.channel-current').removeClass('channel-current');
    $(`.channel:contains('${data.channel}')`).addClass('channel-current');
    $('.channel-current').removeClass('channel');
    $('.message').remove();
    data.messages.forEach((message) => {
      $('.message-container').append(`
      <div class="message">
        <p class="message-user">${message.sender}: </p>
        <p class="message-text">${message.message}</p>
      </div>
      `);
    });
  });
});
