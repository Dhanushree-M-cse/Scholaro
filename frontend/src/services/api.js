import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request Interceptor (attaches JWT token if stored)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('scholaro_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
api.interceptors.response.use(
  (response) => {
    if (response.data && typeof response.data === 'object' && response.data.success !== undefined && response.data.data !== undefined) {
      const rawBody = response.data;
      response.data = response.data.data;
      response.raw = rawBody;
    }
    return response;
  },
  (error) => {
    // Handle error formatting
    let message = error.response?.data?.message || error.message || 'An error occurred';
    if (error.code === 'ERR_NETWORK' || !error.response) {
      message = 'Unable to connect to SCHOLARO backend server. Please make sure the backend server is running.';
    }
    return Promise.reject({ ...error, customMessage: message, message });
  }
);

export const checkHealth = async () => {
  const response = await api.get('/health');
  return response.data;
};

export default api;
