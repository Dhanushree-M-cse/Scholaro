import api from './api';

export const authService = {
  register: (data) => {
    const payload = {
      name: data.full_name || data.name,
      full_name: data.full_name || data.name,
      email: data.email,
      mobile: data.mobile,
      password: data.password,
    };
    return api.post('/auth/register', payload).then(res => res.data);
  },
  login: (data) => api.post('/auth/login', data).then(res => res.data),
  adminLogin: (data) => api.post('/auth/admin-login', data).then(res => res.data),
  refreshToken: () => api.post('/auth/refresh-token').then(res => res.data),
};

