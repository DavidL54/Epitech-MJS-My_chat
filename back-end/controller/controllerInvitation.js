const Invitation = require('../models/modelInvitation');
const Room = require('../models/modelRoom');
const config = require('../config');
const jwt = require('jsonwebtoken');
var amqplib = require('amqplib');

async function userJoinRoom(req, res, info) {
    await Invitation.findOneAndUpdate({ _id: info.invitid }, { accepted: req.body.res }, { new: true }).exec();

    if (req.body.res) {
        var conn = await amqplib.connect(config.RABBITURL);
        var ch = await conn.createChannel();
        await ch.assertQueue(`Queue_${info.userid}`, { durable: true });
        await ch.bindQueue(`Queue_${info.userid}`, `Room_${info.roomid}`, '');
        await ch.close();
        await conn.close();
        const room = await Room.findById(info.roomid).exec();
        if (!room.allowUser.includes(info.userid)) {
            let newAllow = [...room.allowUser];
            newAllow.push(info.userid);
            console.log("update");
            await Room.findOneAndUpdate({ _id: info.roomid }, { allowUser: newAllow }, { new: true }).exec();
            res.status(200).json("You have accepted successfully")
        }
        else {
            await ch.unbindQueue(`Queue_${info.userid}`, `Room_${info.roomid}`, '');
        }
    }
    else {
        res.status(200).json("You answered successfully")
    }
}

async function changeAdminRoom(req, res, info) {
    await Invitation.findOneAndUpdate({ _id: info.invitid }, { accepted: req.body.res }, { new: true }).exec();
    if (req.body.res) {
        const room = await Room.findById(info.roomid).exec();
        let newAllow = [...room.allowUser];
        newAllow = newAllow.filter(function (value) { return value !== info.userid; });
        await Room.findOneAndUpdate({ _id: info.roomid }, { roomAdmin: info.userid, allowUser : newAllow }, { new: true }).exec();
        res.status(200).json("You have accepted successfully")
    }
    else {
        res.status(200).json("You answered successfully")
    }
}

exports.getAllInvitbyuser = (req, res) => {
    Invitation.find({ receiver : req.params.id }).lean().exec()
        .then((invit, err) => {
            if (err) {
                return res.status(500).json(err);
            }
            else {
                return res.status(200).json(invit);
            }
     });    
};

exports.createInvit = (req, res) => {
    const invit = new Invitation({
        sender: req.body.sender,
        receiver: req.body.receiver,
        roomid: req.body.roomid,
        accepted: false,
    });
    invit.save( async (err) => {
        if (err) {
            res.status(400).send(err);
        }
        else {

                /*const token = jwt.sign({ _id: inv.value }, config.JWT_KEY_RESET, { expiresIn: "20m" })
                console.log("mail sended to", inv.email, inv.label, room.name)
                await sendMail(inv.email, 'Invitation to join room', 'Hello ' + inv.label + ',\n\n' + 'You\'re invited to join room' + room.name + '\n\n'
                    + 'Please click on given link to reset your password: \nhttp:\/\/' + '127.0.0.1:3000' + '\/room\/invitation\/' + token + '\n\nThank You!\n');
*/


            res.status(201).json(invit);
        }
    });

};

exports.updateInvitState = (req, res) => {
    if (req.body.token) {
        jwt.verify(req.body.token, config.JWT_KEY_RESET, async (err, info) => {
            if (err) return res.status(200).json("error for verify token")
            console.log(info);
            if (info.invit === "joinroom") {
                userJoinRoom(req, res, info);
            }
            else if (info.invit === "joinadmin") {
                changeAdminRoom(req, res, info)
            }
        });
    }
};

exports.deleteInvit = (req, res) => {
    Invitation.deleteOne({ _id: req.params.id }, (error, invit) => {
        if (error) {
            res.status(404).json(error);
        }
        else if (invit === null) {
            res.status(400).send({ error: 'Server was unable to find this invit' });
        }
        else {
            res.status(200).json(invit);
        }
    });
};
