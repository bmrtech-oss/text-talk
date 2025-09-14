// MongoDB initialization script for Twitter Clone
// This script runs when MongoDB container starts

// Create database and collections with validation
db = db.getSiblingDB('twitter_clone');

print('Initializing Twitter Clone database...');

// Create users collection with validation
db.createCollection('users', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['username', 'email', 'password', 'name'],
      properties: {
        username: {
          bsonType: 'string',
          description: 'Username must be a string and is required',
          minLength: 3,
          maxLength: 20,
          pattern: '^[a-zA-Z0-9_]+$'
        },
        email: {
          bsonType: 'string',
          description: 'Email must be a valid email address and is required',
          pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'
        },
        password: {
          bsonType: 'string',
          description: 'Password must be a string and is required',
          minLength: 6
        },
        name: {
          bsonType: 'string',
          description: 'Name must be a string and is required',
          minLength: 2,
          maxLength: 50
        },
        bio: {
          bsonType: 'string',
          description: 'Bio must be a string if provided',
          maxLength: 160
        },
        location: {
          bsonType: 'string',
          maxLength: 30
        },
        website: {
          bsonType: 'string',
          pattern: '^(https?:\\/\\/)?([\\da-z.-]+)\\.([a-z.]{2,6})([\\/\\w .-]*)*\\/?$'
        },
        avatar: {
          bsonType: 'string'
        },
        coverPhoto: {
          bsonType: 'string'
        },
        isVerified: {
          bsonType: 'bool'
        },
        isActive: {
          bsonType: 'bool'
        },
        preferences: {
          bsonType: 'object'
        }
      }
    }
  }
});

// Create tweets collection with validation
db.createCollection('tweets', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['content', 'author'],
      properties: {
        content: {
          bsonType: 'string',
          description: 'Tweet content must be a string and is required',
          minLength: 1,
          maxLength: 280
        },
        author: {
          bsonType: 'objectId',
          description: 'Author reference is required'
        },
        likes: {
          bsonType: 'array',
          items: {
            bsonType: 'objectId'
          }
        },
        retweets: {
          bsonType: 'array',
          items: {
            bsonType: 'objectId'
          }
        },
        replies: {
          bsonType: 'array',
          items: {
            bsonType: 'objectId'
          }
        },
        replyTo: {
          bsonType: 'objectId'
        },
        quoteTweet: {
          bsonType: 'objectId'
        },
        media: {
          bsonType: 'array',
          items: {
            bsonType: 'string'
          },
          maxItems: 4
        },
        hashtags: {
          bsonType: 'array',
          items: {
            bsonType: 'string'
          }
        },
        mentions: {
          bsonType: 'array',
          items: {
            bsonType: 'objectId'
          }
        },
        viewCount: {
          bsonType: 'int',
          minimum: 0
        },
        isEdited: {
          bsonType: 'bool'
        },
        editHistory: {
          bsonType: 'array'
        },
        moderationStatus: {
          bsonType: 'string',
          enum: ['pending', 'approved', 'rejected', 'flagged']
        },
        moderationDetails: {
          bsonType: 'object'
        },
        location: {
          bsonType: 'object'
        }
      }
    }
  }
});

// Create moderation logs collection
db.createCollection('moderationlogs', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['content', 'author', 'action', 'moderationResult'],
      properties: {
        content: {
          bsonType: 'string',
          minLength: 1,
          maxLength: 1000
        },
        author: {
          bsonType: 'objectId'
        },
        tweet: {
          bsonType: 'objectId'
        },
        action: {
          bsonType: 'string',
          enum: ['create', 'update', 'delete']
        },
        moderationResult: {
          bsonType: 'object',
          required: ['isApproved'],
          properties: {
            isApproved: {
              bsonType: 'bool'
            },
            violations: {
              bsonType: 'array',
              items: {
                bsonType: 'string',
                enum: ['hate_speech', 'harassment', 'violence', 'spam', 'false_info', 'other']
              }
            },
            confidence: {
              bsonType: 'double',
              minimum: 0,
              maximum: 1
            },
            suggestedChanges: {
              bsonType: 'array',
              items: {
                bsonType: 'string'
              }
            },
            moderatedBy: {
              bsonType: 'string',
              enum: ['ai', 'human', 'hybrid']
            }
          }
        },
        countryCode: {
          bsonType: 'string',
          maxLength: 2
        },
        ipAddress: {
          bsonType: 'string'
        },
        userAgent: {
          bsonType: 'string'
        }
      }
    }
  }
});

// Create indexes for better performance
print('Creating indexes...');

// Users collection indexes
db.users.createIndex({ username: 1 }, { unique: true, name: 'username_unique' });
db.users.createIndex({ email: 1 }, { unique: true, name: 'email_unique' });
db.users.createIndex({ createdAt: -1 }, { name: 'users_created_at_desc' });
db.users.createIndex({ 'preferences.theme': 1 }, { name: 'users_theme_index' });

// Tweets collection indexes
db.tweets.createIndex({ author: 1, createdAt: -1 }, { name: 'tweets_author_created_desc' });
db.tweets.createIndex({ hashtags: 1 }, { name: 'tweets_hashtags_index' });
db.tweets.createIndex({ 'location.coordinates': '2dsphere' }, { name: 'tweets_location_geo' });
db.tweets.createIndex({ createdAt: -1 }, { name: 'tweets_created_at_desc' });
db.tweets.createIndex({ moderationStatus: 1 }, { name: 'tweets_moderation_status' });
db.tweets.createIndex({ replyTo: 1 }, { name: 'tweets_reply_to_index' });

// Moderation logs indexes
db.moderationlogs.createIndex({ author: 1, createdAt: -1 }, { name: 'moderation_logs_author_created' });
db.moderationlogs.createIndex({ 'moderationResult.isApproved': 1 }, { name: 'moderation_logs_approved_index' });
db.moderationlogs.createIndex({ createdAt: -1 }, { name: 'moderation_logs_created_at_desc' });
db.moderationlogs.createIndex({ countryCode: 1 }, { name: 'moderation_logs_country_index' });

// Create text indexes for search functionality
db.users.createIndex({ 
  username: 'text', 
  name: 'text', 
  bio: 'text' 
}, { 
  name: 'users_text_search',
  weights: {
    username: 10,
    name: 5,
    bio: 1
  }
});

db.tweets.createIndex({ 
  content: 'text',
  hashtags: 'text'
}, { 
  name: 'tweets_text_search',
  weights: {
    content: 10,
    hashtags: 5
  }
});

print('Database initialization completed successfully!');

// Create initial admin user for development
if (db.users.countDocuments({ username: 'admin' }) === 0) {
  print('Creating initial admin user...');
  
  const bcrypt = require('bcryptjs');
  const hashedPassword = bcrypt.hashSync('admin123', 12);
  
  db.users.insertOne({
    username: 'admin',
    email: 'admin@example.com',
    password: hashedPassword,
    name: 'Administrator',
    bio: 'System Administrator',
    isVerified: true,
    isActive: true,
    preferences: {
      theme: 'dark',
      language: 'en',
      protected: false
    },
    createdAt: new Date(),
    updatedAt: new Date()
  });
  
  print('Admin user created: username=admin, password=admin123');
}

print('Twitter Clone database is ready!');
