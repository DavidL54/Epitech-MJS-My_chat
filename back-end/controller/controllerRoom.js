const Room = require('../models/modelRoom');
const User = require('../models/modelUser');
const Invitation = require('../models/modelInvitation');
const sendMail = require('../middleware/sendMail');
const config = require('../config');
const jwt = require('jsonwebtoken');
var amqplib = require('amqplib');


exports.getAll = (req, res) => {
    Room.find({}).lean().exec()
        .then((room, err) => {
            if (err) {
                return res.status(500).json(err);
            }
            else {
                return res.status(200).json(room);
            }
        });

};

exports.createRoom = async (req, res) => {
    Room.find({ name: req.body.name }).lean().exec().then(room => {
        if (room.length >= 1) {
            return res.status(409).json('Room exists');
        } else {
            const room = new Room({
                roomAdmin: req.userData.userId,
                name: req.body.name
            });
            room.save().then(async () => {
                var conn = await amqplib.connect(config.RABBITURL);
                var ch = await conn.createChannel()
                await ch.assertExchange(`Room_${room._id}`, 'direct', { durable: true });
                await ch.bindQueue(`Queue_${req.userData.userId}`, `Room_${room._id}`, '');

                await ch.close();
                await conn.close();


                if (req.body.invitation && req.body.invitation.length > 0) {
                    await req.body.invitation.forEach(async (inv) => {
                        const invit = new Invitation({
                            sender: req.userData.userId,
                            receiver: inv.value,
                            roomid: room._id,
                            accepted: false,
                        });
                        const token = jwt.sign({ _id: inv.value }, config.JWT_KEY_RESET, { expiresIn: "20m" })
                        await invit.save();
                        console.log("mail sended to", inv.email, inv.label, room.name)
                        await sendMail(inv.email, 'Invitation to join room', 'Hello ' + inv.label + ',\n\n' + 'You\'re invited to join room' + room.name + '\n\n'
                        + 'Please click on given link to reset your password: \nhttp:\/\/' + '127.0.0.1:3000' + '\/room\/invitation\/' + token + '\n\nThank You!\n');
                    })
                    return res.status(200).json(room)
                }
                else {                    
                    res.status(200).json(room)
                }
            });
        }
    });
};

exports.updateRoom = (req, res) => {

};

exports.deleteRoom = (req, res) => {
    Room.deleteOne({ _id: req.params.id }, async (error, room) => {
        if (error) {
            res.status(400).json(error);
        }
        else if (room === null) {
            res.status(404).json({ error: 'Server was unable to find this room' });
        }
        else {
            console.log(`Room_${req.params.id}`);
            var conn = await amqplib.connect('amqp://rabbitmq:5672', heartbeat = 60);
            var ch = await conn.createChannel()
            await ch.removeAllListeners(`Room_${req.params.id}`);
            await ch.deleteExchange(`Room_${req.params.id}`);

            ch.close();
            conn.close();
            res.status(200).json(room)
        }
    });
}

exports.getRoomByUser = (req, res) => {
    Room.find({ roomAdmin: req.params.id }).select('name').exec()
        .then((rooms, err) => {
            if (err) {
                res.status(400).json(err);
            }
            else if (rooms === null) {
                res.status(400).send({ error: 'Server was unable to find rooms' });
            }
            else {
                res.status(200).json(rooms);
            }
        });
}

exports.getAllowRoomByUser = (req, res) => {
    Room.find({ $or: [{ roomAdmin: req.params.id }, { allowUser: req.params.id }] }).select('name').exec()
        .then((rooms, err) => {
            if (err) {
                res.status(400).json(err);
            }
            else if (rooms === null) {
                res.status(400).send({ error: 'Server was unable to find rooms' });
            }
            else {
                res.status(200).json(rooms);
            }
        });

}
