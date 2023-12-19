import PropTypes from "prop-types";
import classNames from "classnames";
import Cookies from "js-cookie";
import { Link, useLocation } from "react-router-dom";

export default function Header({ loginState, setLoginState }) {
	const location = useLocation();
	const handleLogout = (type) => {
		Cookies.remove(`${type}_token`);
		setLoginState((prevState) => ({ ...prevState, [type]: false }));
	};
	return (
		<header className="flex flex-wrap sm:justify-start sm:flex-nowrap z-50 w-full bg-white text-sm py-4 dark:bg-gray-900">
			<nav
				className="max-w-[85rem] w-full mx-auto px-4 sm:flex sm:items-center sm:justify-between"
				aria-label="Global"
			>
				<div className="flex items-center justify-between">
					<a
						className="inline-flex items-center gap-x-2 text-xl font-semibold dark:text-white"
						href="/"
					>
						<img
							className="flex-shrink-0 w-10 h-10 rounded-sm"
							src="/icon.png"
						/>
						GEVS
					</a>
					<div className="sm:hidden">
						<button
							type="button"
							className="hs-collapse-toggle p-2 inline-flex justify-center items-center gap-x-2 rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-transparent dark:border-gray-700 dark:text-white dark:hover:bg-white/10 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
							data-hs-collapse="#navbar-image-and-text-1"
							aria-controls="navbar-image-and-text-1"
							aria-label="Toggle navigation"
						>
							<svg
								className="hs-collapse-open:hidden flex-shrink-0 w-4 h-4"
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
								<line x1={3} x2={21} y1={6} y2={6} />
								<line x1={3} x2={21} y1={12} y2={12} />
								<line x1={3} x2={21} y1={18} y2={18} />
							</svg>
							<svg
								className="hs-collapse-open:block hidden flex-shrink-0 w-4 h-4"
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
				</div>
				<div
					id="navbar-image-and-text-1"
					className="hs-collapse hidden overflow-hidden transition-all duration-300 basis-full grow sm:block"
				>
					<div className="flex flex-col gap-5 mt-5 sm:flex-row sm:items-center sm:justify-end sm:mt-0 sm:ps-5">
						<Link
							className={classNames(
								"font-medium dark:focus:outline-none dark:hover:text-blue-500 dark:focus:ring-1 dark:focus:ring-gray-600",
								{
									"text-gray-500": location.pathname !== "/",
									"text-blue-500": location.pathname === "/",
								}
							)}
							aria-current="page"
							to={"/"}
						>
							Dashboard
						</Link>
						<Link
							className={classNames(
								"font-medium hover:text-gray-400 dark:hover:text-blue-500 ",
								{
									"text-gray-500":
										location.pathname !== "/candidates",
									"text-blue-500":
										location.pathname === "/candidates",
								}
							)}
							to={"/candidates"}
						>
							Parties / Candidates List
						</Link>
						{loginState.voter && (
							<button
								className="font-medium text-red-500"
								onClick={() => handleLogout("voter")}
							>
								Logout
							</button>
						)}
						{loginState.admin && (
							<button
								className="font-medium text-red-500"
								onClick={() => handleLogout("admin")}
							>
								Logout
							</button>
						)}
						{!loginState.admin && !loginState.voter && (
							<Link
								className={classNames(
									("font-medium hover:text-gray-400 dark:hover:text-blue-500",
									{
										"text-gray-500":
											location.pathname !== "/login",
										"text-blue-500":
											location.pathname === "/login",
									})
								)}
								to={"/login"}
							>
								Login
							</Link>
						)}
					</div>
				</div>
			</nav>
		</header>
	);
}
Header.propTypes = {
	loginState: PropTypes.object.isRequired,
	setLoginState: PropTypes.func.isRequired,
};
