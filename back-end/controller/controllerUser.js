const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const controllerMail = require('./controllerMail');
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
            res.status(400).send('Server was unable to find users');
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
                        'It seems this account already exists. Do you want to recover your password ?'
                    )
                }
                if (tmp.username === req.body.username) {
                    return res.status(409).json(
                        'It seems this account already exists. Do you want to recover your password ?'
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
                        var conn = await amqplib.connect(config.RABBITURL);
                        var ch = await conn.createChannel()
                        await ch.assertQueue(`Queue_${user._id}`, { durable: true});
                        await ch.close();
                        await conn.close();

                        await controllerMail.accountverification(user);

                        res.status(201).json({
                            message: "A confirmation email has been sent.Please click on the link in it to confirm your account"
                        });
                    })
                        .catch(err => {
                            console.log(err);
                            res.status(500).json(err);
                        });
                } else {
                    console.log(err);
                    return res.status(500).json(err);
                }
            });
        });
};

exports.confirmEmailToken = (req, res) => {
    Token.findOne({ token: req.params.token }, function (err, token) {
        // token is not found into database i.e. token may have expired
        if (!token) {
            return res.status(400).send('Your verification link may have expired. Please click on resend for verify your Email.');
        } else {
            // if token is found then check valid user
            User.findOne({ _id: token._userId, email: req.params.email }, function (err, user) {
                // not valid user
                if (!user) {
                    return res.status(401).send('We were unable to find a user for this verification. Please SignUp!');
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
                            return res.status(500).send(err.message);
                        }
                        // account successfully verified
                        else {
                            const token = jwt.sign({
                                name: user.name,
                                firstname: user.firstname,
                                email: user.email,
                                userId: user._id
                            },
                                config.JWT_KEY, {
                                expiresIn: "90d"
                            }
                            );
                            return res.status(200).json({
                                result: 'Your account has been successfully verified',
                                token: token
                            })
                        }
                    });
                }
            });
        }

    });
};

exports.login = (req, res) => {
    User.findOne({ "$or": [{ email: req.body.username }, { username: req.body.username }] }).exec()
        .then((user) => {
            if (user === null) {
                return res.status(404).json('The credential you provided do not match.Do you want to recover your password');
            }
            bcrypt.compare(req.body.password, user.password, async (err, result) => {
                if (err)
                    return res.status(401).json('Auth failed');
                else if (result) {
                    if (!user.active) {
                        await controllerMail.accountverification(user);
                        return res.status(409).json('Your account has not yet been confirmed. Check your Mailbox')
                    }
                    else {
                        if (result) {
                            const token = jwt.sign({
                                name: user.name,
                                firstname: user.firstname,
                                email: user.email,
                                userId: user._id
                            },
                                config.JWT_KEY, {
                                expiresIn: "90d"
                            }
                            );
                            await controllerMail.accountLogin(user);
                            return res.status(200).json({
                                message: 'OK',
                                token: token
                            })
                        }
                    }
                }
                else {
                    res.status(401).json('The credential you provided do not match.Do you want to recover your password')
                }
            });
        })
};

exports.generateLink = (req, res) => {
    User.findOne({ "$or": [{ email: req.body.username }, { username: req.body.username }] })
        .exec()
        .then(async (user) => {
            // user is not found into database
            if (!user) {
                return res.status(400).send('We were unable to find a user with that email. Make sure your Email is correct!');
            }
            // user has been already verified
            else if (user.active) {
                return res.status(200).send('This account has been already verified. Please log in.');
            }
            // send verification link
            else {
                await controllerMail.accountverification(user);
                return res.status(200).send('A verification email has been sent to ' + user.email + '. It will be expire after one day. If you not get verification Email click on resend token.');
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
            res.status(500).json(err);
        });
};

exports.forgotpass = (req, res) => {
    User.findOne({ "$or": [{ email: req.body.username }, { username: req.body.username }] })
        .exec()
        .then(user => {
            if (user == null) {
                res.status(400).json("A recover email has been sent to this email.Please follow the instructions in it to recover your account")
            }
            else {
                const token = jwt.sign({ _id: user._id }, config.JWT_KEY_RESET, { expiresIn: "20m" })
                user.updateOne({ resetLink: token }, async (err, succes) => {
                    if (err) {
                        res.status(400).json('reset password link error')
                    } else {
                        await controllerMail.forgotpass(user, token);
                        res.status(200).send('A recover email has been sent to this email.Please follow the instructions in it to recover your account');
                    }
                });
            }
        });
};

exports.resetPass = (req, res) => {
    const token = req.params.token
    const newPass = req.body.newpass

    if (token) {
        jwt.verify(token, config.JWT_KEY_RESET, (err, decodeData) => {
            if (err)
                return res.status(400).json("error for verify token")
            User.findOne({ resetLink: token }, (err, user) => {
                if (err || !user)
                    return res.status(400).json("User with this token does not exist.")
                bcrypt.hash(newPass, 10, (err, hash) => {
                    user.updateOne({ password: hash }, (err, result) => {
                        if (err)
                            return res.status(400).json("reset password link error")
                        else {
                            const token = jwt.sign({
                                name: user.name,
                                firstname: user.firstname,
                                email: user.email,
                                userId: user._id
                            },
                                config.JWT_KEY, {
                                expiresIn: "90d"
                            }
                            );
                            return res.status(200).json({
                                result: 'Your password has been changed',
                                token: token
                            })
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
                res.status(400).send('Server was unable to find rooms');
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