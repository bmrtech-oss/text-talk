export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) return 'Email is required';
  if (!emailRegex.test(email)) return 'Please enter a valid email address';
  return null;
};

export const validateUsername = (username) => {
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  if (!username) return 'Username is required';
  if (username.length < 3) return 'Username must be at least 3 characters';
  if (username.length > 20) return 'Username must be less than 20 characters';
  if (!usernameRegex.test(username)) return 'Username can only contain letters, numbers, and underscores';
  return null;
};

export const validatePassword = (password) => {
  if (!password) return 'Password is required';
  if (password.length < 6) return 'Password must be at least 6 characters';
  if (!/(?=.*[a-z])/.test(password)) return 'Password must contain at least one lowercase letter';
  if (!/(?=.*[A-Z])/.test(password)) return 'Password must contain at least one uppercase letter';
  if (!/(?=.*\d)/.test(password)) return 'Password must contain at least one number';
  return null;
};

export const validateConfirmPassword = (password, confirmPassword) => {
  if (!confirmPassword) return 'Please confirm your password';
  if (password !== confirmPassword) return 'Passwords do not match';
  return null;
};

export const validateName = (name) => {
  if (!name) return 'Name is required';
  if (name.length < 2) return 'Name must be at least 2 characters';
  if (name.length > 50) return 'Name must be less than 50 characters';
  return null;
};

export const validateTweetContent = (content) => {
  if (!content || content.trim().length === 0) return 'Tweet content is required';
  if (content.length > 280) return 'Tweet cannot exceed 280 characters';
  return null;
};

export const validateBio = (bio) => {
  if (bio && bio.length > 160) return 'Bio must be less than 160 characters';
  return null;
};

export const validateWebsite = (website) => {
  if (website && website.trim() !== '') {
    try {
      new URL(website);
    } catch {
      return 'Please enter a valid URL';
    }
  }
  return null;
};

export const validateLocation = (location) => {
  if (location && location.length > 30) return 'Location must be less than 30 characters';
  return null;
};

export const validateForm = (values, rules) => {
  const errors = {};
  
  Object.keys(rules).forEach(field => {
    const rule = rules[field];
    const value = values[field];
    
    if (rule.required && (!value || value.toString().trim() === '')) {
      errors[field] = rule.required;
      return;
    }
    
    if (rule.minLength && value && value.length < rule.minLength.value) {
      errors[field] = rule.minLength.message;
      return;
    }
    
    if (rule.maxLength && value && value.length > rule.maxLength.value) {
      errors[field] = rule.maxLength.message;
      return;
    }
    
    if (rule.pattern && value && !rule.pattern.value.test(value)) {
      errors[field] = rule.pattern.message;
      return;
    }
    
    if (rule.validate && value) {
      const customError = rule.validate(value, values);
      if (customError) {
        errors[field] = customError;
      }
    }
  });
  
  return errors;
};

export const validationRules = {
  email: {
    required: 'Email is required',
    pattern: {
      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: 'Please enter a valid email address'
    }
  },
  username: {
    required: 'Username is required',
    minLength: {
      value: 3,
      message: 'Username must be at least 3 characters'
    },
    maxLength: {
      value: 20,
      message: 'Username must be less than 20 characters'
    },
    pattern: {
      value: /^[a-zA-Z0-9_]+$/,
      message: 'Username can only contain letters, numbers, and underscores'
    }
  },
  password: {
    required: 'Password is required',
    minLength: {
      value: 6,
      message: 'Password must be at least 6 characters'
    },
    pattern: {
      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      message: 'Password must contain at least one lowercase letter, one uppercase letter, and one number'
    }
  },
  name: {
    required: 'Name is required',
    minLength: {
      value: 2,
      message: 'Name must be at least 2 characters'
    },
    maxLength: {
      value: 50,
      message: 'Name must be less than 50 characters'
    }
  }
};
