import React, { useState } from 'react';

export default function PasswordInput({ id, value, onChange, placeholder, autoComplete, showStrength, error }) {
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState(false);

  const calculateStrength = (pwd) => {
    let score = 0;
    if (pwd.length >= 6) score += 1;
    if (pwd.length >= 10) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;
    return score;
  };

  const strength = calculateStrength(value);
  let strengthLabel = 'Weak';
  let strengthColor = '#ef4444';
  let strengthWidth = '33%';
  if (strength >= 4) {
    strengthLabel = 'Strong';
    strengthColor = '#22c55e';
    strengthWidth = '100%';
  } else if (strength >= 3) {
    strengthLabel = 'Medium';
    strengthColor = '#eab308';
    strengthWidth = '66%';
  }

  const inputStyle = {
    width: '100%',
    padding: '0.8rem 1rem',
    paddingRight: '2.5rem',
    fontSize: '0.95rem',
    color: 'var(--text-dark, #1e293b)',
    background: 'var(--input-bg, #f8fafc)',
    border: `1.5px solid ${error ? 'var(--color-error, #ef4444)' : (focused ? 'var(--input-border-focus, #3b82f6)' : 'var(--input-border, #e2e8f0)')}`,
    borderRadius: 'var(--radius-md, 8px)',
    outline: 'none',
    boxShadow: error ? '0 0 0 3px rgba(239,68,68,0.1)' : (focused ? '0 0 0 3px rgba(74,144,217,0.12)' : 'none'),
    transition: 'all 0.2s ease'
  };

  return (
    <div style={{ marginBottom: '1rem', position: 'relative' }}>
      <div style={{ position: 'relative' }}>
        <input
          id={id}
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          style={inputStyle}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          style={{
            position: 'absolute',
            right: '0.8rem',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#64748b'
          }}
        >
          {showPassword ? (
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
          ) : (
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22"></path></svg>
          )}
        </button>
      </div>
      
      {showStrength && value.length > 0 && (
        <div style={{ marginTop: '0.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748b', marginBottom: '0.2rem' }}>
            <span>Password strength</span>
            <span style={{ color: strengthColor, fontWeight: 600 }}>{strengthLabel}</span>
          </div>
          <div style={{ height: '4px', background: '#e2e8f0', borderRadius: '2px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: strengthWidth, background: strengthColor, transition: 'all 0.3s ease' }}></div>
          </div>
        </div>
      )}
      
      {error && (
        <div style={{ fontSize: '0.78rem', color: 'var(--color-error, #ef4444)', marginTop: '0.35rem', minHeight: '1.1rem' }}>
          {error}
        </div>
      )}
    </div>
  );
}
