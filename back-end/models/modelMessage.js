const mongoose = require('mongoose');


const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  receiver: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  roomid: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Room' },
  message: { type: String, required: true },
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

module.exports = mongoose.model('Message', messageSchema);
