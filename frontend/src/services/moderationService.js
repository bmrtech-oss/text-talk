import api from './api';

class ModerationService {
  async checkContent(content) {
    const response = await api.post('/moderation/check', { content });
    return response.data;
  }

  async getModerationLogs(page = 1, limit = 20, filters = {}) {
    const params = { page, limit, ...filters };
    const response = await api.get('/moderation/logs', { params });
    return response.data;
  }

  async getModerationStats(timeframe = '30d') {
    const response = await api.get('/moderation/stats', {
      params: { timeframe }
    });
    return response.data;
  }

  async appealModerationDecision(tweetId, reason) {
    const response = await api.post('/moderation/appeal', {
      tweetId,
      reason
    });
    return response.data;
  }

  async getContentGuidelines() {
    const response = await api.get('/moderation/guidelines');
    return response.data;
  }

  async reportContent(contentId, reason, type = 'tweet') {
    const response = await api.post('/moderation/report', {
      contentId,
      reason,
      type
    });
    return response.data;
  }
}

export const moderationService = new ModerationService();
export default moderationService;
