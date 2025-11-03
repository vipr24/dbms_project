
-- 1. DEPARTMENT
INSERT INTO Department (Dept_ID, Dept_Name, Location)
VALUES
(1, 'Cardiology', 'Block A'),
(2, 'Pathology', 'Block B');

-- 2. DOCTOR
INSERT INTO Doctor (Doctor_ID, Name, Gender, Phone_No, Email, License_Number, Specialization, Dept_ID)
VALUES
(101, 'Dr. Neha Verma', 'F', '9876543210', 'neha.verma@citycare.com', 'LIC12345', 'Cardiologist', 1),
(102, 'Dr. Rohan Gupta', 'M', '9123456780', 'rohan.gupta@citycare.com', 'LIC67890', 'Pathologist', 2);

-- 3. PATIENT
INSERT INTO Patient (Patient_ID, Name, Gender, Contact_No, Blood_Group, Address, Email, Date_of_Birth, Registration_Date)
VALUES
(201, 'Aarav Sharma', 'M', '8885551212', 'B+', 'Delhi, India', 'aarav.sharma@email.com', '1995-04-22', '2025-11-01'),
(202, 'Priya Mehta', 'F', '7774442323', 'O-', 'Mumbai, India', 'priya.mehta@email.com', '1998-06-15', '2025-11-01');

-- 4. APPOINTMENT
INSERT INTO Appointment (Appoint_ID, Patient_ID, Date, Time)
VALUES
(301, 201, '2025-11-02', '10:00:00'),
(302, 202, '2025-11-02', '11:30:00');

-- 5. LAB TECHNICIAN
INSERT INTO Lab_Technician (Tech_ID, Name, Contact_No, Dept)
VALUES
(401, 'Anjali Singh', '9991112222', 'Pathology'),
(402, 'Raj Patel', '9993334444', 'Biochemistry');

-- 6. TEST PACKAGE
INSERT INTO Test_Package (Package_ID, Package_Name, Description)
VALUES
(501, 'Basic Health Package', 'Includes CBC and Lipid Profile tests');

-- 7. TEST
INSERT INTO Test (Test_Code, Test_Name, Normal_Range, Test_Type, Tech_ID, Appoint_ID)
VALUES
(601, 'CBC (Complete Blood Count)', '4.5-5.5 million/μL', 'Blood', 401, 301),
(602, 'Lipid Profile', '<200 mg/dL', 'Blood', 402, 302);

-- 8. CONTAINS (Package-Test Mapping)
INSERT INTO Contains (Test_Code, Package_ID)
VALUES
(601, 501),
(602, 501);

-- 9. TEST RESULT
INSERT INTO Test_Result (Test_ID, Test_Code, Measured_Value, Unit, Interpretation_Flag)
VALUES
(701, 601, '5.0', 'million/μL', 'Normal'),
(702, 602, '210', 'mg/dL', 'High');

-- 10. REPORTS
INSERT INTO Reports (R_ID, Patient_ID, Result_ID, R_Date, Approval_Status)
VALUES
(801, 201, 701, '2025-11-03', 'Approved'),
(802, 202, 702, '2025-11-03', 'Approved');

-- 11. BILLING RECORDS
INSERT INTO Billing_Records (Bill_No, R_ID, Amount, Payment_Status, Method_of_Payment)
VALUES
(901, 801, 1500.00, 'Paid', 'Credit Card'),
(902, 802, 1800.00, 'Pending', 'UPI');

-- 12. PATIENT HISTORY
INSERT INTO Patient_History (History_ID, Patient_ID, Visit_Date)
VALUES
(1001, 201, '2025-11-02'),
(1002, 202, '2025-11-02');

-- 13. PRESCRIPTION
INSERT INTO Provide_Prescription (Prescription_ID, Doctor_ID, Patient_ID)
VALUES
(1101, 101, 201),
(1102, 102, 202);
