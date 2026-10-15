import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEligibility } from '../../context/EligibilityContext';
import { Input, Select, Button, FileUpload, FormSection, RadioGroup, Alert } from '../../components';

export default function Step3Academic() {
  const { step3, setStep3, goToStep } = useEligibility();
  const [data, setData] = useState(step3 || {
    student_type: 'college',
    school_name: '', school_location: '', class_standard: '',
    course: '', branch: '', institution: '', year_of_study: '', semester: '',
    course_type: 'Government', college_location: '', currently_studying: 'Yes',
    school_id_doc: null, college_id_doc: null
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (step3 && (step3.institution || step3.school_name || step3.course)) {
      setData(prev => ({ ...prev, ...step3 }));
    }
  }, [step3]);

  const updateData = (updated) => {
    setData(updated);
    setStep3(updated);
  };

  const handleChange = (e) => updateData({ ...data, [e.target.id]: e.target.value });
  const handleRadio = (e) => updateData({ ...data, [e.target.name]: e.target.value });

  const handleTypeChange = (e) => {
    const val = e.target.value;
    updateData({ ...data, student_type: val });
  };

  const handleFileChange = (field, file) => {
    updateData({ ...data, [field]: file ? (file.name || file) : null });
  };

  const handleNext = (e) => {
    e.preventDefault();
    setError('');

    if (data.student_type === 'school') {
      if (!data.school_name?.trim()) return setError('Please enter your School Name.');
      if (!data.school_location?.trim()) return setError('Please enter your School Location/City.');
      if (!data.class_standard) return setError('Please select or enter your Class/Standard.');
      if (!data.school_id_doc) return setError('Please upload your School ID / Bonafide Certificate (Required document).');
    } else {
      if (!data.institution?.trim()) return setError('Please enter your College / Institution Name.');
      if (!data.course?.trim()) return setError('Please enter your Course / Degree Name (e.g. B.E, B.Sc, B.Com).');
      if (!data.branch?.trim()) return setError('Please enter your Branch / Department (e.g. Computer Science).');
      if (!data.year_of_study) return setError('Please select your Year of Study.');
      if (!data.semester) return setError('Please select your Semester.');
      if (!data.course_type) return setError('Please select Institution Type.');
      if (!data.college_id_doc) return setError('Please upload your College ID / Bonafide Certificate (Required document).');
    }

    setStep3(data);
    goToStep(4);
    navigate('/eligibility/step-4');
  };

  const handleBack = () => {
    goToStep(2);
    navigate('/eligibility/step-2');
  };

  return (
    <form onSubmit={handleNext}>
      {error && <Alert type="error" message={error} />}

      <FormSection title="Student Category" description="Select whether you are currently a School Student or a College Student.">
        <RadioGroup
          id="student_type"
          name="student_type"
          label="Select Student Type / Education Level"
          value={data.student_type}
          onChange={handleTypeChange}
          options={[
            { label: 'School Student (Classes 1st to 12th)', value: 'school' },
            { label: 'College Student (Undergraduate / Postgraduate / Diploma)', value: 'college' }
          ]}
          required
        />
      </FormSection>

      {data.student_type === 'school' ? (
        <FormSection title="School Academic Details">
          <div className="grid-2">
            <Input id="school_name" label="School Name" value={data.school_name} onChange={handleChange} placeholder="e.g. Govt Higher Secondary School" required />
            <Input id="school_location" label="School Location / District" value={data.school_location} onChange={handleChange} placeholder="e.g. Chennai" required />
            <Select
              id="class_standard"
              label="Class / Standard"
              value={data.class_standard}
              onChange={handleChange}
              options={[
                { label: 'Class 6th', value: '6' },
                { label: 'Class 7th', value: '7' },
                { label: 'Class 8th', value: '8' },
                { label: 'Class 9th', value: '9' },
                { label: 'Class 10th (SSLC)', value: '10' },
                { label: 'Class 11th (HSC First Year)', value: '11' },
                { label: 'Class 12th (HSC Second Year)', value: '12' }
              ]}
              required
            />
            <RadioGroup id="currently_studying" name="currently_studying" label="Currently Enrolled & Studying?" value={data.currently_studying} onChange={handleRadio} options={[{label:'Yes',value:'Yes'}, {label:'No',value:'No'}]} required />
          </div>
        </FormSection>
      ) : (
        <FormSection title="College Academic Details">
          <div className="grid-2">
            <Input id="institution" label="College / Institution Name" value={data.institution} onChange={handleChange} placeholder="e.g. College of Engineering, Guindy" required />
            <Input id="college_location" label="College Location / City" value={data.college_location} onChange={handleChange} placeholder="e.g. Chennai" required />
            <Input id="course" label="Course / Degree Name" value={data.course} onChange={handleChange} placeholder="e.g. B.E. / B.Tech / B.Sc" required />
            <Input id="branch" label="Branch / Department" value={data.branch} onChange={handleChange} placeholder="e.g. Computer Science & Engineering" required />
            <Select id="year_of_study" label="Year of Study" value={data.year_of_study} onChange={handleChange} options={[ {label:'1st Year',value:'1'}, {label:'2nd Year',value:'2'}, {label:'3rd Year',value:'3'}, {label:'4th Year',value:'4'}, {label:'5th Year',value:'5'} ]} required />
            <Select id="semester" label="Semester" value={data.semester} onChange={handleChange} options={[...Array(10)].map((_,i)=>({label:`Semester ${i+1}`,value:String(i+1)}))} required />
            <Select id="course_type" label="Institution Type" value={data.course_type} onChange={handleChange} options={[ {label:'Government',value:'Government'}, {label:'Private',value:'Private'}, {label:'Aided',value:'Aided'}, {label:'Autonomous',value:'Autonomous'} ]} required />
            <RadioGroup id="currently_studying" name="currently_studying" label="Currently Enrolled & Studying?" value={data.currently_studying} onChange={handleRadio} options={[{label:'Yes',value:'Yes'}, {label:'No',value:'No'}]} required />
          </div>
        </FormSection>
      )}

      <FormSection title="Academic Verification Documents">
        <div className="grid-2">
          {data.student_type === 'school' ? (
            <div>
              <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--color-danger, #ef4444)' }}>[ Required ]</span>
              <FileUpload id="school_id_doc" label="School ID Card / Bonafide Certificate" value={data.school_id_doc} accept=".pdf,.jpg,.jpeg,.png" onChange={(f) => handleFileChange('school_id_doc', f)} required />
            </div>
          ) : (
            <div>
              <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--color-danger, #ef4444)' }}>[ Required ]</span>
              <FileUpload id="college_id_doc" label="College ID Card / Bonafide Certificate" value={data.college_id_doc} accept=".pdf,.jpg,.jpeg,.png" onChange={(f) => handleFileChange('college_id_doc', f)} required />
            </div>
          )}
        </div>
      </FormSection>

      <div className="step-actions">
        <Button variant="outline" type="button" onClick={handleBack}>Back</Button>
        <Button type="submit">Save & Continue</Button>
      </div>
    </form>
  );
}
