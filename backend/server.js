import express from "express";
import verifyToken from "./utils/verifyJwtToken.js";
import { registerDoctor, loginDoctor } from "./controllers/auth/doctorAuth.js";
import {
	loginPatient,
	registerPatient,
} from "./controllers/auth/patientAuth.js";
import cors from "cors";
import doctorFetch from "./controllers/fetch/doctorFetch.js";
import patientFetch from "./controllers/fetch/patientFetch.js";
import { appointmentBook } from "./controllers/patientRequests/appointmentBook.js";
import { testRegister } from "./controllers/patientRequests/testRegister.js";
import { sql } from "./config/dbConfig.js";
import { doctorPatientDetails } from "./controllers/doctorRequests/doctorPatientDetails.js";

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
	res.send("Hi this is server");
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
		await sql`SELECT doctor_id, name, specialization FROM doctor;`;
	res.json(doctors);
});

// Fetch all available tests
app.get("/tests", async (req, res) => {
	const tests =
		await sql`SELECT test_code, test_name, test_type, normal_range FROM test;`;
	res.json(tests);
});

app.get("/doctor/patient/:patient_id", verifyToken, doctorPatientDetails);

app.listen(3000, () => {
	console.log("server is running");
});
