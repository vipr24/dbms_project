import { pool } from "../../config/dbConfig.js";

export const doctorPatientDetails = async (req, res) => {
  try {
    const doctorId = req.user.doctor_id;
    const patientId = req.params.patient_id;

    // ✅ Authorization check
    const valid = await pool.query(
      "SELECT 1 FROM provide_prescription WHERE doctor_id = $1 AND patient_id = $2;",
      [doctorId, patientId]
    );

    if (valid.rows.length === 0)
      return res.status(403).json({ message: "Unauthorized" });

    // 🧍 Patient details
    const patient = await pool.query(
      "SELECT * FROM patient WHERE patient_id = $1;",
      [patientId]
    );

    // 🧪 Tests + results
    const tests = await pool.query(
      `SELECT t.test_code, t.test_name, t.test_type, t.normal_range,
              lt.name AS technician_name, a.date AS appointment_date,
              tr.test_id AS result_id, tr.measured_value, tr.unit, tr.interpretation_flag
       FROM test t
       JOIN lab_technician lt ON t.tech_id = lt.tech_id
       JOIN appointment a ON t.appoint_id = a.appoint_id
       LEFT JOIN test_result tr ON t.test_code = tr.test_code
       WHERE a.patient_id = $1;`,
      [patientId]
    );

    // 🧾 Reports
    const reports = await pool.query(
      `SELECT r.r_id, r.r_date, r.approval_status,
              tr.measured_value, tr.unit, tr.interpretation_flag
       FROM reports r
       JOIN test_result tr ON r.result_id = tr.test_id
       WHERE r.patient_id = $1;`,
      [patientId]
    );

    // 💰 Bills
    const bills = await pool.query(
      `SELECT b.bill_no, b.amount, b.payment_status, b.method_of_payment
       FROM billing_records b
       JOIN reports r ON b.r_id = r.r_id
       WHERE r.patient_id = $1;`,
      [patientId]
    );

    res.json({
      patient: patient.rows[0],
      tests: tests.rows,
      reports: reports.rows,
      bills: bills.rows,
    });
  } catch (err) {
    console.error("Error fetching doctor-patient details:", err);
    res.status(500).json({ message: "Server error" });
  }
};
