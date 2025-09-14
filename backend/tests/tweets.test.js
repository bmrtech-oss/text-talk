const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('../models/User');
const Tweet = require('../models/Tweet');

describe('Tweets API Tests', () => {
  let authToken;
  let userId;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI_TEST, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    await User.deleteMany({});
    await Tweet.deleteMany({});
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await User.deleteMany({});
    await Tweet.deleteMany({});

    // Create a test user and get auth token
    const user = await User.create({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123'
    });

    userId = user._id;

    // Login to get token
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });

    authToken = loginResponse.body.token;
  });

  describe('POST /api/tweets', () => {
    it('should create a new tweet', async () => {
      const response = await request(app)
        .post('/api/tweets')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          content: 'This is a test tweet'
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('tweet');
      expect(response.body.tweet).toHaveProperty('content', 'This is a test tweet');
    });

    it('should not create tweet with empty content', async () => {
      const response = await request(app)
        .post('/api/tweets')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          content: ''
        });

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/tweets', () => {
    it('should get timeline tweets', async () => {
      // Create a test tweet
      await Tweet.create({
        content: 'Test tweet for timeline',
        author: userId
      });

      const response = await request(app)
        .get('/api/tweets')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('tweets');
      expect(response.body.tweets.length).toBeGreaterThan(0);
    });
  });
});
