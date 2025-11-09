import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

export default function DoctorDashboard() {
	const [doctor, setDoctor] = useState(null);
	const [patients, setPatients] = useState([]);
	const [selectedPatient, setSelectedPatient] = useState(null);
	const [appointments, setAppointments] = useState([]);
	const [availableTests, setAvailableTests] = useState([]);
	const [selectedTests, setSelectedTests] = useState([]);
	const [modalOpen, setModalOpen] = useState(false);
	const [selectedAppointment, setSelectedAppointment] = useState(null);

	const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
	const navigate = useNavigate();

	useEffect(() => {
		const token = localStorage.getItem("token");
		if (!token) return;

		// Fetch doctor info + assigned patients via appointments
		fetch(`${BACKEND_URL}/doctor/dashboard`, {
			headers: { Authorization: `Bearer ${token}` },
		})
			.then((res) => res.json())
			.then((data) => {
				setDoctor(data.doctor);
				setPatients(data.patients || []);
				setAppointments(data.appointments || []);
			})
			.catch((err) =>
				console.error("Error fetching doctor dashboard:", err)
			);

		// Fetch available tests
		fetch(`${BACKEND_URL}/tests`)
			.then((res) => res.json())
			.then((data) => setAvailableTests(data))
			.catch((err) => console.error("Error fetching tests:", err));
	}, []);

	// Open modal to request tests for a specific appointment
	const handleRequestTests = (patient, appointment) => {
		setSelectedPatient(patient);
		setSelectedAppointment(appointment);
		setSelectedTests([]);
		setModalOpen(true);
	};

	const submitTestRequest = async () => {
		const token = localStorage.getItem("token");
		if (!selectedAppointment || selectedTests.length === 0) return;

		try {
			const res = await fetch(`${BACKEND_URL}/test/request`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({
					appointId: selectedAppointment.appoint_id,
					tests: selectedTests, // array of test_code
				}),
			});

			const data = await res.json();
			alert(data.message || "Tests requested successfully");
			setModalOpen(false);
		} catch (err) {
			console.error("Error requesting tests:", err);
		}
	};

	if (!doctor)
		return (
			<p className="text-center mt-10 text-gray-600">Please login...</p>
		);

	return (
		<div className="p-8 bg-gray-50 min-h-screen">
			<h1 className="text-3xl font-semibold text-blue-700 mb-6 w-[95vw] flex justify-between">
				Welcome, Dr. {doctor.name}
				<button
					onClick={() => {
						localStorage.removeItem("token");
						navigate("/");
					}}
					className="p-2 bg-red-500 text-xl text-red-300 rounded"
				>
					Logout
				</button>
			</h1>

			{/* Patients Table */}
			<div className="bg-white p-5 shadow-md rounded-2xl">
				<h2 className="text-xl font-bold mb-3">My Patients</h2>

				{patients.length === 0 ? (
					<p className="text-gray-600">No patients assigned yet.</p>
				) : (
					<table className="w-full text-left border rounded-xl overflow-hidden">
						<thead>
							<tr className="bg-gray-200 text-gray-700">
								<th className="p-2">Name</th>
								<th className="p-2">Gender</th>
								<th className="p-2">Contact</th>
								<th className="p-2">Appointment Date</th>
								<th className="p-2">Appointment Time</th>
								<th className="p-2 text-center">Action</th>
							</tr>
						</thead>
						<tbody>
							{appointments.map((a) => {
								const patient = patients.find(
									(p) => p.patient_id === a.patient_id
								);
								if (!patient) return null;

								return (
									<tr
										key={a.appoint_id}
										className="border-t hover:bg-gray-50"
									>
										<td className="p-2">{patient.name}</td>
										<td className="p-2">
											{patient.gender}
										</td>
										<td className="p-2">
											{patient.contact_no}
										</td>
										<td className="p-2">{a.date}</td>
										<td className="p-2">{a.time}</td>
										<td className="p-2 text-center">
											<button
												onClick={() =>
													handleRequestTests(
														patient,
														a
													)
												}
												className="text-blue-600 hover:underline font-medium"
											>
												Request Tests
											</button>
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				)}
			</div>

			{/* Test Request Modal */}
			{modalOpen && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
					<div className="bg-white p-6 rounded-2xl w-96">
						<h3 className="text-xl font-semibold mb-4">
							Request Tests for {selectedPatient.name}
						</h3>

						<div className="max-h-64 overflow-y-auto mb-4">
							{availableTests.map((t) => (
								<div key={t.test_code} className="mb-2">
									<label className="flex items-center space-x-2">
										<input
											type="checkbox"
											value={t.test_code}
											checked={selectedTests.includes(
												t.test_code
											)}
											onChange={(e) => {
												const code = t.test_code;
												if (e.target.checked) {
													setSelectedTests((prev) => [
														...prev,
														code,
													]);
												} else {
													setSelectedTests((prev) =>
														prev.filter(
															(x) => x !== code
														)
													);
												}
											}}
										/>
										<span>
											{t.test_name} — {t.test_type}
										</span>
									</label>
								</div>
							))}
						</div>

						<div className="flex justify-end space-x-2">
							<button
								onClick={() => setModalOpen(false)}
								className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
							>
								Cancel
							</button>
							<button
								onClick={submitTestRequest}
								className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
							>
								Request
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
