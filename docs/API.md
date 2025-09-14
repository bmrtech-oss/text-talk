I'll create the missing documentation files for you. Here are the complete `API.md`, `ARCHITECTURE.md`, and `DEPLOYMENT.md` files:

## 1. docs/API.md

```markdown
# Twitter Clone API Documentation

## Overview

The Twitter Clone API is a RESTful API built with Node.js and Express that provides endpoints for user authentication, tweet management, content moderation, and social features.

## Base URL

```
https://api.yourdomain.com/api
```

## Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:

```http
Authorization: Bearer <your_jwt_token>
```

## Response Format

All responses follow this format:

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {},
  "pagination": {}
}
```

## Error Responses

```json
{
  "success": false,
  "message": "Error description",
  "error": "Error code",
  "details": {}
}
```

## Rate Limiting

- **General endpoints**: 100 requests per 15 minutes
- **Authentication endpoints**: 5 requests per 15 minutes
- **Tweet creation**: 50 tweets per hour per user

## Endpoints

### Authentication

#### Register User
```http
POST /auth/register
```

**Request Body:**
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "Password123!",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "token": "jwt_token",
    "user": {
      "id": "user_id",
      "username": "johndoe",
      "email": "john@example.com",
      "name": "John Doe"
    }
  }
}
```

#### Login User
```http
POST /auth/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "Password123!"
}
```

**Response:** Same as register response

#### Get Current User
```http
GET /auth/me
```

**Headers:**
```http
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "username": "johndoe",
      "email": "john@example.com",
      "name": "John Doe",
      "bio": "Software developer",
      "avatar": "https://example.com/avatar.jpg",
      "followersCount": 42,
      "followingCount": 15,
      "tweetCount": 123
    }
  }
}
```

#### Update Profile
```http
PUT /auth/profile
```

**Headers:**
```http
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "John Updated",
  "bio": "Updated bio",
  "location": "New York",
  "website": "https://john.com",
  "avatar": "https://example.com/new-avatar.jpg"
}
```

### Tweets

#### Create Tweet
```http
POST /tweets
```

**Headers:**
```http
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "content": "This is my first tweet! #excited",
  "replyTo": "tweet_id_optional",
  "quoteTweet": "tweet_id_optional",
  "media": ["https://example.com/image1.jpg"]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Tweet created successfully",
  "data": {
    "tweet": {
      "id": "tweet_id",
      "content": "This is my first tweet! #excited",
      "author": {
        "id": "user_id",
        "username": "johndoe",
        "name": "John Doe",
        "avatar": "https://example.com/avatar.jpg"
      },
      "likes": 0,
      "retweets": 0,
      "replies": 0,
      "isLiked": false,
      "isRetweeted": false,
      "hashtags": ["excited"],
      "mentions": [],
      "createdAt": "2023-12-01T10:30:00.000Z",
      "moderationStatus": "approved"
    }
  }
}
```

#### Get Timeline
```http
GET /tweets?page=1&limit=20
```

**Headers:**
```http
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20, max: 50)

**Response:**
```json
{
  "success": true,
  "data": {
    "tweets": [
      {
        "id": "tweet_id",
        "content": "Tweet content",
        "author": {...},
        "likes": 42,
        "retweets": 15,
        "createdAt": "2023-12-01T10:30:00.000Z",
        "isLiked": false,
        "isRetweeted": false
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "pages": 8
    }
  }
}
```

#### Get Tweet by ID
```http
GET /tweets/:id
```

**Headers:**
```http
Authorization: Bearer <token>
```

**Response:** Single tweet object

#### Like/Unlike Tweet
```http
POST /tweets/:id/like
```

**Headers:**
```http
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Tweet liked",
  "data": {
    "likes": 43
  }
}
```

#### Delete Tweet
```http
DELETE /tweets/:id
```

**Headers:**
```http
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Tweet deleted successfully"
}
```

### Users

#### Get User Profile
```http
GET /users/:username
```

**Headers:**
```http
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "username": "johndoe",
      "name": "John Doe",
      "bio": "Software developer",
      "avatar": "https://example.com/avatar.jpg",
      "coverPhoto": "https://example.com/cover.jpg",
      "location": "New York",
      "website": "https://john.com",
      "followersCount": 42,
      "followingCount": 15,
      "tweetCount": 123,
      "isVerified": false,
      "isFollowing": true,
      "createdAt": "2023-01-01T00:00:00.000Z"
    }
  }
}
```

#### Get User Tweets
```http
GET /users/:username/tweets?page=1&limit=20
```

**Headers:**
```http
Authorization: Bearer <token>
```

**Response:** Same format as timeline

#### Follow/Unfollow User
```http
POST /users/:username/follow
```

**Headers:**
```http
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Followed successfully",
  "data": {
    "following": true,
    "followersCount": 43
  }
}
```

#### Search Users
```http
GET /users/search?q=john&page=1&limit=20
```

**Headers:**
```http
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": "user_id",
        "username": "johndoe",
        "name": "John Doe",
        "avatar": "https://example.com/avatar.jpg",
        "bio": "Software developer",
        "followersCount": 42,
        "isFollowing": false
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 5,
      "pages": 1
    }
  }
}
```

### Moderation

#### Check Content
```http
POST /moderation/check
```

**Headers:**
```http
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "content": "Text to moderate"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "content": "Text to moderate",
    "moderationResult": {
      "isApproved": true,
      "violations": [],
      "confidence": 0.95,
      "suggestedChanges": [],
      "moderatedBy": "ai_system"
    },
    "timestamp": "2023-12-01T10:30:00.000Z"
  }
}
```

#### Get Moderation Logs
```http
GET /moderation/logs?page=1&limit=20&status=approved
```

**Headers:**
```http
Authorization: Bearer <token>
```

**Query Parameters:**
- `page`, `limit`: Pagination
- `status`: Filter by status (approved, rejected, pending)
- `action`: Filter by action (create, update, delete)
- `author`: Filter by user ID

**Response:**
```json
{
  "success": true,
  "data": {
    "logs": [
      {
        "id": "log_id",
        "content": "Tweet content",
        "action": "create",
        "moderationResult": {
          "isApproved": true,
          "violations": [],
          "confidence": 0.95
        },
        "author": {
          "id": "user_id",
          "username": "johndoe"
        },
        "createdAt": "2023-12-01T10:30:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "pages": 8
    }
  }
}
```

## WebSocket Events

### Connection
```javascript
const socket = io('https://api.yourdomain.com', {
  auth: {
    token: 'jwt_token'
  }
});
```

### Events

#### Tweet Created
```javascript
socket.on('tweet_created', (data) => {
  console.log('New tweet:', data.tweet);
});
```

#### Tweet Liked
```javascript
socket.on('like_added', (data) => {
  console.log('Tweet liked:', data.tweetId, data.userId);
});
```

#### Notification
```javascript
socket.on('notification', (data) => {
  console.log('New notification:', data);
});
```

## Error Codes

| Code | Description | HTTP Status |
|------|-------------|-------------|
| `INVALID_CREDENTIALS` | Invalid email or password | 401 |
| `USER_NOT_FOUND` | User not found | 404 |
| `INVALID_TOKEN` | Invalid authentication token | 401 |
| `ACCESS_DENIED` | Insufficient permissions | 403 |
| `VALIDATION_ERROR` | Input validation failed | 400 |
| `RESOURCE_NOT_FOUND` | Requested resource not found | 404 |
| `CONTENT_VIOLATION` | Content violates guidelines | 400 |
| `RATE_LIMIT_EXCEEDED` | Too many requests | 429 |

## Pagination

All list endpoints support pagination:

```http
GET /endpoint?page=2&limit=25
```

Response includes pagination metadata:

```json
{
  "pagination": {
    "page": 2,
    "limit": 25,
    "total": 150,
    "pages": 6
  }
}
```

## Filtering and Sorting

Some endpoints support filtering:

```http
GET /tweets?hashtag=technology&sort=popular
```

Available sort options:
- `recent` (default): Most recent first
- `popular`: Most likes and retweets
- `controversial`: Most engagement

## Rate Limit Headers

Rate limit information is included in response headers:

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1638352800
```

## Health Check

```http
GET /health
```

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2023-12-01T10:30:00.000Z",
  "services": {
    "database": "connected",
    "redis": "connected",
    "moderation": "available"
  }
}
```

## Examples

### JavaScript Fetch Example
```javascript
const API_BASE = 'https://api.yourdomain.com/api';

async function createTweet(content) {
  const response = await fetch(`${API_BASE}/tweets`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify({ content })
  });
  
  if (!response.ok) {
    throw new Error('Failed to create tweet');
  }
  
  return response.json();
}
```

### React Hook Example
```javascript
import { useMutation } from 'react-query';

const useCreateTweet = () => {
  return useMutation((content) => {
    return fetch('/api/tweets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ content })
    });
  });
};
```

## Changelog

### v1.0.0 (2023-12-01)
- Initial API release
- User authentication
- Tweet management
- Content moderation
- Social features

### v1.1.0 (Upcoming)
- Direct messages
- Lists and bookmarks
- Advanced search
- Media uploads
```

