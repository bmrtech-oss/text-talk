const mongoose = require('mongoose');

const moderationLogSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tweet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tweet'
  },
  action: {
    type: String,
    enum: ['create', 'update', 'delete'],
    required: true
  },
  moderationResult: {
    isApproved: {
      type: Boolean,
      required: true
    },
    violations: [{
      type: String,
      enum: ['hate_speech', 'harassment', 'violence', 'spam', 'false_info', 'other']
    }],
    confidence: {
      type: Number,
      min: 0,
      max: 1
    },
    suggestedChanges: [String],
    moderatedBy: {
      type: String,
      enum: ['ai', 'human', 'hybrid'],
      default: 'ai'
    }
  },
  countryCode: {
    type: String,
    maxlength: 2,
    default: 'US'
  },
  ipAddress: {
    type: String,
    required: true
  },
  userAgent: {
    type: String
  }
}, {
  timestamps: true
});

// Index for better query performance
moderationLogSchema.index({ author: 1, createdAt: -1 });
moderationLogSchema.index({ 'moderationResult.isApproved': 1 });
moderationLogSchema.index({ countryCode: 1 });

module.exports = mongoose.model('ModerationLog', moderationLogSchema);
