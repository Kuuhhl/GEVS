import PropTypes from "prop-types";
import classNames from "classnames";

export default function SelectField({
	labelText,
	selectorId,
	selectorName,
	selectorValues,
	isRequired = false,
	errorMessage,
	showError = false,
	svgPath,
	setFormValue,
}) {
	return (
		<div>
			<label
				htmlFor="constituency"
				className="block text-sm mb-2 dark:text-white"
			>
				{labelText}
			</label>
			<div className="relative">
				<select
					id={selectorId}
					className="py-3 px-4 pe-9 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600"
					name={selectorName}
					required={isRequired}
					onChange={(e) => setFormValue(e.target.value)}
				>
					{selectorValues.map((item, index) => (
						<option key={index} value={item.value}>
							{item.label}
						</option>
					))}
				</select>
				<div
					className={classNames(
						"absolute inset-y-0 end-0 flex items-center pointer-events-none pe-3",
						{ hidden: !showError }
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
						<path d={svgPath} />
					</svg>
				</div>
			</div>
			<p
				className={classNames("text-xs text-red-600 mt-2", {
					hidden: !showError,
				})}
				id={`${selectorId}-error`}
			>
				{errorMessage}
			</p>
		</div>
	);
}

SelectField.propTypes = {
	labelText: PropTypes.string,
	selectorId: PropTypes.string,
	selectorName: PropTypes.string,
	selectorValues: PropTypes.arrayOf(
		PropTypes.shape({
			value: PropTypes.string,
			label: PropTypes.string,
		})
	),
	isRequired: PropTypes.bool,
	errorMessage: PropTypes.string,
	showError: PropTypes.bool,
	svgPath: PropTypes.string,
	setFormValue: PropTypes.func,
};
