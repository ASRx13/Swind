import React, { useState } from 'react';
import { apiRequest } from '../api/client';
import { useToast } from '../context/ToastContext';

export default function CreateProjectModal({ isOpen, onClose, onProjectCreated }) {
  const { showToast } = useToast();
  const [name, setName] = useState('');
  const [region, setRegion] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !region.trim()) {
      showToast('Project Name and Region are required', 'error');
      return;
    }

    setLoading(true);
    try {
      const newProject = await apiRequest('/api/projects', 'POST', {
        name: name.trim(),
        region: region.trim(),
        description: description.trim() || null
      });

      showToast(`Project created with ID: ${newProject.project_code}`, 'success');
      setName('');
      setRegion('');
      setDescription('');
      if (onProjectCreated) onProjectCreated(newProject);
      onClose();
    } catch (err) {
      showToast(err.message || 'Failed to create project', 'error');
    } finally {
      setLoading(false);
    }
  };

  const modalOverlayStyle = {
    position: 'fixed',
    inset: 0,
    background: 'rgba(15, 23, 42, 0.75)',
    backdropFilter: 'blur(8px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  };

  const modalContentStyle = {
    background: '#1a1a2e',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '16px',
    width: '100%',
    maxWidth: '460px',
    padding: '2rem',
    color: '#e8eaf0',
    boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
    position: 'relative'
  };

  const inputStyle = {
    width: '100%',
    padding: '0.75rem 1rem',
    fontSize: '0.9rem',
    color: '#e8eaf0',
    background: '#1e2a4a',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '8px',
    outline: 'none',
    marginBottom: '1.25rem'
  };

  const labelStyle = {
    display: 'block',
    fontSize: '0.78rem',
    fontWeight: 600,
    color: '#b0b8c9',
    marginBottom: '0.4rem',
    textTransform: 'uppercase',
    letterSpacing: '0.03em'
  };

  return (
    <div style={modalOverlayStyle} onClick={onClose}>
      <div style={modalContentStyle} onClick={e => e.stopPropagation()}>
        <button 
          onClick={onClose}
          style={{ position: 'absolute', right: '16px', top: '16px', background: 'none', border: 'none', color: '#94a3b8', fontSize: '1.2rem', cursor: 'pointer' }}
        >
          ✕
        </button>

        <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.4rem' }}>
          Create New Project
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '0.88rem', marginBottom: '1.5rem' }}>
          A unique Project ID will be auto-generated for milestone tracking.
        </p>

        <form onSubmit={handleSubmit}>
          <div>
            <label style={labelStyle}>Project Name *</label>
            <input 
              type="text" 
              placeholder="e.g. Jaisalmer Solar Park Phase 1" 
              value={name} 
              onChange={e => setName(e.target.value)} 
              style={inputStyle}
              required 
            />
          </div>

          <div>
            <label style={labelStyle}>Target Region / State *</label>
            <input 
              type="text" 
              placeholder="e.g. Rajasthan, Western India" 
              value={region} 
              onChange={e => setRegion(e.target.value)} 
              style={inputStyle}
              required 
            />
          </div>

          <div>
            <label style={labelStyle}>Project Description (Optional)</label>
            <textarea 
              placeholder="Brief overview of energy targets, land scope, etc." 
              value={description} 
              onChange={e => setDescription(e.target.value)} 
              style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
            <button 
              type="button" 
              onClick={onClose}
              style={{
                flex: 1, padding: '0.75rem', background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.08)', color: '#94a3b8', borderRadius: '8px', fontWeight: 600, cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={loading}
              style={{
                flex: 1, padding: '0.75rem', background: 'linear-gradient(135deg, #4a90d9 0%, #2dd4bf 100%)',
                border: 'none', color: '#ffffff', borderRadius: '8px', fontWeight: 600, cursor: 'pointer',
                opacity: loading ? 0.7 : 1, boxShadow: '0 4px 15px rgba(74, 144, 217, 0.35)'
              }}
            >
              {loading ? 'Creating...' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
