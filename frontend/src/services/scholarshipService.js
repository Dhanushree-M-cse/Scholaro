import api from './api';
import { clientStorage, VERIFIED_SCHOLARSHIPS } from './clientStorage';

export const scholarshipService = {
  getScholarships: async (params) => {
    try {
      const res = await api.get('/scholarships', { params });
      return res.data;
    } catch {
      // Standalone frontend fallback on Vercel
      let list = [...VERIFIED_SCHOLARSHIPS];
      if (params?.category && params.category !== 'all') {
        list = list.filter(s => s.category === params.category);
      }
      if (params?.search) {
        const q = params.search.toLowerCase();
        list = list.filter(s => s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q) || s.provider.toLowerCase().includes(q));
      }
      return list;
    }
  },
  getScholarship: async (id) => {
    try {
      const res = await api.get(`/scholarships/${id}`);
      return res.data;
    } catch {
      // Standalone frontend fallback on Vercel
      const found = VERIFIED_SCHOLARSHIPS.find(s => s.id === Number(id));
      return found || VERIFIED_SCHOLARSHIPS[0];
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
  unsaveScholarship: async (id) => {
    try {
      const res = await api.delete(`/student/scholarships/${id}/save`);
      return res.data;
    } catch {
      return clientStorage.unsaveScholarship(id);
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
};

export default scholarshipService;
