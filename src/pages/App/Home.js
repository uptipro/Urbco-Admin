import React, { useEffect } from "react";
import { FaRegBuilding } from "react-icons/fa";
import { FiAlertTriangle, FiUser, FiUsers } from "react-icons/fi";
import { MdOutlineFeaturedPlayList } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { getStats } from "../../redux/basic/basicSlice";
import dateFormat from "dateformat";
import { useNavigate } from "react-router-dom";

const Home = () => {
	const dispatch = useDispatch();

	const navigate = useNavigate();

	const { user_details } = useSelector((state) => state.auth);
	const { stats } = useSelector((state) => state.basic);

	useEffect(() => {
		dispatch(getStats({ token: user_details.access_token }));
	}, []);

	return (
		<div className="analytics">
			{user_details.user_type === "admin" ||
			(user_details.role_id &&
				user_details.role_id.permissions &&
				user_details.role_id.permissions.includes("dashboard-stats")) ? (
				stats && (
					<div className="move">
						<div className="row">
							<div className="col-lg-4 col-md-6 col-6 mb-3">
								<div
									className="box"
									onClick={() =>
										navigate("/dashboard/accounts/users")
									}
								>
									<div>
										<FiUser />
										<p>Users</p>
									</div>
									<h4>
										{typeof stats.users === "number"
											? `${stats.users}`
											: "--"}
									</h4>
								</div>
							</div>
							<div className="col-lg-4 col-md-6 col-6 mb-3">
								<div
									className="box"
									onClick={() =>
										navigate(
											"/dashboard/accounts/investors"
										)
									}
								>
									<div>
										<FiUser />
										<p>Investors</p>
									</div>
									<h4>
										{typeof stats.investors === "number"
											? `${stats.investors}`
											: "--"}
									</h4>
								</div>
							</div>
							<div className="col-lg-4 col-md-6 col-6 mb-3">
								<div
									className="box"
									onClick={() =>
										navigate("/dashboard/requests")
									}
								>
									<div>
										<FiUsers />
										<p>Requests</p>
									</div>
									<h4>
										{typeof stats.users === "number"
											? `${stats.requests}`
											: "--"}
									</h4>
								</div>
							</div>
							<div className="col-lg-4 col-md-6 col-6 mb-3">
								<div
									className="box"
									onClick={() =>
										navigate("/dashboard/accounts/roles")
									}
								>
									<div>
										<FiAlertTriangle />
										<p>Roles</p>
									</div>
									<h4>
										{typeof stats.users === "number"
											? `${stats.roles}`
											: "--"}
									</h4>
								</div>
							</div>
							<div className="col-lg-4 col-md-6 col-6 mb-3">
								<div
									className="box"
									onClick={() =>
										navigate("/dashboard/properties")
									}
								>
									<div>
										<FaRegBuilding />
										<p>Properties</p>
									</div>
									<h4>
										{typeof stats.users === "number"
											? `${stats.properties}`
											: "--"}
									</h4>
								</div>
							</div>
							<div className="col-lg-4 col-md-6 col-6 mb-3">
								<div
									className="box"
									onClick={() =>
										navigate("/dashboard/basic/features")
									}
								>
									<div>
										<MdOutlineFeaturedPlayList />
										<p>Features</p>
									</div>
									<h4>
										{typeof stats.users === "number"
											? `${stats.features}`
											: "--"}
									</h4>
								</div>
							</div>
							<div
								className="col-lg-4 col-md-6 col-6 mb-3"
								onClick={() =>
									navigate("/dashboard/payments/investments")
								}
							>
								<div className="box">
									<div>
										<MdOutlineFeaturedPlayList />
										<p>Investments</p>
									</div>
									<h4>
										{typeof stats.investments === "number"
											? `${stats.investments}`
											: "--"}
									</h4>
								</div>
							</div>
							<div className="col-lg-4 col-md-6 col-6 mb-3">
								<div
									className="box"
									onClick={() =>
										navigate(
											"/dashboard/payments/transactions"
										)
									}
								>
									<div>
										<MdOutlineFeaturedPlayList />
										<p>Successful Transactions</p>
									</div>
									<h4>
										{typeof stats.transactions === "number"
											? `${stats.transactions}`
											: "--"}
									</h4>
								</div>
							</div>
							<div className="col-lg-4 col-md-6 col-6 mb-3">
								<div className="box">
									<div>
										<FiUser />
										<p>
											Last Login:{" "}
											{dateFormat(
												user_details.last_login,
												"dd-mm-yyyy, h:MM:ss TT"
											)}
										</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				)
			) : (
				<div className="load-create">
					<p>You don't have permission to view the analytics.</p>
				</div>
			)}
		</div>
	);
};

export default Home;
