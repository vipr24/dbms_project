import bcrypt from "bcryptjs";
import generateToken from "../../utils/createJwtToken.js";
import { pool } from "../../config/dbConfig.js";

export const registerPatient = async (req, res) => {
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

		const result = await pool.query(
			"INSERT INTO Patient (Name, Email, Password, Contact_No, Gender, Blood_Group, Registration_Date, Date_of_Birth, Address) VALUES (${1}, ${2}, ${3}, ${4}, ${5}, ${6}, ${7}, ${8}, ${9})",
			name,
			email,
			hashedPassword,
			phone,
			gender,
			bloodGroup,
			dateOfRegistration,
			dob,
			address
		);

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
};

export const loginPatient = async (req, res) => {
	const { email, password } = req.body;

	try {
		const userRes = await pool.query(
			"SELECT * FROM Patient WHERE Email = ${1}",
			email
		);
		if (userRes.length === 0)
			return res.status(401).json({ message: "Invalid credentials" });

		const user = userRes.rows[0];
		const validPassword = await bcrypt.compare(password, user.password);

		if (!validPassword)
			return res.status(401).json({ message: "Invalid password" });

		const token = generateToken(user);
		res.status(200).json({ message: "Login successful", token, user });
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: "Error logging in" });
	}
};
