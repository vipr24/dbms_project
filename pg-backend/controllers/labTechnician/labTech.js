import { pool } from "../../config/dbConfig.js";

// 1️⃣ Fetch Lab Technician Dashboard
export const getLabTechDashboard = async (req, res) => {
	const techId = req.params.techId; // get techId from params

	try {
		// Fetch pending tests
		const pendingRes = await pool.query(
			`SELECT th.test_history_id, th.test_code, t.test_name, a.patient_id, p.name AS patient_name
       FROM test_history th
       JOIN test t ON th.test_code = t.test_code
       JOIN appointment a ON th.appoint_id = a.appoint_id
       JOIN patient p ON a.patient_id = p.patient_id
       WHERE th.tech_id = $1 AND th.test_completion = 'NOT DONE'`,
			[techId]
		);

		// Fetch completed tests
		const completedRes = await pool.query(
			`SELECT tr.result_id, tr.test_code, t.test_name, a.patient_id, p.name AS patient_name
       FROM test_result tr
       JOIN test t ON tr.test_code = t.test_code
       JOIN test_history th ON tr.test_history_id = th.test_history_id
       JOIN appointment a ON th.appoint_id = a.appoint_id
       JOIN patient p ON a.patient_id = p.patient_id
       WHERE tr.tech_id = $1`,
			[techId]
		);

		// Fetch lab tech info
		const labTechRes = await pool.query(
			"SELECT tech_id, name, contact_no FROM lab_technician WHERE tech_id = $1",
			[techId]
		);

		res.status(200).json({
			labTech: labTechRes.rows[0],
			pendingTests: pendingRes.rows,
			completedTests: completedRes.rows,
		});
	} catch (err) {
		console.error(err);
		res.status(500).json({
			message: "Error fetching lab technician dashboard",
		});
	}
};

// 2️⃣ Submit Test Result
export const submitTestResult = async (req, res) => {
	const techId = req.params.techId; // get techId from params
	const { test_history_id } = req.params;
	const { measured_value, unit, interpretation_summary } = req.body;

	try {
		// Get related test_history info (test_code, appoint_id)
		const thRes = await pool.query(
			"SELECT test_code, appoint_id FROM test_history WHERE test_history_id = $1 AND tech_id = $2",
			[test_history_id, techId]
		);

		if (thRes.rows.length === 0) {
			return res.status(404).json({
				message: "Test not found or not assigned to this technician",
			});
		}

		const { test_code, appoint_id } = thRes.rows[0];

		// Get report_id for this appointment
		const reportRes = await pool.query(
			"SELECT report_id FROM report WHERE patient_id = (SELECT patient_id FROM appointment WHERE appoint_id = $1)",
			[appoint_id]
		);

		const report_id = reportRes.rows.length
			? reportRes.rows[0].report_id
			: null;

		// Insert into test_result
		const insertRes = await pool.query(
			`INSERT INTO test_result 
       (measured_value, unit, interpretation_summary, test_code, test_history_id, report_id, tech_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
			[
				measured_value,
				unit,
				interpretation_summary,
				test_code,
				test_history_id,
				report_id,
				techId,
			]
		);

		// Update test_history as DONE
		await pool.query(
			"UPDATE test_history SET test_completion = 'DONE' WHERE test_history_id = $1",
			[test_history_id]
		);

		res.status(201).json({
			message: "Test result submitted",
			testResult: insertRes.rows[0],
		});
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: "Error submitting test result" });
	}
};
