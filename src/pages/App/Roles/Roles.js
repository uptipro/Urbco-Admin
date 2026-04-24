import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { listPermissions, listRoles } from "../../../redux/users/userSlice";
import ModalComponent from "../../../component/ModalComponent";
import CreateRole from "./CreateRole";

const Roles = () => {
  const dispatch = useDispatch();

  const [openModal, setOpenModal] = useState(false);
  const [clickedRole, setClickedRole] = useState({});
  const [reset, setReset] = useState(false);

  const { roles } = useSelector((state) => state.users);
  const { user_details } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(listRoles({ token: user_details.access_token }));
    dispatch(listPermissions({ token: user_details.access_token }));
  }, [reset]);

  return (
    <div className="table-div mt-5">
      <div className="head">
        <div></div>
        {(user_details.user_type === "admin" ||
          (user_details.role_id &&
            user_details.role_id.permissions.includes("create-role"))) && (
          <button
            className="main-btn"
            onClick={() => {
              setClickedRole({});
              setOpenModal(true);
            }}
          >
            + New Role
          </button>
        )}
      </div>
      <div className="table-responsive">
        {roles && (
          <>
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Permissions</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {roles.map((rol) => (
                  <tr key={rol._id}>
                    <td>{rol.name}</td>
                    <td>{rol.permissions.length} Permissions</td>
                    <td>
                      {(user_details.user_type === "admin" ||
                        (user_details.role_id &&
                          user_details.role_id.permissions.includes(
                            "edit-role",
                          ))) && (
                        <a
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            setClickedRole(rol);

                            setOpenModal(true);
                          }}
                        >
                          Edit
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
      <ModalComponent
        open={openModal}
        toggle={() => setOpenModal(!openModal)}
        title={clickedRole._id ? "Edit Role" : "Create Role"}
      >
        <CreateRole
          details={clickedRole}
          onComplete={() => setReset(!reset)}
          onCancel={() => setOpenModal(false)}
        />
      </ModalComponent>
    </div>
  );
};

export default Roles;
