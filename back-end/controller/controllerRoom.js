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
    Room.find({ name: req.body.name })
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
                        return res.status(200).json(room)
                    });
            }
        });
};

exports.updateRoom = (req, res) => {

};

exports.deleteRoom = (req, res) => {
    Room.deleteOne({ _id: req.params.id }, (error, room) => {
        if (error) {
            res.status(400).json(error);
        }
        else if (room === null) {
            res.status(404).json({ error: 'Server was unable to find this company' });
        }
        else {
            res.status(200).json(room);
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
