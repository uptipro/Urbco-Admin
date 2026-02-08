import React, { useEffect, useState } from "react";
import { BsDot } from "react-icons/bs";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import { FiAlertTriangle, FiSettings, FiUsers } from "react-icons/fi";
import { NavLink, useLocation } from "react-router-dom";

const NavCollapse = ({ content, onOpen, permissions }) => {
	const [open, setOpen] = useState(false);

	const location = useLocation();

	const toggleDropdown = (e) => {
		e.preventDefault();
		setOpen(!open);
	};

	useEffect(() => {
		if (location.pathname.split("/")[2] === content.name) {
			setOpen(true);
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [location.pathname, content.name]);

	return (
		<>
			<li className="dropdown">
				<button type="button" onClick={toggleDropdown} className="dropdown-toggle-btn">
					{content.name === "accounts" ? (
						<FiUsers />
					) : content.name === "basic" ? (
						<FiAlertTriangle />
					) : (
						<FiSettings />
					)}
					<span>{content.name}</span>
					<span className="icon">
						{open ? <FaAngleUp /> : <FaAngleDown />}
					</span>
				</a>
				{open && (
					<ul className="side-dropdown">
						{content.children.map((l) =>
							!l.permission ||
							(permissions &&
								permissions.includes(l.permission)) ? (
								<li key={l.id}>
									<NavLink to={l.href}>
										<BsDot /> {l.name}
									</NavLink>
								</li>
							) : (
								<></>
							)
						)}
					</ul>
				)}
			</li>
		</>
	);
};

export default NavCollapse;
