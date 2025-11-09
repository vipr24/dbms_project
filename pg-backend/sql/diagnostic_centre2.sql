-- Create Database
CREATE DATABASE diagnostic_centre;
\c diagnostic_centre;

-- 1. Department Table
CREATE TABLE department (
  dept_id SERIAL PRIMARY KEY,
  dept_name VARCHAR(100) NOT NULL,
  location VARCHAR(200)
);

-- 2. Patient Table
CREATE TABLE patient (
  patient_id SERIAL PRIMARY KEY,
  patient_name VARCHAR(150) NOT NULL,
  email VARCHAR(255),
  blood_group VARCHAR(5),
  gender VARCHAR(10) CHECK (gender IN ('Male', 'Female', 'Other')),
  registration_date DATE DEFAULT CURRENT_DATE,
  dob DATE,
  address TEXT,
  password TEXT NOT NULL
);

-- 3. Patient Contact
CREATE TABLE patient_contact (
  patient_id INT NOT NULL,
  contact_number VARCHAR(30) NOT NULL,
  contact_type VARCHAR(10) DEFAULT 'Mobile' CHECK (contact_type IN ('Home', 'Mobile', 'Work')),
  PRIMARY KEY (patient_id, contact_number),
  FOREIGN KEY (patient_id) REFERENCES patient(patient_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

-- 4. Doctor Table
CREATE TABLE doctor (
  doctor_id SERIAL PRIMARY KEY,
  doctor_name VARCHAR(150) NOT NULL,
  specialization VARCHAR(100),
  contact_no VARCHAR(30),
  email VARCHAR(255),
  licence_no VARCHAR(100),
  dept_id INT,
  password TEXT NOT NULL,
  FOREIGN KEY (dept_id) REFERENCES department(dept_id)
    ON DELETE SET NULL
    ON UPDATE CASCADE
);

-- 5. Lab Technician
CREATE TABLE lab_technician (
  technician_id SERIAL PRIMARY KEY,
  technician_name VARCHAR(150) NOT NULL,
  department VARCHAR(100),
  contact_no VARCHAR(30)
);

-- 6. Appointment
CREATE TABLE appointment (
  appointment_id SERIAL PRIMARY KEY,
  appointment_date DATE NOT NULL,
  appointment_time TIME,
  appointment_type VARCHAR(20) DEFAULT 'Consultation'
    CHECK (appointment_type IN ('Test', 'Consultation')),
  patient_id INT NOT NULL,
  doctor_id INT,
  FOREIGN KEY (patient_id) REFERENCES patient(patient_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  FOREIGN KEY (doctor_id) REFERENCES doctor(doctor_id)
    ON DELETE SET NULL
    ON UPDATE CASCADE
);

-- 7. Test
CREATE TABLE test (
  test_code VARCHAR(50) PRIMARY KEY,
  test_name VARCHAR(150) NOT NULL,
  test_type VARCHAR(100),
  normal_reference_range VARCHAR(100)
);

-- 8. Report (moved before billing to avoid FK dependency issue)
CREATE TABLE report (
  report_id SERIAL PRIMARY KEY,
  report_date DATE DEFAULT CURRENT_DATE,
  approval_status VARCHAR(20) DEFAULT 'Pending'
    CHECK (approval_status IN ('Pending', 'Approved', 'Rejected')),
  patient_id INT NOT NULL,
  FOREIGN KEY (patient_id) REFERENCES patient(patient_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

-- 9. Billing Record
CREATE TABLE billing_record (
  bill_no SERIAL PRIMARY KEY,
  total_amt DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  payment_status VARCHAR(20) DEFAULT 'Pending'
    CHECK (payment_status IN ('Paid', 'Unpaid', 'Pending')),
  payment_method VARCHAR(20) DEFAULT 'Cash'
    CHECK (payment_method IN ('Cash', 'Card', 'Online', 'Other')),
  report_id INT UNIQUE,
  FOREIGN KEY (report_id) REFERENCES report(report_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

-- 10. Patient History
CREATE TABLE patient_history (
  history_id SERIAL PRIMARY KEY,
  visit_date DATE NOT NULL,
  notes TEXT,
  patient_id INT,
  FOREIGN KEY (patient_id) REFERENCES patient(patient_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

-- 11. Appointment_Test (Many-to-Many)
CREATE TABLE appointment_test (
  appointment_id INT NOT NULL,
  test_code VARCHAR(50) NOT NULL,
  PRIMARY KEY (appointment_id, test_code),
  FOREIGN KEY (appointment_id) REFERENCES appointment(appointment_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  FOREIGN KEY (test_code) REFERENCES test(test_code)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

-- 12. Test Package
CREATE TABLE test_package (
  package_id SERIAL PRIMARY KEY,
  package_name VARCHAR(100) NOT NULL,
  description TEXT
);

-- 13. Contains (Tests in Package)
CREATE TABLE contains (
  package_id INT NOT NULL,
  test_code VARCHAR(50) NOT NULL,
  PRIMARY KEY (package_id, test_code),
  FOREIGN KEY (package_id) REFERENCES test_package(package_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  FOREIGN KEY (test_code) REFERENCES test(test_code)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

-- 14. Test Result
CREATE TABLE test_result (
  result_id SERIAL PRIMARY KEY,
  measured_value VARCHAR(200),
  unit VARCHAR(20),
  interpretation_summary TEXT,
  test_code VARCHAR(50) NOT NULL,
  report_id INT,
  technician_id INT,
  FOREIGN KEY (test_code) REFERENCES test(test_code)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  FOREIGN KEY (report_id) REFERENCES report(report_id)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  FOREIGN KEY (technician_id) REFERENCES lab_technician(technician_id)
    ON DELETE SET NULL
    ON UPDATE CASCADE
);

-- 15. Interpretation Flags
CREATE TABLE interpretation_flags (
  result_id INT NOT NULL,
  flag_type VARCHAR(100) NOT NULL,
  flag_value VARCHAR(200),
  PRIMARY KEY (result_id, flag_type),
  FOREIGN KEY (result_id) REFERENCES test_result(result_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

-- 16. Provide Prescription
CREATE TABLE provide_prescription (
  prescription_id SERIAL PRIMARY KEY,
  prescription_date DATE DEFAULT CURRENT_DATE,
  notes TEXT,
  patient_id INT,
  doctor_id INT,
  FOREIGN KEY (patient_id) REFERENCES patient(patient_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  FOREIGN KEY (doctor_id) REFERENCES doctor(doctor_id)
    ON DELETE SET NULL
    ON UPDATE CASCADE
);
