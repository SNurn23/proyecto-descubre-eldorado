'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ModalBases from './ModalBases';

export default function Footer() {
  const [mostrarModalBases, setMostrarModalBases] = useState(false);

  return (
    <footer className="bg-[#F3F4F6] text-[#262019] px-[clamp(20px,4vw,56px)] pt-[clamp(48px,6vw,72px)] pb-7 mt-4 border-t border-[rgba(38,32,25,0.08)]">
      <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-[rgba(38,32,25,0.1)]">
        <div className="flex flex-col gap-3.5">
          <div className="flex items-center gap-4 flex-wrap">
            <Image
              src="/assets/shield-logo.png"
              alt="Escudo Municipalidad de Eldorado"
              width={64}
              height={64}
              className="h-16 w-auto object-contain"
            />
            <Image
              src="/assets/municipal-logo.png"
              alt="Eldorado, Avancemos juntos"
              width={160}
              height={52}
              className="h-[52px] w-auto object-contain"
            />
          </div>
          <p className="m-0 text-sm text-[rgba(38,32,25,0.65)] leading-relaxed">
            Un concurso de gamificación urbana de la Municipalidad de Eldorado, Misiones. Recorré nuestra ciudad, descubrí su patrimonio y ganá premios.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <span className="font-semibold text-xs tracking-wider uppercase text-[rgba(38,32,25,0.5)]">
            Contacto
          </span>
          <span className="text-sm text-[rgba(38,32,25,0.85)]">
            Simón J. Bolívar N° 73, Eldorado, Misiones.
          </span>
          <span className="text-sm text-[rgba(38,32,25,0.85)]">
            (+54) 03751 - 421787
          </span>
          <span className="text-sm text-[rgba(38,32,25,0.85)]">
            gobierno@eldorado.gob.ar
          </span>
          <span className="text-sm text-[rgba(38,32,25,0.65)]">
            Lunes a viernes de 7:00 a 12:00
          </span>
        </div>

        <div className="flex flex-col gap-2">
          <span className="font-semibold text-xs tracking-wider uppercase text-[rgba(38,32,25,0.5)]">
            Redes oficiales
          </span>
          <a
            href="https://www.instagram.com/munieldorado/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 text-sm text-[rgba(38,32,25,0.85)] hover:text-[#E1306C] transition-colors group"
          >
            <span className="flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] shrink-0 text-white group-hover:scale-110 transition-transform shadow-xs">
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </span>
            @munieldorado
          </a>
          <a
            href="https://x.com/munieldorado"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 text-sm text-[rgba(38,32,25,0.85)] hover:text-[#000000] transition-colors group"
          >
            <span className="flex items-center justify-center w-7 h-7 rounded-full bg-[#000000] shrink-0 text-white group-hover:scale-110 transition-transform shadow-xs">
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </span>
            @munieldorado
          </a>
          <a
            href="https://www.facebook.com/search/pages/?q=Municipalidad%20de%20Eldorado%20Misiones"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 text-sm text-[rgba(38,32,25,0.85)] hover:text-[#1877F2] transition-colors group"
          >
            <span className="flex items-center justify-center w-7 h-7 rounded-full bg-[#1877F2] shrink-0 text-white group-hover:scale-110 transition-transform shadow-xs">
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </span>
            Municipalidad de Eldorado
          </a>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto mt-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[rgba(38,32,25,0.45)]">
        <p className="m-0">
          © 2026 Municipalidad de Eldorado - Descubre Eldorado. Todos los derechos reservados.
        </p>
        <button
          type="button"
          onClick={() => setMostrarModalBases(true)}
          className="hover:underline hover:text-[#162438] transition-colors cursor-pointer bg-transparent border-none p-0 text-xs text-[rgba(38,32,25,0.65)] font-medium"
        >
          Bases y Condiciones
        </button>
      </div>

      <ModalBases
        estaAbierto={mostrarModalBases}
        alCerrar={() => setMostrarModalBases(false)}
      />
    </footer>
  );
}
