import api from './api';

export const authService = {
  register: (data) => api.post('/auth/register', data).then(res => res.data),
  login: (data) => api.post('/auth/login', data).then(res => res.data),
  adminLogin: (data) => api.post('/auth/admin-login', data).then(res => res.data),
};
