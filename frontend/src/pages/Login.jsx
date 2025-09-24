import React, { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import './Login.css';
import { loginUser } from '../services/api';

const Login = ({ setToken }) => {
  const [username, setUsername] = useState(''); // ✅ changed from phone to username
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // ✅ Send username and password
      const data = await loginUser(username, password);

      toast.success('Login successful!');

      // Save token & update parent state after short delay
      setTimeout(() => {
        localStorage.setItem('token', data.token);
        setToken(data.token);
      }, 1000);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || 'Invalid credentials. Please try again.';
      toast.error(errorMessage);
    }
  };

  return (
    <div className="login-container">
      <Toaster />

      <div className="left-panel">
        <div className="panel-content">
          <h1>RTO Registration</h1>
          <h2>RTO Admin Panel</h2>
          <p>Manage Vehicle Registrations, Licenses & RTO Operations securely.</p>
        </div>
      </div>

      <div className="right-panel">
        <div className="login-card">
          <h2>Admin Login</h2>
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <span className="icon">👤</span>
              <input
                type="text"
                placeholder="Admin Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <span className="icon">🔒</span>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span
                className="show-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '🙈' : '👁️'}
              </span>
            </div>
            <button type="submit" className="login-btn">
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
