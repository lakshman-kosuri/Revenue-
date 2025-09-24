import React, { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import './VehicleForm.css';
import { addVehicle } from '../services/api'; // Your API function
import { FaFilePdf } from 'react-icons/fa'; // Import the PDF icon

const VehicleForm = ({ token, onAdd }) => {
  const [vehicleNo, setVehicleNo] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [insuranceNo, setInsuranceNo] = useState('');
  const [insuranceExpiry, setInsuranceExpiry] = useState('');
  const [permitNo, setPermitNo] = useState('');
  const [permitExpiry, setPermitExpiry] = useState('');
  const [taxAmount, setTaxAmount] = useState('');
  const [taxExpiry, setTaxExpiry] = useState('');

  // New fields
  const [fitnessNumber, setFitnessNumber] = useState('');
  const [fitnessValidity, setFitnessValidity] = useState('');
  const [pucDate, setPucDate] = useState('');
  const [licensePdf, setLicensePdf] = useState(null);

 const handleSubmit = async (e) => {
  e.preventDefault();

  // Validate the form before proceeding.
  if (!licensePdf) {
    return toast.error('License PDF is required');
  }

  const formData = new FormData();
  formData.append('vehicleNo', vehicleNo);
  formData.append('ownerName', ownerName);
  formData.append('address', address);
  formData.append('phone', phone);
  formData.append('brakeInsurance[insuranceNo]', insuranceNo);
  formData.append('brakeInsurance[expiryDate]', insuranceExpiry);
  formData.append('permit[permitNo]', permitNo);
  formData.append('permit[expiryDate]', permitExpiry);
  formData.append('tax[amount]', taxAmount);
  formData.append('tax[expiryDate]', taxExpiry);
  formData.append('fitnessNumber', fitnessNumber);
  formData.append('fitnessValidity', fitnessValidity);
  formData.append('pucDate', pucDate);
  formData.append('licensePdf', licensePdf);

  try {
    // Attempt to add the vehicle
    await addVehicle(formData, token);

    // If successful, show only the success toast
    toast.success('Vehicle added successfully!');
    onAdd(); // Refresh the vehicle list

    // Reset form after successful submission
    setVehicleNo('');
    setOwnerName('');
    setAddress('');
    setPhone('');
    setInsuranceNo('');
    setInsuranceExpiry('');
    setPermitNo('');
    setPermitExpiry('');
    setTaxAmount('');
    setTaxExpiry('');
    setFitnessNumber('');
    setFitnessValidity('');
    setPucDate('');
    setLicensePdf(null);
  } catch (err) {
    // If an error occurs, show only the error toast
    toast.error(err.response?.data?.message || 'Error adding vehicle');
  }
};

  return (
    <form onSubmit={handleSubmit} className="vehicle-form" encType="multipart/form-data">
      <Toaster />

      <h3>Vehicle Registration Details</h3>
      <div className="form-section">
        <label>Vehicle No</label>
        <input type="text" value={vehicleNo} onChange={(e) => setVehicleNo(e.target.value)} required />

        <label>Owner Name</label>
        <input type="text" value={ownerName} onChange={(e) => setOwnerName(e.target.value)} />

        <label>Address</label>
        <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} />

        <label>Phone</label>
        <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} />
      </div>

      <h3>Insurance Information</h3>
      <div className="form-section grid-2">
        <label>Insurance No</label>
        <input type="text" value={insuranceNo} onChange={(e) => setInsuranceNo(e.target.value)} />

        <label>Insurance Expiry</label>
        <input type="date" value={insuranceExpiry} onChange={(e) => setInsuranceExpiry(e.target.value)} />
      </div>

      <h3>Permit Details</h3>
      <div className="form-section grid-2">
        <label>Permit No</label>
        <input type="text" value={permitNo} onChange={(e) => setPermitNo(e.target.value)} />

        <label>Permit Expiry</label>
        <input type="date" value={permitExpiry} onChange={(e) => setPermitExpiry(e.target.value)} />
      </div>

      <h3>Tax Information</h3>
      <div className="form-section grid-2">
        <label>Tax Amount</label>
        <input type="number" value={taxAmount} onChange={(e) => setTaxAmount(e.target.value)} />

        <label>Tax Expiry</label>
        <input type="date" value={taxExpiry} onChange={(e) => setTaxExpiry(e.target.value)} />
      </div>

      <h3>Fitness & PUC</h3>
      <div className="form-section grid-2">
        <label>Fitness Number</label>
        <input type="text" value={fitnessNumber} onChange={(e) => setFitnessNumber(e.target.value)} />

        <label>Fitness Validity</label>
        <input type="date" value={fitnessValidity} onChange={(e) => setFitnessValidity(e.target.value)} />

        <label>PUC Date</label>
        <input type="date" value={pucDate} onChange={(e) => setPucDate(e.target.value)} />
      </div>

      <h3>License PDF</h3>
      <div className="form-section file-upload-section">
        <label htmlFor="license-pdf-upload" className="file-upload-label">
          {licensePdf ? (
            <span className="file-name">Selected: {licensePdf.name}</span>
          ) : (
            <span className="file-upload-icon">
              <FaFilePdf size={48} color="#D12610" />
            </span>
          )}
        </label>
        <input
          type="file"
          id="license-pdf-upload"
          accept="application/pdf"
          onChange={(e) => setLicensePdf(e.target.files[0])}
          required
        />
      </div>

      <button type="submit" className="add-vehicle-btn">Add Vehicle</button>
    </form>
  );
};

export default VehicleForm;