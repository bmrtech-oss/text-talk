const express = require('express');
const {
  createTweet,
  getTimeline,
  getTweet,
  likeTweet,
  deleteTweet
} = require('../controllers/tweetController');
const auth = require('../middleware/auth');
const moderateContent = require('../middleware/moderation');
const { validateTweet } = require('../middleware/validation');
const { tweetLimiter } = require('../middleware/rateLimit');

const router = express.Router();

// All routes require authentication
router.use(auth);

// @route   POST /api/tweets
// @desc    Create a new tweet
// @access  Private
router.post('/', tweetLimiter, validateTweet, moderateContent, createTweet);

// @route   GET /api/tweets
// @desc    Get timeline tweets
// @access  Private
router.get('/', getTimeline);

// @route   GET /api/tweets/:id
// @desc    Get a specific tweet
// @access  Private
router.get('/:id', getTweet);

// @route   POST /api/tweets/:id/like
// @desc    Like or unlike a tweet
// @access  Private
router.post('/:id/like', likeTweet);

// @route   DELETE /api/tweets/:id
// @desc    Delete a tweet
// @access  Private
router.delete('/:id', deleteTweet);

module.exports = router;
