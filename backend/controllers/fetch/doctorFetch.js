import { sql } from "../../config/dbConfig";

export default doctorFetch = async (req, res) => {
	try {
		const doctorId = req.user.id; // from JWT (set by verifyToken middleware)

		const doctor = await sql`
		SELECT d.doctor_id, d.name, d.gender, d.phone_no, d.email, d.specialization, dept.dept_name
		FROM doctor d
		LEFT JOIN department dept ON d.dept_id = dept.dept_id
		WHERE d.doctor_id = ${doctorId};
		`;

		// doctor’s patients (from Provide_Prescription join)
		const patients = await sql`
		SELECT p.patient_id, p.name, p.gender, p.contact_no, p.blood_group, p.email
		FROM provide_prescription pr
		JOIN patient p ON pr.patient_id = p.patient_id
		WHERE pr.doctor_id = ${doctorId};
		`;

		res.json({
			doctor: doctor[0],
			patients,
		});
	} catch (err) {
		console.error("Error fetching doctor dashboard:", err);
		res.status(500).json({ error: "Server error" });
	}
};
