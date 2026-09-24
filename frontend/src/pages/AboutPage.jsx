import React from 'react';
import { PageHeader } from '../components';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-bg pb-10">
      <PageHeader title="About SCHOLARO" />
      <div className="max-w-3xl mx-auto px-4 py-8 text-secondary">
        <h2 className="text-xl font-bold text-primary-dark mb-4">Our Purpose</h2>
        <p className="mb-6 leading-relaxed">SCHOLARO was created to bridge the gap between students and the financial support they deserve. Every year, millions in scholarship funds go unutilized simply because students are unaware they qualify, or find the eligibility requirements too complex to understand.</p>
        
        <h2 className="text-xl font-bold text-primary-dark mb-4">Who We Serve</h2>
        <p className="mb-6 leading-relaxed">We primarily serve students from Tamil Nadu, from school level up to postgraduate studies, helping them navigate state government, central government, private, and NGO scholarships.</p>
        
        <h2 className="text-xl font-bold text-primary-dark mb-4">Important Disclaimer</h2>
        <p className="mb-6 leading-relaxed">SCHOLARO is an independent platform and is <strong>not affiliated with any government body</strong>. We act as a discovery engine to point you in the right direction. Always verify the final eligibility criteria on the official awarding website before spending time on an application.</p>
      </div>
    </div>
  );
}
