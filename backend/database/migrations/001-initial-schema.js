// MongoDB migration script for initial schema setup
// Run with: mongosh "mongodb://localhost:27017/twitter_clone" migrations/001-initial-schema.js

print('Running migration: 001-initial-schema.js');

// Connect to database
db = db.getSiblingDB('twitter_clone');

// Add additional indexes for performance
print('Adding additional indexes...');

// Compound index for user following functionality
db.users.createIndex({ 
  followers: 1, 
  createdAt: -1 
}, { 
  name: 'users_followers_created_index' 
});

db.users.createIndex({ 
  following: 1, 
  createdAt: -1 
}, { 
  name: 'users_following_created_index' 
});

// Index for tweet engagement metrics
db.tweets.createIndex({ 
  likes: -1, 
  createdAt: -1 
}, { 
  name: 'tweets_popularity_index' 
});

db.tweets.createIndex({ 
  retweets: -1, 
  createdAt: -1 
}, { 
  name: 'tweets_virality_index' 
});

// Index for moderation analytics
db.moderationlogs.createIndex({ 
  createdAt: 1, 
  'moderationResult.isApproved': 1 
}, { 
  name: 'moderation_analytics_index' 
});

// Add TTL index for automatic data expiration (optional)
// db.sessions.createIndex({ "expiresAt": 1 }, { expireAfterSeconds: 0 });

print('Migration 001 completed successfully!');