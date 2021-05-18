const controllerSocket = require('./controller/controllerSocket');

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const config = require('./config');
const cors = require('cors');
const server = require('http').Server(app);

var amqp = require('amqplib/callback_api');
var logger = require('morgan');
var fs = require("fs");


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
    process.exit(-1);
});

function startRabbit() {
    amqp.connect(config.RABBITURL, function (err, conn) {
        if (err) {
            console.log("[AMQP]", err.message);
            // return setTimeout(start, 1000);
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

var routePath = "./routes/";
fs.readdirSync(routePath).forEach(function (file) {
    var route = routePath + file;
    require(route)(app);
});

server.listen(port, () => {
    console.log("Server is listening on port ", port);
});

module.exports =  {
    server : server,
    mongoose: mongoose,
};
