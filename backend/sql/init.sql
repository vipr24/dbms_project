CREATE TABLE Department (
  Dept_ID     INT PRIMARY KEY,
  Dept_Name   VARCHAR(50),
  Location    VARCHAR(50)
);

CREATE TABLE Doctor (
  Doctor_ID      INT PRIMARY KEY,
  Name           VARCHAR(50),
  Gender         CHAR(1),
  Phone_No       VARCHAR(15),
  Email          VARCHAR(100),
  License_Number VARCHAR(30),
  Specialization VARCHAR(50),
  Dept_ID        INT,
  FOREIGN KEY (Dept_ID) REFERENCES Department(Dept_ID)
);

CREATE TABLE Patient(
  Patient_ID        INT PRIMARY KEY,
  Name              VARCHAR(50),
  Gender            CHAR(1),
  Contact_No        VARCHAR(15),
  Blood_Group       VARCHAR(5),
  Address           VARCHAR(255),
  Email             VARCHAR(100),
  Date_of_Birth     DATE,
  Registration_Date DATE
);

CREATE TABLE Appointment (
  Appoint_ID  INT PRIMARY KEY,
  Patient_ID  INT,
  Date        DATE,
  Time        TIME,
  FOREIGN KEY (Patient_ID) REFERENCES Patient(Patient_ID)
);

CREATE TABLE Lab_Technician (
  Tech_ID     INT PRIMARY KEY,
  Name        VARCHAR(50),
  Contact_No  VARCHAR(15),
  Dept        VARCHAR(50)
);

CREATE TABLE Test_Package (
  Package_ID    INT PRIMARY KEY,
  Package_Name  VARCHAR(100),
  Description   VARCHAR(255)
);

CREATE TABLE Test (
  Test_Code     INT PRIMARY KEY,
  Test_Name     VARCHAR(100),
  Normal_Range  VARCHAR(50),
  Test_Type     VARCHAR(50),
  Tech_ID       INT,
  Appoint_ID    INT,
  FOREIGN KEY (Tech_ID) REFERENCES Lab_Technician(Tech_ID),
  FOREIGN KEY (Appoint_ID) REFERENCES Appointment(Appoint_ID)
);

CREATE TABLE Test_Result (
  Test_ID         INT PRIMARY KEY,
  Test_Code       INT,
  Measured_Value    VARCHAR(50),
  Unit              VARCHAR(20),
  Interpretation_Flag VARCHAR(20),
  FOREIGN KEY (Test_Code) REFERENCES Test(Test_Code)
);

CREATE TABLE Reports (
  R_ID            INT PRIMARY KEY,
  Patient_ID      INT,
  Result_ID       INT UNIQUE,
  R_Date          DATE,
  Approval_Status VARCHAR(20),
  FOREIGN KEY (Patient_ID) REFERENCES Patient(Patient_ID),
  FOREIGN KEY (Result_ID) REFERENCES Test_Result(Test_ID)
);

CREATE TABLE Billing_Records (
  Bill_No          INT PRIMARY KEY,
  R_ID             INT,
  Amount           DECIMAL(10,2),
  Payment_Status   VARCHAR(20),
  Method_of_Payment VARCHAR(20),
  FOREIGN KEY (R_ID) REFERENCES Reports(R_ID)
);

CREATE TABLE Patient_History (
  History_ID  INT PRIMARY KEY,
  Patient_ID  INT,
  Visit_Date  DATE,
  FOREIGN KEY (Patient_ID) REFERENCES Patient(Patient_ID)
);

CREATE TABLE Provide_Prescription (
  Prescription_ID INT PRIMARY KEY,
  Doctor_ID       INT,
  Patient_ID      INT,
  FOREIGN KEY (Doctor_ID) REFERENCES Doctor(Doctor_ID),
  FOREIGN KEY (Patient_ID) REFERENCES Patient(Patient_ID)
);

CREATE TABLE Contains (
  Test_Code   INT,
  Package_ID  INT,
  PRIMARY KEY (Test_Code, Package_ID),
  FOREIGN KEY (Test_Code) REFERENCES Test(Test_Code),
  FOREIGN KEY (Package_ID) REFERENCES Test_Package(Package_ID)
);
