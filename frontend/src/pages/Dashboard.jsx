import React, { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import './Dashboard.css';
import { getVehicles, addVehicle, deleteVehicle, updateVehicle } from '../services/api';
import VehicleForm from '../components/VehicleForm';
import VehicleList from '../components/VehicleList';

const Dashboard = ({ token, setToken }) => {
  const [vehicles, setVehicles] = useState([]);
  const [activeView, setActiveView] = useState('list');

  // Fetch vehicles from backend
  const fetchVehicles = async () => {
    try {
      const data = await getVehicles(token);
      setVehicles(data);
    } catch (error) {
      console.error("Failed to fetch vehicles:", error);
      toast.error("Failed to load vehicles.");
    }
  };

  useEffect(() => {
    if (token) fetchVehicles();
  }, [token]);

  // Add a new vehicle
  const handleAdd = async (formData) => {
    try {
      await addVehicle(formData, token); // Pass token from Dashboard
      fetchVehicles();
      toast.success('Vehicle details added successfully!');
      setActiveView('list'); // Switch to list after adding
    } catch (error) {
      console.error("Failed to add vehicle:", error);
      toast.error(error.response?.data?.message || 'Failed to add vehicle.');
    }
  };

  // Delete a vehicle
  const handleDelete = async (id) => {
    try {
      await deleteVehicle(id, token);
      fetchVehicles();
      toast.success('Vehicle deleted successfully!');
    } catch (error) {
      console.error("Failed to delete vehicle:", error);
      toast.error('Failed to delete vehicle.');
    }
  };

  // Update a vehicle
  const handleUpdate = async (id, updatedData) => {
    try {
      await updateVehicle(id, updatedData, token);
      fetchVehicles(); // Refresh list
      toast.success('Vehicle updated successfully!');
    } catch (error) {
      console.error("Failed to update vehicle:", error);
      toast.error('Failed to update vehicle.');
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  return (
    <div className="dashboard-container">
      <Toaster />
      <header className="dashboard-header">
        <h2>Dashboard</h2>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </header>

      <div className="dashboard-nav">
        <button
          onClick={() => setActiveView('list')}
          className={`nav-btn ${activeView === 'list' ? 'active' : ''}`}
        >
          Vehicle List
        </button>
        <button
          onClick={() => setActiveView('form')}
          className={`nav-btn ${activeView === 'form' ? 'active' : ''}`}
        >
          Add New Vehicle
        </button>
      </div>

      <div className="dashboard-content">
        {activeView === 'list' ? (
          <VehicleList
            vehicles={vehicles}
            onDelete={handleDelete}
            onUpdate={handleUpdate}
          />
        ) : (
          <VehicleForm
            token={token}        // ✅ Pass token to VehicleForm
            onAdd={handleAdd}    // ✅ Pass add handler
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
