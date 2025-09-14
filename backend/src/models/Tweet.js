const mongoose = require('mongoose');

const tweetSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    maxlength: 280,
    trim: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  retweets: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  replies: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tweet'
  }],
  replyTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tweet'
  },
  quoteTweet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tweet'
  },
  media: [{
    type: String, // URLs to media files
    maxlength: 500
  }],
  hashtags: [{
    type: String,
    lowercase: true
  }],
  mentions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  viewCount: {
    type: Number,
    default: 0
  },
  isEdited: {
    type: Boolean,
    default: false
  },
  editHistory: [{
    content: String,
    editedAt: {
      type: Date,
      default: Date.now
    }
  }],
  moderationStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'flagged'],
    default: 'pending'
  },
  moderationDetails: {
    checkedAt: Date,
    violations: [String],
    score: Number,
    suggestedChanges: [String]
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      default: [0, 0]
    },
    name: String
  }
}, {
  timestamps: true
});

// Indexes for better performance
tweetSchema.index({ author: 1, createdAt: -1 });
tweetSchema.index({ hashtags: 1 });
tweetSchema.index({ createdAt: -1 });
tweetSchema.index({ 'location.coordinates': '2dsphere' });

// Extract hashtags and mentions before saving
tweetSchema.pre('save', function(next) {
  if (this.isModified('content')) {
    // Extract hashtags
    this.hashtags = this.content.match(/#\w+/g) || [];
    this.hashtags = this.hashtags.map(tag => tag.slice(1).toLowerCase());
    
    // Extract mentions (simplified)
    const mentionMatches = this.content.match(/@\w+/g) || [];
    this.mentions = mentionMatches.map(mention => mention.slice(1));
  }
  
  if (this.isModified('content') && !this.isNew) {
    this.isEdited = true;
    this.editHistory.push({
      content: this.content,
      editedAt: new Date()
    });
  }
  
  next();
});

module.exports = mongoose.model('Tweet', tweetSchema);
