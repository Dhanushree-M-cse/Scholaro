import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import { Card, CardBody, Input, Button, Alert, Loading } from '../components';
import './LoginPage.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return setError('Please enter your email address');
    if (!password) return setError('Please enter your password');
    setLoading(true);
    setError('');
    try {
      const data = await authService.login({ email, password });
      const user = data?.user || data?.data?.user;
      const token = data?.token || data?.data?.token;
      if (!user || !token) {
        throw new Error('Invalid login response from server.');
      }
      login(user, token);
      navigate('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      const errMsg = err.customMessage || err.response?.data?.message || err.response?.data?.error || err.message || 'Login failed. Please check your credentials.';
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <Card className="login-card">
        <CardBody>
          <div className="login-header">
            <h2>SCHOLARO</h2>
            <p>Welcome back! Please login to your account.</p>
          </div>
          {error && <Alert type="error" message={error} />}
          <form onSubmit={handleSubmit}>
            <Input id="email" label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
            <div className="password-wrapper">
              <Input id="password" label="Password" type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required />
              <button type="button" className="toggle-pwd" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            <Button type="submit" disabled={loading} fullWidth className="submit-btn">
              {loading ? <Loading size="small" /> : 'Login'}
            </Button>
          </form>
          <p className="register-link">Don't have an account? <Link to="/register">Register here</Link></p>
        </CardBody>
      </Card>
    </div>
  );
}
