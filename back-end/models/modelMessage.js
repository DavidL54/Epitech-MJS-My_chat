const mongoose = require('mongoose');


const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  roomid: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Room' },
  idmsg: { type: String, required: true },
  message: { type: String, required: true },
  read: [{ type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' }]
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

module.exports = mongoose.model('Message', messageSchema);
