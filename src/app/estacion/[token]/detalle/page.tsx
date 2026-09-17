'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  resolverQr,
  getStoredEmail,
  EstacionInfo,
  fetchEstaciones,
} from '@/lib/api';

export default function EstacionDetallePage() {
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;

  const [estacion, setEstacion] = useState<EstacionInfo | null>(null);
  const [todasEstaciones, setTodasEstaciones] = useState<EstacionInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const email = getStoredEmail();
        const res = await resolverQr(token, email);
        setEstacion(res.estacion);

        const all = await fetchEstaciones();
        setTodasEstaciones(all);
      } catch (err: any) {
        setError(err.message || 'Error al cargar estación');
      } finally {
        setLoading(false);
      }
    }
    if (token) {
      load();
    }
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6">
        <div className="w-10 h-10 border-4 border-[#1B9951] border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-gray-600 text-sm">Cargando estación...</p>
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

  const otherStations = todasEstaciones.filter((s) => s.id !== estacion.id);

  return (
    <div className="min-h-[90vh] bg-[#F9FAFB] flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 md:p-7 shadow-sm border border-[rgba(38,32,25,0.08)] flex flex-col gap-4">
        <div className="flex items-center gap-3.5">
          <div
            className="w-[52px] h-[52px] rounded-full flex items-center justify-center shrink-0 shadow-md"
            style={{ backgroundColor: estacion.color_hex }}
          >
            <span className="font-extrabold text-2xl text-white leading-none">
              {estacion.letra}
            </span>
          </div>
          <div>
            <div className="font-bold text-base text-[#262019]">
              {estacion.nombre_pilar}
            </div>
            <div className="text-[13px] text-[#6b5f4e]">
              {estacion.nombre_lugar}
            </div>
          </div>
        </div>

        <div className="relative w-full h-[190px] rounded-2xl overflow-hidden shadow-inner bg-gray-100">
          <Image
            src={estacion.url_imagen || '/assets/hero-1.jpeg'}
            alt={estacion.nombre_lugar}
            fill
            className="object-cover"
            priority
          />
        </div>

        <p className="text-sm text-[#4a4033] leading-relaxed m-0">
          {estacion.descripcion}
        </p>

        <div className="mt-2">
          <div className="font-semibold text-[13px] text-[#262019] mb-2.5">
            Otros puntos del recorrido
          </div>
          <div className="flex gap-2.5 overflow-x-auto pb-2 scroll-smooth">
            {otherStations.map((other) => (
              <div
                key={other.id}
                className="flex flex-col items-center gap-1.5 shrink-0 w-[78px]"
              >
                <div className="relative w-[72px] h-[72px] rounded-xl overflow-hidden shadow-sm bg-gray-200 border border-gray-100">
                  <Image
                    src={other.url_imagen || '/assets/hero-1.jpeg'}
                    alt={other.nombre_lugar}
                    fill
                    className="object-cover"
                  />
                  <div
                    className="absolute top-1 left-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-extrabold text-white"
                    style={{ backgroundColor: other.color_hex }}
                  >
                    {other.letra}
                  </div>
                </div>
                <span className="text-[10px] text-[#6b5f4e] text-center leading-tight line-clamp-2">
                  {other.nombre_lugar}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4">
          <button
            onClick={() =>
              router.push(`/estacion/${encodeURIComponent(token)}/trivia`)
            }
            className="w-full h-14 rounded-full text-white font-bold text-base shadow-lg transition-transform active:scale-95 flex items-center justify-center"
            style={{ backgroundColor: estacion.color_hex }}
          >
            Responder trivia
          </button>
        </div>
      </div>
    </div>
  );
}
