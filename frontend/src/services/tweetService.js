import api from './api';

class TweetService {
  async createTweet(tweetData) {
    const response = await api.post('/tweets', tweetData);
    return response.data;
  }

  async getTimeline(page = 1, limit = 20) {
    const response = await api.get('/tweets', {
      params: { page, limit }
    });
    return response.data;
  }

  async getTweet(id) {
    const response = await api.get(`/tweets/${id}`);
    return response.data.tweet;
  }

  async getUserTweets(username, page = 1, limit = 20) {
    const response = await api.get(`/users/${username}/tweets`, {
      params: { page, limit }
    });
    return response.data;
  }

  async likeTweet(id) {
    const response = await api.post(`/tweets/${id}/like`);
    return response.data;
  }

  async retweet(id) {
    const response = await api.post(`/tweets/${id}/retweet`);
    return response.data;
  }

  async deleteTweet(id) {
    const response = await api.delete(`/tweets/${id}`);
    return response.data;
  }

  async getTweetReplies(id, page = 1, limit = 20) {
    const response = await api.get(`/tweets/${id}/replies`, {
      params: { page, limit }
    });
    return response.data;
  }

  async searchTweets(query, page = 1, limit = 20) {
    const response = await api.get('/tweets/search', {
      params: { q: query, page, limit }
    });
    return response.data;
  }

  async getTrendingTweets() {
    const response = await api.get('/tweets/trending');
    return response.data;
  }
}

export const tweetService = new TweetService();
export default tweetService;
