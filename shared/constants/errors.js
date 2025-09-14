// Error messages for different error codes
const ERROR_MESSAGES = {
  // Authentication errors
  INVALID_CREDENTIALS: 'Invalid email or password',
  USER_NOT_FOUND: 'User not found',
  USER_DEACTIVATED: 'Your account has been deactivated',
  INVALID_TOKEN: 'Invalid authentication token',
  EXPIRED_TOKEN: 'Authentication token has expired',
  ACCESS_DENIED: 'You do not have permission to perform this action',

  // Validation errors
  VALIDATION_ERROR: 'Validation failed',
  INVALID_EMAIL: 'Please provide a valid email address',
  INVALID_USERNAME: 'Username must be 3-20 characters and can only contain letters, numbers, and underscores',
  INVALID_PASSWORD: 'Password must be at least 6 characters and contain at least one uppercase letter, one lowercase letter, and one number',
  PASSWORD_MISMATCH: 'Passwords do not match',

  // Resource errors
  RESOURCE_NOT_FOUND: 'The requested resource was not found',
  RESOURCE_CONFLICT: 'A resource with this identifier already exists',
  RESOURCE_LIMIT: 'You have reached the maximum limit for this resource',

  // Moderation errors
  CONTENT_VIOLATION: 'This content violates our community guidelines',
  MODERATION_FAILED: 'Content moderation check failed',

  // System errors
  INTERNAL_ERROR: 'An internal server error occurred',
  SERVICE_UNAVAILABLE: 'Service is temporarily unavailable',
  RATE_LIMIT_EXCEEDED: 'Too many requests. Please try again later.',

  // Default error message
  DEFAULT: 'An unexpected error occurred'
};

// User-friendly error messages for display
const USER_FRIENDLY_ERRORS = {
  NETWORK_ERROR: 'Network connection failed. Please check your internet connection.',
  TIMEOUT_ERROR: 'Request timed out. Please try again.',
  SERVER_ERROR: 'Server is temporarily unavailable. Please try again later.',
  MAINTENANCE: 'Service is under maintenance. Please try again later.',
  UNKNOWN_ERROR: 'Something went wrong. Please try again.'
};

// Error categories for grouping
const ERROR_CATEGORIES = {
  AUTH: 'authentication',
  VALIDATION: 'validation',
  NETWORK: 'network',
  SERVER: 'server',
  CLIENT: 'client',
  UNKNOWN: 'unknown'
};

// Error severity levels
const ERROR_SEVERITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical'
};

// Function to get appropriate error message
const getErrorMessage = (errorCode, defaultMessage = null) => {
  return ERROR_MESSAGES[errorCode] || defaultMessage || ERROR_MESSAGES.DEFAULT;
};

// Function to get user-friendly error message
const getUserFriendlyError = (error) => {
  if (error.isAxiosError) {
    if (error.code === 'ECONNABORTED') {
      return USER_FRIENDLY_ERRORS.TIMEOUT_ERROR;
    }
    if (error.code === 'NETWORK_ERROR' || !error.response) {
      return USER_FRIENDLY_ERRORS.NETWORK_ERROR;
    }
    
    const status = error.response.status;
    if (status >= 500) {
      return USER_FRIENDLY_ERRORS.SERVER_ERROR;
    }
  }
  
  return USER_FRIENDLY_ERRORS.UNKNOWN_ERROR;
};

// Function to categorize errors
const categorizeError = (error) => {
  if (error.isAxiosError) {
    if (!error.response) {
      return ERROR_CATEGORIES.NETWORK;
    }
    
    const status = error.response.status;
    if (status >= 500) {
      return ERROR_CATEGORIES.SERVER;
    }
    if (status >= 400) {
      return ERROR_CATEGORIES.CLIENT;
    }
  }
  
  return ERROR_CATEGORIES.UNKNOWN;
};

// Function to determine error severity
const getErrorSeverity = (error) => {
  const category = categorizeError(error);
  
  switch (category) {
    case ERROR_CATEGORIES.NETWORK:
      return ERROR_SEVERITY.MEDIUM;
    case ERROR_CATEGORIES.SERVER:
      return ERROR_SEVERITY.HIGH;
    case ERROR_CATEGORIES.AUTH:
      return ERROR_SEVERITY.MEDIUM;
    default:
      return ERROR_SEVERITY.LOW;
  }
};

module.exports = {
  ERROR_MESSAGES,
  USER_FRIENDLY_ERRORS,
  ERROR_CATEGORIES,
  ERROR_SEVERITY,
  getErrorMessage,
  getUserFriendlyError,
  categorizeError,
  getErrorSeverity
};
