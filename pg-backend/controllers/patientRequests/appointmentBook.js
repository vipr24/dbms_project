import { pool } from "../../config/dbConfig.js";

export const appointmentBook = async (req, res) => {
	const { patientId, doctorId, date, time } = req.body;

	try {
		// Check if doctor already has appointment at the same date & time
		const conflictCheck = await pool.query(
			"SELECT * FROM Appointment WHERE doctor_id = $1 AND date = $2 AND time = $3",
			[doctorId, date, time]
		);

		if (conflictCheck.rows.length > 0) {
			return res.status(400).json({
				message: "Sorry, choose another time. Doctor is busy.",
			});
		}

		// Insert appointment
		const insertRes = await pool.query(
			`INSERT INTO Appointment (Patient_ID, Doctor_ID, Date, Time)
             VALUES ($1, $2, $3, $4)
             RETURNING *`,
			[patientId, doctorId, date, time]
		);

		res.status(201).json({
			message: "Appointment booked successfully!",
			appointment: insertRes.rows[0],
		});
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: "Error booking appointment" });
	}
};
