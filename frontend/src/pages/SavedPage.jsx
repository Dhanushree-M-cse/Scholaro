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
      setSaved(Array.isArray(data) ? data : []);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  const handleRemove = async () => {
    if (removeId) {
      await scholarshipService.unsaveScholarship(removeId).catch(() => {});
      setRemoveId(null);
      fetchSaved();
    }
  };

  return (
    <div className="scholarships-page">
      <PageHeader title="Saved Scholarships" />
      <div className="scholarships-container">
        {loading ? (
          <div className="text-center p-8"><Loading /></div>
        ) : saved.length === 0 ? (
          <EmptyState
            title="No Saved Scholarships"
            description="Scholarships you save will appear here."
            action={<Button onClick={() => navigate('/scholarships')}>Explore Scholarships</Button>}
          />
        ) : (
          <div className="scholarships-grid">
            {saved.map(item => {
              // Backend JOIN returns flat rows: item.id (scholarship row), item.name, item.provider, etc.
              // item.scholarship_id is also present from the saved_scholarships table
              const scholarshipId = item.scholarship_id || item.id;
              const name = item.name || 'Scholarship';
              const provider = item.provider || '';
              const category = item.category || '';

              return (
                <Card key={scholarshipId}>
                  <CardBody>
                    <StatusBadge status="primary" label={category.replace(/_/g, ' ')} />
                    <h3 style={{ marginTop: '8px' }}>{name}</h3>
                    <p className="provider">{provider}</p>
                    <div className="card-actions mt-4">
                      <Button onClick={() => navigate(`/scholarship/${scholarshipId}`)}>View Details</Button>
                      <Button variant="outline" onClick={() => setRemoveId(scholarshipId)}>Remove</Button>
                    </div>
                  </CardBody>
                </Card>
              );
            })}
          </div>
        )}
      </div>
      <ConfirmDialog
        isOpen={!!removeId}
        title="Remove Scholarship"
        message="Are you sure you want to remove this from your saved list?"
        onConfirm={handleRemove}
        onCancel={() => setRemoveId(null)}
      />
    </div>
  );
}
