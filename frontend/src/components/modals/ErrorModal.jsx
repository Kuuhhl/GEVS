import PropTypes from "prop-types";
import ReactModal from "react-modal";
export default function ErrorModal({
	errorModalIsOpen,
	setErrorModalIsOpen,
	errorMessage,
}) {
	return (
		<ReactModal
			isOpen={errorModalIsOpen}
			appElement={document.getElementById("root")}
			onRequestClose={() => setErrorModalIsOpen(false)}
			contentLabel="Error"
			className="max-w-md mx-auto flex flex-col bg-white border shadow-sm rounded-xl dark:bg-gray-700 dark:border-gray-600 dark:shadow-slate-700/[.7]"
			overlayClassName="w-full h-full fixed top-0 start-0 z-[60] overflow-x-hidden overflow-y-auto flex items-center justify-center"
		>
			<div className="flex justify-between items-center py-3 px-4 border-b dark:border-gray-700">
				<h3 className="font-bold text-gray-800 dark:text-white">
					Error
				</h3>
				<button
					type="button"
					className="flex justify-center items-center w-7 h-7 text-sm font-semibold rounded-full border border-transparent text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:hover:bg-gray-700 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
					onClick={() => setErrorModalIsOpen(false)}
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
					onClick={() => setErrorModalIsOpen(false)}
				>
					Okay
				</button>
			</div>
		</ReactModal>
	);
}
ErrorModal.propTypes = {
	errorModalIsOpen: PropTypes.bool.isRequired,
	setErrorModalIsOpen: PropTypes.func.isRequired,
	errorMessage: PropTypes.string.isRequired,
};
