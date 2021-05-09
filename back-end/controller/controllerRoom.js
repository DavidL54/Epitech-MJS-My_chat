const Room = require('../models/modelRoom');
const User = require('../models/modelUser');

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

exports.createRoom = (req, res) => {
    Room.find({name: req.body.name})
        .lean()
        .exec()
        .then(room => {
            if (room.length >= 1) {
                return res.status(409).json(
                    'Room exists'
                );
            } else {
                const room = new Room({
                    roomAdmin: req.userData.userId,
                    name: req.body.name
                });
                room.save()
                    .then(result => {
                        return res.status(200).json({
                            message: "Room created"
                        })
                    });
            }
        });
};

exports.updateRoom = (req, res) => {

};

exports.deleteRoom = (req, res) => {

}
