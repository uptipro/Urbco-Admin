import React, { useEffect, useState } from "react";
import Sidebar from "../component/Sidebar";
import OutsideClick from "../component/OutsideClick";
import Header from "../component/Header";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
// import Timeout from "../component/Timeout";
import { useSelector } from "react-redux";

const Dashboard = () => {
	const [open, setOpen] = useState(false);

	const location = useLocation();

	const navigate = useNavigate();



	const { user_details } = useSelector((state) => state.auth);

	const title =
		location.pathname.split("/")[3] || location.pathname.split("/")[2];

	useEffect(() => {
		if (!user_details) {
			navigate("/");
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user_details, navigate]);

	return (
		<>
			{user_details && user_details._id && (
				<div className="wrapper">
					<OutsideClick handleToggle={() => setOpen(false)}>
						<Sidebar
							handleToggle={() => setOpen(false)}
							open={open}
						/>
					</OutsideClick>
					<div className={`main-page`}>
						<Header openMenu={() => setOpen(!open)} title={title} />
						<div className="app-content">
							<Outlet />
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default Dashboard;
