import React from "react";
import PropertyForm from "../../../component/PropertyForm";
import { useSelector } from "react-redux";
import { BsFillArrowLeftSquareFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

const PropertyCreate = () => {
  const navigate = useNavigate();

  const { user_details } = useSelector((state) => state.auth);

  return (
    <div className="property-create">
      <button className="back" onClick={() => navigate(-1)}>
        <BsFillArrowLeftSquareFill />
        <span>Back</span>
      </button>
      {(user_details.user_type === "admin" ||
        (user_details.role_id &&
          user_details.role_id.permissions.includes("create-properties"))) && (
        <div className="card">
          <div className="card-header">
            <h6>Create New Property</h6>
          </div>
          <PropertyForm />
        </div>
      )}
    </div>
  );
};

export default PropertyCreate;
