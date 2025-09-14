const User = require('../models/User');
const Tweet = require('../models/Tweet');
const { getRedisClient } = require('../config/redis');

// Get user profile
const getUserProfile = async (req, res) => {
  try {
    const { username } = req.params;

    const user = await User.findOne({ username })
      .select('-password')
      .populate('followers', 'username name avatar')
      .populate('following', 'username name avatar');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({ message: 'Server error fetching user profile' });
  }
};

// Get user tweets
const getUserTweets = async (req, res) => {
  try {
    const { username } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const redisClient = getRedisClient();
    const cacheKey = `user_tweets:${user._id}:${page}:${limit}`;
    
    // Try to get from cache
    const cachedTweets = await redisClient.get(cacheKey);
    if (cachedTweets) {
      return res.json(JSON.parse(cachedTweets));
    }

    const tweets = await Tweet.find({ 
      author: user._id,
      moderationStatus: 'approved'
    })
    .populate('author', 'username name avatar isVerified')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

    // Cache the result
    await redisClient.setEx(cacheKey, 300, JSON.stringify({
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
    console.error('Get user tweets error:', error);
    res.status(500).json({ message: 'Server error fetching user tweets' });
  }
};

// Follow/unfollow user
const followUser = async (req, res) => {
  try {
    const { username } = req.params;
    const currentUserId = req.user._id;

    if (username === req.user.username) {
      return res.status(400).json({ message: 'Cannot follow yourself' });
    }

    const userToFollow = await User.findOne({ username });
    if (!userToFollow) {
      return res.status(404).json({ message: 'User not found' });
    }

    const currentUser = await User.findById(currentUserId);

    // Check if already following
    const isFollowing = currentUser.following.includes(userToFollow._id);
    
    if (isFollowing) {
      // Unfollow
      currentUser.following = currentUser.following.filter(
        id => id.toString() !== userToFollow._id.toString()
      );
      userToFollow.followers = userToFollow.followers.filter(
        id => id.toString() !== currentUserId.toString()
      );
    } else {
      // Follow
      currentUser.following.push(userToFollow._id);
      userToFollow.followers.push(currentUserId);
    }

    await currentUser.save();
    await userToFollow.save();

    // Invalidate cache
    const redisClient = getRedisClient();
    await redisClient.del(`user:${currentUserId}`);
    await redisClient.del(`user:${userToFollow._id}`);
    await redisClient.del('timeline');

    res.json({
      message: isFollowing ? 'Unfollowed successfully' : 'Followed successfully',
      following: !isFollowing,
      followersCount: userToFollow.followers.length
    });
  } catch (error) {
    console.error('Follow user error:', error);
    res.status(500).json({ message: 'Server error following user' });
  }
};

// Search users
const searchUsers = async (req, res) => {
  try {
    const { q } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    if (!q) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const users = await User.find({
      $or: [
        { username: { $regex: q, $options: 'i' } },
        { name: { $regex: q, $options: 'i' } }
      ],
      isActive: true
    })
    .select('username name avatar bio followers following isVerified')
    .sort({ followers: -1, createdAt: -1 })
    .skip(skip)
    .limit(limit);

    res.json({
      users,
      page,
      limit,
      hasMore: users.length === limit
    });
  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({ message: 'Server error searching users' });
  }
};

module.exports = {
  getUserProfile,
  getUserTweets,
  followUser,
  searchUsers
};
