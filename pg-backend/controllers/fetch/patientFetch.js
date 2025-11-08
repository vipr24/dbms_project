import { pool } from "../../config/dbConfig.js";

const patientFetch = async (req, res) => {
	try {
		const patientId = req.user.patient_id; // from JWT

		// 🩸 Patient basic info
		const patient = await pool.query(
			`SELECT patient_id, name, gender, contact_no, blood_group, address, email, date_of_birth, registration_date
			 FROM patient
			 WHERE patient_id = $1;`,
			[patientId]
		);

		// 📅 Appointments
		const appointments = await pool.query(
			`SELECT appoint_id, date, time
			 FROM appointment
			 WHERE patient_id = $1
			 ORDER BY date DESC;`,
			[patientId]
		);

		// 🧪 Reports
		const reports = await pool.query(
			`SELECT r.r_id, r.r_date, r.approval_status, tr.interpretation_flag
			 FROM reports r
			 LEFT JOIN test_result tr ON r.result_id = tr.test_id
			 WHERE r.patient_id = $1;`,
			[patientId]
		);

		// 👩‍⚕️ Available doctors
		const doctors = await pool.query(
			`SELECT doctor_id, name, specialization, email, phone_no
			 FROM doctor
			 ORDER BY name;`
		);

		// 🧰 Test packages
		const testPackages = await pool.query(
			`SELECT package_id, package_name, description
			 FROM test_package;`
		);

		// 🧑‍🔬 Tests taken by the patient
		const tests = await pool.query(
			`SELECT t.test_code, t.test_name, t.test_type, t.normal_range,
					lt.name AS technician_name, lt.dept AS technician_dept,
					a.date AS appointment_date
			 FROM test t
			 LEFT JOIN appointment a ON t.appoint_id = a.appoint_id
			 LEFT JOIN lab_technician lt ON t.tech_id = lt.tech_id
			 WHERE a.patient_id = $1;`,
			[patientId]
		);

		// 💰 Billing records
		const bills = await pool.query(
			`SELECT b.bill_no, b.amount, b.payment_status, b.method_of_payment,
					r.r_date, r.approval_status
			 FROM billing_records b
			 LEFT JOIN reports r ON b.r_id = r.r_id
			 WHERE r.patient_id = $1;`,
			[patientId]
		);

		// 🧩 Final response
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
