import React from 'react';

const Logout = ({ onLogout }) => {
  const handleLogout = () => {
    localStorage.removeItem('token');
    if (onLogout) {
      onLogout(false);
    }
  };

  return (
    <button 
      onClick={handleLogout} 
      className="logout-button"
      style={{
        padding: '10px 20px',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        color: 'white',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '16px',
        transition: 'all 0.3s ease',
      }}
      onMouseEnter={(e) => {
        e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
        e.target.style.borderColor = 'rgba(255, 255, 255, 0.5)';
      }}
      onMouseLeave={(e) => {
        e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
        e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)';
      }}
    >
      Log Out
    </button>
  );
};

export default Logout;
