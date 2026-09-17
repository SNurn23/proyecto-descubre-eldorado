'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  resolverQr,
  registrarEscaneo,
  getStoredEmail,
  setStoredEmail,
  EstacionInfo,
} from '@/lib/api';
import { Sparkles, Mail, ArrowRight, Compass, Check } from 'lucide-react';

                                                                                
const COLORES_POR_ORDEN: Record<number, { main: string; light: string }> = {
  1: { main: '#16984A', light: '#22C55E' },                                           
  2: { main: '#2B8487', light: '#38A3A5' },                                        
  3: { main: '#197084', light: '#228FA8' },                                                  
  4: { main: '#419372', light: '#52B788' },                                      
  5: { main: '#385F18', light: '#4F8322' },                                                   
  6: { main: '#EB9301', light: '#FBBF24' },                                                  
  7: { main: '#DA3501', light: '#F97316' },                                            
  8: { main: '#BE0D00', light: '#EF4444' },                                           
};

export default function EstacionTokenPage() {
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;

  const [estacion, setEstacion] = useState<EstacionInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [inputEmail, setInputEmail] = useState('');
  const [errorEmail, setErrorEmail] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [yaEscaneada, setYaEscaneada] = useState(false);

  useEffect(() => {
    const email = getStoredEmail();
    if (email) setInputEmail(email);

    async function load() {
      try {
        setLoading(true);
        const res = await resolverQr(token, email);
        setEstacion(res.estacion);

                                                  
        const configColor = COLORES_POR_ORDEN[res.estacion.orden] || {
          main: res.estacion.tema_visual?.accentMain || res.estacion.color_hex || '#16984A',
          light: res.estacion.tema_visual?.accentLight || '#22C55E',
        };

                                                           
        setTimeout(async () => {
          try {
            const confettiModule = await import('canvas-confetti');
            const fireConfetti = (confettiModule as any).default || confettiModule;
            fireConfetti({
              particleCount: 90,
              spread: 65,
              origin: { y: 0.5 },
              colors: [configColor.main, configColor.light, '#FFD700', '#FFFFFF'],
              disableForReducedMotion: true,
            });
          } catch (e) {
            console.error('Error al lanzar confeti:', e);
          }
        }, 300);
      } catch (err: any) {
        setError(err.message || 'Código QR no reconocido');
      } finally {
        setLoading(false);
      }
    }
    if (token) {
      load();
    }
  }, [token]);

  const handleContinuar = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailToUse = inputEmail.trim().toLowerCase();
    if (!emailToUse) {
      setErrorEmail('Ingresá tu correo');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailToUse)) {
      setErrorEmail('Ingresá un correo válido');
      return;
    }

    setErrorEmail(null);

    try {
      setSubmitting(true);
      setStoredEmail(emailToUse);

      const verificacion = await resolverQr(token, emailToUse);
      if (verificacion.participanteEncontrado && verificacion.yaEscaneada) {
        setYaEscaneada(true);
        return;
      }

      await registrarEscaneo(emailToUse, token);
      router.push(`/estacion/${encodeURIComponent(token)}/trivia`);
    } catch (err: any) {
      if (
        err.message &&
        (err.message.includes('completá tu registro') ||
          err.message.includes('no registrado') ||
          err.message.includes('Participante no registrado'))
      ) {
        router.push(
          `/registro?token=${encodeURIComponent(token)}&email=${encodeURIComponent(emailToUse)}`,
        );
      } else {
        setErrorEmail(err.message || 'Error al validar el correo');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-12 h-12 border-4 border-[#1B9951] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-gray-600 font-medium">Cargando estación...</p>
      </div>
    );
  }

  if (error || !estacion) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto">
        <div className="w-16 h-16 rounded-full bg-red-100 text-[#BE0D00] flex items-center justify-center text-2xl font-bold mb-4">
          !
        </div>
        <h1 className="text-2xl font-bold text-[#262019] mb-2">
          Estación no encontrada
        </h1>
        <p className="text-[#6b5f4e] mb-6">
          {error || 'El código QR no pertenece a un punto activo del concurso.'}
        </p>
        <button
          onClick={() => router.push('/')}
          className="bg-[#262019] text-white px-6 py-2.5 rounded-full font-semibold"
        >
          Volver al inicio
        </button>
      </div>
    );
  }

  const configColor = COLORES_POR_ORDEN[estacion.orden] || {
    main: estacion.tema_visual?.accentMain || estacion.color_hex || '#16984A',
    light: estacion.tema_visual?.accentLight || '#22C55E',
  };
  const colorBase = configColor.main;
  const colorSecondary = configColor.light;

  return (
    <div className="relative min-h-[88vh] flex flex-col items-center justify-center px-4 py-10 overflow-hidden">
      <div className="w-full max-w-[480px] relative animate-fadeIn">
        
        <div
          className="absolute -top-12 -left-12 w-64 h-64 rounded-full blur-3xl opacity-30 pointer-events-none"
          style={{ backgroundColor: colorBase }}
        />
        <div
          className="absolute -bottom-12 -right-12 w-64 h-64 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ backgroundColor: colorBase }}
        />

        
        <form
          onSubmit={handleContinuar}
          noValidate
          className="relative bg-white/95 backdrop-blur-md rounded-[36px] p-8 sm:p-10 border border-[rgba(38,32,25,0.12)] shadow-[0_20px_50px_rgba(0,0,0,0.06)] flex flex-col items-center text-center gap-6"
        >
          
          <div className="relative my-2 w-36 h-36 flex items-center justify-center">
            
            <div
              className="absolute inset-0 rounded-full animate-spin pointer-events-none"
              style={{
                border: `3px dashed ${colorBase}85`,
                animationDuration: '12s',
              }}
            />

            
            <div
              className="absolute inset-2 rounded-full pointer-events-none"
              style={{
                background: `linear-gradient(135deg, ${colorBase}25 0%, ${colorBase}08 100%)`,
              }}
            />

            
            <div
              className="relative z-10 w-28 h-28 rounded-full flex items-center justify-center shadow-md transition-transform hover:scale-105 select-none p-4"
              style={{
                background: `linear-gradient(135deg, ${colorBase} 0%, ${colorSecondary} 100%)`,
              }}
            >
              <Image
                src={`/assets/letters/white/letter-${estacion.orden}-${estacion.letra.toLowerCase()}-white.png`}
                alt={`Letra ${estacion.letra}`}
                width={80}
                height={80}
                className="w-12 h-12 object-contain select-none pointer-events-none drop-shadow-[0_2px_6px_rgba(0,0,0,0.12)]"
                priority
              />
            </div>
          </div>

          
          <div className="flex flex-col gap-1.5">
            <h1 className="font-black text-3xl sm:text-[32px] text-[#162438] m-0 leading-tight tracking-tight">
              ¡Descubriste la letra "{estacion.letra}"!
            </h1>
            <p className="text-sm sm:text-base text-[#6b5f4e] m-0 leading-relaxed max-w-[320px] mx-auto">
              Ingresá tu correo para sumar esta letra a tu progreso.
            </p>
          </div>

          
          <div className="w-full flex flex-col gap-1.5">
            <div className="w-full relative">
              <Mail className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="email"
                value={inputEmail}
                onChange={(e) => {
                  setInputEmail(e.target.value);
                  if (errorEmail) setErrorEmail(null);
                  setYaEscaneada(false);
                }}
                placeholder="Ingresá tu correo"
                className={`w-full h-14 rounded-2xl border-[1.5px] pl-12 pr-4 text-base bg-white text-left focus:outline-none transition-all shadow-inner ${
                  errorEmail
                    ? 'border-red-500 focus:border-red-500'
                    : 'border-gray-200'
                }`}
                onFocus={(e) => {
                  if (!errorEmail) {
                    e.target.style.borderColor = colorBase;
                    e.target.style.boxShadow = `0 0 0 4px ${colorBase}25`;
                  }
                }}
                onBlur={(e) => {
                  if (!errorEmail) {
                    e.target.style.borderColor = '#e5e7eb';
                    e.target.style.boxShadow = 'none';
                  }
                }}
              />
            </div>
            {errorEmail && (
              <p className="text-[#DC2626] text-xs sm:text-[13px] font-semibold text-left pl-3.5 m-0 animate-fadeIn">
                {errorEmail}
              </p>
            )}
          </div>

          {yaEscaneada && (
            <div
              role="alert"
              className="w-full rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-left"
            >
              <div className="flex items-start gap-3">
                <Check className="mt-0.5 h-5 w-5 shrink-0 text-[#1B9951]" />
                <div>
                  <p className="m-0 text-sm font-bold text-[#166534]">
                    Ya habías escaneado esta letra
                  </p>
                  <p className="mt-1.5 mb-0 text-xs leading-relaxed text-[#3f654c]">
                    No la sumamos otra vez. Podés consultar todas tus letras y respuestas en tu progreso.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => router.push('/mi-progreso')}
                className="mt-3 flex h-11 w-full items-center justify-center rounded-full bg-[#1B9951] text-sm font-bold text-white transition-colors hover:bg-[#147a40]"
              >
                Ver mi progreso
              </button>
            </div>
          )}

          {!yaEscaneada && (
            <>
              
              <button
                type="submit"
                disabled={submitting || !inputEmail.trim()}
                className="w-full h-14 rounded-full text-white font-bold text-base transition-all duration-200 active:scale-95 flex items-center justify-center gap-2.5 group disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-md hover:opacity-95"
                style={{
                  background: `linear-gradient(135deg, ${colorBase} 0%, ${colorSecondary} 100%)`,
                  boxShadow: submitting || !inputEmail.trim() ? undefined : `0 4px 18px ${colorBase}4D`,
                }}
              >
                <span>{submitting ? 'Verificando...' : 'Continuar'}</span>
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
