import React, { useState } from "react";
import toast from "react-hot-toast"; 
import "./LicenseList.css"; 

// The 'licenses' prop is assumed to have fields corresponding to your form: 
// _id, licenseNumber, holderName, phone, dob
const LicenseList = ({ licenses, onDelete, onUpdate }) => {
  const [searchNo, setSearchNo] = useState("");
  const [searchName, setSearchName] = useState("");
  const [editingLicenseId, setEditingLicenseId] = useState(null);
  const [updatedDetails, setUpdatedDetails] = useState({});

  // Filter licenses by license number or holder name
  const filteredLicenses = licenses.filter((l) => {
    const matchesLicenseNo = l.licenseNumber 
      ?.toLowerCase()
      .includes(searchNo.toLowerCase());
    
    const matchesHolderName = l.holderName
      ?.toLowerCase()
      .includes(searchName.toLowerCase());

    return matchesLicenseNo && matchesHolderName;
  });

  // --- Placeholder Functions (for Edit/Delete) ---

  const handleUpdate = async (license) => {
    // Construct payload with only the fields you are editing
    const payload = {
      licenseNumber: updatedDetails.licenseNumber,
      holderName: updatedDetails.holderName,
      phone: updatedDetails.phone,
      dob: updatedDetails.dob,
    };

    try {
      // Calls the onUpdate prop defined in Dashboard
      await onUpdate(license._id, payload);
      
      // Cleanup UI state
      setEditingLicenseId(null);
      setUpdatedDetails({});
    } catch (err) {
      // Error toast is triggered by re-thrown error from Dashboard
      console.error(err);
      toast.error("Failed to update license", { duration: 3000 });
    }
  };

  const handleDelete = async (id) => {
    try {
      // Calls the onDelete prop defined in Dashboard
      await onDelete(id);
    } catch (err) {
      // Error toast is triggered by re-thrown error from Dashboard
      console.error(err);
      toast.error("Failed to delete license", { duration: 3000 });
    }
  };

  // Enable editing and populate the form fields
  const handleEditClick = (license) => {
    setEditingLicenseId(license._id);
    setUpdatedDetails({
      licenseNumber: license.licenseNumber,
      holderName: license.holderName,
      phone: license.phone,
      // Format the date string from the license object (e.g., "2024-01-01T...")
      // to "YYYY-MM-DD" for the input type="date"
      dob: license.dob?.split("T")[0], 
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedDetails((prev) => ({ ...prev, [name]: value }));
  };
  
  // --- Component Rendering ---

  return (
    <div className="license-list-container">
      <h3>License Details</h3>

      {/* Filters (kept search functionality for usability) */}
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
            {filteredLicenses.map((l) => {
              // Note: isExpired check is now set to false as DOB typically doesn't expire
              const isExpired = false; 
              
              return (
                <tr key={l._id} className={isExpired ? "expired-row" : ""}>
                  {editingLicenseId === l._id ? (
                    <>
                      {/* Editable Row Inputs */}
                      <td><input type="text" name="licenseNumber" value={updatedDetails.licenseNumber || ""} onChange={handleChange} /></td>
                      <td><input type="text" name="holderName" value={updatedDetails.holderName || ""} onChange={handleChange} /></td>
                      <td><input type="text" name="phone" value={updatedDetails.phone || ""} onChange={handleChange} /></td>
                      <td><input type="date" name="dob" value={updatedDetails.dob || ""} onChange={handleChange} /></td>
                      <td>
                        <button onClick={() => handleUpdate(l)} className="save-btn">Save</button>
                        <button onClick={() => setEditingLicenseId(null)} className="cancel-btn">Cancel</button>
                      </td>
                    </>
                  ) : (
                    <>
                      {/* Display Row Data */}
                      <td>{l.licenseNumber || "-"}</td>
                      <td>{l.holderName || "-"}</td>
                      <td>{l.phone || "-"}</td>
                      {/* Format DOB for display */}
                      <td>{l.dob ? new Date(l.dob).toLocaleDateString() : "-"}</td> 
                      <td>
                        <button onClick={() => handleEditClick(l)} className="edit-btn">Edit</button>
                        <button onClick={() => handleDelete(l._id)} className="delete-btn">Delete</button>
                      </td>
                    </>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LicenseList;