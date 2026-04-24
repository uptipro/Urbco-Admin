import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import PropertyForm from "../../../component/PropertyForm";
import propertyService from "../../../redux/properties/propertyService";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../../../component/Loader";
import { displayError } from "../../../redux/error";
import { BsFillArrowLeftSquareFill } from "react-icons/bs";
import toast from "react-hot-toast";

const EditProperty = () => {
  const params = useParams();

  const navigate = useNavigate();

  const [load, setLoad] = useState(false);
  const [sending, setSending] = useState(false);
  const { user_details } = useSelector((state) => state.auth);
  const [propertyDetails, setPropertyDetails] = useState({});

  const getDetails = useCallback(async () => {
    try {
      setLoad(true);
      let res = await propertyService.getPropertyDetails(
        user_details.access_token,
        params.id,
      );
      setLoad(false);
      if (res && res.data) {
        setPropertyDetails(res.data);
      }
    } catch (err) {
      navigate(-1);
      displayError(err, true);
    }
  }, [user_details.access_token, params.id, navigate]);

  useEffect(() => {
    if (params.id) {
      getDetails();
    }
  }, [params.id, getDetails]);

  const handleSendToBuyops = async () => {
    try {
      setSending(true);
      await propertyService.sendToBuyops(user_details.access_token, params.id);
      // Refresh property details to reflect sent_to_buyops = true
      await getDetails();
      toast.success(
        "Property sent to Buyops as a draft. A Buyops admin can now publish it.",
      );
    } catch (err) {
      displayError(err, true);
    } finally {
      setSending(false);
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
          user_details.role_id.permissions.includes("edit-properties"))) && (
        <div className="card">
          <div className="card-header d-flex align-items-center justify-content-between">
            <h6>Property Details</h6>
            {propertyDetails.id && (
              <div className="d-flex align-items-center gap-2">
                {propertyDetails.sent_to_buyops ? (
                  <span
                    className="badge"
                    style={{
                      background: "#d1fae5",
                      color: "#065f46",
                      padding: "6px 12px",
                      borderRadius: "6px",
                      fontSize: "13px",
                    }}
                  >
                    ✓ Sent to Buyops
                  </span>
                ) : (
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={handleSendToBuyops}
                    disabled={sending}
                  >
                    {sending ? "Sending…" : "Send to Buyops"}
                  </button>
                )}
              </div>
            )}
          </div>
          {load ? (
            <div className="card-body pb-5 pt-5">
              <Loader />
            </div>
          ) : (
            propertyDetails &&
            propertyDetails.id && (
              <PropertyForm propertyDetails={propertyDetails} />
            )
          )}
        </div>
      )}
    </div>
  );
};

export default EditProperty;
