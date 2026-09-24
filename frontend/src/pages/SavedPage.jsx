import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { scholarshipService } from '../services/scholarshipService';
import { PageHeader, Card, CardBody, Button, Loading, EmptyState, StatusBadge, ConfirmDialog } from '../components';

export default function SavedPage() {
  const [saved, setSaved] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removeId, setRemoveId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSaved();
  }, []);

  const fetchSaved = () => {
    scholarshipService.getSaved().then(data => {
      setSaved(data); setLoading(false);
    }).catch(() => setLoading(false));
  };

  const handleRemove = async () => {
    if(removeId) {
      await scholarshipService.unsaveScholarship(removeId);
      setRemoveId(null);
      fetchSaved();
    }
  };

  return (
    <div className="scholarships-page">
      <PageHeader title="Saved Scholarships" />
      <div className="scholarships-container">
        {loading ? <div className="text-center p-8"><Loading /></div> : 
         saved.length === 0 ? <EmptyState title="No Saved Scholarships" description="Scholarships you save will appear here." action={<Button onClick={()=>navigate('/scholarships')}>Explore</Button>} /> : (
          <div className="scholarships-grid">
            {saved.map(item => (
              <Card key={item.scholarship_id}>
                <CardBody>
                  <StatusBadge status="primary" label={item.scholarship?.category?.replace('_',' ')} />
                  <h3>{item.scholarship?.name}</h3>
                  <p className="provider">{item.scholarship?.provider}</p>
                  <div className="card-actions mt-4">
                    <Button onClick={() => navigate(`/scholarship/${item.scholarship_id}`)}>View Details</Button>
                    <Button variant="outline" onClick={() => setRemoveId(item.scholarship_id)}>Remove</Button>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </div>
      <ConfirmDialog isOpen={!!removeId} title="Remove Scholarship" message="Are you sure you want to remove this from your saved list?" onConfirm={handleRemove} onCancel={() => setRemoveId(null)} />
    </div>
  );
}
