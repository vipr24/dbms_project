import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

export default function PatientDashboard() {
	const [patient, setPatient] = useState(null);
	const [appointments, setAppointments] = useState([]);
	const [tests, setTests] = useState([]);
	const [doctors, setDoctors] = useState([]);
	const [availableTests, setAvailableTests] = useState([]);

	const [appointmentForm, setAppointmentForm] = useState({
		doctorId: "",
		date: "",
		time: "",
	});

	const [testForm, setTestForm] = useState({
		testCode: "",
	});

	const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
	const navigate = useNavigate();

	useEffect(() => {
		const token = localStorage.getItem("token");
		if (!token) return;

		// Fetch patient personal data + their appointments/tests
		fetch(`${BACKEND_URL}/patient`, {
			headers: { Authorization: `Bearer ${token}` },
		})
			.then((res) => res.json())
			.then((data) => {
				setPatient(data.patient);
				setAppointments(data.appointments || []);
				setTests(data.tests || []);
			});

		// Fetch available doctors
		fetch(`${BACKEND_URL}/doctors`)
			.then((res) => res.json())
			.then((data) => setDoctors(data));

		// Fetch available test types
		fetch(`${BACKEND_URL}/tests`)
			.then((res) => res.json())
			.then((data) => setAvailableTests(data));
	}, []);

	//Handlers
	const handleAppointmentSubmit = async (e) => {
		e.preventDefault();
		const token = localStorage.getItem("token");

		const res = await fetch(`${BACKEND_URL}/appointment/book`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(appointmentForm),
		});

		const data = await res.json();
		alert(data.message || data.error);
	};

	const handleTestSubmit = async (e) => {
		e.preventDefault();
		const token = localStorage.getItem("token");
		const selectedTest = availableTests.find(
			(t) => t.test_code === parseInt(testForm.testCode)
		);

		const res = await fetch(`${BACKEND_URL}/test/register`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({
				testName: selectedTest.test_name,
				testType: selectedTest.test_type,
				normalRange: selectedTest.normal_range,
			}),
		});

		const data = await res.json();
		alert(data.message || data.error);
	};

	if (!patient)
		return (
			<p className="text-center mt-10 text-gray-600">Please login...</p>
		);

	return (
		<div className="p-8 bg-gray-50 min-h-screen">
			<h1 className="text-3xl font-bold mb-6 text-center text-blue-700 w-[96vw] flex justify-between">
				Patient Dashboard
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

			{/* Patient Info */}
			{patient && (
				<div className="bg-white shadow-lg rounded-2xl p-6 mb-6">
					<h2 className="text-xl font-semibold mb-4 text-gray-700">
						My Details
					</h2>
					<p>
						<b>Name:</b> {patient.name}
					</p>
					<p>
						<b>Gender:</b> {patient.gender}
					</p>
					<p>
						<b>Phone:</b> {patient.contact_no}
					</p>
					<p>
						<b>Email:</b> {patient.email}
					</p>
				</div>
			)}

			{/* Appointments */}
			<div className="bg-white shadow-lg rounded-2xl p-6 mb-6">
				<h2 className="text-xl font-semibold mb-4 text-gray-700">
					My Appointments
				</h2>
				{appointments.length > 0 ? (
					<ul className="list-disc pl-5">
						{appointments.map((a) => (
							<li key={a.appoint_id}>
								{a.date} at {a.time}
							</li>
						))}
					</ul>
				) : (
					<p className="text-gray-500">No appointments yet.</p>
				)}
			</div>

			{/* Tests */}
			<div className="bg-white shadow-lg rounded-2xl p-6 mb-6">
				<h2 className="text-xl font-semibold mb-4 text-gray-700">
					My Tests
				</h2>
				{tests.length > 0 ? (
					<table className="w-full border">
						<thead>
							<tr className="bg-blue-100">
								<th className="p-2 border">Test Name</th>
								<th className="p-2 border">Result</th>
								<th className="p-2 border">Status</th>
							</tr>
						</thead>
						<tbody>
							{tests.map((t) => (
								<tr key={t.test_code}>
									<td className="p-2 border">
										{t.test_name}
									</td>
									<td className="p-2 border">
										{t.measured_value || "—"}
									</td>
									<td className="p-2 border">
										{t.interpretation_flag}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				) : (
					<p className="text-gray-500">No test history available.</p>
				)}
			</div>

			{/* --- Book Appointment Form --- */}
			<div className="bg-white shadow-lg rounded-2xl p-6 mb-6">
				<h2 className="text-xl font-semibold mb-4 text-gray-700">
					Book Appointment
				</h2>
				<form onSubmit={handleAppointmentSubmit} className="space-y-4">
					<div>
						<label className="block font-medium mb-1">
							Doctor:
						</label>
						<select
							className="border rounded p-2 w-full"
							value={appointmentForm.doctorId}
							onChange={(e) =>
								setAppointmentForm({
									...appointmentForm,
									doctorId: e.target.value,
								})
							}
							required
						>
							<option value="">Select Doctor</option>
							{doctors.map((d) => (
								<option key={d.doctor_id} value={d.doctor_id}>
									{d.name} — {d.specialization}
								</option>
							))}
						</select>
					</div>
					<div>
						<label className="block font-medium mb-1">Date:</label>
						<input
							type="date"
							className="border rounded p-2 w-full"
							value={appointmentForm.date}
							onChange={(e) =>
								setAppointmentForm({
									...appointmentForm,
									date: e.target.value,
								})
							}
							required
						/>
					</div>
					<div>
						<label className="block font-medium mb-1">Time:</label>
						<input
							type="time"
							className="border rounded p-2 w-full"
							value={appointmentForm.time}
							onChange={(e) =>
								setAppointmentForm({
									...appointmentForm,
									time: e.target.value,
								})
							}
							required
						/>
					</div>
					<button
						type="submit"
						className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl"
					>
						Book Appointment
					</button>
				</form>
			</div>

			{/* --- Request Test Form --- */}
			<div className="bg-white shadow-lg rounded-2xl p-6">
				<h2 className="text-xl font-semibold mb-4 text-gray-700">
					Request a Test
				</h2>
				<form onSubmit={handleTestSubmit} className="space-y-4">
					<div>
						<label className="block font-medium mb-1">
							Select Test:
						</label>
						<select
							className="border rounded p-2 w-full"
							value={testForm.testCode}
							onChange={(e) =>
								setTestForm({
									...testForm,
									testCode: e.target.value,
								})
							}
							required
						>
							<option value="">Select Test</option>
							{availableTests.map((t) => (
								<option key={t.test_code} value={t.test_code}>
									{t.test_name} — {t.test_type}
								</option>
							))}
						</select>
					</div>

					<button
						type="submit"
						className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl"
					>
						Request Test
					</button>
				</form>
			</div>
		</div>
	);
}
