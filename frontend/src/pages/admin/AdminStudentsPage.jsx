import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { Table, SearchBar } from '../../components';

export default function AdminStudentsPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    setLoading(true);
    api.get('/admin/students', { params: { search } }).then(res => {
      setData(res.data); setLoading(false);
    }).catch(() => setLoading(false));
  }, [search]);

  const columns = [
    { key: 'full_name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'mobile', label: 'Mobile' },
    { key: 'education_level', label: 'Education' },
    { key: 'registered_date', label: 'Registered On', render: (r) => new Date(r.created_at).toLocaleDateString() }
  ];

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <h2>SCHOLARO Admin</h2>
        <nav>
          <Link to="/admin/dashboard">Dashboard</Link>
          <Link to="/admin/scholarships">Scholarships</Link>
          <Link to="/admin/students" className="active">Students</Link>
        </nav>
      </aside>
      <main className="admin-main">
        <h1>Registered Students</h1>
        <div style={{marginBottom:'24px', maxWidth:'400px'}}>
          <SearchBar value={search} onChange={setSearch} placeholder="Search by name or email..." />
        </div>
        <Table columns={columns} data={data} loading={loading} />
      </main>
    </div>
  );
}
