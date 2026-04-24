import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProperties } from "../../../redux/properties/propertySlice";
import { Link, useLocation } from "react-router-dom";
import Loader from "../../../component/Loader";
import Pagination from "../../../component/Pagination";
import { numberWithCommas } from "../../../utils/currencyFormatter";
import { getFeatures, getTypes } from "../../../redux/features/featureSlice";
import { AiFillEye } from "react-icons/ai";
import { frontUrl } from "../../../redux/config";
import { CSVLink } from "react-csv";
import propertyService from "../../../redux/properties/propertyService";
import { displayError } from "../../../redux/error";
import toast from "react-hot-toast";

const Properties = () => {
  const dispatch = useDispatch();

  const pageNumber = new URLSearchParams(useLocation().search).get("page") || 1;

  const [status, setStatus] = useState("");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [type, setType] = useState("");
  const [feature, setFeature] = useState("");
  const [filter, setFilter] = useState(false);

  const headers = [
    { label: "Reference Number", key: "ref" },
    { label: "Name", key: "name" },
    { label: "Status", key: "status" },
    { label: "Total Price", key: "total_price" },
    { label: "Investors Count", key: "investors_count" },
    { label: "Total Units", key: "total_units" },
    { label: "Total Fractions", key: "total_fractions" },
    { label: "Investment Available", key: "investment_available" },
    { label: "Cost Per Unit", key: "cost_per_unit" },
    { label: "Cost Per Fraction", key: "cost_per_fraction" },
    { label: "Fractions Taken", key: "fractions_taken" },
    { label: "Address", key: "address" },
    { label: "Construction Start Date", key: "construction_start_date" },
    { label: "Construction End Date", key: "construction_end_date" },
    { label: "Roofing Date", key: "roofing_date" },
  ];

  const { loading, list } = useSelector((state) => state.properties);
  const { list: features, types } = useSelector((state) => state.features);
  const { user_details } = useSelector((state) => state.auth);
  const [sending, setSending] = useState(null);

  const handleSendToBuyops = async (ref) => {
    try {
      setSending(ref);
      await propertyService.sendToBuyops(user_details.access_token, ref);
      toast.success("Property linked to BuyOps successfully.", {
        position: "top-right",
      });
      dispatch(
        getProperties({
          token: user_details.access_token,
          pageNumber,
          status,
          type,
          maxAmount,
          minAmount,
          feature,
        }),
      );
    } catch (err) {
      displayError(err, true);
    } finally {
      setSending(null);
    }
  };

  useEffect(() => {
    dispatch(getTypes({ token: user_details.access_token, status: "active" }));
    dispatch(
      getFeatures({ token: user_details.access_token, status: "active" }),
    );
  }, [dispatch, user_details.access_token]);

  useEffect(() => {
    dispatch(
      getProperties({
        token: user_details.access_token,
        pageNumber,
        status,
        type,
        maxAmount,
        minAmount,
        feature,
      }),
    );
  }, [filter, type, status, feature, pageNumber, dispatch, maxAmount, minAmount, user_details.access_token]);

  const filterAmount = () => {
    setFilter(!filter);
  };

  return (
    <div className="table-div mt-5">
      <div className="head">
        <div></div>
        {(user_details.user_type === "admin" ||
          (user_details.role_id &&
            user_details.role_id.permissions.includes(
              "create-properties",
            ))) && (
          <Link to="new" className="main-btn">
            + New Property
          </Link>
        )}
      </div>
      <div className="filter">
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value={""}>Status</option>
          <option value={"design"}>Design</option>
          <option value={"construction"}>Construction</option>
          <option value={"completed"}>Completed</option>
        </select>
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value={""}>Property Type</option>
          {types &&
            types.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name.charAt(0).toUpperCase() + t.name.slice(1)}
              </option>
            ))}
        </select>
        <select value={feature} onChange={(e) => setFeature(e.target.value)}>
          <option value={""}>Features</option>
          {features &&
            features.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
        </select>
        <div className="date-filter">
          <span>Min Amount:</span>
          <input
            type="number"
            value={minAmount}
            onChange={(e) => setMinAmount(e.target.value)}
          />
          <span>Max Amount:</span>
          <input
            type="number"
            value={maxAmount}
            onChange={(e) => setMaxAmount(e.target.value)}
          />
          <button onClick={filterAmount}>Filter</button>
        </div>
        <div className="text-end mt-3 mb-3">
          {list?.properties && (
            <CSVLink
              data={list.properties}
              headers={headers}
              className="main-btn"
              filename="properties.csv"
            >
              Export CSV
            </CSVLink>
          )}
        </div>
      </div>
      <div className="table-responsive">
        {loading ? (
          <Loader />
        ) : (
          list &&
          list.properties && (
            <>
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Ref</th>
                    <th>Name</th>
                    <th>Investors Count</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Address</th>
                    <th>BuyOps</th>
                    <th>View</th>
                    <th>Edit</th>
                  </tr>
                </thead>
                <tbody>
                  {list.properties.map((property) => (
                    <tr key={property.id}>
                      <td className="wide">{property.ref}</td>
                      <td className="wide">{property.name}</td>
                      <td>{property.investors_count}</td>
                      <td className="wide">
                        ₦{numberWithCommas(property.total_price)}
                      </td>
                      <td>{property.status}</td>
                      <td className="wide">
                        {property.address}, {property.city}, {property.state}
                      </td>
                      <td>
                        {property.sent_to_buyops ? (
                          <span
                            style={{
                              background: "#d1fae5",
                              color: "#065f46",
                              padding: "4px 10px",
                              borderRadius: "6px",
                              fontSize: "12px",
                              whiteSpace: "nowrap",
                            }}
                          >
                            ✓ Linked
                          </span>
                        ) : (
                          <button
                            className="btn btn-sm btn-primary"
                            onClick={() => handleSendToBuyops(property.ref)}
                            disabled={sending === property.ref}
                            style={{ whiteSpace: "nowrap" }}
                          >
                            {sending === property.ref
                              ? "Sending…"
                              : "Send to BuyOps"}
                          </button>
                        )}
                      </td>
                      <td>
                        <a
                          href={`${frontUrl}/projects/${property.ref}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <AiFillEye />
                        </a>
                      </td>
                      <td>
                        {(user_details.user_type === "admin" ||
                          (user_details.role_id &&
                            user_details.role_id.permissions.includes(
                              "edit-properties",
                            ))) && <Link to={`${property.ref}`}>Edit</Link>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {list.meta && list.meta.pages > 1 && (
                <>
                  <Pagination
                    currentPage={Number(list.meta.page)}
                    totalCount={Number(list.meta.total)}
                    pageSize={10}
                    pathname={"/dashboard/properties"}
                  />
                </>
              )}
            </>
          )
        )}
        {!loading && list && list.users && list.users.length === 0 && (
          <p className="no-r">No Record Found</p>
        )}
      </div>
    </div>
  );
};

export default Properties;
