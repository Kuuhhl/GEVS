import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import { useState, useEffect } from "react";
export default function Login({ isAdmin = false }) {
	const [email, setEmail] = useState(
		localStorage.getItem(isAdmin ? "admin_email" : "email") || ""
	);
	const [password, setPassword] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const [rememberEmail, setRememberEmail] = useState(
		!!localStorage.getItem(isAdmin ? "admin_email" : "email")
	);

	useEffect(() => {
		if (rememberEmail) {
			localStorage.setItem(isAdmin ? "admin_email" : "email", email);
		} else {
			localStorage.removeItem(isAdmin ? "admin_email" : "email");
		}
	}, [email, rememberEmail, isAdmin]);

	const handleFormSubmit = (e) => {
		e.preventDefault();
		const data = { email, password };
		const url = isAdmin
			? "http://localhost:3001/admin/login"
			: "http://localhost:3001/voter/login";

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
					if (isAdmin) {
						Cookies.set("admin_token", data.token);
						Cookies.set("admin_email", email);
					} else {
						Cookies.set("voter_token", data.token);
						Cookies.set("email", email);
					}
					window.location.href = isAdmin
						? "/admin/dashboard"
						: "/voter/dashboard";
				} else {
					setErrorMessage(
						"Error: " +
							(Array.isArray(data.error)
								? data.error.join(", ")
								: data.error)
					);
					window.HSOverlay.open("#errorPopupModal");
				}
			})
			.catch((error) => {
				setErrorMessage(error.toString());
				window.HSOverlay.open("#errorPopupModal");
			});
	};

	return (
		<>
			<main className="w-full max-w-md mx-auto p-6">
				<div className="mt-7 bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-gray-800 dark:border-gray-700">
					<div className="p-4 sm:p-7">
						<div className="text-center">
							<h1 className="block text-2xl font-bold text-gray-800 dark:text-white">
								Sign in
							</h1>
							<p className="mt-2 text-sm text-gray-600 dark:text-gray-400 flex flex-col">
								Don't have an account yet?
								<Link
									className="text-blue-600 decoration-2 hover:underline font-medium dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
									to="/register"
								>
									Sign up here
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
												className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600"
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
											className="hidden text-xs text-red-600 mt-2"
											id="email-error"
										>
											Please include a valid email address
											so we can get back to you
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
												className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600"
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
											className="hidden text-xs text-red-600 mt-2"
											id="password-error"
										>
											8+ characters required
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
			</main>
			<div
				id="errorPopupModal"
				className="hs-overlay hidden w-full h-full fixed top-0 start-0 z-[60] overflow-x-hidden overflow-y-auto"
			>
				<div className="hs-overlay-open:mt-7 hs-overlay-open:opacity-100 hs-overlay-open:duration-500 mt-0 opacity-0 ease-out transition-all sm:max-w-lg sm:w-full m-3 sm:mx-auto min-h-[calc(100%-3.5rem)] flex items-center">
					<div className="w-full flex flex-col bg-white border shadow-sm rounded-xl dark:bg-gray-800 dark:border-gray-700 dark:shadow-slate-700/[.7]">
						<div className="flex justify-between items-center py-3 px-4 border-b dark:border-gray-700">
							<h3 className="font-bold text-gray-800 dark:text-white">
								Error
							</h3>
							<button
								type="button"
								className="flex justify-center items-center w-7 h-7 text-sm font-semibold rounded-full border border-transparent text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:hover:bg-gray-700 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
								data-hs-overlay="#errorPopupModal"
							>
								<span className="sr-only">Close</span>
								<svg
									className="flex-shrink-0 w-4 h-4"
									xmlns="http://www.w3.org/2000/svg"
									width={24}
									height={24}
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth={2}
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<path d="M18 6 6 18" />
									<path d="m6 6 12 12" />
								</svg>
							</button>
						</div>
						<div className="p-4 overflow-y-auto">
							<p className="text-gray-800 dark:text-gray-400">
								{errorMessage}
							</p>
						</div>
						<div className="flex justify-end items-center gap-x-2 py-3 px-4 border-t dark:border-gray-700">
							<button
								type="button"
								className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
								data-hs-overlay="#errorPopupModal"
							>
								Okay
							</button>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
