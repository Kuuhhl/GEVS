import React, { useState, useEffect } from "react";
// import { Qr } from css.gg";
import { QrReader } from "react-qr-reader";

function FormPage() {
	const [email, setEmail] = useState("");
	const [fullName, setFullName] = useState("");
	const [dob, setDob] = useState("");
	const [password, setPassword] = useState("");
	const [constituency, setConstituency] = useState("");
	const [uvc, setUvc] = useState("");

	const [scanning, setScanning] = useState(false);

	const handleSubmit = (event) => {
		event.preventDefault();
	};

	return (
		<>
			<main className="w-full max-w-md mx-auto p-6">
				<div className="mt-7 bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-gray-800 dark:border-gray-700">
					<div className="p-4 sm:p-7">
						<div className="mt-5">
							{/* Form */}
							<form onSubmit={handleSubmit}>
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
												required=""
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
										<label
											htmlFor="fullName"
											className="block text-sm mb-2 dark:text-white"
										>
											Full Name
										</label>
										<div className="relative">
											<input
												type="text"
												id="fullName"
												name="fullName"
												className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600"
												required=""
												aria-describedby="fullName-error"
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
											id="name-error"
										>
											Please provide a valid full name.
										</p>
									</div>
									{/* Form Group */}
									<div>
										<label
											htmlFor="constituency"
											className="block text-sm mb-2 dark:text-white"
										>
											Constituency
										</label>
										<div className="relative">
											<select className="py-3 px-4 pe-9 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600">
												<option defaultValue={true}>
													Select a Constituency
												</option>
												<option>Shangri-la-Town</option>
												<option>
													Northern-Kunlun-Mountain
												</option>
												<option>
													Western-Shangri-la
												</option>
												<option>Naboo-Vallery</option>
												<option>New-Felucia</option>
											</select>
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
											id="constituency-error"
										>
											Please provide a valid constituency.
										</p>
									</div>
									{/* Form Group */}
									<div>
										<div className="flex justify-between items-center">
											<label
												htmlFor="password"
												className="block text-sm mb-2 dark:text-white"
											>
												Password
											</label>
											<a
												className="text-sm text-blue-600 decoration-2 hover:underline font-medium dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
												href="../examples/html/recover-account.html"
											>
												Forgot password?
											</a>
										</div>

										<div className="relative">
											<input
												type="password"
												id="password"
												name="password"
												className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600"
												required=""
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
											Put in a valid password
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
												className="shrink-0 mt-0.5 border-gray-200 rounded text-blue-600 pointer-events-none focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
											/>
										</div>
										<div className="ms-3">
											<label
												htmlFor="remember-me"
												className="text-sm dark:text-white"
											>
												Remember me
											</label>
										</div>
									</div>
									{/* End Checkbox */}

									<button
										id="scanQrButton"
										className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
										data-hs-overlay="#qrModal"
										onClick={() => setScanning(true)}
									>
										{/* <Qr className="w-5 h-5" /> */}
										Scan UVC QR-Code
									</button>

									<div className="py-3 flex items-center text-xs text-gray-400 uppercase before:flex-[1_1_0%] before:border-t before:border-gray-200 before:me-6 after:flex-[1_1_0%] after:border-t after:border-gray-200 after:ms-6 dark:text-gray-500 dark:before:border-gray-600 dark:after:border-gray-600">
										Or
									</div>

									<div className="flex justify-center items-center">
										<div
											className="text-sm text-blue-600 decoration-2 hover:underline font-medium dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600 cursor-pointer"
											data-hs-overlay="#manualUvcModal"
										>
											Enter UVC Manually
										</div>
									</div>
								</div>
							</form>
							{/* End Form */}
						</div>
					</div>
				</div>
			</main>
			<div
				id="qrModal"
				className="hs-overlay hidden w-full h-full fixed top-0 start-0 z-[60] overflow-x-hidden overflow-y-auto pointer-events-none"
			>
				<div className="hs-overlay-open:mt-7 hs-overlay-open:opacity-100 hs-overlay-open:duration-500 mt-0 opacity-0 ease-out transition-all sm:max-w-lg sm:w-full m-3 sm:mx-auto min-h-[calc(100%-3.5rem)] flex items-center">
					<div className="w-full flex flex-col bg-white border shadow-sm rounded-xl dark:bg-gray-800 dark:border-gray-700 dark:shadow-slate-700/[.7]">
						<div className="flex justify-between items-center py-3 px-4 border-b dark:border-gray-700">
							<h3 className="font-bold text-gray-800 dark:text-white">
								Scanning UVC QR-Code
							</h3>
							<button
								type="button"
								className="flex justify-center items-center w-7 h-7 text-sm font-semibold rounded-full border border-transparent text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:hover:bg-gray-700 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
								data-hs-overlay="#qrModal"
							>
								<span className="sr-only">Cancel</span>
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
							{scanning ? (
								<QrReader
									constraints={{ facingMode: "environment" }}
									onResult={(result, error) => {
										if (result) {
											setUvc(result?.text);
										}

										if (error) {
											return;
										}
									}}
								/>
							) : (
								<div className="min-h-[15rem] flex flex-col bg-white border shadow-sm rounded-xl dark:bg-gray-800 dark:border-gray-700 dark:shadow-slate-700/[.7]">
									(
									<div className="flex flex-auto flex-col justify-center items-center p-4 md:p-5">
										<div className="flex flex-col items-center justify-center gap-2">
											<div
												className="animate-spin inline-block w-6 h-6 border-[3px] border-current border-t-transparent text-blue-600 rounded-full dark:text-blue-500"
												role="status"
												aria-label="loading"
											>
												<span className="sr-only">
													Loading Camera...
												</span>
											</div>
											<span className="text-white">
												Loading Camera...
											</span>
										</div>
									</div>
									)
								</div>
							)}
						</div>
						<div className="flex justify-end items-center gap-x-2 py-3 px-4 border-t dark:border-gray-700">
							<button
								type="button"
								className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
								data-hs-overlay="#qrModal"
								onClick={() => setScanning(false)}
							>
								Cancel
							</button>
						</div>
					</div>
				</div>
			</div>
			<>
				<div
					id="manualUvcModal"
					className="hs-overlay hidden w-full h-full fixed top-0 start-0 z-[60] overflow-x-hidden overflow-y-auto pointer-events-none"
				>
					<div className="hs-overlay-open:mt-7 hs-overlay-open:opacity-100 hs-overlay-open:duration-500 mt-0 opacity-0 ease-out transition-all sm:max-w-lg sm:w-full m-3 sm:mx-auto">
						<div className="flex flex-col bg-white border shadow-sm rounded-xl pointer-events-auto dark:bg-gray-800 dark:border-gray-700 dark:shadow-slate-700/[.7]">
							<div className="flex justify-between items-center py-3 px-4 border-b dark:border-gray-700">
								<h3 className="font-bold text-gray-800 dark:text-white">
									Enter UVC Manually
								</h3>
								<button
									type="button"
									className="flex justify-center items-center w-7 h-7 text-sm font-semibold rounded-full border border-transparent text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:hover:bg-gray-700 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
									data-hs-overlay="#hs-focus-management-modal"
								>
									<span className="sr-only">Cancel</span>
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
								<label
									htmlFor="input-label"
									className="block text-sm font-medium mb-2 dark:text-white"
								>
									UVC Code
								</label>
								<input
									type="text"
									id="input-label"
									className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400"
									placeholder="AB1FC20E"
									autoFocus={true}
								/>
							</div>
							<div className="flex justify-end items-center gap-x-2 py-3 px-4 border-t dark:border-gray-700">
								<button
									type="button"
									className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
									data-hs-overlay="#manualUvcModal"
								>
									Cancel
								</button>
								<button
									type="button"
									className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
									data-hs-overlay="#manualUvcModal"
								>
									Save
								</button>
							</div>
						</div>
					</div>
				</div>
			</>
		</>
	);
}

export default FormPage;
