import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

export default function PatientDashboard() {
	const [patient, setPatient] = useState(null);
	const [appointments, setAppointments] = useState([]);
	const [doctors, setDoctors] = useState([]);
	const [modalOpen, setModalOpen] = useState(false);
	const [prescriptions, setPrescriptions] = useState([]);

	const [appointmentForm, setAppointmentForm] = useState({
		doctorId: "",
		date: "",
		time: "",
	});

	const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
	const navigate = useNavigate();

	// Generate time slots (10:00–17:00, 30-min gap)
	const generateTimeSlots = () => {
		const slots = [];
		let hour = 10;
		let minute = 0;
		while (hour < 17 || (hour === 17 && minute === 0)) {
			const h = hour.toString().padStart(2, "0");
			const m = minute.toString().padStart(2, "0");
			slots.push(`${h}:${m}`);
			minute += 30;
			if (minute === 60) {
				minute = 0;
				hour += 1;
			}
		}
		return slots;
	};

	const timeSlots = generateTimeSlots();

	useEffect(() => {
		const token = localStorage.getItem("token");
		if (!token) return;

		// Fetch patient data and appointments
		fetch(`${BACKEND_URL}/patient`, {
			headers: { Authorization: `Bearer ${token}` },
		})
			.then((res) => res.json())
			.then((data) => {
				setPatient(data.patient);
				setAppointments(data.appointments || []);
			});

		// Fetch doctors
		fetch(`${BACKEND_URL}/doctors`)
			.then((res) => res.json())
			.then((data) => setDoctors(data));
	}, []);

	// Fetch prescriptions when modal opens
	const fetchPrescriptions = async () => {
		if (!patient) return;
		const token = localStorage.getItem("token");
		try {
			const res = await fetch(
				`${BACKEND_URL}/patient/prescriptions/${patient.patient_id}`,
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);
			const data = await res.json();
			setPrescriptions(data || []);
		} catch (err) {
			console.error("Error fetching prescriptions:", err);
		}
	};

	const handlePrescription = async () => {
		setModalOpen(true);
		await fetchPrescriptions();
	};

	const handleAppointmentSubmit = async (e) => {
		e.preventDefault();
		const token = localStorage.getItem("token");
		if (!patient) return;

		const patientId = patient.patient_id;

		const res = await fetch(`${BACKEND_URL}/appointment/book`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({
				patientId,
				doctorId: appointmentForm.doctorId,
				date: appointmentForm.date,
				time: appointmentForm.time,
			}),
		});

		const data = await res.json();
		alert(data.message || data.error);

		if (res.ok && data.appointment) {
			setAppointments((prev) => [...prev, data.appointment]);
		}
	};

	if (!patient)
		return (
			<p className="text-center mt-10 text-gray-600">Please login...</p>
		);

	return (
		<div className="p-8 bg-gray-50 min-h-screen">
			<h1 className="text-3xl font-bold mb-6 text-blue-700 w-[96vw] flex justify-between">
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

			{/* Appointments */}
			<div className="bg-white shadow-lg rounded-2xl p-6 mb-6">
				<h2 className="text-xl font-semibold mb-4 text-gray-700">
					My Appointments
				</h2>
				{appointments.length > 0 ? (
					<ul className="list-disc pl-5 flex w-[85vw] justify-between">
						{appointments.map((a) => (
							<li key={a.appoint_id}>
								{a.date} at {a.time} with Doctor ID:{" "}
								{a.doctor_id}
							</li>
						))}
						<p className="bg-blue-500 text-white p-2 hover:bg-blue-400">
							<button onClick={handlePrescription}>
								View Prescription
							</button>
						</p>
					</ul>
				) : (
					<p className="text-gray-500">No appointments yet.</p>
				)}
			</div>

			{/* Book Appointment */}
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
						<select
							className="border rounded p-2 w-full"
							value={appointmentForm.time}
							onChange={(e) =>
								setAppointmentForm({
									...appointmentForm,
									time: e.target.value,
								})
							}
							required
						>
							<option value="">Select Time</option>
							{timeSlots.map((t) => (
								<option key={t} value={t}>
									{t}
								</option>
							))}
						</select>
					</div>

					<button
						type="submit"
						className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl"
					>
						Book Appointment
					</button>
				</form>
			</div>

			{/* Prescription Modal */}
			{modalOpen && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
					<div className="bg-white rounded-2xl p-6 w-[500px] max-h-[80vh] overflow-y-auto">
						<h3 className="text-xl font-semibold mb-4 text-gray-700">
							My Prescriptions
						</h3>

						{prescriptions.length === 0 ? (
							<p className="text-gray-600">
								No prescriptions available yet.
							</p>
						) : (
							prescriptions.map((p) => (
								<div
									key={p.prescription_id}
									className="border rounded-lg p-4 mb-4 bg-gray-50"
								>
									<p>
										<b>Doctor:</b> {p.doctor_name}
									</p>
									<p>
										<b>Date:</b> {p.date}
									</p>
									<p className="mt-2">
										<b>Notes:</b> {p.notes}
									</p>
								</div>
							))
						)}

						<div className="flex justify-end">
							<button
								onClick={() => setModalOpen(false)}
								className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
							>
								Close
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
