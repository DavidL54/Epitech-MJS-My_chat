const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: {
        type: String,
        required: true,
        unique: true,
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    password: {type: String, required: true},
    username: {type: String, required: true, unique: true},
    name : {type: String, required: true},
    firstname : {type: String, required: true},
    age : {type: Number, required: true},
    active: {type: Boolean, default : false},
    resetLink: {
        data: String,
        default: ''
    }
});

module.exports = mongoose.model('User', userSchema);
