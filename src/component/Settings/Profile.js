import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { displayError } from "../../redux/error";
import userService from "../../redux/users/userService";
import { toast } from "react-hot-toast";
import { userProfile } from "../../redux/auth/authSlice";

const Profile = () => {
	const dispatch = useDispatch();

	const { user_details } = useSelector((state) => state.auth);

	const [load, setLoad] = useState(false);
	const [first_name, setFirstName] = useState("");
	const [last_name, setLastName] = useState("");
	const [email, setEmail] = useState("");
	const [mobile, setMobile] = useState("");

	useEffect(() => {
		if (user_details) {
			setFirstName(user_details.first_name);
			setLastName(user_details.last_name);
			setEmail(user_details.email);
			setMobile(user_details.mobile);
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user_details]);

	const getInitials = (string) => {
		let names = string.split(" "),
			initials = names[0].substring(0, 1).toUpperCase();

		if (names.length > 1) {
			initials += names[names.length - 1].substring(0, 1).toUpperCase();
		}
		return initials;
	};

	const editHandler = async () => {
		let data = {
			first_name,
			last_name,
		};
		try {
			setLoad(true);
			let res = await userService.editUser(
				user_details.access_token,
				data,
				user_details._id
			);
			if (res) {
				setLoad(false);
				dispatch(
					userProfile({
						token: user_details.access_token,
						id: user_details._id,
					})
				);
				toast.success("User has been updated", {
					position: "top-right",
				});
			}
		} catch (err) {
			setLoad(false);
			displayError(err, true);
		}
	};

	return (
		<div className="profile">
			<div className="d-flex justify-content-between">
				<div className={`initials`}>
					<span>
						{getInitials(
							`${user_details.first_name} ${user_details.last_name}`
						)}
					</span>
				</div>
			</div>
			<div className="form row mt-3">
				<div className="col-md-6 mb-3">
					<label>First Name</label>
					<input
						value={first_name}
						onChange={(e) => setFirstName(e.target.value)}
					/>
				</div>
				<div className="col-md-6 mb-3">
					<label>Last Name</label>
					<input
						value={last_name}
						onChange={(e) => setLastName(e.target.value)}
					/>
				</div>

				<div className="col-md-6 mb-3">
					<label>Email</label>
					<input value={email} readOnly />
				</div>
				<div className="col-md-6 mb-3">
					<label>Phone Number</label>
					<input value={mobile} readOnly />
				</div>
				<div className="col-md-12 text-end">
					<button
						disabled={load}
						className="main-btn"
						onClick={editHandler}
					>
						{load ? "Hold on..." : "Update"}
					</button>
				</div>
			</div>
		</div>
	);
};

export default Profile;
