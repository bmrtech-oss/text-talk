// MongoDB migration script for analytics features
// Run with: mongosh "mongodb://localhost:27017/twitter_clone" migrations/002-add-analytics.js

print('Running migration: 002-add-analytics.js');

db = db.getSiblingDB('twitter_clone');

// Create analytics collection for aggregated data
if (!db.getCollectionNames().includes('analytics')) {
  print('Creating analytics collection...');
  
  db.createCollection('analytics', {
    validator: {
      $jsonSchema: {
        bsonType: 'object',
        required: ['type', 'date', 'metrics'],
        properties: {
          type: {
            bsonType: 'string',
            enum: ['daily', 'weekly', 'monthly']
          },
          date: {
            bsonType: 'date'
          },
          metrics: {
            bsonType: 'object',
            properties: {
              totalUsers: { bsonType: 'int' },
              activeUsers: { bsonType: 'int' },
              totalTweets: { bsonType: 'int' },
              tweetsToday: { bsonType: 'int' },
              moderationApproved: { bsonType: 'int' },
              moderationRejected: { bsonType: 'int' },
              averageResponseTime: { bsonType: 'double' }
            }
          }
        }
      }
    }
  });
  
  db.analytics.createIndex({ type: 1, date: 1 }, { unique: true, name: 'analytics_type_date_unique' });
}

// Add user engagement metrics to users collection
print('Adding engagement metrics to users...');

db.users.updateMany({}, {
  $set: {
    'metrics.tweetCount': 0,
    'metrics.followerCount': 0,
    'metrics.followingCount': 0,
    'metrics.likeCount': 0,
    'metrics.retweetCount': 0,
    'metrics.lastActive': new Date()
  }
});

// Add tweet engagement metrics to tweets collection
print('Adding engagement metrics to tweets...');

db.tweets.updateMany({}, {
  $set: {
    'metrics.likeCount': { $size: '$likes' },
    'metrics.retweetCount': { $size: '$retweets' },
    'metrics.replyCount': { $size: '$replies' },
    'metrics.viewCount': 0
  }
});

print('Migration 002 completed successfully!');
