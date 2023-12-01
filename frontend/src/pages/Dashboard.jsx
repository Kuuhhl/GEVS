import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Chart, CategoryScale, LinearScale, BarElement } from "chart.js";
import classNames from "classnames";
import Cookies from "js-cookie";
import { Bar } from "react-chartjs-2";
Chart.register(CategoryScale, LinearScale, BarElement);

export default function Dashboard({ isAdmin = false }) {
	const [electionStatus, setElectionStatus] = useState("");
	const [electionWinner, setElectionWinner] = useState("");
	const [yourVote, setYourVote] = useState("");
	const [seats, setSeats] = useState([]);

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
		if (isAdmin) {
			const adminToken = Cookies.get("admin_token");
			if (!adminToken) {
				navigate("/admin/login");
			}
		} else {
			const voterToken = Cookies.get("voter_token");
			if (!voterToken) {
				navigate("/login");
			}
		}
	}, [isAdmin, navigate]);

	useEffect(() => {
		if (isAdmin) return;
		const voterToken = Cookies.get("voter_token");
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
				setYourVote(data.party);
			} else {
				setYourVote("Not Voted");
			}
		};
		getVoteInfo();
	}, [isAdmin, navigate]);

	useEffect(() => {
		const getElectionInfo = async () => {
			const response = await fetch("http://localhost:3001/gevs/results");
			const data = await response.json();

			setElectionStatus(data.status);
			setElectionWinner(data.winner);
			setSeats(data.seats);
		};
		getElectionInfo();
	}, []);

	const handleElection = async (url) => {
		const adminToken = Cookies.get("admin_token");
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
	};

	const startElection = () =>
		handleElection("http://localhost:3001/admin/action/election/start");
	const endElection = () =>
		handleElection("http://localhost:3001/admin/action/election/end");

	return (
		<div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">
			<div className="grid lg:grid-cols-7 lg:gap-x-8 xl:gap-x-12 lg:items-center">
				<div className="lg:col-span-3">
					<h1 className="block text-3xl font-bold text-gray-800 sm:text-4xl md:text-5xl lg:text-6xl dark:text-white">
						{electionStatus !== "Completed"
							? "Election Dashboard"
							: "Election Results"}
					</h1>
					<div className="mt-3 text-lg text-gray-800 dark:text-gray-400 flex gap-1">
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

					{!isAdmin && yourVote && (
						<div className="mt-3 text-lg text-gray-800 dark:text-gray-400 flex gap-1">
							Your Vote:
							<p className="text-lg">{yourVote}</p>
						</div>
					)}

					{electionStatus !== "Not Started" && (
						<div className="mt-3 text-lg text-gray-800 dark:text-gray-400 flex gap-1">
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

					{isAdmin && electionStatus === "Pending" && (
						<button
							className="w-full sm:w-auto py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
							onClick={endElection}
						>
							End Election
						</button>
					)}
					{isAdmin &&
						electionStatus !== "Not Started" &&
						electionStatus !== "Pending" &&
						electionStatus !== "Completed" && (
							<button
								className="w-full sm:w-auto py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
								onClick={startElection}
							>
								Start Election
							</button>
						)}
				</div>
				{!isAdmin && !yourVote && (
					<Link
						className="w-full sm:w-auto py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
						to="/vote"
					>
						Vote Now
					</Link>
				)}
				<div className="lg:col-span-4 mt-10 lg:mt-0">
					<Bar
						data={{
							labels: seats.map((seat) => seat.party),
							datasets: [
								{
									label: "# of Votes",
									data: seats.map((seat) => seat.seat),
									backgroundColor: seats.map(() =>
										getRandomColor()
									),
									borderColor: seats.map(() =>
										getRandomColor()
									),
									borderWidth: 1,
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
								},
								title: {
									display: true,
									text: "Chart.js Horizontal Bar Chart",
								},
							},
						}}
					/>
				</div>
			</div>
		</div>
	);
}
