const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const server = require('http').Server(app);
var amqp = require('amqplib/callback_api');
const controllerSocket = require('./controller/controllerSocket');
var logger = require('morgan');
const config = require('./config');
const cors = require('cors');

const port = process.env.PORT || 8080;
const io = require('socket.io')(server, { cors: { origin: '*' } });

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cors());

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

function startRabbit() {
    amqp.connect(config.RABBITURL, function (err, conn) {
        if (err) {
            console.error("[AMQP]", err.message);
            return setTimeout(start, 1000);
        }
        console.log("[AMQP] connected");
        controllerSocket.whenConnected(conn, io);
    });
}

startRabbit();

app.use(logger('tiny'));
app.get('/', (req, res) => {
    res.json({ "message": "Welcome to DEscord" });
});

require('./routes/routeUser.js')(app);
require('./routes/routeRoom.js')(app);
require('./routes/routeMessage.js')(app);
require('./routes/routeInvitation.js')(app);

server.listen(port, () => {
    console.log("Server is listening on port ", port);
});

