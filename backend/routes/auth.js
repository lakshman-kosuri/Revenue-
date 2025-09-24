import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();

// ✅ Fixed login credentials
const ADMIN_USER = {
  username: 'swamy2434',
  password: '7799532666',
};

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  // ✅ Check credentials
  if (username !== ADMIN_USER.username || password !== ADMIN_USER.password) {
    return res.status(400).json({ message: 'User not found or invalid password' });
  }

  // ✅ Generate JWT token
  const token = jwt.sign(
    { username: ADMIN_USER.username },
    process.env.JWT_SECRET || 'default_secret', // fallback if env not set
    { expiresIn: '1h' }
  );

  res.json({ token, user: { username: ADMIN_USER.username } });
});

export default router;
