// API Base URLs
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const WS_BASE_URL = process.env.REACT_APP_WS_URL || 'ws://localhost:5000';

// API Endpoints
const ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
    PROFILE: '/auth/profile',
    CHANGE_PASSWORD: '/auth/change-password',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    REFRESH_TOKEN: '/auth/refresh-token'
  },

  // Tweet endpoints
  TWEETS: {
    BASE: '/tweets',
    GET: '/tweets',
    CREATE: '/tweets',
    GET_BY_ID: '/tweets/:id',
    UPDATE: '/tweets/:id',
    DELETE: '/tweets/:id',
    LIKE: '/tweets/:id/like',
    RETWEET: '/tweets/:id/retweet',
    REPLIES: '/tweets/:id/replies',
    SEARCH: '/tweets/search',
    TRENDING: '/tweets/trending',
    TIMELINE: '/tweets/timeline'
  },

  // User endpoints
  USERS: {
    BASE: '/users',
    GET: '/users/:username',
    SEARCH: '/users/search',
    FOLLOW: '/users/:username/follow',
    UNFOLLOW: '/users/:username/unfollow',
    FOLLOWERS: '/users/:username/followers',
    FOLLOWING: '/users/:username/following',
    TWEETS: '/users/:username/tweets',
    SUGGESTED: '/users/suggested',
    BLOCK: '/users/:username/block',
    UNBLOCK: '/users/:username/unblock',
    BLOCKED: '/users/blocked'
  },

  // Moderation endpoints
  MODERATION: {
    CHECK: '/moderation/check',
    LOGS: '/moderation/logs',
    STATS: '/moderation/stats',
    APPEAL: '/moderation/appeal',
    GUIDELINES: '/moderation/guidelines',
    REPORT: '/moderation/report'
  }
};

// HTTP Status Codes
const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503
};

// API Error Codes
const ERROR_CODES = {
  // Authentication errors
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  USER_DEACTIVATED: 'USER_DEACTIVATED',
  INVALID_TOKEN: 'INVALID_TOKEN',
  EXPIRED_TOKEN: 'EXPIRED_TOKEN',
  ACCESS_DENIED: 'ACCESS_DENIED',

  // Validation errors
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INVALID_EMAIL: 'INVALID_EMAIL',
  INVALID_USERNAME: 'INVALID_USERNAME',
  INVALID_PASSWORD: 'INVALID_PASSWORD',
  PASSWORD_MISMATCH: 'PASSWORD_MISMATCH',

  // Resource errors
  RESOURCE_NOT_FOUND: 'RESOURCE_NOT_FOUND',
  RESOURCE_CONFLICT: 'RESOURCE_CONFLICT',
  RESOURCE_LIMIT: 'RESOURCE_LIMIT',

  // Moderation errors
  CONTENT_VIOLATION: 'CONTENT_VIOLATION',
  MODERATION_FAILED: 'MODERATION_FAILED',

  // System errors
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED'
};

// API Defaults
const API_DEFAULTS = {
  PAGE: 1,
  LIMIT: 20,
  MAX_LIMIT: 100,
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000
};

// WebSocket Events
const WS_EVENTS = {
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  ERROR: 'error',
  TWEET_CREATED: 'tweet_created',
  TWEET_UPDATED: 'tweet_updated',
  TWEET_DELETED: 'tweet_deleted',
  LIKE_ADDED: 'like_added',
  LIKE_REMOVED: 'like_removed',
  RETWEET_ADDED: 'retweet_added',
  RETWEET_REMOVED: 'retweet_removed',
  NOTIFICATION: 'notification',
  USER_ONLINE: 'user_online',
  USER_OFFLINE: 'user_offline'
};

module.exports = {
  API_BASE_URL,
  WS_BASE_URL,
  ENDPOINTS,
  HTTP_STATUS,
  ERROR_CODES,
  API_DEFAULTS,
  WS_EVENTS
};
