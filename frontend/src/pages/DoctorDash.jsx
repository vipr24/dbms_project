import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

export default function DoctorDashboard() {
	const [doctor, setDoctor] = useState(null);
	const [patients, setPatients] = useState([]);
	const [selectedPatient, setSelectedPatient] = useState(null);
	const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
	const navigate = useNavigate();

	useEffect(() => {
		const token = localStorage.getItem("token");
		fetch(`${BACKEND_URL}/doctor`, {
			headers: { Authorization: `Bearer ${token}` },
		})
			.then((res) => res.json())
			.then((data) => {
				setDoctor(data.doctor);
				setPatients(data.patients || []);
			})
			.catch((err) =>
				console.error("Error fetching doctor dashboard:", err)
			);
	}, []);

	const togglePatientDetails = async (patientId) => {
		if (selectedPatient?.patient_id === patientId) {
			setSelectedPatient(null); // close if same patient clicked again
			return;
		}

		try {
			const token = localStorage.getItem("token");
			const res = await fetch(
				`${BACKEND_URL}/doctor/patient/${patientId}`,
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);
			const data = await res.json();
			setSelectedPatient({
				...data.patient,
				tests: data.tests || [],
				prescriptions: data.prescriptions || [],
			});
		} catch (err) {
			console.error("Error fetching patient details:", err);
		}
	};

	if (!doctor)
		return <p className="text-center mt-10 text-gray-600">Please login...</p>;

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

			{/* Doctor Info */}
			<div className="bg-white p-5 shadow-md rounded-2xl mb-8">
				<h2 className="text-xl font-bold mb-2">Doctor Details</h2>
				<div className="grid md:grid-cols-2 gap-3 text-gray-700">
					<p>
						<strong>Specialization:</strong> {doctor.specialization}
					</p>
					<p>
						<strong>Department:</strong> {doctor.dept_name}
					</p>
					<p>
						<strong>Phone:</strong> {doctor.phone_no}
					</p>
					<p>
						<strong>Email:</strong> {doctor.email}
					</p>
				</div>
			</div>

			{/* Patients Table */}
			<div className="bg-white p-5 shadow-md rounded-2xl">
				<h2 className="text-xl font-bold mb-3">Assigned Patients</h2>

				{patients.length === 0 ? (
					<p className="text-gray-600">No patients assigned yet.</p>
				) : (
					<table className="w-full text-left border rounded-xl overflow-hidden">
						<thead>
							<tr className="bg-gray-200 text-gray-700">
								<th className="p-2">Name</th>
								<th className="p-2">Gender</th>
								<th className="p-2">Blood Group</th>
								<th className="p-2">Contact</th>
								<th className="p-2 text-center">Action</th>
							</tr>
						</thead>
						<tbody>
							{patients.map((p) => (
								<tr
									key={p.patient_id}
									className="border-t hover:bg-gray-50"
								>
									<td className="p-2">{p.name}</td>
									<td className="p-2">{p.gender}</td>
									<td className="p-2">{p.blood_group}</td>
									<td className="p-2">{p.contact_no}</td>
									<td className="p-2 text-center">
										<button
											onClick={() =>
												togglePatientDetails(
													p.patient_id
												)
											}
											className="text-blue-600 hover:underline font-medium"
										>
											View Details
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				)}
			</div>

			{/* Expanded Patient Details */}
			{selectedPatient && (
				<div className="mt-8 bg-white shadow-md rounded-2xl p-6 border border-gray-200">
					<h3 className="text-2xl font-semibold text-blue-700 mb-4">
						Patient Details — {selectedPatient.name}
					</h3>

					<div className="grid md:grid-cols-2 gap-3 text-gray-700 mb-6">
						<p>
							<strong>Email:</strong>{" "}
							{selectedPatient.email || "N/A"}
						</p>
						<p>
							<strong>Gender:</strong> {selectedPatient.gender}
						</p>
						<p>
							<strong>Blood Group:</strong>{" "}
							{selectedPatient.blood_group}
						</p>
						<p>
							<strong>Contact:</strong>{" "}
							{selectedPatient.contact_no}
						</p>
						<p>
							<strong>Address:</strong> {selectedPatient.address}
						</p>
						<p>
							<strong>DOB:</strong>{" "}
							{selectedPatient.date_of_birth}
						</p>
					</div>

					{/* Tests */}
					<div className="mb-6">
						<h4 className="text-lg font-semibold text-gray-800 mb-2">
							Tests Taken
						</h4>
						{selectedPatient.tests?.length > 0 ? (
							<table className="w-full border text-left rounded-lg">
								<thead>
									<tr className="bg-gray-100 text-gray-700">
										<th className="p-2">Test Name</th>
										<th className="p-2">Test Type</th>
										<th className="p-2">Test Results</th>
									</tr>
								</thead>
								<tbody>
									{selectedPatient.tests.map((t, idx) => (
										<tr
											key={idx}
											className="border-t hover:bg-gray-50"
										>
											<td className="p-2">
												{t.test_name}
											</td>
											<td className="p-2">{t.test_type}</td>
											<td className="p-2">{t.measured_value}</td>
										</tr>
									))}
								</tbody>
							</table>
						) : (
							<p className="text-gray-600">
								No tests found for this patient.
							</p>
						)}
					</div>

					{/* Prescriptions */}
					<div>
						<h4 className="text-lg font-semibold text-gray-800 mb-2">
							Prescriptions
						</h4>
						{selectedPatient.prescriptions?.length > 0 ? (
							<table className="w-full border text-left rounded-lg">
								<thead>
									<tr className="bg-gray-100 text-gray-700">
										<th className="p-2">Medicine</th>
										<th className="p-2">Dosage</th>
										<th className="p-2">Duration</th>
									</tr>
								</thead>
								<tbody>
									{selectedPatient.prescriptions.map(
										(pr, idx) => (
											<tr
												key={idx}
												className="border-t hover:bg-gray-50"
											>
												<td className="p-2">
													{pr.medicine_name}
												</td>
												<td className="p-2">
													{pr.dosage}
												</td>
												<td className="p-2">
													{pr.duration}
												</td>
											</tr>
										)
									)}
								</tbody>
							</table>
						) : (
							<p className="text-gray-600">
								No prescriptions available.
							</p>
						)}
					</div>
				</div>
			)}
		</div>
	);
}
