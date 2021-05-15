

const jwt = require('jsonwebtoken');
const config = require('../config');
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

    socket.on('message', (userid, roomid, message) => {
        if (roomid && message) {
            var json = JSON.stringify({ user: decoded.userId, room: roomid, message });
            console.log("Publish sur exchange", `Room_${roomid}`, message);
            channel.publish(`Room_${roomid}`, '', new Buffer.from(json));
        }
    })
}

exports.whenConnected = (conn, io) => {
    io.on('connection', socket => {
        console.log("New client connected");
        socket.on('authentificate', (auth) => {
            const decoded = jwt.verify(auth, config.JWT_KEY);
            console.log(decoded);

            users = { ...users }
            users[decoded.userId] = 1;
            io.sockets.emit("chatstate", users);
            
            conn.createChannel(function (error1, channel) {
                if (error1) { throw error1; }

                socketHandler(socket, decoded, channel, io);

                channel.consume(`Queue_${decoded.userId}`, function (msg) {
                    if (msg.content) {
                        const { user } = JSON.parse(msg.content);
                        if (user != decoded.userId) {
                            console.log("Message envoyé vers", decoded.userId, " message : ", msg.content.toString());
                            socket.emit('message', decoded.userId, msg.content.toString())
                        }
                    }
                }, { noAck: true });
            });
        });
    })

}
