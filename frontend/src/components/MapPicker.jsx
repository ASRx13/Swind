import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet marker icon issue in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function LocationMarker({ position, setPosition, onSelectLocation }) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      const newPos = [lat, lng];
      setPosition(newPos);
      if (onSelectLocation) {
        onSelectLocation(lat, lng);
      }
    },
  });

  return position ? (
    <Marker 
      position={position} 
      draggable={true}
      eventHandlers={{
        dragend(e) {
          const marker = e.target;
          const { lat, lng } = marker.getLatLng();
          setPosition([lat, lng]);
          if (onSelectLocation) {
            onSelectLocation(lat, lng);
          }
        }
      }}
    />
  ) : null;
}

export default function MapPicker({ initialLat = 26.9124, initialLng = 75.7873, onSelectLocation, height = '280px' }) {
  const [position, setPosition] = useState([initialLat, initialLng]);

  useEffect(() => {
    setPosition([initialLat, initialLng]);
  }, [initialLat, initialLng]);

  return (
    <div style={{ height, width: '100%', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', position: 'relative' }}>
      <MapContainer 
        center={position} 
        zoom={6} 
        scrollWheelZoom={true} 
        style={{ height: '100%', width: '100%', zIndex: 1 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker position={position} setPosition={setPosition} onSelectLocation={onSelectLocation} />
      </MapContainer>
      
      <div style={{
        position: 'absolute',
        bottom: '8px',
        left: '8px',
        zIndex: 1000,
        background: 'rgba(15, 23, 42, 0.85)',
        backdropFilter: 'blur(6px)',
        color: '#e8eaf0',
        padding: '4px 10px',
        borderRadius: '6px',
        fontSize: '0.75rem',
        fontWeight: 600,
        border: '1px solid rgba(255,255,255,0.1)',
        pointerEvents: 'none'
      }}>
        📍 Click map or drag marker to set site location
      </div>
    </div>
  );
}
