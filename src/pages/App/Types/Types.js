import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTypes } from "../../../redux/features/featureSlice";
import dateFormat from "dateformat";
import Loader from "../../../component/Loader";
import ModalComponent from "../../../component/ModalComponent";
import CreateType from "./CreateType";
import { CSVLink } from "react-csv";

const Types = () => {
	const dispatch = useDispatch();

	const [openModal, setOpenModal] = useState(false);
	const [clickedType, setClickedType] = useState({});
	const [status, setStatus] = useState("");
	// Removed unused 'load' and 'setLoad'
	const [reset, setReset] = useState(false);

	const headers = [
		{ label: "Name", key: "name" },
		{ label: "Status", key: "status" },
	];

	const { types, loading } = useSelector((state) => state.features);
	const { user_details } = useSelector((state) => state.auth);

	useEffect(() => {
		dispatch(getTypes({ token: user_details.access_token, status }));
	}, [reset, status, dispatch, user_details.access_token]);

	return (
		<>
			<div className="table-div mt-5">
				<div className="head">
					<div></div>
					{user_details.role_id &&
						user_details.role_id.permissions.includes(
							"create-types"
						) && (
							<button
								className="main-btn"
								onClick={() => {
									setClickedType({});
									setOpenModal(true);
								}}
							>
								+ New Property Type
							</button>
						)}
				</div>
				<div className="filter align">
					<select
						value={status}
						onChange={(e) => setStatus(e.target.value)}
					>
						<option value={""}>Status</option>
						<option value={"active"}>Active</option>
						<option value={"inactive"}>Inactive</option>
						<option value={"deleted"}>Deleted</option>
					</select>
					{types && (
						<CSVLink
							data={types}
							headers={headers}
							className="main-btn"
							filename="types.csv"
						>
							Export CSV
						</CSVLink>
					)}
				</div>
				<div className="table-responsive">
					{loading ? (
						<Loader />
					) : (
						types &&
						Array.isArray(types) && (
							<>
								<table className="table table-bordered">
									<thead>
										<tr>
											<th>Name</th>
											<th>Status</th>
											<th>Updated At</th>
											<th>Actions</th>
										</tr>
									</thead>
									<tbody>
										{types.map((feature, idx) => (
											<tr key={feature._id || idx}>
												<td
													style={{
														textTransform: "capitalize",
													}}
												>
													{feature.name}
												</td>
												<td>{feature.status}</td>
												<td>
													{dateFormat(
														feature.updatedAt,
														"mmmm dS, yyyy"
													)}
												</td>
												<td>
													{user_details.role_id &&
														user_details.role_id.permissions.includes(
															"edit-types"
														) && (
															<a
																href="#"
																onClick={(e) => {
																	e.preventDefault();
																	setClickedType(
																		feature
																	);

																	setOpenModal(
																		true
																	);
																}}
															>
																Edit
															</a>
														)}
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</>
						)
					)}
					{!loading && types && types.length === 0 && (
						<p className="no-r">No Record Found</p>
					)}
				</div>
				<ModalComponent
					open={openModal}
					toggle={() => setOpenModal(!openModal)}
					title={clickedType._id ? "Edit Type" : "Create Type"}
				>
					<CreateType
						details={clickedType}
						onComplete={() => setReset(!reset)}
						onCancel={() => setOpenModal(false)}
					/>
				</ModalComponent>
			</div>
		</>
	);
};

export default Types;
