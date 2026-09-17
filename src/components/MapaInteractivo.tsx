'use client';

import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export interface DatosMapaEstacion {
  orden: number;
  letter: string;
  color: string;
  pillar: string;
  place: string;
  zona: string;
  lat: number;
  lng: number;
  token: string;
  image: string;
  desc: string;
}

export const estacionesPredeterminadas: DatosMapaEstacion[] = [
  {
    orden: 1,
    letter: 'E',
    color: '#1B9951',
    pillar: 'Espíritu Emprendedor',
    place: 'Museo Municipal Casa del Fundador',
    zona: 'Km 1 · Barrio Pomar',
    lat: -26.4101816,
    lng: -54.6893061,
    token: 'eldorado-e-fundador-7x9q',
    image: '/assets/hero-1.jpeg',
    desc: 'Homenaje al fundador Adolfo Schwelm y a las familias pioneras.',
  },
  {
    orden: 2,
    letter: 'L',
    color: '#2B8487',
    pillar: 'Legado Histórico',
    place: 'Museo Cooperativo CEEL',
    zona: 'Km 9 · Centro Oeste',
    lat: -26.4080856,
    lng: -54.6053401,
    token: 'eldorado-l-ceel-3m8v',
    image: '/assets/hero-2.jpeg',
    desc: 'Memoria viva del cooperativismo y la solidaridad comunitaria.',
  },
  {
    orden: 3,
    letter: 'D',
    color: '#197084',
    pillar: 'Diversidad Cultural',
    place: 'Plazoleta de las Naciones',
    zona: 'Km 6 · Colectividades',
    lat: -26.4029226,
    lng: -54.6340428,
    token: 'eldorado-d-naciones-9k2w',
    image: '/assets/hero-3.jpeg',
    desc: 'Crisol de colectividades y diversidad cultural en Misiones.',
  },
  {
    orden: 4,
    letter: 'O',
    color: '#419372',
    pillar: 'Orígenes',
    place: 'Plaza San Martín',
    zona: 'Km 2 · Centro Cívico Fundacional',
    lat: -26.4086474,
    lng: -54.6677924,
    token: 'eldorado-o-sanmartin-4p6j',
    image: '/assets/hero-4.jpeg',
    desc: 'Núcleo histórico y cívico donde nació la ciudad en el Km 2.',
  },
  {
    orden: 5,
    letter: 'R',
    color: '#385F18',
    pillar: 'Río Paraná',
    place: 'Mirador Sur Costanera Eduviges Markovicz',
    zona: 'Costanera · Río Paraná',
    lat: -26.4154564,
    lng: -54.6934565,
    token: 'eldorado-r-costanera-8t5y',
    image: '/assets/hero-5.jpeg',
    desc: 'El majestuoso río Paraná, vía de llegada de los pioneros.',
  },
  {
    orden: 6,
    letter: 'A',
    color: '#EB9301',
    pillar: 'Actividad Agroindustrial',
    place: 'Rotonda RN 12 y Av. Fundador',
    zona: 'Acceso Este · Ruta Nac. 12',
    lat: -26.4244066,
    lng: -54.6447857,
    token: 'eldorado-a-rotonda-2n7b',
    image: '/assets/hero-6.jpeg',
    desc: 'Homenaje al trabajo forestal, agrícola y productivo.',
  },
  {
    orden: 7,
    letter: 'D',
    color: '#DA3501',
    pillar: 'Destino Recreativo',
    place: 'Aeroclub Eldorado (ELO)',
    zona: 'Km 11 · Aeroclub Eldorado',
    lat: -26.3934551,
    lng: -54.5752955,
    token: 'eldorado-d-aeroclub-5r8c',
    image: '/assets/hero-7.jpeg',
    desc: 'Punto de encuentro, deporte y recreación familiar al aire libre.',
  },
  {
    orden: 8,
    letter: 'O',
    color: '#BE0D00',
    pillar: 'Observatorio Natural',
    place: 'Parque Natural Municipal Salto Küppers',
    zona: 'Km 1 · Reserva Natural Fluvial',
    lat: -26.38715,
    lng: -54.680934,
    token: 'eldorado-o-kuppers-1z4m',
    image: '/assets/hero-8.jpeg',
    desc: 'Reserva natural municipal con cascadas y selva paranaense.',
  },
];

const DEFAULT_CENTER: [number, number] = [-26.406, -54.635];
const DEFAULT_ZOOM = 13;
const EXPAND_ZOOM = 16;

export default function InteractiveMap({
  stations = estacionesPredeterminadas,
}: {
  stations?: DatosMapaEstacion[];
}) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);

  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [mapLayer, setMapLayer] = useState<'voyager' | 'satellite'>('voyager');

                     
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: DEFAULT_CENTER,
      zoom: DEFAULT_ZOOM,
      zoomControl: false,
      scrollWheelZoom: false,
    });

                                                   
    L.control.zoom({ position: 'bottomright' }).addTo(map);

                                                     
    const initialTileLayer = L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }
    ).addTo(map);

    tileLayerRef.current = initialTileLayer;

                                    
    const newMarkers: L.Marker[] = [];

    stations.forEach((st, idx) => {
      const customIcon = createMarkerIcon(st, false);

      const popupHtml = `
        <div style="width: 230px; font-family: inherit; padding: 12px 14px; background: #ffffff; border-radius: 12px;">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
            <span style="
              background-color: ${st.color}; 
              color: #fff; 
              font-weight: 900; 
              width: 26px; 
                min-width: 26px;
              height: 26px; 
                flex-shrink: 0;
              border-radius: 7px; 
              display: inline-flex; 
              align-items: center; 
              justify-content: center; 
              font-size: 13px;
              box-shadow: 1.5px 2px 2.5px rgba(0, 0, 0, 0.2);
            ">${st.letter}</span>
            <h4 style="font-size: 13px; font-weight: 700; color: #262019; margin: 0; line-height: 1.25;">
              ${st.place}
            </h4>
          </div>
          <div style="font-size: 11px; color: #6b5f4e; margin-bottom: 10px; line-height: 1.35;">
            ${st.zona}
          </div>
          <a
            href="https://www.google.com/maps/search/?api=1&query=${st.lat},${st.lng}"
            target="_blank"
            rel="noopener noreferrer"
            style="
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 6px;
              background-color: #262019;
              color: #ffffff;
              font-size: 11px;
              font-weight: 700;
              text-decoration: none;
              padding: 8px 12px;
              border-radius: 8px;
              width: 100%;
              box-sizing: border-box;
            "
          >
            Cómo llegar
          </a>
        </div>
      `;

      const marker = L.marker([st.lat, st.lng], { icon: customIcon })
        .addTo(map)
        .bindPopup(popupHtml, {
          closeButton: false,
          offset: [0, -42],
          maxWidth: 280,
          className: 'custom-station-popup',
        });

      marker.on('click', () => {
        handleSelectStation(idx);
      });

      newMarkers.push(marker);
    });

    markersRef.current = newMarkers;
    mapInstanceRef.current = map;

    const t1 = setTimeout(() => {
      map.invalidateSize();
    }, 150);
    const t2 = setTimeout(() => {
      map.invalidateSize();
    }, 600);

    const onResize = () => map.invalidateSize();
    window.addEventListener('resize', onResize);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      window.removeEventListener('resize', onResize);
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [stations]);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    if (mapLayer === 'voyager') {
      tileLayerRef.current = L.tileLayer(
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors',
          maxZoom: 19,
        }
      ).addTo(map);
    } else {
      tileLayerRef.current = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        {
          attribution:
            'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
          maxZoom: 19,
        }
      ).addTo(map);
    }
  }, [mapLayer]);

  useEffect(() => {
    markersRef.current.forEach((marker, idx) => {
      const isSelected = idx === selectedIdx;
      const st = stations[idx];
      if (st) {
        marker.setIcon(createMarkerIcon(st, isSelected));
        if (isSelected) {
          marker.setZIndexOffset(1000);
        } else {
          marker.setZIndexOffset(0);
        }
      }
    });
  }, [selectedIdx, stations]);

  function createMarkerIcon(st: DatosMapaEstacion, isActive: boolean) {
    const size = 32;
    const height = 38;
    const anchorX = size / 2;
    const anchorY = height;
    const fontSize = '13px';

    return L.divIcon({
      className: 'custom-map-pin',
      html: `
        <div style="
          position: relative;
          width: ${size}px;
          height: ${height}px;
          cursor: pointer;
        ">
          ${
            isActive
              ? `<div class="map-pin-pulse-ring" style="background-color: ${st.color};"></div>`
              : ''
          }
          <div style="
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            width: ${size}px;
            height: ${size}px;
            border-radius: 50%;
            background-color: ${st.color};
            color: #ffffff;
            font-weight: 900;
            font-size: ${fontSize};
            font-family: inherit;
            box-shadow: 0 0 0 2px #ffffff, ${isActive ? '2px 2.5px 3.5px rgba(0, 0, 0, 0.28)' : '1.5px 2px 2.5px rgba(0, 0, 0, 0.22)'};
            transition: transform 0.25s ease;
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
              border-top: 6px solid ${st.color};
            "></span>
          </div>
        </div>
      `,
      iconSize: [size, height],
      iconAnchor: [anchorX, anchorY],
      popupAnchor: [0, -anchorY + 4],
    });
  }

  const handleSelectStation = (index: number) => {
    setSelectedIdx(index);
    const map = mapInstanceRef.current;
    if (!map) return;

    const st = stations[index];
    if (st) {
      map.flyTo([st.lat, st.lng], EXPAND_ZOOM, {
        duration: 1.1,
        easeLinearity: 0.25,
      });

      const marker = markersRef.current[index];
      if (marker) {
        marker.openPopup();
      }

      const cardEl = document.getElementById(`station-card-${index}`);
      if (cardEl && cardsContainerRef.current) {
        cardEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  };

  const handleResetView = () => {
    setSelectedIdx(null);
    const map = mapInstanceRef.current;
    if (!map) return;

    map.closePopup();
    map.flyTo(DEFAULT_CENTER, DEFAULT_ZOOM, {
      duration: 1.0,
    });
  };

  return (
    <div className="w-full flex flex-col gap-4">
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        
        <div className="lg:col-span-5 flex flex-col">
          <div
            ref={cardsContainerRef}
            className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-y-auto max-h-[360px] lg:max-h-[420px] p-1.5 no-scrollbar"
          >
            {stations.map((st, idx) => {
              const isSelected = selectedIdx === idx;
              return (
                <div
                  id={`station-card-${idx}`}
                  key={idx}
                  onClick={() => handleSelectStation(idx)}
                  className={`group relative flex flex-row items-center bg-white rounded-xl px-3 py-2 transition-all duration-150 cursor-pointer min-w-[280px] sm:min-w-[300px] lg:min-w-0 w-full h-[70px] sm:h-[62px] border-2 shrink-0 ${
                    isSelected
                      ? 'shadow-[2.5px_3px_8px_rgba(38,32,25,0.13)] ring-1'
                      : 'border-[rgba(38,32,25,0.08)] shadow-[2px_2px_5px_rgba(38,32,25,0.08)] hover:shadow-[3px_3px_9px_rgba(38,32,25,0.13)] hover:border-[rgba(38,32,25,0.18)] hover:-translate-y-0.5'
                  }`}
                  style={{
                    borderColor: isSelected ? st.color : 'transparent',
                    ...(isSelected ? ({ '--tw-ring-color': st.color } as any) : {}),
                    backgroundColor: isSelected ? '#FCFBF9' : '#ffffff',
                  }}
                >
                  
                  <div
                    className="flex items-center justify-center w-7 h-7 rounded-lg text-white font-black text-xs transition-transform duration-150 group-hover:scale-105 flex-shrink-0"
                    style={{
                      backgroundColor: st.color,
                      boxShadow: '1.5px 2px 2.5px rgba(0, 0, 0, 0.2)',
                    }}
                  >
                    {st.letter}
                  </div>

                  
                  <div className="flex flex-col justify-center flex-1 ml-2.5 sm:ml-3 min-w-0">
                    <h3 className="text-[13px] sm:text-[13.5px] font-bold text-[#262019] leading-tight mb-0.5 transition-colors">
                      {st.place}
                    </h3>
                    <p className="text-[11px] sm:text-[11.5px] text-[#6b5f4e] leading-snug m-0">
                      {st.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        
        <div className="lg:col-span-7 flex flex-col">
          <div className="relative w-full h-[360px] lg:h-[420px] rounded-xl overflow-hidden border border-[rgba(38,32,25,0.12)] shadow-[3px_4px_12px_rgba(38,32,25,0.12)] bg-[#FAF8F4]">
            
            <div className="absolute top-2.5 right-2.5 z-[400] flex items-center gap-1.5">
              
              <div className="flex items-center bg-white/95 backdrop-blur-md p-0.5 rounded-lg border border-[rgba(38,32,25,0.12)] shadow-sm">
                <button
                  type="button"
                  onClick={() => setMapLayer('voyager')}
                  className={`px-2 py-0.5 text-[11px] font-bold rounded-md transition-all ${
                    mapLayer === 'voyager'
                      ? 'bg-[#262019] text-white shadow-xs'
                      : 'text-[#6b5f4e] hover:text-[#262019]'
                  }`}
                >
                  Claro
                </button>
                <button
                  type="button"
                  onClick={() => setMapLayer('satellite')}
                  className={`px-2 py-0.5 text-[11px] font-bold rounded-md transition-all ${
                    mapLayer === 'satellite'
                      ? 'bg-[#262019] text-white shadow-xs'
                      : 'text-[#6b5f4e] hover:text-[#262019]'
                  }`}
                >
                  Satélite
                </button>
              </div>

              
              <button
                type="button"
                onClick={handleResetView}
                className="px-2.5 py-1 bg-white/95 backdrop-blur-md hover:bg-white text-[#262019] text-[11px] font-bold rounded-lg border border-[rgba(38,32,25,0.12)] shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer"
                title="Ver toda la ciudad de Eldorado"
              >
                Vista general
              </button>
            </div>

            
            <div ref={mapContainerRef} className="w-full h-full z-0" />
          </div>
        </div>
      </div>
    </div>
  );
}
