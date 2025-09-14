const express = require('express');
const {
  checkContentModeration,
  getModerationLogs,
  getModerationStats
} = require('../controllers/moderationController');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/moderation/check
// @desc    Check content for moderation
// @access  Private
router.post('/check', auth, checkContentModeration);

// @route   GET /api/moderation/logs
// @desc    Get moderation logs (admin only)
// @access  Private
router.get('/logs', auth, getModerationLogs);

// @route   GET /api/moderation/stats
// @desc    Get moderation statistics
// @access  Private
router.get('/stats', auth, getModerationStats);

module.exports = router;
