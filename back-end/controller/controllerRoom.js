const Room = require('../models/modelRoom');

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
    const room = new Room({
        
    });
};

exports.updateRoom = (req, res) => {
  
};

exports.deleteRoom = (req, res) => {

}
