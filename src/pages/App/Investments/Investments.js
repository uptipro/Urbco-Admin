import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  getInvestmentReports,
  getInvestments,
} from "../../../redux/investment/investmentSlice";
import Loader from "../../../component/Loader";
import { formatCurrency } from "../../../utils/currencyFormatter";
import { frontUrl } from "../../../redux/config";
import { FcMoneyTransfer } from "react-icons/fc";
import { CSVLink } from "react-csv";

const Investments = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { user_details } = useSelector((state) => state.auth);
  const { list, loading, reports } = useSelector((state) => state.investments);

  const [plan, setPlan] = useState("");
  const [page, setPage] = useState(1);

  const headers = [
    {
      label: "Investor (Business or Cooperative)",
      key: "investor.business_name",
    },
    { label: "Investor (Individual or Couple)", key: "investor.last_name" },
    { label: "Fractions Bought", key: "fractions_bought" },
    { label: "Payment Plan", key: "payment_plan" },
    { label: "Amount Paid", key: "amount_paid" },
    { label: "Property", key: "property.name" },
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(getInvestmentReports({ token: user_details.access_token }));
    dispatch(
      getInvestments({
        token: user_details.access_token,
        plan,
        page,
        investor: "",
      }),
    );
  }, [plan, page]);

  return (
    <div>
      {reports && reports.total && (
        <div className="table-report mt-5">
          <div className="row">
            <div className="col-lg-4 col-sm-6 mb-3">
              <div className="box">
                <div className="money mb-2">
                  <p>Investments:</p>
                  <p className="bold">
                    ₦{formatCurrency(reports.opbp.investments)}
                  </p>
                </div>
                <div className="money mb-3">
                  <p>Discount:</p>
                  <p className="bold">
                    ₦{formatCurrency(reports.opbp.discount)}
                  </p>
                </div>
                <div className="title">
                  <FcMoneyTransfer size={24} />
                  <p className="ms-3">Off-plan Purchase Bullet Payment</p>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-sm-6 mb-3">
              <div className="box">
                <div className="money mb-2">
                  <p>Investments:</p>
                  <p className="bold">
                    ₦{formatCurrency(reports.optp.investments)}
                  </p>
                </div>
                <div className="money mb-3">
                  <p>Discount:</p>
                  <p className="bold">
                    ₦{formatCurrency(reports.optp.discount)}
                  </p>
                </div>
                <div className="title">
                  <FcMoneyTransfer size={24} />
                  <p className="ms-3">Off-plan Purchase Tranche Payment</p>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-sm-6 mb-3">
              <div className="box">
                <div className="money mb-2">
                  <p>Investments:</p>
                  <p className="bold">
                    ₦{formatCurrency(reports.csp.investments)}
                  </p>
                </div>
                <div className="money mb-3">
                  <p>Discount:</p>
                  <p className="bold">
                    ₦{formatCurrency(reports.csp.discount)}
                  </p>
                </div>
                <div className="title">
                  <FcMoneyTransfer size={24} />
                  <p className="ms-3">Construction Stage Purchase</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="table-div mt-3">
        <div className="head">
          <div></div>
          {(user_details.user_type === "admin" ||
            (user_details.role_id &&
              user_details.role_id.permissions.includes(
                "create-investment",
              ))) && (
            <button className="main-btn" onClick={() => navigate("new")}>
              + New
            </button>
          )}
        </div>
        <div className="filter align">
          <select value={plan} onChange={(e) => setPlan(e.target.value)}>
            <option value={""}>Filter by Payment Plan</option>
            <option value={"opbp"}>Off-plan Purchase Bullet Payment</option>
            <option value={"csp"}>Construction Stage Purchase</option>
            <option value={"optp"}>Off-plan Purchase Tranche Payment</option>
          </select>
          {list?.investments && (
            <CSVLink
              data={list.investments}
              headers={headers}
              className="main-btn"
              filename="investments.csv"
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
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {list.investments.map((l) => (
                      <tr key={l._id}>
                        <td className="wide">
                          {l.investor ? (
                            <Link
                              to={`/dashboard/accounts/investors/${l.investor._id}`}
                            >
                              {l.investor.business_name ||
                                `${l.investor.first_name} ${l.investor.last_name}`}{" "}
                            </Link>
                          ) : l.created_by ? (
                            <span>
                              Added by {l.created_by.first_name}{" "}
                              {l.created_by.last_name}
                            </span>
                          ) : (
                            "Added By Admin"
                          )}
                        </td>
                        <td>{l.fractions_bought}</td>
                        <td>
                          {l.payment_plan === "opbp"
                            ? "Off-plan Purchase Bullet Payment"
                            : l.payment_plan === "optp"
                              ? "Off-plan Purchase Tranche Payment"
                              : l.payment_plan === "csp"
                                ? "Construction Stage Purchase"
                                : "Full Payment"}
                        </td>
                        <td>₦{formatCurrency(l.amount_paid)}</td>
                        <td>
                          ₦{formatCurrency(l.total_amount - l.amount_paid)}
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
                          {l.payment ? l.payment.transaction_ref : "Offline"}
                        </td>
                        <td>
                          {l.investor && (
                            <>
                              <Link
                                to={`/dashboard/accounts/investors/${l.investor._id}`}
                                style={{ marginRight: "8px" }}
                              >
                                View
                              </Link>
                              <Link
                                to={`/dashboard/accounts/investors/${l.investor._id}/investments`}
                              >
                                Investments
                              </Link>
                            </>
                          )}
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
