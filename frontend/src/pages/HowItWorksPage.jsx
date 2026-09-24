import React from 'react';
import { PageHeader, Card, CardBody } from '../components';
import './HowItWorksPage.css';

export default function HowItWorksPage() {
  return (
    <div className="how-page">
      <PageHeader title="How SCHOLARO Works" />
      <div className="how-container">
        <p className="intro">SCHOLARO is a scholarship discovery platform designed for students. We help you find scholarships you are genuinely eligible for, but we do not process the final applications or award funds. Here is how you use the platform:</p>
        
        <div className="steps-list">
          <Card className="how-step"><CardBody><h3>1. Create an Account</h3><p>Register securely to save your progress and matches.</p></CardBody></Card>
          <Card className="how-step"><CardBody><h3>2. Complete Your Profile</h3><p>Enter your academic, financial, community, and personal details. Upload necessary documents to verify information.</p></CardBody></Card>
          <Card className="how-step"><CardBody><h3>3. Automated Matching</h3><p>Our system cross-references your profile against hundreds of scholarship criteria.</p></CardBody></Card>
          <Card className="how-step"><CardBody><h3>4. Review Your Matches</h3><p>See exactly which scholarships you qualify for and which ones you don't, along with the reasons why.</p></CardBody></Card>
          <Card className="how-step"><CardBody><h3>5. Explore Details</h3><p>Read about the benefits, required documents, and guidelines for each matching scholarship.</p></CardBody></Card>
          <Card className="how-step"><CardBody><h3>6. Save for Later</h3><p>Bookmark interesting scholarships to apply for them when you have time.</p></CardBody></Card>
          <Card className="how-step"><CardBody><h3>7. Apply Officially</h3><p>Click the application link to be directed to the official government or private portal to submit your final application.</p></CardBody></Card>
        </div>
      </div>
    </div>
  );
}
