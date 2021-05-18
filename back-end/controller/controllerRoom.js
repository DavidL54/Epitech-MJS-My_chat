const Room = require('../models/modelRoom');
const User = require('../models/modelUser');
const Invitation = require('../models/modelInvitation');
const controllerMail = require('./controllerMail');
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

async function createBindingRoom(idroom, iduser) {
    var conn = await amqplib.connect(config.RABBITURL);
    var ch = await conn.createChannel();
    await ch.assertExchange(`Room_${idroom}`, 'direct', { durable: true });
    await ch.bindQueue(`Queue_${iduser}`, `Room_${idroom}`, '');
    await ch.close();
    await conn.close();
}

async function treatInvit(req, room, invitations) {
    let addimmediatUsers = [];
    for (const inv of invitations) {
        if (inv.iscommun) {
            await createBindingRoom(room._id, inv.value);
            addimmediatUsers.push(inv.value.toString());
        }
        else {
            const invit = new Invitation({
                sender: req.userData.userId,
                receiver: inv.value,
                roomid: room._id,
            });
            const token = await jwt.sign({ userid: inv.value, roomid: room._id, roomname: req.body.name, invit: 'joinroom', invitid: invit._id }, config.JWT_KEY_RESET, { expiresIn: "7d" })
            await invit.save();
            await controllerMail.joinroom(inv, room, token);
        }
    }
    await Room.findByIdAndUpdate(room._id, { allowUser: addimmediatUsers }, { new: true },).exec();
}

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
                await createBindingRoom(room._id, req.userData.userId);
                if (req.body.invitation && req.body.invitation.length > 0) {
                    treatInvit(req, room, req.body.invitation);
                    res.status(200).json(room)
                }
                else {
                    res.status(200).json(room)
                }
            });
        }
    });
};

async function defineNewAdmin(newadminid, room) {

    const oldadmin = room.roomAdmin.toString();
    const allowWithoutAdm = room.allowUser.filter((item) => { return item.toString() !== newadminid.toString() })
    allowWithoutAdm.push(oldadmin);

    const ret = await Room.findByIdAndUpdate(room._id, { allowUser: allowWithoutAdm, roomAdmin: newadminid }, { new: true },).exec();
}

exports.updateRoom = (req, res) => {
    Room.findById(req.params.id).lean().exec().then(async (room) => {
        if (room.length === null) {
            return res.status(409).json('Room exists');
        } else {
            if (req.body.invitation && req.body.invitation.length > 0) {
                await treatInvit(req, room, req.body.invitation);
            }
            if (req.body.admin) {
                await defineNewAdmin(req.body.admin.value, room)
            }
            res.status(200).json(room)
        }
    });
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
            var conn = await amqplib.connect(config.RABBITURL, heartbeat = 60);
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
