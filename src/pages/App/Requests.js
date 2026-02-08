import React, { useEffect, useState } from "react";
import Loader from "../../component/Loader";
import { useDispatch, useSelector } from "react-redux";
import {
	listRequests
} from "../../redux/users/userSlice";
// import { FiEye } from "react-icons/fi";
// import ModalComponent from "../../component/ModalComponent";
// import { displayError } from "../../redux/error";
// import userService from "../../redux/users/userService";
// import { toast } from "react-hot-toast";
import Pagination from "../../component/Pagination";
import { useLocation } from "react-router-dom";

const Requests = () => {
	const dispatch = useDispatch();

	const pageNumber =
		new URLSearchParams(useLocation().search).get("page") || 1;

	const { loading, requests } = useSelector((state) => state.users);
	const { user_details } = useSelector((state) => state.auth);

	useEffect(() => {
		dispatch(
			listRequests({
				page: pageNumber,
				token: user_details.access_token,
			})
		);
	}, [pageNumber]);

	return (
		<div className="table-div mt-5">
			<div className="head">
				<h5>
					List of Users requesting for information about a property
				</h5>
			</div>
			<div className="table-responsive">
				{loading ? (
					<Loader />
				) : (
					requests &&
					requests.requests && (
						<>
							<table className="table table-bordered">
								<thead>
									<tr>
										<th>Name</th>
										<th>Email</th>
										<th>Mobile</th>
										<th>Message</th>
									</tr>
								</thead>
								<tbody>
									{requests.requests.map((user) => (
										<tr key={user._id}>
											<td className="wide">
												{user.name}
											</td>
											<td className="wide">
												{user.email}
											</td>
											<td>{user.phone}</td>

											<td>{user.message}</td>
										</tr>
									))}
								</tbody>
							</table>
							{requests.meta && requests.meta.pages > 1 && (
								<>
									<Pagination
										currentPage={Number(requests.meta.page)}
										totalCount={Number(requests.meta.total)}
										pageSize={10}
										pathname={"/dashboard/requests"}
									/>
								</>
							)}
						</>
					)
				)}
				{!loading &&
					requests &&
					requests.requests &&
					requests.requests.length === 0 && (
						<p className="no-r">No Record Found</p>
					)}
			</div>
		</div>
	);
};

export default Requests;
