import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login, logout, verifyOtp } from "../../redux/auth/authSlice";
import { FiEye, FiEyeOff } from "react-icons/fi";
import Logo from "../../assets/logo-main.svg";
import OTPInput from "react-otp-input";

const Login = () => {
	const dispatch = useDispatch();

	const { loading, user_details } = useSelector((state) => state.auth);

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);

	const [otp, setOtp] = useState("");

	useEffect(() => {
		if (!user_details) {
			dispatch(logout());
		}
	}, [dispatch, user_details]);

	const loginHandler = () => {
		if (email && password) {
			dispatch(login({ email, password }));
		}
	};

	const otpHandler = async () => {
		if (user_details && user_details.email && otp.length === 5) {
			let data = {
				login: true,
				email: user_details.email,
				token: user_details.token,
				code: otp,
			};
			dispatch(verifyOtp(data));
		}
	};

	return (
		<div className="content">
			<div className="logo">
				<img src={Logo} alt="Logo" />
			</div>
			<div className="title">
				<h3>Sign In</h3>
				{user_details && user_details.email ? (
					<p>Please provide the OTP sent to your mail</p>
				) : (
					<p>Welcome Back! Please sign in to access your account.</p>
				)}
			</div>
			{user_details && user_details.email ? (
				<div className="otp-form">
					<OTPInput
						value={otp}
						onChange={setOtp}
						numInputs={5}
						renderSeparator={<span></span>}
						renderInput={(props) => <input {...props} />}
						inputStyle={{
							width: 60,
							height: 60,
							marginRight: 20,
							paddingLeft: 1,
						}}
					/>
					<button disabled={loading} onClick={otpHandler}>
						{loading ? "Hold On..." : "Verify"}
					</button>
				</div>
			) : (
				<div className="form">
					<input
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						placeholder="Email"
						disabled={loading}
					/>
					<div className="pass">
						<input
							type={showPassword ? "text" : "password"}
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							placeholder="Password"
							disabled={loading}
						/>
						{showPassword ? (
							<FiEye onClick={() => setShowPassword(false)} />
						) : (
							<FiEyeOff onClick={() => setShowPassword(true)} />
						)}
					</div>
					<button disabled={loading} onClick={loginHandler}>
						{loading ? "Hold On..." : "Sign In"}
					</button>
				</div>
			)}
		</div>
	);
};

export default Login;
