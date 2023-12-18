import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import VoteTable from "../components/form/VoteTable";

export default function Vote() {
	const navigate = useNavigate();
	const [authenticated, setAuthenticated] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");
	const [votedCandidate, setVotedCandidate] = useState({});
	const [parties, setParties] = useState({});

	const voter_token = Cookies.get("voter_token");

	// check if user is authenticated and
	// direct to login page if not
	useEffect(() => {
		if (!voter_token) {
			navigate("/login");
			return;
		}

		fetch("http://localhost:3001/voter/verify-token", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${voter_token}`,
			},
		})
			.then((response) => response.json())
			.then((data) => {
				if (data.message.toLowerCase().includes("valid")) {
					setAuthenticated(true);
				} else {
					navigate("/login");
				}
			})
			.catch(() => {
				navigate("/login");
			});
	}, [navigate, voter_token]);

	// fetch candidates from server
	useEffect(() => {
		if (authenticated) {
			fetch("http://localhost:3001/gevs/candidates", {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			})
				.then((response) => response.json())
				.then((data) => {
					setParties(data);
				})
				.catch(() => {
					setErrorMessage("Error: Could not fetch candidates.");
				});
		}
	}, [authenticated]);

	useEffect(() => {
		if (authenticated && votedCandidate.id) {
			fetch("http://localhost:3001/voter/vote", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${voter_token}`,
				},
				body: JSON.stringify({ candidate_id: votedCandidate.id }),
			})
				.then((response) => response.json())
				.then((data) => {
					if (Object.prototype.hasOwnProperty.call(data, "error")) {
						setErrorMessage("Error: " + ", ".join(data.error));
					} else {
						navigate("/voter/dashboard");
					}
				})
				.catch(() => {
					setErrorMessage("Error: Could not cast vote.");
				});
		}
	}, [authenticated, navigate, votedCandidate, voter_token]);

	if (errorMessage) {
		return <div>{errorMessage}</div>;
	}
	return (
		authenticated && (
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 dark:bg-gray-800">
				{Object.entries(parties).map(([party, candidates]) => (
					<div
						key={party}
						className="bg-white p-6 rounded-md shadow-md dark:bg-gray-700"
					>
						<div>
							<h2 className="text-center text-3xl font-extrabold text-gray-900 dark:text-white">
								{party}
							</h2>
						</div>
						<div className="mt-8 space-y-6">
							<VoteTable
								candidates={candidates}
								setVotedCandidate={setVotedCandidate}
							/>
						</div>
					</div>
				))}
			</div>
		)
	);
}
