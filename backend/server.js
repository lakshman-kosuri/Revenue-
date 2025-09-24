// server.js
import 'dotenv/config';           // Load environment variables
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import vehicleRoutes from './routes/vehicles.js';
import path from 'path';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());        // Parse JSON
app.use(express.urlencoded({ extended: true })); // Parse form-data (for multer)

// Serve uploaded PDFs if using file storage (optional if storing in DB)
app.use('/uploads', express.static(path.join(path.resolve(), 'uploads')));

// Connect to MongoDB
await connectDB(process.env.MONGO_URI);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/vehicles', vehicleRoutes);

// Default route
app.get('/', (req, res) => {
  res.send('RTO Vehicle Management API is running!');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
