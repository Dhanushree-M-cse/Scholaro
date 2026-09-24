import React, { useEffect, useState } from 'react';
import { studentService } from '../services/studentService';
import { PageHeader, Card, CardBody, Button, Loading } from '../components';

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    studentService.getProfile().then(data => {
      setProfile(data); setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if(loading) return <div className="p-8 text-center"><Loading /></div>;

  return (
    <div className="min-h-screen bg-bg pb-10">
      <PageHeader title="My Profile" />
      <div className="max-w-3xl mx-auto px-4 mt-8">
        <Card>
          <CardBody>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <h2>Profile Details</h2>
              <Button variant="outline" onClick={() => window.location.href = '/eligibility'}>Edit Profile</Button>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'16px',marginTop:'24px'}}>
              {profile && Object.entries(profile).filter(([k,v])=>typeof v !== 'object').map(([k,v]) => (
                <div key={k} style={{display:'flex',flexDirection:'column'}}>
                  <span style={{fontSize:'0.85rem',color:'var(--color-text-secondary)',textTransform:'capitalize'}}>{k.replace(/_/g,' ')}</span>
                  <span style={{fontWeight:'500'}}>{String(v) || '-'}</span>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
