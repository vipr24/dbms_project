import { useEffect, useState } from "react";

export default function LabTechDash() {
	const [pendingTests, setPendingTests] = useState([]);
	const [completedTests, setCompletedTests] = useState([]);
	const [selectedTest, setSelectedTest] = useState(null);
	const [testResultData, setTestResultData] = useState({
		measured_value: "",
		unit: "",
		interpretation_summary: "",
	});

	const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

	// Fetch tests
	useEffect(() => {
		const token = localStorage.getItem("token");

		fetch(`${BACKEND_URL}/lab-tech/dashboard`, {
			headers: { Authorization: `Bearer ${token}` },
		})
			.then((res) => res.json())
			.then((data) => {
				setPendingTests(data.pendingTests || []);
				setCompletedTests(data.completedTests || []);
			})
			.catch((err) =>
				console.error("Error fetching lab dashboard:", err)
			);
	}, []);

	const handleChange = (e) => {
		setTestResultData({
			...testResultData,
			[e.target.name]: e.target.value,
		});
	};

	const handleSubmitResult = async (e) => {
		e.preventDefault();
		if (!selectedTest) return;

		try {
			const token = localStorage.getItem("token");
			const res = await fetch(
				`${BACKEND_URL}/lab-tech/tests/${selectedTest.test_history_id}/submit`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify(testResultData),
				}
			);

			const data = await res.json();
			if (res.ok) {
				alert("Test result submitted successfully!");
				setPendingTests(
					pendingTests.filter(
						(t) =>
							t.test_history_id !== selectedTest.test_history_id
					)
				);
				setCompletedTests([...completedTests, data.testResult]);
				setSelectedTest(null);
				setTestResultData({
					measured_value: "",
					unit: "",
					interpretation_summary: "",
				});
			} else {
				alert(data.message || "Error submitting test result.");
			}
		} catch (err) {
			console.error("Error submitting test result:", err);
		}
	};

	return (
		<div className="p-8 bg-gray-50 min-h-screen flex flex-col md:flex-row gap-6">
			{/* Pending Tests */}
			<div className="flex-1 bg-white p-5 shadow-md rounded-2xl">
				<h2 className="text-xl font-bold mb-3">Pending Lab Tests</h2>
				{pendingTests.length === 0 ? (
					<p className="text-gray-600">No pending tests.</p>
				) : (
					<table className="w-full text-left border rounded-xl overflow-hidden">
						<thead>
							<tr className="bg-gray-200 text-gray-700">
								<th className="p-2">Patient Name</th>
								<th className="p-2">Test Name</th>
								<th className="p-2 text-center">Action</th>
							</tr>
						</thead>
						<tbody>
							{pendingTests.map((t) => (
								<tr
									key={t.test_history_id}
									className="border-t hover:bg-gray-50"
								>
									<td className="p-2">{t.patient_name}</td>
									<td className="p-2">{t.test_name}</td>
									<td className="p-2 text-center">
										<button
											onClick={() => setSelectedTest(t)}
											className="text-blue-600 hover:underline font-medium"
										>
											Fill Result
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				)}

				{/* Test Result Modal */}
				{selectedTest && (
					<div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
						<div className="bg-white p-6 rounded-2xl w-full max-w-md shadow-lg relative">
							<h3 className="text-xl font-semibold mb-4">
								Submit Result for {selectedTest.test_name} (
								{selectedTest.patient_name})
							</h3>

							<form
								onSubmit={handleSubmitResult}
								className="space-y-3"
							>
								<div>
									<label className="block mb-1">
										Measured Value
									</label>
									<input
										type="text"
										name="measured_value"
										value={testResultData.measured_value}
										onChange={handleChange}
										required
										className="w-full border p-2 rounded"
									/>
								</div>

								<div>
									<label className="block mb-1">Unit</label>
									<input
										type="text"
										name="unit"
										value={testResultData.unit}
										onChange={handleChange}
										className="w-full border p-2 rounded"
									/>
								</div>

								<div>
									<label className="block mb-1">
										Interpretation Summary
									</label>
									<textarea
										name="interpretation_summary"
										value={
											testResultData.interpretation_summary
										}
										onChange={handleChange}
										required
										className="w-full border p-2 rounded"
									/>
								</div>

								<div className="flex justify-end gap-3 mt-3">
									<button
										type="button"
										onClick={() => setSelectedTest(null)}
										className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
									>
										Cancel
									</button>
									<button
										type="submit"
										className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
									>
										Submit
									</button>
								</div>
							</form>
						</div>
					</div>
				)}
			</div>

			{/* Completed Tests */}
			<div className="w-80 bg-white p-5 shadow-md rounded-2xl">
				<h2 className="text-xl font-bold mb-3">Completed Tests</h2>
				{completedTests.length === 0 ? (
					<p className="text-gray-600">No completed tests yet.</p>
				) : (
					<ul className="space-y-2">
						{completedTests.map((t) => (
							<li key={t.result_id} className="border-b pb-2">
								<p className="font-medium">{t.test_name}</p>
								<p className="text-gray-600 text-sm">
									Patient: {t.patient_name}
								</p>
							</li>
						))}
					</ul>
				)}
			</div>
		</div>
	);
}
