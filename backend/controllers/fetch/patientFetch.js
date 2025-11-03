import { sql } from "../../config/dbConfig.js";

const patientFetch = async (req, res) => {
	try {
		const patientId = req.user.id; // from JWT

		// patient info
		const patient = await sql`
      SELECT patient_id, name, gender, contact_no, blood_group, address, email, date_of_birth, registration_date
      FROM patient
      WHERE patient_id = ${patientId};
    `;

		// recent appointments
		const appointments = await sql`
      SELECT appoint_id, date, time
      FROM appointment
      WHERE patient_id = ${patientId}
      ORDER BY date DESC;
    `;

		// reports
		const reports = await sql`
      SELECT r.r_id, r.r_date, r.approval_status, tr.interpretation_flag
      FROM reports r
      LEFT JOIN test_result tr ON r.result_id = tr.test_id
      WHERE r.patient_id = ${patientId};
    `;

		res.json({
			patient: patient[0],
			appointments,
			reports,
		});
	} catch (err) {
		console.error("Error fetching patient dashboard:", err);
		res.status(500).json({ error: "Server error" });
	}
};

export default patientFetch;