const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const sendMail = require('../middleware/sendMail')
const User = require('../models/modelUser');
const Room = require('../models/modelRoom');
const Token = require('../models/modelToken')
var amqplib = require('amqplib');
const config = require('../config');
require("dotenv").config();

exports.getAll = (req, res) => {
    User.find({}, (error, user) => {
        if (error) {
            res.status(404).json(error);
        }
        else if (user === null) {
            res.status(400).send({ error: 'Server was unable to find users' });
        }
        else {
            res.status(200).json(user);
        }
    });
};

exports.signup = (req, res) => {
    User.find({ "$or": [{ email: req.body.email }, { username: req.body.username }] })
        .exec()
        .then(users => {
            for (const user in users) {
                const tmp = users[user]

                if (tmp.email === req.body.email) {
                    return res.status(409).json(
                        'Mail exists'
                    )
                }
                if (tmp.username === req.body.username) {
                    return res.status(409).json(
                        'Username exists'
                    )
                }
            }
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if (!err) {
                    const user = new User({
                        email: req.body.email,
                        password: hash,
                        username: req.body.username,
                        name: req.body.name,
                        firstname: req.body.firstname,
                        age: req.body.age
                    });
                    user.save().then(async () => {
                        // generate token and save
                        const token = new Token({
                            _userId: user._id,
                            token: crypto.randomBytes(16).toString('hex')
                        });
                        token.save()
                        sendMail(user.email, 'Account Verification Link',
                            'Hello ' + req.body.name + ',\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/user\/confirmation\/' + user.email + '\/' + token.token + '\n\nThank You!\n');


                        var conn = await amqplib.connect(config.RABBITURL);
                        var ch = await conn.createChannel()
                        await ch.assertQueue(`Queue_${user._id}`, { durable: true});
                        await ch.close();
                        await conn.close();



                        res.status(201).json({
                            message: "User created"
                        });
                    })
                        .catch(err => {
                            res.status(500).json({
                                error: err
                            });
                        });
                } else {
                    return res.status(500).json({
                        error: err
                    });
                }
            });
        });
};

exports.confirmEmailToken = (req, res) => {
    Token.findOne({ token: req.params.token }, function (err, token) {
        // token is not found into database i.e. token may have expired
        if (!token) {
            return res.status(400).send({ msg: 'Your verification link may have expired. Please click on resend for verify your Email.' });
        } else {
            // if token is found then check valid user
            User.findOne({ _id: token._userId, email: req.params.email }, function (err, user) {
                // not valid user
                if (!user) {
                    return res.status(401).send({ msg: 'We were unable to find a user for this verification. Please SignUp!' });
                }
                // user is already verified
                else if (user.active) {
                    return res.status(200).send('User has been already verified. Please Login');
                }
                // verify user
                else {
                    // change isVerified to true
                    user.active = true;
                    user.save(function (err) {
                        // error occur
                        if (err) {
                            return res.status(500).send({ msg: err.message });
                        }
                        // account successfully verified
                        else {
                            return res.status(200).send('Your account has been successfully verified');
                        }
                    });
                }
            });
        }

    });
};

exports.login = (req, res) => {
    User.find({ "$or": [{ email: req.body.username }, { username: req.body.username }] }).exec()
        .then((user, err) => {
            if (user.length < 1) {
                return res.status(404).json('User doesn\'t exist');
            }
            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                if (err)
                    return res.status(401).json('Auth failed');
                if (!user[0].active) {
                    return res.status(401).json('Your Email has not been verified. Please click on resend')
                }
                if (result) {
                    const token = jwt.sign({
                        name: user[0].name,
                        firstname: user[0].firstname,
                        email: user[0].email,
                        userId: user[0]._id
                    },
                        process.env.JWT_KEY, {
                        expiresIn: "7d"
                    }
                    );
                    return res.status(200).json({
                        message: 'OK',
                        token: token
                    })
                }
                res.status(401).json('Wrong Password')
            });
        })
};

exports.generateLink = (req, res) => {
    User.find({ "$or": [{ email: req.body.username }, { username: req.body.username }] })
        .exec()
        .then(user => {
            // user is not found into database
            if (!user) {
                return res.status(400).send({ msg: 'We were unable to find a user with that email. Make sure your Email is correct!' });
            }
            // user has been already verified
            else if (user[0].active) {
                return res.status(200).send('This account has been already verified. Please log in.');
            }
            // send verification link
            else {
                // generate token and save
                const token = new Token({ _userId: user[0]._id, token: crypto.randomBytes(16).toString('hex') });
                token.save(function (err) {
                    if (err) {
                        return res.status(500).send({ msg: err.message });
                    }
                    sendMail(user[0].mail, 'Account Verification Link',
                        'Hello ' + req.body.name + ',\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/user\/confirmation\/' + user[0].email + '\/' + token.token + '\n\nThank You!\n')
                    return res.status(200).send('A verification email has been sent to ' + user[0].email + '. It will be expire after one day. If you not get verification Email click on resend token.');
                });
            }
        });
}

exports.deleteUser = (req, res) => {
    User.remove({ id: req.params.userId })
        .exec()
        .then(result => {
            res.status(200).json({
                message: "User deleted"
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
};

exports.forgotpass = (req, res) => {
    User.find({ "$or": [{ email: req.body.username }, { username: req.body.username }] })
        .exec()
        .then(user => {
            if (!user) {
                return res.status(400).json("user with the email does not exists.")
            }
            const token = jwt.sign({ _id: user[0]._id }, process.env.JWT_KEY_RESET, { expiresIn: "20m" })
            user[0].updateOne({ resetLink: token }, (err, succes) => {
                if (err) {
                    return res.status(400).json('reset password link error')
                } else {
                    sendMail(user[0].email, 'Reset Password Link',
                        'Hello ' + req.body.name + ',\n\n' + 'Please click on given link to reset your password: \nhttp:\/\/' + '127.0.0.1:3000' + '\/user\/resetpassword\/' + token + '\n\nThank You!\n')
                    return res.status(200).send('A reset password has been sent to ' + user[0].email + '. It will be expire after 20 minutes. If you not get reset Email click on resend token.');
                }
            });
        });
};

exports.resetPass = (req, res) => {
    const token = req.params.token
    const newPass = req.body.newpass

    if (token) {
        jwt.verify(token, process.env.JWT_KEY_RESET, (err, decodeData) => {
            if (err)
                return res.status(200).json("error for verify token")
            User.findOne({ resetLink: token }, (err, user) => {
                if (err || !user)
                    return res.status(400).json("User with this token does not exist.")
                bcrypt.hash(newPass, 10, (err, hash) => {
                    user.updateOne({ password: hash }, (err, result) => {
                        if (err)
                            return res.status(400).json("reset password link error")
                        else {
                            return res.status(200).json({ message: "Your password has been changed" })
                        }
                    })
                });
            });
        });
    }
};

exports.getUserByRoom = (req, res) => {
    Room.findById(req.params.id)
        .populate([{ path: 'roomAdmin', model: 'User', select: 'name firstname' },
        { path: 'allowUser', model: 'User', select: 'name firstname' }])
        .exec()
        .then((rooms, err) => {
            if (err) {
                res.status(400).json(err);
            }
            else if (rooms === null) {
                res.status(400).send({ error: 'Server was unable to find rooms' });
            }
            else {
                const finRes = [];
                finRes.push(rooms.roomAdmin)
                rooms.allowUser.forEach(user => {
                    finRes.push(user);
                });
                res.status(200).json(finRes);
            }
        });
}