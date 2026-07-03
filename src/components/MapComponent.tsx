"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix Leaflet's default icon path issues in Next.js
const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export default function MapComponent({ orders }: { orders: any[] }) {
  // Center map dynamically or use a fixed city center (e.g. San Francisco)
  const center: [number, number] = [37.7749, -122.4194]; 

  return (
    <MapContainer 
      center={center} 
      zoom={13} 
      style={{ height: "100%", width: "100%", zIndex: 0 }}
      zoomControl={false}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://carto.com/">CARTO</a>'
      />
      {orders.map((order, idx) => {
        // Mock a slight variation in coordinates so they don't overlap perfectly
        const latOffset = (Math.random() - 0.5) * 0.05;
        const lngOffset = (Math.random() - 0.5) * 0.05;
        return (
          <Marker 
            key={order.id || idx} 
            position={[center[0] + latOffset, center[1] + lngOffset]} 
            icon={icon}
          >
            <Popup>
              <div className="font-sans">
                <p className="font-bold text-[#f46919] mb-1">Order #{order.id?.slice(0,6).toUpperCase()}</p>
                <p className="text-sm">Status: <b>{order.status}</b></p>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
