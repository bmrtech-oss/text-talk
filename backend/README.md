# Text Talk Backend API

A Node.js/Express backend API for a Twitter-like social media platform with content moderation features.

## Features

- User authentication (JWT)
- Tweet management
- AI-powered content moderation
- Rate limiting
- Redis caching
- MongoDB database

## API Endpoints

### Authentication
- POST /api/auth/register - Register a new user
- POST /api/auth/login - Login user
- GET /api/auth/me - Get current user profile
- POST /api/auth/logout - Logout user

### Tweets
- GET /api/tweets - Get all tweets (with pagination)
- POST /api/tweets - Create a new tweet (with moderation)
- GET /api/tweets/:id - Get a specific tweet
- PUT /api/tweets/:id - Update a tweet
- DELETE /api/tweets/:id - Delete a tweet
- POST /api/tweets/:id/like - Like a tweet
- POST /api/tweets/:id/retweet - Retweet a tweet

### Users
- GET /api/users - Get all users
- GET /api/users/:id - Get a specific user
- GET /api/users/:id/tweets - Get tweets by a user
- PUT /api/users/:id - Update user profile

### Moderation
- GET /api/moderation/logs - Get moderation logs (admin only)
- POST /api/moderation/check - Check text for moderation

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. Start the development server:
```bash
npm run dev
```

## Environment Variables

- PORT - Server port (default: 5000)
- MONGODB_URI - MongoDB connection string
- REDIS_URL - Redis connection URL
- JWT_SECRET - JWT secret key
- MODERATION_API_KEY - API key for content moderation service
- NODE_ENV - Environment (development/production)

## Deployment

### Using Docker
```bash
docker build -t twitter-clone-backend .
docker run -p 5000:5000 --env-file .env twitter-clone-backend
```

### Using PM2
```bash
npm install -g pm2
pm2 start server.js --name twitter-backend
```
