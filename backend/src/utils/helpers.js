// Utility functions

// Sanitize user input
const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  return input
    .trim()
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

// Validate email format
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate username format
const isValidUsername = (username) => {
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  return usernameRegex.test(username);
};

// Generate random string
const generateRandomString = (length = 12) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Format date relative to now
const formatRelativeTime = (date) => {
  const now = new Date();
  const diffInSeconds = Math.floor((now - new Date(date)) / 1000);
  
  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  
  return new Date(date).toLocaleDateString();
};

// Pagination helper
const getPagination = (page, limit) => {
  page = Math.max(1, parseInt(page) || 1);
  limit = Math.max(1, parseInt(limit) || 20);
  const skip = (page - 1) * limit;
  
  return { page, limit, skip };
};

// Extract hashtags from text
const extractHashtags = (text) => {
  const hashtags = text.match(/#\w+/g) || [];
  return hashtags.map(tag => tag.slice(1).toLowerCase());
};

// Extract mentions from text
const extractMentions = (text) => {
  const mentions = text.match(/@\w+/g) || [];
  return mentions.map(mention => mention.slice(1).toLowerCase());
};

module.exports = {
  sanitizeInput,
  isValidEmail,
  isValidUsername,
  generateRandomString,
  formatRelativeTime,
  getPagination,
  extractHashtags,
  extractMentions
};
