import express from 'express';
import Vehicle from '../models/Vehicle.js';
import auth from '../middleware/auth.js';
import multer from 'multer';

const router = express.Router();

// Multer setup for PDF in memory
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') cb(null, true);
    else cb(new Error('Only PDF files allowed'));
  }
});

// GET all vehicles
router.get('/', auth, async (req, res) => {
  try {
    const vehicles = await Vehicle.find().sort({ updatedAt: -1 });
    res.json(vehicles);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// GET license PDF
router.get('/:id/license', auth, async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle || !vehicle.licensePdf) {
      return res.status(404).json({ message: 'PDF not found' });
    }
    res.set({
      'Content-Type': vehicle.licensePdf.contentType,
      'Content-Disposition': `inline; filename="${vehicle.licensePdf.fileName}"`,
    });
    res.send(vehicle.licensePdf.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// CREATE vehicle
router.post('/', auth, upload.single('licensePdf'), async (req, res) => {
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
      pucDate
    } = req.body;

    if (!req.file) return res.status(400).json({ message: 'License PDF is required' });

    const vehicle = new Vehicle({
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
      licensePdf: {
        data: req.file.buffer,
        contentType: req.file.mimetype,
        fileName: req.file.originalname,
      }
    });

    await vehicle.save();
    res.status(201).json(vehicle);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// UPDATE vehicle
router.put('/:id', auth, upload.single('licensePdf'), async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (req.file) {
      updateData.licensePdf = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
        fileName: req.file.originalname
      };
    }

    const updatedVehicle = await Vehicle.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!updatedVehicle) return res.status(404).json({ message: 'Vehicle not found' });
    res.json(updatedVehicle);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// DELETE vehicle
router.delete('/:id', auth, async (req, res) => {
  try {
    await Vehicle.findByIdAndDelete(req.params.id);
    res.json({ message: 'Vehicle deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

export default router;
