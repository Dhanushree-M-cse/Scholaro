import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Card, CardBody, Loading } from '../../components';
import './AdminStyles.css';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({ total_scholarships: 0, active_scholarships: 0, total_students: 0 });
  const [loading, setLoading] = useState(true);
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/admin/dashboard').then(res => {
      setStats(res.data); setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <h2>SCHOLARO Admin</h2>
        <nav>
          <Link to="/admin/dashboard" className="active">Dashboard</Link>
          <Link to="/admin/scholarships">Scholarships</Link>
          <Link to="/admin/students">Students</Link>
        </nav>
        <button className="logout-btn" onClick={()=>{logout(); navigate('/admin/login');}}>Logout</button>
      </aside>
      <main className="admin-main">
        <h1>Dashboard Overview</h1>
        {loading ? <Loading /> : (
          <div className="stats-grid">
            <Card><CardBody><h3>Total Scholarships</h3><p className="stat-num">{stats.total_scholarships}</p></CardBody></Card>
            <Card><CardBody><h3>Active Scholarships</h3><p className="stat-num">{stats.active_scholarships}</p></CardBody></Card>
            <Card><CardBody><h3>Registered Students</h3><p className="stat-num">{stats.total_students}</p></CardBody></Card>
          </div>
        )}
      </main>
    </div>
  );
}
