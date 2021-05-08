const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const router = express.Router();

const User = require ('../models/user');
const checkAuth = require('../middleware/check-auth');


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
                return res.status(409).json({
                    message: 'Mail exists'
                })
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (!err) {
                        const user = createUserSchema(req.body, hash)
                        user
                            .save()
                            .then(result => {
                                if (req.body.newsletter === true)
                                    createNewsletter(req.body)
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
        });
});

router.post('/login', (req, res, next) => {
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length < 1) {
                return res.status(401).json({
                    message: 'Email doesn\'t exist'
                });
            }
            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                if (err) {
                    return res.status(401).json({
                        message: 'Auth failed'
                    });
                }
                if (result) {
                    const token = jwt.sign({
                            email: user[0].email,
                            userId: user[0]._id
                        },
                        process.env.JWT_KEY,
                        {
                            expiresIn: "1h"
                        }
                    );
                    return res.status(200).json({
                        message: 'Auth successful',
                        token: token
                    })
                }
                res.status(401).json({
                    message: 'Wrong Password'
                })
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
