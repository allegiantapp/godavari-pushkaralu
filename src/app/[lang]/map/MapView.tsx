"use client";

import { useEffect, useState, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  getAllLocations,
  getDirectionsUrl,
  categoryConfig,
  type MapLocation,
} from "@/lib/locations";

type Lang = "te" | "hi" | "en";

interface MapViewProps {
  lang: Lang;
  activeCategories: string[];
}

const navigateLabel = {
  te: "దిశలు",
  hi: "दिशाएं",
  en: "Directions",
};

const crowdLabel = {
  te: { low: "తక్కువ రద్దీ", medium: "మధ్యస్థ", high: "ఎక్కువ రద్దీ" },
  hi: { low: "कम भीड़", medium: "मध्यम", high: "अधिक भीड़" },
  en: { low: "Low Crowd", medium: "Moderate", high: "Crowded" },
};

// Create custom marker icon using div
function createMarkerIcon(category: string): L.DivIcon {
  const cfg = categoryConfig[category] || { emoji: "📍", markerColor: "#6b7280" };
  return L.divIcon({
    className: "custom-marker",
    html: `<div style="
      width: 36px; height: 36px;
      background: ${cfg.markerColor};
      border: 3px solid white;
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 3px 12px rgba(0,0,0,0.3);
      font-size: 16px;
      line-height: 1;
    ">${cfg.emoji}</div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -20],
  });
}

// User location marker
const userIcon = L.divIcon({
  className: "user-marker",
  html: `<div style="
    width: 18px; height: 18px;
    background: #3b82f6;
    border: 3px solid white;
    border-radius: 50%;
    box-shadow: 0 0 0 6px rgba(59,130,246,0.2), 0 2px 8px rgba(0,0,0,0.3);
  "></div>`,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

// Component to handle user location
function UserLocation() {
  const map = useMap();
  const [position, setPosition] = useState<[number, number] | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        setPosition(coords);
      },
      () => {
        // Geolocation denied or unavailable — silently ignore
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        setPosition([pos.coords.latitude, pos.coords.longitude]);
      },
      () => {},
      { enableHighAccuracy: true }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [map]);

  if (!position) return null;
  return <Marker position={position} icon={userIcon} />;
}

export default function MapView({ lang, activeCategories }: MapViewProps) {
  const allLocations = useMemo(() => getAllLocations(), []);

  const filteredLocations = useMemo(() => {
    if (activeCategories.length === 0) return allLocations;
    return allLocations.filter((loc) => activeCategories.includes(loc.category));
  }, [allLocations, activeCategories]);

  // Rajahmundry center
  const center: [number, number] = [17.0005, 81.7840];

  return (
    <>
      <style>{`
        .custom-marker { background: none !important; border: none !important; }
        .user-marker { background: none !important; border: none !important; }
        .leaflet-popup-content-wrapper {
          border-radius: 16px !important;
          padding: 0 !important;
          box-shadow: 0 8px 30px rgba(0,0,0,0.15) !important;
        }
        .leaflet-popup-content {
          margin: 0 !important;
          min-width: 200px !important;
        }
        .leaflet-popup-tip {
          box-shadow: 0 4px 10px rgba(0,0,0,0.1) !important;
        }
        .leaflet-control-zoom {
          border: none !important;
          box-shadow: 0 2px 12px rgba(0,0,0,0.15) !important;
          border-radius: 12px !important;
          overflow: hidden;
        }
        .leaflet-control-zoom a {
          width: 36px !important;
          height: 36px !important;
          line-height: 36px !important;
          font-size: 18px !important;
          color: #0f2847 !important;
          border-bottom: 1px solid #e5e7eb !important;
        }
      `}</style>

      <MapContainer
        center={center}
        zoom={14}
        style={{ width: "100%", height: "100%" }}
        zoomControl={true}
        attributionControl={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <UserLocation />

        {filteredLocations.map((loc) => (
          <LocationMarker key={loc.id} location={loc} lang={lang} />
        ))}
      </MapContainer>
    </>
  );
}

function LocationMarker({ location, lang }: { location: MapLocation; lang: Lang }) {
  const icon = useMemo(() => createMarkerIcon(location.category), [location.category]);
  const cfg = categoryConfig[location.category];
  const crowdColor = location.crowd === "low" ? "#16a34a" : location.crowd === "medium" ? "#d97706" : location.crowd === "high" ? "#dc2626" : null;

  return (
    <Marker position={[location.lat, location.lng]} icon={icon}>
      <Popup>
        <div style={{ padding: "12px 14px", fontFamily: "var(--font-sans, Poppins, sans-serif)" }}>
          {/* Category badge */}
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "4px",
            fontSize: "10px",
            fontWeight: 700,
            color: cfg?.color || "#6b7280",
            marginBottom: "6px",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}>
            <span style={{ fontSize: "12px" }}>{cfg?.emoji}</span>
            {location.category}
          </div>

          {/* Name */}
          <div style={{ fontSize: "14px", fontWeight: 700, color: "#0f2847", lineHeight: 1.3, marginBottom: "4px" }}>
            {location.name[lang]}
          </div>

          {/* Details */}
          {location.details && (
            <div style={{ fontSize: "11px", color: "#64748b", marginBottom: "6px", lineHeight: 1.4 }}>
              {location.details[lang]}
            </div>
          )}

          {/* Crowd + Distance row */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
            {crowdColor && (
              <span style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                fontSize: "10px",
                fontWeight: 700,
                color: crowdColor,
              }}>
                <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: crowdColor, display: "inline-block" }} />
                {crowdLabel[lang][location.crowd!]}
              </span>
            )}
            {location.distance && (
              <span style={{ fontSize: "10px", color: "#94a3b8", fontWeight: 600 }}>
                {location.distance}
              </span>
            )}
            {location.price && (
              <span style={{ fontSize: "10px", color: "#0f2847", fontWeight: 700 }}>
                {location.price}
              </span>
            )}
          </div>

          {/* Navigate button */}
          <a
            href={getDirectionsUrl(location.lat, location.lng)}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
              width: "100%",
              padding: "8px 0",
              borderRadius: "10px",
              background: "linear-gradient(135deg, #1b5bae, #0f2847)",
              color: "white",
              fontSize: "12px",
              fontWeight: 700,
              textDecoration: "none",
              boxShadow: "0 2px 8px rgba(15,40,71,0.25)",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="3 11 22 2 13 21 11 13 3 11" />
            </svg>
            {navigateLabel[lang]}
          </a>
        </div>
      </Popup>
    </Marker>
  );
}
