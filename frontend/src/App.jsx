import { Route, Routes } from "react-router-dom";
import Register from "./pages/Register";
import Vote from "./pages/Vote";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

function App() {
	return (
		<Routes>
			<Route path="/" element={<Register />} />
			<Route path="/register" element={<Register />} />
			<Route path="/login" element={<Login />} />
			<Route path="/admin/login" element={<Login isAdmin={true} />} />
			<Route path="/admin" element={<Dashboard isAdmin={true} />} />
			<Route
				path="/admin/dashboard"
				element={<Dashboard isAdmin={true} isVoter={false} />}
			/>
			<Route
				path="/voter/dashboard"
				element={<Dashboard isAdmin={false} isVoter={true} />}
			/>
			<Route path="/dashboard" element={<Dashboard />} />
			<Route path="/vote" element={<Vote />} />
		</Routes>
	);
}

export default App;
