const jwt = require('jsonwebtoken');
const config = require('../config');
const Message = require('../models/modelMessage');

let users = {};

function socketHandler(socket, decoded, channel, io) {
  socket.on('connected', (state) => {
    users = { ...users };
    users[decoded.userId] = state;
    io.sockets.emit('chatstate', users);
  });

  socket.on('disconnect', () => {
    users = { ...users };
    users[decoded.userId] = 0;
    io.sockets.emit('chatstate', users);
    channel.close();
  });

  socket.on('message', async (userid, roomid, message, idmsg) => {
    if (roomid && message) {
      const data = {
        sender: decoded.userId, roomid, message, idmsg,
      };
      const messdb = new Message(data);
      await messdb.save();

      await channel.publish(`Room_${roomid}`, '', new Buffer.from(JSON.stringify(data)), { messageId: idmsg.toString(), timestamp: Date.now() });
    }
  });

  socket.on('typing', async (state) => {
    io.sockets.emit('typing', decoded.userId, state);
  });
}

exports.whenConnected = (conn, io) => {
  io.on('connection', (socket) => {
    socket.on('authentificate', async (auth) => {
      const decoded = jwt.verify(auth, config.JWT_KEY);

      users = { ...users };
      users[decoded.userId] = 1;
      io.sockets.emit('chatstate', users);

      const channel = await conn.createChannel();
      await channel.assertQueue(`Queue_${decoded.userId}`, { durable: true });
      socketHandler(socket, decoded, channel, io);

      await channel.consume(`Queue_${decoded.userId}`, (msg) => {
        if (msg.content) {
          const { sender } = JSON.parse(msg.content);
          if (sender !== decoded.userId) {
            socket.emit(
              'message', msg.content.toString(),
              msg.properties.messageId,
              Date.now() - msg.properties.timestamp,
            );
          }
          channel.ack(msg);
        }
      }, { noAck: false });
    });
  });
};
