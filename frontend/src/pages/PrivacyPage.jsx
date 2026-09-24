import React from 'react';
import { PageHeader } from '../components';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-bg pb-10">
      <PageHeader title="Privacy Policy" />
      <div className="max-w-3xl mx-auto px-4 py-8 text-secondary">
        <h2 className="text-xl font-bold text-primary-dark mb-4">Data Collection</h2>
        <p className="mb-6 leading-relaxed">We collect academic, financial, and personal information solely for the purpose of matching you with relevant scholarships.</p>
        
        <h2 className="text-xl font-bold text-primary-dark mb-4">Document Handling</h2>
        <p className="mb-6 leading-relaxed">Documents uploaded are securely stored and used only for internal verification to improve the accuracy of your matches. They are not shared with third parties.</p>
        
        <h2 className="text-xl font-bold text-primary-dark mb-4">Security</h2>
        <p className="mb-6 leading-relaxed">We employ standard security measures to protect your account. However, users are responsible for maintaining the confidentiality of their passwords.</p>
      </div>
    </div>
  );
}
