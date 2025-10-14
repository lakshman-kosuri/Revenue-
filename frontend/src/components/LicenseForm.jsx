import React, { useState } from 'react';
import toast from 'react-hot-toast';
import './LicenseForm.css';
import { addLicense } from '../services/api'; // Your API call

const LicenseForm = ({ token, onAdd }) => {
  const [holderName, setHolderName] = useState('');
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');

  // Helper: Convert date from YYYY-MM-DD (input) to DD/MM/YYYY (backend)
  const formatDateForBackend = (dateStr) => {
    if (!dateStr) return null;
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const licenseData = {
      holderName,
      phone,
      dob: formatDateForBackend(dob),
      licenseNumber
    };

    try {
      await addLicense(licenseData, token);
      toast.success('License added successfully!');
      onAdd(); // Refresh list in parent

      // Clear form
      setHolderName('');
      setPhone('');
      setDob('');
      setLicenseNumber('');
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to add license');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="license-form">
      <h3>Add License</h3>

      <label>Name</label>
      <input
        type="text"
        value={holderName}
        onChange={(e) => setHolderName(e.target.value)}
        required
      />

      <label>Phone</label>
      <input
        type="text"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />

      <label>DOB</label>
      <input
        type="date"
        value={dob}
        onChange={(e) => setDob(e.target.value)}
      />

      <label>License Number</label>
      <input
        type="text"
        value={licenseNumber}
        onChange={(e) => setLicenseNumber(e.target.value)}
        required
      />

      <button type="submit" className="add-license-btn">
        Add License
      </button>
    </form>
  );
};

export default LicenseForm;
