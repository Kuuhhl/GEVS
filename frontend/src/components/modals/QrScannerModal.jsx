import ReactModal from "react-modal";
import PropTypes from "prop-types";
import { QrScanner } from "@yudiel/react-qr-scanner";
export default function QrScannerModal({
	qrModalIsOpen,
	setQrModalIsOpen,
	setFormValue,
	setScanning,
	setDecoded,
	setQrScannerLoaded,
	scanning,
	qrScannerLoaded,
}) {
	return (
		<ReactModal
			appElement={document.getElementById("root")}
			isOpen={qrModalIsOpen}
			onRequestClose={() => {
				setFormValue("uvc", "");
				setScanning(false);
				setQrModalIsOpen(false);
				setQrScannerLoaded(false);
			}}
			contentLabel="Scanning UVC QR-Code"
			className="w-1/2 mx-auto flex flex-col bg-white border shadow-sm rounded-xl dark:bg-gray-700 dark:border-gray-600 dark:shadow-slate-700/[.7]"
			overlayClassName="w-full h-full fixed top-0 start-0 z-[60] overflow-x-hidden overflow-y-auto flex items-center justify-center"
		>
			<div className="flex justify-between items-center py-3 px-4 border-b dark:border-gray-700">
				<h3 className="font-bold text-gray-800 dark:text-white">
					Scanning UVC QR-Code
				</h3>
				<button
					type="button"
					className="flex justify-center items-center w-7 h-7 text-sm font-semibold rounded-full border border-transparent text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:hover:bg-gray-700 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
					onClick={() => {
						setFormValue("uvc", "");
						setScanning(false);
						setQrScannerLoaded(false);
						setQrModalIsOpen(false);
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
								setQrModalIsOpen(false);
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
							setQrModalIsOpen(false);
							alert(
								`Error: ${err}. \nFalling back to manual input.`
							);
							setScanning(false);
							setQrScannerLoaded(false);
							window.HSOverlay.open("#manualUvcModal");
						}}
						containerStyle={
							qrScannerLoaded ? {} : { display: "none" }
						}
					/>
				)}
				{!qrScannerLoaded && scanning && (
					<div className="min-h-[15rem] flex flex-col bg-white border shadow-sm rounded-xl dark:bg-gray-700 dark:border-gray-600 dark:shadow-slate-700/[.7]">
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
						setQrModalIsOpen(false);
					}}
				>
					Cancel
				</button>
			</div>
		</ReactModal>
	);
}
QrScannerModal.propTypes = {
	qrModalIsOpen: PropTypes.bool.isRequired,
	setQrModalIsOpen: PropTypes.func.isRequired,
	setFormValue: PropTypes.func.isRequired,
	setScanning: PropTypes.func.isRequired,
	setDecoded: PropTypes.func.isRequired,
	setQrScannerLoaded: PropTypes.func.isRequired,
	scanning: PropTypes.bool.isRequired,
	qrScannerLoaded: PropTypes.bool.isRequired,
};
