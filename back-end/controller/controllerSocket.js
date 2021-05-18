const jwt = require('jsonwebtoken');
const config = require('../config');
const Message = require('../models/modelMessage');
const User = require('../models/modelUser');

let users = {};

function socketHandler(socket, decoded, channel, io) {
    socket.on('connected', (state) => {
        users = {...users}
        users[decoded.userId] = state;
        io.sockets.emit("chatstate", users);
        if (state === 1) {
            User.findByIdAndUpdate(decoded.userId, {lastDisconnect: Date.now()}, {new: true}).exec();
        }
    });

    socket.on('disconnect', () => {
        users = {...users}
        users[decoded.userId] = 0;
        io.sockets.emit("chatstate", users);
        channel.close();
    });

    socket.on('message', async (userid, roomid, message, idmsg) => {
        if (roomid && message) {
            const data = {
                sender: decoded.userId, roomid, message, idmsg,
            };
            const messdb = new Message(data);
            await messdb.save();

            await channel.publish(`Room_${roomid}`, '', new Buffer.from(JSON.stringify(data)), {
                messageId: idmsg.toString(),
                timestamp: Date.now()
            });
        }
    });

    socket.on('read', async (messageid) => {
        if (messageid) {
            let message = await Message.findOne({idmsg: messageid}).exec();
            if (!message.read.includes(decoded.userId.toString())) {
                message.read = [...message.read, decoded.userId];
                await message.save();
            }
        }
    })

    socket.on('typing', async (state) => {
        io.sockets.emit("typing", decoded.userId, state);
    })
}

exports.whenConnected = (conn, io) => {
    io.on('connection', (socket) => {
        socket.on('authentificate', async (auth) => {
            const decoded = jwt.verify(auth, config.JWT_KEY);

            users = {...users};
            users[decoded.userId] = 1;
            io.sockets.emit('chatstate', users);

            const channel = await conn.createChannel();
            await channel.assertQueue(`Queue_${decoded.userId}`, {durable: true});
            socketHandler(socket, decoded, channel, io);

            await channel.consume(`Queue_${decoded.userId}`, (msg) => {
                if (msg.content) {
                    const {sender} = JSON.parse(msg.content);
                    if (sender !== decoded.userId) {
                        socket.emit(
                            'message', msg.content.toString(),
                            msg.properties.messageId,
                            Date.now() - msg.properties.timestamp,
                        );
                    }
                    channel.ack(msg);
                }
            }, {noAck: false});
        });
    });
};
