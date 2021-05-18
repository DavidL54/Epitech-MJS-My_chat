const Message = require('../models/modelMessage');

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
        res.status(200).json(message);
      }
    });
};

exports.getLastGlobalMessage = (req, res) => {
  Message.find({ sender: req.userData.userId }).limit(100).lean().exec()
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
