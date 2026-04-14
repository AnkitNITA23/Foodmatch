"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet default icon bug with webpack
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const donorIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const userIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface Props {
  donations: any[];
  userLocation: { lat: number; lng: number };
}

export default function MapView({ donations, userLocation }: Props) {
  return (
    <MapContainer
      center={[userLocation.lat, userLocation.lng]}
      zoom={13}
      style={{ height: "100%", width: "100%", zIndex: 0 }}
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

        {/* User location marker */}
      <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
        <Popup>
          <div style={{ textAlign: 'center', padding: '0.2rem' }}>
            <strong style={{ display: 'block', fontSize: '1.1rem', marginBottom: '0.2rem', color: 'var(--primary-color)' }}>📍 Your Location</strong>
            <span style={{ fontSize: '0.8rem', color: '#555' }}>Monitoring 5km radius</span>
          </div>
        </Popup>
      </Marker>

      {/* 5km radius circle */}
      <Circle
        center={[userLocation.lat, userLocation.lng]}
        radius={5000}
        pathOptions={{ color: 'var(--primary-color)', fillColor: 'var(--primary-color)', fillOpacity: 0.08, weight: 1.5, dashArray: '4 4' }}
      />

      {/* Donation markers grouped by location */}
      {Object.values(donations.reduce((acc: any, d: any) => {
        const key = `${d.lat},${d.lng}`;
        if (!acc[key]) acc[key] = { lat: d.lat, lng: d.lng, items: [], donorName: d.donor?.name || "Local Entity" };
        acc[key].items.push(d);
        return acc;
      }, {})).map((group: any, idx: number) => (
        <Marker key={idx} position={[group.lat, group.lng]} icon={donorIcon}>
          <Popup>
            <div style={{ minWidth: "220px", padding: '0.2rem', color: '#111' }}>
              <strong style={{ display: 'block', fontSize: '1.2rem', marginBottom: '0.6rem', color: 'var(--secondary-color)', borderBottom: '2px solid rgba(64,192,87,0.2)', paddingBottom: '0.4rem' }}>
                {group.donorName}
                {group.items[0]?.donor?.trustScore?.count > 0 && (
                  <span style={{ marginLeft: '0.6rem', background: '#fcc419', color: '#885c00', padding: '0.15rem 0.5rem', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 700, verticalAlign: 'middle' }}>
                    ★ {group.items[0].donor.trustScore.avg}
                  </span>
                )}
              </strong>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', maxHeight: '200px', overflowY: 'auto', paddingRight: '0.5rem' }}>
                {group.items.map((item: any) => (
                  <div key={item.id} style={{ background: '#f8f9fa', padding: '0.6rem', borderRadius: '8px', border: '1px solid #eee' }}>
                    <strong style={{ display: 'block', fontSize: '1rem', marginBottom: '0.2rem', color: '#2b2b2b' }}>{item.title}</strong>
                    <p style={{ margin: "0 0 0.5rem 0", fontSize: "0.85rem", color: "#555", lineHeight: 1.3 }}>{item.description}</p>
                    <a 
                      href="/dashboard"
                      style={{ display: 'block', textAlign: 'center', background: 'var(--secondary-color)', color: 'white', textDecoration: 'none', padding: '0.4rem 0', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 600 }}
                    >
                      Go to Claim &rarr;
                    </a>
                  </div>
                ))}
              </div>
              
              {group.items.length > 1 && (
                <div style={{ marginTop: "10px", fontSize: "0.75rem", color: "#888", textAlign: 'center' }}>
                  {group.items.length} items available here
                </div>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
