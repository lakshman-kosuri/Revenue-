import React, { useState } from 'react';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token') || null);

  return (
    <>
      {!token ? (
        <Login setToken={setToken} />  // Show login if no token
      ) : (
        <Dashboard token={token} setToken={setToken} />  // Show dashboard if logged in
      )}
    </>
  );
};

export default App;
