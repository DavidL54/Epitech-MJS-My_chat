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

const buffer = [];
let connection = null;
let channel = null;

/*const connectRabbitMq = () => {
    amqp.connect('amqp://rabbitmq:5672', function (err, conn) {
        console.log("ca passe ici")
        if (err) {
            console.log(err);
            console.error(err);
            console.log('[AMQP] reconnecting in 1s');
            setTimeout(connectRabbitMq, 1000);
            return;
        }
       conn.createChannel((err, ch) => {
            if (!err) {
                console.log('Channel created');
                channel = ch;
                connection = conn;
                console.log(conn);
                while (buffer.length > 0) {
                    const request = buffer.pop();
                    request();
                }
            }
        });

        conn.once("error", function (err) {
            channel = null;
            connection = null;

            if (err.message !== "Connection closing") {
                console.error("[AMQP] conn error", err.message);
            }
        });

        conn.once("close", function () {
            channel = null;
            connection = null;

            console.error("[AMQP] reconnecting");
            connectRabbitMq();
        });
    })
};

connectRabbitMq()*/

var amqpConn = null;
function start() {
    amqp.connect('amqp://rabbitmq:5672?heartbeat=60', function (err, conn) {
        if (err) {
            console.error("[AMQP]", err.message);
            return setTimeout(start, 1000);
        }
        conn.on("error", function (err) {
            if (err.message !== "Connection closing") {
                console.error("[AMQP] conn error", err.message);
            }
        });
        conn.on("close", function () {
            console.error("[AMQP] reconnecting");
            return setTimeout(start, 1000);
        });

        console.log("[AMQP] connected");
        amqpConn = conn;

        whenConnected(conn);
    });
}

function whenConnected(conn) {
    io.on('connection', socket => {
        const { token } = socket.handshake.query;
        console.log("New client connected");
        if (token) {
            const decoded = jwt.verify(token, config.JWT_KEY);
            console.log(decoded);
            socket.on('message', (message) => {
                console.log("Message :", message, "de", decoded.email);
            })
        }

        /*conn.createChannel((err, ch) => {
            if (!err) {
                console.log('Channel created');
            }
        });*/
    })
}

function startPublisher() {
    amqpConn.createConfirmChannel(function (err, ch) {
        if (closeOnErr(err)) return;
        ch.on("error", function (err) {
            console.error("[AMQP] channel error", err.message);
        });
        ch.on("close", function () {
            console.log("[AMQP] channel closed");
        });

        pubChannel = ch;
        while (true) {
            var m = offlinePubQueue.shift();
            if (!m) break;
            publish(m[0], m[1], m[2]);
        }
    });
}

// method to publish a message, will queue messages internally if the connection is down and resend later
function publish(exchange, routingKey, content) {
    try {
        pubChannel.publish(exchange, routingKey, content, { persistent: true },
            function (err, ok) {
                if (err) {
                    console.error("[AMQP] publish", err);
                    offlinePubQueue.push([exchange, routingKey, content]);
                    pubChannel.connection.close();
                }
            });
    } catch (e) {
        console.error("[AMQP] publish", e.message);
        offlinePubQueue.push([exchange, routingKey, content]);
    }
}

// A worker that acks messages only if processed succesfully
function startWorker() {
    amqpConn.createChannel(function (err, ch) {
        if (closeOnErr(err)) return;
        ch.on("error", function (err) {
            console.error("[AMQP] channel error", err.message);
        });
        ch.on("close", function () {
            console.log("[AMQP] channel closed");
        });
        ch.prefetch(10);
        ch.assertQueue("jobs", { durable: true }, function (err, _ok) {
            if (closeOnErr(err)) return;
            ch.consume("jobs", processMsg, { noAck: false });
            console.log("Worker is started");
        });

        function processMsg(msg) {
            work(msg, function (ok) {
                try {
                    if (ok)
                        ch.ack(msg);
                    else
                        ch.reject(msg, true);
                } catch (e) {
                    closeOnErr(e);
                }
            });
        }
    });
}

function work(msg, cb) {
    console.log("Got msg", msg.content.toString());
    cb(true);
}

function closeOnErr(err) {
    if (!err) return false;
    console.error("[AMQP] error", err);
    amqpConn.close();
    return true;
}

/*setInterval(function () {
    publish("", "jobs", new Buffer("work work work"));
}, 1000);*/

start();


const io = require('socket.io')(server, { cors: { origin: '*' }});
// app.set("io", io)
require('./middleware/mySocket.js')(io, amqpConn);
require('./routes/routeUser.js')(app);
require('./routes/routeRoom.js')(app);


server.listen(port, () => {
    console.log("Server is listening on port ", port);
});

