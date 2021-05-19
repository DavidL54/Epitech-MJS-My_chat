const Message = require('../models/modelMessage');
const moment = require('moment');

exports.createMessage = (req, res) => {
  const message = new Message({
    sender: req.body.sender,
    roomid: req.body.roomid,
    message: req.body.message,
  });
  message.save((err) => {
    if (err) {
      res.status(400).send(err);
    } else {
      res.status(201).json(message);
    }
  });
};

exports.getLastTenMessage = (req, res) => {
  Message.find({ roomid: req.params.roomid }).sort({ created_at: 'desc' }).limit(10).lean()
    .exec()
    .then((message) => {
      if (message === null) {
        res.status(400).send({ error: 'Server was unable to find message' });
      } else {
        message.forEach((msg, i) => {
          message[i].created_at = Date.parse(message[i].created_at);
        })
        res.status(200).json(message);
      }
    });
};

exports.getAllMessageByRoomId = (req, res) => {
  Message.find({ roomid: req.params.roomid }).populate([{ path: 'sender', model: 'User', select: 'name firstname email' }]).sort({ created_at: 'desc' }).lean()
    .exec()
    .then((message) => {
      if (message === null) {
        res.status(400).send({ error: 'Server was unable to find message' });
      } else {
        const resMsg = []
        message.forEach((msg, i) => {
          resMsg.push([
            `${message[i].sender.name} ${message[i].sender.firstname}`,
            message[i].message,
            moment(message[i].created_at).format('DD/MM/YYYY hh:mm')
          ]);
        })
        res.status(200).json(resMsg);
      }
    });
};

exports.getLastGlobalMessage = (req, res) => {
  Message.find({ sender: req.userData.userId }).lean().exec()
    .then((message) => {
      if (message === null) {
        res.status(400).send({ error: 'Server was unable to find this invit' });
      } else {
        res.status(200).json(message);
      }
    });
};

exports.deleteMessage = (req, res) => {
  Message.deleteOne({ _id: req.params.id }, (error, message) => {
    if (error) {
      res.status(404).json(error);
    } else if (message === null) {
      res.status(400).send({ error: 'Server was unable to find this invit' });
    } else {
      res.status(200).json(message);
    }
  });
};
