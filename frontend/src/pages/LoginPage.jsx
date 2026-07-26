import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import PasswordInput from '../components/PasswordInput';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { apiRequest } from '../api/client.js';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Invalid email address';
    if (!password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      if (!response.ok) {
        throw new Error('Invalid credentials');
      }
      
      const data = await response.json();
      login(data.token, data.user);
      showToast('Successfully logged in!', 'success');
      navigate('/dashboard');
    } catch (err) {
      showToast(err.message || 'Login failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const labelStyle = {
    display: 'block',
    fontSize: '0.82rem',
    fontWeight: 600,
    textTransform: 'uppercase',
    color: 'var(--text-dark, #1e293b)',
    marginBottom: '0.45rem'
  };

  const inputStyle = {
    width: '100%',
    padding: '0.8rem 1rem',
    fontSize: '0.95rem',
    color: 'var(--text-dark, #1e293b)',
    background: 'var(--input-bg, #f8fafc)',
    border: `1.5px solid ${errors.email ? 'var(--color-error, #ef4444)' : 'var(--input-border, #e2e8f0)'}`,
    borderRadius: 'var(--radius-md, 8px)',
    outline: 'none',
    boxShadow: errors.email ? '0 0 0 3px rgba(239,68,68,0.1)' : 'none',
    transition: 'all 0.2s ease',
    marginBottom: errors.email ? '0' : '1rem'
  };

  const submitButtonStyle = {
    width: '100%',
    padding: '0.85rem 1.5rem',
    fontWeight: 600,
    fontSize: '0.95rem',
    color: '#ffffff',
    background: 'linear-gradient(135deg, #4a90d9 0%, #2dd4bf 100%)',
    borderRadius: '10px',
    border: 'none',
    cursor: loading ? 'not-allowed' : 'pointer',
    opacity: loading ? 0.85 : 1,
    transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
    boxShadow: '0 4px 20px rgba(74, 144, 217, 0.35)',
    pointerEvents: loading ? 'none' : 'auto',
    marginTop: '1rem',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  };

  return (
    <AuthLayout leftHeading="Welcome Back" leftText="Log in to access your projects and continue building amazing things with Swind.">
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.8rem', color: '#0f172a', fontWeight: 700, marginBottom: '0.4rem', letterSpacing: '-0.02em' }}>Sign In</h2>
        <p style={{ color: '#64748b', fontSize: '0.95rem' }}>Enter your details to access your account</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: errors.email ? '0' : '1.25rem' }}>
          <label htmlFor="email" style={labelStyle}>Email Address</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); if(errors.email) setErrors({...errors, email: ''}) }}
            style={inputStyle}
            placeholder="you@example.com"
            onFocus={(e) => { e.target.style.borderColor = '#4a90d9'; e.target.style.boxShadow = '0 0 0 3px rgba(74,144,217,0.12)'; }}
            onBlur={(e) => { e.target.style.borderColor = errors.email ? '#ef4444' : '#e2e8f0'; e.target.style.boxShadow = errors.email ? '0 0 0 3px rgba(239,68,68,0.1)' : 'none'; }}
          />
          {errors.email && <div style={{ fontSize: '0.78rem', color: '#ef4444', marginTop: '0.35rem', minHeight: '1.1rem', marginBottom: '1rem' }}>{errors.email}</div>}
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label htmlFor="password" style={labelStyle}>Password</label>
            <Link to="/forgot-password" style={{ fontSize: '0.82rem', color: '#4a90d9', textDecoration: 'none', fontWeight: 600 }}>Forgot password?</Link>
          </div>
          <PasswordInput
            id="password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); if(errors.password) setErrors({...errors, password: ''}) }}
            placeholder="••••••••"
            error={errors.password}
          />
        </div>

        <button 
          type="submit" 
          style={submitButtonStyle}
          onMouseOver={(e) => { if(!loading) { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 24px rgba(74, 144, 217, 0.45)'; } }}
          onMouseOut={(e) => { if(!loading) { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(74, 144, 217, 0.35)'; } }}
        >
          {loading ? (
            <div style={{ width: '20px', height: '20px', border: '2.5px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          ) : 'Sign In'}
        </button>
      </form>

      <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.9rem', color: '#64748b' }}>
        Don't have an account? <Link to="/signup" style={{ color: '#4a90d9', textDecoration: 'none', fontWeight: 600 }}>Sign up</Link>
      </div>
      
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </AuthLayout>
  );
}
