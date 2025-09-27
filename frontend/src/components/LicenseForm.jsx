import React, { useState } from 'react';
import toast from 'react-hot-toast'; // Keep 'toast' for calling notifications
import './LicenseForm.css';
import { addLicense } from '../services/api'; // create this API call

// Removed Toaster import since it should be global

const LicenseForm = ({ token, onAdd }) => {
  const [holderName, setHolderName] = useState('');
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const licenseData = { holderName, phone, dob, licenseNumber };

    try {
      // API call to add the license
      await addLicense(licenseData, token);
      
      // ✅ SUCCESS TOAST: Called on successful API response
      toast.success('License added successfully!');
      
      onAdd(); // Refresh license list in the Dashboard

      // Clear the form fields
      setHolderName('');
      setPhone('');
      setDob('');
      setLicenseNumber('');
    } catch (err) {
      console.error(err);
      
      // ✅ ERROR TOAST: Called if the API call fails
      toast.error('Failed to add license');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="license-form">
      
      {/* 🔥 REMOVED: The redundant <Toaster /> component 
          It should only be in App.js.
      */}
      
      <h3>Add License</h3>
      <label>Name</label>
      <input 
        value={holderName} 
        onChange={e => setHolderName(e.target.value)} 
        required 
      />
      
      <label>Phone</label>
      <input 
        value={phone} 
        onChange={e => setPhone(e.target.value)} 
      />
      
      <label>DOB</label>
      <input 
        type="date" 
        value={dob} 
        onChange={e => setDob(e.target.value)} 
      />
      
      <label>License Number</label>
      <input 
        value={licenseNumber} 
        onChange={e => setLicenseNumber(e.target.value)} 
        required 
      />
      
      <button type="submit">Add License</button>
    </form>
  );
};

export default LicenseForm;