const { pool } = require('./config/db');

async function addCols() {
  try {
    await pool.query("ALTER TABLE scholarships ADD COLUMN student_type ENUM('school','college','both') NOT NULL DEFAULT 'both' AFTER category");
    console.log('Added student_type to scholarships');
  } catch (e) {
    console.log('student_type column info:', e.message);
  }
  
  try {
    await pool.query('ALTER TABLE scholarship_criteria ADD COLUMN state VARCHAR(100) AFTER tn_resident_required');
    console.log('Added state to scholarship_criteria');
  } catch (e) { console.log('state info:', e.message); }

  try {
    await pool.query('ALTER TABLE scholarship_criteria ADD COLUMN district VARCHAR(100) AFTER state');
    console.log('Added district to scholarship_criteria');
  } catch (e) { console.log('district info:', e.message); }

  try {
    await pool.query('ALTER TABLE scholarship_criteria ADD COLUMN course VARCHAR(150) AFTER course_type');
    console.log('Added course to scholarship_criteria');
  } catch (e) { console.log('course info:', e.message); }

  try {
    await pool.query('ALTER TABLE scholarship_criteria ADD COLUMN branch VARCHAR(150) AFTER course');
    console.log('Added branch to scholarship_criteria');
  } catch (e) { console.log('branch info:', e.message); }

  try {
    await pool.query('ALTER TABLE scholarship_criteria ADD COLUMN disability_required TINYINT(1) DEFAULT 0 AFTER first_gen_required');
    console.log('Added disability_required to scholarship_criteria');
  } catch (e) { console.log('disability_required info:', e.message); }

  console.log('Database columns updated successfully!');
}

addCols().finally(() => process.exit(0));
