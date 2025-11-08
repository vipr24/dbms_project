import jwt from "jsonwebtoken";

export default function generateToken(user) {
	// const id = user.doctor_id || user.patient_id;
	return jwt.sign(
		{
			doctor_id: user.doctor_id || null,
			patient_id: user.patient_id || null,
			email: user.email,
		},
		process.env.JWT_SECRET,
		{
			expiresIn: "2h",
		}
	);
}
