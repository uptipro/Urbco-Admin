import React, { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import Loader from "../../../component/Loader";
import { loadSettings } from "../../../redux/basic/basicSlice";
import { useDispatch, useSelector } from "react-redux";
import { displayError } from "../../../redux/error";
import basicService from "../../../redux/basic/basicService";
import { toast } from "react-hot-toast";

const Website = () => {
	const dispatch = useDispatch();

	const { settings } = useSelector((state) => state.basic);
	const { user_details } = useSelector((state) => state.auth);

	const [quote, setQuote] = useState("");
	const [quoteArthur, setQuoteArthur] = useState("");
	const [investment_insight, setInvestment] = useState("");
	const [testimonials, setTestimonials] = useState([]);
	const [tMessage, setTMessage] = useState("");
	const [tUser, setTUser] = useState("");
	const [load, setLoad] = useState(false);

	useEffect(() => {
		dispatch(loadSettings());
	}, [dispatch]);

	useEffect(() => {
		if (settings && settings._id) {
			setQuote(settings.quote);
			setInvestment(settings.investment_insight);
			setTestimonials(settings.testimonials);
			setQuoteArthur(settings.quoteArthur);
		}
	}, [settings]);

	const addTestimony = () => {
		if (tUser && tMessage) {
			setTestimonials((t) => [
				...t,
				{
					user: tUser,
					message: tMessage,
				},
			]);
			setTMessage("");
			setTUser("");
		}
	};

	const deleteTestimony = (item) => {
		setTestimonials(
			testimonials.filter(
				(t) => t.user !== item.user && t.message !== item.message
			)
		);
	};

	const updateSettings = async () => {
		try {
			setLoad(true);
			let res = await basicService.updateSettings(
				user_details.access_token,
				{
					quote,
					_id: settings._id,
					testimonials,
					investment_insight,
					quoteArthur,
				}
			);
			setLoad(false);
			if (res) {
				dispatch(loadSettings());
				toast.success(
					"Changes has been effected. Please wait while settings is updated.",
					{ position: "top-right" }
				);
			}
		} catch (err) {
			displayError(err, true);
		}
	};

	return (
		<div className="property-create">
			<div className="card">
				<div className="card-header">
					<h6>Website Content</h6>
				</div>
				{load ? (
					<div className="card-body pb-5 pt-5">
						<Loader />
					</div>
				) : (
					<div className="card-body">
						<div className="form">
							<div className="row">
								<div className="col-lg-6 mb-3">
									<label>Quote</label>
									<textarea
										value={quote}
										onChange={(e) =>
											setQuote(e.target.value)
										}
									></textarea>
								</div>
								<div className="col-lg-6 mb-3">
									<label>Quote Arthur</label>
									<input
										value={quoteArthur}
										onChange={(e) =>
											setQuoteArthur(e.target.value)
										}
									/>
									<label>Investment Insight Url</label>
									<input
										value={investment_insight}
										onChange={(e) =>
											setInvestment(e.target.value)
										}
									/>
								</div>
								<div className="col-lg-12 mb-3">
									<div className="d-flex justify-content-between">
										<h6 className="mb-3">Testimonials</h6>
									</div>
									{testimonials.length > 0 && (
										<div className="row">
											<div className="col-4">
												<label>User</label>
											</div>
											<div className="col-8">
												<label>Message</label>
											</div>
										</div>
									)}
									{testimonials.map((t, i) => (
										<div className="row mb-3" key={i + 0}>
											<div className="col-sm-4">
												<input
													value={t.user}
													readOnly
												/>
											</div>
											<div className="col-sm-7">
												<textarea
													value={t.message}
													readOnly
												></textarea>
											</div>
											<div className="col-1">
												<button
													className="shadow-sm btn btn-sm"
													onClick={() =>
														deleteTestimony(t)
													}
												>
													<FaTrash color="red" />
												</button>
											</div>
										</div>
									))}
									<div className="row mb-3">
										<div className="col-sm-4">
											<input
												value={tUser}
												onChange={(e) =>
													setTUser(e.target.value)
												}
											/>
										</div>
										<div className="col-sm-7">
											<textarea
												value={tMessage}
												onChange={(e) =>
													setTMessage(e.target.value)
												}
											></textarea>
										</div>
									</div>
									<div className="text-end">
										<button
											className="btn btn-sm btn-secondary"
											onClick={addTestimony}
										>
											+ Add Testimony
										</button>
									</div>
								</div>
							</div>
							<div className="text-center">
								<button
									className="main-btn"
									onClick={updateSettings}
								>
									Update Changes
								</button>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default Website;
