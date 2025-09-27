import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token') || null);

  return (
    <>
      {/* Toaster for toast messages */}
         <Toaster position="top-center" reverseOrder={false} />
      
      {!token ? (
        <Login setToken={setToken} />  // Show login if no token
      ) : (
        <Dashboard token={token} setToken={setToken} />  // Show dashboard if logged in
      )}
    </>
  );
};

export default App;
