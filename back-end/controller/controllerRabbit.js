const Room = require('../models/modelRoom');
const User = require('../models/modelUser');


exports.createExchangeRoom = (channel) => {
  Room.find({}).lean().exec()
    .then((room, err) => {
      if (err || room === null) {
        console.log(err);
      }
      else {
        console.log(room);
        room.forEach(element => {
          channel.assertExchange(`Room_${element._id}`, 'direct', {
            durable: true
          });
        });
      }
    });
}

exports.loadBindingQueue = (channel) => {
  Room.find({}).lean().exec()
    .then((rooms, err) => {
      if (err || rooms === null) {
        console.log(err);
      }
      else {
        User.find({}, (error, users) => {
          if (error || users === null) {
            console.log(error);
          }
          else {
            users.forEach(user => {
              channel.assertQueue(`Queue_${user._id}`, {
                durable: true,
              }, (error2, q) => {
                if (error2) {
                  throw error2;
                }
                console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q.queue);
                rooms.forEach(room => {
                  channel.bindQueue(q.queue, `Room_${room._id}`, '');
                });
              });
            });
          }
        });
      }
    });
}