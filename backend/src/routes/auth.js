const express = require('express');
const { body } = require('express-validator');
const {
  register,
  login,
  getProfile,
  updateProfile
} = require('../controllers/authController');
const auth = require('../middleware/auth');
const { validateRegistration } = require('../middleware/validation');

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', validateRegistration, register);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required')
], login);

// @route   GET /api/auth/me
// @desc    Get current user profile
// @access  Private
router.get('/me', auth, getProfile);

// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', auth, [
  body('name').optional().isLength({ max: 50 }).withMessage('Name must be less than 50 characters'),
  body('bio').optional().isLength({ max: 160 }).withMessage('Bio must be less than 160 characters'),
  body('location').optional().isLength({ max: 30 }).withMessage('Location must be less than 30 characters'),
  body('website').optional().isURL().withMessage('Please provide a valid URL')
], updateProfile);

module.exports = router;
