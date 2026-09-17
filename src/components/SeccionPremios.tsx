'use client';

import { useState, useEffect } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Check,
  Trophy,
} from 'lucide-react';
import { fetchTramosPremio, TramoPremioInfo } from '@/lib/api';

interface CategoriaPremio {
  id: string;
  numero: number;
  nombre: string;
  rangoLetras: string;
  color: string;
  colorLight: string;
  colorText: string;
  premioTitulo: string;
  requisitosItems: string[];
}

const CATEGORIAS_PREMIOS_DEFAULT: CategoriaPremio[] = [
  {
    id: 'inicial',
    numero: 1,
    nombre: 'Categoría Inicial',
    rangoLetras: 'A partir de 3 letras + trivia',
    color: '#1B9951',
    colorLight: '#EAF5EE',
    colorText: '#14532D',
    premioTitulo: 'Lápiz oficial con semillas para huerta (o similar)',
    requisitosItems: [
      'Escanear el QR y recolectar al menos 3 letras de la ciudad.',
      'Responder la consigna o trivia de las estaciones visitadas.',
    ],
  },
  {
    id: 'intermedia',
    numero: 2,
    nombre: 'Categoría Intermedia',
    rangoLetras: '4-5 letras + trivia',
    color: '#2B8487',
    colorLight: '#E6F4F4',
    colorText: '#004D40',
    premioTitulo: 'Pin oficial conmemorativo de identidad eldoradense (o similar)',
    requisitosItems: [
      'Visitar y escanear el QR en al menos 4 a 5 puntos de la ciudad.',
      'Responder las preguntas de las estaciones visitadas.',
    ],
  },
  {
    id: 'avanzada',
    numero: 3,
    nombre: 'Categoría Avanzada',
    rangoLetras: '6-7 letras + trivia',
    color: '#EB9301',
    colorLight: '#FEF6E8',
    colorText: '#8A5200',
    premioTitulo: 'Vouchers en comercios y locales adheridos (o similar)',
    requisitosItems: [
      'Haber escaneado y validado entre 6 y 7 estaciones del circuito urbano.',
      'Alto rendimiento de respuestas correctas en las trivias.',
    ],
  },
  {
    id: 'mayor',
    numero: 4,
    nombre: 'Premio Mayor',
    rangoLetras: '8 letras + 100% en las trivias',
    color: '#BE0D00',
    colorLight: '#FCEBEA',
    colorText: '#7A0900',
    premioTitulo: 'Gran Premio Mayor de la Municipalidad de Eldorado',
    requisitosItems: [
      'Recolectar y validar las 8 letras completas de la palabra ELDORADO.',
      'Responder correctamente el 100% de las preguntas del recorrido (sin errores).',
    ],
  },
];

export default function SeccionPremios() {
  const [categorias] = useState<CategoriaPremio[]>(CATEGORIAS_PREMIOS_DEFAULT);
  const [cardAbiertaId, setCardAbiertaId] = useState<string | null>(null);

  const toggleCard = (id: string) => {
    setCardAbiertaId((prev) => (prev === id ? null : id));
  };

  return (
    <section
      id="premios"
      className="scroll-mt-24 w-full flex flex-col justify-center py-14 sm:py-18 px-[clamp(16px,3.5vw,48px)] max-w-[1240px] mx-auto border-b border-[rgba(38,32,25,0.06)]"
    >
      <div className="max-w-[58ch] mx-auto mb-8 sm:mb-10 text-center">
        <h2 className="section-title text-[clamp(26px,4vw,42px)] m-0 mb-2.5 text-[#162438]">
          Categorías y Premios
        </h2>
        <p className="text-[14px] sm:text-[15px] text-[#6b5f4e] leading-relaxed m-0">
          Al recorrer la ciudad y recolectar letras, podés ganar premios en cada etapa de tu camino hacia el Premio Mayor.
        </p>
      </div>

      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 items-start"
        style={{ alignItems: 'start' }}
      >
        {categorias.map((cat) => {
          const estaAbierta = cardAbiertaId === cat.id;

          return (
            <div
              key={cat.id}
              className={`relative bg-white rounded-2xl transition-[box-shadow,border-color,transform] duration-200 overflow-hidden flex flex-col hover:-translate-y-0.5 cursor-pointer self-start w-full border-2 h-fit ${
                estaAbierta
                  ? ''
                  : 'border-[#E5E0D8]'
              }`}
              style={{
                alignSelf: 'start',
                height: 'fit-content',
                borderColor: estaAbierta ? cat.color : undefined,
                boxShadow: estaAbierta
                  ? '3px 3.5px 10px rgba(38, 32, 25, 0.15)'
                  : '2px 2.5px 6px rgba(38, 32, 25, 0.10)',
              }}
              onClick={() => toggleCard(cat.id)}
            >
              
              <div
                className={`p-4 sm:p-5 flex flex-col items-center w-full h-fit ${
                  estaAbierta ? 'text-left' : 'py-5 sm:py-6'
                }`}
              >
                
                <div className="flex justify-center w-full mb-3.5 sm:mb-4.5">
                  <div
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center shrink-0 text-white font-black text-lg sm:text-xl shadow-[2px_3px_5px_rgba(0,0,0,0.18)] aspect-square"
                    style={{
                      backgroundColor: cat.color,
                      minWidth: '48px',
                      minHeight: '48px',
                      maxWidth: '56px',
                      maxHeight: '56px',
                      aspectRatio: '1 / 1',
                    }}
                  >
                    {cat.id === 'mayor' ? (
                      <Trophy className="w-6 h-6 sm:w-7 sm:h-7 text-white stroke-[2.2]" />
                    ) : (
                      cat.numero
                    )}
                  </div>
                </div>

                
                <div className="flex flex-col items-center text-center mb-1">
                  <h3 className="text-base sm:text-[17px] font-bold text-[#162438] leading-snug m-0">
                    {cat.nombre}
                  </h3>
                  <span
                    className="text-[11.5px] sm:text-xs font-bold italic mt-2 px-3 py-1 rounded-full inline-block leading-tight text-center"
                    style={{
                      backgroundColor: cat.colorLight,
                      color: cat.colorText,
                    }}
                  >
                    {cat.rangoLetras}
                  </span>
                </div>

                
                {!estaAbierta && (
                  <div className="mt-3 text-[11px] sm:text-[11.5px] text-[#8C8275] font-semibold flex items-center justify-center gap-1">
                    <span>Ver requisitos</span>
                    <ChevronDown className="w-3.5 h-3.5 opacity-60" />
                  </div>
                )}

                
                {estaAbierta && (
                  <div
                    className="w-full mt-4 pt-3.5 border-t border-dotted border-gray-200 flex flex-col gap-3 animate-fadeIn text-left"
                    onClick={(e) => e.stopPropagation()} // Evita cerrar al hacer click dentro del contenido
                  >
                    
                    <div
                      className="rounded-xl p-3.5 border border-dashed bg-white shadow-xs"
                      style={{ borderColor: cat.color }}
                    >
                      <h4 className="text-[13px] font-bold text-[#162438] m-0 mb-2">
                        ¿Qué requisitos necesitás?
                      </h4>

                      <ul className="space-y-2 mb-0 pl-0 list-none text-xs text-[#4a4033]">
                        {cat.requisitosItems.map((req, i) => (
                          <li key={i} className="flex items-start gap-2 leading-relaxed">
                            <Check
                              className="w-3.5 h-3.5 shrink-0 mt-0.5"
                              style={{ color: cat.color }}
                            />
                            <span>{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    
                    <div
                      className="rounded-xl p-3 flex flex-col gap-1"
                      style={{ backgroundColor: cat.colorLight }}
                    >
                      <span
                        className="text-[10.5px] font-extrabold uppercase tracking-wider"
                        style={{ color: cat.color }}
                      >
                        PREMIO A GANAR:
                      </span>
                      <p className="text-xs sm:text-[12.5px] font-normal text-[#162438] m-0 leading-snug">
                        {cat.premioTitulo.replace(' (o similar)', '')}{' '}
                        {cat.premioTitulo.includes('(o similar)') && (
                          <span className="italic text-[#5c5040] text-[11px] whitespace-nowrap inline-block">
                            (o similar)
                          </span>
                        )}
                      </p>
                    </div>

                    
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleCard(cat.id);
                      }}
                      className="pt-1 text-[11px] sm:text-[11.5px] text-[#8C8275] hover:text-[#162438] font-semibold flex items-center justify-center gap-1 cursor-pointer w-full transition-colors"
                    >
                      <span>Ocultar requisitos</span>
                      <ChevronUp className="w-3.5 h-3.5 opacity-60" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
