// User types
const User = {
  id: 'string',
  username: 'string',
  email: 'string',
  name: 'string',
  bio: 'string?',
  location: 'string?',
  website: 'string?',
  avatar: 'string?',
  coverPhoto: 'string?',
  isVerified: 'boolean',
  isActive: 'boolean',
  followersCount: 'number',
  followingCount: 'number',
  tweetCount: 'number',
  createdAt: 'string',
  updatedAt: 'string'
};

// Tweet types
const Tweet = {
  id: 'string',
  content: 'string',
  author: 'User',
  likes: 'number',
  retweets: 'number',
  replies: 'number',
  isLiked: 'boolean',
  isRetweeted: 'boolean',
  media: 'string[]',
  hashtags: 'string[]',
  mentions: 'User[]',
  viewCount: 'number',
  isEdited: 'boolean',
  moderationStatus: 'string',
  createdAt: 'string',
  updatedAt: 'string'
};

// API Response types
const ApiResponse = {
  success: 'boolean',
  message: 'string?',
  data: 'any?',
  error: 'string?',
  pagination: {
    page: 'number',
    limit: 'number',
    total: 'number',
    pages: 'number'
  }
};

// Pagination types
const PaginationParams = {
  page: 'number?',
  limit: 'number?'
};

// Auth types
const AuthTokens = {
  accessToken: 'string',
  refreshToken: 'string?',
  expiresIn: 'number'
};

const LoginCredentials = {
  email: 'string',
  password: 'string',
  rememberMe: 'boolean?'
};

const RegisterData = {
  username: 'string',
  email: 'string',
  password: 'string',
  name: 'string'
};

// Moderation types
const ModerationResult = {
  isApproved: 'boolean',
  violations: 'string[]',
  confidence: 'number',
  suggestedChanges: 'string[]',
  moderatedBy: 'string'
};

const ModerationLog = {
  id: 'string',
  content: 'string',
  author: 'User',
  tweet: 'Tweet?',
  action: 'string',
  moderationResult: 'ModerationResult',
  countryCode: 'string',
  ipAddress: 'string',
  userAgent: 'string?',
  createdAt: 'string'
};

// Export all types
module.exports = {
  User,
  Tweet,
  ApiResponse,
  PaginationParams,
  AuthTokens,
  LoginCredentials,
  RegisterData,
  ModerationResult,
  ModerationLog
};