import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link, useNavigate } from 'react-router-dom';
import { scholarshipService } from '../services/scholarshipService';
import { studentService } from '../services/studentService';
import { Loading } from '../components';
import { isValidUrl } from '../utils/urlSanitizer';
import './ScholarshipDetailPage.css';

export default function ScholarshipDetailPage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [scholarship, setScholarship] = useState(null);
  const [matchScore, setMatchScore] = useState(location.state?.matchScore ?? null);
  const [isEligible, setIsEligible] = useState(location.state?.isEligible ?? true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError('');

    // Fetch scholarship details
    scholarshipService.getScholarship(id)
      .then((data) => {
        if (!isMounted) return;
        setScholarship(data);

        // If matchScore wasn't passed via location state, try fetching student results
        if (location.state?.matchScore === undefined) {
          studentService.getResults()
            .then((results) => {
              if (!isMounted || !Array.isArray(results)) return;
              const match = results.find(
                (r) => String(r.id) === String(id) || String(r.scholarship?.id) === String(id)
              );
              if (match) {
                setMatchScore(match.match_score ?? match.matchPercentage ?? 100);
                setIsEligible(match.is_eligible ?? true);
              } else {
                setMatchScore(100);
              }
            })
            .catch(() => {
              if (isMounted) setMatchScore(100);
            });
        }
        setLoading(false);
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error('Error fetching scholarship details:', err);
        setError('Unable to load scholarship details.');
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [id, location.state]);

  if (loading) {
    return (
      <div className="scholarship-detail-page">
        <div className="detail-loading-wrapper">
          <Loading text="Loading scholarship details..." />
        </div>
      </div>
    );
  }

  if (error || !scholarship) {
    return (
      <div className="scholarship-detail-page">
        <div className="detail-error-card">
          <h2>Unable to load scholarship details.</h2>
          <p>The requested scholarship could not be found or a network error occurred.</p>
          <button className="btn-back" onClick={() => navigate('/scholarships')}>
            ← Back to Scholarships
          </button>
        </div>
      </div>
    );
  }

  const officialUrl = scholarship.official_url || scholarship.officialUrl || scholarship.application_url || scholarship.applicationUrl || '';
  const isUrlValid = isValidUrl(officialUrl);

  let cleanHost = '';
  if (isUrlValid) {
    try {
      cleanHost = new URL(officialUrl.trim()).hostname.replace(/^www\./, '');
    } catch {
      cleanHost = officialUrl.trim();
    }
  }

  // Parse category badge text
  const levelBadgeText = scholarship.category === 'central_government'
    ? 'CENTRAL LEVEL'
    : (scholarship.category === 'private' ? 'PRIVATE LEVEL' : 'STATE LEVEL');

  // Format documents array
  const docList = scholarship.required_documents
    ? scholarship.required_documents.split(',').map(d => d.trim()).filter(Boolean)
    : [];

  // Parse Benefits into 3 structured blocks
  const benefitsText = scholarship.benefits || '';
  let awardAmount = 'Financial Support';
  let durationText = 'Course Duration';
  let supportText = 'Tuition & Maintenance';

  if (benefitsText) {
    if (benefitsText.toLowerCase().includes('100%') || benefitsText.toLowerCase().includes('tuition fee waiver') || benefitsText.toLowerCase().includes('full tuition')) {
      awardAmount = '100% Fee Waiver';
    } else {
      const match = benefitsText.match(/(Rs\.?\s*[\d,]+(\s*per\s*(annum|month))?)/i);
      if (match) {
        awardAmount = match[0];
      } else {
        awardAmount = benefitsText.split('.')[0] || 'Financial Support';
      }
    }

    if (benefitsText.toLowerCase().includes('month')) {
      durationText = 'Monthly Allowance';
    } else if (benefitsText.toLowerCase().includes('annum') || benefitsText.toLowerCase().includes('year')) {
      durationText = 'Renewable Annually';
    } else if (benefitsText.toLowerCase().includes('3 to 4') || benefitsText.toLowerCase().includes('4 years')) {
      durationText = '3 - 4 Years';
    }

    if (benefitsText.toLowerCase().includes('tuition')) {
      supportText = 'Tuition & Maintenance';
    } else if (benefitsText.toLowerCase().includes('cash award')) {
      supportText = 'Cash Award & Merit';
    } else if (benefitsText.toLowerCase().includes('dbt')) {
      supportText = 'Direct Bank Transfer';
    }
  }

  // Format Criteria List
  const criteria = scholarship.criteria || {};
  const criteriaItems = [];
  if (criteria.tn_resident_required) criteriaItems.push('Tamil Nadu Domicile / Residence');
  if (scholarship.education_level) criteriaItems.push(`Course / Education Level (${scholarship.education_level.replace(/,/g, ', ')})`);
  if (criteria.min_tenth_pct || criteria.min_twelfth_pct || criteria.min_cgpa) {
    const perfParts = [];
    if (criteria.min_tenth_pct) perfParts.push(`10th: ${criteria.min_tenth_pct}%`);
    if (criteria.min_twelfth_pct) perfParts.push(`12th: ${criteria.min_twelfth_pct}%`);
    if (criteria.min_cgpa) perfParts.push(`CGPA: ${criteria.min_cgpa}`);
    criteriaItems.push(`Academic Performance (${perfParts.join(' | ')})`);
  }
  if (criteria.community) criteriaItems.push(`Community / Category (${criteria.community})`);
  if (criteria.max_annual_income) criteriaItems.push(`Family Income up to ₹${Number(criteria.max_annual_income).toLocaleString('en-IN')}`);
  if (criteria.first_gen_required) criteriaItems.push('First-Generation Graduate Status');
  if (criteria.gender) criteriaItems.push(`Gender Restriction (${criteria.gender})`);

  // Default criteria fallback if none populated
  if (criteriaItems.length === 0) {
    criteriaItems.push('Tamil Nadu Domicile / Residence');
    criteriaItems.push('Course / Education Level');
    criteriaItems.push('Academic Performance');
    criteriaItems.push('Community / Category');
    criteriaItems.push('Family Income');
    criteriaItems.push('Other Conditions');
  }

  const finalMatchScore = matchScore !== null ? `${matchScore}%` : 'Match score unavailable';

  return (
    <div className="scholarship-detail-page">
      <div className="detail-outer-container">
        {/* 2. BREADCRUMB */}
        <div className="detail-breadcrumb">
          <Link to="/scholarships">Scholarships</Link>
          <span className="separator">/</span>
          <span className="current">Details</span>
        </div>

        {/* 3. SCHOLARSHIP HEADER CARD */}
        <div className="scholarship-header-card">
          <div className="header-left">
            <div className="badge-group">
              <span className="badge badge-level">{levelBadgeText}</span>
              {isEligible && (
                <span className="badge badge-eligible">
                  ELIGIBLE <span className="check-icon">✓</span>
                </span>
              )}
            </div>
            <h1 className="scholarship-title">{scholarship.name}</h1>
            <p className="scholarship-provider">Presented by {scholarship.provider}</p>
          </div>
          
          <div className="header-right">
            <div className="match-score-box">
              <div className="match-score-text">
                <span className="score-num">{finalMatchScore}</span>
                <span className="score-label">Match Score</span>
              </div>
              <div className="sparkle-circle" title="Compatibility Score">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="#059669">
                  <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* 4. MAIN CONTENT LAYOUT (Two-Column) */}
        <div className="detail-two-column-layout">
          {/* LEFT COLUMN */}
          <div className="detail-left-column">
            {/* 5. ABOUT THIS SCHOLARSHIP */}
            <section className="detail-card">
              <h2 className="card-heading">About This Scholarship</h2>
              <p className="card-description">
                {scholarship.description || 'Description of the scholarship program, its objectives, and the organization behind it. This section provides context about the scholarship\'s history and purpose.'}
              </p>
            </section>

            {/* 6. SCHOLARSHIP BENEFITS */}
            <section className="detail-card">
              <h2 className="card-heading">Scholarship Benefits</h2>
              <div className="benefits-three-grid">
                <div className="benefit-subcard">
                  <span className="benefit-label">Award Amount</span>
                  <div className="benefit-value text-accent">{awardAmount}</div>
                </div>
                <div className="benefit-subcard">
                  <span className="benefit-label">Duration</span>
                  <div className="benefit-value">{durationText}</div>
                </div>
                <div className="benefit-subcard">
                  <span className="benefit-label">Financial Support</span>
                  <div className="benefit-value">{supportText}</div>
                </div>
              </div>
            </section>

            {/* 7. ELIGIBILITY CRITERIA */}
            <section className="detail-card">
              <h2 className="card-heading">Eligibility Criteria</h2>
              <div className="criteria-list-wrapper">
                {criteriaItems.map((item, idx) => (
                  <div key={idx} className="criteria-row">
                    <div className="criteria-icon">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="#059669">
                        <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
                      </svg>
                    </div>
                    <span className="criteria-text">{item}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* 8. REQUIRED DOCUMENTS */}
            <section className="detail-card">
              <h2 className="card-heading">Required Documents</h2>
              <div className="documents-two-grid">
                {(docList.length > 0
                  ? docList
                  : ['Aadhaar Card', 'Income Certificate', 'Community Certificate', 'Mark Sheets', 'Bank Passbook', 'Passport Photo']
                ).map((doc, idx) => (
                  <div key={idx} className="document-pill">
                    <span className="doc-icon">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                        <line x1="16" y1="13" x2="8" y2="13" />
                        <line x1="16" y1="17" x2="8" y2="17" />
                      </svg>
                    </span>
                    <span className="doc-name">{doc}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* 11. GUIDELINES & IMPORTANT INSTRUCTIONS */}
            <section className="detail-card">
              <h2 className="card-heading">Guidelines & Important Instructions</h2>
              <div className="guidelines-stack">
                <div className="guideline-block">
                  <h3 className="guideline-subheading">APPLICATION PROCESS</h3>
                  <p className="guideline-content">
                    {scholarship.guidelines || 'Submit application via the official scholarship portal before the specified deadline.'}
                  </p>
                </div>

                <div className="guideline-block">
                  <h3 className="guideline-subheading">IMPORTANT CONDITIONS</h3>
                  <p className="guideline-content">
                    Applicants must satisfy all prescribed eligibility criteria and present authentic certificates during institutional verification.
                  </p>
                </div>

                <div className="guideline-block">
                  <h3 className="guideline-subheading">REQUIRED DOCUMENTS</h3>
                  <p className="guideline-content">
                    {scholarship.required_documents || 'Must produce original certificates for verification.'}
                  </p>
                </div>

                <div className="guideline-block">
                  <h3 className="guideline-subheading">APPLICATION DEADLINE</h3>
                  <p className="guideline-content">
                    {scholarship.application_end
                      ? new Date(scholarship.application_end).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
                      : 'As per official department notification'}
                  </p>
                </div>

                <div className="guideline-block">
                  <h3 className="guideline-subheading">VERIFICATION REQUIREMENTS</h3>
                  <p className="guideline-content">
                    All submitted documents must be verified and endorsed by the head of the institution or designated government authority.
                  </p>
                </div>
              </div>
            </section>
          </div>

          {/* RIGHT COLUMN */}
          <div className="detail-right-column">
            {/* 9. READY TO APPLY CARD */}
            <div className="apply-sticky-card">
              <h2 className="apply-card-heading">Ready to Apply?</h2>
              <p className="apply-card-subtext">
                Applications are completed on the official scholarship website.
              </p>

              {isUrlValid ? (
                <a
                  href={officialUrl.trim()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-visit-official"
                >
                  Visit Official Website <span className="arrow-icon">↗</span>
                </a>
              ) : (
                <div className="apply-unavailable-msg">
                  Official application link currently unavailable.
                </div>
              )}

              {/* 10. OFFICIAL SOURCE */}
              <div className="official-source-block">
                <div className="source-verified-line">
                  <span className="source-icon">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="#059669">
                      <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
                    </svg>
                  </span>
                  <span className="source-title">Official Source</span>
                  <span className="source-check">✓</span>
                </div>
                {scholarship.updated_at && (
                  <div className="source-verified-date">
                    Last Verified: {new Date(scholarship.updated_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </div>
                )}
                {isUrlValid && (
                  <a
                    href={officialUrl.trim()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="source-link"
                  >
                    [{cleanHost}]
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

