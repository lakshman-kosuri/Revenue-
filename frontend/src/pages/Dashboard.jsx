import React, { useState, useEffect } from "react";
import toast from "react-hot-toast"; 
// Assuming you have updateLicense and deleteLicense in your API service
import { 
  getVehicles, 
  getLicenses, 
  updateVehicle, 
  deleteVehicle,
  updateLicense, 
  deleteLicense
} from "../services/api"; 
import VehicleForm from "../components/VehicleForm";
import VehicleList from "../components/VehicleList";
import LicenseForm from "../components/LicenseForm";
import LicenseList from "../components/LicenseDetails"; 
import "./Dashboard.css";

const Dashboard = ({ token, setToken }) => {
  const [vehicles, setVehicles] = useState([]);
  const [licenses, setLicenses] = useState([]);
  const [activeView, setActiveView] = useState("vehicleList");

  // --- Fetch Functions (unchanged) ---
  const fetchVehicles = async () => {
    try {
      const data = await getVehicles(token);
      setVehicles(data);
    } catch (err) {
      console.error("Failed to fetch vehicles:", err);
    }
  };

  const fetchLicenses = async () => {
    try {
      const data = await getLicenses(token);
      setLicenses(data);
    } catch (err) {
      console.error("Failed to fetch licenses:", err);
    }
  };

  // --- VEHICLE ACTIONS (unchanged toast logic) ---
  const handleUpdateVehicle = async (id, updatedData) => {
    try {
      const updatedVehicle = await updateVehicle(id, updatedData, token);
      setVehicles((prev) => prev.map((v) => (v._id === id ? updatedVehicle : v)));
      toast.success("Vehicle updated successfully!", { duration: 2000 }); 
    } catch (err) {
      console.error("Update failed in Dashboard:", err);
      throw err; 
    }
  };

  const handleDeleteVehicle = async (id) => {
    try {
      await deleteVehicle(id, token);
      setVehicles((prev) => prev.filter((v) => v._id !== id));
      toast.success("Vehicle deleted successfully!", { duration: 2000 });
    } catch (err) {
      console.error("Delete failed in Dashboard:", err);
      throw err; 
    }
  };

  // --- LICENSE ACTIONS (unchanged toast logic) ---
  const handleUpdateLicense = async (id, updatedData) => {
    try {
      const updatedLicense = await updateLicense(id, updatedData, token);
      setLicenses((prev) => prev.map((l) => (l._id === id ? updatedLicense : l)));
      toast.success("License updated successfully!", { duration: 2000 });
    } catch (err) {
      console.error("Update failed in Dashboard (License):", err);
      throw err; 
    }
  };

  const handleDeleteLicense = async (id) => {
    try {
      await deleteLicense(id, token);
      setLicenses((prev) => prev.filter((l) => l._id !== id));
      toast.success("License deleted successfully!", { duration: 2000 });
    } catch (err) {
      console.error("Delete failed in Dashboard (License):", err);
      throw err; 
    }
  };

  useEffect(() => {
    if (token) {
      fetchVehicles();
      fetchLicenses();
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  return (
    <div className="dashboard-container">
      
      {/* 🔥 NEW CONTAINER: Holds fixed Header and Nav bar */}
      <div className="fixed-top-section">
          <header className="dashboard-header">
            <h2>Dashboard</h2>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </header>

          <div className="dashboard-nav">
            {/* 1. Vehicle List */}
            <button
              onClick={() => setActiveView("vehicleList")}
              className={`nav-btn ${activeView === "vehicleList" ? "active" : ""}`}
            >
              Vehicle List
            </button>
            
            {/* 2. License List */}
            <button
              onClick={() => setActiveView("licenseList")}
              className={`nav-btn ${activeView === "licenseList" ? "active" : ""}`}
            >
              License List
            </button>
            
            {/* 3. Add Vehicle */}
            <button
              onClick={() => setActiveView("vehicleForm")}
              className={`nav-btn ${activeView === "vehicleForm" ? "active" : ""}`}
            >
              Add Vehicle
            </button>
            
            {/* 4. Add License */}
            <button
              onClick={() => setActiveView("licenseForm")}
              className={`nav-btn ${activeView === "licenseForm" ? "active" : ""}`}
            >
              Add License
            </button>
          </div>
      </div>
      {/* END fixed-top-section */}

      {/* 🔥 NEW CONTAINER: Pushes content down below the fixed bar */}
      <div className="dashboard-content-wrapper">
          <div className="dashboard-content">
            {activeView === "vehicleList" && (
              <VehicleList
                vehicles={vehicles}
                onUpdate={handleUpdateVehicle} 
                onDelete={handleDeleteVehicle} 
              />
            )}
            {activeView === "vehicleForm" && (
              <VehicleForm token={token} onAdd={fetchVehicles} />
            )}
            
            {activeView === "licenseList" && (
              <LicenseList 
                licenses={licenses} 
                onUpdate={handleUpdateLicense} 
                onDelete={handleDeleteLicense} 
              />
            )}

            {activeView === "licenseForm" && (
              <LicenseForm token={token} onAdd={fetchLicenses} />
            )}
          </div>
      </div>
      {/* END dashboard-content-wrapper */}
    </div>
  );
};

export default Dashboard;