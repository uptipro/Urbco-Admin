import axios from "axios";
import { url } from "../config";
import { authHeader } from "../headers";

const listUsers = async (token, status, page) => {
	const response = await axios.get(
		`${url}/user?status=${status}&pageNumber=${page || "1"}`,
		{
			headers: authHeader(token),
		}
	);
	if (response.data) {
		return response.data;
	}
};

const listRequests = async (page, token) => {
	const response = await axios.get(
		`${url}/settings/list-requests?pageNumber=${page || "1"}`,
		{
			headers: authHeader(token),
		}
	);
	if (response.data) {
		return response.data;
	}
};

const actionUser = async (token, type, id) => {
	const response = await axios.get(`${url}/user/${type}/${id}`, {
		headers: authHeader(token),
	});
	if (response.data) {
		return response.data;
	}
};

const createUser = async (token, obj) => {
	const response = await axios.post(`${url}/user`, obj, {
		headers: authHeader(token),
	});
	if (response.data) {
		return response.data;
	}
};

const editUser = async (token, obj, id) => {
	const response = await axios.patch(`${url}/user/${id}`, obj, {
		headers: authHeader(token),
	});
	if (response.data) {
		return response.data;
	}
};

const userDetails = async (token, id) => {
	const response = await axios.get(`${url}/user/${id}`, {
		headers: authHeader(token),
	});
	if (response.data) {
		return response.data;
	}
};

const listPermissions = async (token) => {
	const response = await axios.get(`${url}/role/permissions`, {
		headers: authHeader(token),
	});
	if (response.data) {
		return response.data;
	}
};

const listRoles = async (token) => {
	const response = await axios.get(`${url}/role`, {
		headers: authHeader(token),
	});
	if (response.data) {
		return response.data;
	}
};

const createRole = async (token, obj) => {
	const response = await axios.post(`${url}/role`, obj, {
		headers: authHeader(token),
	});
	if (response.data) {
		return response.data;
	}
};

const editRole = async (token, obj, id) => {
	const response = await axios.patch(`${url}/role/${id}`, obj, {
		headers: authHeader(token),
	});
	if (response.data) {
		return response.data;
	}
};

const changePassword = async (token, obj) => {
	const response = await axios.post(`${url}/user/change-password`, obj, {
		headers: authHeader(token),
	});
	if (response.data) {
		return response.data;
	}
};

const listInvestors = async (token, page, userType) => {
	const response = await axios.get(
		`${url}/investor?page=${page || "1"}&userType=${userType || ""}`,
		{
			headers: authHeader(token),
		}
	);
	if (response.data) {
		return response.data;
	}
};

const investorDetails = async (token, id) => {
	const response = await axios.get(`${url}/investor/${id}`, {
		headers: authHeader(token),
	});
	if (response.data) {
		return response.data;
	}
};

const searchInvestors = async (token, word) => {
	const { data } = await axios.get(`${url}/investor?keyword=${word}`, {
		headers: authHeader(token),
	});
	if (data) {
		return data.data;
	}
};

const userService = {
	listUsers,
	actionUser,
	createUser,
	listRoles,
	createRole,
	listPermissions,
	editRole,
	editUser,
	changePassword,
	userDetails,
	listInvestors,
	investorDetails,
	searchInvestors,
	listRequests,
};

export default userService;
