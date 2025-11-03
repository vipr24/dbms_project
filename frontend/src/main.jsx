import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter, Routes, Route } from "react-router";
import Doctor from "./pages/Doctor.jsx";
import Patient from "./pages/Patient.jsx";
import DoctorDash from "./pages/DoctorDash.jsx";
import PatientDash from "./pages/PatientDash.jsx";

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<App />} />
				<Route path="/doctor" element={<Doctor />} />
				<Route path="/patient" element={<Patient />} />
				<Route path="/doctor-dash" element={<DoctorDash />} />
				<Route path="/patient-dash" element={<PatientDash />} />
			</Routes>
		</BrowserRouter>
	</StrictMode>
);
