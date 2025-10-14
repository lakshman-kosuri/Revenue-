import React, { useState } from "react";
import toast from "react-hot-toast";
import { formatDate } from "../utils/formatDate"; // <-- import the util
import "./VehicleList.css";

const VehicleList = ({ vehicles, onDelete, onUpdate }) => {
  const [searchNo, setSearchNo] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [editingVehicleId, setEditingVehicleId] = useState(null);
  const [updatedDetails, setUpdatedDetails] = useState({});

  // Filter vehicles
  const filteredVehicles = vehicles.filter((v) => {
    const matchesVehicleNo = v.vehicleNo
      ?.toLowerCase()
      .includes(searchNo.toLowerCase());
    if (!matchesVehicleNo) return false;
    if (!searchDate) return true;

    const formattedSearchDate = new Date(searchDate)
      .toISOString()
      .split("T")[0];

    const matchesInsurance =
      v.brakeInsurance?.expiryDate &&
      new Date(v.brakeInsurance.expiryDate).toISOString().split("T")[0] ===
        formattedSearchDate;
    const matchesPermit =
      v.permit?.expiryDate &&
      new Date(v.permit.expiryDate).toISOString().split("T")[0] ===
        formattedSearchDate;
    const matchesTax =
      v.tax?.expiryDate &&
      new Date(v.tax.expiryDate).toISOString().split("T")[0] ===
        formattedSearchDate;
    const matchesFitness =
      v.fitnessValidity &&
      new Date(v.fitnessValidity).toISOString().split("T")[0] ===
        formattedSearchDate;
    const matchesPUC =
      v.pucDate &&
      new Date(v.pucDate).toISOString().split("T")[0] === formattedSearchDate;

    if (filterCategory === "all")
      return (
        matchesInsurance ||
        matchesPermit ||
        matchesTax ||
        matchesFitness ||
        matchesPUC
      );
    if (filterCategory === "insurance") return matchesInsurance;
    if (filterCategory === "permit") return matchesPermit;
    if (filterCategory === "tax") return matchesTax;
    if (filterCategory === "fitness") return matchesFitness;
    if (filterCategory === "puc") return matchesPUC;
    return false;
  });

  const handleUpdate = async (vehicle) => {
    const payload = {
      vehicleNo: updatedDetails.vehicleNo,
      ownerName: updatedDetails.ownerName,
      address: updatedDetails.address,
      phone: updatedDetails.phone,
      brakeInsurance: {
        insuranceNo: updatedDetails.insuranceNo,
        expiryDate: updatedDetails.insuranceExpiry, 
      },
      permit: {
        permitNo: updatedDetails.permitNo,
        expiryDate: updatedDetails.permitExpiry,
      },
      tax: {
        amount: updatedDetails.taxAmount,
        expiryDate: updatedDetails.taxExpiry,
      },
      fitnessNumber: updatedDetails.fitnessNumber,
      fitnessValidity: updatedDetails.fitnessValidity,
      pucDate: updatedDetails.pucDate,
    };

    try {
      await onUpdate(vehicle._id, payload);
      setEditingVehicleId(null);
      setUpdatedDetails({});
    } catch (err) {
      console.error(err);
      toast.error("Failed to update vehicle", { duration: 3000 });
    }
  };

  const handleDelete = async (id) => {
    try {
      await onDelete(id);
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete vehicle", { duration: 3000 });
    }
  };

  const handleEditClick = (vehicle) => {
    setEditingVehicleId(vehicle._id);
    setUpdatedDetails({
      vehicleNo: vehicle.vehicleNo,
      ownerName: vehicle.ownerName,
      address: vehicle.address,
      phone: vehicle.phone,
      insuranceNo: vehicle.brakeInsurance?.insuranceNo,
      insuranceExpiry: vehicle.brakeInsurance?.expiryDate
        ? vehicle.brakeInsurance.expiryDate.split("T")[0]
        : "",
      permitNo: vehicle.permit?.permitNo,
      permitExpiry: vehicle.permit?.expiryDate
        ? vehicle.permit.expiryDate.split("T")[0]
        : "",
      taxAmount: vehicle.tax?.amount,
      taxExpiry: vehicle.tax?.expiryDate
        ? vehicle.tax.expiryDate.split("T")[0]
        : "",
      fitnessNumber: vehicle.fitnessNumber,
      fitnessValidity: vehicle.fitnessValidity
        ? vehicle.fitnessValidity.split("T")[0]
        : "",
      pucDate: vehicle.pucDate ? vehicle.pucDate.split("T")[0] : "",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedDetails((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="vehicle-list-container">
      <h3>Vehicles</h3>

      {/* Filters */}
      <div className="filters-section">
        <div className="filter-group">
          <label>Search by Vehicle No</label>
          <input
            type="text"
            placeholder="e.g., UP16-A-1234"
            value={searchNo}
            onChange={(e) => setSearchNo(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <label>Filter by Expiry Type</label>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
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
          <input
            type="date"
            value={searchDate}
            onChange={(e) => setSearchDate(e.target.value)}
          />
        </div>
      </div>

      {/* Vehicle Table */}
      <div className="vehicle-table-section">
        <table className="vehicle-table">
          <thead>
            <tr>
              <th>Vehicle No</th>
              <th>Owner Name</th>
              <th>Phone</th>
              <th>Insurance No</th>
              <th>Insurance Expiry</th>
              <th>Permit No</th>
              <th>Permit Expiry</th>
              <th>Tax Amount</th>
              <th>Tax Expiry</th>
              <th>Fitness No</th>
              <th>Fitness Validity</th>
              <th>PUC Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredVehicles.map((v) => {
              const isExpiredToday =
                (v.brakeInsurance?.expiryDate &&
                  new Date(v.brakeInsurance.expiryDate)
                    .toISOString()
                    .split("T")[0] ===
                    new Date().toISOString().split("T")[0]) ||
                (v.permit?.expiryDate &&
                  new Date(v.permit.expiryDate)
                    .toISOString()
                    .split("T")[0] ===
                    new Date().toISOString().split("T")[0]) ||
                (v.tax?.expiryDate &&
                  new Date(v.tax.expiryDate)
                    .toISOString()
                    .split("T")[0] ===
                    new Date().toISOString().split("T")[0]);

              return (
                <tr key={v._id} className={isExpiredToday ? "expired-row" : ""}>
                  {editingVehicleId === v._id ? (
                    <>
                      {/* Editable Fields (date inputs stay YYYY-MM-DD) */}
                      <td><input type="text" name="vehicleNo" value={updatedDetails.vehicleNo || ""} onChange={handleChange} /></td>
                      <td><input type="text" name="ownerName" value={updatedDetails.ownerName || ""} onChange={handleChange} /></td>
                      <td><input type="text" name="phone" value={updatedDetails.phone || ""} onChange={handleChange} /></td>
                      <td><input type="text" name="insuranceNo" value={updatedDetails.insuranceNo || ""} onChange={handleChange} /></td>
                      <td><input type="date" name="insuranceExpiry" value={updatedDetails.insuranceExpiry || ""} onChange={handleChange} /></td>
                      <td><input type="text" name="permitNo" value={updatedDetails.permitNo || ""} onChange={handleChange} /></td>
                      <td><input type="date" name="permitExpiry" value={updatedDetails.permitExpiry || ""} onChange={handleChange} /></td>
                      <td><input type="number" name="taxAmount" value={updatedDetails.taxAmount || ""} onChange={handleChange} /></td>
                      <td><input type="date" name="taxExpiry" value={updatedDetails.taxExpiry || ""} onChange={handleChange} /></td>
                      <td><input type="text" name="fitnessNumber" value={updatedDetails.fitnessNumber || ""} onChange={handleChange} /></td>
                      <td><input type="date" name="fitnessValidity" value={updatedDetails.fitnessValidity || ""} onChange={handleChange} /></td>
                      <td><input type="date" name="pucDate" value={updatedDetails.pucDate || ""} onChange={handleChange} /></td>
                      <td>
                        <button onClick={() => handleUpdate(v)} className="save-btn">Save</button>
                        <button onClick={() => setEditingVehicleId(null)} className="cancel-btn">Cancel</button>
                      </td>
                    </>
                  ) : (
                    <>
                      {/* Display Fields */}
                      <td>{v.vehicleNo}</td>
                      <td>{v.ownerName}</td>
                      <td>{v.phone}</td>
                      <td>{v.brakeInsurance?.insuranceNo || "-"}</td>
                      <td>{formatDate(v.brakeInsurance?.expiryDate)}</td>
                      <td>{v.permit?.permitNo || "-"}</td>
                      <td>{formatDate(v.permit?.expiryDate)}</td>
                      <td>{v.tax?.amount || "-"}</td>
                      <td>{formatDate(v.tax?.expiryDate)}</td>
                      <td>{v.fitnessNumber || "-"}</td>
                      <td>{formatDate(v.fitnessValidity)}</td>
                      <td>{formatDate(v.pucDate)}</td>
                      <td>
                        <button onClick={() => handleEditClick(v)} className="edit-btn">Edit</button>
                        <button onClick={() => handleDelete(v._id)} className="delete-btn">Delete</button>
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

export default VehicleList;
