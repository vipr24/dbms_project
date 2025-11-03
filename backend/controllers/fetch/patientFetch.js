import { sql } from "../../config/dbConfig.js";

const patientFetch = async (req, res) => {
	try {
		const patientId = req.user.patient_id; // from JWT

		// 🩸 Patient basic info
		const patient = await sql`
			SELECT patient_id, name, gender, contact_no, blood_group, address, email, date_of_birth, registration_date
			FROM patient
			WHERE patient_id = ${patientId};
		`;

		// 📅 Appointments
		const appointments = await sql`
			SELECT appoint_id, date, time
			FROM appointment
			WHERE patient_id = ${patientId}
			ORDER BY date DESC;
		`;

		// 🧪 Reports (with interpretation)
		const reports = await sql`
			SELECT r.r_id, r.r_date, r.approval_status, tr.interpretation_flag
			FROM reports r
			LEFT JOIN test_result tr ON r.result_id = tr.test_id
			WHERE r.patient_id = ${patientId};
		`;

		// 👩‍⚕️ Available doctors (for booking)
		const doctors = await sql`
			SELECT doctor_id, name, specialization, email, phone_no
			FROM doctor
			ORDER BY name;
		`;

		// 🧰 Test packages (for choosing available tests)
		const testPackages = await sql`
			SELECT package_id, package_name, description
			FROM test_package;
		`;

		// 🧑‍🔬 Tests taken by the patient (with technician info)
		const tests = await sql`
			SELECT 
				t.test_code,
				t.test_name,
				t.test_type,
				t.normal_range,
				lt.name AS technician_name,
				lt.dept AS technician_dept,
				a.date AS appointment_date
			FROM test t
			LEFT JOIN appointment a ON t.appoint_id = a.appoint_id
			LEFT JOIN lab_technician lt ON t.tech_id = lt.tech_id
			WHERE a.patient_id = ${patientId};
		`;

		// 💰 Billing records (after reports)
		const bills = await sql`
			SELECT 
				b.bill_no,
				b.amount,
				b.payment_status,
				b.method_of_payment,
				r.r_date,
				r.approval_status
			FROM billing_records b
			LEFT JOIN reports r ON b.r_id = r.r_id
			WHERE r.patient_id = ${patientId};
		`;

		res.json({
			patient: patient[0],
			appointments,
			reports,
			doctors,
			testPackages,
			tests,
			bills,
		});
	} catch (err) {
		console.error("Error fetching patient dashboard:", err);
		res.status(500).json({ error: "Server error" });
	}
};

export default patientFetch;
