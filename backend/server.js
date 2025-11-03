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
app.post("/doctor", verifyToken, doctorFetch);

app.listen(3000, () => {
	console.log("server is running");
});
