const userSchema = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
      format: 'uuid',
      description: 'Unique identifier for the user'
    },
    username: {
      type: 'string',
      minLength: 3,
      maxLength: 20,
      pattern: '^[a-zA-Z0-9_]+$',
      description: 'Unique username for the user'
    },
    email: {
      type: 'string',
      format: 'email',
      description: 'User email address'
    },
    name: {
      type: 'string',
      minLength: 2,
      maxLength: 50,
      description: 'User full name'
    },
    bio: {
      type: 'string',
      maxLength: 160,
      description: 'User biography'
    },
    location: {
      type: 'string',
      maxLength: 30,
      description: 'User location'
    },
    website: {
      type: 'string',
      format: 'uri',
      maxLength: 100,
      description: 'User website URL'
    },
    avatar: {
      type: 'string',
      format: 'uri',
      description: 'URL to user avatar image'
    },
    coverPhoto: {
      type: 'string',
      format: 'uri',
      description: 'URL to user cover photo'
    },
    isVerified: {
      type: 'boolean',
      default: false,
      description: 'Whether the user is verified'
    },
    isActive: {
      type: 'boolean',
      default: true,
      description: 'Whether the user account is active'
    },
    followersCount: {
      type: 'integer',
      minimum: 0,
      description: 'Number of followers'
    },
    followingCount: {
      type: 'integer',
      minimum: 0,
      description: 'Number of users followed'
    },
    tweetCount: {
      type: 'integer',
      minimum: 0,
      description: 'Number of tweets posted'
    },
    createdAt: {
      type: 'string',
      format: 'date-time',
      description: 'User creation timestamp'
    },
    updatedAt: {
      type: 'string',
      format: 'date-time',
      description: 'User last update timestamp'
    }
  },
  required: ['id', 'username', 'email', 'name'],
  additionalProperties: false
};

module.exports = userSchema;
