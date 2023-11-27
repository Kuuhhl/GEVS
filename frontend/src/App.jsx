import { Route, Routes } from "react-router-dom";
import FormPage from "./pages/FormPage";

function App() {
	return (
		<Routes>
			<Route path="/" element={<FormPage />} />
		</Routes>
	);
}

export default App;
