import { pool } from "../../config/dbConfig.js";

const patientFetch = async (req, res) => {
	try {
		const patientId = req.user.patient_id; // Make sure JWT middleware sets this

		// Patient info
		const patient = await pool.query(
			`SELECT patient_id, name, gender, contact_no, blood_group, address, email, date_of_birth, registration_date
       FROM patient
       WHERE patient_id = $1`,
			[patientId]
		);

		// Appointments
		const appointments = await pool.query(
			`SELECT appoint_id, doctor_id, date, time
       FROM appointment
       WHERE patient_id = $1
       ORDER BY date DESC`,
			[patientId]
		);

		// Reports
		const reports = await pool.query(
			`SELECT r.report_id, r.report_date, r.approval_status, tr.interpretation_summary
       FROM report r
       LEFT JOIN test_result tr ON r.report_id = tr.report_id
       WHERE r.patient_id = $1`,
			[patientId]
		);

		// Doctors
		const doctors = await pool.query(
			`SELECT doctor_id, name, specialization, email, phone_no
       FROM doctor
       ORDER BY name`
		);

		// Test Packages
		const testPackages = await pool.query(
			`SELECT package_id, package_name, description
       FROM test_package`
		);

		// Tests taken by patient
		const tests = await pool.query(
			`SELECT th.test_history_id, t.test_name, t.test_type, t.normal_range,
          a.date AS appointment_date,
          tr.measured_value, tr.interpretation_summary
   FROM test_history th
   JOIN test t ON th.test_code = t.test_code
   JOIN appointment a ON th.appoint_id = a.appoint_id
   LEFT JOIN test_result tr ON th.test_history_id = tr.test_history_id
   WHERE a.patient_id = $1
   ORDER BY a.date, th.test_history_id`,
			[patientId]
		);

		// Billing
		const bills = await pool.query(
			`SELECT b.bill_no, b.total_amt, b.payment_status, b.payment_method,
              r.report_date, r.approval_status
       FROM billing_record b
       LEFT JOIN report r ON b.report_id = r.report_id
       WHERE r.patient_id = $1`,
			[patientId]
		);

		res.json({
			patient: patient.rows[0],
			appointments: appointments.rows,
			reports: reports.rows,
			doctors: doctors.rows,
			testPackages: testPackages.rows,
			tests: tests.rows,
			bills: bills.rows,
		});
	} catch (err) {
		console.error("Error fetching patient dashboard:", err);
		res.status(500).json({ error: "Server error" });
	}
};

export default patientFetch;
