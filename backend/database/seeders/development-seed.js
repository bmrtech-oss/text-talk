// Development data seeder for MongoDB
// Run with: mongosh "mongodb://localhost:27017/twitter_clone" seeders/development-seed.js

print('Seeding development data...');

db = db.getSiblingDB('twitter_clone');

// Clear existing data (optional - be careful in production!)
if (process.env.NODE_ENV === 'development') {
  print('Clearing existing data...');
  db.users.deleteMany({});
  db.tweets.deleteMany({});
  db.moderationlogs.deleteMany({});
}

// Helper function to generate random data
function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

// Sample data
const sampleNames = ['John Doe', 'Jane Smith', 'Alice Johnson', 'Bob Brown', 'Charlie Wilson', 'Diana Davis', 'Eve Miller', 'Frank Moore'];
const sampleUsernames = ['johndoe', 'janesmith', 'alicej', 'bobbrown', 'charliew', 'dianad', 'evemiller', 'frankm'];
const sampleEmails = sampleUsernames.map(u => `${u}@example.com`);
const sampleBios = [
  'Software developer and tech enthusiast',
  'Digital artist and creative mind',
  'Love to travel and explore new places',
  'Food lover and amateur chef',
  'Fitness enthusiast and health coach',
  'Book worm and coffee addict',
  'Music producer and DJ',
  'Photographer and nature lover'
];
const sampleLocations = ['New York', 'London', 'Tokyo', 'Paris', 'Berlin', 'Sydney', 'Toronto', 'San Francisco'];
const sampleHashtags = ['technology', 'art', 'travel', 'food', 'fitness', 'books', 'music', 'photography'];

// Create users
print('Creating users...');
const users = [];

for (let i = 0; i < sampleNames.length; i++) {
  const user = {
    username: sampleUsernames[i],
    email: sampleEmails[i],
    password: '$2b$12$EXAMPLEHASHEDPASSWORD', // bcrypt hash of "password123"
    name: sampleNames[i],
    bio: sampleBios[i],
    location: sampleLocations[i],
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${sampleUsernames[i]}`,
    coverPhoto: `https://picsum.photos/800/300?random=${i}`,
    followers: [],
    following: [],
    isVerified: i < 2, // First two users are verified
    isActive: true,
    preferences: {
      theme: getRandomElement(['light', 'dark', 'auto']),
      language: 'en',
      protected: false
    },
    metrics: {
      tweetCount: 0,
      followerCount: 0,
      followingCount: 0,
      likeCount: 0,
      retweetCount: 0,
      lastActive: new Date()
    },
    createdAt: getRandomDate(new Date(2023, 0, 1), new Date()),
    updatedAt: new Date()
  };
  
  const result = db.users.insertOne(user);
  users.push({ ...user, _id: result.insertedId });
}

// Create follow relationships
print('Creating follow relationships...');
users.forEach((user, index) => {
  const followers = users
    .filter((_, i) => i !== index && Math.random() > 0.5)
    .map(u => u._id);
  
  const following = users
    .filter((_, i) => i !== index && Math.random() > 0.5)
    .map(u => u._id);
  
  db.users.updateOne(
    { _id: user._id },
    {
      $set: {
        followers: followers,
        following: following,
        'metrics.followerCount': followers.length,
        'metrics.followingCount': following.length
      }
    }
  );
});

// Create tweets
print('Creating tweets...');
const sampleTweetContents = [
  'Just launched my new project! So excited to share it with everyone. #technology #coding',
  'Beautiful day for creating art. Inspiration is everywhere! 🎨 #art #creative',
  'Exploring new places and making memories. Travel is the best teacher. #travel #adventure',
  'Cooked an amazing meal today. Food brings people together! 🍳 #food #cooking',
  'Great workout session this morning. Fitness is a journey, not a destination. 💪 #fitness #health',
  'Just finished reading an incredible book. Always learning, always growing. 📚 #books #learning',
  'Working on some new music tracks. Creativity flows when you least expect it. 🎵 #music #production',
  'Captured some stunning photos today. Nature is the best artist. 📸 #photography #nature'
];

users.forEach((user, userIndex) => {
  const tweetCount = Math.floor(Math.random() * 5) + 3; // 3-7 tweets per user
  
  for (let i = 0; i < tweetCount; i++) {
    const tweetContent = sampleTweetContents[userIndex] || 
      `This is my ${i + 1}${i === 0 ? 'st' : i === 1 ? 'nd' : i === 2 ? 'rd' : 'th'} tweet! #${getRandomElement(sampleHashtags)}`;
    
    const tweet = {
      content: tweetContent,
      author: user._id,
      likes: users.slice(0, Math.floor(Math.random() * users.length)).map(u => u._id),
      retweets: users.slice(0, Math.floor(Math.random() * 3)).map(u => u._id),
      replies: [],
      media: Math.random() > 0.7 ? [`https://picsum.photos/600/400?random=${userIndex}${i}`] : [],
      hashtags: tweetContent.match(/#\w+/g) ? tweetContent.match(/#\w+/g).map(tag => tag.slice(1).toLowerCase()) : [],
      mentions: [],
      viewCount: Math.floor(Math.random() * 1000),
      isEdited: Math.random() > 0.9,
      moderationStatus: 'approved',
      metrics: {
        likeCount: 0,
        retweetCount: 0,
        replyCount: 0,
        viewCount: Math.floor(Math.random() * 1000)
      },
      createdAt: getRandomDate(new Date(2023, 6, 1), new Date()),
      updatedAt: new Date()
    };
    
    tweet.metrics.likeCount = tweet.likes.length;
    tweet.metrics.retweetCount = tweet.retweets.length;
    
    const result = db.tweets.insertOne(tweet);
    
    // Update user tweet count
    db.users.updateOne(
      { _id: user._id },
      { $inc: { 'metrics.tweetCount': 1 } }
    );
  }
});

// Update tweet metrics with actual counts
print('Updating tweet metrics...');
const tweets = db.tweets.find().toArray();

tweets.forEach(tweet => {
  db.tweets.updateOne(
    { _id: tweet._id },
    {
      $set: {
        'metrics.likeCount': tweet.likes.length,
        'metrics.retweetCount': tweet.retweets.length,
        'metrics.replyCount': tweet.replies.length
      }
    }
  );
});

print('Development data seeding completed!');
print(`Created: ${users.length} users, ${db.tweets.countDocuments()} tweets`);
