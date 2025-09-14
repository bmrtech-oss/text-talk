const axios = require('axios');

// Mock moderation service - replace with actual API integration
const MOCK_MODERATION_SERVICE = process.env.NODE_ENV === 'test';

// List of prohibited terms (simplified for demo)
const PROHIBITED_TERMS = [
  'hate', 'violence', 'kill', 'harm', 'attack', 'discriminat', 
  'racist', 'sexist', 'bigot', 'assault', 'abuse', 'harass'
];

// List of warning terms
const WARNING_TERMS = [
  'politics', 'religion', 'controversial', 'protest', 'rally', 
  'demonstration', 'opinion', 'believe', 'think'
];

// Simulate AI moderation service
const simulateModeration = (content) => {
  const violations = [];
  const suggestedChanges = [];
  let confidence = 0.8;

  // Check for prohibited terms
  PROHIBITED_TERMS.forEach(term => {
    if (content.toLowerCase().includes(term)) {
      violations.push('inappropriate_content');
      suggestedChanges.push(`Consider removing reference to ${term}`);
      confidence = 0.95;
    }
  });

  // Check for warning terms
  WARNING_TERMS.forEach(term => {
    if (content.toLowerCase().includes(term)) {
      violations.push('potentially_controversial');
      suggestedChanges.push(`This content about ${term} might be controversial`);
      confidence = Math.max(confidence, 0.7);
    }
  });

  // Check for excessive length
  if (content.length > 250) {
    violations.push('potentially_spam');
    suggestedChanges.push('Consider shortening your message');
    confidence = 0.6;
  }

  return {
    isApproved: violations.length === 0,
    violations,
    confidence,
    suggestedChanges,
    moderatedBy: 'ai_system'
  };
};

// Actual API integration (example using Perspective API)
const checkWithPerspectiveAPI = async (content) => {
  try {
    const response = await axios.post(
      `https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze?key=${process.env.PERSPECTIVE_API_KEY}`,
      {
        comment: { text: content },
        requestedAttributes: {
          TOXICITY: {},
          SEVERE_TOXICITY: {},
          IDENTITY_ATTACK: {},
          INSULT: {},
          PROFANITY: {},
          THREAT: {}
        },
        languages: ['en']
      }
    );

    const attributes = response.data.attributeScores;
    const violations = [];
    const scores = {};

    // Check each attribute
    Object.entries(attributes).forEach(([key, value]) => {
      scores[key] = value.summaryScore.value;
      if (value.summaryScore.value > 0.7) {
        violations.push(key.toLowerCase());
      }
    });

    return {
      isApproved: violations.length === 0,
      violations,
      scores,
      confidence: Math.max(...Object.values(scores)),
      moderatedBy: 'perspective_api'
    };
  } catch (error) {
    console.error('Perspective API error:', error);
    // Fall back to simulated moderation
    return simulateModeration(content);
  }
};

// Main moderation function
const checkContent = async (content) => {
  if (!content || typeof content !== 'string') {
    throw new Error('Invalid content provided');
  }

  if (MOCK_MODERATION_SERVICE || !process.env.PERSPECTIVE_API_KEY) {
    return simulateModeration(content);
  }

  try {
    return await checkWithPerspectiveAPI(content);
  } catch (error) {
    console.error('Moderation service error, falling back to simulation:', error);
    return simulateModeration(content);
  }
};

module.exports = {
  checkContent,
  simulateModeration // Export for testing
};
