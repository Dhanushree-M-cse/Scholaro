import api from './api';

export const scholarshipService = {
  getScholarships: (params) => api.get('/scholarships', { params }).then(res => res.data),
  getScholarship: (id) => api.get(`/scholarships/${id}`).then(res => res.data),
  // Save/unsave use student routes (protected)
  saveScholarship: (id) => api.post(`/student/scholarships/${id}/save`).then(res => res.data),
  unsaveScholarship: (id) => api.delete(`/student/scholarships/${id}/save`).then(res => res.data),
  // Saved list is a student-protected route
  getSaved: () => api.get('/student/saved').then(res => res.data),
};
