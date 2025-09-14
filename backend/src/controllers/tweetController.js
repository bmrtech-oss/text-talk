const Tweet = require('../models/Tweet');
const User = require('../models/User');
const ModerationLog = require('../models/ModerationLog');
const { getRedisClient } = require('../config/redis');

// Create a new tweet
const createTweet = async (req, res) => {
  try {
    const { content, replyTo, quoteTweet, media } = req.body;
    const userId = req.user._id;

    // Create tweet
    const tweet = new Tweet({
      content,
      author: userId,
      replyTo: replyTo || null,
      quoteTweet: quoteTweet || null,
      media: media || [],
      moderationStatus: req.moderationResult ? 'approved' : 'pending'
    });

    await tweet.save();

    // Populate author info
    await tweet.populate('author', 'username name avatar');

    // Log moderation action
    if (req.moderationResult) {
      const log = new ModerationLog({
        content,
        author: userId,
        tweet: tweet._id,
        action: 'create',
        moderationResult: req.moderationResult,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
        countryCode: req.get('CF-IPCountry') || 'US'
      });
      await log.save();
    }

    // Invalidate cache for user's tweets
    const redisClient = getRedisClient();
    await redisClient.del(`user_tweets:${userId}`);
    await redisClient.del('timeline');

    res.status(201).json({
      message: 'Tweet created successfully',
      tweet
    });
  } catch (error) {
    console.error('Create tweet error:', error);
    res.status(500).json({ message: 'Server error creating tweet' });
  }
};

// Get timeline tweets
const getTimeline = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const redisClient = getRedisClient();
    const cacheKey = `timeline:${page}:${limit}`;
    
    // Try to get from cache
    const cachedTimeline = await redisClient.get(cacheKey);
    if (cachedTimeline) {
      return res.json(JSON.parse(cachedTimeline));
    }

    // Get user's following list
    const user = await User.findById(req.user._id);
    const followingIds = [...user.following, user._id];

    // Get tweets from followed users
    const tweets = await Tweet.find({ 
      author: { $in: followingIds },
      moderationStatus: 'approved'
    })
    .populate('author', 'username name avatar isVerified')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

    // Cache the result
    await redisClient.setEx(cacheKey, 300, JSON.stringify({ // 5 minutes cache
      tweets,
      page,
      limit,
      hasMore: tweets.length === limit
    }));

    res.json({
      tweets,
      page,
      limit,
      hasMore: tweets.length === limit
    });
  } catch (error) {
    console.error('Get timeline error:', error);
    res.status(500).json({ message: 'Server error fetching timeline' });
  }
};

// Get a specific tweet
const getTweet = async (req, res) => {
  try {
    const { id } = req.params;

    const tweet = await Tweet.findById(id)
      .populate('author', 'username name avatar isVerified')
      .populate('replyTo', 'content author')
      .populate('quoteTweet', 'content author');

    if (!tweet) {
      return res.status(404).json({ message: 'Tweet not found' });
    }

    // Increment view count
    tweet.viewCount += 1;
    await tweet.save();

    res.json({ tweet });
  } catch (error) {
    console.error('Get tweet error:', error);
    res.status(500).json({ message: 'Server error fetching tweet' });
  }
};

// Like a tweet
const likeTweet = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const tweet = await Tweet.findById(id);
    if (!tweet) {
      return res.status(404).json({ message: 'Tweet not found' });
    }

    // Check if already liked
    const alreadyLiked = tweet.likes.includes(userId);
    if (alreadyLiked) {
      // Unlike
      tweet.likes = tweet.likes.filter(like => like.toString() !== userId.toString());
    } else {
      // Like
      tweet.likes.push(userId);
    }

    await tweet.save();

    res.json({
      message: alreadyLiked ? 'Tweet unliked' : 'Tweet liked',
      likes: tweet.likes.length
    });
  } catch (error) {
    console.error('Like tweet error:', error);
    res.status(500).json({ message: 'Server error liking tweet' });
  }
};

// Delete a tweet
const deleteTweet = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const tweet = await Tweet.findOne({ _id: id, author: userId });
    if (!tweet) {
      return res.status(404).json({ message: 'Tweet not found or not authorized' });
    }

    await Tweet.findByIdAndDelete(id);

    // Invalidate cache
    const redisClient = getRedisClient();
    await redisClient.del(`user_tweets:${userId}`);
    await redisClient.del('timeline');

    res.json({ message: 'Tweet deleted successfully' });
  } catch (error) {
    console.error('Delete tweet error:', error);
    res.status(500).json({ message: 'Server error deleting tweet' });
  }
};

module.exports = {
  createTweet,
  getTimeline,
  getTweet,
  likeTweet,
  deleteTweet
};
