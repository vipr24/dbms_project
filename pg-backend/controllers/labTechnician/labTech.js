import { pool } from "../../config/dbConfig.js";

// 1️⃣ Fetch Lab Technician Dashboard (all NOT DONE tests)
export const getLabTechDashboard = async (req, res) => {
	try {
		// Fetch pending tests
		const pendingRes = await pool.query(
			`SELECT th.test_history_id, th.test_code, t.test_name, a.patient_id, p.name AS patient_name
       FROM test_history th
       JOIN test t ON th.test_code = t.test_code
       JOIN appointment a ON th.appoint_id = a.appoint_id
       JOIN patient p ON a.patient_id = p.patient_id
       WHERE th.test_completion = 'NOT DONE'
       ORDER BY a.date, a.time`
		);

		// Fetch completed tests
		const completedRes = await pool.query(
			`SELECT tr.result_id, tr.test_code, t.test_name, a.patient_id, p.name AS patient_name
       FROM test_result tr
       JOIN test t ON tr.test_code = t.test_code
       JOIN test_history th ON tr.test_history_id = th.test_history_id
       JOIN appointment a ON th.appoint_id = a.appoint_id
       JOIN patient p ON a.patient_id = p.patient_id
       ORDER BY a.date, a.time`
		);

		res.status(200).json({
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
	const { test_history_id } = req.params;
	const { measured_value, unit, interpretation_summary } = req.body;

	try {
		// Get related test_history info
		const thRes = await pool.query(
			"SELECT test_code, appoint_id FROM test_history WHERE test_history_id = $1",
			[test_history_id]
		);
		if (thRes.rows.length === 0)
			return res.status(404).json({ message: "Test not found" });

		const { test_code, appoint_id } = thRes.rows[0];

		// Get patient_id from appointment
		const patientRes = await pool.query(
			"SELECT patient_id FROM appointment WHERE appoint_id = $1",
			[appoint_id]
		);
		if (patientRes.rows.length === 0)
			return res
				.status(404)
				.json({ message: "No patient for appointment" });

		const { patient_id } = patientRes.rows[0];

		// 🔍 Check if report exists for this appointment
		let report_id;
		const reportRes = await pool.query(
			"SELECT report_id FROM report WHERE appoint_id = $1",
			[appoint_id]
		);

		if (reportRes.rows.length > 0) {
			report_id = reportRes.rows[0].report_id;
		} else {
			// 🆕 Create new report for this appointment
			const newReport = await pool.query(
				`INSERT INTO report (patient_id, appoint_id, report_date, approval_status)
         VALUES ($1, $2, CURRENT_DATE, 'Pending')
         RETURNING report_id`,
				[patient_id, appoint_id]
			);
			report_id = newReport.rows[0].report_id;
		}

		// 🧪 Insert result and link it
		const insertRes = await pool.query(
			`INSERT INTO test_result 
       (measured_value, unit, interpretation_summary, test_code, test_history_id, report_id)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
			[
				measured_value,
				unit,
				interpretation_summary,
				test_code,
				test_history_id,
				report_id,
			]
		);

		// ✅ Mark test as DONE
		await pool.query(
			"UPDATE test_history SET test_completion = 'DONE' WHERE test_history_id = $1",
			[test_history_id]
		);

		res.status(201).json({
			message: "Test result submitted and linked to appointment report",
			testResult: insertRes.rows[0],
		});
	} catch (err) {
		console.error("Error submitting test result:", err);
		res.status(500).json({ message: "Error submitting test result" });
	}
};
