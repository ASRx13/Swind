import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import PasswordInput from '../components/PasswordInput';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useTheme } from '../context/ThemeContext';

export default function SignupPage() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { login, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const { darkMode } = useTheme();
  const navigate = useNavigate();

  // Auto-redirect to dashboard if user is already logged in on this device
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email address';
    
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    if (errors[e.target.id]) setErrors({ ...errors, [e.target.id]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.detail || data.message || 'Registration failed');
      }
      
      // Directly log in user and store token
      if (data.token && data.user) {
        login(data.token, data.user);
        showToast('Account created successfully! Welcome to Swind.', 'success');
        navigate('/dashboard', { replace: true });
      } else {
        showToast('Account created! Please sign in.', 'success');
        navigate('/login');
      }
    } catch (err) {
      showToast(err.message || 'Something went wrong', 'error');
    } finally {
      setLoading(false);
    }
  };

  const labelStyle = { 
    display: 'block', 
    fontSize: '0.82rem', 
    fontWeight: 600, 
    textTransform: 'uppercase', 
    color: darkMode ? '#b0b8c9' : '#1e293b', 
    marginBottom: '0.45rem' 
  };
  
  const getInputStyle = (fieldError) => ({
    width: '100%', 
    padding: '0.8rem 1rem', 
    fontSize: '0.95rem', 
    color: darkMode ? '#e8eaf0' : '#1e293b',
    background: darkMode ? '#1e2a4a' : '#f8fafc',
    border: `1.5px solid ${fieldError ? '#ef4444' : darkMode ? 'rgba(255,255,255,0.1)' : '#e2e8f0'}`,
    borderRadius: '8px', 
    outline: 'none',
    boxShadow: fieldError ? '0 0 0 3px rgba(239,68,68,0.1)' : 'none',
    transition: 'all 0.2s ease',
    marginBottom: fieldError ? '0' : '1rem'
  });

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
    <AuthLayout leftHeading="Join Swind" leftText="Create an account to start building and managing your projects effortlessly.">
      <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
        <h2 style={{ fontSize: '1.75rem', color: darkMode ? '#ffffff' : '#0f172a', fontWeight: 700, marginBottom: '0.25rem', letterSpacing: '-0.02em' }}>Create Account</h2>
        <p style={{ color: darkMode ? '#b0b8c9' : '#64748b', fontSize: '0.9rem' }}>Fill in your details to get started</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: errors.name ? '0' : '0.85rem' }}>
          <label htmlFor="name" style={labelStyle}>Full Name</label>
          <input
            id="name" type="text" value={formData.name} onChange={handleChange}
            style={getInputStyle(errors.name)} placeholder="John Doe"
            onFocus={(e) => { e.target.style.borderColor = '#4a90d9'; e.target.style.boxShadow = '0 0 0 3px rgba(74,144,217,0.12)'; }}
            onBlur={(e) => { e.target.style.borderColor = errors.name ? '#ef4444' : darkMode ? 'rgba(255,255,255,0.1)' : '#e2e8f0'; e.target.style.boxShadow = errors.name ? '0 0 0 3px rgba(239,68,68,0.1)' : 'none'; }}
          />
          {errors.name && <div style={{ fontSize: '0.78rem', color: '#ef4444', marginTop: '0.25rem', minHeight: '1rem', marginBottom: '0.5rem' }}>{errors.name}</div>}
        </div>

        <div style={{ marginBottom: errors.email ? '0' : '0.85rem' }}>
          <label htmlFor="email" style={labelStyle}>Email Address</label>
          <input
            id="email" type="email" value={formData.email} onChange={handleChange}
            style={getInputStyle(errors.email)} placeholder="you@example.com"
            onFocus={(e) => { e.target.style.borderColor = '#4a90d9'; e.target.style.boxShadow = '0 0 0 3px rgba(74,144,217,0.12)'; }}
            onBlur={(e) => { e.target.style.borderColor = errors.email ? '#ef4444' : darkMode ? 'rgba(255,255,255,0.1)' : '#e2e8f0'; e.target.style.boxShadow = errors.email ? '0 0 0 3px rgba(239,68,68,0.1)' : 'none'; }}
          />
          {errors.email && <div style={{ fontSize: '0.78rem', color: '#ef4444', marginTop: '0.25rem', minHeight: '1rem', marginBottom: '0.5rem' }}>{errors.email}</div>}
        </div>

        <div style={{ marginBottom: '0.85rem' }}>
          <label htmlFor="password" style={labelStyle}>Password</label>
          <PasswordInput
            id="password" value={formData.password} onChange={handleChange}
            placeholder="••••••••" showStrength={true} error={errors.password}
          />
        </div>

        <div style={{ marginBottom: '0.85rem' }}>
          <label htmlFor="confirmPassword" style={labelStyle}>Confirm Password</label>
          <PasswordInput
            id="confirmPassword" value={formData.confirmPassword} onChange={handleChange}
            placeholder="••••••••" error={errors.confirmPassword}
          />
        </div>

        <button 
          type="submit" style={submitButtonStyle}
          onMouseOver={(e) => { if(!loading) { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 24px rgba(74, 144, 217, 0.45)'; } }}
          onMouseOut={(e) => { if(!loading) { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(74, 144, 217, 0.35)'; } }}
        >
          {loading ? (
            <div style={{ width: '20px', height: '20px', border: '2.5px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          ) : 'Create Account'}
        </button>
      </form>

      <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.9rem', color: darkMode ? '#b0b8c9' : '#64748b' }}>
        Already have an account? <Link to="/login" style={{ color: '#4a90d9', textDecoration: 'none', fontWeight: 600 }}>Log in</Link>
      </div>
      
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </AuthLayout>
  );
}
