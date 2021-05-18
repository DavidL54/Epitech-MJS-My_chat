const mongoose = require('mongoose');

const userHistorySchema = mongoose.Schema({
  userid: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  historyType: { type: String, enum: ['login', 'confirm', 'recover', 'roominvit'], required: true },
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

module.exports = mongoose.model('UserHistory', userHistorySchema);
