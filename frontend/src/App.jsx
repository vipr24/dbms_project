import { useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

export default function App() {
	const navigate = useNavigate();

	const handleSelection = (role) => {
		if (role === "patient") navigate("/patient");
		else if (role == "lab_technician") navigate("/lab_technician");
		else navigate("/doctor");
	};

	useEffect(() => {
		toast("DBMS Project");
	}, []);

	return (
		<div className="flex flex-col items-center justify-center h-screen bg-gray-100">
			<h1 className="text-3xl font-bold mb-6">Welcome! Who are you?</h1>
			<div className="flex gap-6">
				<button
					onClick={() => handleSelection("doctor")}
					className="px-6 py-3 bg-blue-600 text-white rounded-2xl shadow-md hover:bg-blue-700 transition"
				>
					Doctor
				</button>
				<button
					onClick={() => handleSelection("patient")}
					className="px-6 py-3 bg-green-600 text-white rounded-2xl shadow-md hover:bg-green-700 transition"
				>
					Patient
				</button>
				<button
					onClick={() => handleSelection("lab_technician")}
					className="px-6 py-3 bg-green-600 text-white rounded-2xl shadow-md hover:bg-green-700 transition"
				>
					Lab Technician
				</button>
			</div>
		</div>
	);
}
