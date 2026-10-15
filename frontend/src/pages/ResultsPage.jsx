import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { studentService } from '../services/studentService';
import { scholarshipService } from '../services/scholarshipService';
import { PageHeader, Card, CardBody, Button, Loading, EmptyState, StatusBadge, Alert } from '../components';
import { isValidUrl } from '../utils/urlSanitizer';
import './ResultsPage.css';

export default function ResultsPage() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    studentService.getResults().then(data => {
      setResults(data || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleSave = async (id) => {
    await scholarshipService.saveScholarship(id).catch(() => {});
  };

  if (loading) return <div className="p-8 text-center"><Loading text="Loading scholarship matches..." /></div>;

  return (
    <div className="results-page">
      <PageHeader
        title="Scholarships You May Be Eligible For"
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Results', href: '/results' }]}
      />
      <div className="results-container">
        <Alert type="info" message="These scholarship matches are calculated automatically based on your eligibility profile. Click 'Apply on Official Website →' to visit the verified official source." />

        {results.length === 0 ? (
          <EmptyState
            title="No matches found"
            description="We couldn't find any scholarships matching your profile at the moment. Please update your profile or check back later."
            action={<Button onClick={() => navigate('/eligibility')}>Update Profile</Button>}
          />
        ) : (
          <div className="results-grid">
            {results.map((res) => {
              const scholarship = res.scholarship || res;
              const officialUrl = res.officialUrl || res.official_url || scholarship.official_url || scholarship.officialUrl || scholarship.application_url;
              const matchScore = res.match_score ?? res.matchPercentage ?? 100;
              const categoryLabel = (scholarship.category || res.category || 'Government').replace('_', ' ').toUpperCase();
              const benefits = scholarship.benefits || res.benefits;
              const requiredDocs = scholarship.required_documents || res.required_documents;

              return (
                <Card key={scholarship.id || res.id} className="result-card">
                  <CardBody>
                    <div className="result-card-header">
                      <div>
                        <div className="badge-row">
                          <StatusBadge status={scholarship.category === 'tn_government' ? 'primary' : 'secondary'} label={categoryLabel} />
                          <StatusBadge status={res.is_eligible ? 'success' : 'warning'} label={res.is_eligible ? 'Eligible' : 'Potential Match'} />
                        </div>
                        <h3>{scholarship.name || res.name}</h3>
                        <p className="provider">Provider: {scholarship.provider || res.provider}</p>
                      </div>
                      <div className="match-pill">
                        <span className="match-pill-value">{matchScore}% Match</span>
                      </div>
                    </div>

                    <div className="match-score">
                      <div className="score-header">
                        <span>Profile Compatibility Score</span>
                        <span>{matchScore}%</span>
                      </div>
                      <div className="score-bar-bg">
                        <div className="score-bar-fill" style={{ width: `${matchScore}%` }}></div>
                      </div>
                    </div>

                    {/* Why Student Matches */}
                    <div className="criteria-lists">
                      {res.matched_criteria?.length > 0 && (
                        <div className="criteria-list">
                          <h4>Why You Match</h4>
                          <ul>
                            {res.reasons && res.reasons.length > 0
                              ? res.reasons.filter(r => r.includes('verified') || r.includes('met') || r.includes('matches')).map((r, i) => (
                                  <li key={i} className="text-success">✓ {r}</li>
                                ))
                              : res.matched_criteria.map((c, i) => (
                                  <li key={i} className="text-success">✓ {c.replace(/_/g, ' ')}</li>
                                ))}
                          </ul>
                        </div>
                      )}
                      {res.unmet_criteria?.length > 0 && (
                        <div className="criteria-list">
                          <h4>Unmet Criteria</h4>
                          <ul>
                            {res.unmet_criteria.map((c, i) => (
                              <li key={i} className="text-warning">! {c.replace(/_/g, ' ')}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* Benefits & Required Documents Summary */}
                    {(benefits || requiredDocs) && (
                      <div className="result-details-section">
                        {benefits && (
                          <div className="result-detail-block">
                            <strong>Benefits:</strong> {benefits}
                          </div>
                        )}
                        {requiredDocs && (
                          <div className="result-detail-block mt-2">
                            <strong>Required Documents:</strong> {requiredDocs}
                          </div>
                        )}
                      </div>
                    )}

                    <div className="result-actions">
                      <Button variant="outline" onClick={() => handleSave(scholarship.id || res.id)}>
                        Save
                      </Button>
                      <Button variant="secondary" onClick={() => navigate(`/scholarship/${scholarship.id || res.id}`, { state: { matchScore, isEligible: res.is_eligible } })}>
                        View Details
                      </Button>
                      {isValidUrl(officialUrl) ? (
                        <a
                          href={officialUrl.trim()}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-primary apply-official-btn"
                        >
                          Apply on Official Website &rarr;
                        </a>
                      ) : (
                        <span className="no-official-link-msg">Official application link not available yet.</span>
                      )}
                    </div>
                  </CardBody>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
