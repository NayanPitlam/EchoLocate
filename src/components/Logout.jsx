import React from 'react';

const Logout = ({ onLogout }) => {
  const handleLogout = () => {
    localStorage.removeItem('token');
    if (onLogout) {
      onLogout(false);
    }
  };

  return (
    <button onClick={handleLogout} className="logout-button" style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 100 }}>
      Log Out
    </button>
  );
};

export default Logout;
