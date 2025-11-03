import { sql } from "../../config/dbConfig.js";

export const doctorPatientDetails = async (req, res) => {
	try {
		const doctorId = req.user.doctor_id;
		const patientId = req.params.patient_id;

		// Check if doctor is authorized for this patient
		const valid = await sql`
			SELECT 1 FROM provide_prescription
			WHERE doctor_id = ${doctorId} AND patient_id = ${patientId};
		`;
		if (valid.length === 0)
			return res.status(403).json({ message: "Unauthorized" });

		// Patient basic details
		const patient =
			await sql`SELECT * FROM patient WHERE patient_id = ${patientId};`;

		// Tests + results (joined)
		const tests = await sql`
			SELECT 
				t.test_code, 
				t.test_name, 
				t.test_type, 
				t.normal_range, 
				lt.name AS technician_name, 
				a.date AS appointment_date,
				tr.test_id AS result_id,
				tr.measured_value,
				tr.unit,
				tr.interpretation_flag
			FROM test t
			JOIN lab_technician lt ON t.tech_id = lt.tech_id
			JOIN appointment a ON t.appoint_id = a.appoint_id
			LEFT JOIN test_result tr ON t.test_code = tr.test_code
			WHERE a.patient_id = ${patientId};
		`;

		// Reports related to the patient
		const reports = await sql`
			SELECT r.r_id, r.r_date, r.approval_status, tr.measured_value, tr.unit, tr.interpretation_flag
			FROM reports r
			JOIN test_result tr ON r.result_id = tr.test_id
			WHERE r.patient_id = ${patientId};
		`;

		// Billing info (if available)
		const bills = await sql`
			SELECT b.bill_no, b.amount, b.payment_status, b.method_of_payment
			FROM billing_records b
			JOIN reports r ON b.r_id = r.r_id
			WHERE r.patient_id = ${patientId};
		`;

		res.json({
			patient: patient[0],
			tests,
			reports,
			bills,
		});
	} catch (err) {
		console.error("Error fetching doctor-patient details:", err);
		res.status(500).json({ message: "Server error" });
	}
};
