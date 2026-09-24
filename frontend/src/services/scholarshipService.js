import api from './api';

export const scholarshipService = {
  getScholarships: (params) => api.get('/scholarships', { params }).then(res => res.data),
  getScholarship: (id) => api.get(`/scholarships/${id}`).then(res => res.data),
  saveScholarship: (id) => api.post(`/scholarships/${id}/save`).then(res => res.data),
  unsaveScholarship: (id) => api.delete(`/scholarships/${id}/save`).then(res => res.data),
  getSaved: () => api.get('/scholarships/saved').then(res => res.data),
};
