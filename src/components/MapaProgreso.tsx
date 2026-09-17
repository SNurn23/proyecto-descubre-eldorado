'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { estacionesPredeterminadas } from './MapaInteractivo';

interface PropiedadesMapaProgreso {
                                               
  ordenesEscaneados: number[];
}

const DEFAULT_CENTER: [number, number] = [-26.406, -54.635];
const DEFAULT_ZOOM = 13;
const GRAY_COLOR = '#9CA3AF';

export default function MapaProgreso({ ordenesEscaneados }: PropiedadesMapaProgreso) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: DEFAULT_CENTER,
      zoom: DEFAULT_ZOOM,
      zoomControl: false,
      attributionControl: false,
      scrollWheelZoom: false,
      dragging: true,
      doubleClickZoom: false,
    });

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors',
      }
    ).addTo(map);

                                                
    const scannedSet = new Set(ordenesEscaneados);

                     
    estacionesPredeterminadas.forEach((st) => {
                                                                          
      const isCompleted = scannedSet.has(st.orden);

      const pinColor = isCompleted ? GRAY_COLOR : st.color;
      const size = 32;
      const height = 38;

      const icon = L.divIcon({
        className: 'custom-map-pin',
        html: `
          <div style="
            position: relative;
            width: ${size}px;
            height: ${height}px;
            cursor: pointer;
          ">
            <div style="
              position: relative;
              display: flex;
              align-items: center;
              justify-content: center;
              width: ${size}px;
              height: ${size}px;
              border-radius: 50%;
              background-color: ${pinColor};
              color: #ffffff;
              font-weight: 900;
              font-size: 13px;
              font-family: inherit;
              box-shadow: 0 0 0 2px #ffffff, 1.5px 2px 2.5px rgba(0, 0, 0, 0.22);
              ${isCompleted ? 'opacity: 0.6;' : ''}
            ">
              ${st.letter}
              <span style="
                position: absolute;
                bottom: -6px;
                left: 50%;
                transform: translateX(-50%);
                width: 0;
                height: 0;
                border-left: 6px solid transparent;
                border-right: 6px solid transparent;
                border-top: 6px solid ${pinColor};
              "></span>
            </div>
          </div>
        `,
        iconSize: [size, height],
        iconAnchor: [size / 2, height],
        popupAnchor: [0, -height + 4],
      });

      const popupHtml = `
        <div style="width: 200px; font-family: inherit; padding: 10px 12px; background: #ffffff; border-radius: 10px;">
          <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 4px;">
            <span style="
              background-color: ${pinColor}; 
              color: #fff; 
              font-weight: 900; 
              width: 22px; 
              min-width: 22px;
              height: 22px; 
              flex-shrink: 0;
              border-radius: 6px; 
              display: inline-flex; 
              align-items: center; 
              justify-content: center; 
              font-size: 11px;
            ">${st.letter}</span>
            <span style="font-size: 12px; font-weight: 700; color: #262019;">${st.place}</span>
          </div>
          <div style="font-size: 10px; color: #6b5f4e; margin-bottom: 6px;">${st.zona}</div>
          ${isCompleted
            ? '<div style="font-size: 10px; font-weight: 700; color: #9CA3AF;">✓ Ya escaneaste este punto</div>'
            : `<a
                href="https://www.google.com/maps/search/?api=1&query=${st.lat},${st.lng}"
                target="_blank"
                rel="noopener noreferrer"
                style="
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  background-color: #262019;
                  color: #ffffff;
                  font-size: 10px;
                  font-weight: 700;
                  text-decoration: none;
                  padding: 6px 10px;
                  border-radius: 7px;
                  width: 100%;
                  box-sizing: border-box;
                "
              >Cómo llegar</a>`
          }
        </div>
      `;

      L.marker([st.lat, st.lng], { icon })
        .addTo(map)
        .bindPopup(popupHtml, {
          closeButton: false,
          offset: [0, -36],
          className: 'progreso-map-popup',
        });
    });

    mapInstanceRef.current = map;

                           
    setTimeout(() => map.invalidateSize(), 100);
    setTimeout(() => map.invalidateSize(), 300);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [ordenesEscaneados]);

  return (
    <div
      ref={mapContainerRef}
      className="w-full h-full rounded-2xl"
      style={{ minHeight: 200 }}
    />
  );
}
