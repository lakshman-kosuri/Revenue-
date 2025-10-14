import React, { useState } from 'react';
import toast from 'react-hot-toast';
import './LicenseList.css';

const LicenseList = ({ licenses, onDelete, onUpdate }) => {
  const [searchNo, setSearchNo] = useState('');
  const [searchName, setSearchName] = useState('');
  const [editingLicenseId, setEditingLicenseId] = useState(null);
  const [updatedDetails, setUpdatedDetails] = useState({});

  // Filter licenses by license number and holder name
  const filteredLicenses = licenses.filter((l) => {
    const matchesLicenseNo = l.licenseNumber?.toLowerCase().includes(searchNo.toLowerCase());
    const matchesHolderName = l.holderName?.toLowerCase().includes(searchName.toLowerCase());
    return matchesLicenseNo && matchesHolderName;
  });

  // Update license
  const handleUpdate = async (license) => {
    const payload = {
      licenseNumber: updatedDetails.licenseNumber,
      holderName: updatedDetails.holderName,
      phone: updatedDetails.phone,
      dob: updatedDetails.dob ? new Date(updatedDetails.dob) : null,
    };

    try {
      await onUpdate(license._id, payload);
      setEditingLicenseId(null);
      setUpdatedDetails({});
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to update license', { duration: 3000 });
    }
  };

  // Delete license
  const handleDelete = async (id) => {
    try {
      await onDelete(id);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to delete license', { duration: 3000 });
    }
  };

  // Enable editing mode
  const handleEditClick = (license) => {
    setEditingLicenseId(license._id);
    setUpdatedDetails({
      licenseNumber: license.licenseNumber,
      holderName: license.holderName,
      phone: license.phone,
      dob: license.dob ? license.dob.split('T')[0] : '', // YYYY-MM-DD for input
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedDetails((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="license-list-container">
      <h3>License Details</h3>

      {/* Filters */}
      <div className="filters-section">
        <div className="filter-group">
          <label>Search by License No</label>
          <input
            type="text"
            placeholder="License No"
            value={searchNo}
            onChange={(e) => setSearchNo(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <label>Search by Holder Name</label>
          <input
            type="text"
            placeholder="Holder Name"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />
        </div>
      </div>

      {/* License Table */}
      <div className="license-table-section">
        <table className="license-table">
          <thead>
            <tr>
              <th>License Number</th>
              <th>Name</th>
              <th>Phone</th>
              <th>DOB</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredLicenses.map((l) => (
              <tr key={l._id}>
                {editingLicenseId === l._id ? (
                  <>
                    <td>
                      <input
                        type="text"
                        name="licenseNumber"
                        value={updatedDetails.licenseNumber || ''}
                        onChange={handleChange}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="holderName"
                        value={updatedDetails.holderName || ''}
                        onChange={handleChange}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="phone"
                        value={updatedDetails.phone || ''}
                        onChange={handleChange}
                      />
                    </td>
                    <td>
                      <input
                        type="date"
                        name="dob"
                        value={updatedDetails.dob || ''}
                        onChange={handleChange}
                      />
                    </td>
                    <td>
                      <button onClick={() => handleUpdate(l)} className="save-btn">
                        Save
                      </button>
                      <button onClick={() => setEditingLicenseId(null)} className="cancel-btn">
                        Cancel
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{l.licenseNumber || '-'}</td>
                    <td>{l.holderName || '-'}</td>
                    <td>{l.phone || '-'}</td>
                    <td>{l.dob ? new Date(l.dob).toLocaleDateString() : '-'}</td>
                    <td>
                      <button onClick={() => handleEditClick(l)} className="edit-btn">
                        Edit
                      </button>
                      <button onClick={() => handleDelete(l._id)} className="delete-btn">
                        Delete
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LicenseList;
