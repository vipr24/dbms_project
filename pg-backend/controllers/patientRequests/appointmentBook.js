import { pool } from "../../config/dbConfig.js";

export const appointmentBook = async (req, res) => {
	try {
		const { doctorId, date, time } = req.body;
		const patientId = req.user.patient_id; // from JWT

		if (!doctorId || !date || !time) {
			return res.status(400).json({ error: "Missing required fields" });
		}

		// 🆔 Generate new appointment ID
		const nextIdResult = await pool.query(
			"SELECT COALESCE(MAX(appoint_id), 300) + 1 AS next_id FROM appointment;"
		);
		const appointId = nextIdResult.rows[0].next_id;

		// 📅 Insert into Appointment table
		await pool.query(
			"INSERT INTO appointment (appoint_id, patient_id, doctor_id, date, time) VALUES ($1, $2, $3, $4, $5);",
			[appointId, patientId, doctorId, date, time]
		);

		// 💊 Create Prescription record (links doctor ↔ patient)
		await pool.query(
			`INSERT INTO provide_prescription (prescription_id, doctor_id, patient_id)
       VALUES (
         COALESCE((SELECT MAX(prescription_id) + 1 FROM provide_prescription), 1),
         $1, $2
       );`,
			[doctorId, patientId]
		);

		// 🧾 Add entry to Patient History
		await pool.query(
			`INSERT INTO patient_history (history_id, patient_id, visit_date)
       VALUES (
         (SELECT COALESCE(MAX(history_id), 1000) + 1 FROM patient_history),
         $1, $2
       );`,
			[patientId, date]
		);

		res.status(201).json({ message: "Appointment booked successfully" });
	} catch (err) {
		console.error("Error booking appointment:", err);
		res.status(500).json({
			error: "Server error while booking appointment",
		});
	}
};
