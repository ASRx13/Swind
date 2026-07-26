import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function AuthLayout({ leftHeading, leftText, children }) {
  const [logoError, setLogoError] = useState(false);

  const containerStyle = {
    display: 'flex',
    minHeight: '100vh',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    flexDirection: 'row',
    backgroundColor: '#0f172a',
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
    backgroundImage: 'linear-gradient(180deg, rgba(15, 23, 42, 0.35) 0%, rgba(15, 23, 42, 0.85) 100%), url(/auth-bg.jpg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
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
    backgroundColor: '#ffffff',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '1.5rem 2rem',
    position: 'relative',
    overflowY: 'auto',
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
          {/* Logo Header - Centered above form with tight spacing */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '1rem' }}>
            <Link to="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
              {!logoError ? (
                <img
                  src="/logo.png"
                  alt="Swind Logo"
                  style={{ height: '100px', width: 'auto', objectFit: 'contain' }}
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

