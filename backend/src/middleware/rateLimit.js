const rateLimit = require('express-rate-limit');

// General rate limiter
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    message: 'Too many requests from this IP, please try again later.'
  }
});

// Strict rate limiter for sensitive endpoints
const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: {
    message: 'Too many attempts from this IP, please try again later.'
  }
});

// Tweet creation rate limiter
const tweetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50, // limit each user to 50 tweets per hour
  keyGenerator: (req) => {
    return req.user ? req.user.id : req.ip;
  },
  message: {
    message: 'You have exceeded the tweet limit. Please try again later.'
  }
});

module.exports = {
  generalLimiter,
  strictLimiter,
  tweetLimiter
};
