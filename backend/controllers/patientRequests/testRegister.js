import { sql } from "../../config/dbConfig.js";

export const testRegister = async (req, res) => {
	try {
		const { testName, testType, normalRange } = req.body;
		const patientId = req.user.patient_id;

		if (!testName || !testType) {
			return res
				.status(400)
				.json({ error: "Test name and type required" });
		}

		// Find most recent appointment for this patient
		const recentAppointment = await sql`
			SELECT appoint_id FROM appointment 
			WHERE patient_id = ${patientId}
			ORDER BY date DESC LIMIT 1;
		`;

		if (recentAppointment.length === 0) {
			return res
				.status(400)
				.json({ error: "Book an appointment first." });
		}

		const appointId = recentAppointment[0].appoint_id;

		// Assign a random technician for simplicity
		const tech =
			await sql`SELECT tech_id FROM lab_technician ORDER BY RANDOM() LIMIT 1;`;
		const techId = tech[0]?.tech_id || 401;

		// Generate IDs
		const nextTestCode =
			await sql`SELECT COALESCE(MAX(test_code), 600) + 1 AS next_code FROM test;`;
		const testCode = nextTestCode[0].next_code;

		// Insert Test
		await sql`
			INSERT INTO test (test_code, test_name, normal_range, test_type, tech_id, appoint_id)
			VALUES (${testCode}, ${testName}, ${
			normalRange || "N/A"
		}, ${testType}, ${techId}, ${appointId});
		`;

		// Create default Test_Result (empty, until lab updates)
		const nextTestId =
			await sql`SELECT COALESCE(MAX(test_id), 700) + 1 AS next_id FROM test_result;`;
		await sql`
			INSERT INTO test_result (test_id, test_code, measured_value, unit, interpretation_flag)
			VALUES (${nextTestId[0].next_id}, ${testCode}, '', '', 'Pending');
		`;

		res.status(201).json({ message: "Test registered successfully" });
	} catch (err) {
		console.error("Error registering test:", err);
		res.status(500).json({ error: "Server error while registering test" });
	}
};
