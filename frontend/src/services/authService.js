import api from './api';

class AuthService {
  constructor() {
    this.token = null;
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('token', token);
      api.defaults.headers.Authorization = `Bearer ${token}`;
    } else {
      localStorage.removeItem('token');
      delete api.defaults.headers.Authorization;
    }
  }

  async login(credentials) {
    const response = await api.post('/auth/login', credentials);
    const { token, user } = response.data;
    this.setToken(token);
    return { token, user };
  }

  async register(userData) {
    const response = await api.post('/auth/register', userData);
    const { token, user } = response.data;
    this.setToken(token);
    return { token, user };
  }

  async getCurrentUser() {
    const response = await api.get('/auth/me');
    return response.data.user;
  }

  async updateProfile(profileData) {
    const response = await api.put('/auth/profile', profileData);
    return response.data.user;
  }

  async logout() {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.setToken(null);
    }
  }

  async changePassword(passwordData) {
    const response = await api.put('/auth/change-password', passwordData);
    return response.data;
  }

  async requestPasswordReset(email) {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  }

  async resetPassword(token, password) {
    const response = await api.post('/auth/reset-password', { token, password });
    return response.data;
  }
}

export const authService = new AuthService();
export default authService;
