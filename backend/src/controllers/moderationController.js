const ModerationLog = require('../models/ModerationLog');
const Tweet = require('../models/Tweet');
const { checkContent } = require('../utils/moderationAPI');

// Check content for moderation
const checkContentModeration = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ message: 'Content is required' });
    }

    const moderationResult = await checkContent(content);

    res.json({
      content,
      moderationResult,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Content moderation check error:', error);
    res.status(500).json({ message: 'Server error checking content' });
  }
};

// Get moderation logs (admin only)
const getModerationLogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const { status, author, action } = req.query;

    let filter = {};
    if (status) filter['moderationResult.isApproved'] = status === 'approved';
    if (author) filter.author = author;
    if (action) filter.action = action;

    const logs = await ModerationLog.find(filter)
      .populate('author', 'username name')
      .populate('tweet', 'content')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await ModerationLog.countDocuments(filter);

    res.json({
      logs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get moderation logs error:', error);
    res.status(500).json({ message: 'Server error fetching moderation logs' });
  }
};

// Get moderation statistics
const getModerationStats = async (req, res) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const stats = await ModerationLog.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            approved: "$moderationResult.isApproved"
          },
          count: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: "$_id.date",
          approved: {
            $sum: {
              $cond: [{ $eq: ["$_id.approved", true] }, "$count", 0]
            }
          },
          rejected: {
            $sum: {
              $cond: [{ $eq: ["$_id.approved", false] }, "$count", 0]
            }
          }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    const totalStats = await ModerationLog.aggregate([
      {
        $group: {
          _id: "$moderationResult.isApproved",
          count: { $sum: 1 }
        }
      }
    ]);

    const violationStats = await ModerationLog.aggregate([
      {
        $unwind: "$moderationResult.violations"
      },
      {
        $group: {
          _id: "$moderationResult.violations",
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    res.json({
      dailyStats: stats,
      totalStats,
      violationStats,
      timeframe: 'last_30_days'
    });
  } catch (error) {
    console.error('Get moderation stats error:', error);
    res.status(500).json({ message: 'Server error fetching moderation stats' });
  }
};

module.exports = {
  checkContentModeration,
  getModerationLogs,
  getModerationStats
};
