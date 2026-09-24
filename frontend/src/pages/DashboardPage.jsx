import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { studentService } from '../services/studentService';
import { Card, CardBody, CardHeader, Button, Loading, EmptyState, StatusBadge } from '../components';
import './DashboardPage.css';

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profData, resData] = await Promise.all([
          studentService.getProfile().catch(() => null),
          studentService.getResults().catch(() => [])
        ]);
        setProfile(profData);
        setResults(resData);
      } catch(e) { } finally { setLoading(false); }
    };
    fetchData();
  }, []);

  const getCompletionPct = () => {
    if(!profile) return 0;
    let score = 0;
    if(profile.full_name) score += 16.7;
    if(profile.community) score += 16.7;
    if(profile.education_level) score += 16.7;
    if(profile.current_cgpa || profile.tenth_pct) score += 16.7;
    if(profile.annual_income) score += 16.7;
    if(profile.bank_account_available) score += 16.7;
    return Math.min(Math.round(score), 100);
  };

  if(loading) return <div className="p-8"><Loading /></div>;

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>Welcome back, {user?.full_name || 'Student'}!</h1>
        <p>Manage your scholarship applications and profile here.</p>
      </div>

      <div className="quick-actions">
        <Card className="action-card" onClick={() => navigate('/eligibility')}>
          <CardBody><h3>Check Eligibility</h3><p>Find matching scholarships</p></CardBody>
        </Card>
        <Card className="action-card" onClick={() => navigate('/scholarships')}>
          <CardBody><h3>Explore Scholarships</h3><p>Browse all available</p></CardBody>
        </Card>
        <Card className="action-card" onClick={() => navigate('/saved')}>
          <CardBody><h3>Saved Scholarships</h3><p>View your saved list</p></CardBody>
        </Card>
        <Card className="action-card" onClick={() => navigate('/profile')}>
          <CardBody><h3>My Profile</h3><p>Update your information</p></CardBody>
        </Card>
      </div>

      <div className="dashboard-sections">
        <Card className="profile-completion">
          <CardBody>
            <h3>Profile Completion</h3>
            <div className="progress-bar-bg">
              <div className="progress-bar-fill" style={{width: `${getCompletionPct()}%`}}></div>
            </div>
            <p>{getCompletionPct()}% Complete</p>
          </CardBody>
        </Card>

        <Card className="recent-results">
          <CardHeader><h3>Recent Matches</h3></CardHeader>
          <CardBody>
            {results.length > 0 ? (
              <div className="results-list">
                {results.slice(0, 3).map(res => (
                  <div key={res.scholarship.id} className="result-item">
                    <div>
                      <h4>{res.scholarship.name}</h4>
                      <p>{res.scholarship.provider}</p>
                    </div>
                    <StatusBadge status={res.is_eligible ? 'success' : 'warning'} label={res.is_eligible ? 'Eligible' : 'Potential Match'} />
                  </div>
                ))}
                <Link to="/results">View All Matches</Link>
              </div>
            ) : (
              <EmptyState title="No Matches Yet" description="Complete your eligibility check to see matched scholarships." action={<Button onClick={() => navigate('/eligibility')}>Check Eligibility</Button>} />
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
