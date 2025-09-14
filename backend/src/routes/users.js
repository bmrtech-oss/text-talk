const express = require('express');
const {
  getUserProfile,
  getUserTweets,
  followUser,
  searchUsers
} = require('../controllers/userController');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/users/:username
// @desc    Get user profile
// @access  Private
router.get('/:username', auth, getUserProfile);

// @route   GET /api/users/:username/tweets
// @desc    Get user tweets
// @access  Private
router.get('/:username/tweets', auth, getUserTweets);

// @route   POST /api/users/:username/follow
// @desc    Follow or unfollow a user
// @access  Private
router.post('/:username/follow', auth, followUser);

// @route   GET /api/users/search
// @desc    Search users
// @access  Private
router.get('/search', auth, searchUsers);

module.exports = router;
