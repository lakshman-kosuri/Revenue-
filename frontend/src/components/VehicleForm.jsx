import React, { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import './VehicleForm.css';
import { addVehicle } from '../services/api';

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
  const [fitnessNumber, setFitnessNumber] = useState('');
  const [fitnessValidity, setFitnessValidity] = useState('');
  const [pucDate, setPucDate] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const vehicleData = {
      vehicleNo,
      ownerName,
      address,
      phone,
      brakeInsurance: { insuranceNo, expiryDate: insuranceExpiry || null },
      permit: { permitNo, expiryDate: permitExpiry || null },
      tax: { amount: taxAmount || null, expiryDate: taxExpiry || null },
      fitnessNumber,
      fitnessValidity: fitnessValidity || null,
      pucDate: pucDate || null,
    };

    try {
      const data = await addVehicle(vehicleData, token);
      toast.success(data.message);
      onAdd();

      // Reset form
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
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error adding vehicle');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="vehicle-form">
      <Toaster />
      <h3>Add Vehicle Details</h3>

      <label>Vehicle No</label>
      <input type="text" value={vehicleNo} onChange={(e) => setVehicleNo(e.target.value)} required />

      <label>Owner Name</label>
      <input type="text" value={ownerName} onChange={(e) => setOwnerName(e.target.value)} />

      <label>Address</label>
      <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} />

      <label>Phone</label>
      <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} />

      <h4>Insurance</h4>
      <label>Insurance No</label>
      <input type="text" value={insuranceNo} onChange={(e) => setInsuranceNo(e.target.value)} />
      <label>Insurance Expiry</label>
      <input type="date" value={insuranceExpiry} onChange={(e) => setInsuranceExpiry(e.target.value)} />

      <h4>Permit</h4>
      <label>Permit No</label>
      <input type="text" value={permitNo} onChange={(e) => setPermitNo(e.target.value)} />
      <label>Permit Expiry</label>
      <input type="date" value={permitExpiry} onChange={(e) => setPermitExpiry(e.target.value)} />

      <h4>Tax</h4>
      <label>Tax Amount</label>
      <input type="number" value={taxAmount} onChange={(e) => setTaxAmount(e.target.value)} />
      <label>Tax Expiry</label>
      <input type="date" value={taxExpiry} onChange={(e) => setTaxExpiry(e.target.value)} />

      <h4>Fitness & PUC</h4>
      <label>Fitness Number</label>
      <input type="text" value={fitnessNumber} onChange={(e) => setFitnessNumber(e.target.value)} />
      <label>Fitness Validity</label>
      <input type="date" value={fitnessValidity} onChange={(e) => setFitnessValidity(e.target.value)} />
      <label>PUC Date</label>
      <input type="date" value={pucDate} onChange={(e) => setPucDate(e.target.value)} />

      <button type="submit" className="add-vehicle-btn">Add Vehicle</button>
    </form>
  );
};

export default VehicleForm;
