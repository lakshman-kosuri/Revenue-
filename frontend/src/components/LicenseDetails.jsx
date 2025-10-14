import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { formatDate } from '../utils/formatDate';
import './LicenseList.css';

const LicenseList = ({ licenses, onDelete, onUpdate }) => {
  const [searchNo, setSearchNo] = useState('');
  const [searchName, setSearchName] = useState('');
  const [searchDob, setSearchDob] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [updatedDetails, setUpdatedDetails] = useState({});

  // Filter licenses by licenseNumber, holderName, DOB
  const filteredLicenses = licenses.filter(l => {
    const matchesLicenseNo = l.licenseNumber?.toLowerCase().includes(searchNo.toLowerCase());
    const matchesHolderName = l.holderName?.toLowerCase().includes(searchName.toLowerCase());

    let matchesDob = true;
    if (searchDob) {
      const searchISO = new Date(searchDob).toISOString().split("T")[0];
      matchesDob = l.dob?.split("T")[0] === searchISO;
    }

    return matchesLicenseNo && matchesHolderName && matchesDob;
  });

  const handleEditClick = (license) => {
    setEditingId(license._id);
    setUpdatedDetails({
      licenseNumber: license.licenseNumber,
      holderName: license.holderName,
      phone: license.phone,
      dob: license.dob?.split('T')[0] || ''
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (license) => {
    try {
      await onUpdate(license._id, updatedDetails);
      setEditingId(null);
      setUpdatedDetails({});
      toast.success("License updated successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update license");
    }
  };

  const handleDelete = async (id) => {
    try {
      await onDelete(id);
      toast.success("License deleted successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete license");
    }
  };

  return (
    <div className="license-list-container">
      <h3>Licenses</h3>

      <div className="filters-section">
        <input 
          type="text" 
          placeholder="Search License No" 
          value={searchNo} 
          onChange={e => setSearchNo(e.target.value)} 
        />
        <input 
          type="text" 
          placeholder="Search Holder Name" 
          value={searchName} 
          onChange={e => setSearchName(e.target.value)} 
        />
        <input 
          type="date" 
          value={searchDob} 
          onChange={e => setSearchDob(e.target.value)} 
        />
      </div>

      <table className="license-table">
        <thead>
          <tr>
            <th>License No</th>
            <th>Name</th>
            <th>Phone</th>
            <th>DOB</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredLicenses.map(l => (
            <tr key={l._id}>
              {editingId === l._id ? (
                <>
                  <td><input name="licenseNumber" value={updatedDetails.licenseNumber} onChange={handleChange} /></td>
                  <td><input name="holderName" value={updatedDetails.holderName} onChange={handleChange} /></td>
                  <td><input name="phone" value={updatedDetails.phone} onChange={handleChange} /></td>
                  <td><input type="date" name="dob" value={updatedDetails.dob} onChange={handleChange} /></td>
                  <td>
                    <button onClick={() => handleUpdate(l)}>Save</button>
                    <button onClick={() => setEditingId(null)}>Cancel</button>
                  </td>
                </>
              ) : (
                <>
                  <td>{l.licenseNumber}</td>
                  <td>{l.holderName}</td>
                  <td>{l.phone || "-"}</td>
                  <td>{formatDate(l.dob)}</td>
                  <td>
                    <button onClick={() => handleEditClick(l)}>Edit</button>
                    <button onClick={() => handleDelete(l._id)}>Delete</button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LicenseList;
