const { pool } = require('./config/db');

async function addCols() {
  const alterQueries = [
    // Scholarships & Criteria
    "ALTER TABLE scholarships ADD COLUMN student_type ENUM('school','college','both') NOT NULL DEFAULT 'both' AFTER category",
    "ALTER TABLE scholarship_criteria ADD COLUMN state VARCHAR(100) AFTER tn_resident_required",
    "ALTER TABLE scholarship_criteria ADD COLUMN district VARCHAR(100) AFTER state",
    "ALTER TABLE scholarship_criteria ADD COLUMN course VARCHAR(150) AFTER course_type",
    "ALTER TABLE scholarship_criteria ADD COLUMN branch VARCHAR(150) AFTER course",
    "ALTER TABLE scholarship_criteria ADD COLUMN disability_required TINYINT(1) DEFAULT 0 AFTER first_gen_required",
    
    // student_community
    "ALTER TABLE student_community ADD COLUMN country VARCHAR(50) DEFAULT 'India' AFTER domicile",
    "ALTER TABLE student_community ADD COLUMN domicile_cert_doc VARCHAR(255) AFTER community_cert_doc",
    
    // student_academic
    "ALTER TABLE student_academic ADD COLUMN student_type VARCHAR(20) DEFAULT 'college' AFTER user_id",
    "ALTER TABLE student_academic ADD COLUMN school_name VARCHAR(255) AFTER college_location",
    "ALTER TABLE student_academic ADD COLUMN school_location VARCHAR(100) AFTER school_name",
    "ALTER TABLE student_academic ADD COLUMN class_standard VARCHAR(20) AFTER school_location",
    "ALTER TABLE student_academic ADD COLUMN school_id_doc VARCHAR(255) AFTER currently_studying",
    
    // student_performance
    "ALTER TABLE student_performance ADD COLUMN tenth_marksheet_doc VARCHAR(255) AFTER marksheet_doc",
    "ALTER TABLE student_performance ADD COLUMN twelfth_marksheet_doc VARCHAR(255) AFTER tenth_marksheet_doc",
    "ALTER TABLE student_performance ADD COLUMN current_marksheet_doc VARCHAR(255) AFTER twelfth_marksheet_doc",
    
    // student_financial
    "ALTER TABLE student_financial ADD COLUMN father_name VARCHAR(150) AFTER income_cert_status",
    "ALTER TABLE student_financial ADD COLUMN father_income DECIMAL(12,2) AFTER father_occupation",
    "ALTER TABLE student_financial ADD COLUMN father_doc VARCHAR(255) AFTER father_income",
    "ALTER TABLE student_financial ADD COLUMN mother_name VARCHAR(150) AFTER father_doc",
    "ALTER TABLE student_financial ADD COLUMN mother_income DECIMAL(12,2) AFTER mother_occupation",
    "ALTER TABLE student_financial ADD COLUMN mother_doc VARCHAR(255) AFTER mother_income"
  ];

  for (const q of alterQueries) {
    try {
      await pool.query(q);
      console.log(`Executed: ${q.substring(0, 50)}...`);
    } catch (e) {
      // Column may already exist
    }
  }

  console.log('Database columns migration check completed!');
}

addCols().finally(() => process.exit(0));
