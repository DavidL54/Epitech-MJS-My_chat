const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  roomAdmin: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  name: { type: String, required: true },
  allowUser: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

module.exports = mongoose.model('Room', roomSchema);
