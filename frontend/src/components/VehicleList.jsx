import React, { useState } from "react";
import toast from 'react-hot-toast';
import './VehicleList.css';

const VehicleList = ({ vehicles, onDelete, onUpdate }) => {
  const [searchNo, setSearchNo] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [editingVehicleId, setEditingVehicleId] = useState(null);
  const [updatedDetails, setUpdatedDetails] = useState({});

  // Filter vehicles based on number and expiry dates
  const filteredVehicles = vehicles.filter((v) => {
    const matchesVehicleNo = v.vehicleNo?.toLowerCase().includes(searchNo.toLowerCase());
    if (!matchesVehicleNo) return false;
    if (!searchDate) return true;

    const formattedSearchDate = new Date(searchDate).toISOString().split("T")[0];
    const matchesInsurance = v.brakeInsurance?.expiryDate && new Date(v.brakeInsurance.expiryDate).toISOString().split("T")[0] === formattedSearchDate;
    const matchesPermit = v.permit?.expiryDate && new Date(v.permit.expiryDate).toISOString().split("T")[0] === formattedSearchDate;
    const matchesTax = v.tax?.expiryDate && new Date(v.tax.expiryDate).toISOString().split("T")[0] === formattedSearchDate;
    const matchesFitness = v.fitnessValidity && new Date(v.fitnessValidity).toISOString().split("T")[0] === formattedSearchDate;
    const matchesPUC = v.pucDate && new Date(v.pucDate).toISOString().split("T")[0] === formattedSearchDate;

    if (filterCategory === 'all') return matchesInsurance || matchesPermit || matchesTax || matchesFitness || matchesPUC;
    if (filterCategory === 'insurance') return matchesInsurance;
    if (filterCategory === 'permit') return matchesPermit;
    if (filterCategory === 'tax') return matchesTax;
    if (filterCategory === 'fitness') return matchesFitness;
    if (filterCategory === 'puc') return matchesPUC;
    return false;
  });

  const isFilterActive = searchNo !== "" || searchDate !== "" || filterCategory !== "all";

  const handleUpdate = async (vehicle) => {
    try {
      const payload = {
        vehicleNo: updatedDetails.vehicleNo,
        ownerName: updatedDetails.ownerName,
        address: updatedDetails.address,
        phone: updatedDetails.phone,
        brakeInsurance: { expiryDate: updatedDetails.insuranceExpiry },
        permit: { expiryDate: updatedDetails.permitExpiry },
        tax: { expiryDate: updatedDetails.taxExpiry },
        fitnessNumber: updatedDetails.fitnessNumber,
        fitnessValidity: updatedDetails.fitnessValidity,
        pucDate: updatedDetails.pucDate
      };

      await onUpdate(vehicle._id, payload);
      setEditingVehicleId(null);
      setUpdatedDetails({});
      toast.success("Vehicle updated successfully!");
    } catch (error) {
      console.error("Update failed:", error);
      toast.error('Failed to update vehicle details.');
    }
  };

  const handleEditClick = (vehicle) => {
    setEditingVehicleId(vehicle._id);
    setUpdatedDetails({
      vehicleNo: vehicle.vehicleNo,
      ownerName: vehicle.ownerName,
      address: vehicle.address,
      phone: vehicle.phone,
      insuranceExpiry: vehicle.brakeInsurance?.expiryDate,
      permitExpiry: vehicle.permit?.expiryDate,
      taxExpiry: vehicle.tax?.expiryDate,
      fitnessNumber: vehicle.fitnessNumber,
      fitnessValidity: vehicle.fitnessValidity,
      pucDate: vehicle.pucDate
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedDetails(prev => ({ ...prev, [name]: value }));
  };

  const downloadPdf = (vehicle) => {
    if (!vehicle.licensePdf?.data) return toast.error("No PDF available");
    const blob = new Blob([new Uint8Array(vehicle.licensePdf.data.data)], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = vehicle.licensePdf.fileName;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="vehicle-list-container">
      <h3>Vehicles</h3>

      <div className="filters-section">
        <div className="filter-group">
          <label>Search by Vehicle No</label>
          <input type="text" placeholder="e.g., UP16-A-1234" value={searchNo} onChange={e => setSearchNo(e.target.value)} />
        </div>
        <div className="filter-group">
          <label>Filter by Expiry Type</label>
          <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
            <option value="all">All</option>
            <option value="insurance">Insurance</option>
            <option value="permit">Permit</option>
            <option value="tax">Tax</option>
            <option value="fitness">Fitness</option>
            <option value="puc">PUC</option>
          </select>
        </div>
        <div className="filter-group">
          <label>Filter by Date</label>
          <input type="date" value={searchDate} onChange={e => setSearchDate(e.target.value)} />
        </div>
      </div>

      <div className="vehicle-table-section">
        <table className="vehicle-table">
          <thead>
            <tr>
              <th>Vehicle No</th>
              <th>Owner Name</th>
              <th>Phone</th>
              <th>Insurance Expiry</th>
              <th>Permit Expiry</th>
              <th>Tax Expiry</th>
              <th>Fitness No</th>
              <th>Fitness Validity</th>
              <th>PUC Date</th>
              <th>License PDF</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredVehicles.map(v => {
              const isExpiredToday = 
                (v.brakeInsurance?.expiryDate && new Date(v.brakeInsurance.expiryDate).toISOString().split('T')[0] === new Date().toISOString().split('T')[0]) ||
                (v.permit?.expiryDate && new Date(v.permit.expiryDate).toISOString().split('T')[0] === new Date().toISOString().split('T')[0]) ||
                (v.tax?.expiryDate && new Date(v.tax.expiryDate).toISOString().split('T')[0] === new Date().toISOString().split('T')[0]);

              return (
                <tr key={v._id} className={isExpiredToday ? "expired-row" : ""}>
                  {editingVehicleId === v._id ? (
                    <>
                      <td><input type="text" name="vehicleNo" value={updatedDetails.vehicleNo || ''} onChange={handleChange} /></td>
                      <td><input type="text" name="ownerName" value={updatedDetails.ownerName || ''} onChange={handleChange} /></td>
                      <td><input type="text" name="phone" value={updatedDetails.phone || ''} onChange={handleChange} /></td>
                      <td><input type="date" name="insuranceExpiry" value={updatedDetails.insuranceExpiry?.split('T')[0] || ''} onChange={handleChange} /></td>
                      <td><input type="date" name="permitExpiry" value={updatedDetails.permitExpiry?.split('T')[0] || ''} onChange={handleChange} /></td>
                      <td><input type="date" name="taxExpiry" value={updatedDetails.taxExpiry?.split('T')[0] || ''} onChange={handleChange} /></td>
                      <td><input type="text" name="fitnessNumber" value={updatedDetails.fitnessNumber || ''} onChange={handleChange} /></td>
                      <td><input type="date" name="fitnessValidity" value={updatedDetails.fitnessValidity?.split('T')[0] || ''} onChange={handleChange} /></td>
                      <td><input type="date" name="pucDate" value={updatedDetails.pucDate?.split('T')[0] || ''} onChange={handleChange} /></td>
                      <td>-</td>
                      <td>
                        <button onClick={() => handleUpdate(v)}>Save</button>
                        <button onClick={() => setEditingVehicleId(null)}>Cancel</button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>{v.vehicleNo}</td>
                      <td>{v.ownerName}</td>
                      <td>{v.phone}</td>
                      <td>{v.brakeInsurance?.expiryDate ? new Date(v.brakeInsurance.expiryDate).toLocaleDateString() : "-"}</td>
                      <td>{v.permit?.expiryDate ? new Date(v.permit.expiryDate).toLocaleDateString() : "-"}</td>
                      <td>{v.tax?.expiryDate ? new Date(v.tax.expiryDate).toLocaleDateString() : "-"}</td>
                      <td>{v.fitnessNumber || "-"}</td>
                      <td>{v.fitnessValidity ? new Date(v.fitnessValidity).toLocaleDateString() : "-"}</td>
                      <td>{v.pucDate ? new Date(v.pucDate).toLocaleDateString() : "-"}</td>
                      <td>
                        {v.licensePdf ? (
                          <button onClick={() => downloadPdf(v)}>View PDF</button>
                        ) : "-"}
                      </td>
                      <td>
                        <button onClick={() => handleEditClick(v)} className="edit-btn">Edit</button>
                        <button onClick={() => onDelete(v._id)} className="delete-btn">Delete</button>
                      </td>
                    </>
                  )}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VehicleList;
