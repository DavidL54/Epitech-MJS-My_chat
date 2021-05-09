const Invitation = require('../models/modelInvitation');

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
    });
    invit.save((err) => {
        if (err) {
            res.status(400).send(err);
        }
        else {
            res.status(201).json(invit);
        }
    });

};

exports.updateInvitState = (req, res) => {
    Invitation.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true }, (error, invit) => {
        if (error) {
            res.status(400).json(error);
        }
        else if (invit === null) {
            res.status(400).send({ error: 'Server was unable to find this invit' });
        }
        else {
            res.status(200).json(invit);
        }
    });

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
