import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import { Input, Select, Button, FormSection, Card, CardBody, Checkbox, Alert } from '../../components';
import { isValidUrl } from '../../utils/urlSanitizer';

export default function AdminScholarshipFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  const [formData, setFormData] = useState({
    name: '',
    provider: '',
    category: 'tn_government',
    description: '',
    official_url: '',
    application_url: '',
    active: true,
    min_tenth_pct: '',
    min_twelfth_pct: '',
    max_annual_income: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEdit) {
      api.get(`/scholarships/${id}`).then(res => {
        const d = res.data;
        setFormData({
          name: d.name || '',
          provider: d.provider || '',
          category: d.category || 'tn_government',
          description: d.description || '',
          official_url: d.official_url || '',
          application_url: d.application_url || d.official_url || '',
          active: d.is_active !== 0,
          min_tenth_pct: d.criteria?.min_tenth_pct || '',
          min_twelfth_pct: d.criteria?.min_twelfth_pct || '',
          max_annual_income: d.criteria?.max_annual_income || ''
        });
      }).catch(err => setError('Failed to load scholarship details.'));
    }
  }, [id, isEdit]);

  const handleChange = e => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim()) return setError('Please enter Scholarship Name.');
    if (!formData.provider.trim()) return setError('Please enter Provider Name.');

    if (formData.official_url && !isValidUrl(formData.official_url)) {
      return setError('Official Website URL must be a valid http:// or https:// URL (e.g. https://scholarships.gov.in/).');
    }
    if (formData.application_url && !isValidUrl(formData.application_url)) {
      return setError('Application URL must be a valid http:// or https:// URL (e.g. https://scholarships.gov.in/).');
    }

    const payload = {
      name: formData.name,
      provider: formData.provider,
      category: formData.category,
      description: formData.description,
      official_url: formData.official_url.trim() || null,
      application_url: formData.application_url.trim() || formData.official_url.trim() || null,
      is_active: formData.active ? 1 : 0,
      criteria: {
        min_tenth_pct: formData.min_tenth_pct ? parseFloat(formData.min_tenth_pct) : null,
        min_twelfth_pct: formData.min_twelfth_pct ? parseFloat(formData.min_twelfth_pct) : null,
        max_annual_income: formData.max_annual_income ? parseFloat(formData.max_annual_income) : null
      }
    };

    try {
      if (isEdit) await api.put(`/admin/scholarships/${id}`, payload);
      else await api.post('/admin/scholarships', payload);
      navigate('/admin/scholarships');
    } catch (err) {
      setError(err.customMessage || err.message || 'Failed to save scholarship.');
    }
  };

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
        <h1>{isEdit ? 'Edit Scholarship' : 'Add Scholarship'}</h1>
        
        {error && <Alert type="error" message={error} />}

        <Card>
          <CardBody>
            <form onSubmit={handleSubmit}>
              <FormSection title="Basic Details">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <Input id="name" label="Scholarship Name" value={formData.name} onChange={handleChange} required />
                  <Input id="provider" label="Provider / Department" value={formData.provider} onChange={handleChange} required />
                  <Select
                    id="category"
                    label="Category"
                    value={formData.category}
                    onChange={handleChange}
                    options={[
                      { label: 'Tamil Nadu Government', value: 'tn_government' },
                      { label: 'Central Government', value: 'central_government' },
                      { label: 'Private', value: 'private' },
                      { label: 'NGO / Trust', value: 'ngo_trust' }
                    ]}
                  />
                  <Checkbox id="active" label="Is Active & Visible to Students" checked={formData.active} onChange={handleChange} />
                </div>
                <Input id="description" label="Description" value={formData.description} onChange={handleChange} style={{ marginTop: '16px' }} />
              </FormSection>

              <FormSection title="Official Application Links" description="Enter verified official government portal or department URLs.">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <Input
                    id="official_url"
                    label="Official Website URL"
                    value={formData.official_url}
                    onChange={handleChange}
                    placeholder="e.g. https://scholarships.gov.in/"
                  />
                  <Input
                    id="application_url"
                    label="Application URL"
                    value={formData.application_url}
                    onChange={handleChange}
                    placeholder="e.g. https://scholarships.gov.in/"
                  />
                </div>
              </FormSection>

              <FormSection title="Eligibility Criteria Rules">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                  <Input id="min_tenth_pct" label="Min 10th Marks (%)" type="number" step="0.01" value={formData.min_tenth_pct} onChange={handleChange} />
                  <Input id="min_twelfth_pct" label="Min 12th Marks (%)" type="number" step="0.01" value={formData.min_twelfth_pct} onChange={handleChange} />
                  <Input id="max_annual_income" label="Max Annual Income (₹)" type="number" value={formData.max_annual_income} onChange={handleChange} />
                </div>
              </FormSection>

              <div style={{ marginTop: '24px', display: 'flex', gap: '16px' }}>
                <Button type="submit">Save Scholarship</Button>
                <Button variant="outline" type="button" onClick={() => navigate('/admin/scholarships')}>Cancel</Button>
              </div>
            </form>
          </CardBody>
        </Card>
      </main>
    </div>
  );
}
