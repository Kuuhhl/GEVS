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

	// check if user is authenticated and
	// direct to login page if not
	useEffect(() => {
		const voter_token = Cookies.get("voter_token");

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
				if (data.authenticated) {
					setAuthenticated(true);
				} else {
					navigate("/login");
				}
			})
			.catch(() => {
				navigate("/login");
			});
	}, [navigate]);

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
					console.log(data);
					setParties(data);
				})
				.catch(() => {
					setErrorMessage("Error: Could not fetch candidates.");
				});
		}
	}, [authenticated]);

	useEffect(() => {
		if (authenticated && votedCandidate.id) {
			const voter_token = Cookies.get("token");
			fetch("http://localhost:3001/voter/vote"),
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: "Bearer " + voter_token,
					},
					body: JSON.stringify({ id: votedCandidate.id }),
				}
					.then((response) => response.json())
					.then((data) => {
						if (
							Object.prototype.hasOwnProperty.call(data, "error")
						) {
							setErrorMessage("Error: " + ", ".join(data.error));
						} else {
							navigate("/dashboard");
						}
					})
					.catch(() => {
						setErrorMessage("Error: Could not cast vote.");
					});
		}
	}, [authenticated, navigate, votedCandidate]);

	if (errorMessage) {
		return <div>{errorMessage}</div>;
	}
	return (
		authenticated && (
			<div className="flex flex-col">
				{Object.entries(parties).map(([party, candidates]) => (
					<div key={party} className="-m-1.5 overflow-x-auto">
						<h2>{party}</h2>
						<div className="p-1.5 min-w-full inline-block align-middle">
							<div className="overflow-hidden">
								<VoteTable
									candidates={candidates}
									setVotedCandidate={setVotedCandidate}
								/>
							</div>
						</div>
					</div>
				))}
			</div>
		)
	);
}
