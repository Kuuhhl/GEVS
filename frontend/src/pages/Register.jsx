import { useCallback, useState, useEffect } from "react";
import PropTypes from "prop-types";
import Cookies from "js-cookie";
import { Link, useNavigate } from "react-router-dom";
import InputField from "../components/form/inputField.jsx";
import SelectField from "../components/form/selectField.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQrcode } from "@fortawesome/free-solid-svg-icons";
import ErrorModal from "../components/modals/ErrorModal.jsx";
import ManualUvcModal from "../components/modals/ManualUvcModal.jsx";
import QrScannerModal from "../components/modals/QrScannerModal.jsx";

function Register({ setLoginState }) {
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

	const [errorModalIsOpen, setErrorModalIsOpen] = useState(false);
	const [qrModalIsOpen, setQrModalIsOpen] = useState(false);
	const [manualUvcModalIsOpen, setManualUvcModalIsOpen] = useState(false);

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
			setQrModalIsOpen(true);
			setQrScannerLoaded(false);
			setScanning(true);
		} else {
			setManualUvcModalIsOpen(true);
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
					// delete old auth jwt cookies
					Cookies.remove("voter_token");
					Cookies.remove("admin_token");

					// set auth jwt cookie
					Cookies.set("voter_token", data.token);

					// set login state
					setLoginState((prevState) => ({
						...prevState,
						voter: true,
					}));

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
				setErrorModalIsOpen(true);
			})
			.catch(() => {
				setErrorMessage("An error occurred while sending the request.");
				setErrorModalIsOpen(true);
			});

		setManualUvcModalIsOpen(false);
	}, [form, validateForm, uvcUnlocked, navigate, setLoginState]);

	// Submit form when QR code is decoded
	useEffect(() => {
		if (decoded && form.uvc.value !== "") {
			submitStep2();
			setDecoded(false); // Reset the decoded state after submitting
		}
	}, [decoded, form.uvc.value, submitStep2]);
	return (
		<>
			<div className="max-w-md  bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-gray-700 dark:border-gray-600 p-4">
				<div className="p-3">
					<div className="text-center"></div>
					<h1 className="block text-2xl font-bold text-gray-800 dark:text-white text-center">
						Register as a new Voter
					</h1>
					<p className="mt-1 text-sm text-gray-600 dark:text-gray-400 flex flex-col text-center">
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
								errorMessage="Please include a valid email address."
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
								<FontAwesomeIcon icon={faQrcode} />
								Scan UVC QR-Code
							</button>
							<div className="py-3 flex items-center text-xs text-gray-400 uppercase before:flex-[1_1_0%] before:border-t before:border-gray-200 before:me-6 after:flex-[1_1_0%] after:border-t after:border-gray-200 after:ms-6 dark:text-gray-500 dark:before:border-gray-600 dark:after:border-gray-600">
								Or
							</div>
							<div className="flex justify-center items-center">
								<button
									type="submit"
									className="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-gray-200 text-gray-500 hover:border-blue-600 hover:text-blue-600 disabled:opacity-50 disabled:pointer-events-none dark:border-gray-600 dark:text-gray-400 dark:hover:text-blue-500 dark:hover:border-blue-600 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
								>
									Enter UVC Manually
								</button>
							</div>
						</div>
					</form>
				</div>
			</div>
			{/* Modals */}
			<ErrorModal
				errorModalIsOpen={errorModalIsOpen}
				setErrorModalIsOpen={setErrorModalIsOpen}
				errorMessage={errorMessage}
			/>
			<ManualUvcModal
				manualUvcModalIsOpen={manualUvcModalIsOpen}
				setManualUvcModalIsOpen={setManualUvcModalIsOpen}
				setFormValue={setFormValue}
				submitStep2={submitStep2}
				form={form}
			/>
			<QrScannerModal
				qrModalIsOpen={qrModalIsOpen}
				setQrModalIsOpen={setQrModalIsOpen}
				setFormValue={setFormValue}
				setScanning={setScanning}
				setDecoded={setDecoded}
				setQrScannerLoaded={setQrScannerLoaded}
				scanning={scanning}
				qrScannerLoaded={qrScannerLoaded}
			/>
		</>
	);
}

export default Register;

Register.propTypes = {
	setLoginState: PropTypes.func.isRequired,
};
