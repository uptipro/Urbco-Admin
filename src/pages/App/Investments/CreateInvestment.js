import React, { useEffect, useState } from "react";
import { BsFillArrowLeftSquareFill } from "react-icons/bs";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import userService from "../../../redux/users/userService";
import Loader from "../../../component/Loader";
import propertyService from "../../../redux/properties/propertyService";
import CurrencyInput from "react-currency-input-field";
import { displayError } from "../../../redux/error";
import PaymentGateway from "./PaymentGateway";
import { toast } from "react-hot-toast";
import investmentService from "../../../redux/investment/investmentService";

const CreateInvestment = () => {
  const navigate = useNavigate();
  const { user_details } = useSelector((state) => state.auth);

  const [drawer, setDrawer] = useState(false);
  const [drawerType, setDrawerType] = useState("property");

  const [investorType, setInvestorType] = useState("offline");
  const [investorDetails, setInvestorDetails] = useState({});
  const [propertyDetail, setPropertyDetail] = useState({});
  const [investors, setInvestors] = useState([]);
  const [properties, setProperties] = useState([]);
  const [paymentMode, setPaymentMode] = useState("offline");
  const [fractionBought, setFractionBought] = useState("");
  const [percentage, setPercentage] = useState("");
  const [plan, setPlan] = useState("");
  const [discount, setDiscount] = useState(0);
  const [amount, setAmount] = useState(0);
  const [check, setCheck] = useState(false);

  const [search, setSearch] = useState("");
  const [searchLoad, setSearchLoad] = useState(false);
  const [loadGateway, setLoadGateway] = useState(false);
  const [gatewayDetails, setGatewayDetails] = useState({});
  const [load, setLoad] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (plan) {
      getAmountToPay();
    }
  }, [fractionBought, plan, percentage]);

  const searchInvestor = async (val) => {
    setSearch(val);
    if (val.length > 1) {
      try {
        setSearchLoad(true);
        let res = await userService.searchInvestors(
          user_details.access_token,
          val,
        );
        setSearchLoad(false);
        if (res && res.investors) {
          setInvestors(res.investors);
        }
      } catch (err) {
        setSearchLoad(false);
        console.log(err);
      }
    }
  };

  const searchProperty = async (val) => {
    setSearch(val);
    if (val.length > 1) {
      try {
        setSearchLoad(true);
        let res = await propertyService.searchProperties(
          user_details.access_token,
          val,
        );
        setSearchLoad(false);
        if (res && res.data && res.data.properties) {
          setProperties(res.data.properties);
        }
      } catch (err) {
        setSearchLoad(false);
        console.log(err);
      }
    }
  };

  const getAmountToPay = () => {
    let totalAmount = propertyDetail.cost_per_fraction * fractionBought;
    let amountPaid;
    if (plan === "csp") {
      setDiscount(propertyDetail.csp.discount);
      amountPaid =
        totalAmount - (propertyDetail.csp.discount * totalAmount) / 100;
    } else if (plan === "opbp") {
      setDiscount(propertyDetail.opbp.discount);
      amountPaid =
        totalAmount - (propertyDetail.opbp.discount * totalAmount) / 100;
    } else if (plan === "optp") {
      setDiscount(propertyDetail.optp.discount);
      if (propertyDetail.optp.percent.includes(`${percentage}`)) {
        let total =
          totalAmount - (propertyDetail.optp.discount * totalAmount) / 100;
        console.log(total, "Total");
        console.log(percentage, "p");
        amountPaid = (percentage * total) / 100;
      } else {
        amountPaid = 0;
      }
    } else {
      amountPaid = totalAmount;
    }
    setAmount(amountPaid);
  };

  const submitHandler = () => {
    if (amount > 0) {
      if (paymentMode === "offline") {
        investmentHandler();
      } else {
        initiatePayment();
      }
    } else {
      alert("Amount must be greater than 0");
    }
  };

  const investmentHandler = async () => {
    try {
      setLoad(true);
      let data = {
        property: propertyDetail._id,
        investor: investorDetails && investorDetails._id,
        payment_plan: plan,
        optp_percent: Number(percentage),
        fractions_bought: fractionBought,
        new_investor: check,
      };
      let res = await investmentService.createInvestment(
        user_details.access_token,
        data,
      );
      setLoad(false);
      if (res) {
        toast.success("Investment has been made", {
          position: "top-right",
        });
        navigate(-1);
      }
    } catch (err) {
      setLoad(false);
      displayError(err, true);
    }
  };

  const initiatePayment = async () => {
    try {
      setLoad(true);
      let data = {
        property: propertyDetail._id,
        investor: investorDetails && investorDetails._id,
        payment_plan: plan,
        optp_percent: Number(percentage),
        fractions_bought: fractionBought,
      };
      let res = await investmentService.initiatePayment(
        user_details.access_token,
        data,
      );
      if (res && res.transaction_ref) {
        setGatewayDetails({
          tx_ref: res.transaction_ref,
          amount: res.amount,
        });
        setLoadGateway(true);
      } else {
        alert("Something went wrong");
      }
      setLoad(false);
    } catch (err) {
      setLoad(false);
      displayError(err, true);
    }
  };

  return (
    <div className="property-create">
      <button className="back" onClick={() => navigate(-1)}>
        <BsFillArrowLeftSquareFill />
        <span>Back</span>
      </button>
      {(user_details.user_type === "admin" ||
        (user_details.role_id &&
          user_details.role_id.permissions.includes("create-investment"))) && (
        <div className="card">
          <div className="card-header">
            <h6>Setup an Investment</h6>
          </div>
          <div className="card-body">
            {loadGateway ? (
              <PaymentGateway
                initiate={gatewayDetails}
                onCancel={() => setLoadGateway(false)}
              />
            ) : (
              <div className="form">
                <div className="row">
                  <div className="col-lg-6">
                    <label>Investor</label>
                    <select
                      disabled={load}
                      value={investorType}
                      onChange={(e) => setInvestorType(e.target.value)}
                    >
                      <option value={"offline"}>Offline</option>
                      <option value={"registered"}>Registered Investor</option>
                    </select>
                    <div>
                      <input
                        type="checkbox"
                        value={check}
                        onChange={(e) => setCheck(e.target.checked)}
                      />
                      <span
                        style={{
                          marginLeft: 5,
                          fontSize: "0.9rem",
                        }}
                      >
                        Has he previously invested on this property?
                      </span>
                    </div>
                    {investorType == "registered" && (
                      <div className="row align-items-center">
                        <div className="col-8">
                          <label>Investor Details</label>
                          <input
                            value={
                              investorDetails._id
                                ? investorDetails.business_name ||
                                  `${investorDetails.first_name} ${investorDetails.last_name}`
                                : ""
                            }
                            disabled
                          />
                        </div>
                        <div className="col-4">
                          <button
                            className="main-btn sm"
                            onClick={() => {
                              setDrawerType("investor");
                              setDrawer(true);
                              setSearch("");
                            }}
                            disabled={load}
                          >
                            Search
                          </button>
                        </div>
                      </div>
                    )}
                    <div className="row align-items-center">
                      <div className="col-8">
                        <label>Property</label>
                        <input value={propertyDetail.name} disabled />
                      </div>
                      <div className="col-4">
                        <button
                          className="main-btn sm"
                          onClick={() => {
                            setDrawerType("property");
                            setDrawer(true);
                            setSearch("");
                          }}
                          disabled={load}
                        >
                          Search
                        </button>
                      </div>
                    </div>
                    {propertyDetail._id && (
                      <>
                        <label>Purchase Plan</label>
                        <select
                          value={plan}
                          onChange={(e) => setPlan(e.target.value)}
                          disabled={load}
                        >
                          <option value="">Select</option>
                          {propertyDetail.status === "design" && (
                            <>
                              <option value="opbp">
                                Offline Purchase Bullet Payment
                              </option>
                              <option value="optp">
                                Off-plan Purchase Tranche Payment
                              </option>
                            </>
                          )}
                          {propertyDetail.status === "construction" && (
                            <option value="csp">
                              Construction Stage Purchase
                            </option>
                          )}
                        </select>
                        {plan === "optp" && (
                          <>
                            <label>Percentage</label>
                            <select
                              value={percentage}
                              onChange={(e) => setPercentage(e.target.value)}
                              disabled={load}
                            >
                              <option value="">Select</option>
                              {propertyDetail.optp.percent
                                .split(",")
                                .map((o, i) => (
                                  <option value={o} key={i + 0}>
                                    {o}%
                                  </option>
                                ))}
                            </select>
                          </>
                        )}
                        <label>Discount</label>
                        <input
                          type="number"
                          disabled
                          value={discount}
                          onChange={(e) => setDiscount(e.target.value)}
                        />
                        <label>Fractions Bought</label>
                        <input
                          type="number"
                          value={fractionBought}
                          onChange={(e) => setFractionBought(e.target.value)}
                          max={
                            propertyDetail.total_fractions -
                            propertyDetail.fractions_taken
                          }
                          disabled={load}
                        />
                        <label>Total Amount to Pay</label>

                        <CurrencyInput
                          name="input-name"
                          placeholder=""
                          value={amount}
                          decimalsLimit={2}
                          onValueChange={(value, name) => setAmount(value)}
                          prefix={"₦ "}
                          disabled
                        />
                        <label>Payment Mode</label>
                        <select
                          value={paymentMode}
                          onChange={(e) => setPaymentMode(e.target.value)}
                          disabled={load}
                        >
                          <option value="">Select</option>
                          <option value="offline">Made Offline</option>
                          <option value="paystack">Use Paystack</option>
                        </select>
                        <div className="mt-3 text-center">
                          <button
                            disabled={load}
                            className="main-btn"
                            onClick={submitHandler}
                          >
                            {load ? "Loading..." : "Setup Investment"}
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {drawer && !load && (
        <div className="fixed-search shadow">
          <div className="text-end mb-3">
            <button className="main-btn sm" onClick={() => setDrawer(false)}>
              Close
            </button>
          </div>
          <div className="form">
            <label>
              {drawerType === "property"
                ? "Search Property (Ref or Name)"
                : "Search Investor (Business Name or Contact Details)"}
            </label>
            <input
              value={search}
              onChange={(e) =>
                drawerType === "property"
                  ? searchProperty(e.target.value)
                  : searchInvestor(e.target.value)
              }
            />
          </div>
          {searchLoad ? (
            <Loader />
          ) : (
            <div className="result">
              {drawerType === "investor"
                ? investors.map((i) => (
                    <div
                      className="result-box shadow-sm"
                      key={i._id}
                      onClick={() => {
                        drawerType === "property"
                          ? setPropertyDetail(i)
                          : setInvestorDetails(i);
                        setDrawer(false);
                      }}
                    >
                      {i.business_name && <p>{i.business_name}</p>}

                      {i.first_name && (
                        <p>
                          {i.first_name} {i.last_name}
                        </p>
                      )}

                      <div className="text-end">
                        <p>Select</p>
                      </div>
                    </div>
                  ))
                : properties.map((i) => (
                    <div
                      className="result-box shadow-sm"
                      key={i._id}
                      onClick={() => {
                        drawerType === "property"
                          ? setPropertyDetail(i)
                          : setInvestorDetails(i);
                        setDrawer(false);
                      }}
                    >
                      {i.ref && <p>{i.ref}</p>}

                      {i.name && <p>{i.name}</p>}
                      <div className="text-end">
                        <p>Select</p>
                      </div>
                    </div>
                  ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CreateInvestment;
