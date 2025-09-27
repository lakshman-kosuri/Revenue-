import axios from 'axios';

const API_URL = "https://celadon-hotteok-d3c5f7.netlify.app"; // for production


// ================= AUTH =================
export const loginUser = async (username, password) => {
  const res = await axios.post(`${API_URL}/auth/login`, { username, password });
  return res.data;
};

// ================= VEHICLES =================
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
      'Content-Type': 'application/json',
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

export const updateVehicle = async (id, updatedData, token) => {
  const res = await axios.put(`${API_URL}/vehicles/${id}`, updatedData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return res.data;
};

// ================= LICENSES =================
export const getLicenses = async (token) => {
  const res = await axios.get(`${API_URL}/licenses`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const addLicense = async (licenseData, token) => {
  const res = await axios.post(`${API_URL}/licenses`, licenseData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return res.data;
};

// 🔥 ADDED: The required function for handling license edits
export const updateLicense = async (id, updatedData, token) => {
  const res = await axios.put(`${API_URL}/licenses/${id}`, updatedData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return res.data;
};

export const deleteLicense = async (id, token) => {
  const res = await axios.delete(`${API_URL}/licenses/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};