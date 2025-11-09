import { pool } from "../../config/dbConfig.js";

const doctorFetch = async (req, res) => {
  try {
    const doctorId = req.user.doctor_id;

    // 🧑‍⚕️ Doctor info
    const doctor = await pool.query(
      `SELECT d.doctor_id, d.name, d.gender, d.phone_no, d.email, d.specialization, dept.dept_name
       FROM doctor d
       LEFT JOIN department dept ON d.dept_id = dept.dept_id
       WHERE d.doctor_id = $1;`,
      [doctorId]
    );

    // 👩‍🔬 Patients treated by this doctor
    const patients = await pool.query(
      `SELECT p.patient_id, p.name, p.gender, p.contact_no, p.blood_group, p.email
       FROM provide_prescription pr
       JOIN patient p ON pr.patient_id = p.patient_id
       WHERE pr.doctor_id = $1;`,
      [doctorId]
    );

    res.json({
      doctor: doctor.rows[0],
      patients: patients.rows,
    });
  } catch (err) {
    console.error("Error fetching doctor dashboard:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export default doctorFetch;
