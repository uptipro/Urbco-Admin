import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Auth from "./layout/Auth";
import Login from "./pages/Auth/Login";
import Dashboard from "./layout/Dashboard";
import Home from "./pages/App/Home";
import Users from "./pages/App/Users/Users";
import Roles from "./pages/App/Roles/Roles";
import Properties from "./pages/App/Properties/Properties";
import Features from "./pages/App/Features/Features";
import Settings from "./pages/App/Settings/Settings";
import Types from "./pages/App/Types/Types";
import PropertyCreate from "./pages/App/Properties/PropertyCreate";
import EditProperty from "./pages/App/Properties/EditProperty";
import Website from "./pages/App/Website/Website";
import Investors from "./pages/App/Investors/Investors";
import Investments from "./pages/App/Investments/Investments";
import Transactions from "./pages/App/Transactions/Transactions";
import InvestorInfo from "./pages/App/Investors/InvestorInfo";
import InvestmentsOfInvestor from "./pages/App/Investors/Investments";
import CreateInvestment from "./pages/App/Investments/CreateInvestment";
// import NotFound from "./pages/App/NotFound";
import Requests from "./pages/App/Requests";

const Routing = () => {
	return (
		<BrowserRouter>
			<Routes>
				{/* <Route path="*" element={<NotFound />} /> */}
				<Route path="/" element={<Auth />}>
					<Route path="" element={<Login />} />
				</Route>
				<Route
					path="/dashboard"
					element={<Navigate replace to="/dashboard/home" />}
				/>
				<Route path="/dashboard" element={<Dashboard />}>
					<Route path="home" element={<Home />} />
					<Route path="requests" element={<Requests />} />
					<Route path="accounts/users" element={<Users />} />
					<Route path="accounts/roles" element={<Roles />} />
					<Route path="accounts/investors" element={<Investors />} />
					<Route
						path="accounts/investors/:id"
						element={<InvestorInfo />}
					/>
					<Route
						path="accounts/investors/:id/investments"
						element={<InvestmentsOfInvestor />}
					/>
					<Route path="basic/types" element={<Types />} />
					<Route path="basic/features" element={<Features />} />
					<Route path="properties" element={<Properties />} />
					<Route path="properties/new" element={<PropertyCreate />} />
					<Route path="properties/:id" element={<EditProperty />} />
					<Route path="settings" element={<Settings />} />
					<Route path="website" element={<Website />} />
					<Route
						path="payments/investments"
						element={<Investments />}
					/>
					<Route
						path="payments/investments/new"
						element={<CreateInvestment />}
					/>
					<Route
						path="payments/transactions"
						element={<Transactions />}
					/>
				</Route>
			</Routes>
		</BrowserRouter>
	);
};

export default Routing;
