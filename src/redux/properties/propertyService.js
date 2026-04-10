import axios from "axios";
import { url } from "../config";
import { authHeader } from "../headers";

const getProperties = async (
  token,
  page,
  status,
  type,
  feature,
  minAmount,
  maxAmount,
) => {
  const response = await axios.get(
    `${url}/properties?pageNumber=${page}&status=${status}&type=${type}&feature=${feature}&minAmount=${minAmount}&maxAmount=${maxAmount}`,
    {
      headers: authHeader(token),
    },
  );

  return response.data;
};

const uploadImage = async (file, token) => {
  const response = await axios.post(
    `${url}/settings/upload-file`,
    { file },
    { headers: authHeader(token) },
  );
  return response.data;
};

const createProperty = async (token, data) => {
  const response = await axios.post(`${url}/properties`, data, {
    headers: authHeader(token),
  });

  return response.data;
};

const editProperty = async (token, id, data) => {
  const response = await axios.patch(`${url}/properties/${id}`, data, {
    headers: authHeader(token),
  });

  return response.data;
};

const editPropertyStatus = async (token, id, data) => {
  const response = await axios.post(
    `${url}/properties/${id}/change-status`,
    data,
    {
      headers: authHeader(token),
    },
  );

  return response.data;
};

const getPropertyDetails = async (token, id) => {
  const response = await axios.get(`${url}/properties/${id}`, {
    headers: authHeader(token),
  });

  return response.data;
};

const searchProperties = async (token, keyword) => {
  const response = await axios.get(`${url}/properties?keyword=${keyword}`, {
    headers: authHeader(token),
  });

  return response.data;
};

const sendToBuyops = async (token, id) => {
  const response = await axios.post(
    `${url}/properties/${id}/send-to-buyops`,
    {},
    { headers: authHeader(token) },
  );
  return response.data;
};

const propertyService = {
  getProperties,
  uploadImage,
  createProperty,
  editProperty,
  getPropertyDetails,
  searchProperties,
  editPropertyStatus,
  sendToBuyops,
};

export default propertyService;
