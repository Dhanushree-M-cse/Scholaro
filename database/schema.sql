-- =============================================================================
-- SCHOLARO DATABASE SCHEMA
-- MySQL 8.0+ | Character Set: utf8mb4
-- =============================================================================

SET FOREIGN_KEY_CHECKS = 0;
SET SQL_MODE = 'NO_AUTO_VALUE_ON_ZERO';

-- -----------------------------------------------------------------------------
-- users — Authentication table (student + admin)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `users` (
  `id`           INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `full_name`    VARCHAR(150) NOT NULL,
  `email`        VARCHAR(200) NOT NULL,
  `mobile`       VARCHAR(15)  NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `role`         ENUM('student','admin') NOT NULL DEFAULT 'student',
  `is_active`    TINYINT(1) NOT NULL DEFAULT 1,
  `created_at`   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- students — Extended personal/identity information (Step 1)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `students` (
  `id`              INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id`         INT UNSIGNED NOT NULL,
  `dob`             DATE,
  `gender`          VARCHAR(20),
  `religion`        VARCHAR(50),
  `marital_status`  VARCHAR(30),
  `aadhaar_doc`     VARCHAR(255),
  `photo_doc`       VARCHAR(255),
  `signature_doc`   VARCHAR(255),
  `created_at`      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_user` (`user_id`),
  CONSTRAINT `fk_students_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- student_community — Community & Residence info (Step 2)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `student_community` (
  `id`                    INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id`               INT UNSIGNED NOT NULL,
  `community`             VARCHAR(50),
  `caste_certificate`     VARCHAR(30),
  `domicile`              VARCHAR(50),
  `state`                 VARCHAR(50),
  `district`              VARCHAR(80),
  `tn_resident`           TINYINT(1),
  `community_cert_doc`    VARCHAR(255),
  `nativity_cert_doc`     VARCHAR(255),
  `created_at`            DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`            DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_community_user` (`user_id`),
  CONSTRAINT `fk_community_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- student_academic — Academic Details (Step 3)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `student_academic` (
  `id`                INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id`           INT UNSIGNED NOT NULL,
  `education_level`   ENUM('school','undergraduate','postgraduate','other') DEFAULT 'undergraduate',
  `course`            VARCHAR(150),
  `branch`            VARCHAR(150),
  `institution`       VARCHAR(255),
  `year_of_study`     TINYINT UNSIGNED,
  `semester`          TINYINT UNSIGNED,
  `course_type`       ENUM('government','private','aided','autonomous'),
  `college_location`  VARCHAR(100),
  `study_mode`        ENUM('regular','distance','online'),
  `currently_studying` TINYINT(1) DEFAULT 1,
  `college_id_doc`    VARCHAR(255),
  `created_at`        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_academic_user` (`user_id`),
  CONSTRAINT `fk_academic_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- student_performance — Academic Performance (Step 4)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `student_performance` (
  `id`                  INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id`             INT UNSIGNED NOT NULL,
  `tenth_percentage`    DECIMAL(5,2),
  `twelfth_percentage`  DECIMAL(5,2),
  `current_cgpa`        DECIMAL(4,2),
  `prev_sem_cgpa`       DECIMAL(4,2),
  `has_backlogs`        TINYINT(1) DEFAULT 0,
  `backlog_count`       TINYINT UNSIGNED DEFAULT 0,
  `academic_year`       VARCHAR(20),
  `achievements`        TEXT,
  `marksheet_doc`       VARCHAR(255),
  `created_at`          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_performance_user` (`user_id`),
  CONSTRAINT `fk_performance_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- student_financial — Family & Financial info (Step 5)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `student_financial` (
  `id`                       INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id`                  INT UNSIGNED NOT NULL,
  `annual_income`            DECIMAL(12,2),
  `income_cert_status`       VARCHAR(30),
  `father_occupation`        VARCHAR(100),
  `mother_occupation`        VARCHAR(100),
  `family_size`              TINYINT UNSIGNED,
  `sibling_count`            TINYINT UNSIGNED DEFAULT 0,
  `siblings_studying`        TINYINT UNSIGNED DEFAULT 0,
  `first_gen_graduate`       TINYINT(1) DEFAULT 0,
  `income_cert_doc`          VARCHAR(255),
  `created_at`               DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`               DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_financial_user` (`user_id`),
  CONSTRAINT `fk_financial_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- student_bank — Bank / DBT info (Step 6)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `student_bank` (
  `id`                  INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id`             INT UNSIGNED NOT NULL,
  `has_bank_account`    TINYINT(1) DEFAULT 0,
  `account_holder_name` VARCHAR(150),
  `bank_name`           VARCHAR(150),
  `aadhaar_linked`      TINYINT(1) DEFAULT 0,
  `dbt_enabled`         TINYINT(1) DEFAULT 0,
  `passbook_doc`        VARCHAR(255),
  `created_at`          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_bank_user` (`user_id`),
  CONSTRAINT `fk_bank_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- scholarships — Master scholarship table
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `scholarships` (
  `id`                INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name`              VARCHAR(255) NOT NULL,
  `provider`          VARCHAR(255) NOT NULL,
  `category`          ENUM('tn_government','central_government','private','ngo_trust') NOT NULL DEFAULT 'tn_government',
  `student_type`      ENUM('school','college','both') NOT NULL DEFAULT 'both',
  `description`       TEXT,
  `education_level`   SET('school','undergraduate','postgraduate','other') NOT NULL DEFAULT 'undergraduate',
  `benefits`          TEXT,
  `required_documents` TEXT,
  `guidelines`        TEXT,
  `official_url`      VARCHAR(500),
  `application_url`   VARCHAR(500),
  `application_start` DATE,
  `application_end`   DATE,
  `is_active`         TINYINT(1) NOT NULL DEFAULT 1,
  `created_at`        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_category` (`category`),
  KEY `idx_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- scholarship_criteria — Per-scholarship eligibility criteria (configurable)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `scholarship_criteria` (
  `id`                    INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `scholarship_id`        INT UNSIGNED NOT NULL,
  `min_age`               TINYINT UNSIGNED,
  `max_age`               TINYINT UNSIGNED,
  `gender`                VARCHAR(20),
  `religion`              VARCHAR(50),
  `community`             VARCHAR(100),
  `tn_resident_required`  TINYINT(1) DEFAULT 1,
  `state`                 VARCHAR(100),
  `district`              VARCHAR(100),
  `education_level`       SET('school','undergraduate','postgraduate','other'),
  `study_mode`            VARCHAR(30),
  `course_type`           VARCHAR(30),
  `course`                VARCHAR(150),
  `branch`                VARCHAR(150),
  `min_tenth_pct`         DECIMAL(5,2),
  `min_twelfth_pct`       DECIMAL(5,2),
  `min_cgpa`              DECIMAL(4,2),
  `backlog_allowed`       TINYINT(1) DEFAULT 0,
  `max_annual_income`     DECIMAL(12,2),
  `first_gen_required`    TINYINT(1) DEFAULT 0,
  `disability_required`   TINYINT(1) DEFAULT 0,
  `bank_account_required` TINYINT(1) DEFAULT 0,
  `dbt_required`          TINYINT(1) DEFAULT 0,
  `created_at`            DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`            DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_criteria_scholarship` (`scholarship_id`),
  CONSTRAINT `fk_criteria_scholarship` FOREIGN KEY (`scholarship_id`) REFERENCES `scholarships` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- saved_scholarships — Student bookmarked scholarships
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `saved_scholarships` (
  `id`             INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id`        INT UNSIGNED NOT NULL,
  `scholarship_id` INT UNSIGNED NOT NULL,
  `saved_at`       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_saved` (`user_id`,`scholarship_id`),
  CONSTRAINT `fk_saved_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_saved_scholarship` FOREIGN KEY (`scholarship_id`) REFERENCES `scholarships` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- eligibility_results — Cached result of the last eligibility check per student
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `eligibility_results` (
  `id`          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id`     INT UNSIGNED NOT NULL,
  `results_json` LONGTEXT,
  `submitted_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_results_user` (`user_id`),
  CONSTRAINT `fk_results_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;
