import React from 'react';
import { PageHeader, Card, CardBody } from '../components';

export default function HelpPage() {
  const faqs = [
    {q: 'What is SCHOLARO?', a: 'A discovery platform that matches your profile against various scholarship requirements.'},
    {q: 'How does matching work?', a: 'We compare the data you enter in the Eligibility Check against the criteria defined for each scholarship in our database.'},
    {q: 'Does SCHOLARO guarantee selection?', a: 'No. We only indicate eligibility. The final decision rests with the awarding body.'},
    {q: 'Where do I apply?', a: 'Once you find a matched scholarship, click the link to visit the official portal to apply.'}
  ];

  return (
    <div className="min-h-screen bg-bg pb-10">
      <PageHeader title="Help & FAQs" />
      <div className="max-w-3xl mx-auto px-4 py-8">
        {faqs.map((faq, i) => (
          <Card key={i} className="mb-4">
            <CardBody>
              <h3 className="font-bold text-primary-dark mb-2">{faq.q}</h3>
              <p className="text-secondary">{faq.a}</p>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}
