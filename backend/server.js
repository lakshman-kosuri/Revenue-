import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import vehicleRoutes from './routes/vehicles.js';
import licenseRoutes from './routes/licenses.js';

const app = express();



// ✅ Configure CORS explicitly
const corsOptions = {
  // origin: 'https://gilded-selkie-dbc158.netlify.app',
  // origin: 'http://localhost:5173/',
  origin: 'http://localhost:5173,https://revenue-2.onrender.com',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};
app.use(cors(corsOptions));

// ✅ Parse JSON and form-data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Connect to MongoDB
await connectDB(process.env.MONGO_URI);

// ✅ Routes
app.use('/api/auth', authRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/licenses', licenseRoutes); // <-- added licenses route

// ✅ Default route
app.get('/', (req, res) => {
  res.send('RTO Vehicle Management API is running!');
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
