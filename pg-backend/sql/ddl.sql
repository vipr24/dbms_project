-- Create Database
CREATE DATABASE IF NOT EXISTS diagnostic_centre;
USE diagnostic_centre;

-- Department Table done
CREATE TABLE department (
    dept_id INT AUTO_INCREMENT PRIMARY KEY,
    dept_name VARCHAR(100) NOT NULL,
    location VARCHAR(200)
);

-- Patient Table done
CREATE TABLE patient (
    patient_id INT AUTO_INCREMENT PRIMARY KEY,
    patient_name VARCHAR(150) NOT NULL,
    email VARCHAR(255),
    blood_group VARCHAR(5),
    gender ENUM('Male', 'Female', 'Other'),
    registration_date DATE DEFAULT (CURRENT_DATE),
    dob DATE,
    address TEXT
);

-- Patient Contact Table
CREATE TABLE patient_contact (
    patient_id INT NOT NULL,
    contact_number VARCHAR(30) NOT NULL,
    contact_type ENUM('Home', 'Mobile', 'Work') DEFAULT 'Mobile',
    PRIMARY KEY (patient_id, contact_number),
    FOREIGN KEY (patient_id) REFERENCES patient(patient_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- Doctor Table done
CREATE TABLE doctor (
    doctor_id INT AUTO_INCREMENT PRIMARY KEY,
    doctor_name VARCHAR(150) NOT NULL,
    specialization VARCHAR(100),
    contact_no VARCHAR(30),
    email VARCHAR(255),
    license_no VARCHAR(100),
    dept_id INT,
    FOREIGN KEY (dept_id) REFERENCES department(dept_id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);

-- Lab Technician Table
CREATE TABLE lab_technician (
    technician_id INT AUTO_INCREMENT PRIMARY KEY,
    technician_name VARCHAR(150) NOT NULL,
    department VARCHAR(100),
    contact_no VARCHAR(30)
);

-- Appointment Table
CREATE TABLE appointment (
    appointment_id INT AUTO_INCREMENT PRIMARY KEY,
    appointment_date DATE NOT NULL,
    appointment_time TIME,
    appointment_type ENUM('Test', 'Consultation') DEFAULT 'Consultation',
    patient_id INT NOT NULL,
    FOREIGN KEY (patient_id) REFERENCES patient(patient_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- Test Table
CREATE TABLE test (
    test_code VARCHAR(50) PRIMARY KEY,
    test_name VARCHAR(150) NOT NULL,
    test_type VARCHAR(100),
    normal_reference_range VARCHAR(100)
);

-- Appointment Test Table
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

-- Test Package Table
CREATE TABLE test_package (
    package_id INT AUTO_INCREMENT PRIMARY KEY,
    package_name VARCHAR(50) NOT NULL,
    description TEXT
);

-- Contains Table (relation between package and test)
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

-- Report Table
CREATE TABLE report (
    report_id INT AUTO_INCREMENT PRIMARY KEY,
    report_date DATE DEFAULT (CURRENT_DATE),
    approval_status ENUM('Pending', 'Approved', 'Rejected') DEFAULT 'Pending',
    patient_id INT NOT NULL,
    FOREIGN KEY (patient_id) REFERENCES patient(patient_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- Test Result Table
CREATE TABLE test_result (
    res_id INT AUTO_INCREMENT PRIMARY KEY,
    measured_value VARCHAR(100),
    unit VARCHAR(50),
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
        ON UPDATE CASCADE,
    UNIQUE (test_code)
);

-- Interpretation Flags Table
CREATE TABLE interpretation_flags (
    result_id INT NOT NULL,
    flag_type VARCHAR(100) NOT NULL,
    flag_value VARCHAR(200),
    PRIMARY KEY (result_id, flag_type),
    FOREIGN KEY (result_id) REFERENCES test_result(res_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- Billing Record Table
CREATE TABLE billing_record (
    bill_no INT AUTO_INCREMENT PRIMARY KEY,
    total_amt DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    payment_status ENUM('Paid', 'Unpaid', 'Pending') DEFAULT 'Pending',
    method ENUM('Cash', 'Card', 'Online', 'Other') DEFAULT 'Cash',
    report_id INT UNIQUE,
    FOREIGN KEY (report_id) REFERENCES report(report_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- Patient History Table
CREATE TABLE patient_history (
    history_id INT AUTO_INCREMENT PRIMARY KEY,
    visit_date DATE NOT NULL,
    notes TEXT,
    patient_id INT,
    FOREIGN KEY (patient_id) REFERENCES patient(patient_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE provide_prescription(
    pres_id INT AUTO_INCREMENT PRIMARY KEY,
    pres_date DATE DEFAULT (CURRENT_DATE),
    NOTES TEXT,
    
)