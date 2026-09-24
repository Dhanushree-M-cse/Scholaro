import api from './api';

export const studentService = {
  getProfile: () => api.get('/student/profile').then(res => res.data),
  updateProfile: (data) => api.put('/student/profile', data).then(res => res.data),
  submitEligibility: (data) => api.post('/student/eligibility', data).then(res => res.data),
  getResults: () => api.get('/student/results').then(res => res.data),
};
