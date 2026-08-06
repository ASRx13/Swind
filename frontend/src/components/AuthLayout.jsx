import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

export default function AuthLayout({ leftHeading, leftText, children }) {
  const [logoError, setLogoError] = useState(false);
  const { darkMode, toggleTheme } = useTheme();

  const containerStyle = {
    display: 'flex',
    minHeight: '100vh',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    flexDirection: 'row',
    backgroundColor: darkMode ? '#0f172a' : '#f8fafc',
    transition: 'background-color 0.3s ease',
  };

  const leftPanelStyle = {
    flex: 1.1,
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    padding: '4rem 3.5rem',
    color: '#fff',
    overflow: 'hidden',
    backgroundImage: darkMode 
      ? 'linear-gradient(180deg, rgba(15, 23, 42, 0.45) 0%, rgba(15, 23, 42, 0.85) 100%), url(/auth-bg-dark.png)' 
      : 'linear-gradient(180deg, rgba(15, 23, 42, 0.35) 0%, rgba(15, 23, 42, 0.85) 100%), url(/auth-bg.jpg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    transition: 'background-image 0.5s ease',
  };

  const orb1Style = {
    position: 'absolute',
    width: '320px',
    height: '320px',
    background: 'rgba(74, 144, 217, 0.25)',
    filter: 'blur(90px)',
    borderRadius: '50%',
    animation: 'orbFloat 10s infinite alternate ease-in-out',
    top: '10%',
    left: '15%',
    pointerEvents: 'none',
  };

  const orb2Style = {
    position: 'absolute',
    width: '280px',
    height: '280px',
    background: 'rgba(45, 212, 191, 0.2)',
    filter: 'blur(80px)',
    borderRadius: '50%',
    animation: 'orbFloat 12s infinite alternate-reverse ease-in-out',
    bottom: '15%',
    right: '10%',
    pointerEvents: 'none',
  };

  const rightPanelStyle = {
    flex: 1,
    backgroundColor: darkMode ? '#1a1a2e' : '#ffffff',
    color: darkMode ? '#e8eaf0' : '#1e293b',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '1.5rem 2rem',
    position: 'relative',
    overflowY: 'auto',
    transition: 'background-color 0.3s ease, color 0.3s ease',
  };

  const formContainerStyle = {
    width: '100%',
    maxWidth: '420px',
    animation: 'fadeSlideUp 0.5s ease-out forwards',
  };

  const gradientTextStyle = {
    background: 'linear-gradient(135deg, #4a90d9 0%, #2dd4bf 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    fontSize: '2.2rem',
    fontWeight: '800',
    letterSpacing: '-0.03em',
  };

  return (
    <div style={containerStyle} className="auth-layout-container">
      <style>{`
        @media (max-width: 900px) {
          .auth-layout-container {
            flex-direction: column !important;
          }
          .auth-left-panel {
            min-height: 200px !important;
            flex: none !important;
            padding: 1.75rem !important;
            justify-content: center !important;
          }
        }
        @keyframes orbFloat {
          0% { transform: translateY(0px) translateX(0px); }
          100% { transform: translateY(-40px) translateX(25px); }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Theme Toggle Button at top right of Auth Pages */}
      <button
        onClick={toggleTheme}
        title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          zIndex: 10,
          width: '38px',
          height: '38px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)',
          border: darkMode ? '1px solid rgba(255,255,255,0.15)' : '1px solid rgba(0,0,0,0.1)',
          color: darkMode ? '#eab308' : '#64748b',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
        }}
      >
        {darkMode ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
        )}
      </button>

      {/* Left Panel */}
      <div style={leftPanelStyle} className="auth-left-panel">
        <div style={orb1Style}></div>
        <div style={orb2Style}></div>
        <div style={{ zIndex: 2, maxWidth: '480px' }}>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: 800,
            marginBottom: '0.75rem',
            letterSpacing: '-0.02em',
            lineHeight: 1.2,
            textShadow: '0 2px 10px rgba(0,0,0,0.5)'
          }}>
            {leftHeading}
          </h1>
          <p style={{
            fontSize: '1.05rem',
            lineHeight: 1.6,
            color: 'rgba(255, 255, 255, 0.9)',
            textShadow: '0 1px 5px rgba(0,0,0,0.4)',
            fontWeight: 400
          }}>
            {leftText}
          </p>
        </div>
      </div>

      {/* Right Panel */}
      <div style={rightPanelStyle}>
        <div style={formContainerStyle}>
          {/* Logo Header - Uses logo-light.png in Light Mode and logo.png in Dark Mode */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '1rem' }}>
            <Link to="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
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
          {children}
        </div>
      </div>
    </div>
  );
}
