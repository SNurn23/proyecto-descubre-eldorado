'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, X, ArrowLeft } from 'lucide-react';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

                                       
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    setMobileMenuOpen(false);
    if (pathname === '/') {
      e.preventDefault();
      const el = document.getElementById(targetId);
      if (el) {
        const headerHeight = 68;
        const rect = el.getBoundingClientRect();
        const elementHeight = rect.height;
        const windowHeight = window.innerHeight;

        let targetScrollY: number;

        if (elementHeight < windowHeight - headerHeight) {
          const availableSpace = windowHeight - headerHeight;
          const offsetInsideVisible = (availableSpace - elementHeight) / 2;
          targetScrollY = window.scrollY + rect.top - headerHeight - offsetInsideVisible;
        } else {
          targetScrollY = window.scrollY + rect.top - (headerHeight + 16);
        }

        window.scrollTo({
          top: Math.max(0, targetScrollY),
          behavior: 'smooth',
        });

        window.history.pushState(null, '', `#${targetId}`);
      }
    }
  };

  const isFlujoParticipacion =
    pathname.startsWith('/estacion') ||
    pathname.startsWith('/registro') ||
    pathname.startsWith('/mi-progreso');

  return (
    <header className="sticky top-0 z-50 bg-[rgba(249,250,251,0.95)] backdrop-blur-md border-b border-[rgba(38,32,25,0.08)]">
      <div className="max-w-[1360px] mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-10 py-2 sm:py-2.5">
        
        <Link href="/" className="flex items-center">
          <Image
            src="/assets/municipal-logo.png"
            alt="Municipalidad de Eldorado"
            width={180}
            height={48}
            className="h-9 sm:h-11 md:h-12 w-auto object-contain"
            priority
          />
        </Link>

        
        {isFlujoParticipacion ? (
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-4 py-1.5 sm:py-2 rounded-full bg-white border border-[#E5E0D8] text-[#262019] text-xs sm:text-sm font-semibold shadow-[2px_2.5px_6px_rgba(38,32,25,0.10)] hover:shadow-[3px_3.5px_10px_rgba(38,32,25,0.15)] hover:bg-gray-50 hover:!text-black hover:border-gray-300 transition-all duration-200 cursor-pointer"
          >
            <ArrowLeft size={15} className="text-current" />
            <span className="text-current">Salir</span>
          </Link>
        ) : (
          <>
            
            <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-[14px] lg:text-[15px] font-medium text-[#262019]">
              <Link
                href="/#letras"
                onClick={(e) => handleNavClick(e, 'letras')}
                className="hover:text-[#1B9951] transition-colors"
              >
                Letras
              </Link>
              <Link
                href="/#puntos"
                onClick={(e) => handleNavClick(e, 'puntos')}
                className="hover:text-[#1B9951] transition-colors"
              >
                Puntos
              </Link>
              <Link
                href="/#premios"
                onClick={(e) => handleNavClick(e, 'premios')}
                className="hover:text-[#1B9951] transition-colors"
              >
                Premios
              </Link>
              <Link
                href="/#faq"
                onClick={(e) => handleNavClick(e, 'faq')}
                className="hover:text-[#1B9951] transition-colors"
              >
                FAQ
              </Link>

              <Link
                href="/#participar"
                onClick={(e) => handleNavClick(e, 'participar')}
                className="bg-transparent text-[#178FD5] border-[1.5px] border-[#178FD5] px-5 py-1.5 rounded-full font-semibold hover:bg-[#178FD5] hover:text-white transition-all shadow-xs"
              >
                Participar
              </Link>
            </nav>

            
            <div className="flex md:hidden items-center gap-2">
              <Link
                href="/#participar"
                onClick={(e) => handleNavClick(e, 'participar')}
                className="bg-[#178FD5] !text-white text-xs px-3.5 py-1.5 rounded-full font-bold shadow-xs hover:bg-[#147AB8] hover:!text-white active:scale-95 transition-colors"
              >
                Participar
              </Link>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl text-[#262019] hover:bg-black/5 active:scale-95 transition-all focus:outline-none"
                aria-label="Abrir menú de navegación"
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </>
        )}
      </div>

      
      {!isFlujoParticipacion && mobileMenuOpen && (
        <div className="md:hidden border-t border-[rgba(38,32,25,0.06)] bg-white/95 backdrop-blur-md px-5 py-4 flex flex-col gap-3 shadow-lg animate-in slide-in-from-top-2 duration-150">
          <Link
            href="/#letras"
            onClick={(e) => handleNavClick(e, 'letras')}
            className="py-2 text-[15px] font-semibold text-[#262019] hover:text-[#1B9951] border-b border-gray-100 transition-colors"
          >
            Letras
          </Link>
          <Link
            href="/#puntos"
            onClick={(e) => handleNavClick(e, 'puntos')}
            className="py-2 text-[15px] font-semibold text-[#262019] hover:text-[#1B9951] border-b border-gray-100 transition-colors"
          >
            Puntos en la ciudad
          </Link>
          <Link
            href="/#premios"
            onClick={(e) => handleNavClick(e, 'premios')}
            className="py-2 text-[15px] font-semibold text-[#262019] hover:text-[#1B9951] border-b border-gray-100 transition-colors"
          >
            Premios y categorías
          </Link>
          <Link
            href="/#faq"
            onClick={(e) => handleNavClick(e, 'faq')}
            className="py-2 text-[15px] font-semibold text-[#262019] hover:text-[#1B9951] transition-colors"
          >
            Preguntas frecuentes
          </Link>
        </div>
      )}
    </header>
  );
}
