import { pool } from "../../config/dbConfig.js";

export const testRegister = async (req, res) => {
	try {
		const { testName, testType, normalRange } = req.body;
		const patientId = req.user.patient_id;

		if (!testName || !testType) {
			return res.status(400).json({ error: "Test name and type required" });
		}

		// 🗓 Find most recent appointment for this patient
		const recentAppointment = await pool.query(
			"SELECT appoint_id FROM appointment WHERE patient_id = $1 ORDER BY date DESC LIMIT 1;",
			[patientId]
		);

		if (recentAppointment.rows.length === 0) {
			return res.status(400).json({ error: "Book an appointment first." });
		}

		const appointId = recentAppointment.rows[0].appoint_id;

		// 🧪 Assign a random technician
		const tech = await pool.query(
			"SELECT tech_id FROM lab_technician ORDER BY RANDOM() LIMIT 1;"
		);
		const techId = tech.rows[0]?.tech_id || 401;

		// 🧮 Generate next Test Code
		const nextTestCode = await pool.query(
			"SELECT COALESCE(MAX(test_code), 600) + 1 AS next_code FROM test;"
		);
		const testCode = nextTestCode.rows[0].next_code;

		// 📋 Insert into Test
		await pool.query(
			`INSERT INTO test (test_code, test_name, normal_range, test_type, tech_id, appoint_id)
			 VALUES ($1, $2, $3, $4, $5, $6);`,
			[
				testCode,
				testName,
				normalRange || "N/A",
				testType,
				techId,
				appointId,
			]
		);

		// 🧫 Create default Test_Result record
		const nextTestId = await pool.query(
			"SELECT COALESCE(MAX(test_id), 700) + 1 AS next_id FROM test_result;"
		);
		const testId = nextTestId.rows[0].next_id;

		await pool.query(
			`INSERT INTO test_result (test_id, test_code, measured_value, unit, interpretation_flag)
			 VALUES ($1, $2, '', '', 'Pending');`,
			[testId, testCode]
		);

		res.status(201).json({ message: "Test registered successfully" });
	} catch (err) {
		console.error("Error registering test:", err);
		res.status(500).json({ error: "Server error while registering test" });
	}
};
