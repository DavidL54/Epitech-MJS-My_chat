const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const server = require('http').Server(app);
var amqp = require('amqplib/callback_api');
const jwt = require('jsonwebtoken');

const port = process.env.PORT || 8080;

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
const cors = require('cors');
app.use(cors());
var logger = require('morgan');

const config = require('./config');
const controllerRabbit = require('./controller/controllerRabbit');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

mongoose.connect(config.DBHost, {
    useNewUrlParser: true
}).then(() => {
    console.log("Successfully connected to the database");
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});

app.use(logger('tiny'));
app.get('/', (req, res) => {
    res.json({ "message": "Welcome to DEscord" });
});

function start() {
    amqp.connect('amqp://rabbitmq:5672?heartbeat=60', function (err, conn) {
        if (err) {
            console.error("[AMQP]", err.message);
            return setTimeout(start, 1000);
        }
        console.log("[AMQP] connected");
        whenConnected(conn);
    });
}

function whenConnected(conn) {
    io.on('connection', socket => {
        console.log("New client connected");

        socket.on('authentificate', (auth) => {
            const decoded = jwt.verify(auth, config.JWT_KEY);
            console.log(decoded);
        
            conn.createChannel(function (error1, channel) {
                if (error1) { throw error1; }

                socket.on('connected', (state) => {
                    console.log("ca se connecte");
                    console.log(state);
                });

                socket.on('disconnect', () => {
                    console.log('Got disconnect!');
                    channel.close();
                });

                socket.on('message', (userid, roomid, message) => {
                    if (roomid && message) {
                        var json = JSON.stringify({ user: decoded.userId, room: roomid, message });
                        console.log("Publish sur exchange", `Room_${roomid}`, message);
                        channel.publish(`Room_${roomid}`, '', new Buffer.from(json));
                    }
                })

                channel.consume(`Queue_${decoded.userId}`, function (msg) {
                    if (msg.content) {
                        const { user} = JSON.parse(msg.content);
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

start();


const io = require('socket.io')(server, { cors: { origin: '*' }});
// app.set("io", io)
//require('./middleware/mySocket.js')(io, amqpConn);
require('./routes/routeUser.js')(app);
require('./routes/routeRoom.js')(app);


server.listen(port, () => {
    console.log("Server is listening on port ", port);
});

