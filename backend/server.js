import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import vehicleRoutes from './routes/vehicles.js';
import licenseRoutes from './routes/licenses.js';

const app = express();

// ✅ Configure CORS for your frontend
const corsOptions = {
  origin: 'https://revenue-2.onrender.com', // only your deployed frontend
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, // only needed if sending cookies
};
app.use(cors(corsOptions));

// ✅ Parse JSON and form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Connect to MongoDB
await connectDB(process.env.MONGO_URI);

// ✅ Routes
app.use('/api/auth', authRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/licenses', licenseRoutes);

// ✅ Default route
app.get('/', (req, res) => {
  res.send('RTO Vehicle Management API is running!');
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
