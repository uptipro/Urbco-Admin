import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getFeatures } from "../../../redux/features/featureSlice";
import Loader from "../../../component/Loader";
import dateFormat from "dateformat";
import ModalComponent from "../../../component/ModalComponent";
import CreateFeature from "./CreateFeature";
import { CSVLink } from "react-csv";

const Features = () => {
	const dispatch = useDispatch();

	const [openModal, setOpenModal] = useState(false);
	const [clickedFeature, setClickedFeature] = useState({});
	const [status, setStatus] = useState("");
	// const [load, setLoad] = useState(false);
	const [reset, setReset] = useState(false);

	const headers = [
		{ label: "Name", key: "name" },
		{ label: "Description", key: "description" },
		{ label: "Status", key: "status" },
	];

	const { list, loading } = useSelector((state) => state.features);
	const { user_details } = useSelector((state) => state.auth);

	useEffect(() => {
		dispatch(getFeatures({ token: user_details.access_token, status }));
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [reset, status, dispatch, user_details.access_token]);

	return (
		<div className="table-div mt-5">
			<div className="head">
				<div></div>
				{user_details.role_id &&
					user_details.role_id.permissions.includes(
						"create-features"
					) && (
						<button
							className="main-btn"
							onClick={() => {
								setClickedFeature({});
								setOpenModal(true);
							}}
						>
							+ New Feature
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
				{list && (
					<CSVLink
						data={list}
						headers={headers}
						className="main-btn"
						filename="features.csv"
					>
						Export CSV
					</CSVLink>
				)}
			</div>
			<div className="table-responsive">
				{loading ? (
					<Loader />
				) : (
					list &&
					Array.isArray(list) && (
						<>
							<table className="table table-bordered">
								<thead>
									<tr>
										<th>Name</th>
										<th>Image URL</th>
										<th>Description</th>
										<th>Status</th>
										<th>Last Updated</th>
										<th>Action</th>
									</tr>
								</thead>
								<tbody>
									{list.map((feature) => (
										<tr key={feature._id}>
											<td
												style={{
													textTransform: "capitalize",
												}}
											>
												{feature.name}
											</td>
											<td>
												{feature.image ? (
													<a
															href={feature.image}
															target="_blank" rel="noreferrer"
													>
															<button type="button" onClick={() => { setClickedFeature(feature); setOpenModal(true); setStatus(feature.status); }}>
																Edit
															</button>
											</td>
											<td>
												{user_details.role_id &&
													user_details.role_id.permissions.includes(
														"edit-features"
													) && (
														<a
															href="#"
															onClick={(e) => {
																e.preventDefault();
																setClickedFeature(
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
				{!loading && list && list.length === 0 && (
					<p className="no-r">No Record Found</p>
				)}
			</div>
			<ModalComponent
				open={openModal || load}
				toggle={() => setOpenModal(!openModal)}
				title={clickedFeature._id ? "Edit Feature" : "Create Feature"}
			>
				<CreateFeature
					details={clickedFeature}
					onComplete={() => setReset(!reset)}
					onCancel={() => setOpenModal(false)}
				/>
			</ModalComponent>
		</div>
	);
};

export default Features;
