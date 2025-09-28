import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import vehicleRoutes from './routes/vehicles.js';
import licenseRoutes from './routes/licenses.js';

const app = express();

// ✅ CORS configuration
const corsOptions = {
  origin: 'https://rto-portal.netlify.app', // your frontend URL
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

// ✅ Apply CORS globally
app.use(cors(corsOptions));

// ✅ Handle preflight OPTIONS requests explicitly
app.options('*', cors(corsOptions));

// ✅ Parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Connect to MongoDB
await connectDB(process.env.MONGO_URI);

// ✅ API Routes
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
