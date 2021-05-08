const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors')

const user = require('./routes/user');

const app = express();

mongoose.connect('mongodb://mongo:27030/User', {
        useNewUrlParser: true,
        useUnifiedTopology: true
});

mongoose.connection.once('open', function () {
        console.log('connection has been made');
    }).on('error', function (error) {
        console.log("pas bon", error);
})


app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/user', user);

app.use((req, res) =>
{
    const error = new Error('Route doesn\'t exist');
    error.status = 404;
    res.status(error.status || 500);
    res.json(
        {
            error:
                {
                    message: error.message
                }
        })
});

module.exports = app;
