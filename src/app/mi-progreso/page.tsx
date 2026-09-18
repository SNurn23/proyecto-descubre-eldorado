'use client';

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  getStoredEmail,
  setStoredEmail,
  fetchProgreso,
  clearStoredEmail,
  ProgresoResponse,
} from '@/lib/api';
import { QrCode, Check, Trophy } from 'lucide-react';

const MapaProgreso = dynamic(() => import('@/components/MapaProgreso'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[200px] rounded-2xl bg-gray-100 animate-pulse" />
  ),
});

function ContenidoMiProgreso() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get('email');

  const [email, setEmail] = useState<string | null>(null);
  const [progreso, setProgreso] = useState<ProgresoResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const emailToUse = emailParam
      ? emailParam.trim().toLowerCase()
      : getStoredEmail();

    if (emailParam) {
      setStoredEmail(emailParam.trim().toLowerCase());
    }

    setEmail(emailToUse);
    if (emailToUse) {
      cargarProgreso(emailToUse);
    } else {
      setLoading(false);
    }
  }, [emailParam]);

  const cargarProgreso = async (userEmail: string) => {
    try {
      setLoading(true);
      const data = await fetchProgreso(userEmail);
      setProgreso(data);
    } catch {
      setProgreso(null);
    } finally {
      setLoading(false);
    }
  };


  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-10 h-10 border-4 border-[#1B9951] border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-gray-600 text-sm">Cargando tu progreso...</p>
      </div>
    );
  }

  if (!email || !progreso) {
    return (
      <div className="min-h-[85vh] bg-[#F9FAFB] flex flex-col items-center justify-center px-4 py-8">
        <div className="w-full flex flex-col items-center">
          <div className="w-full max-w-sm bg-white rounded-3xl p-7 shadow-[2px_2.5px_6px_rgba(38,32,25,0.10)] border-2 border-[#E5E0D8] flex flex-col gap-5 text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-50 text-[#1B9951] flex items-center justify-center border border-emerald-200">
              <QrCode className="w-8 h-8" />
            </div>
            <div>
              <h1 className="font-bold text-2xl text-[#262019] m-0">
                Accedé escaneando el QR
              </h1>
              <p className="text-sm text-[#6b5f4e] mt-2 mb-0 leading-relaxed">
                Para sumarte al concurso y ver tu progreso, visitá las estaciones en Eldorado y escaneá el código QR ubicado en cada punto con tu celular.
              </p>
            </div>
            <Link
              href="/#puntos"
              className="w-full h-12 rounded-full bg-[#1B9951] hover:bg-[#147a40] text-white font-bold text-sm shadow-[2px_2.5px_6px_rgba(38,32,25,0.10)] flex items-center justify-center transition-colors"
            >
              Ver estaciones en el mapa
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const letrasEscaneadas = progreso.letras.filter((l) => l.escaneada).length;
  const totalPreguntas = progreso.total_preguntas_respondidas || 0;
  const correctas = progreso.respuestas_correctas || 0;
  const porcentajeTotal =
    totalPreguntas > 0 ? Math.round((correctas / totalPreguntas) * 100) : 0;
  const porcentajeColor =
    porcentajeTotal === 100
      ? '#1B9951'
      : porcentajeTotal >= 50
        ? '#F59E0B'
        : '#EF4444';

  return (
    <div className="min-h-[85vh] bg-[#F9FAFB] flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full flex flex-col items-center">
        <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-[2px_2.5px_6px_rgba(38,32,25,0.10)] border-2 border-[#E5E0D8] flex flex-col gap-6">
          <div className="flex flex-col gap-1 pb-3 border-b border-gray-100">
            <div className="text-left">
              <h1 className="font-bold text-2xl text-[#262019] m-0 leading-tight">
                Hola, <span className="italic">{progreso.participante.nombre}</span>
              </h1>
              <p className="text-sm font-semibold text-[#6b5f4e] m-0 mt-1">
                Tu progreso
              </p>
            </div>
          </div>

          <div>
            <div className="font-semibold text-sm text-[#262019] mb-2 text-left">
              Letras recolectadas
            </div>
            <div className="flex flex-col gap-3 bg-white rounded-2xl p-4 border border-[rgba(38,32,25,0.08)] shadow-2xs">
              <div className="flex gap-1.5 justify-center py-1">
                {progreso.letras.map((pg, i) => (
                  <div
                    key={i}
                    className="w-9 h-9 rounded-full flex items-center justify-center border-2 transition-transform hover:scale-105"
                    style={{
                      backgroundColor: pg.escaneada ? pg.color_hex : 'transparent',
                      borderColor: pg.escaneada ? pg.color_hex : 'rgba(38,32,25,0.2)',
                      boxShadow: pg.escaneada ? `0 2px 8px ${pg.color_hex}35` : undefined,
                    }}
                    title={`${pg.letra} - ${pg.nombre_pilar} (${pg.nombre_lugar})`}
                  >
                    <span
                      className="font-black text-sm leading-none"
                      style={{ color: pg.escaneada ? '#fff' : '#9a8f7f' }}
                    >
                      {pg.letra}
                    </span>
                  </div>
                ))}
              </div>

              <p className="text-xs text-[#6b5f4e] text-center m-0">
                {progreso.letras_completas
                  ? '¡Completaste todas las letras de ELDORADO!'
                  : `Te faltan ${8 - letrasEscaneadas} letras para completar la palabra.`}
              </p>
            </div>
          </div>

          
          <div>
            <div className="font-semibold text-sm text-[#262019] mb-2 text-left">
              Porcentaje Total
            </div>
            <div className="flex flex-col items-center justify-center p-5 rounded-2xl bg-white border border-[rgba(38,32,25,0.08)] shadow-2xs">
              
              <div className="relative w-28 h-28 flex items-center justify-center my-1">
                <svg
                  className="w-28 h-28 -rotate-90 drop-shadow-xs"
                  viewBox="0 0 100 100"
                  style={{ width: 112, height: 112 }}
                >
                  <circle
                    cx="50"
                    cy="50"
                    r={38}
                    stroke="rgba(38,32,25,0.08)"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r={38}
                    stroke={porcentajeColor}
                    strokeWidth="8"
                    strokeDasharray={238.76}
                    strokeDashoffset={238.76 - (238.76 * porcentajeTotal) / 100}
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-700 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-center select-none">
                  <span className="text-2xl font-black text-[#162438] leading-none">
                    {porcentajeTotal}<span className="text-sm font-bold text-gray-400">%</span>
                  </span>
                </div>
              </div>

              
              <span className="text-xs text-[#6b5f4e] text-center mt-3">
                {totalPreguntas > 0
                  ? `${correctas} de ${totalPreguntas} respuestas correctas`
                  : 'Aún no respondiste preguntas'}
              </span>
            </div>
          </div>

          
          <div>
            <div className="font-semibold text-sm text-[#262019] mb-2 text-left">
              Premios ganados y categorías
            </div>

            <div className="bg-white rounded-2xl p-5 border border-[rgba(38,32,25,0.08)] shadow-2xs">
              <div className="relative flex flex-col gap-4 text-left">
                
                <div className="absolute left-3.5 top-3 bottom-3 w-0.5 bg-gray-100 z-0" />

                {progreso.premios.map((pr, i) => {
                  const esGanado = pr.estado === 'Ganado';
                  const esPremioMayor = pr.nombre.toLowerCase().includes('mayor');

                  return (
                    <div key={i} className="flex items-start gap-3.5 relative z-10">
                      
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 border-2 bg-white shadow-2xs"
                        style={{
                          borderColor: esGanado ? '#1B9951' : '#D1D5DB',
                          backgroundColor: esGanado ? '#1B9951' : '#FFFFFF',
                          color: esGanado ? '#FFFFFF' : '#9CA3AF',
                        }}
                      >
                        {esGanado ? (
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        ) : esPremioMayor ? (
                          <Trophy className="w-3.5 h-3.5 text-gray-400" />
                        ) : (
                          <span className="w-2 h-2 rounded-full bg-gray-300" />
                        )}
                      </div>

                      <div className="flex flex-col flex-1 min-w-0 pt-0.5">
                        <div className="flex items-center justify-between gap-2">
                          <span
                            className="text-xs font-bold truncate"
                            style={{ color: esGanado ? '#262019' : '#4B5563' }}
                          >
                            {pr.nombre}
                          </span>
                          {esGanado && (
                            <span className="text-[10px] font-bold text-[#1B9951] uppercase tracking-wider shrink-0">
                              GANADO
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-[#6b5f4e] leading-snug mt-0.5">
                          {pr.descripcion}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          
          <div>
            <div className="font-semibold text-sm text-[#262019] mb-2 text-left">
              Puntos en el mapa
            </div>
            <div className="rounded-2xl overflow-hidden border border-[rgba(38,32,25,0.08)] shadow-2xs h-[220px]">
              <MapaProgreso
                ordenesEscaneados={progreso.letras
                  .filter((l) => l.escaneada)
                  .map((l) => l.orden)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MiProgresoPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center">
          <div className="w-10 h-10 border-4 border-[#1B9951] border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-gray-600 text-sm">Cargando tu progreso...</p>
        </div>
      }
    >
      <ContenidoMiProgreso />
    </Suspense>
  );
}
