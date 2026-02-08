import React, { useEffect, useState } from "react";
import { BsCloudUpload } from "react-icons/bs";
import { displayError } from "../redux/error";
import propertyService from "../redux/properties/propertyService";
import { useDispatch, useSelector } from "react-redux";
import { getFeatures, getTypes } from "../redux/features/featureSlice";
import { AiOutlineCheck } from "react-icons/ai";
import { RxCross2 } from "react-icons/rx";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";
import { useNavigate } from "react-router-dom";
import Loader from "./Loader";
import CurrencyInput from "react-currency-input-field";
import { Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap";
import dateFormat from "dateformat";
import { toast } from "react-hot-toast";
import { lagosLGAs } from "../utils/cities";

const PropertyForm = ({ propertyDetails }) => {
	const dispatch = useDispatch();

	const navigate = useNavigate();

	const { list, types } = useSelector((state) => state.features);
	const { user_details } = useSelector((state) => state.auth);

	const [activeTab, setActiveTab] = useState("1");

	const [haveUrl, setHaveUrl] = useState(false);
	const [url, setUrl] = useState("");
	const [imageFor, setImageFor] = useState("");
	const [previewSource, setPreviewSource] = useState("");
	const [selectedFile, setSelectedFile] = useState("");
	const [uploading, setUploading] = useState(false);
	const [selectedFeature, setSelectedFeature] = useState("");
	const [selectedValue, setSelectedValue] = useState("");
	const [load, setLoad] = useState(false);
	const [ref, setRef] = useState("");
	const [totalUnit, setTotalUnit] = useState("");
	const [totalFraction, setTotalFraction] = useState("");
	const [fractionPerUnit, setFractionPerUnit] = useState("");
	const [costUnit, setCostUnit] = useState("");
	const [costFractions, setCostFractions] = useState("");
	const [images, setImages] = useState([]);
	const [name, setName] = useState("");
	const [type, setType] = useState("");
	const [features, setFeatures] = useState([]);
	const [details, setDetails] = useState({
		bathroom: "",
		toilet: "",
		bedroom: "",
		kitchen: "",
	});
	const [totalPrice, setTotalPrice] = useState("");
	const [address, setAddress] = useState("");
	const [city, setCity] = useState("");
	const [state, setState] = useState("");
	const [areaSqm, setAreaSqm] = useState("");
	const [description, setDescription] = useState("");
	const [shortDescription, setShortDescription] = useState("");
	const [status, setStatus] = useState("");
	const [cspD, setCspD] = useState("");
	const [cspV, setCspV] = useState("");
	const [opbpD, setOpbpD] = useState("");
	const [opbpV, setOpbpV] = useState("");
	const [optpD, setOptpD] = useState("");
	const [optpV, setOptpV] = useState("");
	const [optpStage, setOptpStage] = useState("");
	const [optpPercent, setOptpPercent] = useState("");
	const [rentals, setRentals] = useState({
		rent_per_quater: "",
		rent_frequency: "",
		annual_yield_percent: "",
		yield_assumption_percent: "",
		first_dividend_date: "",
	});
	const [capitalAppreciation, setCapitalAppreciation] = useState("");
	const [constructionStart, setConstructionStart] = useState("");
	const [constructionEnd, setConstructionEnd] = useState("");
	const [roofingDate, setRoofingDate] = useState("");

	useEffect(() => {
		dispatch(
			getTypes({ token: user_details.access_token, status: "active" })
		);
		dispatch(
			getFeatures({ token: user_details.access_token, status: "active" })
		);
	}, []);

	useEffect(() => {
		if (propertyDetails && propertyDetails._id) {
			setRef(propertyDetails.ref);
			setImages(propertyDetails.images);
			setName(propertyDetails.name);
			setType(propertyDetails.type._id);
			setAddress(propertyDetails.address);
			setCity(propertyDetails.city);
			setState(propertyDetails.state);
			setTotalPrice(propertyDetails.total_price);
			setAreaSqm(propertyDetails.areaSqm);
			setDescription(propertyDetails.description);
			setShortDescription(propertyDetails.short_description);
			setFeatures(
				propertyDetails.features.map((f) => {
					return {
						feature: f.feature._id,
						value: f.value,
						name: f.feature.name,
					};
				})
			);
			setDetails(propertyDetails.details);
			setStatus(propertyDetails.status);
			setTotalUnit(propertyDetails.total_units);
			setTotalFraction(propertyDetails.total_fractions);
			setFractionPerUnit(
				propertyDetails.total_fractions / propertyDetails.total_units
			);
			setCostFractions(propertyDetails.cost_per_fraction);
			setCostUnit(propertyDetails.cost_per_unit);
			setCspD(propertyDetails.csp.discount);
			setCspV(propertyDetails.csp.volume_available);
			setOpbpD(propertyDetails.opbp.discount);
			setOpbpV(propertyDetails.opbp.volume_available);
			setOptpD(propertyDetails.optp.discount);
			setOptpV(propertyDetails.optp.volume_available);
			setOptpStage(propertyDetails.optp.stages);
			setOptpPercent(propertyDetails.optp.percent);
			setRentals(propertyDetails.rentals);
			setCapitalAppreciation(
				propertyDetails.capital_appreciation_percent
			);
			setConstructionEnd(propertyDetails.construction_end_date);
			setConstructionStart(propertyDetails.construction_start_date);
			setRoofingDate(propertyDetails.roofing_date);
		}
	}, [propertyDetails]);

	useEffect(() => {
		changePrices();
	}, [totalUnit, fractionPerUnit, costFractions]);

	const changePrices = () => {
		let totalPrice = totalUnit * fractionPerUnit * costFractions;
		setTotalPrice(totalPrice);
		setTotalFraction(fractionPerUnit * totalUnit);
		setCostUnit(costFractions * fractionPerUnit);
	};

	const handleFileInputChange = (e) => {
		const file = e.target.files[0];
		previewFile(file);
		setSelectedFile(file);
		e.target.value = null;
		setHaveUrl(false);
	};

	const previewFile = (file) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onloadend = () => {
			setPreviewSource(reader.result);
		};
	};

	const handleSubmitFile = (e) => {
		e.preventDefault();
		if (!selectedFile) return;
		const reader = new FileReader();
		reader.readAsDataURL(selectedFile);
		reader.onloadend = () => {
			uploadImage(reader.result);
		};
		reader.onerror = () => {
			console.error("Error");
		};
	};

	const uploadImage = async (file) => {
		try {
			setUploading(true);
			let res = await propertyService.uploadImage(file);
			setUploading(false);
			if (res && res.data) {
				setImages((img) => [
					...img,
					{ order: images.length + 1, for: imageFor, url: res.data },
				]);
				setSelectedFile("");
				setPreviewSource("");
				setImageFor("");
			}
		} catch (err) {
			setUploading(false);
			displayError(err, true);
		}
	};

	const submitUrl = () => {
		if (url) {
			if (url.startsWith("http")) {
				setImages((img) => [
					...img,
					{ order: images.length + 1, for: imageFor, url },
				]);
				setUrl("");
			} else {
				alert("Invalid Image URL");
			}
		} else {
			alert("Enter an Image URL");
		}
	};

	const removeImage = (img) => {
		if (window.confirm("Are you sure you want to remove this Image?")) {
			let filter = images.filter((f) => f.url !== img.url);
			setImages(filter);
		}
	};

	const addFeature = () => {
		if (selectedFeature) {
			let find = features.find((f) => f.feature === selectedFeature);
			let getName = list.find((l) => l._id === selectedFeature);

			if (!find) {
				setFeatures((f) => [
					...f,
					{
						feature: selectedFeature,
						value: selectedValue,
						name: getName.name,
					},
				]);
				setSelectedFeature("");
				setSelectedValue("");
			} else {
				alert("Feature already added.");
				setSelectedFeature("");
			}
		}
	};

	const removeFeature = (id) => {
		let arr = features.filter((f) => f.feature !== id);
		setFeatures(arr);
	};

	const submitHandler = async () => {
		if (name && type && description && state && city && address) {
			let data = {
				name,
				images,
				features,
				details,
				type,
				description,
				short_description: shortDescription,
				state,
				city,
				address,
				areaSqm,
				status,
				ref,
				total_units: 32,
				fraction_per_unit: Number(fractionPerUnit),
				cost_per_fraction: Number(costFractions),
				rentals,
				capital_appreciation_percent: capitalAppreciation,
				csp: {
					discount: cspD,
					volume_available: cspV,
				},
				opbp: {
					discount: opbpD,
					volume_available: opbpV,
				},
				optp: {
					discount: optpD,
					volume_available: optpV,
					stages: optpStage,
					percent: optpPercent,
				},
				roofing_date: roofingDate,
				construction_start_date: constructionStart,
				construction_end_date: constructionEnd,
			};
			try {
				setLoad(true);
				let res;
				if (propertyDetails && propertyDetails._id) {
					res = await propertyService.editProperty(
						user_details.access_token,
						propertyDetails._id,
						data
					);
				} else {
					res = await propertyService.createProperty(
						user_details.access_token,
						data
					);
				}

				setLoad(false);
				if (res) {
					navigate("/dashboard/properties");
				}
			} catch (err) {
				setLoad(false);
				displayError(err, true);
			}
		} else {
			alert("Fill in all required fields");
		}
	};

	const statusHandler = async () => {
		if (window.confirm("Are you sure you want to upgrade this status?")) {
			if (roofingDate && constructionEnd && constructionStart) {
				let data = {};
				try {
					setLoad(true);
					let res = await propertyService.editPropertyStatus(
						user_details.access_token,
						propertyDetails._id,
						data
					);
					setLoad(false);
					if (res) {
						navigate("/dashboard/properties");
						toast.success("Status has been updated", {
							position: "top-right",
						});
					}
				} catch (err) {
					setLoad(false);
					displayError(err, true);
				}
			} else {
				alert(
					"You need to provide the construction and roofing dates."
				);
			}
		}
	};

	return (
		<div className="card-body">
			{load ? (
				<div className="load-create">
					<Loader />
					<p className="text-center">
						Please Hold while we create the property
					</p>
				</div>
			) : (
				<div>
					<Nav tabs>
						<NavItem>
							<NavLink
								className={activeTab === "1" ? "active" : ""}
								onClick={(e) => {
									e.preventDefault();
									setActiveTab("1");
								}}
								href="/#"
							>
								Images
							</NavLink>
						</NavItem>
						<NavItem>
							<NavLink
								className={activeTab === "2" ? "active" : ""}
								onClick={(e) => {
									e.preventDefault();
									setActiveTab("2");
								}}
								href="/#"
							>
								Details
							</NavLink>
						</NavItem>
						<NavItem>
							<NavLink
								className={activeTab === "3" ? "active" : ""}
								onClick={(e) => {
									e.preventDefault();
									setActiveTab("3");
								}}
								href="/#"
							>
								Prices
							</NavLink>
						</NavItem>
						<NavItem>
							<NavLink
								className={activeTab === "4" ? "active" : ""}
								onClick={(e) => {
									e.preventDefault();
									setActiveTab("4");
								}}
								href="/#"
							>
								Features
							</NavLink>
						</NavItem>
						<NavItem>
							<NavLink
								className={activeTab === "5" ? "active" : ""}
								onClick={(e) => {
									e.preventDefault();
									setActiveTab("5");
								}}
								href="/#"
							>
								Payment Plan | Rentals
							</NavLink>
						</NavItem>
						<NavItem>
							<NavLink
								className={activeTab === "6" ? "active" : ""}
								onClick={(e) => {
									e.preventDefault();
									setActiveTab("6");
								}}
								href="/#"
							>
								Dates & Status
							</NavLink>
						</NavItem>
					</Nav>
					<TabContent activeTab={activeTab}>
						<TabPane tabId="1">
							<div className="form pt-3">
								<div className="left-track">
									<div className="image-upload">
										<div className="img-preview">
											{previewSource ? (
												<img
													src={previewSource}
													alt="Preview"
												/>
											) : (
												<p>Image Preview</p>
											)}
										</div>
										<div>
											<label>What's on the Image?</label>
											<input
												value={imageFor}
												disabled={uploading}
												onChange={(e) =>
													setImageFor(e.target.value)
												}
												placeholder=""
											/>
											<div className="text-end">
												<div className="upload-btn-wrapper">
													<button className="btn">
														<BsCloudUpload
															color="#852472"
															size={25}
														/>
													</button>
													<input
														type="file"
														name="myfile"
														disabled={uploading}
														onChange={
															handleFileInputChange
														}
													/>
													<div className="mt-2">
														<a
															href="/#"
															onClick={(e) => {
																e.preventDefault();
																setHaveUrl(
																	true
																);
															}}
														>
															You have an Image
															Url?
														</a>
													</div>
													{previewSource && (
														<div
															className="mt-2"
															onClick={
																handleSubmitFile
															}
														>
															<button
																className="main-btn"
																disabled={
																	uploading
																}
															>
																{uploading
																	? "Hold on.."
																	: "Upload"}
															</button>
														</div>
													)}
												</div>
											</div>
										</div>
									</div>
									<div className="uploaded mt-3">
										{haveUrl && (
											<div className="div-haveurl">
												<input
													placeholder="Image Url"
													value={url}
													onChange={(e) =>
														setUrl(e.target.value)
													}
												/>
												<button
													className="main-btn"
													onClick={submitUrl}
												>
													Submit
												</button>
											</div>
										)}
										<label>Uploaded Images</label>

										{images.length > 0 ? (
											<div className="list mt-2">
												{images.map((img, i) => (
													<div
														className="file"
														key={i + 1}
													>
														<a
															target="_blank"
															href=""
														>
															<img
																src={img.url}
																alt="Uploaded"
															/>
														</a>
														<span>{img.for}</span>
														<button
															onClick={() =>
																removeImage(img)
															}
														>
															X
														</button>
													</div>
												))}
											</div>
										) : (
											<p>
												No Image has been uploaded yet.
											</p>
										)}
									</div>
								</div>
							</div>
						</TabPane>
						<TabPane tabId="2">
							<div className="form pt-3">
								<div className="row">
									<div className="col-lg-6 mb-3">
										<label>
											Ref <span>*</span>
										</label>
										<input
											value={ref}
											onChange={(e) =>
												setRef(e.target.value)
											}
											disabled={
												propertyDetails &&
												propertyDetails._id
													? true
													: false
											}
										/>
										<label>
											Name <span>*</span>
										</label>
										<input
											value={name}
											onChange={(e) =>
												setName(e.target.value)
											}
										/>
										<label>
											Type <span>*</span>
										</label>
										<select
											value={type}
											onChange={(e) =>
												setType(e.target.value)
											}
										>
											<option value={""}>
												Select One
											</option>
											{types &&
												types.map((ty) => (
													<option
														key={ty._id}
														value={ty._id}
													>
														{ty.name}
													</option>
												))}
										</select>
										<label>
											Area Square Meter <span>*</span>
										</label>
										<input
											value={areaSqm}
											type="number"
											onChange={(e) =>
												setAreaSqm(e.target.value)
											}
										/>
										<label>
											State located <span>*</span>
										</label>
										<select
											value={state}
											onChange={(e) =>
												setState(e.target.value)
											}
										>
											<option value={""}>
												Select One
											</option>
											<option value={"lagos"}>
												Lagos
											</option>
										</select>
										<label>
											City <span>*</span>
										</label>
										<select
											value={city}
											onChange={(e) =>
												setCity(e.target.value)
											}
										>
											<option value={""}>
												Select One
											</option>
											{state &&
												lagosLGAs.map((l) => (
													<option
														value={l.name}
														key={l.id}
														style={{
															textTransform:
																"capitalize",
														}}
													>
														{l.name}
													</option>
												))}
										</select>
										<label>
											Address <span>*</span>
										</label>
										<input
											value={address}
											onChange={(e) =>
												setAddress(e.target.value)
											}
										/>
									</div>
									<div className="col-lg-6 mb-3">
										<label>
											Short Description <span>*</span>
										</label>
										<textarea
											value={shortDescription}
											className="short"
											onChange={(e) =>
												setShortDescription(
													e.target.value
												)
											}
										></textarea>
										<label>
											Description <span>*</span>
										</label>
										<SunEditor
											height={250}
											value={description}
											onChange={(e) => setDescription(e)}
											setContents={description}
										/>
									</div>
								</div>
							</div>
						</TabPane>
						<TabPane tabId={"3"}>
							<div className="form pt-3">
								<div className="row">
									<div className="col-lg-6 mb-3">
										<label>
											Total Units <span>*</span>
										</label>
										<input
											value={totalUnit}
											onChange={(e) =>
												setTotalUnit(e.target.value)
											}
											type="number"
										/>
										<label>
											Fractions per Unit <span>*</span>
										</label>
										<input
											value={fractionPerUnit}
											onChange={(e) =>
												setFractionPerUnit(
													e.target.value
												)
											}
											type="number"
										/>
										<label>
											Cost Per Fractions <span>*</span>
										</label>
										<CurrencyInput
											name="input-name"
											placeholder=""
											value={costFractions}
											decimalsLimit={2}
											onValueChange={(value, name) =>
												setCostFractions(value)
											}
											prefix={"₦ "}
										/>
									</div>
									<div className="col-lg-6 mb-3">
										<label>
											Total Fractions <span>*</span>
										</label>
										<input
											value={totalFraction}
											onChange={(e) =>
												setTotalFraction(e.target.value)
											}
											type="number"
											disabled={true}
										/>
										<label>
											Cost Per Unit <span>*</span>
										</label>
										<CurrencyInput
											name="input-name"
											placeholder=""
											value={costUnit}
											decimalsLimit={2}
											onValueChange={(value, name) =>
												setCostUnit(value)
											}
											prefix={"₦ "}
											disabled={true}
										/>
										<label>
											Total Price <span>*</span>
										</label>
										<CurrencyInput
											name="input-name"
											placeholder=""
											value={totalPrice}
											decimalsLimit={2}
											onValueChange={(value, name) =>
												setTotalPrice(value)
											}
											prefix={"₦ "}
											disabled={true}
										/>
									</div>
								</div>
							</div>
						</TabPane>
						<TabPane tabId={"4"}>
							<div className="form pt-3">
								<div className="row">
									<div className="col-lg-6">
										<div className="row">
											<div className="col-6">
												<label>Feature</label>
												<input
													value={"Bedroom"}
													readOnly
												/>
											</div>
											<div className="col-6">
												<label>Count</label>
												<input
													type="number"
													value={details.bedroom}
													onChange={(e) =>
														setDetails({
															...details,
															bedroom:
																e.target.value,
														})
													}
												/>
											</div>
										</div>
										<div className="row">
											<div className="col-6">
												<input
													value={"Kitchen"}
													readOnly
												/>
											</div>
											<div className="col-6">
												<input
													type="number"
													value={details.kitchen}
													onChange={(e) =>
														setDetails({
															...details,
															kitchen:
																e.target.value,
														})
													}
												/>
											</div>
										</div>
										<div className="row">
											<div className="col-6">
												<input
													value={"Bathroom"}
													readOnly
												/>
											</div>
											<div className="col-6">
												<input
													type="number"
													value={details.bathroom}
													onChange={(e) =>
														setDetails({
															...details,
															bathroom:
																e.target.value,
														})
													}
												/>
											</div>
										</div>
										<div className="row">
											<div className="col-6">
												<input
													value={"Toilet"}
													readOnly
												/>
											</div>
											<div className="col-6">
												<input
													type="number"
													value={details.toilet}
													onChange={(e) =>
														setDetails({
															...details,
															toilet: e.target
																.value,
														})
													}
												/>
											</div>
										</div>
										{features.length > 0 &&
											features.map((f) => (
												<div
													className="row"
													key={f.feature}
												>
													<div className="col-6">
														<input
															value={f.name}
															readOnly
														/>
													</div>
													<div className="col-6">
														<div className="row">
															<div className="col-10">
																<input
																	value={
																		f.value
																	}
																	readOnly
																/>
															</div>
															<div className="col-2">
																<div className="check-btn">
																	<button
																		className="shadow-sm"
																		onClick={() =>
																			removeFeature(
																				f.feature
																			)
																		}
																	>
																		<RxCross2 />
																	</button>
																</div>
															</div>
														</div>
													</div>
												</div>
											))}
										<div className="row">
											<div className="col-6">
												<label>Unique Features</label>
												<select
													value={selectedFeature}
													onChange={(e) =>
														setSelectedFeature(
															e.target.value
														)
													}
												>
													<option value={""}>
														Select One
													</option>
													{list &&
														list.map((l) => (
															<option
																key={l._id}
																value={l._id}
															>
																{l.name}
															</option>
														))}
												</select>
											</div>
											<div className="col-6">
												<div className="row">
													<div className="col-10">
														<label>Value</label>
														<input
															type="number"
															value={
																selectedValue
															}
															onChange={(e) =>
																setSelectedValue(
																	e.target
																		.value
																)
															}
														/>
													</div>
													<div className="col-2">
														<div className="check-btn">
															<button
																className="shadow-sm"
																onClick={
																	addFeature
																}
															>
																<AiOutlineCheck />
															</button>
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</TabPane>
						<TabPane tabId={"5"}>
							<div className="form pt-3">
								<div className="row">
									<div className="col-lg-6 mb-3">
										<label>
											Construction Stage Discount (%)
										</label>
										<input
											type="number"
											value={cspD}
											onChange={(e) =>
												setCspD(e.target.value)
											}
											disabled={
												propertyDetails &&
												propertyDetails.status !==
													"pending"
													? true
													: false
											}
										/>
										<label>
											Construction Stage Volume Available
											(%)
										</label>
										<input
											type="number"
											value={cspV}
											onChange={(e) =>
												setCspV(e.target.value)
											}
											disabled={
												propertyDetails &&
												propertyDetails.status !==
													"pending"
													? true
													: false
											}
										/>
										<label>
											Offplan Bullet Discount (%)
										</label>
										<input
											type="number"
											value={opbpD}
											onChange={(e) =>
												setOpbpD(e.target.value)
											}
											disabled={
												propertyDetails &&
												propertyDetails.status !==
													"pending"
													? true
													: false
											}
										/>
										<label>
											Offplan Bullet Volume Available (%)
										</label>
										<input
											type="number"
											value={opbpV}
											onChange={(e) =>
												setOpbpV(e.target.value)
											}
											disabled={
												propertyDetails &&
												propertyDetails.status !==
													"pending"
													? true
													: false
											}
										/>
										<label>
											Offplan Tranche Discount (%)
										</label>
										<input
											type="number"
											value={optpD}
											onChange={(e) =>
												setOptpD(e.target.value)
											}
											disabled={
												propertyDetails &&
												propertyDetails.status !==
													"pending"
													? true
													: false
											}
										/>
										<label>
											Offplan Tranche Volume Available (%)
										</label>
										<input
											type="number"
											value={optpV}
											onChange={(e) =>
												setOptpV(e.target.value)
											}
											disabled={
												propertyDetails &&
												propertyDetails.status !==
													"pending"
													? true
													: false
											}
										/>
										<label>Offplan Tranche Stages</label>
										<input
											type="number"
											value={optpStage}
											onChange={(e) =>
												setOptpStage(e.target.value)
											}
											disabled={
												propertyDetails &&
												propertyDetails.status !==
													"pending"
													? true
													: false
											}
										/>
										<label>
											Offplan Tranche Percent Split
										</label>
										<input
											type="text"
											placeholder="Should be comma separated"
											value={optpPercent}
											onChange={(e) =>
												setOptpPercent(e.target.value)
											}
											disabled={
												propertyDetails &&
												propertyDetails.status !==
													"pending"
													? true
													: false
											}
										/>
									</div>
									<div className="col-lg-6 mb-3">
										<label>Rentals Per Quater</label>
										<CurrencyInput
											name="input-name"
											placeholder=""
											value={rentals.rent_per_quater}
											decimalsLimit={2}
											onValueChange={(value, name) =>
												setRentals({
													...rentals,
													rent_per_quater: value,
												})
											}
											prefix={"₦ "}
										/>
										<label>Rental Frequency</label>
										<input
											type="text"
											value={rentals.rent_frequency}
											onChange={(e) =>
												setRentals({
													...rentals,
													rent_frequency:
														e.target.value,
												})
											}
										/>
										<label>Annual Yield Percentage</label>
										<input
											type="number"
											value={rentals.annual_yield_percent}
											onChange={(e) =>
												setRentals({
													...rentals,
													annual_yield_percent:
														e.target.value,
												})
											}
										/>
										<label>
											Rental Yield Assumption (%)
										</label>
										<input
											type="number"
											value={
												rentals.yield_assumption_percent
											}
											onChange={(e) =>
												setRentals({
													...rentals,
													yield_assumption_percent:
														e.target.value,
												})
											}
										/>
										<label>First Dividend Date</label>
										{rentals.first_dividend_date && (
											<p className="value">
												{dateFormat(
													rentals.first_dividend_date,
													"mmmm dS, yyyy"
												)}
											</p>
										)}
										<input
											type="date"
											value={rentals.first_dividend_date}
											onChange={(e) =>
												setRentals({
													...rentals,
													first_dividend_date:
														e.target.value,
												})
											}
										/>
										<label>
											Capital Appreciation - Annual (%)
										</label>
										<input
											type="number"
											value={capitalAppreciation}
											onChange={(e) =>
												setCapitalAppreciation(
													e.target.value
												)
											}
										/>
									</div>
								</div>
							</div>
						</TabPane>
						<TabPane tabId={"6"}>
							<div className="form pt-3">
								<div className="row">
									<div className="col-lg-6 mb-3">
										<label>Construction Start Date</label>
										{constructionStart && (
											<p className="value">
												{dateFormat(
													constructionStart,
													"mmmm dS, yyyy"
												)}
											</p>
										)}
										<input
											type="date"
											value={constructionStart}
											onChange={(e) =>
												setConstructionStart(
													e.target.value
												)
											}
										/>
										<label>Construction End Date</label>
										{constructionEnd && (
											<p className="value">
												{dateFormat(
													constructionEnd,
													"mmmm dS, yyyy"
												)}
											</p>
										)}
										<input
											type="date"
											value={constructionEnd}
											onChange={(e) =>
												setConstructionEnd(
													e.target.value
												)
											}
										/>
										<label>Roofing Date</label>
										{roofingDate && (
											<p className="value">
												{dateFormat(
													roofingDate,
													"mmmm dS, yyyy"
												)}
											</p>
										)}
										<input
											type="date"
											value={roofingDate}
											onChange={(e) =>
												setRoofingDate(e.target.value)
											}
										/>
										{propertyDetails &&
											propertyDetails.status &&
											propertyDetails.status !==
												"completed" && (
												<div className="row align-items-center">
													<div className="col-12">
														<label>
															Property Status{" "}
															<span>*</span>
														</label>
														<input
															type="text"
															readOnly
															value={status}
															onChange={(e) =>
																setStatus(
																	e.target
																		.value
																)
															}
														/>
													</div>
													<div className="col-12 check-btn">
														<button
															onClick={
																statusHandler
															}
															className="shadow-sm other"
														>
															Update Status to{" "}
															{propertyDetails.status ===
															"design"
																? "Construction"
																: propertyDetails.status ===
																  "construction"
																? "Completed"
																: "Furnished"}
														</button>
													</div>
												</div>
											)}
									</div>
								</div>
								<div className="mt-4 text-center">
									<button
										onClick={submitHandler}
										className="main-btn"
									>
										{propertyDetails && propertyDetails._id
											? "Edit"
											: "Add"}{" "}
										Property
									</button>
								</div>
							</div>
						</TabPane>
					</TabContent>
				</div>
			)}
		</div>
	);
};

export default PropertyForm;
