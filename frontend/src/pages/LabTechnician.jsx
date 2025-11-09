import { useState } from "react";
import { useNavigate } from "react-router";

export default function LabTechnicianPortal() {
	const navigate = useNavigate();
	const [isRegistered, setIsRegistered] = useState(null);
	const [contactNo, setContactNo] = useState("");
	const [password, setPassword] = useState("");
	const [formData, setFormData] = useState({
		name: "",
		contactNo: "",
		password: "",
	});

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

		if (isRegistered) {
			// Login
			const response = await fetch(`${BACKEND_URL}/login/lab-tech`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ contactNo, password }),
			});
			const data = await response.json();
			if (response.status === 200) {
				localStorage.setItem("token", data.token);
				navigate("/lab-tech-dash");
			} else {
				alert(data.message || "Login failed");
			}
		} else {
			// Registration
			const response = await fetch(`${BACKEND_URL}/register/lab-tech`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			});
			const data = await response.json();
			if (response.ok) {
				localStorage.setItem("token", data.token);
				navigate("/lab-tech-dash");
			} else {
				alert(data.message || "Registration failed");
			}
		}
	};

	return (
		<div className="min-h-screen bg-gray-50 p-8 flex flex-col items-center">
			<h2 className="text-2xl font-bold mb-6">Lab Technician Portal</h2>

			{isRegistered === null && (
				<div className="space-x-6">
					<button
						onClick={() => setIsRegistered(true)}
						className="px-6 py-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700"
					>
						Already Registered
					</button>
					<button
						onClick={() => setIsRegistered(false)}
						className="px-6 py-3 bg-green-600 text-white rounded-2xl hover:bg-green-700"
					>
						New Registration
					</button>
				</div>
			)}

			{isRegistered === true && (
				<div className="mt-8 bg-white p-6 rounded-2xl shadow-md w-full max-w-md">
					<h3 className="text-lg font-semibold mb-4">Login</h3>
					<form onSubmit={handleSubmit}>
						<input
							type="text"
							value={contactNo}
							placeholder="Contact No"
							className="w-full p-2 border rounded mb-3"
							onChange={(e) => setContactNo(e.target.value)}
							required
						/>
						<input
							type="password"
							value={password}
							placeholder="Password"
							className="w-full p-2 border rounded mb-3"
							onChange={(e) => setPassword(e.target.value)}
							required
						/>
						<button
							type="submit"
							className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
						>
							Login
						</button>
					</form>
				</div>
			)}

			{isRegistered === false && (
				<div className="mt-8 bg-white p-6 rounded-2xl shadow-md w-full max-w-md">
					<h3 className="text-lg font-semibold mb-4">
						Lab Technician Registration
					</h3>
					<form onSubmit={handleSubmit} className="space-y-3">
						<div>
							<label className="block mb-1">Name</label>
							<input
								name="name"
								value={formData.name}
								onChange={handleChange}
								type="text"
								className="w-full border p-2 rounded"
								required
							/>
						</div>
						<div>
							<label className="block mb-1">Contact No</label>
							<input
								name="contactNo"
								value={formData.contactNo}
								onChange={handleChange}
								type="text"
								className="w-full border p-2 rounded"
								required
							/>
						</div>
						<div>
							<label className="block mb-1">Password</label>
							<input
								name="password"
								value={formData.password}
								onChange={handleChange}
								type="password"
								className="w-full border p-2 rounded"
								required
							/>
						</div>
						<button
							type="submit"
							className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
						>
							Register
						</button>
					</form>
				</div>
			)}
		</div>
	);
}
