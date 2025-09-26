const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  response: {
    type: String,
    trim: true
  },
  isFromUser: {
    type: Boolean,
    default: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  category: {
    type: String,
    enum: ['saving_tips', 'budget_advice', 'goal_planning', 'general', 'investment'],
    default: 'general'
  }
});

module.exports = mongoose.model('ChatMessage', chatMessageSchema);
