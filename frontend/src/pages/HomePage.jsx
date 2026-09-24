import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button, Card, CardBody } from '../components';
import './HomePage.css';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-content">
        <span className="hero-badge">BUILT FOR TAMIL NADU STUDENTS</span>
          <h1>Find the Scholarships<br/>You're Eligible For.</h1>
          <p>Discover government, private, and NGO scholarships matched exactly to your profile. Simplified discovery, direct official applications.</p>
          <div className="hero-actions">
            <Button size="lg" onClick={() => navigate('/eligibility')}>Check My Eligibility →</Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/scholarships')}>Explore Scholarships</Button>
          </div>
        </div>
        <div className="hero-visual">
          <Card className="flow-card">
            <CardBody>
              <div className="flow-step">
                <div className="flow-icon">1</div>
                <div><h4>YOUR PROFILE</h4><p>Tell us about yourself</p></div>
              </div>
              <div className="flow-line"></div>
              <div className="flow-step">
                <div className="flow-icon">2</div>
                <div><h4>ELIGIBILITY MATCH</h4><p>We find what fits</p></div>
              </div>
              <div className="flow-line"></div>
              <div className="flow-step">
                <div className="flow-icon">3</div>
                <div><h4>SCHOLARSHIP</h4><p>Review the details</p></div>
              </div>
              <div className="flow-line"></div>
              <div className="flow-step">
                <div className="flow-icon">4</div>
                <div><h4>OFFICIAL APPLICATION</h4><p>Apply on official site</p></div>
              </div>
            </CardBody>
          </Card>
        </div>
      </section>

      <section className="journey-section">
        <h2>Your Scholarship Journey</h2>
        <div className="journey-grid">
          <div className="journey-step"><h3>01. Your Profile</h3><p>Create an account and complete your academic, financial, and personal profile securely.</p></div>
          <div className="journey-step"><h3>02. Eligibility Match</h3><p>Our system analyzes your data to find scholarships you are genuinely eligible for.</p></div>
          <div className="journey-step"><h3>03. Scholarship</h3><p>Review requirements, benefits, and documents needed for each matched scholarship.</p></div>
          <div className="journey-step"><h3>04. Official Application</h3><p>We link you directly to the official portals to submit your actual application safely.</p></div>
        </div>
      </section>

      <section className="categories-section">
        <h2>Explore Scholarship Categories</h2>
        <div className="categories-grid">
          <Card className="cat-card" onClick={() => navigate('/scholarships?category=tn_government')}>
            <CardBody><h3>Tamil Nadu Government</h3><p>State schemes and support.</p></CardBody>
          </Card>
          <Card className="cat-card" onClick={() => navigate('/scholarships?category=central_government')}>
            <CardBody><h3>Central Government</h3><p>National level scholarships.</p></CardBody>
          </Card>
          <Card className="cat-card" onClick={() => navigate('/scholarships?category=private')}>
            <CardBody><h3>Private</h3><p>Corporate and institutional funding.</p></CardBody>
          </Card>
          <Card className="cat-card" onClick={() => navigate('/scholarships?category=ngo_trust')}>
            <CardBody><h3>NGO / Trust</h3><p>Support from non-profits.</p></CardBody>
          </Card>
        </div>
      </section>

      <section className="trust-section">
        <h2>One Place to Understand Your Options</h2>
        <div className="trust-grid">
          <div className="trust-item"><h4>Eligibility-based discovery</h4><p>No more guessing. See what you qualify for.</p></div>
          <div className="trust-item"><h4>Clear scholarship information</h4><p>Summarized criteria, benefits, and required documents.</p></div>
          <div className="trust-item"><h4>Official application links</h4><p>We connect you to the real source. No middlemen.</p></div>
        </div>
      </section>

      <section className="final-cta">
        <h2>Ready to Find Scholarships That Match You?</h2>
        <div className="cta-actions">
          <Button size="lg" onClick={() => navigate('/eligibility')}>Check My Eligibility →</Button>
          <Button size="lg" variant="outline" onClick={() => navigate('/scholarships')}>Browse First</Button>
        </div>
      </section>
    </div>
  );
}
