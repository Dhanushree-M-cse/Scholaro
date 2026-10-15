import axios from 'axios';

const getBaseUrl = () => {
  const rawEnv = import.meta.env.VITE_API_BASE_URL;
  if (!rawEnv) return '/api';
  const trimmed = rawEnv.trim().replace(/\/+$/, '');
  if (!trimmed.endsWith('/api')) {
    return `${trimmed}/api`;
  }
  return trimmed;
};

const API_BASE_URL = getBaseUrl();

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

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

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
  async (error) => {
    const originalRequest = error.config;

    // If 401 occurs and we haven't already retried this request, attempt automatic token refresh
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry && !originalRequest.url?.includes('/auth/login') && !originalRequest.url?.includes('/auth/refresh-token')) {
      const currentToken = localStorage.getItem('scholaro_token');
      if (currentToken) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((newToken) => {
              originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
              return api(originalRequest);
            })
            .catch((err) => Promise.reject(err));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          // Use axios directly to prevent interceptor recursion
          const refreshRes = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {}, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${currentToken}`
            }
          });

          const resData = refreshRes.data?.data || refreshRes.data;
          const newToken = resData?.token;
          const userData = resData?.user;

          if (newToken) {
            localStorage.setItem('scholaro_token', newToken);
            if (userData) {
              localStorage.setItem('scholaro_user', JSON.stringify(userData));
            }
            api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
            originalRequest.headers['Authorization'] = `Bearer ${newToken}`;

            try {
              window.dispatchEvent(new CustomEvent('scholaro_session_refreshed', { detail: { token: newToken, user: userData } }));
            } catch {}

            processQueue(null, newToken);
            isRefreshing = false;

            return api(originalRequest);

          }
        } catch (refreshErr) {
          processQueue(refreshErr, null);
          isRefreshing = false;
          // Refresh failed — clear invalid auth
          localStorage.removeItem('scholaro_token');
          localStorage.removeItem('scholaro_user');
          delete api.defaults.headers.common['Authorization'];
        }
      }
    }

    // Handle error formatting
    let message = error.response?.data?.message || error.message || 'An error occurred';
    if (error.response?.status === 401) {
      message = 'Your session has expired. Please log in again to save and submit.';
    } else if (error.response?.status === 405) {
      message = 'Request method not allowed on this endpoint. Please check the requested API path.';
    } else if (error.code === 'ERR_NETWORK' || !error.response) {
      message = 'Unable to connect to SCHOLARO backend server. Please make sure the backend server is running and accessible.';
    }
    return Promise.reject({ ...error, customMessage: message, message });
  }
);

export const checkHealth = async () => {
  const response = await api.get('/health');
  return response.data;
};

export default api;
