const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const server = require('http').Server(app)
const io = require('socket.io')(server)

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


// app.set("io", io)
require('./middleware/mySocket.js')(io);
require('./routes/routeUser.js')(app);
require('./routes/routeRoom.js')(app);


server.listen(port, () => {
    console.log("Server is listening on port ", port);
});

