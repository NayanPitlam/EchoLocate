import React, { useState } from 'react';

const LoginForm = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Dummy login: accept any email/password
    const dummyToken = 'dummy-jwt-token-' + btoa(email);
    console.log('Dummy token generated:', dummyToken);
    localStorage.setItem('token', dummyToken);
    
    if (onLogin) {
      onLogin(true);
    }
  };

  return (
    <div 
      className="login-form-container" 
      style={{ 
        backgroundColor: 'rgba(255, 255, 255, 0.95)', 
        padding: '40px', 
        borderRadius: '16px', 
        color: '#333',
        width: '100%',
        maxWidth: '400px',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
        fontFamily: 'sans-serif'
      }}
    >
      <h2 style={{ textAlign: 'center', marginBottom: '24px', color: '#111' }}>Welcome Back</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <label htmlFor="email" style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px' }}>Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Enter your email"
            style={{ 
              width: '100%', 
              padding: '12px', 
              borderRadius: '8px', 
              border: '1px solid #ccc',
              fontSize: '16px',
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />
        </div>
        <div>
          <label htmlFor="password" style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px' }}>Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Enter your password"
            style={{ 
              width: '100%', 
              padding: '12px', 
              borderRadius: '8px', 
              border: '1px solid #ccc',
              fontSize: '16px',
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />
        </div>
        <button 
          type="submit" 
          style={{ 
            padding: '14px', 
            marginTop: '10px', 
            cursor: 'pointer',
            backgroundColor: '#0056b3',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: 'bold',
            transition: 'background-color 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#004494'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#0056b3'}
        >
          Log In
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
