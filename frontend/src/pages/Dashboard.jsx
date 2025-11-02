import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

const Dashboard = () => {
	const navigate = useNavigate();
	const [user, setUser] = useState(null);
	const [message, setMessage] = useState("");

	useEffect(() => {
		const token = localStorage.getItem("token");
		const userData = localStorage.getItem("user");

		// if (!token || !userData) {
		//   navigate("/");
		//   return;
		// }

		const parsedUser = JSON.parse(userData);
		setUser(parsedUser);

		fetch("http://localhost:3000/dashboard", {
			headers: { Authorization: `Bearer ${token}` },
		})
			.then(async (res) => {
				if (res.status === 401) {
					localStorage.clear();
					navigate("/");
				} else {
					const data = await res.json();
					setMessage(data.message);
				}
			})
			.catch(() => {
				setMessage("Error verifying session.");
			});
	}, [navigate]);

	const handleLogout = () => {
		localStorage.clear();
		navigate("/");
	};

	if (!user)
		return <p className="text-center mt-10 text-gray-600">Loading...</p>;

	return (
		<div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100 p-4">
			<div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-lg">
				<h1 className="text-3xl font-semibold text-center text-indigo-700 mb-2">
					Welcome, {user.name} 👋
				</h1>
				<p className="text-center text-gray-500 mb-6">{message}</p>

				{/* Doctor Dashboard */}
				{user.role === "doctor" ? (
					<div className="space-y-4">
						<h2 className="text-xl font-bold text-gray-800 border-b pb-2">
							Doctor Dashboard
						</h2>
						<div className="space-y-1 text-gray-700">
							<p>
								<span className="font-semibold">Email:</span>{" "}
								{user.email}
							</p>
							<p>
								<span className="font-semibold">Phone:</span>{" "}
								{user.phone}
							</p>
							<p>
								<span className="font-semibold">
									Specialization:
								</span>{" "}
								{user.specialization || "General Medicine"}
							</p>
							<p>
								<span className="font-semibold">
									Department ID:
								</span>{" "}
								{user.dept_id || "DPT1001"}
							</p>
						</div>

						<h3 className="mt-6 text-lg font-semibold text-gray-800">
							Patients under you:
						</h3>
						<ul className="list-disc list-inside text-gray-700 space-y-1">
							<li>John Doe — Blood Group: O+</li>
							<li>Jane Smith — Blood Group: A-</li>
							<li>Ravi Patel — Blood Group: B+</li>
						</ul>
					</div>
				) : (
					// Patient Dashboard
					<div className="space-y-4">
						<h2 className="text-xl font-bold text-gray-800 border-b pb-2">
							Patient Dashboard
						</h2>
						<div className="space-y-1 text-gray-700">
							<p>
								<span className="font-semibold">Email:</span>{" "}
								{user.email}
							</p>
							<p>
								<span className="font-semibold">Phone:</span>{" "}
								{user.phone}
							</p>
							<p>
								<span className="font-semibold">
									Blood Group:
								</span>{" "}
								{user.bloodGroup || "Not provided"}
							</p>
							<p>
								<span className="font-semibold">
									Registered on:
								</span>{" "}
								{user.dateOfRegistration || "N/A"}
							</p>
							<p>
								<span className="font-semibold">Address:</span>{" "}
								{user.address || "N/A"}
							</p>
							<p>
								<span className="font-semibold">DOB:</span>{" "}
								{user.dob || "N/A"}
							</p>
						</div>
					</div>
				)}

				<div className="mt-8 text-center">
					<button
						onClick={handleLogout}
						className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-200 shadow-md"
					>
						Logout
					</button>
				</div>
			</div>
		</div>
	);
};

export default Dashboard;
