import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { scholarshipService } from '../services/scholarshipService';
import { useAuth } from '../context/AuthContext';
import { PageHeader, Card, CardBody, Button, Loading, EmptyState, StatusBadge, SearchBar, Select } from '../components';
import './ScholarshipListPage.css';

export default function ScholarshipListPage() {
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if(params.get('category')) setCategory(params.get('category'));
  }, [location]);

  useEffect(() => {
    setLoading(true);
    scholarshipService.getScholarships({ search, category }).then(data => {
      setScholarships(data.data || data); setLoading(false);
    }).catch(() => setLoading(false));
  }, [search, category]);

  return (
    <div className="scholarships-page">
      <PageHeader title="Explore Scholarships" />
      <div className="scholarships-container">
        <div className="filters-bar">
          <SearchBar value={search} onChange={setSearch} placeholder="Search scholarships..." />
          <Select id="cat_filter" value={category} onChange={e=>setCategory(e.target.value)} options={[
            {label:'All Categories', value:''},
            {label:'Tamil Nadu Government', value:'tn_government'},
            {label:'Central Government', value:'central_government'},
            {label:'Private', value:'private'},
            {label:'NGO / Trust', value:'ngo_trust'}
          ]} />
        </div>
        
        {loading ? <div className="text-center p-8"><Loading /></div> : 
         scholarships.length === 0 ? <EmptyState title="No scholarships found" /> : (
          <div className="scholarships-grid">
            {scholarships.map(s => (
              <Card key={s.id} className="scholarship-card">
                <CardBody>
                  <StatusBadge status="primary" label={s.category.replace('_',' ')} />
                  <h3>{s.name}</h3>
                  <p className="provider">{s.provider}</p>
                  <p className="description">{s.description?.substring(0, 100)}...</p>
                  <div className="tags">
                    {s.education_level?.map(lvl => <span key={lvl} className="tag">{lvl}</span>)}
                  </div>
                  <div className="card-actions">
                    <Button onClick={() => navigate(`/scholarship/${s.id}`)}>View Details</Button>
                    {isAuthenticated && <Button variant="outline" onClick={() => scholarshipService.saveScholarship(s.id)}>Save</Button>}
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
