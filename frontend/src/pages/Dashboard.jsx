import PropTypes from "prop-types";
import colors from "css-color-names";
import { useMemo, useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Chart, CategoryScale, LinearScale, BarElement } from "chart.js";
import classNames from "classnames";
import Cookies from "js-cookie";
import { Bar } from "react-chartjs-2";
Chart.register(CategoryScale, LinearScale, BarElement);

export default function Dashboard({ loginState }) {
	const [electionStatus, setElectionStatus] = useState("");
	const [electionWinner, setElectionWinner] = useState("");
	const [yourVote, setYourVote] = useState("");
	const [seats, setSeats] = useState([]);

	const [buttonsShown, setButtonsShown] = useState(false);

	const voterToken = Cookies.get("voter_token");
	const adminToken = Cookies.get("admin_token");

	const getRandomColor = () => {
		const letters = "0123456789ABCDEF";
		let color = "#";
		for (let i = 0; i < 6; i++) {
			color += letters[Math.floor(Math.random() * 16)];
		}
		return color;
	};

	const navigate = useNavigate();

	useEffect(() => {
		if (loginState.admin && !adminToken) {
			navigate("/admin/login");
		} else if (loginState.voter && !voterToken) {
			navigate("/login");
		} else if (!loginState.admin && electionStatus === "Not Started") {
			navigate("/admin/login");
		}
	}, [navigate, voterToken, adminToken, electionStatus, loginState]);

	useEffect(() => {
		const getVoteInfo = async () => {
			const response = await fetch(
				"http://localhost:3001/voter/view_vote",
				{
					method: "GET",
					headers: {
						Authorization: `Bearer ${voterToken}`,
					},
				}
			);
			const data = await response.json();

			if (response.ok) {
				setYourVote(`${data.name} - ${data.party}`);
			} else {
				setYourVote("Not Voted");
			}
		};
		if (loginState.voter && voterToken) {
			getVoteInfo();
		}
	}, [loginState.voter, navigate, voterToken]);

	const handleElection = useCallback(
		async (url) => {
			const response = await fetch(url, {
				method: "PUT",
				headers: {
					Authorization: `Bearer ${adminToken}`,
				},
			});
			if (response.ok) {
				const data = await response.json();
				setElectionStatus(data.status);
			}
		},
		[adminToken]
	);
	const startElection = useCallback(() => {
		handleElection("http://localhost:3001/admin/action/election/start");
	}, [handleElection]);
	const endElection = useCallback(() => {
		handleElection("http://localhost:3001/admin/action/election/end");
	}, [handleElection]);

	const resetElection = useCallback(() => {
		handleElection("http://localhost:3001/admin/action/election/reset");
	}, [handleElection]);

	useEffect(() => {
		const getElectionInfo = async () => {
			const response = await fetch("http://localhost:3001/gevs/results");
			const data = await response.json();

			if (!response.ok) {
				setElectionStatus("Not Started");
				setElectionWinner("");
				setSeats([]);
				return;
			}
			setElectionStatus(data.status);
			setElectionWinner(data.winner);
			setSeats(data.seats);
		};
		getElectionInfo();
	}, [electionStatus]);

	const buttonsConfig = useMemo(
		() => [
			{
				label: "End Election",
				action: endElection,
				condition: loginState.admin && electionStatus === "Pending",
			},
			{
				label: "Start Election",
				action: startElection,
				condition: loginState.admin && electionStatus === "Not Started",
			},
			{
				label: "Reset Election",
				action: resetElection,
				condition: loginState.admin && electionStatus === "Completed",
			},
			{
				label: "Vote Now",
				action: "/vote",
				condition:
					electionStatus === "Pending" &&
					((!loginState.voter && !loginState.admin) ||
						yourVote === "Not Voted"),
				isLink: true,
			},
		],
		[
			electionStatus,
			loginState.admin,
			loginState.voter,
			yourVote,
			endElection,
			startElection,
			resetElection,
		]
	);

	useEffect(() => {
		const areButtonsShown = buttonsConfig.some(
			(button) => button.condition
		);

		setButtonsShown(areButtonsShown);
	}, [buttonsConfig]);

	const renderButtons = () => {
		return (
			<div className="flex flex-col gap-1">
				{buttonsConfig.map((button, index) =>
					button.condition ? (
						button.isLink ? (
							<Link
								className="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
								key={index}
								to={button.action}
							>
								{button.label}
							</Link>
						) : (
							<button
								className="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
								type="button"
								key={index}
								onClick={button.action}
							>
								{button.label}
							</button>
						)
					) : null
				)}
			</div>
		);
	};

	const getColorForParty = (partyName) => {
		const lowerCasePartyName = partyName.toLowerCase();

		const colorName = Object.keys(colors).find((color) =>
			lowerCasePartyName.includes(color.toLowerCase())
		);

		return colorName ? colors[colorName] : getRandomColor();
	};
	return (
		<div className="px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-700 rounded-md flex flex-col gap-4 p-4 text-center">
			{(loginState.voter || loginState.admin) && (
				<h2 className="text-center text-xl font-medium text-gray-900 dark:text-white">
					{loginState.admin ? "Admin Mode" : "Voter Mode"}
				</h2>
			)}
			<h1 className="block text-3xl font-bold text-gray-800 sm:text-4xl md:text-5xl lg:text-6xl dark:text-white">
				{electionStatus !== "Completed"
					? "Election Dashboard"
					: "Election Results"}
			</h1>{" "}
			<div
				className={classNames(
					"flex flex-col sm:flex-row items-center gap-4",
					{
						"justify-evenly": buttonsShown,
						"justify-center": !buttonsShown,
						"text-start": buttonsShown,
						"text-center": !buttonsShown,
					}
				)}
			>
				{/* Info Strings */}
				<div
					className={classNames("flex flex-col gap-1 items-center", {
						"sm:justify-center": !buttonsShown,
						"sm:justify-start": buttonsShown,
					})}
				>
					<div className="text-lg text-gray-800 dark:text-gray-400 flex gap-1">
						Status:
						<p
							className={classNames("text-lg", {
								"text-red-800 dark:text-red-400":
									electionStatus === "Not Started",
								"text-yellow-800 dark:text-yellow-400":
									electionStatus === "Pending",
								"text-green-800 dark:text-green-400":
									electionStatus !== "Not Started" &&
									electionStatus !== "Pending",
							})}
						>
							{electionStatus}
						</p>
					</div>

					{loginState.voter && yourVote && (
						<div className="text-lg text-gray-800 dark:text-gray-400 flex gap-1">
							Your Vote:
							<p className="text-lg">{yourVote}</p>
						</div>
					)}

					{electionStatus !== "Not Started" && (
						<div className="text-lg text-gray-800 dark:text-gray-400 flex gap-1">
							Winner:
							<p
								className={classNames("text-lg", {
									"text-green-800 dark:text-green-400":
										electionWinner !== "Pending",
									"text-yellow-800 dark:text-yellow-400":
										electionWinner === "Pending",
								})}
							>
								{electionWinner}
							</p>
						</div>
					)}
				</div>
				{/* Buttons */}
				{renderButtons()}
			</div>
			<div>
				{electionStatus !== "Not Started" && seats && (
					<Bar
						data={{
							labels: seats.map((seat) => seat.party),
							datasets: [
								{
									label: "# of Votes",
									data: seats.map((seat) => seat.seat),
									backgroundColor: seats.map((seat) =>
										getColorForParty(seat.party)
									),
									borderColor: "black",
									borderWidth: 0,
								},
							],
						}}
						options={{
							indexAxis: "y",
							elements: {
								bar: {
									borderWidth: 2,
								},
							},
							responsive: true,
							plugins: {
								legend: {
									position: "right",
									labels: {
										color: "rgba(255,255,255,0.8)",
									},
								},
								title: {
									display: true,
									text: "Vote distribution",
									color: "rgba(255,255,255,0.8)",
								},
							},
							scales: {
								y: {
									title: {
										display: true,
										text: "Party",
										color: "rgba(255,255,255,0.8)",
									},
									ticks: {
										color: "white",
									},
								},
								x: {
									title: {
										display: true,
										text: "Seats",
										color: "rgba(255,255,255,0.8)",
									},
									ticks: {
										color: "white",
										callback: function (value) {
											if (value % 1 === 0) {
												return value;
											}
										},
									},
								},
							},
						}}
					/>
				)}
			</div>
		</div>
	);
}
Dashboard.propTypes = {
	loginState: PropTypes.object.isRequired,
};
