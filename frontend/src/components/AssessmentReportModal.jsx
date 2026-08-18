import React from 'react';
import { generateSiteAssessmentPDF } from '../utils/pdfReportGenerator';

export default function AssessmentReportModal({ isOpen, onClose, report, projectData }) {
  if (!isOpen || !report) return null;

  const {
    site_name,
    project_code,
    region,
    coordinates,
    land_parameters,
    environmental_metrics: env,
    prediction_analytics: pred
  } = report;

  const score = pred?.suitability_score || 0;
  let scoreColor = '#22c55e'; // Green
  if (score < 50) scoreColor = '#ef4444'; // Red
  else if (score < 75) scoreColor = '#eab308'; // Yellow

  const modalOverlayStyle = {
    position: 'fixed',
    inset: 0,
    background: 'rgba(15, 23, 42, 0.8)',
    backdropFilter: 'blur(8px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '1rem'
  };

  const modalContentStyle = {
    background: '#1a1a2e',
    border: '1px solid rgba(255, 255, 255, 0.12)',
    borderRadius: '20px',
    width: '100%',
    maxWidth: '780px',
    maxHeight: '92vh',
    overflowY: 'auto',
    padding: '2rem',
    color: '#e8eaf0',
    boxShadow: '0 25px 60px rgba(0,0,0,0.6)',
    position: 'relative'
  };

  const statCardStyle = {
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '12px',
    padding: '1.25rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  };

  return (
    <div style={modalOverlayStyle} onClick={onClose}>
      <div style={modalContentStyle} onClick={e => e.stopPropagation()}>
        {/* Close Button */}
        <button 
          onClick={onClose}
          style={{ position: 'absolute', right: '20px', top: '20px', background: 'none', border: 'none', color: '#94a3b8', fontSize: '1.4rem', cursor: 'pointer' }}
        >
          ✕
        </button>

        {/* Header */}
        <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
            <span style={{ background: 'rgba(74, 144, 217, 0.15)', color: '#4a90d9', padding: '0.2rem 0.6rem', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 700, fontFamily: 'monospace' }}>
              {project_code}
            </span>
            {report.project_name && (
              <span style={{ background: 'rgba(45, 212, 191, 0.15)', color: '#2dd4bf', padding: '0.2rem 0.6rem', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 700 }}>
                📁 {report.project_name}
              </span>
            )}
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
              AI Assessment: {site_name}
            </h2>
          </div>
          <p style={{ color: '#94a3b8', fontSize: '0.88rem', margin: 0 }}>
            📍 {region} • Coordinates: {coordinates?.latitude?.toFixed(4)}, {coordinates?.longitude?.toFixed(4)}
          </p>
        </div>

        {/* Top Score Banner */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(74, 144, 217, 0.15) 0%, rgba(45, 212, 191, 0.15) 100%)',
          border: '1px solid rgba(74, 144, 217, 0.3)',
          borderRadius: '14px',
          padding: '1.25rem 1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem'
        }}>
          <div>
            <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: '#94a3b8', fontWeight: 700, letterSpacing: '0.05em' }}>
              Land Suitability Score
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 900, color: scoreColor, marginTop: '2px' }}>
              {score}%
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff', marginBottom: '4px' }}>
              {pred?.recommendation}
            </div>
            <div style={{ fontSize: '0.82rem', color: '#2dd4bf', fontWeight: 600 }}>
              🌱 Est. CO₂ Offset: {pred?.co2_offset_tons_year?.toLocaleString()} Tons/year
            </div>
          </div>
        </div>

        {/* Energy Generation Predictions Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
          {/* Solar Prediction */}
          <div style={{ ...statCardStyle, borderColor: 'rgba(234, 179, 8, 0.3)', background: 'rgba(234, 179, 8, 0.04)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#eab308', fontWeight: 700, fontSize: '0.95rem' }}>
              ☀️ Solar Energy Potential
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#ffffff', marginTop: '6px' }}>
              {pred?.solar_annual_mwh?.toLocaleString()} <span style={{ fontSize: '0.9rem', fontWeight: 500, color: '#94a3b8' }}>MWh/year</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: '#b0b8c9', marginTop: '8px' }}>
              <span>Capacity Factor: <strong style={{ color: '#eab308' }}>{pred?.solar_capacity_factor_pct}%</strong></span>
              <span>Installed: <strong>{pred?.installed_solar_mw} MW</strong></span>
            </div>
          </div>

          {/* Wind Prediction */}
          <div style={{ ...statCardStyle, borderColor: 'rgba(74, 144, 217, 0.3)', background: 'rgba(74, 144, 217, 0.04)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#4a90d9', fontWeight: 700, fontSize: '0.95rem' }}>
              💨 Wind Energy Potential
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#ffffff', marginTop: '6px' }}>
              {pred?.wind_annual_mwh?.toLocaleString()} <span style={{ fontSize: '0.9rem', fontWeight: 500, color: '#94a3b8' }}>MWh/year</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: '#b0b8c9', marginTop: '8px' }}>
              <span>Capacity Factor: <strong style={{ color: '#4a90d9' }}>{pred?.wind_capacity_factor_pct}%</strong></span>
              <span>Installed: <strong>{pred?.installed_wind_mw} MW</strong></span>
            </div>
          </div>
        </div>

        {/* Environmental Data Summary */}
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.8rem' }}>
          Meteorological Data (Open-Meteo API)
        </h3>
        
        <div style={{
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '12px',
          padding: '1rem 1.25rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1rem',
          fontSize: '0.85rem',
          marginBottom: '1.5rem'
        }}>
          <div>
            <div style={{ color: '#6b7a99' }}>Daily GHI (Solar):</div>
            <div style={{ color: '#e8eaf0', fontWeight: 600, fontSize: '1rem' }}>{env?.daily_ghi_kwh_m2_day} kWh/m²/day</div>
          </div>

          <div>
            <div style={{ color: '#6b7a99' }}>Peak Sun Hours:</div>
            <div style={{ color: '#e8eaf0', fontWeight: 600, fontSize: '1rem' }}>{env?.peak_sun_hours} Hours/day</div>
          </div>

          <div>
            <div style={{ color: '#6b7a99' }}>Avg. Temperature:</div>
            <div style={{ color: '#e8eaf0', fontWeight: 600, fontSize: '1rem' }}>{env?.avg_temp_c} °C</div>
          </div>

          <div>
            <div style={{ color: '#6b7a99' }}>Wind Speed (100m Hub):</div>
            <div style={{ color: '#e8eaf0', fontWeight: 600, fontSize: '1rem' }}>{env?.avg_wind_speed_100m_ms} m/s</div>
          </div>

          <div>
            <div style={{ color: '#6b7a99' }}>Max Wind Speed:</div>
            <div style={{ color: '#e8eaf0', fontWeight: 600, fontSize: '1rem' }}>{env?.max_wind_speed_100m_ms} m/s</div>
          </div>

          <div>
            <div style={{ color: '#6b7a99' }}>Data Source:</div>
            <div style={{ color: '#2dd4bf', fontWeight: 600, fontSize: '0.82rem' }}>{env?.source}</div>
          </div>
        </div>

        {/* Footer Action Buttons */}
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <button 
            onClick={() => generateSiteAssessmentPDF(report, projectData)}
            style={{
              flex: 1,
              padding: '0.75rem',
              background: 'linear-gradient(135deg, #10b981 0%, #2dd4bf 100%)',
              border: 'none',
              color: '#ffffff',
              borderRadius: '10px',
              fontWeight: 700,
              cursor: 'pointer',
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 4px 15px rgba(16, 185, 129, 0.35)'
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Download PDF Report
          </button>

          <button 
            onClick={onClose}
            style={{
              flex: 1,
              padding: '0.75rem',
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#ffffff',
              borderRadius: '10px',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: '0.9rem'
            }}
          >
            Close Report
          </button>
        </div>
      </div>
    </div>
  );
}
