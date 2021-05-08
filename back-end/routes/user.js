const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const router = express.Router();

const User = require('../models/user');
const Token = require('../models/token')
const checkAuth = require('../middleware/check-auth');

require("dotenv").config();


router.get('/', checkAuth, (req, res, next) => {
    res.status(409).json({
        message: 'test'
    });
});

function createUserSchema(body, hash) {
    return new User({
        _id: new mongoose.Types.ObjectId(),
        email: body.email,
        password: hash,
        username: body.username,
        name: body.name,
        firstname: body.name,
        age: body.age
    });
}

router.post('/signup', (req, res, next) => {
    User.find({email: req.body.email})
        .exec()
        .then(user => {
            if (user.length >= 1) {
                return res.status(409).json(
                    'Mail exists'
                )
            } else {
                User.find({username: req.body.username})
                    .exec()
                    .then(username =>  {
                        if (username.length >= 1) {
                            return res.status(409).json(
                                'Username exists'
                            )
                        } else {
                            bcrypt.hash(req.body.password, 10, (err, hash) => {
                                if (!err) {
                                    const user = createUserSchema(req.body, hash)
                                    user
                                        .save()
                                        .then(result => {
                                            // generate token and save
                                            const token = new Token({
                                                _userId: user._id,
                                                token: crypto.randomBytes(16).toString('hex')
                                            });
                                            const test = token
                                                .save()
                                                .then(result => {
                                                    // Send email (use credintials of Gmail)
                                                    console.log(process.env.GMAIL_USERNAME, process.env.GMAIL_PASSWORD)
                                                    const transporter = nodemailer.createTransport({
                                                        service: 'Gmail',
                                                        auth: {
                                                            user: process.env.GMAIL_USERNAME,
                                                            pass: process.env.GMAIL_PASSWORD
                                                        }
                                                    });
                                                    console.log("je passe dans le token")
                                                    const mailOptions = {
                                                        from: 'd.e.scord5499@gmail.com',
                                                        to: user.email,
                                                        subject: 'Account Verification Link',
                                                        text: 'Hello ' + req.body.name + ',\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/user\/confirmation\/' + user.email + '\/' + token.token + '\n\nThank You!\n'
                                                    };
                                                    transporter.sendMail(mailOptions, function (err) {
                                                        if (err)
                                                            return res.status(500).send({msg: 'Technical Issue!, Please click on resend for verify your Email.'});
                                                        return 'A verification email has been sent to ' + user.email + '. It will be expire after one day. If you not get verification Email click on resend token.';
                                                    });
                                                })
                                                .catch(err => {
                                                    res.status(500).json({
                                                        error: err
                                                    });
                                                });
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

                        }
                    })
            }
        });
});

router.get('/confirmation/:email/:token', (req, res, next) => {
    Token.findOne({ token: req.params.token }, function (err, token) {
        // token is not found into database i.e. token may have expired
        if (!token) {
            return res.status(400).send({msg:'Your verification link may have expired. Please click on resend for verify your Email.'});
        } else {
            // if token is found then check valid user
            User.findOne({ _id: token._userId, email: req.params.email }, function (err, user) {
                // not valid user
                if (!user) {
                    return res.status(401).send({msg:'We were unable to find a user for this verification. Please SignUp!'});
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
                            return res.status(500).send({msg: err.message});
                        }
                        // account successfully verified
                        else{
                            return res.status(200).send('Your account has been successfully verified');
                        }
                    });
                }
            });
        }

    });
});

router.post('/login', (req, res, next) => {
    User.find({ "$or": [ {email : req.body.email }, {username : req.body.email} ]})
        .exec()
        .then(user => {
            // if (user.length < 1) {
            //     return res.status(401).json(
            //         'Email doesn\'t exist');
            // }
            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                if (err) {
                    return res.status(401).json(
                        'Auth failed'
                    );
                }
                console.log(user)
                if (!user[0].active) {
                    res.status(401).json(
                        'Your Email has not been verified. Please click on resend'
                    )
                }
                if (result) {
                    const token = jwt.sign({
                            email: user[0].email,
                            userId: user[0]._id
                        },
                        process.env.JWT_KEY,
                        {
                            expiresIn: "3h"
                        }
                    );
                    return res.status(200).json({
                        message: 'Auth successful',
                        token: token
                    })
                }
                res.status(401).json(
                    'Wrong Password')
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        })
});

router.delete('/:userId', checkAuth, (req, res, next) => {
    User.remove({id: req.params.userId})
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
});

module.exports = router;
