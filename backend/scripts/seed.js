const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../src/models/User');
const Tweet = require('../src/models/Tweet');

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB for seeding');

    // Clear existing data
    await User.deleteMany({});
    await Tweet.deleteMany({});

    // Create test users
    const users = await User.create([
      {
        username: 'john_doe',
        email: 'john@example.com',
        password: await bcrypt.hash('password123', 12),
        name: 'John Doe',
        bio: 'Software developer and tech enthusiast'
      },
      {
        username: 'jane_smith',
        email: 'jane@example.com',
        password: await bcrypt.hash('password123', 12),
        name: 'Jane Smith',
        bio: 'Digital artist and creative mind'
      },
      {
        username: 'tech_guru',
        email: 'guru@example.com',
        password: await bcrypt.hash('password123', 12),
        name: 'Tech Guru',
        bio: 'Sharing the latest in technology',
        isVerified: true
      }
    ]);

    // Create test tweets
    const tweets = await Tweet.create([
      {
        content: 'Just launched my new project! So excited to share it with everyone. #coding #tech',
        author: users[0]._id,
        moderationStatus: 'approved'
      },
      {
        content: 'Beautiful day for creating art. Inspiration is everywhere! 🎨 #art #creative',
        author: users[1]._id,
        moderationStatus: 'approved'
      },
      {
        content: 'The future of AI is incredible. Just saw the latest developments and my mind is blown! #ai #tech',
        author: users[2]._id,
        moderationStatus: 'approved'
      },
      {
        content: 'Working on a new feature for our app. Can\'t wait to show you what we\'ve been building! #development',
        author: users[0]._id,
        moderationStatus: 'approved'
      }
    ]);

    console.log(`Created ${users.length} users and ${tweets.length} tweets`);
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seed();
