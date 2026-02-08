import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getInvestments } from "../../../redux/investment/investmentSlice";
import Loader from "../../../component/Loader";
import { frontUrl } from "../../../redux/config";
import { formatCurrency } from "../../../utils/currencyFormatter";

const Investments = () => {
	const navigate = useNavigate();

	const dispatch = useDispatch();

	const params = useParams();

	const { user_details } = useSelector((state) => state.auth);
	const { list, loading } = useSelector(
		(state) => state.investments
	);

	const [plan, setPlan] = useState("");
	// const [page, setPage] = useState(1);

	useEffect(() => {
		window.scrollTo(0, 0);
		dispatch(
			getInvestments({
				token: user_details.access_token,
				plan,
				page,
				investor: params.id,
			})
		);
	}, [plan, page, params]);

	return (
		<div>
			<div className="table-div mt-3">
				<div className="filter">
					<select
						value={plan}
						onChange={(e) => setPlan(e.target.value)}
					>
						<option value={""}>Filter by Payment Plan</option>
						<option value={"opbp"}>
							Off-plan Purchase Bullet Payment
						</option>
						<option value={"csp"}>
							Construction Stage Purchase
						</option>
						<option value={"optp"}>
							Off-plan Purchase Tranche Payment
						</option>
					</select>
				</div>
				<div className="table-responsive">
					{loading ? (
						<Loader />
					) : (
						list &&
						list.investments && (
							<>
								<table className="table table-bordered">
									<thead>
										<tr>
											<th>Investor</th>
											<th>Fractions Bought</th>
											<th>Payment Plan</th>
											<th>Amount Paid</th>
											<th>Discount</th>
											<th>Property</th>
											<th>Payment Reference</th>
										</tr>
									</thead>
									<tbody>
										{list.investments.map((l) => (
											<tr key={l._id}>
												<td className="wide">
													{l.investor &&
														`${l.investor.first_name} ${l.investor.last_name}`}
												</td>
												<td>{l.fractions_bought}</td>
												<td>
													{l.payment_plan === "opbp"
														? "Off-plan Purchase Bullet Payment"
														: l.payment_plan ===
														  "optp"
														? "Off-plan Purchase Tranche Payment"
														: l.payment_plan ===
														  "csp"
														? "Construction Stage Purchase"
														: "Full Payment"}
												</td>
												<td>
													₦
													{formatCurrency(
														l.amount_paid
													)}
												</td>
												<td>
													₦
													{formatCurrency(
														l.total_amount -
															l.amount_paid
													)}
												</td>
												<td>
													<a
														href={`${frontUrl}/projects/${l.property.ref}`}
														target="_blank"
													>
														{l.property.name}
													</a>
												</td>
												<td>
													{l.payment
														? l.payment
																.transaction_ref
														: "Offline"}
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</>
						)
					)}
				</div>
			</div>
		</div>
	);
};

export default Investments;
