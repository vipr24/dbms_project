import { useState } from "react";
import { useNavigate } from "react-router";

export default function Patient() {
	const navigate = useNavigate();
	const [isRegistered, setIsRegistered] = useState(null);
	const [email, setEmail] = useState();
	const [password, setPassword] = useState();
	const [formData, setFormData] = useState({
		name: "",
		gender: "",
		phone: "",
		bloodGroup: "",
		dateOfRegistration: "",
		address: "",
		dob: "",
		email: "",
	});

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
		if (isRegistered) {
			const response = await fetch(`${BACKEND_URL}/login/patient`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ email, password }),
			});
			if (response.status == 200) {
				navigate("/dashboard");
			}
		} else {
			const response = await fetch(`${BACKEND_URL}/register/patient`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			});
			if (response.status == 200) {
				navigate("/dashboard");
			}
		}
	};

	return (
		<div className="min-h-screen bg-gray-50 p-8 flex flex-col items-center">
			<h2 className="text-2xl font-bold mb-6">Patient Portal</h2>

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
							type="email"
							value={email}
							placeholder="Email"
							className="w-full p-2 border rounded mb-3"
							onChange={(e) => setEmail(e.target.value)}
						/>
						<input
							type="password"
							value={password}
							placeholder="Password"
							className="w-full p-2 border rounded mb-3"
							onChange={(e) => setPassword(e.target.value)}
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
				<div className="mt-8 bg-white p-6 rounded-2xl shadow-md w-full max-w-lg">
					<h3 className="text-lg font-semibold mb-4">
						Patient Registration
					</h3>
					<form onSubmit={handleSubmit} className="space-y-3">
						{Object.entries(formData).map(([key, value]) => (
							<div key={key}>
								<label className="block capitalize mb-1">
									{key}
								</label>
								<input
									name={key}
									value={value}
									onChange={handleChange}
									type={
										key.includes("date") ? "date" : "text"
									}
									className="w-full border p-2 rounded"
									required
								/>
							</div>
						))}
						<button
							type="submit"
							className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
						>
							Submit
						</button>
					</form>
				</div>
			)}
		</div>
	);
}
