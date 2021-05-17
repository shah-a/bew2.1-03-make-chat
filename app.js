const express = require('express');
const exphbs  = require('express-handlebars');
const { Server } = require('http');

const app = express();
const server = Server(app);

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.get('/', (req, res) => {
  res.render('index.handlebars');
})

server.listen('3000', () => {
  console.log('Server listening on Port 3000');
})
