import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/authService';
import { Card, CardBody, Input, Button, Alert, Loading } from '../components';
import './RegisterPage.css';

export default function RegisterPage() {
  const [formData, setFormData] = useState({ full_name: '', email: '', mobile: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = e => setFormData({...formData, [e.target.id]: e.target.value});

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.full_name.trim()) return setError('Please enter your full name');
    if (!formData.email.trim()) return setError('Please enter your email address');
    if (formData.mobile.length !== 10) return setError('Mobile number must be exactly 10 digits');
    if (formData.password.length < 8) return setError('Password must be at least 8 characters long');
    if (formData.password !== formData.confirmPassword) return setError('Passwords do not match');
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await authService.register(formData);
      setSuccess('Registration successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      console.error('Registration error:', err);
      const errMsg = err.customMessage || err.response?.data?.message || err.response?.data?.error || err.message || 'Registration failed. Please try again.';
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <Card className="register-card">
        <CardBody>
          <div className="register-header">
            <h2>Create an Account</h2>
          </div>
          {error && <Alert type="error" message={error} />}
          {success && <Alert type="success" message={success} />}
          <form onSubmit={handleSubmit}>
            <Input id="full_name" label="Full Name" value={formData.full_name} onChange={handleChange} required />
            <Input id="email" label="Email" type="email" value={formData.email} onChange={handleChange} required />
            <Input id="mobile" label="Mobile" type="number" value={formData.mobile} onChange={handleChange} required />
            <Input id="password" label="Password" type="password" value={formData.password} onChange={handleChange} required />
            <Input id="confirmPassword" label="Confirm Password" type="password" value={formData.confirmPassword} onChange={handleChange} required />
            <Button type="submit" disabled={loading} fullWidth className="submit-btn">
              {loading ? <Loading size="small" /> : 'Register'}
            </Button>
          </form>
          <p className="login-link">Already have an account? <Link to="/login">Login here</Link></p>
        </CardBody>
      </Card>
    </div>
  );
}
