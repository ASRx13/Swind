import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import { useToast } from '../context/ToastContext';
import { apiRequest } from '../api/client.js';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Email is required');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Invalid email address');
      return;
    }

    setLoading(true);
    try {
      const data = await apiRequest('/api/auth/forgot-password', 'POST', { email: email.trim() });
      setSuccess(true);
      showToast(data.message || 'Reset link sent!', 'success');
    } catch (err) {
      showToast('Something went wrong', 'error');
    } finally {
      setLoading(false);
    }
  };

  const labelStyle = { display: 'block', fontSize: '0.82rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-dark, #1e293b)', marginBottom: '0.45rem' };
  
  const inputStyle = {
    width: '100%', padding: '0.8rem 1rem', fontSize: '0.95rem', color: 'var(--text-dark, #1e293b)',
    background: 'var(--input-bg, #f8fafc)',
    border: `1.5px solid ${error ? 'var(--color-error, #ef4444)' : 'var(--input-border, #e2e8f0)'}`,
    borderRadius: 'var(--radius-md, 8px)', outline: 'none',
    boxShadow: error ? '0 0 0 3px rgba(239,68,68,0.1)' : 'none',
    transition: 'all 0.2s ease',
    marginBottom: error ? '0' : '1rem'
  };

  const submitButtonStyle = {
    width: '100%', padding: '0.85rem 1.5rem', fontWeight: 600, color: '#fff',
    background: 'var(--accent-gradient, linear-gradient(135deg, #3b82f6 0%, #2563eb 100%))',
    borderRadius: 'var(--radius-md, 8px)', border: 'none',
    cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.85 : 1,
    transition: 'all 0.2s', boxShadow: '0 4px 15px rgba(37, 99, 235, 0.2)',
    pointerEvents: loading ? 'none' : 'auto', marginTop: '1rem',
    display: 'flex', justifyContent: 'center', alignItems: 'center'
  };

  return (
    <AuthLayout leftHeading="Reset Password" leftText="Don't worry, it happens to the best of us. We'll send you a link to reset your password.">
      
      {success ? (
        <div style={{ textAlign: 'center', padding: '2rem', background: 'rgba(34, 197, 94, 0.1)', borderRadius: '12px', border: '1px solid rgba(34, 197, 94, 0.2)' }}>
          <div style={{ width: '60px', height: '60px', background: '#22c55e', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
            <svg width="30" height="30" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"></path></svg>
          </div>
          <h2 style={{ fontSize: '1.5rem', color: '#166534', marginBottom: '0.5rem' }}>Check your email</h2>
          <p style={{ color: '#15803d', marginBottom: '2rem', fontSize: '0.95rem' }}>We've sent a password reset link to <strong>{email}</strong>.</p>
          <Link to="/login" style={{ display: 'inline-block', padding: '0.8rem 1.5rem', background: '#fff', color: '#166534', fontWeight: 600, borderRadius: '8px', textDecoration: 'none', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
            Back to Login
          </Link>
        </div>
      ) : (
        <>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.8rem', color: 'var(--text-dark, #0f172a)', marginBottom: '0.5rem' }}>Forgot Password</h2>
            <p style={{ color: '#64748b' }}>Enter your email to receive a reset link</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: error ? '0' : '1rem' }}>
              <label htmlFor="email" style={labelStyle}>Email Address</label>
              <input
                id="email" type="email" value={email} onChange={(e) => { setEmail(e.target.value); setError(''); }}
                style={inputStyle} placeholder="you@example.com"
                onFocus={(e) => { e.target.style.borderColor = 'var(--input-border-focus, #3b82f6)'; e.target.style.boxShadow = '0 0 0 3px rgba(74,144,217,0.12)'; }}
                onBlur={(e) => { e.target.style.borderColor = error ? 'var(--color-error, #ef4444)' : 'var(--input-border, #e2e8f0)'; e.target.style.boxShadow = error ? '0 0 0 3px rgba(239,68,68,0.1)' : 'none'; }}
              />
              {error && <div style={{ fontSize: '0.78rem', color: 'var(--color-error, #ef4444)', marginTop: '0.35rem', minHeight: '1.1rem', marginBottom: '1rem' }}>{error}</div>}
            </div>

            <button 
              type="submit" style={submitButtonStyle}
              onMouseOver={(e) => { if(!loading) { e.currentTarget.style.transform = 'translateY(-1px) scale(1.01)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(37, 99, 235, 0.3)'; } }}
              onMouseOut={(e) => { if(!loading) { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 15px rgba(37, 99, 235, 0.2)'; } }}
            >
              {loading ? (
                <div style={{ width: '20px', height: '20px', border: '3px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
              ) : 'Send Reset Link'}
            </button>
          </form>

          <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.9rem' }}>
            <Link to="/login" style={{ color: '#64748b', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
              Back to Login
            </Link>
          </div>
        </>
      )}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </AuthLayout>
  );
}
