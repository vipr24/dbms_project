// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter, Routes, Route } from "react-router";
import Doctor from "./pages/Doctor.jsx";
import Patient from "./pages/Patient.jsx";
import DoctorDash from "./pages/DoctorDash.jsx";
import PatientDash from "./pages/PatientDash.jsx";
import LabTechnician from "./pages/LabTechnician.jsx";
import LabTechDash from "./pages/LabTechDash.jsx";
import { Toaster } from "react-hot-toast";

createRoot(document.getElementById("root")).render(
	// <StrictMode>
	<BrowserRouter>
		<Toaster
			position="top-right"
			toastOptions={{
				duration: 1500,
				removeDelay: 1000,
				style: {
					border: "1px solid #713200",
					padding: "30px",
					color: "#713200",
				},
				success: {
					style: {
						background: "green",
						border: "1px solid #713200",
						padding: "16px",
						color: "#713200",
					},
				},
				error: {
					style: {
						background: "red",
					},
				},
			}}
		/>
		<Routes>
			<Route path="/" element={<App />} />
			<Route path="/doctor" element={<Doctor />} />
			<Route path="/patient" element={<Patient />} />
			<Route path="/lab_technician" element={<LabTechnician />} />
			<Route path="/doctor-dash" element={<DoctorDash />} />
			<Route path="/patient-dash" element={<PatientDash />} />
			<Route path="/lab-tech-dash" element={<LabTechDash />} />
		</Routes>
	</BrowserRouter>
	// {/* </StrictMode> */}
);
