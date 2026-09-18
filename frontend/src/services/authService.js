import api from './api';

export const authService = {
  async login(username, password) {
    const response = await api.post('/api/v1/auth/login', { username, password });
    if (response.data && response.data.data) {
      const { token, user } = response.data.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      return response.data.data;
    }
    return response.data;
  },

  async register(username, password, grade, className) {
    const response = await api.post('/api/v1/auth/register', {
      username,
      password,
      grade: grade ? parseInt(grade, 10) : null,
      className,
    });
    return response.data;
  },

  async getCurrentUser() {
    const response = await api.get('/api/v1/auth/me');
    return response.data.data;
  },

  async getProfile() {
    const response = await api.get('/api/v1/users/me/student-profile');
    return response.data.data;
  },

  async updateProfile(grade, className) {
    const response = await api.put('/api/v1/users/me/student-profile', {
      grade: grade ? parseInt(grade, 10) : null,
      className,
    });
    return response.data.data;
  },

  async getSubscriptionPlans() {
    const response = await api.get('/api/v1/users/subscription/plans');
    return response.data.data;
  },

  async subscribe(planCode) {
    const response = await api.post('/api/v1/users/me/subscription', { planCode });
    return response.data;
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  },

  getStoredUser() {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  isAuthenticated() {
    return !!localStorage.getItem('token');
  },
};

export default authService;
