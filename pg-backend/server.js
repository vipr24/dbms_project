import express from "express";
import { pool } from "./config/dbConfig.js";
import cors from "cors";
import { loginDoctor, registerDoctor } from "./controllers/auth/doctorAuth.js";
import {
	loginPatient,
	registerPatient,
} from "./controllers/auth/patientAuth.js";
import verifyToken from "./utils/verifyJwtToken.js";
import doctorFetch from "./controllers/fetch/doctorFetch.js";
import patientFetch from "./controllers/fetch/patientFetch.js";
import { appointmentBook } from "./controllers/patientRequests/appointmentBook.js";
import { testRegister } from "./controllers/patientRequests/testRegister.js";
import { doctorPatientDetails } from "./controllers/doctorRequests/doctorPatientDetails.js";
import {
	loginLabTechnician,
	registerLabTechnician,
} from "./controllers/auth/labTech.js";
import {
	getLabTechDashboard,
	submitTestResult,
} from "./controllers/labTechnician/labTech.js";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
	res.send("Hi, this is server");
});

app.post("/login/doctor", loginDoctor);
app.post("/register/doctor", registerDoctor);
app.post("/login/patient", loginPatient);
app.post("/register/patient", registerPatient);
app.post("/login/lab-tech", loginLabTechnician);
app.post("/register/lab-tech", registerLabTechnician);

app.get("/patient", verifyToken, patientFetch);
app.get("/doctor", verifyToken, doctorFetch);

app.post("/appointment/book", verifyToken, appointmentBook);
app.post("/test/register", verifyToken, testRegister);

app.get("/lab-tech/dashboard", getLabTechDashboard);
app.post("/lab-tech/tests/:test_history_id/submit", submitTestResult);

// Fetch all doctors
app.get("/doctors", async (req, res) => {
	const doctors = await pool.query(
		`SELECT doctor_id, name, specialization FROM doctor;`
	);
	res.json(doctors.rows);
});

// Fetch all available tests
app.get("/tests", async (req, res) => {
	try {
		const result = await pool.query(
			`SELECT test_code, test_name, test_type, normal_range FROM Test ORDER BY test_name`
		);
		res.json(result.rows);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Server error" });
	}
});

app.post("/test/request", verifyToken, async (req, res) => {
	const doctorId = req.user.doctor_id;
	const { appointId, tests } = req.body;

	if (!appointId || !tests || !Array.isArray(tests) || tests.length === 0) {
		return res
			.status(400)
			.json({ error: "Appointment ID and tests are required" });
	}

	try {
		// Check if appointment belongs to this doctor
		const appointRes = await pool.query(
			`SELECT doctor_id FROM Appointment WHERE appoint_id = $1`,
			[appointId]
		);

		if (!appointRes.rows.length) {
			return res.status(404).json({ error: "Appointment not found" });
		}

		if (appointRes.rows[0].doctor_id !== doctorId) {
			return res
				.status(403)
				.json({ error: "You are not authorized for this appointment" });
		}

		// Insert selected tests into Test_History
		const insertPromises = tests.map((testCode) =>
			pool.query(
				`INSERT INTO Test_History (test_code, appoint_id) VALUES ($1, $2)`,
				[testCode, appointId]
			)
		);

		await Promise.all(insertPromises);

		res.json({ message: "Tests successfully assigned to patient" });
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Server error" });
	}
});

// GET /doctor/dashboard
app.get("/doctor/dashboard", verifyToken, async (req, res) => {
	const doctorId = req.user.doctor_id;

	try {
		// Fetch doctor info with department name
		const doctorRes = await pool.query(
			`SELECT d.doctor_id, d.name, d.gender, d.phone_no, d.email, d.specialization, dep.dept_name
       FROM Doctor d
       LEFT JOIN Department dep ON d.dept_id = dep.dept_id
       WHERE d.doctor_id = $1`,
			[doctorId]
		);

		if (!doctorRes.rows.length) {
			return res.status(404).json({ error: "Doctor not found" });
		}

		const doctor = doctorRes.rows[0];

		// Fetch appointments of this doctor
		const appointmentsRes = await pool.query(
			`SELECT appoint_id, patient_id, date, time
       FROM Appointment
       WHERE doctor_id = $1
       ORDER BY date, time`,
			[doctorId]
		);
		const appointments = appointmentsRes.rows;

		// Fetch unique patients for this doctor
		const patientIds = [...new Set(appointments.map((a) => a.patient_id))];
		let patients = [];
		if (patientIds.length > 0) {
			const patientsRes = await pool.query(
				`SELECT patient_id, name, gender, contact_no, blood_group, email
         FROM Patient
         WHERE patient_id = ANY($1::int[])`,
				[patientIds]
			);
			patients = patientsRes.rows;
		}

		res.json({ doctor, appointments, patients });
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Server error" });
	}
});

app.get("/doctor/patient/:patient_id", verifyToken, doctorPatientDetails);

await pool
	.connect()
	.then(() => console.log("Database connected"))
	.catch((e) => {
		console.log("error : ", e);
	});
app.listen(3000, () => {
	console.log("server running");
});
