import api from './api';

class UserService {
  async getUserProfile(username) {
    const response = await api.get(`/users/${username}`);
    return response.data.user;
  }

  async searchUsers(query, page = 1, limit = 20) {
    const response = await api.get('/users/search', {
      params: { q: query, page, limit }
    });
    return response.data;
  }

  async followUser(username) {
    const response = await api.post(`/users/${username}/follow`);
    return response.data;
  }

  async unfollowUser(username) {
    const response = await api.post(`/users/${username}/follow`);
    return response.data;
  }

  async getFollowers(username, page = 1, limit = 20) {
    const response = await api.get(`/users/${username}/followers`, {
      params: { page, limit }
    });
    return response.data;
  }

  async getFollowing(username, page = 1, limit = 20) {
    const response = await api.get(`/users/${username}/following`, {
      params: { page, limit }
    });
    return response.data;
  }

  async updateUserProfile(profileData) {
    const response = await api.put('/users/profile', profileData);
    return response.data.user;
  }

  async getSuggestedUsers() {
    const response = await api.get('/users/suggested');
    return response.data;
  }

  async blockUser(username) {
    const response = await api.post(`/users/${username}/block`);
    return response.data;
  }

  async unblockUser(username) {
    const response = await api.post(`/users/${username}/unblock`);
    return response.data;
  }

  async getBlockedUsers() {
    const response = await api.get('/users/blocked');
    return response.data;
  }
}

export const userService = new UserService();
export default userService;
