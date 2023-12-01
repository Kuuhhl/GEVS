import { useCallback, useState, useEffect } from "react";
import Cookies from "js-cookie";
import { Link, useNavigate } from "react-router-dom";
import InputField from "../components/form/inputField.jsx";
import SelectField from "../components/form/selectField.jsx";
import { QrScanner } from "@yudiel/react-qr-scanner";
import classNames from "classnames";

function Register() {
	const navigate = useNavigate();
	const [form, setForm] = useState({
		email: { value: "", error: false },
		fullName: { value: "", error: false },
		dateOfBirth: { value: "", error: false },
		password: { value: "", error: false },
		constituency: { value: "", error: false },
		uvc: { value: "", error: false },
	});
	const setFormValue = (field, value) => {
		setForm((prevForm) => {
			const updatedForm = {
				...prevForm,
				[field]: { ...prevForm[field], value, error: false },
			};
			return updatedForm;
		});
	};

	const [scanning, setScanning] = useState(false);
	const [qrScannerLoaded, setQrScannerLoaded] = useState(false);
	const [decoded, setDecoded] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");
	const [uvcUnlocked, setUvcUnlocked] = useState(false);
	// Check if QR Reader is loaded (for loading screen)
	useEffect(() => {
		const observer = new MutationObserver(() => {
			// Check if QR Reader is loaded
			const qrVideoElement = document.querySelector("video");
			if (qrVideoElement) {
				qrVideoElement.addEventListener("playing", () => {
					setQrScannerLoaded(true);
				});
			}
		});

		// Start observing the document with the configured parameters
		observer.observe(document, { childList: true, subtree: true });

		// Ensure the observer is disconnected when the component unmounts
		return () => observer.disconnect();
	}, []);

	// Dismount QR Reader when modal is closed via esc key
	useEffect(() => {
		const qrModal = document.getElementById("qrModal");
		if (qrModal) {
			const handleKeyDown = (event) => {
				if (event.key === "Escape") {
					setFormValue("uvc", "");
					setScanning(false);
					setQrScannerLoaded(false);
				}
			};

			// Add event listener
			qrModal.addEventListener("keydown", handleKeyDown);

			// Remove event listener on cleanup
			return () => qrModal.removeEventListener("keydown", handleKeyDown);
		}
	}, []);

	const validateForm = useCallback(
		(checkUvc = false) => {
			let formValid = true;
			let formCopy = { ...form };

			for (const key in formCopy) {
				if (
					(checkUvc &&
						key === "uvc" &&
						formCopy[key].value.length !== 8) ||
					(!checkUvc && key !== "uvc" && formCopy[key].value === "")
				) {
					formCopy[key].error = true;
					formValid = false;
				}
			}

			setForm(formCopy);
			return formValid;
		},
		[form]
	);

	const submitStep1 = (event) => {
		event.preventDefault();
		const formValid = validateForm(false);

		if (!formValid) {
			setUvcUnlocked(false);
			return;
		}
		setUvcUnlocked(true);

		const buttonId = event.nativeEvent.submitter.id;
		if (buttonId === "scanQrButton") {
			window.HSOverlay.open("#qrModal");
			setQrScannerLoaded(false);
			setScanning(true);
		} else {
			window.HSOverlay.open("#manualUvcModal");
			setScanning(false);
			setQrScannerLoaded(false);
		}
	};
	const submitStep2 = useCallback(() => {
		const getFormValues = () => {
			let formValues = {};
			for (let key in form) {
				formValues[key] = form[key].value;
			}
			return formValues;
		};

		const formValid = validateForm(true);
		if (!uvcUnlocked) return;
		if (!formValid) {
			console.log("Form invalid!");
			return;
		}

		fetch("http://localhost:3001/voter/register", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(getFormValues()),
		})
			.then((response) => response.json())
			.then((data) => {
				if (Object.prototype.hasOwnProperty.call(data, "token")) {
					// set auth jwt cookie
					Cookies.set("voter_token", data.token);

					// redirect to voting page
					navigate("/vote");
					return;
				}

				// show error message
				if (Object.prototype.hasOwnProperty.call(data, "error")) {
					setErrorMessage(data.error.join(", "));
				} else {
					setErrorMessage(
						"An error occurred while sending the request."
					);
				}
				window.HSOverlay.open("#errorPopupModal");
			})
			.catch(() => {
				setErrorMessage("An error occurred while sending the request.");

				window.HSOverlay.open("#errorPopupModal");
			});

		window.HSOverlay.close("#manualUvcModal");
	}, [form, validateForm, uvcUnlocked, navigate]);
	// Submit form when QR code is decoded
	useEffect(() => {
		if (decoded && form.uvc.value !== "") {
			submitStep2();
			setDecoded(false); // Reset the decoded state after submitting
		}
	}, [decoded, form.uvc.value, submitStep2]);
	return (
		<>
			<main className="w-full max-w-md mx-auto p-6">
				<div className="mt-7 bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-gray-800 dark:border-gray-700">
					<div className="p-4 sm:p-7">
						<div className="text-center">
							<h1 className="block text-2xl font-bold text-gray-800 dark:text-white">
								Sign up
							</h1>
							<p className="mt-2 text-sm text-gray-600 dark:text-gray-400 flex flex-col">
								Registered already?
								<Link
									className="text-blue-600 decoration-2 hover:underline font-medium dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
									to="/login"
								>
									Sign in here
								</Link>
							</p>
						</div>
						<div className="mt-5">
							<form onSubmit={submitStep1}>
								<div className="grid gap-y-4">
									<InputField
										labelText="Email"
										inputType="text"
										inputId="email"
										inputName="email"
										isRequired={true}
										setFormValue={(value) =>
											setFormValue("email", value)
										}
										showError={form.email.error}
										errorMessage="Please include a valid email address so we can get back to you."
										svgPath="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"
									/>
									<InputField
										labelText="Full Name"
										inputType="text"
										inputId="fullName"
										inputName="fullName"
										isRequired={true}
										setFormValue={(value) =>
											setFormValue("fullName", value)
										}
										showError={form.fullName.error}
										errorMessage="Please provide a valid full name."
										svgPath="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"
									/>
									<InputField
										labelText="Date of Birth"
										inputType="date"
										inputId="dateOfBirth"
										inputName="dateOfBirth"
										isRequired={true}
										setFormValue={(value) => {
											setFormValue("dateOfBirth", value);
										}}
										showError={form.dateOfBirth.error}
										errorMessage="Please provide a valid date of birth."
										svgPath="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"
									/>

									<SelectField
										labelText="Constituency"
										selectorId={"constituency"}
										selectorName={"constituency"}
										selectorValues={[
											{
												value: "",
												label: "Select Constituency",
											},
											{
												value: "Shangri-la-Town",
												label: "Shangri-la-Town",
											},
											{
												value: "Northern-Kunlun-Mountain",
												label: "Northern-Kunlun-Mountain",
											},
											{
												value: "Western-Shangri-la",
												label: "Western-Shangri-la",
											},
											{
												value: "Naboo-Vallery",
												label: "Naboo-Vallery",
											},
											{
												value: "New-Felucia",
												label: "New-Felucia",
											},
										]}
										isRequired={true}
										setFormValue={(value) =>
											setFormValue("constituency", value)
										}
										showError={form.constituency.error}
										errorMessage="Please provide a valid constituency."
										svgPath="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"
									/>
									<InputField
										labelText="Password"
										inputType="password"
										inputId="password"
										inputName="password"
										isRequired={true}
										setFormValue={(value) =>
											setFormValue("password", value)
										}
										showError={form.password.error}
										errorMessage="Please provide a valid password."
										svgPath="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"
									/>
									<button
										id="scanQrButton"
										type="submit"
										className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
									>
										{/* <Qr className="w-5 h-5" /> */}
										Scan UVC QR-Code
									</button>
									<div className="py-3 flex items-center text-xs text-gray-400 uppercase before:flex-[1_1_0%] before:border-t before:border-gray-200 before:me-6 after:flex-[1_1_0%] after:border-t after:border-gray-200 after:ms-6 dark:text-gray-500 dark:before:border-gray-600 dark:after:border-gray-600">
										Or
									</div>
									<div className="flex justify-center items-center">
										<button
											type="submit"
											className="text-sm text-blue-600 decoration-2 hover:underline font-medium dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600 cursor-pointer"
										>
											Enter UVC Manually
										</button>
									</div>
								</div>
							</form>
						</div>
					</div>
				</div>
			</main>
			{/* Error Modal */}
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
			<div
				id="qrModal"
				className="hs-overlay hidden w-full h-full fixed top-0 start-0 z-[60] overflow-x-hidden overflow-y-auto "
				data-hs-overlay-keyboard="true"
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
								onClick={() => {
									setFormValue("uvc", "");
									setScanning(false);
									setQrScannerLoaded(false);
								}}
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
							{scanning && (
								<QrScanner
									tracker={false}
									onDecode={(result) => {
										if (result) {
											setFormValue("uvc", result);
											window.HSOverlay.close("#qrModal");
											setScanning(false);
											setDecoded(true);
										}
									}}
									onError={(err) => {
										if (
											err.message ===
											"Index or size is negative or greater than the allowed amount"
										) {
											return;
										}
										window.HSOverlay.close("#qrModal");
										alert(
											`Error: ${err}. \nFalling back to manual input.`
										);
										setScanning(false);
										setQrScannerLoaded(false);
										window.HSOverlay.open(
											"#manualUvcModal"
										);
									}}
									containerStyle={
										qrScannerLoaded
											? {}
											: { display: "none" }
									}
								/>
							)}
							{!qrScannerLoaded && scanning && (
								<div className="min-h-[15rem] flex flex-col bg-white border shadow-sm rounded-xl dark:bg-gray-800 dark:border-gray-700 dark:shadow-slate-700/[.7]">
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
								</div>
							)}
						</div>
						<div className="flex justify-end items-center gap-x-2 py-3 px-4 border-t dark:border-gray-700">
							<button
								type="button"
								className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
								data-hs-overlay="#qrModal"
								onClick={() => {
									setFormValue("uvc", "");
									setScanning(false);
									setQrScannerLoaded(false);
								}}
							>
								Cancel
							</button>
						</div>
					</div>
				</div>
			</div>
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
								data-hs-overlay="#manualUvcModal"
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
						<div className="p-4 overflow-y-auto relative">
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
								onChange={(e) => {
									setFormValue("uvc", e.target.value);
								}}
							/>
							<div
								className={classNames(
									"absolute inset-y-0 end-0 flex items-center pointer-events-none pe-3",
									{ hidden: !form.uvc.error }
								)}
							>
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
							<p
								className={classNames(
									"text-xs text-red-600 mt-2",
									{
										hidden: !form.uvc.error,
									}
								)}
								id="uvc-error"
							>
								A UVC code is 8 characters long. Please provide
								a valid UVC code.
							</p>
						</div>

						<div className="flex justify-end items-center gap-x-2 py-3 px-4 border-t dark:border-gray-700">
							<button
								type="button"
								className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
								data-hs-overlay="#manualUvcModal"
								onClick={() => setFormValue("uvc", "")}
							>
								Cancel
							</button>
							<button
								type="button"
								className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
								onClick={submitStep2}
							>
								Submit
							</button>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

export default Register;
