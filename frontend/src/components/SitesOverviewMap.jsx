import React, { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useTheme } from '../context/ThemeContext';

// Fix Leaflet marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Helper component to auto-fit bounds when sites change
function AutoFitBounds({ allSites }) {
  const map = useMap();

  useEffect(() => {
    if (allSites && allSites.length > 0) {
      const bounds = L.latLngBounds(allSites.map(s => [s.latitude, s.longitude]));
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 12 });
    }
  }, [allSites, map]);

  return null;
}

export default function SitesOverviewMap({ projects = [], onRunAssessment, onRegisterSite, selectedSiteId }) {
  const { darkMode } = useTheme();

  // Extract all sites from all projects into a single flat array
  const allSites = useMemo(() => {
    const list = [];
    projects.forEach(project => {
      if (project.sites && Array.isArray(project.sites)) {
        project.sites.forEach(site => {
          list.push({
            ...site,
            project_code: project.project_code,
            project_name: project.name,
            project_id: project.id,
            region: project.region,
          });
        });
      }
    });
    return list;
  }, [projects]);

  const defaultCenter = allSites.length > 0 
    ? [allSites[0].latitude, allSites[0].longitude] 
    : [20.5937, 78.9629]; // Default India center

  return (
    <div style={{ height: '100%', width: '100%', position: 'relative', overflow: 'hidden', borderRadius: '16px' }}>
      <MapContainer
        center={defaultCenter}
        zoom={5}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%', zIndex: 1 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url={
            darkMode
              ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
              : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          }
        />

        <AutoFitBounds allSites={allSites} />

        {allSites.map(site => {
          const isSelected = selectedSiteId === site.id;
          return (
            <Marker
              key={site.id}
              position={[site.latitude, site.longitude]}
            >
              {/* Tooltip on cursor hover */}
              <Tooltip direction="top" offset={[0, -20]} opacity={0.95} sticky>
                <div style={{ padding: '4px 6px', fontFamily: "'Inter', sans-serif" }}>
                  <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#0f172a' }}>
                    📍 {site.name}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#475569', marginTop: '2px' }}>
                    Project: <strong>{site.project_code}</strong> ({site.project_name})
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                    Area: {site.land_area} ha • Elev: {site.elevation ? `${site.elevation}m` : 'N/A'}
                  </div>
                </div>
              </Tooltip>

              {/* Popup on marker click */}
              <Popup>
                <div style={{ padding: '6px', minWidth: '200px', fontFamily: "'Inter', sans-serif" }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{
                      background: 'rgba(74, 144, 217, 0.15)',
                      color: '#2dd4bf',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      fontFamily: 'monospace'
                    }}>
                      {site.project_code}
                    </span>
                    <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                      📍 {site.region}
                    </span>
                  </div>

                  <h4 style={{ margin: '0 0 4px 0', fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>
                    {site.name}
                  </h4>

                  <div style={{ fontSize: '0.78rem', color: '#475569', lineHeight: 1.5, marginBottom: '10px' }}>
                    <div>Lat/Lon: <code>{site.latitude.toFixed(4)}, {site.longitude.toFixed(4)}</code></div>
                    <div>Land Area: <strong>{site.land_area} ha</strong></div>
                    <div>Ownership: {site.land_ownership}</div>
                  </div>

                  <button
                    onClick={() => onRunAssessment && onRunAssessment(site.project_id, site.id)}
                    style={{
                      width: '100%',
                      padding: '6px 10px',
                      background: 'linear-gradient(135deg, #4a90d9 0%, #2dd4bf 100%)',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      boxShadow: '0 2px 8px rgba(74, 144, 217, 0.3)'
                    }}
                  >
                    ⚡ Run AI Analysis
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
