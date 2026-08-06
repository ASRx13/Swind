import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Country, State, City } from 'country-state-city';
import MapPicker from './MapPicker';
import { apiRequest } from '../api/client';
import { useToast } from '../context/ToastContext';
import { useTheme } from '../context/ThemeContext';

const COLOR_PRESETS = [
  '#4a90d9', '#2dd4bf', '#f59e0b', '#ec4899',
  '#8b5cf6', '#10b981', '#e11d48', '#f97316',
  '#06b6d4', '#84cc16', '#6366f1', '#14b8a6',
];

export default function RegisterSiteModal({ isOpen, onClose, project, onSiteRegistered }) {
  const { showToast } = useToast();
  const { darkMode } = useTheme();

  /* ── Form State ── */
  const [siteName, setSiteName] = useState('');
  const [energyType, setEnergyType] = useState('solar');
  const [pinColor, setPinColor] = useState(project?.color || '#4a90d9');

  // Location
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [latitude, setLatitude] = useState(26.9124);
  const [longitude, setLongitude] = useState(75.7873);

  // Site parameters
  const [elevation, setElevation] = useState(250);
  const [unsuitableLocation, setUnsuitableLocation] = useState(false);
  const UNSUITABLE_MSG = "No Solar/Wind Energy Can Be Implemented As There Is Zero Suitability And It Is Not Economic";

  const [loading, setLoading] = useState(false);

  // Sync project color when project changes
  useEffect(() => {
    if (project?.color) setPinColor(project.color);
  }, [project]);

  /* ── Memoised geo lists ── */
  const countries = useMemo(() => Country.getAllCountries(), []);

  const states = useMemo(() => {
    if (!selectedCountry) return [];
    return State.getStatesOfCountry(selectedCountry);
  }, [selectedCountry]);

  const cities = useMemo(() => {
    if (!selectedCountry || !selectedState) return [];
    return City.getCitiesOfState(selectedCountry, selectedState);
  }, [selectedCountry, selectedState]);

  /* ── Handlers ── */
  const handleCountryChange = (isoCode) => {
    setSelectedCountry(isoCode);
    setSelectedState('');
    setSelectedCity('');
    if (isoCode) {
      const c = Country.getCountryByCode(isoCode);
      if (c) {
        setLatitude(parseFloat(c.latitude));
        setLongitude(parseFloat(c.longitude));
      }
    }
  };

  const handleStateChange = (isoCode) => {
    setSelectedState(isoCode);
    setSelectedCity('');
    if (isoCode && selectedCountry) {
      const s = State.getStateByCodeAndCountry(isoCode, selectedCountry);
      if (s && s.latitude && s.longitude) {
        setLatitude(parseFloat(s.latitude));
        setLongitude(parseFloat(s.longitude));
      }
    }
  };

  const handleCityChange = (cityName) => {
    setSelectedCity(cityName);
    if (cityName && selectedCountry && selectedState) {
      const allCities = City.getCitiesOfState(selectedCountry, selectedState);
      const c = allCities.find(ci => ci.name === cityName);
      if (c && c.latitude && c.longitude) {
        setLatitude(parseFloat(c.latitude));
        setLongitude(parseFloat(c.longitude));
      }
    }
  };

  const handleSelectLocation = async (lat, lng) => {
    setLatitude(parseFloat(lat.toFixed(6)));
    setLongitude(parseFloat(lng.toFixed(6)));
    setUnsuitableLocation(false);
    
    let isOcean = false;
    let currentElev = 250;

    // Reverse geocode to auto-fill country/state/city & check for ocean
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&addressdetails=1`, {
        headers: { 'Accept-Language': 'en' }
      });
      const data = await res.json();

      if (!data || data.error || !data.address || !data.address.country || 
          data.type === 'ocean' || data.type === 'sea' || data.type === 'water' || data.type === 'bay' ||
          (data.category === 'natural' && (data.type === 'water' || data.type === 'sea' || data.type === 'ocean'))) {
        isOcean = true;
      }

      if (data && data.address && data.address.country) {
        const addr = data.address;
        const countryName = addr.country;
        const allCountries = Country.getAllCountries();
        const matchedCountry = allCountries.find(c => c.name.toLowerCase() === countryName.toLowerCase());
        if (matchedCountry) {
          setSelectedCountry(matchedCountry.isoCode);
          const stateName = addr.state || addr.region || addr.state_district;
          if (stateName) {
            const allStates = State.getStatesOfCountry(matchedCountry.isoCode);
            const matchedState = allStates.find(s => 
              s.name.toLowerCase() === stateName.toLowerCase() ||
              stateName.toLowerCase().includes(s.name.toLowerCase()) ||
              s.name.toLowerCase().includes(stateName.toLowerCase())
            );
            if (matchedState) {
              setSelectedState(matchedState.isoCode);
              const cityName = addr.city || addr.town || addr.village || addr.county || addr.suburb;
              if (cityName) {
                const allCities = City.getCitiesOfState(matchedCountry.isoCode, matchedState.isoCode);
                const matchedCity = allCities.find(c =>
                  c.name.toLowerCase() === cityName.toLowerCase() ||
                  cityName.toLowerCase().includes(c.name.toLowerCase()) ||
                  c.name.toLowerCase().includes(cityName.toLowerCase())
                );
                if (matchedCity) {
                  setSelectedCity(matchedCity.name);
                } else {
                  setSelectedCity('');
                }
              }
            } else {
              setSelectedState('');
              setSelectedCity('');
            }
          }
        }
      } else {
        setSelectedCountry('');
        setSelectedState('');
        setSelectedCity('');
      }
    } catch (err) {
      console.error('Reverse geocoding failed:', err);
    }
    
    // Fetch elevation from Open-Meteo API
    try {
      const elevRes = await fetch(`https://api.open-meteo.com/v1/elevation?latitude=${lat}&longitude=${lng}`);
      const elevData = await elevRes.json();
      if (elevData && elevData.elevation && elevData.elevation.length > 0) {
        currentElev = Math.round(elevData.elevation[0]);
        setElevation(currentElev);
      }
    } catch (err) {
      console.error('Elevation fetch failed:', err);
    }

    // Check suitability (Ocean or Extreme Mountain Elevation > 3000m or < -10m)
    if (isOcean || currentElev > 3000 || currentElev < -10) {
      setUnsuitableLocation(true);
      showToast(UNSUITABLE_MSG, 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!siteName.trim()) {
      showToast('Site Name is required', 'error');
      return;
    }

    if (unsuitableLocation) {
      showToast(UNSUITABLE_MSG, 'error');
      return;
    }

    // Derive region from country/state/city
    const regionParts = [];
    if (selectedCity) regionParts.push(selectedCity);
    if (selectedState) {
      const s = State.getStateByCodeAndCountry(selectedState, selectedCountry);
      if (s) regionParts.push(s.name);
    }
    if (selectedCountry) {
      const c = Country.getCountryByCode(selectedCountry);
      if (c) regionParts.push(c.name);
    }
    const region = regionParts.length > 0 ? regionParts.join(', ') : 'Not Specified';

    setLoading(true);
    try {
      const site = await apiRequest(`/api/projects/${project.id}/sites`, 'POST', {
        name: siteName.trim(),
        latitude,
        longitude,
        region,
        land_area: 0,
        elevation: parseFloat(elevation),
        existing_infrastructure: '',
        land_ownership: 'Not Specified',
        energy_type: energyType,
        country: selectedCountry ? Country.getCountryByCode(selectedCountry)?.name : null,
        state: selectedState ? State.getStateByCodeAndCountry(selectedState, selectedCountry)?.name : null,
        city: selectedCity || null,
        boundary_type: 'point',
        boundary_coordinates: null,
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

  if (!isOpen || !project) return null;

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
    accentTeal: '#2dd4bf',
    accentBlue: '#4a90d9',
  };

  const overlayStyle = {
    position: 'fixed', inset: 0,
    background: 'rgba(15, 23, 42, 0.8)',
    backdropFilter: 'blur(10px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 1000, padding: '1rem',
  };

  const modalStyle = {
    background: C.bg,
    border: `1px solid ${C.border}`,
    borderRadius: '16px',
    width: '100%',
    maxWidth: '1050px',
    maxHeight: '92vh',
    overflowY: 'auto',
    padding: '1.5rem 1.75rem',
    color: C.text,
    boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
    position: 'relative',
  };

  const inputStyle = {
    width: '100%',
    padding: '0.55rem 0.75rem',
    fontSize: '0.85rem',
    color: C.text,
    background: C.inputBg,
    border: `1px solid ${C.inputBorder}`,
    borderRadius: '7px',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s ease',
  };

  const selectStyle = {
    ...inputStyle,
    cursor: 'pointer',
    appearance: 'none',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 10px center',
    paddingRight: '28px',
  };

  const labelStyle = {
    display: 'block',
    fontSize: '0.68rem',
    fontWeight: 600,
    color: C.label,
    marginBottom: '0.3rem',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
  };

  const sectionTitle = (text) => (
    <div style={{
      fontSize: '0.7rem', fontWeight: 700, color: C.accentTeal,
      textTransform: 'uppercase', letterSpacing: '0.06em',
      marginBottom: '0.6rem', marginTop: '0.5rem',
      display: 'flex', alignItems: 'center', gap: '6px',
    }}>
      <div style={{ width: '14px', height: '2px', background: C.accentTeal, borderRadius: '1px' }} />
      {text}
    </div>
  );

  /* Energy type buttons */
  const energyBtn = (value, icon, label) => (
    <button
      type="button"
      onClick={() => setEnergyType(value)}
      style={{
        flex: 1,
        padding: '0.6rem 0.5rem',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
        fontSize: '0.82rem', fontWeight: 600,
        background: energyType === value
          ? (value === 'solar' ? 'rgba(245,158,11,0.15)' : 'rgba(45,212,191,0.15)')
          : (darkMode ? 'rgba(255,255,255,0.03)' : '#f8fafc'),
        border: energyType === value
          ? `2px solid ${value === 'solar' ? '#f59e0b' : '#2dd4bf'}`
          : `1px solid ${C.inputBorder}`,
        color: energyType === value
          ? (value === 'solar' ? '#f59e0b' : '#2dd4bf')
          : C.textSec,
        borderRadius: '8px', cursor: 'pointer',
        transition: 'all 0.2s ease',
      }}
    >
      <span style={{ fontSize: '1.1rem' }}>{icon}</span>
      {label}
    </button>
  );

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={e => e.stopPropagation()}>
        {/* Close */}
        <button
          onClick={onClose}
          style={{ position: 'absolute', right: '14px', top: '14px', background: 'none', border: 'none', color: C.textSec, fontSize: '1.15rem', cursor: 'pointer', lineHeight: 1, zIndex: 10 }}
        >✕</button>

        {/* Header */}
        <div style={{ marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>
            Register Site — {project.name}
          </h2>
          <p style={{ color: C.accentBlue, fontSize: '0.78rem', fontWeight: 600, margin: '2px 0 0' }}>
            {project.project_code}
          </p>
        </div>

        {/* Suitability Warning Banner */}
        {unsuitableLocation && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            borderRadius: '10px',
            padding: '0.75rem 1rem',
            marginBottom: '1rem',
            color: '#ef4444',
            fontSize: '0.84rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <span style={{ fontSize: '1.2rem' }}>⚠️</span>
            <span>{UNSUITABLE_MSG}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* ══ 2-COLUMN LAYOUT ══ */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>

            {/* ══════ LEFT COLUMN ══════ */}
            <div>
              {/* Site Name */}
              <div style={{ marginBottom: '0.85rem' }}>
                <label style={labelStyle}>Site Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Plot Alpha - Thar East"
                  value={siteName}
                  onChange={e => setSiteName(e.target.value)}
                  style={inputStyle}
                  required
                  onFocus={e => e.target.style.borderColor = '#4a90d9'}
                  onBlur={e => e.target.style.borderColor = C.inputBorder}
                />
              </div>

              {/* Energy Type */}
              {sectionTitle('Renewable Energy Type')}
              <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '0.85rem' }}>
                {energyBtn('solar', '☀️', 'Solar')}
                {energyBtn('wind', '💨', 'Wind')}
              </div>

              {/* Country / State / City Cascade */}
              {sectionTitle('Location')}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <div>
                  <label style={labelStyle}>Country</label>
                  <select
                    value={selectedCountry}
                    onChange={e => handleCountryChange(e.target.value)}
                    style={selectStyle}
                  >
                    <option value="">Select Country...</option>
                    {countries.map(c => (
                      <option key={c.isoCode} value={c.isoCode}>{c.flag} {c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>State / Region</label>
                  <select
                    value={selectedState}
                    onChange={e => handleStateChange(e.target.value)}
                    style={selectStyle}
                    disabled={!selectedCountry}
                  >
                    <option value="">Select State...</option>
                    {states.map(s => (
                      <option key={s.isoCode} value={s.isoCode}>{s.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div style={{ marginBottom: '0.5rem' }}>
                <label style={labelStyle}>City / District</label>
                <select
                  value={selectedCity}
                  onChange={e => handleCityChange(e.target.value)}
                  style={selectStyle}
                  disabled={!selectedState}
                >
                  <option value="">Select City...</option>
                  {cities.map(c => (
                    <option key={c.name} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* Lat/Lng */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <div>
                  <label style={labelStyle}>Latitude *</label>
                  <input
                    type="number" step="any"
                    value={latitude}
                    onChange={e => setLatitude(parseFloat(e.target.value) || 0)}
                    style={{ ...inputStyle, fontFamily: 'monospace', fontSize: '0.82rem' }}
                    required
                  />
                </div>
                <div>
                  <label style={labelStyle}>Longitude *</label>
                  <input
                    type="number" step="any"
                    value={longitude}
                    onChange={e => setLongitude(parseFloat(e.target.value) || 0)}
                    style={{ ...inputStyle, fontFamily: 'monospace', fontSize: '0.82rem' }}
                    required
                  />
                </div>
              </div>

              {/* Elevation */}
              <div style={{ marginBottom: '0.5rem' }}>
                <label style={labelStyle}>Elevation (m) — auto-fetched</label>
                <input type="number" step="any" value={elevation} onChange={e => setElevation(e.target.value)} style={{ ...inputStyle, fontFamily: 'monospace' }} />
              </div>
            </div>

            {/* ══════ RIGHT COLUMN — MAP ══════ */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {/* Map */}
              <div style={{
                borderRadius: '10px', overflow: 'hidden',
                border: `1px solid ${C.border}`,
                flex: 1, minHeight: '340px',
              }}>
                <MapPicker
                  initialLat={latitude}
                  initialLng={longitude}
                  onSelectLocation={handleSelectLocation}
                  height="100%"
                />
              </div>

              {/* Live coordinates badge */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '0.5rem 0.75rem',
                background: C.cardBg, borderRadius: '8px',
                border: `1px solid ${C.border}`,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: pinColor, boxShadow: `0 0 6px ${pinColor}55` }} />
                  <span style={{ fontSize: '0.72rem', fontWeight: 600, color: C.label, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    {energyType === 'solar' ? '☀️ Solar' : '💨 Wind'} Site
                  </span>
                </div>
                <span style={{ fontSize: '0.72rem', fontFamily: 'monospace', color: C.textSec }}>
                  {latitude.toFixed(4)}°N, {longitude.toFixed(4)}°E
                </span>
              </div>
            </div>
          </div>

          {/* ══ ACTION BUTTONS ══ */}
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
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
              disabled={loading || unsuitableLocation}
              style={{
                flex: 1.5, padding: '0.7rem',
                background: unsuitableLocation ? '#94a3b8' : 'linear-gradient(135deg, #4a90d9 0%, #2dd4bf 100%)',
                border: 'none', color: '#ffffff', borderRadius: '8px',
                fontWeight: 600, cursor: (loading || unsuitableLocation) ? 'not-allowed' : 'pointer', fontSize: '0.88rem',
                opacity: (loading || unsuitableLocation) ? 0.7 : 1,
                boxShadow: unsuitableLocation ? 'none' : '0 4px 15px rgba(74, 144, 217, 0.35)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
              }}
            >
              {loading ? 'Registering...' : (
                <>
                  Register Site
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
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
