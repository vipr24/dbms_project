import { useEffect, useState } from "react";

export default function DoctorDashboard() {
	const [doctor, setDoctor] = useState(null);
	const [patients, setPatients] = useState([]);
	const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

	useEffect(() => {
		const token = localStorage.getItem("token");
		fetch(`${BACKEND_URL}/doctor`, {
			headers: { Authorization: `Bearer ${token}` },
		})
			.then((res) => res.json())
			.then((data) => {
				setDoctor(data.doctor);
				setPatients(data.patients);
			})
			.catch((err) => console.error("Error:", err));
	}, []);

	if (!doctor) return <p className="text-center mt-10">Loading...</p>;

	return (
		<div className="p-8">
			<h1 className="text-3xl font-semibold text-blue-700 mb-6">
				Welcome, {doctor.name}
			</h1>
			<div className="bg-white p-4 shadow rounded-2xl mb-6">
				<h2 className="text-xl font-bold">Doctor Details</h2>
				<p>Specialization: {doctor.specialization}</p>
				<p>Department: {doctor.dept_name}</p>
				<p>Phone: {doctor.phone_no}</p>
				<p>Email: {doctor.email}</p>
			</div>

			<div className="bg-white p-4 shadow rounded-2xl">
				<h2 className="text-xl font-bold mb-3">Patients Assigned</h2>
				<table className="w-full text-left border">
					<thead>
						<tr className="bg-gray-200">
							<th className="p-2">Name</th>
							<th className="p-2">Gender</th>
							<th className="p-2">Blood Group</th>
							<th className="p-2">Contact</th>
						</tr>
					</thead>
					<tbody>
						{patients.map((p) => (
							<tr key={p.patient_id} className="border-t">
								<td className="p-2">{p.name}</td>
								<td className="p-2">{p.gender}</td>
								<td className="p-2">{p.blood_group}</td>
								<td className="p-2">{p.contact_no}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}
