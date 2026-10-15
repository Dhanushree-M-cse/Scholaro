-- =============================================================================
-- SCHOLARO SEED DATA — VERIFIED OFFICIAL GOVERNMENT SCHOLARSHIP SCHEMES
-- Run this AFTER schema.sql on your Cloud MySQL database.
-- =============================================================================

USE `scholaro_db`;



-- Admin user (password: Admin@2026)
INSERT IGNORE INTO `users` (`full_name`, `email`, `mobile`, `password_hash`, `role`) VALUES
('SCHOLARO Admin', 'admin@scholaro.dev', '9000000000',
 '$2b$10$YQs5Q2T0t1z6VCdFKhfmWudN4oGo5gBqbxCcXjT4vWQyZ6Ak0V3F6', 'admin');

-- Clear old demo listings
DELETE FROM `scholarship_criteria`;
DELETE FROM `scholarships`;

-- Insert Verified Official Scholarships
INSERT INTO `scholarships`
  (`id`, `name`, `provider`, `category`, `description`, `education_level`, `benefits`, `required_documents`, `guidelines`, `official_url`, `application_url`, `application_start`, `application_end`, `is_active`)
VALUES
(
  1,
  'Central Sector Scheme of Scholarships for College and University Students',
  'Department of Higher Education, Ministry of Education, Govt of India',
  'central_government',
  'Financial assistance to meritorious students from low-income families to meet day-to-day expenses while pursuing higher studies in colleges and universities.',
  'undergraduate,postgraduate',
  'Rs. 12,000 per annum at Graduation level for first three years and Rs. 20,000 per annum at Post-Graduation level.',
  'Aadhaar Card, Class 12th Marksheet, Family Income Certificate, Bank Passbook Front Page, Institution Bonafide Certificate',
  'Students must be in the top 20th percentile of successful candidates in the relevant Higher Secondary Examination (Class 12). Apply via National Scholarship Portal.',
  'https://scholarships.gov.in/',
  'https://scholarships.gov.in/',
  '2026-07-01',
  '2026-10-31',
  1
),
(
  2,
  'Post-Matric Scholarship Scheme for SC / ST Students',
  'Adi Dravidar and Tribal Welfare Department, Government of Tamil Nadu',
  'tn_government',
  'Comprehensive financial assistance including fee exemption and maintenance allowance for Scheduled Caste (SC) and Scheduled Tribe (ST) students pursuing higher secondary and higher education.',
  'school,undergraduate,postgraduate',
  '100% compulsory non-refundable tuition and examination fee waiver plus monthly maintenance allowance.',
  'Community Certificate (SC/ST), Family Income Certificate, 10th & 12th Marksheets, School/College ID, Bank Passbook',
  'Applicant must belong to SC/ST community and be a resident of Tamil Nadu. Annual family income must be within government prescribed limit.',
  'https://www.tnesevai.tn.gov.in/',
  'https://www.tnesevai.tn.gov.in/',
  '2026-07-01',
  '2026-11-30',
  1
),
(
  3,
  'Free Education Scheme for BC / MBC / DNC Students',
  'Backward Classes, Most Backward Classes & Minorities Welfare Department, Govt of Tamil Nadu',
  'tn_government',
  'Tuition fee reimbursement and free education support for BC, MBC, and DNC students enrolled in undergraduate degree courses in recognized institutions.',
  'undergraduate',
  'Complete tuition fee waiver and special fee reimbursement for 3 to 4 years of undergraduate study.',
  'Community Certificate (BC/MBC/DNC), Income Certificate, 10th & 12th Marksheets, College ID/Bonafide Certificate, Bank Passbook',
  'Must belong to BC, MBC, or DNC category and be a domicile resident of Tamil Nadu. Must be enrolled in a recognized college.',
  'https://www.tnesevai.tn.gov.in/',
  'https://www.tnesevai.tn.gov.in/',
  '2026-07-15',
  '2026-11-15',
  1
),
(
  4,
  'Pudhumai Penn Scheme (Moovalur Ramamirtham Ammiyar Higher Education Assurance Scheme)',
  'Social Welfare and Women Empowerment Department, Govt of Tamil Nadu',
  'tn_government',
  'Financial assistance scheme aimed at promoting female higher education by providing Rs. 1,000 monthly financial aid to female students who completed schooling in TN Government schools.',
  'undergraduate',
  'Rs. 1,000 per month paid directly into the student\'s bank account via DBT until completion of degree/diploma.',
  'Aadhaar Card, Class 6th to 12th Govt School Study Proof Certificate, College Bonafide Certificate, Bank Passbook',
  'Female students who studied in Tamil Nadu Government Schools from Class 6 to 12 and are currently pursuing higher education in diploma or undergraduate degree.',
  'https://www.penkalvi.tn.gov.in/',
  'https://www.penkalvi.tn.gov.in/',
  '2026-06-01',
  '2026-12-31',
  1
),
(
  5,
  'Chief Minister\'s School Talent Search & Merit Award',
  'School Education Department, Government of Tamil Nadu',
  'tn_government',
  'Merit scholarship award designed to encourage and financially support meritorious school students studying in Class 6 to 12 in Tamil Nadu.',
  'school',
  'Annual cash award of Rs. 10,000 and merit certificate from the Department of School Education.',
  'School Student ID Card, SSLC / Annual Progress Report Card, Aadhaar Card, Bank Passbook Front Page',
  'Student must be currently enrolled in Class 6th to 12th in a recognized Tamil Nadu school and demonstrate high academic performance.',
  'https://www.tn.gov.in/',
  'https://www.tn.gov.in/',
  '2026-06-01',
  '2026-12-31',
  1
),
(
  6,
  'First-Generation Graduate Tuition Fee Concession',
  'Directorate of Technical & Higher Education, Government of Tamil Nadu',
  'tn_government',
  'Complete tuition fee exemption for students who are the first person in their immediate family to pursue higher education degree courses.',
  'undergraduate',
  'Full tuition fee exemption for 4 years of undergraduate professional degree program.',
  'First Generation Graduate Certificate issued by Tahsildar, Family Tree Certificate, 10th & 12th Marksheets, Allotment Order',
  'Neither parents nor siblings of the applicant should have completed a graduate degree. Must be admitted via single window counseling.',
  'https://www.tn.gov.in/',
  'https://www.tn.gov.in/',
  '2026-07-01',
  '2026-11-30',
  1
),
(
  7,
  'PM YASASVI Central Sector Scheme for OBC, EBC and DNT Students',
  'Department of Social Justice and Empowerment, Government of India',
  'central_government',
  'Scholarship for meritorious students belonging to Other Backward Classes (OBC), Economically Backward Classes (EBC), and De-notified Tribes (DNT).',
  'school,undergraduate,postgraduate',
  'Academic allowance up to Rs. 20,000 per annum based on education level and course group.',
  'OBC / EBC / DNT Community Certificate, Income Certificate, Qualifying Marksheet, Aadhaar Card, Bank Passbook',
  'Apply online via the National Scholarship Portal (NSP). Annual family income limit must not exceed Rs. 2,50,000.',
  'https://scholarships.gov.in/',
  'https://scholarships.gov.in/',
  '2026-07-01',
  '2026-10-31',
  1
);

-- Insert Eligibility Criteria for Verified Scholarships
INSERT INTO `scholarship_criteria`
  (`scholarship_id`, `tn_resident_required`, `education_level`, `min_twelfth_pct`, `max_annual_income`, `bank_account_required`, `dbt_required`)
VALUES
  (1, 0, 'undergraduate,postgraduate', 60.00, 450000.00, 1, 1);

INSERT INTO `scholarship_criteria`
  (`scholarship_id`, `community`, `tn_resident_required`, `education_level`, `max_annual_income`, `bank_account_required`)
VALUES
  (2, 'SC,ST', 1, 'school,undergraduate,postgraduate', 250000.00, 1);

INSERT INTO `scholarship_criteria`
  (`scholarship_id`, `community`, `tn_resident_required`, `education_level`, `max_annual_income`)
VALUES
  (3, 'BC,MBC,DNC', 1, 'undergraduate', 250000.00);

INSERT INTO `scholarship_criteria`
  (`scholarship_id`, `gender`, `tn_resident_required`, `education_level`, `bank_account_required`, `dbt_required`)
VALUES
  (4, 'Female', 1, 'undergraduate', 1, 1);

INSERT INTO `scholarship_criteria`
  (`scholarship_id`, `tn_resident_required`, `education_level`, `min_tenth_pct`)
VALUES
  (5, 1, 'school', 60.00);

INSERT INTO `scholarship_criteria`
  (`scholarship_id`, `tn_resident_required`, `education_level`, `first_gen_required`, `min_twelfth_pct`)
VALUES
  (6, 1, 'undergraduate', 1, 50.00);

INSERT INTO `scholarship_criteria`
  (`scholarship_id`, `community`, `tn_resident_required`, `education_level`, `max_annual_income`, `bank_account_required`)
VALUES
  (7, 'BC,MBC,DNC,Others', 0, 'school,undergraduate,postgraduate', 250000.00, 1);
