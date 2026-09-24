import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import { Card, CardBody, Input, Button, Alert, Loading } from '../../components';
import './AdminLoginPage.css';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return setError('Please enter your admin email address');
    if (!password) return setError('Please enter your password');
    setLoading(true); setError('');
    try {
      const data = await authService.adminLogin({ email, password });
      const user = data?.user || data?.data?.user;
      const token = data?.token || data?.data?.token;
      if (!user || !token) {
        throw new Error('Invalid admin login response from server.');
      }
      login(user, token);
      navigate('/admin/dashboard');
    } catch(err) {
      console.error('Admin login error:', err);
      const errMsg = err.response?.data?.message || err.response?.data?.error || err.message || 'Admin login failed. Please check your credentials.';
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <Card className="admin-login-card">
        <CardBody>
          <h2 className="admin-title">SCHOLARO Admin</h2>
          {error && <Alert type="error" message={error} />}
          <form onSubmit={handleSubmit}>
            <Input id="email" label="Admin Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
            <Input id="password" label="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
            <Button type="submit" fullWidth disabled={loading} className="mt-4 mb-4">{loading ? <Loading size="small"/> : 'Login as Admin'}</Button>
          </form>
          <p className="text-center text-sm"><Link to="/login">Back to Student Login</Link></p>
        </CardBody>
      </Card>
    </div>
  );
}
