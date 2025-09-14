const Joi = require('joi');

// Common validation patterns
const patterns = {
  username: /^[a-zA-Z0-9_]{3,20}$/,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
  hashtag: /^#[a-zA-Z0-9_]+$/,
  mention: /^@[a-zA-Z0-9_]+$/
};

// Common validation messages
const messages = {
  username: 'Username must be 3-20 characters and can only contain letters, numbers, and underscores',
  email: 'Please provide a valid email address',
  password: 'Password must be at least 6 characters and contain at least one uppercase letter, one lowercase letter, and one number',
  required: 'This field is required',
  minLength: (length) => `Must be at least ${length} characters`,
  maxLength: (length) => `Must be less than ${length} characters`,
  invalidFormat: 'Invalid format'
};

// Schema for user registration
const registerSchema = Joi.object({
  username: Joi.string()
    .pattern(patterns.username)
    .required()
    .messages({
      'string.pattern.base': messages.username,
      'any.required': messages.required
    }),
  
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': messages.email,
      'any.required': messages.required
    }),
  
  password: Joi.string()
    .min(6)
    .pattern(patterns.password)
    .required()
    .messages({
      'string.min': messages.minLength(6),
      'string.pattern.base': messages.password,
      'any.required': messages.required
    }),
  
  name: Joi.string()
    .min(2)
    .max(50)
    .required()
    .messages({
      'string.min': messages.minLength(2),
      'string.max': messages.maxLength(50),
      'any.required': messages.required
    })
});

// Schema for user login
const loginSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': messages.email,
      'any.required': messages.required
    }),
  
  password: Joi.string()
    .required()
    .messages({
      'any.required': messages.required
    })
});

// Schema for tweet creation
const tweetSchema = Joi.object({
  content: Joi.string()
    .min(1)
    .max(280)
    .required()
    .messages({
      'string.min': 'Tweet cannot be empty',
      'string.max': 'Tweet cannot exceed 280 characters',
      'any.required': messages.required
    }),
  
  replyTo: Joi.string()
    .optional()
    .allow(null),
  
  quoteTweet: Joi.string()
    .optional()
    .allow(null),
  
  media: Joi.array()
    .items(Joi.string().uri())
    .max(4)
    .optional()
});

// Schema for user profile update
const profileSchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(50)
    .optional()
    .messages({
      'string.min': messages.minLength(2),
      'string.max': messages.maxLength(50)
    }),
  
  bio: Joi.string()
    .max(160)
    .optional()
    .allow('')
    .messages({
      'string.max': messages.maxLength(160)
    }),
  
  location: Joi.string()
    .max(30)
    .optional()
    .allow('')
    .messages({
      'string.max': messages.maxLength(30)
    }),
  
  website: Joi.string()
    .uri()
    .max(100)
    .optional()
    .allow('')
    .messages({
      'string.uri': 'Please provide a valid URL',
      'string.max': messages.maxLength(100)
    }),
  
  avatar: Joi.string()
    .uri()
    .optional()
    .allow('')
});

// Schema for password change
const passwordSchema = Joi.object({
  currentPassword: Joi.string()
    .required()
    .messages({
      'any.required': messages.required
    }),
  
  newPassword: Joi.string()
    .min(6)
    .pattern(patterns.password)
    .required()
    .messages({
      'string.min': messages.minLength(6),
      'string.pattern.base': messages.password,
      'any.required': messages.required
    })
});

// Schema for content moderation check
const moderationSchema = Joi.object({
  content: Joi.string()
    .min(1)
    .max(1000)
    .required()
    .messages({
      'string.min': 'Content cannot be empty',
      'string.max': 'Content cannot exceed 1000 characters',
      'any.required': messages.required
    })
});

// Generic validation function
const validate = (data, schema) => {
  const { error, value } = schema.validate(data, {
    abortEarly: false,
    stripUnknown: true
  });

  if (error) {
    const errors = error.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message
    }));
    
    return {
      isValid: false,
      errors,
      value: null
    };
  }

  return {
    isValid: true,
    errors: null,
    value
  };
};

// Quick validation functions
const validateEmail = (email) => {
  return patterns.email.test(email);
};

const validateUsername = (username) => {
  return patterns.username.test(username);
};

const validatePassword = (password) => {
  return password.length >= 6 && patterns.password.test(password);
};

const extractHashtags = (text) => {
  const matches = text.match(/#[a-zA-Z0-9_]+/g) || [];
  return matches.map(tag => tag.slice(1).toLowerCase());
};

const extractMentions = (text) => {
  const matches = text.match(/@[a-zA-Z0-9_]+/g) || [];
  return matches.map(mention => mention.slice(1).toLowerCase());
};

module.exports = {
  patterns,
  messages,
  schemas: {
    register: registerSchema,
    login: loginSchema,
    tweet: tweetSchema,
    profile: profileSchema,
    password: passwordSchema,
    moderation: moderationSchema
  },
  validate,
  validateEmail,
  validateUsername,
  validatePassword,
  extractHashtags,
  extractMentions
};
