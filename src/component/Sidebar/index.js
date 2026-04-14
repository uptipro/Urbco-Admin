import React from "react";
import { useSelector } from "react-redux";
import Navigation from "./Navigation";
import Logo from "../../assets/logo.svg";

const Sidebar = ({ open, onOpen }) => {
	const { user_details } = useSelector((state) => state.auth);

	return (
		<div className={`sidebar shadow-sm ${open ? "open-m" : ""}`}>
			<div className="logo">
				<img src={Logo} alt="Logo" />
			</div>
			<div className="menu">
				{user_details && (
					<Navigation
						onOpen={onOpen}
						permissions={
							user_details.user_type === "admin"
								? "all"
								: user_details.role_id
								? user_details.role_id.permissions
								: []
						}
					/>
				)}
			</div>
		</div>
	);
};

export default Sidebar;
