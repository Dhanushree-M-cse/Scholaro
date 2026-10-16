import api from './api';
import { clientStorage } from './clientStorage';

export const studentService = {
  getProfile: async () => {
    try {
      const res = await api.get('/student/profile');
      return res.data;
    } catch {
      return clientStorage.getProfile();
    }
  },
  updateProfile: async (data) => {
    try {
      const res = await api.put('/student/profile', data);
      return res.data;
    } catch {
      return { success: true, data };
    }
  },
  submitEligibility: async (data) => {
    try {
      const res = await api.post('/student/eligibility', data);
      return res.data;
    } catch {
      // Standalone frontend fallback on Vercel
      const matches = clientStorage.saveEligibility(data);
      return { success: true, data: matches, message: 'Eligibility calculated and saved successfully' };
    }
  },
  getResults: async () => {
    try {
      const res = await api.get('/student/results');
      return res.data;
    } catch {
      return clientStorage.getResults();
    }
  },
  getSaved: async () => {
    try {
      const res = await api.get('/student/saved');
      return res.data;
    } catch {
      return clientStorage.getSaved();
    }
  },
  saveScholarship: async (id) => {
    try {
      const res = await api.post(`/student/scholarships/${id}/save`);
      return res.data;
    } catch {
      return clientStorage.saveScholarship(id);
    }
  },
  removeSavedScholarship: async (id) => {
    try {
      const res = await api.delete(`/student/scholarships/${id}/save`);
      return res.data;
    } catch {
      return clientStorage.unsaveScholarship(id);
    }
  }
};

export default studentService;
