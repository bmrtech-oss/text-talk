const { checkContent } = require('../utils/moderationAPI');

const moderateContent = async (req, res, next) => {
  try {
    const { content } = req.body;
    
    if (!content) {
      return next();
    }

    const moderationResult = await checkContent(content);
    
    if (moderationResult.isApproved) {
      req.moderationResult = moderationResult;
      next();
    } else {
      res.status(400).json({
        message: 'Content violates community guidelines',
        details: moderationResult.violations,
        suggestedChanges: moderationResult.suggestedChanges
      });
    }
  } catch (error) {
    console.error('Moderation error:', error);
    // Allow content if moderation service is down
    next();
  }
};

module.exports = moderateContent;
