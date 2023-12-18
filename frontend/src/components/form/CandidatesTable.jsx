import PropTypes from "prop-types";
import classNames from "classnames";
export default function CandidatesTable({
	candidates,
	setVotedCandidate,
	showVoteButton = true,
}) {
	return (
		<div className="flex flex-col">
			<div className="-m-1.5 overflow-x-auto">
				<div className="p-1.5 min-w-full inline-block align-middle">
					<div className="overflow-hidden">
						<table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
							<thead>
								<tr>
									<th
										scope="col"
										className={classNames(
											"px-6 py-3 text-xs font-medium text-gray-500 uppercase",
											{
												"text-center": !showVoteButton,
												"text-start": showVoteButton,
											}
										)}
									>
										Name
									</th>

									{showVoteButton && (
										<th
											scope="col"
											className="px-6 py-3 text-end text-xs font-medium text-gray-500 uppercase"
										></th>
									)}
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-200 dark:divide-gray-700">
								{candidates.map((curr_candidate, index) => (
									<tr
										key={index}
										className="hover:bg-gray-100 dark:hover:bg-gray-700"
									>
										<td
											className={classNames(
												"px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-200",
												{
													"text-center":
														!showVoteButton,
												}
											)}
										>
											{curr_candidate.name}
										</td>

										{showVoteButton && (
											<td className="px-6 py-4 whitespace-nowrap text-end text-sm font-medium">
												<button
													type="button"
													className="inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-blue-600 hover:text-blue-800 disabled:opacity-50 disabled:pointer-events-none dark:text-blue-500 dark:hover:text-blue-400 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
													onClick={() =>
														setVotedCandidate(
															curr_candidate
														)
													}
												>
													Vote
												</button>
											</td>
										)}
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	);
}

CandidatesTable.propTypes = {
	candidates: PropTypes.arrayOf(
		PropTypes.shape({
			name: PropTypes.string.isRequired,
			id: PropTypes.number.isRequired,
		})
	).isRequired,
	setVotedCandidate: PropTypes.func.isRequired,
	showVoteButton: PropTypes.bool,
};
