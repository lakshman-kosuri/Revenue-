import express from 'express';
import License from '../models/License.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// ✅ GET all licenses
// router.get('/', auth, async (req, res) => {
//   try {
//     const licenses = await License.find().sort({ updatedAt: -1 });
//     res.json(licenses);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Server error', error: err.message });
//   }
// });

// ✅ GET all licenses
// ✅ GET all licenses safely
router.get('/', auth, async (req, res) => {
  try {
    const licenses = await License.find().sort({ updatedAt: -1 });

    // Helper to safely format dates
    const formatSafeDate = (date) => {
      if (!date) return null;
      const d = new Date(date);
      if (isNaN(d.getTime())) return null; // invalid date check
      return d.toLocaleDateString('en-GB'); // DD/MM/YYYY
    };

    const formattedLicenses = licenses.map((license) => ({
      ...license._doc,
      dob: formatSafeDate(license.dob),
      createdAt: formatSafeDate(license.createdAt),
      updatedAt: formatSafeDate(license.updatedAt),
    }));

    res.json(formattedLicenses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});



// ✅ CREATE license
router.post('/', auth, async (req, res) => {
  try {
    const { holderName, phone, dob, licenseNumber } = req.body;

    const license = new License({
      holderName,
      phone,
      dob,
      licenseNumber,
    });

    await license.save();
    res.status(201).json(license);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ✅ UPDATE license
router.put('/:id', auth, async (req, res) => {
  try {
    const updateData = { ...req.body };

    const updatedLicense = await License.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updatedLicense) {
      return res.status(404).json({ message: 'License not found' });
    }

    res.json(updatedLicense);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ✅ DELETE license
router.delete('/:id', auth, async (req, res) => {
  try {
    await License.findByIdAndDelete(req.params.id);
    res.json({ message: 'License deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

export default router;
