import React, { useState } from 'react';

const LoginForm = ({ onLogin }) => {
  const [mode, setMode] = useState('login'); // 'login' or 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'login') {
        // Login request
        const response = await fetch('http://localhost:5000/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.message || 'Login failed');
        } else {
          localStorage.setItem('token', data.token);
          console.log('Login successful, token stored');
          if (onLogin) {
            onLogin(true);
          }
        }
      } else {
        // Register request
        if (password !== confirmPassword) {
          setError('Passwords do not match');
          setLoading(false);
          return;
        }

        const response = await fetch('http://localhost:5000/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.message || 'Registration failed');
        } else {
          setError('');
          setEmail('');
          setPassword('');
          setConfirmPassword('');
          setMode('login');
          alert('Registration successful! Please login now.');
        }
      }
    } catch (err) {
      setError('Connection error: ' + err.message);
      console.error('Authentication error:', err);
    } finally {
      setLoading(false);
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
        fontFamily: 'sans-serif',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <svg width="80" height="80" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
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
        <h1 style={{ color: '#111', marginTop: '10px', fontSize: '24px' }}>EchoLocate</h1>
        <p style={{ color: '#555', fontSize: '14px' }}>Discover the world through news.</p>
      </div>

      {/* Mode toggle tabs */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '24px', width: '100%' }}>
        <button
          type="button"
          onClick={() => {
            setMode('login');
            setError('');
            setConfirmPassword('');
          }}
          style={{
            flex: 1,
            padding: '10px',
            border: 'none',
            borderBottom: mode === 'login' ? '2px solid #0056b3' : '2px solid #ccc',
            backgroundColor: 'transparent',
            color: mode === 'login' ? '#0056b3' : '#999',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: mode === 'login' ? '600' : '400',
            transition: 'all 0.3s ease',
          }}
        >
          Login
        </button>
        <button
          type="button"
          onClick={() => {
            setMode('register');
            setError('');
            setConfirmPassword('');
          }}
          style={{
            flex: 1,
            padding: '10px',
            border: 'none',
            borderBottom: mode === 'register' ? '2px solid #0056b3' : '2px solid #ccc',
            backgroundColor: 'transparent',
            color: mode === 'register' ? '#0056b3' : '#999',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: mode === 'register' ? '600' : '400',
            transition: 'all 0.3s ease',
          }}
        >
          Register
        </button>
      </div>

      {/* Error message */}
      {error && (
        <div style={{
          width: '100%',
          padding: '10px',
          marginBottom: '16px',
          backgroundColor: '#fee',
          border: '1px solid #fcc',
          borderRadius: '6px',
          color: '#c33',
          fontSize: '14px',
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>
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
        {mode === 'register' && (
          <div>
            <label htmlFor="confirmPassword" style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px' }}>Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Confirm your password"
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
        )}
        <button 
          type="submit" 
          disabled={loading}
          style={{ 
            padding: '14px', 
            marginTop: '10px', 
            cursor: loading ? 'not-allowed' : 'pointer',
            backgroundColor: loading ? '#ccc' : '#0056b3',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '600',
            transition: 'background-color 0.2s',
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? 'Processing...' : (mode === 'login' ? 'Login' : 'Register')}
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
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
