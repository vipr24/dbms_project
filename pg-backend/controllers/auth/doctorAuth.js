import bcrypt from "bcryptjs";
import generateToken from "../../utils/createJwtToken.js";
import { pool } from "../../config/dbConfig.js";

export const registerDoctor = async (req, res) => {
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

		const result = await pool.query(
			`INSERT INTO Doctor 
      (Name, Email, Password, Phone_No, Specialization, Dept_ID, License_Number, Gender) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *`,
			[
				name,
				email,
				hashedPassword,
				phone,
				specialization,
				deptId,
				licenseNo,
				gender,
			]
		);
		const token = generateToken(result.rows[0]);
		res.status(201).json({
			message: "Doctor registered successfully",
			token,
			doctor: result[0],
		});
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: "Error registering doctor" });
	}
};

export const loginDoctor = async (req, res) => {
	const { email, password } = req.body;

	try {
		const userRes = await pool.query(
			"SELECT * FROM Doctor WHERE Email = $1",
			[email]
		);
		if (userRes.rows.length === 0)
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
