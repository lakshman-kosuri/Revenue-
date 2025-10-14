import express from 'express';
import Vehicle from '../models/Vehicle.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// ✅ Helper function to format date as DD/MM/YYYY
const formatDate = (date) => {
  if (!date) return null;
  return new Date(date).toLocaleDateString('en-GB');
};

// ✅ Function to format vehicle object before sending response
const formatVehicle = (vehicle) => ({
  ...vehicle._doc,
  brakeInsurance: {
    ...vehicle.brakeInsurance,
    expiryDate: formatDate(vehicle.brakeInsurance?.expiryDate),
  },
  permit: {
    ...vehicle.permit,
    expiryDate: formatDate(vehicle.permit?.expiryDate),
  },
  tax: {
    ...vehicle.tax,
    expiryDate: formatDate(vehicle.tax?.expiryDate),
  },
  fitnessValidity: formatDate(vehicle.fitnessValidity),
  pucDate: formatDate(vehicle.pucDate),
  createdAt: formatDate(vehicle.createdAt),
  updatedAt: formatDate(vehicle.updatedAt),
});

// ✅ GET all vehicles (formatted)
router.get('/', auth, async (req, res) => {
  try {
    const vehicles = await Vehicle.find().sort({ updatedAt: -1 });
    const formattedVehicles = vehicles.map(formatVehicle);
    res.json(formattedVehicles);
  } catch (err) {
    console.error('ERROR FETCHING VEHICLES:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ✅ CREATE vehicle
router.post('/', auth, async (req, res) => {
  try {
    const { vehicleNo } = req.body;

    // Optional: prevent duplicate entries
    const existingVehicle = await Vehicle.findOne({ vehicleNo });
    if (!existingVehicle) {
      const vehicle = new Vehicle({
        ...req.body,
        brakeInsurance: req.body.brakeInsurance || { insuranceNo: '', expiryDate: null },
        permit: req.body.permit || { permitNo: '', expiryDate: null },
        tax: req.body.tax || { amount: null, expiryDate: null },
        fitnessValidity: req.body.fitnessValidity ? new Date(req.body.fitnessValidity) : null,
        pucDate: req.body.pucDate ? new Date(req.body.pucDate) : null,
      });

      await vehicle.save();
      return res.status(201).json({
        message: 'Vehicle added successfully!',
        vehicle: formatVehicle(vehicle),
      });
    }

    // If already exists
    return res.status(200).json({ message: 'Vehicle already exists!' });
  } catch (err) {
    console.error('Error (ignored for frontend):', err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ✅ UPDATE vehicle
router.put('/:id', auth, async (req, res) => {
  try {
    const {
      vehicleNo,
      ownerName,
      address,
      phone,
      brakeInsurance,
      permit,
      tax,
      fitnessNumber,
      fitnessValidity,
      pucDate,
    } = req.body;

    const updateData = {
      vehicleNo,
      ownerName,
      address,
      phone,
      brakeInsurance: {
        insuranceNo: brakeInsurance?.insuranceNo || '',
        expiryDate: brakeInsurance?.expiryDate ? new Date(brakeInsurance.expiryDate) : null,
      },
      permit: {
        permitNo: permit?.permitNo || '',
        expiryDate: permit?.expiryDate ? new Date(permit.expiryDate) : null,
      },
      tax: {
        amount: tax?.amount ? Number(tax.amount) : null,
        expiryDate: tax?.expiryDate ? new Date(tax.expiryDate) : null,
      },
      fitnessNumber,
      fitnessValidity: fitnessValidity ? new Date(fitnessValidity) : null,
      pucDate: pucDate ? new Date(pucDate) : null,
    };

    const updatedVehicle = await Vehicle.findByIdAndUpdate(req.params.id, updateData, { new: true });

    if (!updatedVehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    res.json({
      message: 'Vehicle updated successfully!',
      vehicle: formatVehicle(updatedVehicle),
    });
  } catch (err) {
    console.error('ERROR UPDATING VEHICLE:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ✅ DELETE vehicle
router.delete('/:id', auth, async (req, res) => {
  try {
    await Vehicle.findByIdAndDelete(req.params.id);
    res.json({ message: 'Vehicle deleted successfully!' });
  } catch (err) {
    console.error('ERROR DELETING VEHICLE:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

export default router;
