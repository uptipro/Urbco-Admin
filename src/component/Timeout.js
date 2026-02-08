import React, { useEffect, useState } from "react";
import { useIdleTimer } from "react-idle-timer";
import { useDispatch } from "react-redux";
import { logout } from "../redux/auth/authSlice";
import ModalComponent from "./ModalComponent";

const Timeout = () => {
	const dispatch = useDispatch();

	const [openModal, setOpenModal] = useState(false);

	const timeout = 150000;
	const [remaining, setRemaining] = useState(timeout);

	// Removed unused lastEvent and handlers

	const { getRemainingTime } = useIdleTimer({
		timeout,
		onActive: handleOnActive,
		onIdle: handleOnIdle,
		crossTab: {
			emitOnAllTabs: true,
		},
	});

	useEffect(() => {
		setRemaining(getRemainingTime());

		setInterval(() => {
			setRemaining(getRemainingTime());
		}, 1000);
	}, []);

	useEffect(() => {
		if (Math.round(remaining / 1000) === 21) {
			setOpenModal(true);
		}
		if (remaining === 0) {
			dispatch(logout());
		}
	}, [remaining]);

	return (
		<ModalComponent
			open={openModal}
			toggle={() => setOpenModal(false)}
			className="session"
			title="Timeout!!!"
		>
			<>
				<h5>
					Your session would timeout in {Math.round(remaining / 1000)}{" "}
					seconds
				</h5>
				<p>Will you like to continue?</p>
				<div className="modal-footer">
					<button
						className="btn btn-cancel"
						onClick={() => setOpenModal(false)}
					>
						Cancel
					</button>
					<button
						className="main-btn lg"
						onClick={() => dispatch(logout())}
					>
						Log Out
					</button>
				</div>
			</>
		</ModalComponent>
	);
};

export default Timeout;
