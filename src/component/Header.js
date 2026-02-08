import React from "react";
// import { BsBellFill } from "react-icons/bs";
import User from "../assets/user.png";
import Logo from "../assets/logo.svg";
import { FiLogOut, FiMenu, FiUser } from "react-icons/fi";
import { DropdownMenu, DropdownToggle, UncontrolledDropdown } from "reactstrap";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/auth/authSlice";

const Header = ({ openMenu, title }) => {
	let mainTitle = title === "home" ? "dashboard" : title;

	const dispatch = useDispatch();

	const { user_details } = useSelector((state) => state.auth);

	const logoutHandler = (e) => {
		e.preventDefault();
		dispatch(logout());
	};

	return user_details && user_details._id ? (
		<div className="header shadow-sm">
			<div className="first">
				<button onClick={openMenu}>
					<FiMenu size={26} />
				</button>
				<h5 className="title">{mainTitle}</h5>
				<img src={Logo} alt="Logo" />
			</div>
			<div className="second">
				<UncontrolledDropdown>
					<DropdownToggle nav className="profile">
						<div className="user">
							<div>
								<p style={{ textTransform: "capitalize" }}>
									{user_details.first_name}{" "}
									{user_details.last_name}
								</p>
								<p style={{ textTransform: "capitalize" }}>
									{user_details.role_id &&
										user_details.role_id.name}
								</p>
							</div>
							<img src={User} alt="User" />
						</div>
					</DropdownToggle>
					<DropdownMenu end className="profile-user shadow-sm">
						<ul className="pro-body">
							<li>
								<Link to="/dashboard/settings">
									<FiUser />
									<span>Profile</span>
								</Link>
							</li>
							<li>
								<a href="/#" onClick={logoutHandler}>
									<FiLogOut />
									<span>Log Out</span>
								</a>
							</li>
						</ul>
					</DropdownMenu>
				</UncontrolledDropdown>
			</div>
		</div>
	) : (
		<></>
	);
};

export default Header;
