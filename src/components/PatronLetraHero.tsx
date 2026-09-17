'use client';

import React from 'react';

interface PatronLetraHeroProps {
  orden: number;
  color: string;
  className?: string;
}

/**
 * Genera un patrón SVG geométrico variado (puntos, líneas, guiones, ondas, etc.)
 * para rellenar el interior de cada letra del Hero de acuerdo a su orden/identidad.
 */
export default function PatronLetraHero({
  orden,
  color,
  className = 'w-full h-full',
}: PatronLetraHeroProps) {
  const patternId = `pattern-letter-${orden}`;

  return (
    <svg
      className={className}
      width="100%"
      height="100%"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        {/* Letra 1 - E (Espíritu Emprendedor): Puntos regulares ordenados */}
        {orden === 1 && (
          <pattern
            id={patternId}
            width="18"
            height="18"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="9" cy="9" r="2.6" fill={color} fillOpacity="0.85" />
            <circle cx="0" cy="0" r="1.5" fill={color} fillOpacity="0.5" />
            <circle cx="18" cy="0" r="1.5" fill={color} fillOpacity="0.5" />
            <circle cx="0" cy="18" r="1.5" fill={color} fillOpacity="0.5" />
            <circle cx="18" cy="18" r="1.5" fill={color} fillOpacity="0.5" />
          </pattern>
        )}

        {/* Letra 2 - L (Legado Histórico): Líneas diagonales paralelas */}
        {orden === 2 && (
          <pattern
            id={patternId}
            width="18"
            height="18"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(45)"
          >
            <line
              x1="0"
              y1="0"
              x2="0"
              y2="18"
              stroke={color}
              strokeWidth="2.4"
              strokeOpacity="0.8"
            />
          </pattern>
        )}

        {/* Letra 3 - D (Diversidad Cultural): Puntos y líneas/guiones combinados (diseño solicitado) */}
        {orden === 3 && (
          <pattern
            id={patternId}
            width="32"
            height="22"
            patternUnits="userSpaceOnUse"
          >
            {/* Fila 1: Guión horizontal y dos puntos */}
            <line
              x1="2"
              y1="6"
              x2="13"
              y2="6"
              stroke={color}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeOpacity="0.9"
            />
            <circle cx="20" cy="6" r="2.2" fill={color} fillOpacity="0.85" />
            <circle cx="27" cy="6" r="2.2" fill={color} fillOpacity="0.85" />

            {/* Fila 2: Dos puntos y un guión horizontal alternado */}
            <circle cx="5" cy="17" r="2.2" fill={color} fillOpacity="0.85" />
            <circle cx="12" cy="17" r="2.2" fill={color} fillOpacity="0.85" />
            <line
              x1="19"
              y1="17"
              x2="30"
              y2="17"
              stroke={color}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeOpacity="0.9"
            />
          </pattern>
        )}

        {/* Letra 4 - O (Orígenes): Anillos y círculos concéntricos */}
        {orden === 4 && (
          <pattern
            id={patternId}
            width="28"
            height="28"
            patternUnits="userSpaceOnUse"
          >
            <circle
              cx="14"
              cy="14"
              r="12"
              fill="none"
              stroke={color}
              strokeWidth="1.8"
              strokeOpacity="0.75"
            />
            <circle
              cx="14"
              cy="14"
              r="6"
              fill="none"
              stroke={color}
              strokeWidth="1.8"
              strokeOpacity="0.8"
            />
            <circle cx="14" cy="14" r="1.8" fill={color} fillOpacity="0.85" />
          </pattern>
        )}

        {/* Letra 5 - R (Río Paraná): Líneas onduladas de agua */}
        {orden === 5 && (
          <pattern
            id={patternId}
            width="28"
            height="14"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 0,7 Q 7,1 14,7 T 28,7"
              fill="none"
              stroke={color}
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeOpacity="0.85"
            />
          </pattern>
        )}

        {/* Letra 6 - A (Actividad Agroindustrial): Trama cruzada / surcos */}
        {orden === 6 && (
          <pattern
            id={patternId}
            width="16"
            height="16"
            patternUnits="userSpaceOnUse"
          >
            <line
              x1="0"
              y1="0"
              x2="16"
              y2="16"
              stroke={color}
              strokeWidth="1.8"
              strokeOpacity="0.75"
            />
            <line
              x1="0"
              y1="16"
              x2="16"
              y2="0"
              stroke={color}
              strokeWidth="1.8"
              strokeOpacity="0.75"
            />
          </pattern>
        )}

        {/* Letra 7 - D (Destino Recreativo): Zigzag dinámico */}
        {orden === 7 && (
          <pattern
            id={patternId}
            width="24"
            height="16"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 0,8 L 6,2 L 12,8 L 18,2 L 24,8"
              fill="none"
              stroke={color}
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeOpacity="0.85"
            />
            <path
              d="M 0,16 L 6,10 L 12,16 L 18,10 L 24,16"
              fill="none"
              stroke={color}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeOpacity="0.45"
            />
          </pattern>
        )}

        {/* Letra 8 - O (Observatorio Natural): Puntos orgánicos / constelación */}
        {orden === 8 && (
          <pattern
            id={patternId}
            width="26"
            height="26"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="6" cy="6" r="2.8" fill={color} fillOpacity="0.9" />
            <circle cx="19" cy="7" r="1.6" fill={color} fillOpacity="0.7" />
            <circle cx="13" cy="18" r="2.4" fill={color} fillOpacity="0.85" />
            <circle cx="22" cy="22" r="1.8" fill={color} fillOpacity="0.75" />
            <circle cx="4" cy="21" r="1.5" fill={color} fillOpacity="0.65" />
          </pattern>
        )}

        {/* Fallback si el orden no coincide con 1..8 */}
        {(!orden || orden < 1 || orden > 8) && (
          <pattern
            id={patternId}
            width="18"
            height="18"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="9" cy="9" r="2.5" fill={color} fillOpacity="0.8" />
          </pattern>
        )}
      </defs>

      <rect width="100%" height="100%" fill={`url(#${patternId})`} />
    </svg>
  );
}
