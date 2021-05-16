const jwt = require('jsonwebtoken');
const config = require('../config');
const Message = require('../models/modelMessage');

var users = {};

function socketHandler(socket, decoded, channel, io) {
    socket.on('connected', (state) => {
        users = { ...users }
        users[decoded.userId] = state;
        console.log("chatstate");
        io.sockets.emit("chatstate", users);
    });

    socket.on('disconnect', () => {
        console.log('Got disconnect!');
        users = { ...users }
        users[decoded.userId] = 0;
        io.sockets.emit("chatstate", users);
        channel.close();
    });

    socket.on('message', async (userid, roomid, message, idmsg) => {
        if (roomid && message) {

            var data = { sender: decoded.userId, roomid, message, idmsg };
            const messdb = new Message(data);
            await messdb.save();

            console.log("Publish sur exchange", `Room_${roomid}`, message);
            await channel.publish(`Room_${roomid}`, '', new Buffer.from(JSON.stringify(data)), { messageId: idmsg.toString(), timestamp: Date.now() });
        }
    })

    socket.on('typing', async (state) => {
        io.sockets.emit("typing", decoded.userId, state);
    })
}

exports.whenConnected = (conn, io) => {
    io.on('connection', socket => {
        console.log("New client connected");
        socket.on('authentificate', async (auth) => {
            const decoded = jwt.verify(auth, config.JWT_KEY);

            users = { ...users }
            users[decoded.userId] = 1;
            io.sockets.emit("chatstate", users);

            const channel = await conn.createChannel();
            await channel.assertQueue(`Queue_${decoded.userId}`, { durable: true });
            socketHandler(socket, decoded, channel, io);
            
            await channel.consume(`Queue_${decoded.userId}`, (msg) => {
                console.log(msg.properties.timestamp);
                if (msg.content) {
                    const { sender } = JSON.parse(msg.content);
                    if (sender != decoded.userId) {
                        console.log("Message envoyé vers", decoded.userId, " message : ", msg.content.toString());
                        socket.emit(
                            'message', msg.content.toString(),
                            msg.properties.messageId,
                            Date.now() - msg.properties.timestamp
                        );
                    }
                    channel.ack(msg)
                }
            }, { noAck: false });
        
        
        });
    })

}
