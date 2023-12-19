import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import classNames from "classnames";
import Cookies from "js-cookie";
import { useState, useEffect } from "react";
import ErrorModal from "../components/modals/ErrorModal";
export default function Login({ isAdmin = false, setLoginState }) {
	const navigate = useNavigate();
	const [email, setEmail] = useState(
		localStorage.getItem(isAdmin ? "admin_email" : "email") || ""
	);
	const [password, setPassword] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const [emailError, setEmailError] = useState(false);
	const [passwordError, setPasswordError] = useState(false);

	const [errorModalIsOpen, setErrorModalIsOpen] = useState(false);

	const [rememberEmail, setRememberEmail] = useState(
		!!localStorage.getItem(isAdmin ? "admin_email" : "email")
	);

	useEffect(() => {
		if (rememberEmail) {
			Cookies.set(isAdmin ? "admin_email" : "email", email);
		} else {
			Cookies.remove(isAdmin ? "admin_email" : "email");
		}
	}, [email, rememberEmail, isAdmin]);

	const handleFormSubmit = (e) => {
		e.preventDefault();
		// Validate email and password
		const emailIsValid = email.match(
			/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
		);
		const passwordIsValid = password.length >= 1;

		setEmailError(!emailIsValid);
		setPasswordError(!passwordIsValid);

		if (emailIsValid && passwordIsValid) {
			const data = { email, password };
			const url = isAdmin
				? `${window.BACKEND_BASE_URL}/admin/login`
				: `${window.BACKEND_BASE_URL}/voter/login`;

			fetch(url, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: isAdmin
						? `Bearer ${Cookies.get("admin_token")}`
						: `Bearer ${Cookies.get("voter_token")}`,
				},
				body: JSON.stringify(data),
			})
				.then((response) => response.json())
				.then((data) => {
					if (Object.prototype.hasOwnProperty.call(data, "token")) {
						// remove all cookies
						Cookies.remove("admin_token");
						Cookies.remove("voter_token");

						if (isAdmin) {
							Cookies.set("admin_token", data.token);
							Cookies.set("admin_email", email);
							setLoginState((prevState) => ({
								...prevState,
								admin: true,
							}));
						} else {
							Cookies.set("voter_token", data.token);
							Cookies.set("email", email);
							setLoginState((prevState) => ({
								...prevState,
								voter: true,
							}));
						}
						navigate("/");
					} else {
						setErrorMessage(
							"Error: " +
								(Array.isArray(data.error)
									? data.error.join(", ")
									: data.error)
						);
						setErrorModalIsOpen(true);
					}
				})
				.catch((error) => {
					setErrorMessage(error.toString());
					setErrorModalIsOpen(true);
				});
		}
	};

	return (
		<>
			<div className="max-w-md bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-gray-700 dark:border-gray-600">
				<div className="p-4 sm:p-7">
					<div className="text-center">
						<h1 className="block text-2xl font-bold text-gray-800 dark:text-white">
							Sign in as {isAdmin ? "Admin" : "Voter"}
						</h1>

						<p className="mt-2 text-sm text-gray-600 dark:text-gray-400 flex flex-col">
							{!isAdmin
								? "Don't have an account yet?"
								: "Not an admin?"}
							<Link
								className="text-blue-600 decoration-2 hover:underline font-medium dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
								to={!isAdmin ? "/register" : "/login"}
							>
								{!isAdmin ? "Sign up here" : "Sign in as voter"}
							</Link>
						</p>
					</div>
					<div className="mt-5">
						{/* Form */}
						<form onSubmit={handleFormSubmit}>
							<div className="grid gap-y-4">
								{/* Form Group */}
								<div>
									<label
										htmlFor="email"
										className="block text-sm mb-2 dark:text-white"
									>
										Email address
									</label>
									<div className="relative">
										<input
											type="email"
											id="email"
											name="email"
											style={
												emailError
													? {
															border: "1px solid red",
													  }
													: {}
											}
											className="py-3 px-4 block w-full rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600"
											value={email}
											onChange={(e) =>
												setEmail(e.target.value)
											}
											required
											aria-describedby="email-error"
										/>
										<div className="hidden absolute inset-y-0 end-0 flex items-center pointer-events-none pe-3">
											<svg
												className="h-5 w-5 text-red-500"
												width={16}
												height={16}
												fill="currentColor"
												viewBox="0 0 16 16"
												aria-hidden="true"
											>
												<path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
											</svg>
										</div>
									</div>
									<p
										id="email-error"
										className={classNames(
											"text-xs text-red-600 mt-2",
											{
												block: emailError,
												hidden: !emailError,
											}
										)}
									>
										Please provide a valid email adress.
									</p>
								</div>
								{/* End Form Group */}
								{/* Form Group */}
								<div>
									<div className="flex justify-between items-center">
										<label
											htmlFor="password"
											className="block text-sm mb-2 dark:text-white"
										>
											Password
										</label>
									</div>
									<div className="relative">
										<input
											type="password"
											id="password"
											name="password"
											className="py-3 px-4 block w-full rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:text-gray-400 dark:focus:ring-gray-600"
											style={
												passwordError
													? {
															border: "1px solid red",
													  }
													: {}
											}
											onChange={(e) =>
												setPassword(e.target.value)
											}
											value={password}
											required
											aria-describedby="password-error"
										/>
										<div className="hidden absolute inset-y-0 end-0 flex items-center pointer-events-none pe-3">
											<svg
												className="h-5 w-5 text-red-500"
												width={16}
												height={16}
												fill="currentColor"
												viewBox="0 0 16 16"
												aria-hidden="true"
											>
												<path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
											</svg>
										</div>
									</div>
									<p
										className={classNames(
											"text-xs text-red-600 mt-2",
											{
												block: passwordError,
												hidden: !passwordError,
											}
										)}
										id="password-error"
									>
										Please provide a password.
									</p>
								</div>
								{/* End Form Group */}
								{/* Checkbox */}
								<div className="flex items-center">
									<div className="flex">
										<input
											id="remember-me"
											name="remember-me"
											type="checkbox"
											className="shrink-0 mt-0.5 border-gray-200 rounded text-blue-600  focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
											checked={rememberEmail}
											onChange={(e) =>
												setRememberEmail(
													e.target.checked
												)
											}
										/>
									</div>
									<div className="ms-3">
										<label
											htmlFor="remember-me"
											className="text-sm dark:text-white"
										>
											Remember email
										</label>
									</div>
								</div>
								{/* End Checkbox */}
								<button
									type="submit"
									className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
								>
									Sign in
								</button>
							</div>
						</form>
						{/* End Form */}
					</div>
				</div>
			</div>
			<ErrorModal
				errorModalIsOpen={errorModalIsOpen}
				errorMessage={errorMessage}
				setErrorModalIsOpen={setErrorModalIsOpen}
			/>
		</>
	);
}
Login.propTypes = {
	isAdmin: PropTypes.bool,
	setLoginState: PropTypes.func.isRequired,
};
