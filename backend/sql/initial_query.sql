-- ==============================
-- INSERT SAMPLE DATA
-- ==============================

-- 1️⃣ DEPARTMENT
INSERT INTO Department (Dept_ID, Dept_Name, Location)
VALUES
(3, 'Neurology', 'Block C'),
(4, 'Radiology', 'Block D'),
(5, 'Orthopedics', 'Block E');

-- 2️⃣ DOCTOR
INSERT INTO Doctor (Name, Gender, Phone_No, Email, License_Number, Specialization, Dept_ID, Password)
VALUES
('Dr. Kavita Rao', 'F', '9898989898', 'kavita.rao@citycare.com', 'LIC33333', 'Neurologist', 3, 'asm123'),
('Dr. Arjun Mehta', 'M', '9123123123', 'arjun.mehta@citycare.com', 'LIC44444', 'Radiologist', 4, 'asm123'),
('Dr. Pooja Nair', 'F', '9876701234', 'pooja.nair@citycare.com', 'LIC55555', 'Orthopedic Surgeon', 5, 'asm123');

-- 3️⃣ PATIENT
INSERT INTO Patient (Name, Gender, Contact_No, Blood_Group, Address, Email, Date_of_Birth, Registration_Date, Password)
VALUES
('Riya Kapoor', 'F', '9000001122', 'A+', 'Kolkata, India', 'riya.kapoor@email.com', '1997-10-21', '2025-11-02', 'asm123'),
('Ishaan Tiwari', 'M', '9111112233', 'O+', 'Bangalore, India', 'ishaan.tiwari@email.com', '1996-12-03', '2025-11-02', 'asm123');

-- 4️⃣ APPOINTMENT
INSERT INTO Appointment (Appoint_ID, Patient_ID, Date, Time)
VALUES
(303, 1, '2025-11-03', '09:00:00'),
(304, 2, '2025-11-03', '10:30:00');

-- 5️⃣ LAB TECHNICIAN
INSERT INTO Lab_Technician (Tech_ID, Name, Contact_No, Dept)
VALUES
(403, 'Sneha Das', '9995556666', 'Radiology'),
(404, 'Vikram Soni', '9997778888', 'Neurology');

-- 6️⃣ TEST PACKAGE
INSERT INTO Test_Package (Package_ID, Package_Name, Description)
VALUES
(502, 'Heart Care Package', 'Includes ECG, Cholesterol, Blood Pressure'),
(503, 'Advanced Neurology Package', 'Includes EEG, Brain MRI, Nerve Test');

-- 7️⃣ TEST
INSERT INTO Test (Test_Code, Test_Name, Normal_Range, Test_Type, Tech_ID, Appoint_ID)
VALUES
(603, 'ECG (Electrocardiogram)', 'Normal Rhythm', 'Cardio', 403, 303),
(604, 'EEG (Electroencephalogram)', 'Normal Brain Waves', 'Neuro', 404, 304);

-- 8️⃣ CONTAINS (Mapping Tests → Packages)
INSERT INTO Contains (Test_Code, Package_ID)
VALUES
(603, 502),
(604, 503);

-- 9️⃣ TEST RESULT
INSERT INTO Test_Result (Test_ID, Test_Code, Measured_Value, Unit, Interpretation_Flag)
VALUES
(703, 603, 'Normal Rhythm', '', 'Normal'),
(704, 604, 'Mild Abnormality', '', 'Needs Review');

-- 🔟 REPORTS
INSERT INTO Reports (R_ID, Patient_ID, Result_ID, R_Date, Approval_Status)
VALUES
(803, 1, 703, '2025-11-03', 'Approved'),
(804, 2, 704, '2025-11-03', 'Pending');

-- 11️⃣ BILLING RECORDS
INSERT INTO Billing_Records (Bill_No, R_ID, Amount, Payment_Status, Method_of_Payment)
VALUES
(903, 803, 2200.00, 'Paid', 'UPI'),
(904, 804, 3100.00, 'Pending', 'Cash');

-- 12️⃣ PATIENT HISTORY
INSERT INTO Patient_History (History_ID, Patient_ID, Visit_Date)
VALUES
(1003, 1, '2025-11-03'),
(1004, 2, '2025-11-03');

-- 13️⃣ PRESCRIPTION
INSERT INTO Provide_Prescription (Prescription_ID, Doctor_ID, Patient_ID)
VALUES
(1103, 1, 1),
(1104, 2, 2);
