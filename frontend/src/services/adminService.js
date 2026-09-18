import api from './api';

const adminService = {
  getUsers: async (params = {}) => {
    const query = new URLSearchParams();
    if (params.role && params.role !== 'ALL') query.append('role', params.role);
    if (params.status && params.status !== 'ALL') query.append('status', params.status);
    if (params.keyword) query.append('keyword', params.keyword);

    const response = await api.get(`/api/v1/users?${query.toString()}`);
    return response.data.data;
  },

  getUserById: async (userId) => {
    const response = await api.get(`/api/v1/users/${userId}`);
    return response.data.data;
  },

  updateUserStatus: async (userId, status) => {
    const response = await api.patch(`/api/v1/users/${userId}/status`, { status });
    return response.data.data;
  },

  updateUserRole: async (userId, roles) => {
    const response = await api.patch(`/api/v1/users/${userId}/role`, { roles });
    return response.data.data;
  },

  createUser: async (userData) => {
    const response = await api.post('/api/v1/users', userData);
    return response.data.data;
  },
};

export default adminService;
