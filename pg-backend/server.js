import express from "express";
import { pool } from "./config/dbConfig.js";
import cors from "cors";
import { loginDoctor, registerDoctor } from "./controllers/auth/doctorAuth.js";
import { loginPatient, registerPatient } from "./controllers/auth/patientAuth.js";

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

await pool
	.connect()
	.then(() => console.log("Database connected"))
	.catch((e) => {
		console.log("error : ", e);
	});
app.listen(3000, () => {
	console.log("server running");
});
