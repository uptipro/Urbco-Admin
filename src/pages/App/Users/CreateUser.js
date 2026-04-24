import React, { useState } from "react";
import { displayError } from "../../../redux/error";
import userService from "../../../redux/users/userService";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { FiAlertTriangle } from "react-icons/fi";

const CreateUser = ({ onComplete, onCancel }) => {
  const { user_details } = useSelector((state) => state.auth);
  const { roles } = useSelector((state) => state.users);

  const [load, setLoad] = useState(false);
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [role_id, setRole] = useState("");

  const createHandler = async (e) => {
    e.preventDefault();
    let data = {
      first_name,
      last_name,
      email,
      mobile,
      user_type: "admin",
      password: first_name.toLowerCase(),
      role_id,
    };
    try {
      setLoad(true);
      let res = await userService.createUser(user_details.access_token, data);
      setLoad(false);
      if (res) {
        onComplete();
        onCancel();
        toast.success("User has been added", {
          position: "top-right",
        });
      }
    } catch (err) {
      setLoad(false);
      displayError(err, true);
    }
  };
  return (
    <form className="form" onSubmit={createHandler}>
      <label>First Name</label>
      <input
        type="text"
        value={first_name}
        onChange={(e) => setFirstName(e.target.value)}
        required
        disabled={load}
      />
      <label>Last Name</label>
      <input
        type="text"
        value={last_name}
        onChange={(e) => setLastName(e.target.value)}
        required
        disabled={load}
      />
      <label>Email</label>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        disabled={load}
      />
      <label>Mobile</label>
      <input
        type="tel"
        value={mobile}
        onChange={(e) => setMobile(e.target.value)}
        required
        disabled={load}
      />
      <label>Role</label>
      <select value={role_id} onChange={(e) => setRole(e.target.value)}>
        <option value={""}>Select One</option>
        {roles &&
          Array.isArray(roles) &&
          roles.map((rol) => (
            <option key={rol.id} value={rol.id}>
              {rol.name}
            </option>
          ))}
      </select>
      <p className="alert">
        <FiAlertTriangle />{" "}
        <span>Password will be the first name in Caps.</span>
      </p>
      <div className="text-center">
        <button disabled={load} type="submit" className="main-btn">
          {load ? "Hold on..." : "Create"}
        </button>
      </div>
    </form>
  );
};

export default CreateUser;
