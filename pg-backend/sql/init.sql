DROP TABLE IF EXISTS Contains CASCADE;
DROP TABLE IF EXISTS Provide_Prescription CASCADE;
DROP TABLE IF EXISTS Patient_History CASCADE;
DROP TABLE IF EXISTS Billing_Record CASCADE;
DROP TABLE IF EXISTS Report CASCADE;
DROP TABLE IF EXISTS Test_Result CASCADE;
DROP TABLE IF EXISTS Test_History CASCADE;
DROP TABLE IF EXISTS Test CASCADE;
DROP TABLE IF EXISTS Test_Package CASCADE;
DROP TABLE IF EXISTS Lab_Technician CASCADE;
DROP TABLE IF EXISTS Appointment CASCADE;
DROP TABLE IF EXISTS Patient CASCADE;
DROP TABLE IF EXISTS Doctor CASCADE;
DROP TABLE IF EXISTS Department CASCADE;

-- 1. Department Table
CREATE TABLE Department (
  Dept_ID     INT PRIMARY KEY,
  Dept_Name   VARCHAR(50) NOT NULL,
  Location    VARCHAR(50)
);

INSERT INTO Department (Dept_ID, Dept_Name, Location)
VALUES
  (1, 'Neurology', 'Block-A'),
  (2, 'ENT', 'Block-B'),
  (3, 'Cardiology', 'Block-C'),
  (4, 'Orthopedics', 'Block-D'),
  (5, 'Pediatrics', 'Block-E'),
  (6, 'Dermatology', 'Block-F'),
  (7, 'Oncology', 'Block-G'),
  (8, 'Psychiatry', 'Block-H'),
  (9, 'Radiology', 'Block-I'),
  (10, 'General Surgery', 'Block-J');

-- 2. Patient Table
CREATE TABLE Patient(
  Patient_ID        SERIAL PRIMARY KEY,
  Name              VARCHAR(50) NOT NULL,
  Gender            VARCHAR(20) CHECK (Gender IN ('Male', 'Female', 'Other')),
  Contact_No        VARCHAR(15) NOT NULL,
  Blood_Group       VARCHAR(5) NOT NULL,
  Address           VARCHAR(255) NOT NULL,
  Email             VARCHAR(100) UNIQUE NOT NULL,
  Date_of_Birth     DATE NOT NULL,
  Password          TEXT NOT NULL,
  Registration_Date DATE DEFAULT CURRENT_DATE
);

-- 3. Doctor Table
CREATE TABLE Doctor (
  Doctor_ID      SERIAL PRIMARY KEY,
  Name           VARCHAR(50) NOT NULL,
  Gender            VARCHAR(20) CHECK (Gender IN ('Male', 'Female', 'Other')),
  Phone_No       VARCHAR(15),
  Email          VARCHAR(100) UNIQUE NOT NULL,
  License_Number VARCHAR(30) NOT NULL,
  Specialization VARCHAR(50),
  Dept_ID        INT NOT NULL,
  Password       TEXT NOT NULL,
  FOREIGN KEY (Dept_ID) REFERENCES Department(Dept_ID)
);

-- 4. Lab Technician
CREATE TABLE Lab_Technician (
  Tech_ID     SERIAL PRIMARY KEY,
  Name        VARCHAR(50) NOT NULL,
  Contact_No  VARCHAR(15) UNIQUE NOT NULL,
  Password    TEXT NOT NULL
);

-- 5. Appointment
CREATE TABLE Appointment (
  Appoint_ID  SERIAL PRIMARY KEY,
  Patient_ID  INT NOT NULL,
  Doctor_ID INT NOT NULL,
  Date        DATE NOT NULL,
  Time        TIME NOT NULL CHECK (time >= '10:00' AND time <= '17:00'),
  UNIQUE (doctor_id, date, time),
  FOREIGN KEY (Patient_ID) REFERENCES Patient(Patient_ID) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (Doctor_ID) REFERENCES Doctor(Doctor_ID) ON DELETE CASCADE ON UPDATE CASCADE
);

-- 6. Test
CREATE TABLE Test (
  Test_Code     SERIAL PRIMARY KEY,
  Test_Name     VARCHAR(100) NOT NULL,
  Normal_Range  VARCHAR(50),
  Test_Type     VARCHAR(50) NOT NULL
);

INSERT INTO Test (Test_Name, Normal_Range, Test_Type)
VALUES
  ('Complete Blood Count (CBC)', 'WBC: 4,000–11,000/µL', 'Blood Test'),
  ('Blood Sugar (Fasting)', '70–100 mg/dL', 'Blood Test'),
  ('Blood Sugar (Postprandial)', '< 140 mg/dL', 'Blood Test'),
  ('Lipid Profile', 'LDL < 100 mg/dL', 'Blood Test'),
  ('Liver Function Test (LFT)', 'ALT < 40 U/L', 'Blood Test'),
  ('Kidney Function Test (KFT)', 'Creatinine: 0.6–1.3 mg/dL', 'Blood Test'),
  ('Thyroid Profile (T3, T4, TSH)', 'TSH: 0.4–4.0 mIU/L', 'Blood Test'),
  ('Urine Routine and Microscopy', 'Normal', 'Urine Test'),
  ('Chest X-Ray', 'Normal lung fields', 'Imaging Test'),
  ('ECG (Electrocardiogram)', 'Normal sinus rhythm', 'Cardiology Test'),
  ('MRI Brain', 'No abnormality detected', 'Imaging Test'),
  ('CT Abdomen', 'No abnormality detected', 'Imaging Test'),
  ('Vitamin D Test', '20–50 ng/mL', 'Blood Test'),
  ('Calcium Test', '8.5–10.2 mg/dL', 'Blood Test'),
  ('COVID-19 RT-PCR', 'Negative', 'Microbiology Test');


CREATE TABLE Test_History (
  test_history_id SERIAL PRIMARY KEY NOT NULL,
  test_code INT NOT NULL,
  Appoint_ID INT NOT NULL,
  Test_Completion VARCHAR(25) DEFAULT 'NOT DONE' CHECK (Test_Completion IN ('NOT DONE', 'DONE')),
  FOREIGN KEY (Appoint_ID) REFERENCES Appointment(Appoint_ID) ON DELETE CASCADE,
  FOREIGN KEY (test_code) REFERENCES Test(test_code) ON DELETE CASCADE ON UPDATE CASCADE
);

-- 7. Report
CREATE TABLE report (
  report_id SERIAL PRIMARY KEY,
  report_date DATE DEFAULT CURRENT_DATE,
  approval_status VARCHAR(20) DEFAULT 'Pending' CHECK (approval_status IN ('Pending', 'Approved', 'Rejected')),
  patient_id INT NOT NULL,
  Appoint_ID INT,
  FOREIGN KEY (patient_id) REFERENCES patient(patient_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  FOREIGN KEY (Appoint_ID) REFERENCES Appointment(Appoint_ID)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

-- 8. Billing record
CREATE TABLE billing_record (
  bill_no SERIAL PRIMARY KEY,
  total_amt DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  payment_status VARCHAR(20) DEFAULT 'Pending' CHECK (payment_status IN ('Paid', 'Unpaid', 'Pending')),
  payment_method VARCHAR(20) DEFAULT 'Cash' CHECK (payment_method IN ('Cash', 'Card', 'Online', 'Other')),
  report_id INT UNIQUE,
  FOREIGN KEY (report_id) REFERENCES report(report_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

-- 9. Patient History
CREATE TABLE Patient_History (
  History_ID  SERIAL PRIMARY KEY,
  Patient_ID  INT,
  Appoint_ID  INT NOT NULL,
  FOREIGN KEY (Patient_ID) REFERENCES Patient(Patient_ID) ON DELETE CASCADE,
  FOREIGN KEY (Appoint_ID) REFERENCES Appointment(Appoint_ID) ON DELETE CASCADE
);

-- 10. Test Package
CREATE TABLE test_package (
  package_id SERIAL PRIMARY KEY,
  package_name VARCHAR(100) NOT NULL,
  description TEXT
);

INSERT INTO test_package (package_name, description)
VALUES
  ('Basic Health Check', 'Includes basic blood tests and urine test for general health.'),
  ('Cardiac Panel', 'Tests focused on heart health including lipid profile and ECG.'),
  ('Liver & Kidney Panel', 'Comprehensive tests for liver and kidney function.'),
  ('Vitamin & Mineral Panel', 'Tests for Vitamin D and calcium levels.'),
  ('Full Body Imaging', 'Includes Chest X-Ray, MRI Brain, and CT Abdomen.');

-- 11. Contains (Tests in Package)
CREATE TABLE contains (
  package_id INT NOT NULL,
  test_code INT NOT NULL,
  PRIMARY KEY (package_id, test_code),
  FOREIGN KEY (package_id) REFERENCES test_package(package_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  FOREIGN KEY (test_code) REFERENCES test(test_code)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

-- Basic Health Check (tests 1, 2, 4, 8)
INSERT INTO contains (package_id, test_code)
VALUES
  (1, 1), -- CBC
  (1, 2), -- Blood Sugar (Fasting)
  (1, 4), -- Lipid Profile
  (1, 8); -- Urine Routine

-- Cardiac Panel (tests 2, 3, 4, 10)
INSERT INTO contains (package_id, test_code)
VALUES
  (2, 2), -- Blood Sugar (Fasting)
  (2, 3), -- Blood Sugar (Postprandial)
  (2, 4), -- Lipid Profile
  (2, 10); -- ECG

-- Liver & Kidney Panel (tests 5, 6, 7)
INSERT INTO contains (package_id, test_code)
VALUES
  (3, 5), -- LFT
  (3, 6), -- KFT
  (3, 7); -- Thyroid Profile

-- Vitamin & Mineral Panel (tests 13, 14)
INSERT INTO contains (package_id, test_code)
VALUES
  (4, 13), -- Vitamin D Test
  (4, 14); -- Calcium Test

-- Full Body Imaging (tests 9, 11, 12)
INSERT INTO contains (package_id, test_code)
VALUES
  (5, 9),  -- Chest X-Ray
  (5, 11), -- MRI Brain
  (5, 12); -- CT Abdomen

-- 12. Test Result
CREATE TABLE test_result (
  result_id SERIAL PRIMARY KEY,
  measured_value VARCHAR(200) NOT NULL,
  unit VARCHAR(20),
  interpretation_summary TEXT NOT NULL,
  test_code INT NOT NULL,
  test_history_id INT,
  report_id INT,
  tech_id INT,
  FOREIGN KEY (test_history_id) REFERENCES test_history(test_history_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  FOREIGN KEY (test_code) REFERENCES test(test_code)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  FOREIGN KEY (report_id) REFERENCES report(report_id)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  FOREIGN KEY (tech_id) REFERENCES lab_technician(tech_id)
    ON DELETE SET NULL
    ON UPDATE CASCADE
);

-- 13. Provide Prescription
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
    ON DELETE CASCADE
    ON UPDATE CASCADE
);


