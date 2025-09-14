const { format, formatDistance, formatRelative, subDays } = require('date-fns');

// Date formatting utilities
const formatDate = (date, formatStr = 'PP') => {
  try {
    return format(new Date(date), formatStr);
  } catch (error) {
    return 'Invalid date';
  }
};

const formatRelativeTime = (date) => {
  try {
    return formatDistance(new Date(date), new Date(), { addSuffix: true });
  } catch (error) {
    return 'Invalid date';
  }
};

const formatTime = (date) => {
  try {
    return format(new Date(date), 'p');
  } catch (error) {
    return 'Invalid time';
  }
};

// Number formatting utilities
const formatNumber = (number) => {
  if (typeof number !== 'number') {
    number = parseFloat(number);
  }

  if (isNaN(number)) {
    return '0';
  }

  if (number >= 1000000) {
    return (number / 1000000).toFixed(1) + 'M';
  }
  if (number >= 1000) {
    return (number / 1000).toFixed(1) + 'K';
  }
  return number.toString();
};

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Text utilities
const truncateText = (text, maxLength, suffix = '...') => {
  if (typeof text !== 'string') return '';
  if (text.length <= maxLength) return text;
  
  return text.slice(0, maxLength) + suffix;
};

const capitalize = (text) => {
  if (typeof text !== 'string') return '';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

const titleCase = (text) => {
  if (typeof text !== 'string') return '';
  return text.split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

// URL utilities
const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
};

const getDomainFromUrl = (url) => {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.hostname;
  } catch (error) {
    return null;
  }
};

// Object utilities
const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime());
  if (obj instanceof Array) return obj.map(item => deepClone(item));
  
  const cloned = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }
  return cloned;
};

const mergeObjects = (target, source) => {
  const output = { ...target };
  
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          Object.assign(output, { [key]: source[key] });
        } else {
          output[key] = mergeObjects(target[key], source[key]);
        }
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }
  
  return output;
};

const isObject = (item) => {
  return item && typeof item === 'object' && !Array.isArray(item);
};

// Array utilities
const uniqueArray = (array) => {
  return [...new Set(array)];
};

const chunkArray = (array, size) => {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};

const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Function utilities
const debounce = (func, wait, immediate = false) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      timeout = null;
      if (!immediate) func.apply(this, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(this, args);
  };
};

const throttle = (func, limit) => {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Random utilities
const generateId = (length = 12) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

const randomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Validation utilities
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidUsername = (username) => {
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  return usernameRegex.test(username);
};

// Export all utilities
module.exports = {
  // Date functions
  formatDate,
  formatRelativeTime,
  formatTime,
  
  // Number functions
  formatNumber,
  formatFileSize,
  
  // Text functions
  truncateText,
  capitalize,
  titleCase,
  
  // URL functions
  isValidUrl,
  getDomainFromUrl,
  
  // Object functions
  deepClone,
  mergeObjects,
  isObject,
  
  // Array functions
  uniqueArray,
  chunkArray,
  shuffleArray,
  
  // Function utilities
  debounce,
  throttle,
  
  // Random utilities
  generateId,
  randomNumber,
  
  // Validation utilities
  isValidEmail,
  isValidUsername
};