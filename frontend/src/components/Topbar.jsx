import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import ProfileModal from './ProfileModal';

export default function Topbar() {
  const { user } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  const initials = user?.name ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'U';

  const topbarStyle = {
    height: '64px',
    padding: '0 2rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: darkMode ? '#0f1729' : '#ffffff',
    borderBottom: darkMode ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid #e2e8f0',
    transition: 'background-color 0.3s ease, border-color 0.3s ease',
  };

  const searchWrapperStyle = {
    position: 'relative',
    flex: 1,
    maxWidth: '420px',
  };

  const searchInputStyle = {
    width: '100%',
    padding: '0.6rem 1rem 0.6rem 2.6rem',
    fontSize: '0.9rem',
    color: darkMode ? '#e8eaf0' : '#1e293b',
    background: darkMode ? '#1e2a4a' : '#f1f5f9',
    border: darkMode ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid #cbd5e1',
    borderRadius: '9999px',
    outline: 'none',
    transition: 'all 0.2s ease',
  };

  const avatarStyle = {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #4a90d9 0%, #2dd4bf 100%)',
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '700',
    fontSize: '0.85rem',
    cursor: 'pointer',
    letterSpacing: '0.03em',
    boxShadow: '0 2px 10px rgba(74, 144, 217, 0.25)',
    transition: 'transform 0.2s',
  };

  return (
    <>
      <div style={topbarStyle}>
        <div style={searchWrapperStyle}>
          <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: darkMode ? '#6b7a99' : '#94a3b8', display: 'flex', alignItems: 'center' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </span>
          <input 
            type="text" 
            placeholder="Search projects or sites..." 
            style={searchInputStyle}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          {/* Dark / Light Mode Toggle */}
          <button
            onClick={toggleTheme}
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
              border: darkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid #cbd5e1',
              color: darkMode ? '#eab308' : '#64748b',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseOver={e => e.currentTarget.style.background = darkMode ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)'}
            onMouseOut={e => e.currentTarget.style.background = darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'}
          >
            {darkMode ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
            )}
          </button>

          <button 
            onClick={() => setIsProfileOpen(true)}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: darkMode ? '#b0b8c9' : '#64748b', 
              cursor: 'pointer', 
              width: '36px', 
              height: '36px', 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              transition: 'all 0.15s ease',
            }} 
            onMouseOver={e => e.currentTarget.style.background = darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'} 
            onMouseOut={e => e.currentTarget.style.background = 'none'}
            title="Settings / Profile"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            </svg>
          </button>

          <div 
            style={avatarStyle} 
            title="View User Profile" 
            onClick={() => setIsProfileOpen(true)}
            onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            {initials}
          </div>
        </div>
      </div>

      <ProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
    </>
  );
}
