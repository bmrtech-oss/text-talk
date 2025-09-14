const tweetSchema = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
      format: 'uuid',
      description: 'Unique identifier for the tweet'
    },
    content: {
      type: 'string',
      minLength: 1,
      maxLength: 280,
      description: 'Tweet content text'
    },
    author: {
      $ref: '#/components/schemas/User',
      description: 'User who created the tweet'
    },
    likes: {
      type: 'integer',
      minimum: 0,
      description: 'Number of likes'
    },
    retweets: {
      type: 'integer',
      minimum: 0,
      description: 'Number of retweets'
    },
    replies: {
      type: 'integer',
      minimum: 0,
      description: 'Number of replies'
    },
    isLiked: {
      type: 'boolean',
      default: false,
      description: 'Whether the current user has liked this tweet'
    },
    isRetweeted: {
      type: 'boolean',
      default: false,
      description: 'Whether the current user has retweeted this tweet'
    },
    media: {
      type: 'array',
      items: {
        type: 'string',
        format: 'uri'
      },
      maxItems: 4,
      description: 'Array of media URLs attached to the tweet'
    },
    hashtags: {
      type: 'array',
      items: {
        type: 'string'
      },
      description: 'Array of hashtags in the tweet'
    },
    mentions: {
      type: 'array',
      items: {
        $ref: '#/components/schemas/User'
      },
      description: 'Array of mentioned users'
    },
    viewCount: {
      type: 'integer',
      minimum: 0,
      description: 'Number of views'
    },
    isEdited: {
      type: 'boolean',
      default: false,
      description: 'Whether the tweet has been edited'
    },
    moderationStatus: {
      type: 'string',
      enum: ['pending', 'approved', 'rejected', 'flagged'],
      default: 'pending',
      description: 'Content moderation status'
    },
    createdAt: {
      type: 'string',
      format: 'date-time',
      description: 'Tweet creation timestamp'
    },
    updatedAt: {
      type: 'string',
      format: 'date-time',
      description: 'Tweet last update timestamp'
    }
  },
  required: ['id', 'content', 'author'],
  additionalProperties: false
};

module.exports = tweetSchema;
