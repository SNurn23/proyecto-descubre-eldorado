'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { registrarParticipante, registrarEscaneo } from '@/lib/api';
import ModalBases from '@/components/ModalBases';

function FormularioRegistro() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const initialEmail = searchParams.get('email') || '';

  const [nombreCompleto, setNombreCompleto] = useState('');
  const [dni, setDni] = useState('');
  const [email, setEmail] = useState(initialEmail);
  const [telefono, setTelefono] = useState('');
  const [barrio, setBarrio] = useState('');
  const [aceptoTerminos, setAceptoTerminos] = useState(false);
  const [mostrarModalBases, setMostrarModalBases] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const clearError = (field: string) => {
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};
    if (!nombreCompleto.trim()) {
      newErrors.nombreCompleto = 'Ingresá tu nombre y apellido';
    }
    if (!dni.trim()) {
      newErrors.dni = 'Ingresá tu DNI';
    }
    const emailTrimmed = email.trim().toLowerCase();
    if (!emailTrimmed) {
      newErrors.email = 'Ingresá tu correo';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailTrimmed)) {
        newErrors.email = 'Ingresá un correo válido';
      }
    }
    if (!aceptoTerminos) {
      newErrors.terminos = 'Debés aceptar las Bases y Condiciones';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    const partes = nombreCompleto.trim().split(' ');
    const nombre = partes[0] || 'Participante';
    const apellido = partes.slice(1).join(' ') || '.';

    try {
      setLoading(true);
      setErrorMsg(null);

      await registrarParticipante({
        nombre,
        apellido,
        dni: dni.trim(),
        email: email.trim().toLowerCase(),
        telefono: telefono.trim(),
        barrio: barrio.trim(),
        aceptoTerminos: true,
      });

                                                                 
      if (token) {
        try {
          await registrarEscaneo(email.trim().toLowerCase(), token);
          router.push(`/estacion/${encodeURIComponent(token)}/trivia`);
          return;
        } catch {
          router.push(`/estacion/${encodeURIComponent(token)}/trivia`);
          return;
        }
      }

      router.push('/mi-progreso');
    } catch (err: any) {
      setErrorMsg(err.message || 'Error al completar el registro');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-3xl p-7 md:p-8 shadow-sm border border-[rgba(38,32,25,0.08)] flex flex-col gap-6">
      <div className="text-center">
        <h1 className="font-extrabold text-[28px] text-[#262019] m-0">
          Registro
        </h1>
        <p className="text-sm text-[#6b5f4e] mt-1.5 mb-0 leading-relaxed">
          Necesitamos que te registres por única vez para sumar tus letras y no perder tu progreso en cada estación.
        </p>
      </div>

      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-[#BE0D00] text-sm leading-snug">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <div>
          <label className="block">
            <span className="block text-xs font-semibold text-[#262019] mb-1.5">
              Nombre y apellido *
            </span>
            <input
              type="text"
              placeholder="Ej. Ana Gómez"
              value={nombreCompleto}
              onChange={(e) => {
                setNombreCompleto(e.target.value);
                clearError('nombreCompleto');
              }}
              className={`w-full h-12 rounded-xl border-[1.5px] px-3.5 text-[15px] bg-[#fff] focus:outline-none transition-colors ${errors.nombreCompleto
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-[rgba(38,32,25,0.15)] focus:border-[#1B9951]'
                }`}
            />
          </label>
          {errors.nombreCompleto && (
            <p className="text-[#DC2626] text-xs font-semibold pl-1 mt-1 m-0 animate-fadeIn">
              {errors.nombreCompleto}
            </p>
          )}
        </div>

        <div>
          <label className="block">
            <span className="block text-xs font-semibold text-[#262019] mb-1.5">
              DNI *
            </span>
            <input
              type="text"
              placeholder="Ej. 30123456"
              value={dni}
              onChange={(e) => {
                setDni(e.target.value);
                clearError('dni');
              }}
              className={`w-full h-12 rounded-xl border-[1.5px] px-3.5 text-[15px] bg-[#fff] focus:outline-none transition-colors ${errors.dni
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-[rgba(38,32,25,0.15)] focus:border-[#1B9951]'
                }`}
            />
          </label>
          {errors.dni && (
            <p className="text-[#DC2626] text-xs font-semibold pl-1 mt-1 m-0 animate-fadeIn">
              {errors.dni}
            </p>
          )}
        </div>

        <div>
          <label className="block">
            <span className="block text-xs font-semibold text-[#262019] mb-1.5">
              Correo electrónico *
            </span>
            <input
              type="email"
              placeholder="tu@correo.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                clearError('email');
              }}
              className={`w-full h-12 rounded-xl border-[1.5px] px-3.5 text-[15px] bg-[#fff] focus:outline-none transition-colors ${errors.email
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-[rgba(38,32,25,0.15)] focus:border-[#1B9951]'
                }`}
            />
          </label>
          {errors.email && (
            <p className="text-[#DC2626] text-xs font-semibold pl-1 mt-1 m-0 animate-fadeIn">
              {errors.email}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="block">
            <span className="block text-xs font-semibold text-[#262019] mb-1.5">
              Teléfono / Celular
            </span>
            <input
              type="tel"
              placeholder="Ej. 03751 123456"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              className="w-full h-12 rounded-xl border-[1.5px] border-[rgba(38,32,25,0.15)] px-3.5 text-[15px] bg-[#fff] focus:border-[#1B9951] focus:outline-none transition-colors"
            />
          </label>

          <label className="block">
            <span className="block text-xs font-semibold text-[#262019] mb-1.5">
              Barrio
            </span>
            <input
              type="text"
              placeholder="Ej. Centro / Km 9"
              value={barrio}
              onChange={(e) => setBarrio(e.target.value)}
              className="w-full h-12 rounded-xl border-[1.5px] border-[rgba(38,32,25,0.15)] px-3.5 text-[15px] bg-[#fff] focus:border-[#1B9951] focus:outline-none transition-colors"
            />
          </label>
        </div>

        <div>
          <label className="flex items-start gap-2.5 mt-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={aceptoTerminos}
              onChange={(e) => {
                setAceptoTerminos(e.target.checked);
                clearError('terminos');
              }}
              className="w-5 h-5 mt-0.5 shrink-0 rounded border-gray-300 text-[#1B9951] focus:ring-[#1B9951]"
            />
            <span className="text-[13px] text-[#4a4033] leading-snug">
              Declaro ser mayor de edad (o contar con autorización) y acepto las{' '}
              <button
                type="button"
                onClick={() => setMostrarModalBases(true)}
                className="text-[#197084] font-semibold underline hover:text-[#1B9951] inline p-0 bg-transparent border-none cursor-pointer"
              >
                Bases y Condiciones
              </button>{' '}
              del concurso.
            </span>
          </label>
          {errors.terminos && (
            <p className="text-[#DC2626] text-xs font-semibold pl-1 mt-1.5 m-0 animate-fadeIn">
              {errors.terminos}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full h-14 rounded-full bg-[#111827] hover:bg-[#1f2937] text-white font-bold text-base shadow-md transition-all active:scale-95 disabled:opacity-45 disabled:cursor-not-allowed mt-3 flex items-center justify-center cursor-pointer"
        >
          {loading ? 'Registrando...' : 'Registrarme'}
        </button>
      </form>

      
      <ModalBases
        estaAbierto={mostrarModalBases}
        alCerrar={() => setMostrarModalBases(false)}
      />
    </div>
  );
}

export default function RegistroPage() {
  return (
    <div className="min-h-[85vh] bg-[#F9FAFB] flex flex-col items-center justify-center px-6 py-10">
      <div className="w-full flex flex-col items-center">
        <Suspense
          fallback={
            <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-sm flex flex-col items-center justify-center min-h-[300px]">
              <div className="w-8 h-8 border-4 border-[#1B9951] border-t-transparent rounded-full animate-spin mb-2" />
              <span className="text-xs text-gray-500">Cargando formulario...</span>
            </div>
          }
        >
          <FormularioRegistro />
        </Suspense>
      </div>
    </div>
  );
}
