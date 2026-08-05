import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function Sidebar({ onOpenCreateProject }) {
  const { logout } = useAuth();
  const { darkMode } = useTheme();
  const [logoError, setLogoError] = useState(false);
  const location = useLocation();

  const sidebarStyle = {
    width: '260px',
    height: '100vh',
    background: darkMode ? '#1a1a2e' : '#ffffff',
    position: 'fixed',
    left: 0,
    top: 0,
    display: 'flex',
    flexDirection: 'column',
    padding: '1.25rem',
    color: darkMode ? '#e8eaf0' : '#1e293b',
    borderRight: darkMode ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid #e2e8f0',
    zIndex: 100,
    transition: 'background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease',
  };

  const gradientTextStyle = {
    background: 'linear-gradient(135deg, #4a90d9 0%, #2dd4bf 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    fontSize: '1.5rem',
    fontWeight: '800',
    letterSpacing: '-0.03em',
  };

  const buttonStyle = {
    background: 'linear-gradient(135deg, #4a90d9 0%, #2dd4bf 100%)',
    color: '#ffffff',
    border: 'none',
    padding: '0.75rem 1rem',
    borderRadius: '10px',
    fontWeight: 600,
    fontSize: '0.9rem',
    cursor: 'pointer',
    marginTop: '1.25rem',
    marginBottom: '1.5rem',
    boxShadow: '0 4px 20px rgba(74, 144, 217, 0.35)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
  };

  const navItemStyle = (isActive) => ({
    padding: '0.75rem 1rem',
    margin: '0.2rem 0',
    borderRadius: '8px',
    cursor: 'pointer',
    color: isActive ? (darkMode ? '#ffffff' : '#4a90d9') : (darkMode ? '#b0b8c9' : '#64748b'),
    background: isActive ? (darkMode ? 'rgba(74, 144, 217, 0.12)' : 'rgba(74, 144, 217, 0.08)') : 'transparent',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontWeight: isActive ? 600 : 500,
    fontSize: '0.9rem',
    position: 'relative',
    transition: 'all 0.15s ease',
  });

  return (
    <div style={sidebarStyle}>
      {/* Logo Header - Uses logo-light.png in Light Mode and logo.png in Dark Mode */}
      <div style={{ padding: '0.5rem 0.5rem 0.75rem 0.5rem', display: 'flex', alignItems: 'center' }}>
        <Link to="/dashboard" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
          {!logoError ? (
            <img
              src={darkMode ? "/logo.png" : "/logo-light.png"}
              alt="Swind Logo"
              style={{ height: '72px', width: 'auto', objectFit: 'contain' }}
              onError={() => setLogoError(true)}
            />
          ) : null}
          {logoError && (
            <span style={gradientTextStyle}>Swind</span>
          )}
        </Link>
      </div>

      {/* New Project Button */}
      <button
        onClick={onOpenCreateProject}
        style={buttonStyle}
        onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
        onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        New Project
      </button>

      {/* Navigation Links */}
      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <Link
          to="/dashboard"
          style={navItemStyle(location.pathname === '/dashboard')}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
          </svg>
          Projects
        </Link>
      </nav>

      {/* Footer Logout */}
      <button
        onClick={logout}
        style={{
          background: 'none',
          border: 'none',
          color: darkMode ? '#6b7a99' : '#94a3b8',
          padding: '0.75rem 1rem',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          fontSize: '0.9rem',
          fontWeight: 500,
          borderRadius: '8px',
          marginTop: 'auto',
          transition: 'all 0.15s ease',
        }}
        onMouseOver={e => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'; e.currentTarget.style.color = '#ef4444'; }}
        onMouseOut={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = darkMode ? '#6b7a99' : '#94a3b8'; }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
          <polyline points="16 17 21 12 16 7"></polyline>
          <line x1="21" y1="12" x2="9" y2="12"></line>
        </svg>
        Logout
      </button>
    </div>
  );
}
