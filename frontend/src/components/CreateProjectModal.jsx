import React, { useState } from 'react';
import { apiRequest } from '../api/client';
import { useToast } from '../context/ToastContext';
import { useTheme } from '../context/ThemeContext';

const COLOR_PRESETS = [
  '#4a90d9', '#2dd4bf', '#f59e0b', '#ec4899',
  '#8b5cf6', '#10b981', '#e11d48', '#f97316',
  '#06b6d4', '#84cc16', '#6366f1', '#14b8a6',
];

export default function CreateProjectModal({ isOpen, onClose, onProjectCreated, onOpenSiteModal }) {
  const { showToast } = useToast();
  const { darkMode } = useTheme();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#4a90d9');
  const [customColor, setCustomColor] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Project Name is required', 'error');
      return;
    }

    setLoading(true);
    try {
      const newProject = await apiRequest('/api/projects', 'POST', {
        name: name.trim(),
        region: 'Global',
        description: description.trim() || null,
        color: color,
      });

      showToast(`Project "${newProject.name}" created • ${newProject.project_code}`, 'success');
      setName('');
      setDescription('');
      setColor('#4a90d9');
      setCustomColor('');
      if (onProjectCreated) onProjectCreated(newProject);
      onClose();

      // Immediately open the Add Site modal for this new project
      if (onOpenSiteModal) {
        setTimeout(() => onOpenSiteModal(newProject), 200);
      }
    } catch (err) {
      showToast(err.message || 'Failed to create project', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCustomColorApply = () => {
    const hex = customColor.trim();
    if (/^#[0-9A-Fa-f]{6}$/.test(hex)) {
      setColor(hex);
    } else if (/^[0-9A-Fa-f]{6}$/.test(hex)) {
      setColor(`#${hex}`);
    } else {
      showToast('Enter a valid hex color (e.g. #FF5733)', 'error');
    }
  };

  /* ── Theme-aware Styles ── */
  const C = {
    bg: darkMode ? '#1a1a2e' : '#ffffff',
    cardBg: darkMode ? '#1e2a4a' : '#f1f5f9',
    border: darkMode ? 'rgba(255,255,255,0.1)' : '#e2e8f0',
    inputBg: darkMode ? '#1e2a4a' : '#f8fafc',
    inputBorder: darkMode ? 'rgba(255,255,255,0.08)' : '#e2e8f0',
    text: darkMode ? '#e8eaf0' : '#0f172a',
    textSec: darkMode ? '#94a3b8' : '#64748b',
    label: darkMode ? '#b0b8c9' : '#475569',
  };

  const overlayStyle = {
    position: 'fixed', inset: 0,
    background: 'rgba(15, 23, 42, 0.75)',
    backdropFilter: 'blur(8px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 1000,
  };

  const modalStyle = {
    background: C.bg,
    border: `1px solid ${C.border}`,
    borderRadius: '16px',
    width: '100%',
    maxWidth: '580px',
    padding: '1.75rem 2rem',
    color: C.text,
    boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
    position: 'relative',
  };

  const inputStyle = {
    width: '100%',
    padding: '0.65rem 0.85rem',
    fontSize: '0.88rem',
    color: C.text,
    background: C.inputBg,
    border: `1px solid ${C.inputBorder}`,
    borderRadius: '8px',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s ease',
  };

  const labelStyle = {
    display: 'block',
    fontSize: '0.72rem',
    fontWeight: 600,
    color: C.label,
    marginBottom: '0.35rem',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
  };

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={e => e.stopPropagation()}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{ position: 'absolute', right: '14px', top: '14px', background: 'none', border: 'none', color: C.textSec, fontSize: '1.15rem', cursor: 'pointer', lineHeight: 1 }}
        >✕</button>

        {/* Header */}
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.25rem' }}>
          Create New Project
        </h2>
        <p style={{ color: C.textSec, fontSize: '0.82rem', marginBottom: '1.25rem' }}>
          A unique Project ID will be auto-generated. Add your first site next.
        </p>

        <form onSubmit={handleSubmit}>
          {/* Project Name */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={labelStyle}>Project Name *</label>
            <input
              type="text"
              placeholder="e.g. Jaisalmer Solar Park Phase 1"
              value={name}
              onChange={e => setName(e.target.value)}
              style={inputStyle}
              required
              onFocus={e => e.target.style.borderColor = '#4a90d9'}
              onBlur={e => e.target.style.borderColor = C.inputBorder}
            />
          </div>

          {/* Description */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={labelStyle}>Project Description (Optional)</label>
            <textarea
              placeholder="Brief overview of energy targets, land scope, etc."
              value={description}
              onChange={e => setDescription(e.target.value)}
              style={{ ...inputStyle, minHeight: '60px', resize: 'vertical' }}
              onFocus={e => e.target.style.borderColor = '#4a90d9'}
              onBlur={e => e.target.style.borderColor = C.inputBorder}
            />
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1, padding: '0.7rem',
                background: darkMode ? 'rgba(255,255,255,0.05)' : '#f1f5f9',
                border: `1px solid ${C.inputBorder}`, color: C.textSec,
                borderRadius: '8px', fontWeight: 600, cursor: 'pointer',
                fontSize: '0.88rem',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                flex: 1.3, padding: '0.7rem',
                background: 'linear-gradient(135deg, #4a90d9 0%, #2dd4bf 100%)',
                border: 'none', color: '#ffffff', borderRadius: '8px',
                fontWeight: 600, cursor: 'pointer', fontSize: '0.88rem',
                opacity: loading ? 0.7 : 1,
                boxShadow: '0 4px 15px rgba(74, 144, 217, 0.35)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
              }}
            >
              {loading ? 'Creating...' : (
                <>
                  Add Site
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                  </svg>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
