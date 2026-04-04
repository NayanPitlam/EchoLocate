import React from 'react';
import Logout from './Logout';

const Header = ({ onLogout }) => {
  return (
    <header style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '10px 20px',
      backgroundColor: 'rgba(10, 15, 30, 0.6)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
      zIndex: 100,
      color: 'white',
      boxSizing: 'border-box'
    }}>
      <a href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}>
        <svg width="40" height="40" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#0056b3', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#004494', stopOpacity: 1 }} />
            </linearGradient>
          </defs>
          <path fill="url(#logoGradient)" d="M50 0L96.5 25V75L50 100L3.5 75V25L50 0Z" />
          <path fill="#fff" d="M50 15L84.8 32.5V67.5L50 85L15.2 67.5V32.5L50 15Z" />
          <path fill="url(#logoGradient)" d="M50 22.5L78.2 36.25V63.75L50 77.5L21.8 63.75V36.25L50 22.5Z" />
        </svg>
        <h1 style={{ fontSize: '24px', marginLeft: '10px', margin: 0 }}>EchoLocate</h1>
      </a>
      <Logout onLogout={onLogout} />
    </header>
  );
};

export default Header;
