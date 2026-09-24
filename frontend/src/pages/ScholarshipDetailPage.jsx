import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { scholarshipService } from '../services/scholarshipService';
import { PageHeader, Card, CardBody, Button, Loading, StatusBadge } from '../components';
import { isValidUrl } from '../utils/urlSanitizer';
import './ScholarshipDetailPage.css';

export default function ScholarshipDetailPage() {
  const { id } = useParams();
  const [scholarship, setScholarship] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    scholarshipService.getScholarship(id).then(data => {
      setScholarship(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="p-8 text-center"><Loading text="Loading scholarship details..." /></div>;
  if (!scholarship) return <div className="p-8 text-center">Scholarship not found.</div>;

  const officialUrl = scholarship.official_url || scholarship.officialUrl || scholarship.application_url || scholarship.applicationUrl;
  const isUrlValid = isValidUrl(officialUrl);

  const eduLevels = Array.isArray(scholarship.education_level)
    ? scholarship.education_level
    : (scholarship.education_level ? scholarship.education_level.split(',') : []);

  return (
    <div className="scholarship-detail-page">
      <div className="detail-header-bg">
        <div className="detail-header-content">
          <StatusBadge status="primary" label={(scholarship.category || 'Government').replace('_', ' ').toUpperCase()} />
          <h1>{scholarship.name}</h1>
          <p className="provider-large">Provided by: {scholarship.provider}</p>
        </div>
      </div>
      <div className="detail-container">
        <div className="main-content">
          <section className="detail-card">
            <h2>About this Scholarship</h2>
            <p>{scholarship.description || 'No description provided.'}</p>
          </section>
          
          <section className="detail-card">
            <h2>Benefits & Financial Support</h2>
            <p>{scholarship.benefits || 'Check official guidelines for benefit details.'}</p>
          </section>

          <section className="detail-card">
            <h2>Eligibility Criteria</h2>
            <ul className="check-list">
              {scholarship.criteria?.tn_resident_required ? <li>Tamil Nadu Residency: Required</li> : null}
              {scholarship.criteria?.community ? <li>Community / Category: {scholarship.criteria.community}</li> : null}
              {scholarship.criteria?.min_tenth_pct ? <li>Minimum 10th Marks: {scholarship.criteria.min_tenth_pct}%</li> : null}
              {scholarship.criteria?.min_twelfth_pct ? <li>Minimum 12th Marks: {scholarship.criteria.min_twelfth_pct}%</li> : null}
              {scholarship.criteria?.min_cgpa ? <li>Minimum CGPA: {scholarship.criteria.min_cgpa}</li> : null}
              {scholarship.criteria?.max_annual_income ? <li>Maximum Annual Family Income: ₹{scholarship.criteria.max_annual_income}</li> : null}
              {scholarship.criteria?.first_gen_required ? <li>First-Generation Graduate Status: Required</li> : null}
              {eduLevels.length > 0 && <li>Education Level: {eduLevels.join(', ')}</li>}
            </ul>
          </section>

          <section className="detail-card">
            <h2>Required Documents</h2>
            <p>{scholarship.required_documents || 'Aadhaar Card, Mark Sheets, Income Certificate, Bank Passbook'}</p>
          </section>

          {scholarship.guidelines && (
            <section className="detail-card">
              <h2>Application Guidelines</h2>
              <p>{scholarship.guidelines}</p>
            </section>
          )}
        </div>

        <div className="sidebar">
          {/* Official Application Card */}
          <Card className="official-app-card">
            <CardBody>
              <h3>Official Application</h3>
              
              {isUrlValid && (
                <div className="verified-badge-wrapper">
                  <span className="verified-badge">
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Official Source Verified
                  </span>
                </div>
              )}

              <p className="mt-3 text-sm text-secondary">
                To apply for this scholarship, proceed to the official government / department website. SCHOLARO does not charge any fee or collect applications directly.
              </p>

              {isUrlValid ? (
                <a
                  href={officialUrl.trim()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary apply-now-btn full-width-btn"
                >
                  Apply Now &rarr;
                </a>
              ) : (
                <div className="no-url-alert">
                  Official application link not available yet.
                </div>
              )}

              <Button
                fullWidth
                variant="outline"
                className="mt-3"
                onClick={() => scholarshipService.saveScholarship(scholarship.id)}
              >
                Save for Later
              </Button>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
