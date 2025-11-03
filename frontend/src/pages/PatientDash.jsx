import { useEffect, useState } from "react";

export default function PatientDashboard() {
	const [patient, setPatient] = useState(null);
	const [appointments, setAppointments] = useState([]);
	const [reports, setReports] = useState([]);
	const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

	useEffect(() => {
		const token = localStorage.getItem("token");
		fetch(`${BACKEND_URL}/patient`, {
			headers: { Authorization: `Bearer ${token}` },
		})
			.then((res) => res.json())
			.then((data) => {
				setPatient(data.patient);
				setAppointments(data.appointments);
				setReports(data.reports);
			})
			.catch((err) => console.error("Error:", err));
	}, []);

	if (!patient) return <p className="text-center mt-10">Loading...</p>;

	return (
		<div className="p-8">
			<h1 className="text-3xl font-semibold text-green-700 mb-6">
				Welcome, {patient.name}
			</h1>
			<div className="bg-white p-4 shadow rounded-2xl mb-6">
				<h2 className="text-xl font-bold">Your Details</h2>
				<p>Blood Group: {patient.blood_group}</p>
				<p>Gender: {patient.gender}</p>
				<p>Contact: {patient.contact_no}</p>
				<p>Email: {patient.email}</p>
			</div>

			<div className="bg-white p-4 shadow rounded-2xl mb-6">
				<h2 className="text-xl font-bold mb-3">Appointments</h2>
				{appointments.length === 0 ? (
					<p>No appointments found.</p>
				) : (
					<ul className="list-disc ml-5">
						{appointments.map((a) => (
							<li key={a.appoint_id}>
								{a.date} at {a.time}
							</li>
						))}
					</ul>
				)}
			</div>

			<div className="bg-white p-4 shadow rounded-2xl">
				<h2 className="text-xl font-bold mb-3">Reports</h2>
				{reports.length === 0 ? (
					<p>No reports available.</p>
				) : (
					<table className="w-full text-left border">
						<thead>
							<tr className="bg-gray-200">
								<th className="p-2">Date</th>
								<th className="p-2">Status</th>
								<th className="p-2">Interpretation</th>
							</tr>
						</thead>
						<tbody>
							{reports.map((r) => (
								<tr key={r.r_id} className="border-t">
									<td className="p-2">{r.r_date}</td>
									<td className="p-2">{r.approval_status}</td>
									<td className="p-2">
										{r.interpretation_flag}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				)}
			</div>
		</div>
	);
}
