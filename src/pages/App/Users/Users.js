import React, { useEffect, useState } from "react";
import Loader from "../../../component/Loader";
import { useDispatch, useSelector } from "react-redux";
import { listRoles, listUsers } from "../../../redux/users/userSlice";
// Removed unused FiEye import
import ModalComponent from "../../../component/ModalComponent";
import { displayError } from "../../../redux/error";
import userService from "../../../redux/users/userService";
import { toast } from "react-hot-toast";
import Pagination from "../../../component/Pagination";
import CreateUser from "./CreateUser";
import ChangeRole from "./ChangeRole";
import { useLocation } from "react-router-dom";
import { CSVLink } from "react-csv";

const Users = () => {
	const dispatch = useDispatch();

	const pageNumber =
		new URLSearchParams(useLocation().search).get("page") || 1;

	const [status, setStatus] = useState("");
	const [openModal, setOpenModal] = useState(false);
	const [clickedUser, setClickedUser] = useState({});
	const [load, setLoad] = useState(false);
	const [reset, setReset] = useState(false);
	const [modalType, setModalType] = useState("");

	const { loading, user_list } = useSelector((state) => state.users);
	const { user_details } = useSelector((state) => state.auth);

	const headers = [
		{ label: "First Name", key: "first_name" },
		{ label: "Last Name", key: "last_name" },
		{ label: "Email", key: "email" },
		{ label: "Phone", key: "mobile" },
		{ label: "Role", key: "role_id.name" },
		{ label: "Status", key: "status" },
	];

	useEffect(() => {
		dispatch(listRoles({ token: user_details.access_token }));
	}, [dispatch, user_details.access_token]);

	useEffect(() => {
		dispatch(
			listUsers({
				token: user_details.access_token,
				status,
				page: pageNumber,
			})
		);
	}, [status, reset, pageNumber, dispatch, user_details.access_token]);

	const actionHandler = async () => {
		try {
			setLoad(true);
			let type =
				clickedUser.status === "active" ? "deactivate" : "activate";
			let res = await userService.actionUser(
				user_details.access_token,
				type,
				clickedUser._id
			);
			setLoad(false);
			if (res) {
				setOpenModal(false);
				setClickedUser({});
				setReset(!reset);
				toast.success("Status has been changed successfully", {
					position: "top-right",
				});
			}
		} catch (err) {
			displayError(err, true);
		}
	};

	return (
		<div>
			<div>
				{user_details.role_id &&
					user_details.role_id.permissions.includes(
						"create-user"
					) && (
						<button
							className="main-btn"
							onClick={() => {
								setModalType("create");
								setOpenModal(true);
							}}
						>
							+ New User
						</button>
					)}
			</div>
			<div>
				<div className="filter align">
					<select
						value={status}
						onChange={(e) => setStatus(e.target.value)}
					>
						<option value={""}>Status</option>
						<option value={"active"}>Active</option>
						<option value={"inactive"}>Inactive</option>
					</select>
					{user_list?.users && (
						<CSVLink
							data={user_list.users}
							headers={headers}
							className="main-btn"
							filename="users.csv"
						>
							Export CSV
						</CSVLink>
					)}
				</div>
				<div className="table-responsive">
					{loading ? (
						<Loader />
					) : (
						user_list &&
						user_list.users && (
							<>
								<table className="table table-bordered">
									<thead>
										<tr>
											<th>Name</th>
											<th>Email</th>
											<th>Phone</th>
											<th>Role</th>
											<th>Verified</th>
											<th>Status</th>
											<th>Action</th>
										</tr>
									</thead>
									<tbody>
										{user_list.users.map((user) => (
											<tr key={user._id}>
												<td className="wide">
													{user.first_name}{" "}
													{user.last_name}
												</td>
												<td className="wide">
													{user.email}
												</td>
												<td>{user.mobile}</td>
												<td className="wide">
													<span className="me-2">
														{user.role_id
															? user.role_id.name
															: "Role not set"}
													</span>
													{user_details.role_id &&
														user_details.role_id.permissions.includes(
															"edit-user"
														) && (
															<button
																type="button"
																className="link-button"
																onClick={() => {
																	setClickedUser(user);
																	setModalType("role");
																	setOpenModal(true);
																}}
															>
																Change
															</button>
														)}
												</td>
												<td>
													{user.verified ? "Yes" : "No"}
												</td>
												<td>{user.status}</td>
												<td>
													{user_details.role_id &&
													user_details.role_id.permissions.includes(
														"edit-user"
													) ? (
														user_details._id ===
														user._id ? (
															<span>--</span>
														) : (
															<button
																type="button"
																className="link-button"
																onClick={() => {
																	setClickedUser(user);
																	setModalType("action");
																	setOpenModal(true);
																}}
															>
																{user.status ===
																"active"
																	? "Deactivate"
																	: "Activate"}
															</button>
														)
													) : null}
												</td>
											</tr>
										))}
									</tbody>
								</table>
								{user_list.meta && user_list.meta.pages > 1 && (
									<>
										<Pagination
											currentPage={Number(
												user_list.meta.page
											)}
											totalCount={Number(
												user_list.meta.total
											)}
											pageSize={10}
											pathname={"/dashboard/users"}
										/>
									</>
								)}
							</>
						)
					)}
					{!loading &&
						user_list &&
						user_list.users &&
						user_list.users.length === 0 && (
							<p className="no-r">No Record Found</p>
						)}
				</div>
				<ModalComponent
					open={openModal || load}
					toggle={() => setOpenModal(!openModal)}
					title={
						modalType === "action"
							? clickedUser.status === "active"
								? `Deactivate ${clickedUser.first_name}`
								: `Activate ${clickedUser.first_name}`
							: ""
					}
				>
					{modalType === "create" ? (
						<CreateUser
							onComplete={() => setReset(!reset)}
							onCancel={() => setOpenModal(false)}
						/>
					) : modalType === "action" ? (
						<>
							<p>
								Are you sure you want to proceed with the{" "}
								{clickedUser.status === "active"
									? "Deactivation"
									: "Activation"}
								?{" "}
							</p>
							{load && <p>Please Wait...</p>}
							<div className="modal-footer">
								<button
									disabled={load}
									className="btn btn-sm btn-info"
									onClick={actionHandler}
								>
									Yes
								</button>
								<button
									disabled={load}
									className="btn btn-sm btn-danger"
									onClick={() => setOpenModal(false)}
								>
									No
								</button>
							</div>
						</>
					) : modalType === "role" ? (
						<ChangeRole
							user={clickedUser}
							onComplete={() => setReset(!reset)}
							onCancel={() => setOpenModal(false)}
						/>
					) : (
						<></>
					)}
				</ModalComponent>
			</div>
		</div>
	);
};

export default Users;
