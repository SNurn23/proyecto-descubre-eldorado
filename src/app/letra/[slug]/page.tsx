'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, MapPin, Loader2 } from 'lucide-react';
import { fetchEstacionBySlug, EstacionInfo } from '@/lib/api';
import PatronLetraHero from '@/components/PatronLetraHero';

export default function LetraDetallePage() {
  const params = useParams();
  const slug = params.slug as string;

  const [estacion, setEstacion] = useState<EstacionInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchEstacionBySlug(slug);
        setEstacion(data);
      } catch (err: any) {
        setError(err.message || 'No se pudo cargar la información de la letra');
      } finally {
        setLoading(false);
      }
    }
    if (slug) {
      load();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
        <Loader2 className="w-10 h-10 text-[#16984A] animate-spin mb-3" />
        <p className="text-[#6b5f4e] text-sm font-medium">Cargando detalle...</p>
      </div>
    );
  }

  if (error || !estacion) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-xl font-bold text-[#262019] mb-2">Letra no encontrada</h1>
        <p className="text-gray-600 text-sm max-w-md mb-6">{error || 'La estación no está disponible.'}</p>
        <Link
          href="/#letras"
          className="inline-flex items-center gap-2 bg-[#221F1B] text-white px-6 py-2.5 rounded-full text-sm font-semibold"
        >
          <ArrowLeft size={16} /> Volver
        </Link>
      </div>
    );
  }

  const mapUrl =
    estacion.latitud && estacion.longitud
      ? `https://www.google.com/maps/search/?api=1&query=${estacion.latitud},${estacion.longitud}`
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${estacion.nombre_lugar}, Eldorado, Misiones`)}`;
  const theme = estacion.tema_visual || {
    bgDark: '#123824',
    accentLight: '#34D399',
    accentMain: estacion.color_hex || '#1B9951',
    cardBgTint: 'rgba(27, 153, 81, 0.08)',
    patron: 'puntos',
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-[#262019] py-6 sm:py-8 px-4 sm:px-6 md:px-8">
      <div className="max-w-[1140px] mx-auto">
        <div className="mb-6">
          <Link
            href="/#letras"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white border border-[#E5E0D8] text-[#262019] text-xs sm:text-sm font-semibold shadow-[2px_2.5px_6px_rgba(38,32,25,0.10)] hover:shadow-[3px_3.5px_10px_rgba(38,32,25,0.15)] hover:bg-gray-50 hover:!text-black hover:border-gray-300 transition-all duration-200"
          >
            <ArrowLeft size={15} className="text-current" />
            <span className="text-current">Volver</span>
          </Link>
        </div>

        <section
          className="relative rounded-[24px] sm:rounded-[32px] p-5 sm:p-8 lg:p-12 text-white overflow-hidden shadow-[2px_2.5px_6px_rgba(38,32,25,0.10)] mb-8 sm:mb-12 lg:mb-16 transition-colors duration-300"
          style={{ backgroundColor: theme.bgDark }}
        >
          <div className="flex flex-row items-center gap-5 sm:gap-8 md:gap-10 lg:gap-12">
            {/* Letra con patrón variado y outline */}
            <div className="shrink-0 flex items-center justify-center select-none">
              <div className="relative w-[85px] h-[85px] sm:w-[115px] sm:h-[115px] md:w-[175px] md:h-[175px] lg:w-[215px] lg:h-[215px] flex items-center justify-center">
                {/* Relleno con patrón de puntos/líneas/ondas/zigzag enmascarado en la silueta de la letra */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    WebkitMaskImage: `url(/assets/letters/white/letter-${estacion.orden}-${estacion.letra.toLowerCase()}-white.png)`,
                    maskImage: `url(/assets/letters/white/letter-${estacion.orden}-${estacion.letra.toLowerCase()}-white.png)`,
                    WebkitMaskSize: 'contain',
                    maskSize: 'contain',
                    WebkitMaskRepeat: 'no-repeat',
                    maskRepeat: 'no-repeat',
                    WebkitMaskPosition: 'center',
                    maskPosition: 'center',
                  }}
                >
                  <PatronLetraHero
                    orden={estacion.orden}
                    color={theme.accentLight}
                  />
                </div>

                <Image
                  src={`/assets/letters/outline/letter-${estacion.orden}-${estacion.letra.toLowerCase()}-outline.png`}
                  alt={`Letra ${estacion.letra} - ${estacion.nombre_pilar}`}
                  width={260}
                  height={260}
                  className="relative z-10 w-full h-full object-contain filter drop-shadow-[0_4px_14px_rgba(255,255,255,0.25)] select-none pointer-events-none"
                  priority
                />
              </div>
            </div>

            
            <div className="flex-1 min-w-0">
              
              <div
                className="font-serif italic text-base sm:text-xl lg:text-2xl mb-0.5 sm:mb-1 select-none"
                style={{ color: theme.accentLight }}
              >
                es
              </div>

              
              <h1 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-black uppercase tracking-wide text-white m-0 leading-tight break-words">
                {estacion.nombre_pilar}
              </h1>

              
              <div
                className="w-8 sm:w-10 md:w-12 h-0.5 sm:h-1 rounded-full mt-1.5 sm:mt-2.5 mb-2.5 sm:mb-4"
                style={{ backgroundColor: theme.accentLight }}
              />

              
              <p className="text-white/90 italic text-xs sm:text-[13.5px] md:text-[15px] leading-relaxed m-0 font-normal">
                {estacion.manifiesto || estacion.descripcion}
              </p>
            </div>
          </div>
        </section>

        
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-center mb-10 sm:mb-16 lg:mb-20">
          
          <div className="lg:col-span-6">
            <div className="relative">
              
              <div className="relative w-full h-[220px] sm:h-[280px] lg:h-[320px] rounded-2xl sm:rounded-3xl overflow-hidden border-2 border-[#E5E0D8] shadow-[2px_2.5px_6px_rgba(38,32,25,0.10)] hover:shadow-[3px_3.5px_10px_rgba(38,32,25,0.15)] bg-[#EBF4EE] transition-all duration-200">
                <Image
                  src={estacion.url_imagen || `/assets/hero-${estacion.orden || 1}.jpeg`}
                  alt={estacion.nombre_lugar}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>

          
          <div className="lg:col-span-6 flex flex-col justify-center">
            <h2 className="text-xl sm:text-3xl font-extrabold text-[#162438] mb-2 sm:mb-3 leading-snug">
              {estacion.nombre_lugar}
            </h2>

            <p className="text-xs sm:text-[15px] text-[#4a4033] leading-relaxed mb-3 sm:mb-4">
              {estacion.descripcion}
            </p>

            <div className="flex items-center gap-1.5 text-xs sm:text-sm text-[#6b5f4e] font-medium mb-5 sm:mb-6">
              <MapPin size={16} className="text-[#6b5f4e] shrink-0" />
              <span>
                {estacion.zona
                  ? `${estacion.zona}, Eldorado, Misiones`
                  : 'Eldorado, Misiones'}
              </span>
            </div>

            <div className="pt-2 flex justify-center">
              <a
                href={mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center bg-[#221F1B] hover:!bg-[#423C36] text-white hover:!text-white font-semibold text-sm px-8 py-2.5 rounded-full shadow-[2px_2.5px_6px_rgba(38,32,25,0.10)] hover:shadow-[3px_3.5px_10px_rgba(38,32,25,0.15)] transition-all duration-200 w-full sm:w-auto text-center active:scale-95"
              >
                Cómo llegar
              </a>
            </div>
          </div>
        </section>

        
        {estacion.sitios_relacionados && estacion.sitios_relacionados.length > 0 && (
          <section className="mb-12 sm:mb-16">
            
            <div className="flex items-center gap-3 text-xs font-black uppercase tracking-[0.2em] mb-2.5">
              <span style={{ color: theme.accentMain }}>Explorá más</span>
              <span
                className="flex-1 h-[2px] max-w-[160px] rounded-full"
                style={{
                  background: `linear-gradient(to right, ${theme.accentMain} 0%, ${theme.accentMain}00 100%)`,
                }}
              />
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#162438] mb-6">
              Otros espacios de {estacion.nombre_pilar} en la ciudad
            </h3>

            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              {estacion.sitios_relacionados.map((sitio, idx) => {
                const sitioNombre = typeof sitio === 'string' ? sitio : sitio.nombre;
                const subtitulo =
                  typeof sitio === 'string'
                    ? 'Espacio de identidad comunitaria'
                    : sitio.subtitulo || 'Espacio de identidad comunitaria';
                const imagenUrl = typeof sitio === 'string' ? undefined : sitio.url_imagen;

                return (
                  <div
                    key={idx}
                    className="relative h-44 sm:h-48 rounded-2xl sm:rounded-3xl overflow-hidden border-2 border-[#E5E0D8] shadow-[2px_2.5px_6px_rgba(38,32,25,0.10)] hover:shadow-[3px_3.5px_10px_rgba(38,32,25,0.15)] hover:border-[rgba(38,32,25,0.22)] hover:-translate-y-0.5 flex flex-col justify-end p-4 sm:p-5 group transition-all duration-200"
                    style={
                      !imagenUrl
                        ? {
                            background: `
                              linear-gradient(to top, rgba(0, 0, 0, 0.75) 0%, rgba(0, 0, 0, 0.25) 55%, transparent 100%),
                              repeating-linear-gradient(45deg, transparent, transparent 12px, ${theme.cardBgTint} 12px, ${theme.cardBgTint} 24px),
                              #EAF4EE
                            `,
                          }
                        : undefined
                    }
                  >
                    {imagenUrl && (
                      <>
                        <Image
                          src={imagenUrl}
                          alt={sitioNombre}
                          fill
                          className="object-cover grayscale contrast-[1.08] brightness-95 transition-all duration-500 group-hover:scale-105"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        />
                        
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10 pointer-events-none" />
                      </>
                    )}

                    <div className="relative z-10">
                      <div className="text-white font-extrabold text-sm sm:text-base leading-snug drop-shadow-md mb-1">
                        {sitioNombre}
                      </div>
                      <div className="text-white/90 text-xs leading-tight drop-shadow-sm font-normal">
                        {subtitulo}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
