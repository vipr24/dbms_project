import express from "express";
import bcrypt from "bcryptjs";
import generateToken from "./utils/createJwtToken.js";
import cors from "cors";
import { sql } from "./config/dbConfig.js";

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
	res.send("Hi this is server");
});

app.post("/login/doctor", async (req, res) => {
	const { email, password } = req.body;

	try {
		const userRes = await sql`SELECT * FROM Doctor WHERE Email = ${email}`;
		if (userRes.length === 0)
			return res.status(401).json({ message: "Invalid credentials" });

		const user = userRes[0];
		// const validPassword = await bcrypt.compare(password, user.password);
		const validPassword = password === user.password; // ⚠️ Only for testing
		if (!validPassword)
			return res.status(401).json({ message: "Invalid password" });

		const token = generateToken(user);
		res.status(200).json({ message: "Login successful", token, user });
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: "Error logging in" });
	}
});

app.post("/register/doctor", async (req, res) => {
	const {
		name,
		email,
		password,
		phone,
		specialization,
		deptId,
		licenseNo,
		gender,
	} = req.body;

	try {
		const hashedPassword = await bcrypt.hash(password, 10);

		const result =
			await sql`INSERT INTO Doctor (Name, Email, Password, Phone_No, Specialization, Dept_ID, License_Number, Gender)
                       VALUES (${name}, ${email}, ${hashedPassword}, ${phone}, ${specialization}, ${deptId}, ${licenseNo}, ${gender})
                       RETURNING Doctor_ID, Name, Email`;

		const token = generateToken(result[0]);
		res.status(201).json({
			message: "Doctor registered successfully",
			token,
			doctor: result[0],
		});
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: "Error registering doctor" });
	}
});

app.post("/login/patient", async (req, res) => {
	const { email, password } = req.body;

	try {
		const userRes = await sql`SELECT * FROM Patient WHERE Email = ${email}`;
		if (userRes.length === 0)
			return res.status(401).json({ message: "Invalid credentials" });

		const user = userRes[0];
		// const validPassword = await bcrypt.compare(password, user.password);
		const validPassword = password === user.password; // ⚠️ Only for testing

		if (!validPassword)
			return res.status(401).json({ message: "Invalid password" });

		const token = generateToken(user);
		res.status(200).json({ message: "Login successful", token, user });
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: "Error logging in" });
	}
});

app.post("/register/patient", async (req, res) => {
	const {
		name,
		email,
		password,
		phone,
		gender,
		bloodGroup,
		dateOfRegistration,
		dob,
		address,
	} = req.body;

	try {
		const hashedPassword = await bcrypt.hash(password, 10);

		const result =
			await sql`INSERT INTO Patient (Name, Email, Password, Contact_No, Gender, Blood_Group, Registration_Date, Date_of_Birth, Address)
                       VALUES (${name}, ${email}, ${hashedPassword}, ${phone}, ${gender}, ${bloodGroup}, ${dateOfRegistration}, ${dob}, ${address})
                       RETURNING Patient_ID, Name, Email`;

		const token = generateToken(result[0]);
		res.status(201).json({
			message: "Patient registered successfully",
			token,
			patient: result[0],
		});
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: "Error registering patient" });
	}
});

app.listen(3000, () => {
	console.log("server is running");
});
