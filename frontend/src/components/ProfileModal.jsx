import React, { useEffect, useState } from 'react';
import { apiRequest } from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function ProfileModal({ isOpen, onClose }) {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      apiRequest('/api/users/me', 'GET')
        .then(data => {
          setProfile(data);
        })
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const modalOverlayStyle = {
    position: 'fixed',
    inset: 0,
    background: 'rgba(15, 23, 42, 0.75)',
    backdropFilter: 'blur(8px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    animation: 'fadeIn 0.2s ease-out'
  };

  const modalContentStyle = {
    background: '#1a1a2e',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '16px',
    width: '100%',
    maxWidth: '440px',
    padding: '2rem',
    color: '#e8eaf0',
    boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
    position: 'relative'
  };

  const initials = user?.name ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'U';

  return (
    <div style={modalOverlayStyle} onClick={onClose}>
      <div style={modalContentStyle} onClick={e => e.stopPropagation()}>
        {/* Close Button */}
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            right: '16px',
            top: '16px',
            background: 'none',
            border: 'none',
            color: '#94a3b8',
            fontSize: '1.2rem',
            cursor: 'pointer'
          }}
        >
          ✕
        </button>

        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{
            width: '68px',
            height: '68px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #4a90d9 0%, #2dd4bf 100%)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '1.5rem',
            margin: '0 auto 1rem auto',
            boxShadow: '0 4px 20px rgba(74, 144, 217, 0.35)'
          }}>
            {initials}
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.2rem' }}>
            {user?.name || 'User Profile'}
          </h2>
          <p style={{ color: '#b0b8c9', fontSize: '0.9rem' }}>{user?.email}</p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem 0', color: '#94a3b8' }}>Loading profile metrics...</div>
        ) : (
          <div>
            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              borderRadius: '12px',
              padding: '1.25rem',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1rem',
              textAlign: 'center',
              marginBottom: '1.5rem'
            }}>
              <div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#4a90d9' }}>
                  {profile?.total_projects || 0}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600, marginTop: '2px' }}>
                  Projects
                </div>
              </div>

              <div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#2dd4bf' }}>
                  {profile?.total_sites || 0}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600, marginTop: '2px' }}>
                  Registered Sites
                </div>
              </div>
            </div>

            <div style={{ fontSize: '0.85rem', color: '#6b7a99', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Account Status:</span>
                <span style={{ color: '#22c55e', fontWeight: 600 }}>Active (Verified)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Role:</span>
                <span style={{ color: '#e8eaf0', fontWeight: 500 }}>Energy Planner / Analyst</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Member Since:</span>
                <span style={{ color: '#e8eaf0', fontWeight: 500 }}>
                  {profile?.created_at ? new Date(profile.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '2026'}
                </span>
              </div>
            </div>
          </div>
        )}

        <button 
          onClick={onClose}
          style={{
            width: '100%',
            padding: '0.75rem',
            marginTop: '1.5rem',
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: '#e8eaf0',
            borderRadius: '10px',
            fontWeight: 600,
            cursor: 'pointer',
            fontSize: '0.9rem'
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
}
