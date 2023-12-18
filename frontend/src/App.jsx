import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Header from "./components/Header";
import Footer from "./components/Footer";
import CandidatesList from "./pages/CandidatesList";
import Cookies from "js-cookie";

function App() {
	const [loginState, setLoginState] = useState({
		admin: Cookies.get("admin_token") ? true : false,
		voter: Cookies.get("voter_token") ? true : false,
	});

	return (
		<div className="bg-gray-800">
			<Header loginState={loginState} setLoginState={setLoginState} />
			<Routes>
				<Route
					path="/"
					element={<Dashboard loginState={loginState} />}
				/>
				<Route
					path="/register"
					element={<Register setLoginState={setLoginState} />}
				/>
				<Route
					path="/login"
					element={<Login setLoginState={setLoginState} />}
				/>
				<Route
					path="/admin/login"
					element={
						<Login isAdmin={true} setLoginState={setLoginState} />
					}
				/>
				<Route
					path="/candidates"
					element={
						<CandidatesList loginState={loginState} vote={false} />
					}
				/>

				<Route path="/vote" element={<CandidatesList vote={true} />} />
			</Routes>
			<Footer loginState={loginState} setLoginState={setLoginState} />
		</div>
	);
}

export default App;
