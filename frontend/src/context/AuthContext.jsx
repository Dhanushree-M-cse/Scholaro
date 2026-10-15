import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('scholaro_token');
    const storedUser = localStorage.getItem('scholaro_user');
    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      } catch {
        localStorage.removeItem('scholaro_token');
        localStorage.removeItem('scholaro_user');
      }
    }
    setLoading(false);

    const handleRefresh = (e) => {
      if (e.detail?.token && e.detail?.user) {
        setToken(e.detail.token);
        setUser(e.detail.user);
      }
    };
    window.addEventListener('scholaro_session_refreshed', handleRefresh);
    return () => window.removeEventListener('scholaro_session_refreshed', handleRefresh);
  }, []);


  const login = useCallback((userData, jwtToken) => {
    setUser(userData);
    setToken(jwtToken);
    localStorage.setItem('scholaro_token', jwtToken);
    localStorage.setItem('scholaro_user', JSON.stringify(userData));
    api.defaults.headers.common['Authorization'] = `Bearer ${jwtToken}`;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('scholaro_token');
    localStorage.removeItem('scholaro_user');
    delete api.defaults.headers.common['Authorization'];
  }, []);

  const isAuthenticated = !!token && !!user;
  const isAdmin = isAuthenticated && user?.role === 'admin';
  const isStudent = isAuthenticated && user?.role === 'student';

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated, isAdmin, isStudent, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};

export default AuthContext;
