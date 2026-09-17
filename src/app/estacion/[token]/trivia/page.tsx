'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  resolverQr,
  enviarRespuesta,
  fetchProgreso,
  getStoredEmail,
  EstacionInfo,
  ProgresoResponse,
} from '@/lib/api';


interface PreguntaLocal {
  id: string;
  texto: string;
  opciones: string[];
  orden: number;
}

interface RespuestaResult {
  preguntaIndex: number;
  esCorrecta: boolean;
  mensaje: string;
}

export default function TriviaPage() {
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;

  const [estacion, setEstacion] = useState<EstacionInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

                         
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [results, setResults] = useState<RespuestaResult[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [lastResult, setLastResult] = useState<{
    esCorrecta: boolean;
    mensaje: string;
    respuestaCorrecta?: string;
  } | null>(null);

                  
  const [finished, setFinished] = useState(false);
  const [progreso, setProgreso] = useState<ProgresoResponse | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const email = getStoredEmail();
        const res = await resolverQr(token, email);
        setEstacion(res.estacion);

        if (email) {
          try {
            const prog = await fetchProgreso(email);
            setProgreso(prog);
          } catch { }
        }
      } catch (err: any) {
        setError(err.message || 'Error al cargar la trivia');
      } finally {
        setLoading(false);
      }
    }
    if (token) {
      load();
    }
  }, [token]);

  const preguntas: PreguntaLocal[] = estacion?.preguntas?.length
    ? estacion.preguntas.sort((a, b) => a.orden - b.orden)
    : [
      {
        id: 'demo-1',
        texto: '¿Quién fue el pionero que fundó la colonia Eldorado en 1919?',
        opciones: [
          'Adolfo Julio Schwelm',
          'Carlos Linneo',
          'Eduviges Markovicz',
          'Guillermo Küppers',
        ],
        orden: 1,
      },
    ];

  const totalPreguntas = preguntas.length;
  const preguntaActual = preguntas[currentIndex];

  const handleVerificar = async () => {
    if (selectedOption === null || !estacion || !preguntaActual) return;

    const email = getStoredEmail();
    if (!email) {
      alert('Por favor registrate primero para guardar tu respuesta');
      router.push(`/registro?token=${encodeURIComponent(token)}`);
      return;
    }

    try {
      setSubmitting(true);
      const res = await enviarRespuesta(email, preguntaActual.id, selectedOption);

      let textoCorrecto = '';
      if (typeof res.opcionCorrecta === 'number' && preguntaActual.opciones[res.opcionCorrecta]) {
        textoCorrecto = preguntaActual.opciones[res.opcionCorrecta];
      } else if (typeof (preguntaActual as any).opcion_correcta === 'number' && preguntaActual.opciones[(preguntaActual as any).opcion_correcta]) {
        textoCorrecto = preguntaActual.opciones[(preguntaActual as any).opcion_correcta];
      } else {
        textoCorrecto = preguntaActual.opciones[0] || '';
      }

      const resultado: RespuestaResult = {
        preguntaIndex: currentIndex,
        esCorrecta: res.esCorrecta,
        mensaje: res.mensaje,
      };

      setResults((prev) => [...prev, resultado]);
      setLastResult({
        esCorrecta: res.esCorrecta,
        mensaje: res.mensaje,
        respuestaCorrecta: textoCorrecto,
      });
      setShowFeedback(true);
    } catch (err: any) {
      alert(err.message || 'Error al enviar tu respuesta');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSiguiente = () => {
    if (currentIndex + 1 < totalPreguntas) {
      setShowFeedback(false);
      setLastResult(null);
      setSelectedOption(null);
      setCurrentIndex((prev) => prev + 1);
    } else {
      setFinished(true);
      setShowFeedback(false);
      setLastResult(null);
      setSelectedOption(null);

      const email = getStoredEmail();
      if (email) {
        fetchProgreso(email)
          .then((prog) => setProgreso(prog))
          .catch(() => { });
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6">
        <div className="w-10 h-10 border-4 border-[#1B9951] border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-gray-600 text-sm">Cargando trivia...</p>
      </div>
    );
  }

  if (error || !estacion) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center">
        <p className="text-red-600 font-semibold mb-4">{error}</p>
        <button
          onClick={() => router.push('/')}
          className="bg-[#262019] text-white px-5 py-2 rounded-full text-sm font-semibold"
        >
          Volver al inicio
        </button>
      </div>
    );
  }

  const stationColor = estacion.color_hex || '#1B9951';

  const theme = estacion.tema_visual;
  const gradStart = theme?.accentMain || estacion.color_hex || '#16984A';
  const gradEnd = theme?.bgDark || '#123824';

  const renderActionButton = (
    text: string,
    onClick: () => void,
    disabled?: boolean,
    isSubmitting?: boolean
  ) => {
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className="w-full h-14 rounded-full bg-[#111827] hover:bg-[#1f2937] text-white font-bold text-base shadow-md transition-all duration-200 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer select-none"
      >
        {isSubmitting ? 'Verificando...' : text}
      </button>
    );
  };

  const renderContinuarButton = (onClick: () => void) => {
    return (
      <button
        onClick={onClick}
        className="w-full h-14 rounded-full font-bold text-base text-white bg-[#111827] hover:bg-[#1f2937] shadow-md transition-all duration-200 active:scale-95 flex items-center justify-center cursor-pointer select-none"
      >
        Continuar
      </button>
    );
  };

  if (finished) {
    const correctas = results.filter((r) => r.esCorrecta).length;
    const total = totalPreguntas || 1;
    const porcentaje = Math.round((correctas / total) * 100);
    const allCorrect = correctas === totalPreguntas;

    const scoreColor = allCorrect ? '#1B9951' : porcentaje >= 50 ? '#F59E0B' : '#EF4444';
    const radius = 40;
    const circ = 2 * Math.PI * radius;
    const strokeOffset = circ - (circ * porcentaje) / 100;

    return (
      <div className="min-h-[85vh] bg-[#F9FAFB] flex flex-col items-center justify-center px-4 py-8">
        <div className="w-full flex flex-col items-center justify-center">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-[rgba(38,32,25,0.08)] flex flex-col items-center text-center gap-6">
            
            <div className="relative w-28 h-28 flex items-center justify-center animate-fadeIn my-1">
              <svg className="w-28 h-28 -rotate-90 drop-shadow-xs" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  stroke="rgba(38,32,25,0.08)"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  stroke={scoreColor}
                  strokeWidth="8"
                  strokeDasharray={circ}
                  strokeDashoffset={strokeOffset}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-700 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-center select-none">
                <span className="text-[28px] font-black text-[#162438] leading-none">
                  {porcentaje}<span className="text-lg font-bold text-gray-400">%</span>
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <h1 className="font-bold text-[23px] text-[#262019] m-0">
                {allCorrect
                  ? `¡Perfecto! Sumaste la letra ${estacion.letra}`
                  : `Sumaste la letra ${estacion.letra}`}
              </h1>
              <p className="text-[13px] text-[#6b5f4e] m-0 max-w-[280px] leading-relaxed">
                {allCorrect
                  ? '¡Excelente! Obtuviste el 100% de respuestas correctas. Seguís en carrera hacia el Premio Mayor.'
                  : `Obtuviste el ${porcentaje}% de aciertos (${correctas} de ${totalPreguntas}). Sumás la letra igual, pero recordá que para el Premio Mayor se requiere 100% de aciertos.`}
              </p>
            </div>

            
            <div className="flex gap-1.5 justify-center py-1">
              {results.map((r, i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                  style={{ backgroundColor: r.esCorrecta ? '#1B9951' : '#EF4444' }}
                >
                  {r.esCorrecta ? '✓' : '✗'}
                </div>
              ))}
            </div>

            <button
              onClick={() => router.push('/mi-progreso')}
              className="w-full h-14 rounded-full text-white font-bold text-base shadow-md transition-all duration-200 active:scale-95 flex items-center justify-center bg-[#111827] hover:bg-[#1f2937] cursor-pointer"
            >
              Ver mi progreso
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showFeedback && lastResult) {
    return (
      <div className="min-h-[85vh] bg-[#F9FAFB] flex flex-col items-center justify-center px-4 py-8">
        <div className="w-full flex flex-col items-center justify-center">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-[rgba(38,32,25,0.08)] flex flex-col items-center gap-5">
            
            <div className="w-full flex items-center gap-1.5">
              {Array.from({ length: totalPreguntas }).map((_, i) => (
                <div
                  key={i}
                  className="h-1.5 flex-1 rounded-full transition-all duration-300"
                  style={{
                    backgroundColor:
                      i < results.length
                        ? results[i].esCorrecta
                          ? '#1B9951'
                          : '#EF4444'
                        : 'rgba(38,32,25,0.1)',
                  }}
                />
              ))}
            </div>

            
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center shadow-md"
              style={{ backgroundColor: lastResult.esCorrecta ? '#1B9951' : '#EF4444' }}
            >
              {lastResult.esCorrecta ? (
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M5 13l4 4L19 7"
                    stroke="#fff"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M18 6L6 18M6 6l12 12"
                    stroke="#fff"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </div>

            <h2 className="font-bold text-xl text-[#262019] text-center m-0">
              {lastResult.esCorrecta ? '¡Correcto!' : 'Respuesta incorrecta'}
            </h2>

            {!lastResult.esCorrecta && lastResult.respuestaCorrecta && (
              <div className="w-full max-w-[320px] bg-[#FAF8F5] border border-[rgba(38,32,25,0.1)] rounded-2xl py-3 px-4 text-center flex flex-col items-center gap-1 animate-fadeIn">
                <span className="text-[11px] font-semibold text-[#8C7E6C] uppercase tracking-wider">
                  La respuesta correcta era:
                </span>
                <span className="text-[15px] font-bold text-[#1B9951] leading-snug">
                  {lastResult.respuestaCorrecta}
                </span>
              </div>
            )}

            <div className="w-full mt-2">
              {renderContinuarButton(handleSiguiente)}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[85vh] bg-[#F9FAFB] flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full flex flex-col items-center justify-center">
        <div className="w-full max-w-md bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-[rgba(38,32,25,0.08)] flex flex-col gap-5">
          
          <div className="w-full flex items-center gap-1.5">
            {Array.from({ length: totalPreguntas }).map((_, i) => (
              <div
                key={i}
                className="h-1.5 flex-1 rounded-full transition-all duration-300"
                style={{
                  backgroundColor:
                    i < results.length
                      ? results[i]?.esCorrecta
                        ? '#1B9951'
                        : '#EF4444'
                      : 'rgba(38,32,25,0.1)',
                }}
              />
            ))}
          </div>

          
          <div className="text-center">
            <h1
              className="font-extrabold text-[28px] leading-tight mb-1"
              style={{ color: stationColor }}
            >
              Trivia Letra &ldquo;{estacion.letra}&rdquo;
            </h1>
          </div>

          
          <h2 className="font-bold text-[17px] text-[#262019] leading-snug m-0">
            {currentIndex + 1}) {preguntaActual.texto}
          </h2>

          
          <div className="flex flex-col gap-3">
            {preguntaActual.opciones.map((opcion, i) => {
              const isSelected = selectedOption === i;
              return (
                <div
                  key={i}
                  onClick={() => setSelectedOption(i)}
                  className={`flex items-center justify-between p-4 md:p-4.5 rounded-2xl cursor-pointer transition-all duration-200 border-2 select-none active:scale-[0.99] ${isSelected
                      ? 'border-[#1B9951] bg-[#F0FDF4] shadow-[0_4px_18px_rgba(27,153,81,0.18)] -translate-y-0.5'
                      : 'border-transparent bg-white shadow-[0_2px_8px_rgba(38,32,25,0.06)] hover:shadow-[0_4px_14px_rgba(38,32,25,0.1)] hover:-translate-y-0.5'
                    }`}
                >
                  <span
                    className={`text-[15px] leading-snug pr-3 transition-colors ${isSelected
                        ? 'font-bold text-[#166534]'
                        : 'font-medium text-[#262019]'
                      }`}
                  >
                    {opcion}
                  </span>
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border-2 transition-all duration-200 ${isSelected
                        ? 'border-[#1B9951] bg-[#1B9951] text-white scale-105'
                        : 'border-gray-200 bg-gray-50'
                      }`}
                  >
                    {isSelected && (
                      <svg
                        className="w-3.5 h-3.5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          
          <div className="mt-3">
            {renderActionButton(
              'Verificar',
              handleVerificar,
              selectedOption === null || submitting,
              submitting
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
