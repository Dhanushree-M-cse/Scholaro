import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { Table, Button, SearchBar, ConfirmDialog } from '../../components';

export default function AdminScholarshipsPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const navigate = useNavigate();

  const fetchSchol = () => {
    setLoading(true);
    api.get('/admin/scholarships', { params: { search } }).then(res => {
      setData(res.data); setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => { fetchSchol(); }, [search]);

  const handleDelete = async () => {
    if(deleteId) {
      await api.delete(`/admin/scholarships/${deleteId}`);
      setDeleteId(null);
      fetchSchol();
    }
  };

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'provider', label: 'Provider' },
    { key: 'category', label: 'Category' },
    { key: 'status', label: 'Status', render: (r) => r.is_active ? 'Active' : 'Inactive' },
    { key: 'actions', label: 'Actions', render: (r) => (
      <div style={{display:'flex',gap:'8px'}}>
        <Button size="small" onClick={() => navigate(`/admin/scholarships/${r.id}/edit`)}>Edit</Button>
        <Button size="small" variant="outline" onClick={() => setDeleteId(r.id)}>Delete</Button>
      </div>
    ) }
  ];

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <h2>SCHOLARO Admin</h2>
        <nav>
          <Link to="/admin/dashboard">Dashboard</Link>
          <Link to="/admin/scholarships" className="active">Scholarships</Link>
          <Link to="/admin/students">Students</Link>
        </nav>
      </aside>
      <main className="admin-main">
        <div style={{display:'flex',justifyContent:'space-between',marginBottom:'24px'}}>
          <h1>Manage Scholarships</h1>
          <Button onClick={() => navigate('/admin/scholarships/create')}>Add Scholarship</Button>
        </div>
        <div style={{marginBottom:'24px', maxWidth:'400px'}}>
          <SearchBar value={search} onChange={setSearch} placeholder="Search by name..." />
        </div>
        <Table columns={columns} data={data} loading={loading} />
        <ConfirmDialog isOpen={!!deleteId} title="Delete Scholarship" message="Are you sure you want to delete this? This action cannot be undone." onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />
      </main>
    </div>
  );
}
