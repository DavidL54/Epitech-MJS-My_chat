const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  socket.on('chat', msg => {
    console.log(msg);
    io.emit('chat', msg);
    io.emit('chat receiver', msg);
  });
});

http.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
