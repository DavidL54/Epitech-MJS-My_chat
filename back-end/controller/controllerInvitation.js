const jwt = require('jsonwebtoken');
const amqplib = require('amqplib');
const Invitation = require('../models/modelInvitation');
const Room = require('../models/modelRoom');
const User = require('../models/modelUser');
const config = require('../config');

async function userJoinRoom(req, res, info) {
  await Invitation.findOneAndUpdate({ _id: info.invitid }, { accepted: req.body.res },
    { new: true }).exec();

  if (req.body.res) {
    const conn = await amqplib.connect(config.RABBITURL);
    const ch = await conn.createChannel();
    await ch.assertQueue(`Queue_${info.userid}`, { durable: true });
    await ch.bindQueue(`Queue_${info.userid}`, `Room_${info.roomid}`, '');
    await ch.close();
    await conn.close();
    const room = await Room.findById(info.roomid).exec();
    if (!room.allowUser.includes(info.userid)) {
      const newAllow = [...room.allowUser];
      newAllow.push(info.userid);
      await Room.findOneAndUpdate({ _id: info.roomid }, { allowUser: newAllow },
        { new: true }).exec();
      res.status(200).json('You have accepted successfully');
    } else {
      await ch.unbindQueue(`Queue_${info.userid}`, `Room_${info.roomid}`, '');
    }
  } else {
    res.status(200).json('You answered successfully');
  }
}

async function changeAdminRoom(req, res, info) {
  await Invitation.findOneAndUpdate({ _id: info.invitid }, { accepted: req.body.res },
    { new: true }).exec();
  if (req.body.res) {
    const room = await Room.findById(info.roomid).exec();
    let newAllow = [...room.allowUser];
    newAllow = newAllow.filter((value) => value !== info.userid);
    await Room.findOneAndUpdate({ _id: info.roomid },
      { roomAdmin: info.userid, allowUser: newAllow }, { new: true }).exec();
    res.status(200).json('You have accepted successfully');
  } else {
    res.status(200).json('You answered successfully');
  }
}

exports.getAllInvitbyuser = (req, res) => {
  Invitation.find({ receiver: req.params.id }).lean().exec()
    .then((invit, err) => {
      if (err) {
        return res.status(500).json(err);
      }

      return res.status(200).json(invit);
    });
};

exports.createInvit = (req, res) => {
  const invit = new Invitation({
    sender: req.body.sender,
    receiver: req.body.receiver,
    roomid: req.body.roomid,
    accepted: false,
  });
  invit.save(async (err) => {
    if (err) {
      res.status(400).send(err);
    } else {
      res.status(201).json(invit);
    }
  });
};

exports.updateInvitState = (req, res) => {
  if (req.body.token) {
    jwt.verify(req.body.token, config.JWT_KEY_RESET, async (err, info) => {
      if (err) return res.status(200).json('error for verify token');
      if (info.invit === 'joinroom') {
        await userJoinRoom(req, res, info);
      } else if (info.invit === 'joinadmin') {
        await changeAdminRoom(req, res, info);
      }
    });
  }
};

exports.deleteInvit = (req, res) => {
  Invitation.deleteOne({ _id: req.params.id }, (error, invit) => {
    if (error) {
      res.status(404).json(error);
    } else if (invit === null) {
      res.status(400).send({ error: 'Server was unable to find this invit' });
    } else {
      res.status(200).json(invit);
    }
  });
};

async function isCommonRoom(useridone, useridtwo) {
  const rooms = await Room.find({}).lean().exec();
  let find = false;

  await rooms.forEach(async (room) => {
    const userOfroom = [];
    room.allowUser.forEach((user) => userOfroom.push(user.toString()));
    userOfroom.push(room.roomAdmin.toString());

    if (userOfroom.includes(useridone) && userOfroom.includes(useridtwo)) {
      find = true;
    }
  });
  return (find);
}

exports.getAvalaibleUserInvitRoomcreate = (req, res) => {
  const myid = req.userData.userId;
  User.find({ _id: { $ne: myid } }).lean().exec()
    .then(async (users, err) => {
      if (err) {
        res.status(400).json(err);
      } else if (users === null) {
        res.status(400).send({ error: 'Server was unable to find Users' });
      } else {
        const finRes = [];
        for (let i = 0; i < users.length; i += 1) {
          const user = { ...users[i] };
          const iscommun = await isCommonRoom(myid, user._id.toString());
          user.iscommun = iscommun;
          finRes.push(user);
        }
        res.status(200).json(finRes);
      }
    });
};

async function getAvailableInvitforRoom(users, room, myid) {
  const userOfroom = [];
  const blacklist = [];
  const finRes = [];
  room.allowUser.forEach((user) => userOfroom.push(user.toString()));
  userOfroom.push(room.roomAdmin.toString());
  const invitAlreadySend = await Invitation.find({ roomid: room._id }).lean().exec();

  for (const invit of invitAlreadySend) {
    const delay = (Number(Date.now()) - Number(Date.parse(invit.created_at.toString()))) / 60000;

    if ((invit.accepted && invit.accepted === false) || delay < 10080) {
      blacklist.push(invit.receiver.toString());
    }
  }

  for (const user of users) {
    if (!userOfroom.includes(user._id.toString()) && !blacklist.includes(user._id.toString())) {
      const usercpy = { ...user };
      const iscommun = await isCommonRoom(myid, user._id.toString());
      usercpy.iscommun = iscommun;
      finRes.push(usercpy);
    }
  }
  return (finRes);
}

exports.getAvalaibleUserInvitRoomUpdate = (req, res) => {
  const myid = req.userData.userId;
  User.find({ _id: { $ne: myid } }).lean().exec()
    .then(async (users, err) => {
      if (err) {
        res.status(400).json(err);
      } else if (users === null) {
        res.status(400).send({ error: 'Server was unable to find Users' });
      } else {
        const room = await Room.findById(req.params.roomid).lean().exec();
        const finRes = await getAvailableInvitforRoom(users, room, myid);

        res.status(200).json(finRes);
      }
    });
};

exports.getAvalaibleUserInvitAdmin = (req, res) => {
  Room.findById(req.params.id).populate([{ path: 'allowUser', model: 'User', select: 'name firstname email' }]).lean().exec()
    .then(async (users, err) => {
      if (err) {
        res.status(400).json(err);
      } else if (users === null) {
        res.status(400).send({ error: 'Server was unable to find Users' });
      } else {
        res.status(200).json(users.allowUser);
      }
    });
};
