'use client';

import { useEffect } from 'react';

interface PropiedadesModalBases {
  estaAbierto: boolean;
  alCerrar: () => void;
}

export default function ModalBases({ estaAbierto, alCerrar }: PropiedadesModalBases) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') alCerrar();
    };

    if (estaAbierto) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [estaAbierto, alCerrar]);

  if (!estaAbierto) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs animate-fadeIn"
      onClick={alCerrar}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="relative w-full max-w-3xl max-h-[90vh] bg-white rounded-3xl shadow-2xl border-2 border-[#E5E0D8] flex flex-col overflow-hidden animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-md px-6 sm:px-8 py-5 border-b border-gray-100">
          <h2 className="text-xl sm:text-2xl font-black text-[#162438] m-0 leading-snug">
            Bases y Condiciones Oficiales
          </h2>
          <p className="text-xs sm:text-sm text-[#6b5f4e] font-medium m-0 mt-0.5">
            Concurso de Identidad Urbana &ldquo;Descubre Eldorado&rdquo; - Municipalidad de Eldorado, Misiones
          </p>
        </div>

        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-sm text-[#4a4033] leading-relaxed">
          <section>
            <h3 className="text-base font-bold text-[#162438] mb-1.5">
              1. Introducción y Presentación
            </h3>
            <p className="m-0">
              La <strong>Municipalidad de Eldorado</strong> convoca a la comunidad a participar en el concurso de identidad urbana <strong>&ldquo;Descubre Eldorado&rdquo;</strong>. Esta iniciativa busca poner en valor los puntos estratégicos, históricos, culturales y naturales que conforman la esencia de nuestra ciudad, promoviendo el sentido de pertenencia, el conocimiento local y la participación ciudadana a través de un recorrido interactivo por el espacio urbano.
            </p>
          </section>

          <section>
            <h3 className="text-base font-bold text-[#162438] mb-1.5">
              2. Ámbito y Participantes (Público Objetivo)
            </h3>
            <ul className="list-disc pl-5 space-y-1.5 m-0">
              <li>
                <strong>Carácter abierto:</strong> El concurso es abierto a todo público. Podrán participar residentes de la ciudad de Eldorado y visitantes, sin límite de edad.
              </li>
              <li>
                <strong>Modalidad:</strong> La participación puede ser individual o en equipos. Los menores de edad deberán contar con la debida autorización o representación de un adulto responsable.
              </li>
            </ul>
          </section>

          <section>
            <h3 className="text-base font-bold text-[#162438] mb-1.5">
              3. Mecánica del Recorrido y Letras
            </h3>
            <p className="mb-2.5">
              El concurso consiste en la recolección y validación de las 8 letras que componen el acrónimo oficial de la ciudad (<strong>E-L-D-O-R-A-D-O</strong>), vinculadas a sus respectivos puntos de identidad:
            </p>
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-medium">
              <div>• <strong>E</strong> – Espíritu Emprendedor (Casa del Fundador)</div>
              <div>• <strong>L</strong> – Legado Histórico (Museo CEEL)</div>
              <div>• <strong>D</strong> – Diversidad Cultural (Plazoleta de las Naciones)</div>
              <div>• <strong>O</strong> – Orígenes (Plaza San Martín)</div>
              <div>• <strong>R</strong> – Río Paraná (Costanera Sur)</div>
              <div>• <strong>A</strong> – Actividad Agroindustrial (Rotonda RN 12)</div>
              <div>• <strong>D</strong> – Destino Recreativo (Aeroclub Eldorado)</div>
              <div>• <strong>O</strong> – Observatorio Natural (Salto Küppers)</div>
            </div>
            <p className="mt-2.5 mb-0">
              Junto con la recolección de las letras mediante escaneo del código QR físico, los participantes responderán preguntas de trivia relacionadas con la historia, patrimonio y cultura de Eldorado.
            </p>
          </section>

          <section>
            <h3 className="text-base font-bold text-[#162438] mb-1.5">
              4. Premios y Categorías de Adjudicación
            </h3>
            <ul className="list-disc pl-5 space-y-2 m-0">
              <li>
                <strong>Premio Mayor:</strong> Requisitos excluyentes: 1) Haber recolectado las 8 letras de la palabra ELDORADO, y 2) Haber respondido correctamente el 100% de las preguntas del recorrido. Si existe un único participante con este logro, se le adjudica de forma directa. En caso de múltiples participantes con 100% de requisitos, el ganador se seleccionará mediante sorteo público oficial.
              </li>
              <li>
                <strong>Premios Menores por Acumulación de Letras:</strong>
                <ul className="list-circle pl-5 mt-1.5 space-y-1">
                  <li><strong>Categoría Avanzada:</strong> Participantes con 6 a 7 letras + alto porcentaje de aciertos (Voucher oficial).</li>
                  <li><strong>Categoría Intermedia:</strong> Participantes con 4 a 5 letras (Pin oficial del concurso).</li>
                  <li><strong>Categoría Inicial / Participación:</strong> Participantes con 1 a 3 letras (Lápiz con semillas).</li>
                </ul>
              </li>
            </ul>
          </section>

          <section>
            <h3 className="text-base font-bold text-[#162438] mb-1.5">
              5. Inhabilidades e Incompatibilidades
            </h3>
            <p className="m-0">
              No podrán participar para la obtención de premios los miembros del comité organizador, autoridades de la Municipalidad de Eldorado, miembros del jurado o comité evaluador, ni aquellas personas que tengan parentesco hasta segundo grado de consanguinidad o afinidad con los mismos.
            </p>
          </section>

          <section>
            <h3 className="text-base font-bold text-[#162438] mb-1.5">
              6. Exención de Responsabilidad y Accidentes
            </h3>
            <p className="m-0">
              La <strong>Municipalidad de Eldorado</strong> y la organización del concurso no se hacen responsables por ningún tipo de accidente, lesión, daño físico, material o de cualquier índole que los participantes o terceros pudieran sufrir durante los desplazamientos o visitas presenciales a los puntos del recorrido. La participación es estrictamente voluntaria.
            </p>
          </section>

          <section>
            <h3 className="text-base font-bold text-[#162438] mb-1.5">
              7. Notificación y Entrega de Premios
            </h3>
            <p className="m-0">
              Los ganadores serán contactados oficialmente por los canales registrados (correo y teléfono). Para retirar los premios será requisito indispensable presentar el Documento Nacional de Identidad (DNI) físico vigente. Los premios no son canjeables por dinero en efectivo.
            </p>
          </section>

          <section>
            <h3 className="text-base font-bold text-[#162438] mb-1.5">
              8. Aceptación de las Bases
            </h3>
            <p className="m-0">
              La inscripción y participación en el concurso implica el conocimiento y total aceptación de estas bases y condiciones oficiales. Cualquier situación imprevista será resuelta de manera inapelable por la Municipalidad de Eldorado.
            </p>
          </section>
        </div>

        <div className="sticky bottom-0 bg-gray-50/95 backdrop-blur-md px-6 py-4 border-t border-gray-100 flex items-center justify-end">
          <button
            type="button"
            onClick={alCerrar}
            className="bg-[#221F1B] hover:bg-[#423C36] text-white font-semibold text-sm px-6 py-2.5 rounded-full shadow-sm transition-all cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
