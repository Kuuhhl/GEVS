import ReactModal from "react-modal";
import PropTypes from "prop-types";
import classNames from "classnames";
export default function ManualUvcModal({
	manualUvcModalIsOpen,
	setManualUvcModalIsOpen,
	form,
	setFormValue,
	submitStep2,
}) {
	return (
		<ReactModal
			isOpen={manualUvcModalIsOpen}
			appElement={document.getElementById("root")}
			onRequestClose={() => setManualUvcModalIsOpen(false)}
			contentLabel="Enter UVC Manually"
			className="max-w-lg mx-auto flex flex-col bg-white border shadow-sm rounded-xl dark:bg-gray-700 dark:border-gray-600 dark:shadow-slate-700/[.7]"
			overlayClassName="w-full h-full fixed top-0 start-0 z-[60] overflow-x-hidden overflow-y-auto flex items-center justify-center"
		>
			<div className="flex justify-between items-center py-3 px-4 border-b dark:border-gray-700">
				<h3 className="font-bold text-gray-800 dark:text-white">
					Enter UVC Manually
				</h3>
				<button
					type="button"
					className="flex justify-center items-center w-7 h-7 text-sm font-semibold rounded-full border border-transparent text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:hover:bg-gray-700 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
					onClick={() => setManualUvcModalIsOpen(false)}
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
					className={classNames("text-xs text-red-600 mt-2", {
						hidden: !form.uvc.error,
					})}
					id="uvc-error"
				>
					A UVC code is 8 characters long. Please provide a valid UVC
					code.
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
		</ReactModal>
	);
}
ManualUvcModal.propTypes = {
	manualUvcModalIsOpen: PropTypes.bool.isRequired,
	form: PropTypes.object.isRequired,
	setManualUvcModalIsOpen: PropTypes.func.isRequired,
	setFormValue: PropTypes.func.isRequired,
	submitStep2: PropTypes.func.isRequired,
};
