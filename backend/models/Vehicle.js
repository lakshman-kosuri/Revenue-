import mongoose from 'mongoose';

const vehicleSchema = new mongoose.Schema({
  vehicleNo: { type: String, required: true, unique: true },
  ownerName: { type: String },
  address: { type: String },
  phone: { type: String },

  brakeInsurance: { 
    insuranceNo: String, 
    expiryDate: Date 
  },
  permit: { 
    permitNo: String, 
    expiryDate: Date 
  },
  tax: { 
    amount: Number, 
    expiryDate: Date 
  },

  fitnessNumber: { type: String },
  fitnessValidity: { type: Date },
  pucDate: { type: Date },

}, { timestamps: true });

export default mongoose.model('Vehicle', vehicleSchema);
