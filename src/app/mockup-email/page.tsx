import Link from 'next/link';

export const metadata = {
  title: 'Mockup Correo de Bienvenida - Descubre Eldorado',
  description: 'Previsualización del correo electrónico de bienvenida del concurso Descubre Eldorado',
};

export default function MockupEmailPage() {
  return (
    <div className="min-h-screen bg-[#EFEBE4] py-8 px-4 flex flex-col items-center">
      {/* Barra superior de navegación / contexto */}
      <div className="w-full max-w-[620px] mb-6 flex items-center justify-between bg-white/90 backdrop-blur-md px-5 py-3.5 rounded-2xl shadow-sm border border-[rgba(38,32,25,0.08)]">
        <div>
          <span className="text-xs font-bold text-[#1B9951] uppercase tracking-wider block">
            Mockup Oficial
          </span>
          <h1 className="text-base font-extrabold text-[#262019]">
            Correo de Bienvenida
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="/email-bienvenida.html"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold bg-[#1B9951] hover:bg-[#158040] text-white px-3.5 py-2 rounded-xl transition-all shadow-sm flex items-center gap-1.5"
          >
            Abrir HTML ↗
          </a>
          <Link
            href="/"
            className="text-xs font-bold text-[#5C5245] hover:text-[#262019] bg-[#F4F3EF] px-3.5 py-2 rounded-xl transition-all"
          >
            Volver
          </Link>
        </div>
      </div>

      {/* Contenedor del Mockup del Email */}
      <div className="w-full max-w-[620px] rounded-3xl overflow-hidden shadow-2xl border border-[rgba(38,32,25,0.1)] bg-[#F4F3EF]">
        <iframe
          src="/email-bienvenida.html"
          title="Vista previa del correo de bienvenida"
          className="w-full h-[780px] border-0"
        />
      </div>

      <p className="mt-4 text-xs text-[#8C7E6C] text-center max-w-[500px]">
        Este es el diseño oficial que reciben los participantes en su bandeja de entrada al completar el formulario de registro.
      </p>
    </div>
  );
}
