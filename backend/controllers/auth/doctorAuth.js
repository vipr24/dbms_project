import bcrypt from "bcryptjs";
import generateToken from "../../utils/createJwtToken.js";
import { sql } from "../../config/dbConfig.js";

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
};

export const loginDoctor = async (req, res) => {
	const { email, password } = req.body;

	try {
		const userRes = await sql`SELECT * FROM Doctor WHERE Email = ${email}`;
		if (userRes.length === 0)
			return res.status(401).json({ message: "Invalid credentials" });

		const user = userRes[0];
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
