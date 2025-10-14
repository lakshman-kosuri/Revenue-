import React, { useState } from "react";
import toast from "react-hot-toast";
import "./VehicleList.css";

const VehicleList = ({ vehicles, onDelete, onUpdate }) => {
  const [searchNo, setSearchNo] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [editingVehicleId, setEditingVehicleId] = useState(null);
  const [updatedDetails, setUpdatedDetails] = useState({});

  // --- Safe date parser ---
  const parseDateForInput = (dateStr) => {
    if (!dateStr) return "";
    let dateObj;

    // Handle DD/MM/YYYY
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) {
      const [day, month, year] = dateStr.split("/");
      dateObj = new Date(`${year}-${month}-${day}`);
    } else {
      // Try generic Date parse (ISO or other)
      dateObj = new Date(dateStr);
    }

    return isNaN(dateObj.getTime()) ? "" : dateObj.toISOString().split("T")[0];
  };

  const formatDateForBackend = (dateStr) => {
    if (!dateStr) return null;
    const [year, month, day] = dateStr.split("-");
    return `${day}/${month}/${year}`;
  };

  // --- Filter vehicles ---
  const filteredVehicles = vehicles.filter((v) => {
    const matchesVehicleNo = v.vehicleNo
      ?.toLowerCase()
      .includes(searchNo.toLowerCase());
    if (!matchesVehicleNo) return false;
    if (!searchDate) return true;

    const formattedSearchDate = searchDate;

    const matchesInsurance =
      v.brakeInsurance?.expiryDate &&
      parseDateForInput(v.brakeInsurance.expiryDate) === formattedSearchDate;
    const matchesPermit =
      v.permit?.expiryDate &&
      parseDateForInput(v.permit.expiryDate) === formattedSearchDate;
    const matchesTax =
      v.tax?.expiryDate &&
      parseDateForInput(v.tax.expiryDate) === formattedSearchDate;
    const matchesFitness =
      v.fitnessValidity &&
      parseDateForInput(v.fitnessValidity) === formattedSearchDate;
    const matchesPUC =
      v.pucDate && parseDateForInput(v.pucDate) === formattedSearchDate;

    if (filterCategory === "all")
      return matchesInsurance || matchesPermit || matchesTax || matchesFitness || matchesPUC;
    if (filterCategory === "insurance") return matchesInsurance;
    if (filterCategory === "permit") return matchesPermit;
    if (filterCategory === "tax") return matchesTax;
    if (filterCategory === "fitness") return matchesFitness;
    if (filterCategory === "puc") return matchesPUC;

    return false;
  });

  // --- Handle update ---
  const handleUpdate = async (vehicle) => {
    const payload = {
      vehicleNo: updatedDetails.vehicleNo,
      ownerName: updatedDetails.ownerName,
      address: updatedDetails.address,
      phone: updatedDetails.phone,
      brakeInsurance: {
        insuranceNo: updatedDetails.insuranceNo,
        expiryDate: formatDateForBackend(updatedDetails.insuranceExpiry),
      },
      permit: {
        permitNo: updatedDetails.permitNo,
        expiryDate: formatDateForBackend(updatedDetails.permitExpiry),
      },
      tax: {
        amount: updatedDetails.taxAmount,
        expiryDate: formatDateForBackend(updatedDetails.taxExpiry),
      },
      fitnessNumber: updatedDetails.fitnessNumber,
      fitnessValidity: formatDateForBackend(updatedDetails.fitnessValidity),
      pucDate: formatDateForBackend(updatedDetails.pucDate),
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
      insuranceNo: vehicle.brakeInsurance?.insuranceNo || "",
      insuranceExpiry: parseDateForInput(vehicle.brakeInsurance?.expiryDate),
      permitNo: vehicle.permit?.permitNo || "",
      permitExpiry: parseDateForInput(vehicle.permit?.expiryDate),
      taxAmount: vehicle.tax?.amount || "",
      taxExpiry: parseDateForInput(vehicle.tax?.expiryDate),
      fitnessNumber: vehicle.fitnessNumber || "",
      fitnessValidity: parseDateForInput(vehicle.fitnessValidity),
      pucDate: parseDateForInput(vehicle.pucDate),
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedDetails((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="vehicle-list-container">
      <h3>Vehicles</h3>

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
              const isExpiredToday = ["brakeInsurance", "permit", "tax"].some(
                (field) =>
                  parseDateForInput(v[field]?.expiryDate) ===
                  new Date().toISOString().split("T")[0]
              );

              return (
                <tr key={v._id} className={isExpiredToday ? "expired-row" : ""}>
                  {editingVehicleId === v._id ? (
                    <>
                      {Object.entries(updatedDetails).map(([key, val]) => (
                        <td key={key}>
                          {(key.includes("Expiry") || key.includes("Validity") || key === "pucDate") ? (
                            <input type="date" name={key} value={val || ""} onChange={handleChange} />
                          ) : key === "taxAmount" ? (
                            <input type="number" name={key} value={val || ""} onChange={handleChange} />
                          ) : (
                            <input type="text" name={key} value={val || ""} onChange={handleChange} />
                          )}
                        </td>
                      ))}
                      <td>
                        <button onClick={() => handleUpdate(v)} className="save-btn">Save</button>
                        <button onClick={() => setEditingVehicleId(null)} className="cancel-btn">Cancel</button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>{v.vehicleNo || "-"}</td>
                      <td>{v.ownerName || "-"}</td>
                      <td>{v.phone || "-"}</td>
                      <td>{v.brakeInsurance?.insuranceNo || "-"}</td>
                      <td>{v.brakeInsurance?.expiryDate || "-"}</td>
                      <td>{v.permit?.permitNo || "-"}</td>
                      <td>{v.permit?.expiryDate || "-"}</td>
                      <td>{v.tax?.amount || "-"}</td>
                      <td>{v.tax?.expiryDate || "-"}</td>
                      <td>{v.fitnessNumber || "-"}</td>
                      <td>{v.fitnessValidity || "-"}</td>
                      <td>{v.pucDate || "-"}</td>
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
