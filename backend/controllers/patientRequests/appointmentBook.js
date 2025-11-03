import { sql } from "../../config/dbConfig.js";

export const appointmentBook = async (req, res) => {
	try {
		const { doctorId, date, time } = req.body;
		const patientId = req.user.patient_id;

		if (!doctorId || !date || !time) {
			return res.status(400).json({ error: "Missing required fields" });
		}

		// Generate unique appointment ID (e.g., max + 1)
		const nextIdResult =
			await sql`SELECT COALESCE(MAX(appoint_id), 300) + 1 AS next_id FROM appointment;`;
		const appointId = nextIdResult[0].next_id;

		await sql`
			INSERT INTO appointment (appoint_id, patient_id, date, time)
			VALUES (${appointId}, ${patientId}, ${date}, ${time});
		`;

		// optional: Add entry to Patient_History
		await sql`
			INSERT INTO patient_history (history_id, patient_id, visit_date)
			VALUES (
				(SELECT COALESCE(MAX(history_id), 1000) + 1 FROM patient_history),
				${patientId},
				${date}
			);
		`;

		res.status(201).json({ message: "Appointment booked successfully" });
	} catch (err) {
		console.error("Error booking appointment:", err);
		res.status(500).json({
			error: "Server error while booking appointment",
		});
	}
};
