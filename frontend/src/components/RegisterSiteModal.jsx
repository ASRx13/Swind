import React, { useState } from 'react';
import MapPicker from './MapPicker';
import { apiRequest } from '../api/client';
import { useToast } from '../context/ToastContext';

export default function RegisterSiteModal({ isOpen, onClose, project, onSiteRegistered }) {
  const { showToast } = useToast();
  const [siteName, setSiteName] = useState('');
  const [latitude, setLatitude] = useState(26.9124);
  const [longitude, setLongitude] = useState(75.7873);
  const [region, setRegion] = useState(project?.region || 'Rajasthan');
  const [landArea, setLandArea] = useState(50);
  const [elevation, setElevation] = useState(250);
  const [infrastructure, setInfrastructure] = useState('Substation within 5km, Access Road');
  const [landOwnership, setLandOwnership] = useState('Public / Government');
  const [loading, setLoading] = useState(false);

  if (!isOpen || !project) return null;

  const handleSelectLocation = (lat, lng) => {
    setLatitude(parseFloat(lat.toFixed(6)));
    setLongitude(parseFloat(lng.toFixed(6)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!siteName.trim()) {
      showToast('Site Name is required', 'error');
      return;
    }

    setLoading(true);
    try {
      const site = await apiRequest(`/api/projects/${project.id}/sites`, 'POST', {
        name: siteName.trim(),
        latitude,
        longitude,
        region: region.trim(),
        land_area: parseFloat(landArea),
        elevation: parseFloat(elevation),
        existing_infrastructure: infrastructure.trim(),
        land_ownership: landOwnership
      });

      showToast(`Site "${site.name}" registered successfully!`, 'success');
      if (onSiteRegistered) onSiteRegistered(site);
      onClose();
    } catch (err) {
      showToast(err.message || 'Failed to register site', 'error');
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
    padding: '1rem'
  };

  const modalContentStyle = {
    background: '#1a1a2e',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '16px',
    width: '100%',
    maxWidth: '720px',
    maxHeight: '90vh',
    overflowY: 'auto',
    padding: '2rem',
    color: '#e8eaf0',
    boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
    position: 'relative'
  };

  const inputStyle = {
    width: '100%',
    padding: '0.65rem 0.85rem',
    fontSize: '0.88rem',
    color: '#e8eaf0',
    background: '#1e2a4a',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '8px',
    outline: 'none',
  };

  const labelStyle = {
    display: 'block',
    fontSize: '0.75rem',
    fontWeight: 600,
    color: '#b0b8c9',
    marginBottom: '0.35rem',
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

        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.2rem' }}>
          Register Site for {project.name}
        </h2>
        <p style={{ color: '#4a90d9', fontSize: '0.85rem', fontWeight: 600, marginBottom: '1.25rem' }}>
          Project ID: {project.project_code}
        </p>

        <form onSubmit={handleSubmit}>
          {/* Map Selector */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={labelStyle}>Drop Pin on Candidate Site (Interactive Map) *</label>
            <MapPicker 
              initialLat={latitude} 
              initialLng={longitude} 
              onSelectLocation={handleSelectLocation} 
              height="240px"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={labelStyle}>Site Name *</label>
              <input 
                type="text" 
                placeholder="e.g. Plot Alpha - Thar East" 
                value={siteName} 
                onChange={e => setSiteName(e.target.value)} 
                style={inputStyle}
                required 
              />
            </div>

            <div>
              <label style={labelStyle}>Region / District *</label>
              <input 
                type="text" 
                value={region} 
                onChange={e => setRegion(e.target.value)} 
                style={inputStyle}
                required 
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
            <div>
              <label style={labelStyle}>Latitude *</label>
              <input 
                type="number" 
                step="any" 
                value={latitude} 
                onChange={e => setLatitude(parseFloat(e.target.value))} 
                style={inputStyle}
                required 
              />
            </div>

            <div>
              <label style={labelStyle}>Longitude *</label>
              <input 
                type="number" 
                step="any" 
                value={longitude} 
                onChange={e => setLongitude(parseFloat(e.target.value))} 
                style={inputStyle}
                required 
              />
            </div>

            <div>
              <label style={labelStyle}>Land Area (ha) *</label>
              <input 
                type="number" 
                step="any" 
                value={landArea} 
                onChange={e => setLandArea(e.target.value)} 
                style={inputStyle}
                required 
              />
            </div>

            <div>
              <label style={labelStyle}>Elevation (m)</label>
              <input 
                type="number" 
                step="any" 
                value={elevation} 
                onChange={e => setElevation(e.target.value)} 
                style={inputStyle}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <label style={labelStyle}>Existing Infrastructure</label>
              <input 
                type="text" 
                placeholder="e.g. Substation within 5km, Highway access" 
                value={infrastructure} 
                onChange={e => setInfrastructure(e.target.value)} 
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Land Ownership *</label>
              <select 
                value={landOwnership} 
                onChange={e => setLandOwnership(e.target.value)} 
                style={{ ...inputStyle, cursor: 'pointer' }}
              >
                <option value="Public / Government">Public / Government</option>
                <option value="Private Land">Private Land</option>
                <option value="Commercial Lease">Commercial Lease</option>
                <option value="Agricultural Conversion">Agricultural Conversion</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
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
              {loading ? 'Registering...' : 'Register Site'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
