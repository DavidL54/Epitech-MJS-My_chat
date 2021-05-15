

const jwt = require('jsonwebtoken');
const config = require('../config');
var users = {};

function makeRandomId(length) {
    var result = [];
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result.push(characters.charAt(Math.floor(Math.random() *
            charactersLength)));
    }
    return result.join('');
}

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

    socket.on('message', (userid, roomid, message) => {
        if (roomid && message) {
            var json = JSON.stringify({ sender: decoded.userId, roomid, message });
            console.log("Publish sur exchange", `Room_${roomid}`, message);
            channel.publish(`Room_${roomid}`, '', new Buffer.from(json), { messageId: makeRandomId(10) });
        }
    })
}

exports.whenConnected = (conn, io) => {
    io.on('connection', socket => {
        console.log("New client connected");
        socket.on('authentificate', async (auth) => {
            const decoded = jwt.verify(auth, config.JWT_KEY);
            console.log(decoded);

            users = { ...users }
            users[decoded.userId] = 1;
            io.sockets.emit("chatstate", users);

            const channel = await conn.createChannel();
            await channel.assertQueue(`Queue_${decoded.userId}`, { durable: true });
            socketHandler(socket, decoded, channel, io);
            
            await channel.consume(`Queue_${decoded.userId}`, (msg) => {
                if (msg.content) {
                    const { sender } = JSON.parse(msg.content);
                    console.log(msg);
                    if (sender != decoded.userId) {
                        console.log("Message envoyé vers", decoded.userId, " message : ", msg.content.toString());
                        socket.emit('message', msg.content.toString(), msg.messageId);
                    }
                    channel.ack(msg)
                }
            }, { noAck: false });
        
        
        });
    })

}
