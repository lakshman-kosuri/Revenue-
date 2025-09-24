import axios from 'axios';

// Base URL for backend
const API_URL = 'http://localhost:5000/api';
// const API_URL = "https://rto-qoj7.onrender.com/api";

// Auth API
export const loginUser = async (username, password) => {
  const res = await axios.post(`${API_URL}/auth/login`, { username, password });
  return res.data;
};

// Vehicles API
export const getVehicles = async (token) => {
  const res = await axios.get(`${API_URL}/vehicles`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const addVehicle = async (formData, token) => {
  const res = await axios.post(`${API_URL}/vehicles`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data', // Important for file uploads
    },
  });
  return res.data;
};

export const deleteVehicle = async (id, token) => {
  const res = await axios.delete(`${API_URL}/vehicles/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// ✅ Add this function if missing
export const updateVehicle = async (id, updatedData, token) => {
  const res = await axios.put(`${API_URL}/vehicles/${id}`, updatedData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
