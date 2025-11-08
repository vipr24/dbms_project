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

app.get("/patient", verifyToken, patientFetch);
app.get("/doctor", verifyToken, doctorFetch);

app.post("/appointment/book", verifyToken, appointmentBook);
app.post("/test/register", verifyToken, testRegister);

// Fetch all doctors
app.get("/doctors", async (req, res) => {
	const doctors =
		await pool.query(`SELECT doctor_id, name, specialization FROM doctor;`);
	res.json(doctors.rows);
});

// Fetch all available tests
app.get("/tests", async (req, res) => {
	const tests = await pool.query(
		`SELECT test_code, test_name, test_type, normal_range FROM test;`
	);
	res.json(tests.rows);
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
