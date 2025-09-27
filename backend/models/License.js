import mongoose from 'mongoose';

const licenseSchema = new mongoose.Schema({
  holderName: { type: String, required: true },
  phone: { type: String, required: true },
  dob: { type: Date, required: true },
  licenseNumber: { type: String, required: true, unique: true },
}, { timestamps: true });

export default mongoose.model('License', licenseSchema);
