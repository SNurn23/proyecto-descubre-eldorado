'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import HojasTropicales from '@/components/HojasTropicales';
import SeccionPremios from '@/components/SeccionPremios';
import ModalBases from '@/components/ModalBases';
import lineaSiluetaCompleta from '@/data/lineaSiluetaCompleta.json';

const MapaInteractivo = dynamic(() => import('@/components/MapaInteractivo'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[clamp(440px,54vw,600px)] rounded-2xl bg-[#F0ECE1] animate-pulse flex items-center justify-center text-[#6b5f4e] font-semibold">
      Cargando mapa interactivo de Eldorado...
    </div>
  ),
});


import {
  fetchEstaciones,
  fetchPasosParticipacion,
  fetchFaqs,
  EstacionInfo,
} from '@/lib/api';
import { DatosMapaEstacion } from '@/components/MapaInteractivo';

const DEFAULT_LETTERS = [
  { letter: 'E', slug: 'espiritu-emprendedor', imageSrc: '/assets/letters/base/letter-1-e.png', color: '#16984A', pillar: 'Espíritu Emprendedor', place: 'Casa del Fundador', token: 'eldorado-e-fundador-7x9q' },
  { letter: 'L', slug: 'legado-historico', imageSrc: '/assets/letters/base/letter-2-l.png', color: '#45A28B', pillar: 'Legado Histórico', place: 'Museo CEEL', token: 'eldorado-l-ceel-3m8v' },
  { letter: 'D', slug: 'diversidad-cultural', imageSrc: '/assets/letters/base/letter-3-d.png', color: '#085E83', pillar: 'Diversidad Cultural', place: 'Plazoleta de las Naciones', token: 'eldorado-d-naciones-9k2w' },
  { letter: 'O', slug: 'origenes', imageSrc: '/assets/letters/base/letter-4-o.png', color: '#45A28B', pillar: 'Orígenes', place: 'Plaza San Martín', token: 'eldorado-o-sanmartin-4p6j' },
  { letter: 'R', slug: 'rio-parana', imageSrc: '/assets/letters/base/letter-5-r.png', color: '#305C19', pillar: 'Río Paraná', place: 'Costanera Sur', token: 'eldorado-r-costanera-8t5y' },
  { letter: 'A', slug: 'actividad-agroindustrial', imageSrc: '/assets/letters/base/letter-6-a.png', color: '#ED9702', pillar: 'Actividad Agroforestal', place: 'Rotonda RN 12', token: 'eldorado-a-rotonda-2n7b' },
  { letter: 'D', slug: 'destino-recreativo', imageSrc: '/assets/letters/base/letter-7-d.png', color: '#DC3602', pillar: 'Destino Recreativo', place: 'Aeroclub', token: 'eldorado-d-aeroclub-5r8c' },
  { letter: 'O', slug: 'observatorio-natural', imageSrc: '/assets/letters/base/letter-8-o.png', color: '#BE0D00', pillar: 'Observatorio Natural', place: 'Salto Küppers', token: 'eldorado-o-kuppers-1z4m' },
];

const MAP_SHORT_DESCRIPTIONS: Record<number, string> = {
  1: 'Homenaje al fundador Adolfo Schwelm y a las familias pioneras.',
  2: 'Memoria viva del cooperativismo y la solidaridad comunitaria.',
  3: 'Crisol de colectividades y diversidad cultural en Misiones.',
  4: 'Núcleo histórico y cívico donde nació la ciudad en el Km 2.',
  5: 'El majestuoso río Paraná, vía de llegada de los pioneros.',
  6: 'Homenaje al trabajo forestal, agrícola y productivo.',
  7: 'Punto de encuentro, deporte y recreación familiar al aire libre.',
  8: 'Reserva natural municipal con cascadas y selva paranaense.',
};

const DEFAULT_STEPS = [
  { n: '01', color: '#1B9951', title: 'Recorré la ciudad', desc: 'Visitá los 8 puntos icónicos de Eldorado, al ritmo que quieras.' },
  { n: '02', color: '#2B8487', title: 'Escaneá el QR', desc: 'Cada punto tiene un código QR físico que te lleva a su estación.' },
  { n: '03', color: '#419372', title: 'Registrate una sola vez', desc: 'Con tu correo electrónico. Usá siempre el mismo en todas las estaciones.' },
  { n: '04', color: '#EB9301', title: 'Respondé la trivia', desc: 'Una trivia sobre la identidad del punto cultural' },
  { n: '05', color: '#BE0D00', title: 'Sumá tu letra', desc: 'Mirá tu progreso hacia completar la palabra ELDORADO.' },
];

const DEFAULT_FAQS = [
  {
    question: '¿Cómo acumulo las letras?',
    answer: 'Simplemente escaneá el código QR ubicado en cada punto de la ciudad. Al ingresar tu correo electrónico (siempre el mismo), el sistema sumará automáticamente la letra y abrirá las preguntas de esa estación.',
  },
  {
    question: '¿Cómo veo mi progreso?',
    answer: 'Cada vez que completes una estación con tu correo, tu perfil se actualiza mostrando cuántas letras llevás de la palabra ELDORADO y qué respuestas fuiste acertando en cada punto.',
  },
  {
    question: '¿Cómo gano el Premio Mayor?',
    answer: 'Necesitás las 8 letras completas y el 100% de respuestas correctas en las 8 estaciones. Entre quienes cumplan ese requisito se realiza un sorteo público para definir al ganador del Premio Mayor.',
  },
  {
    question: '¿Hay premios si no completo las 8 letras?',
    answer: 'Sí. Cada tramo del recorrido suma premios propios: alcanzar ciertas letras te da acceso a las categorías Inicial (lápiz con semillas), Intermedia (pin del concurso) y Avanzada (voucher), independientemente del sorteo del Premio Mayor.',
  },
];

export default function Home() {
  const [lettersData, setLettersData] = useState(DEFAULT_LETTERS);
  const [stepsData, setStepsData] = useState(DEFAULT_STEPS);
  const [faqData, setFaqData] = useState(DEFAULT_FAQS);
  const [estacionesBackend, setEstacionesBackend] = useState<EstacionInfo[]>([]);

  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [mostrarModalBases, setMostrarModalBases] = useState(false);
  const [singleLinePath, setSingleLinePath] = useState<string>('');
  const [lineSegments, setLineSegments] = useState<string[]>([]);
  const [nodeOffsetsY, setNodeOffsetsY] = useState<number[]>([0, 0, 0, 0, 0]);
  const nodeOffsetsYRef = useRef<number[]>([0, 0, 0, 0, 0]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('bases') === 'true') {
        setMostrarModalBases(true);
      }
    }
  }, []);

  useEffect(() => {
    fetchEstaciones()
      .then((data) => {
        if (data && data.length > 0) {
          setEstacionesBackend(data);
          const mapped = data.map((est) => ({
            letter: est.letra,
            slug: est.slug,
            imageSrc:
              est.url_letra ||
              `/assets/letters/base/letter-${est.orden}-${est.letra.toLowerCase()}.png`,
            color: est.color_hex,
            pillar: est.nombre_pilar,
            place: est.nombre_lugar,
            token: est.token_qr,
          }));
          setLettersData(mapped);
        }
      })
      .catch((err) => console.error('Error cargando estaciones:', err));

    fetchPasosParticipacion()
      .then((data) => {
        if (data && data.length > 0) {
          const mapped = data.map((p) => ({
            n: p.n,
            color: p.color,
            title: p.titulo,
            desc: p.descripcion,
          }));
          setStepsData(mapped);
        }
      })
      .catch((err) => console.error('Error cargando pasos:', err));

    fetchFaqs()
      .then((data) => {
        if (data && data.length > 0) {
          const mapped = data.map((f) => ({
            question: f.pregunta,
            answer: f.respuesta,
          }));
          setFaqData(mapped);
        }
      })
      .catch((err) => console.error('Error cargando FAQs:', err));
  }, []);

  const stepsContainerRef = useRef<HTMLDivElement>(null);
  const circleRefs = useRef<(HTMLDivElement | null)[]>([]);
  const stepBallRefs = useRef<(HTMLDivElement | null)[]>([]);
  const segmentPathRefs = useRef<(SVGPathElement | null)[]>([]);

  const updateLineAndNodes = () => {
    const container = stepsContainerRef.current;
    if (!container) return;
    const validCircles = stepsData
      .map((_, i) => circleRefs.current[i])
      .filter(Boolean) as HTMLDivElement[];
    if (validCircles.length < 5) return;

    const cRect = container.getBoundingClientRect();
    const currentOffsets = nodeOffsetsYRef.current;

    const pts = validCircles.map((el, i) => {
      const r = el.getBoundingClientRect();
      const unshiftedY = r.top - (currentOffsets[i] || 0);
      return {
        x: r.left + r.width / 2 - cRect.left + container.scrollLeft,
        y: unshiftedY + r.height / 2 - cRect.top,
      };
    });

    const x0 = pts[0].x;
    const x4 = pts[4].x;
    const totalW = x4 - x0;
    if (totalW <= 0) return;

    const baseY = (pts[0].y + pts[4].y) / 2;

    const scaleY = Math.min(Math.max((totalW / 781) * 0.75, 0.6), 0.95);

    const newOffsets: number[] = [];
    const nodeFractions: number[] = [];
    for (let i = 0; i < 5; i++) {
      const frac = Math.min(Math.max((pts[i].x - x0) / totalW, 0), 1);
      nodeFractions.push(frac);
      const closest = (lineaSiluetaCompleta as [number, number][]).reduce((prev, curr) =>
        Math.abs(curr[0] - frac) < Math.abs(prev[0] - frac) ? curr : prev
      );
      newOffsets.push(Math.round(closest[1] * scaleY));
    }
    nodeOffsetsYRef.current = newOffsets;
    setNodeOffsetsY(newOffsets);

    const getInterpY = (targetFrac: number): number => {
      const line = lineaSiluetaCompleta as [number, number][];
      for (let j = 0; j < line.length - 1; j++) {
        const [x1, y1] = line[j];
        const [x2, y2] = line[j + 1];
        if (targetFrac >= x1 && targetFrac <= x2) {
          if (x2 === x1) return y1;
          const t = (targetFrac - x1) / (x2 - x1);
          return y1 + t * (y2 - y1);
        }
      }
      return line[line.length - 1][1];
    };

    const segments: string[] = [];
    for (let k = 0; k < 4; k++) {
      const sFrac = nodeFractions[k];
      const eFrac = nodeFractions[k + 1];

      const sPx = x0 + sFrac * totalW;
      const sPy = baseY + getInterpY(sFrac) * scaleY;
      let segD = `M ${sPx.toFixed(1)} ${sPy.toFixed(1)}`;

      (lineaSiluetaCompleta as [number, number][]).forEach(([rx, dy]) => {
        if (rx > sFrac && rx < eFrac) {
          const px = x0 + rx * totalW;
          const py = baseY + dy * scaleY;
          segD += ` L ${px.toFixed(1)} ${py.toFixed(1)}`;
        }
      });

      const ePx = x0 + eFrac * totalW;
      const ePy = baseY + getInterpY(eFrac) * scaleY;
      segD += ` L ${ePx.toFixed(1)} ${ePy.toFixed(1)}`;

      segments.push(segD);
    }
    setLineSegments(segments);

    segmentPathRefs.current.forEach((p) => {
      if (p) delete p.dataset.pathLen;
    });

    let d = '';
    (lineaSiluetaCompleta as [number, number][]).forEach(([rx, dy], idx) => {
      const px = x0 + rx * totalW;
      const py = baseY + dy * scaleY;
      if (idx === 0) {
        d += `M ${px.toFixed(1)} ${py.toFixed(1)}`;
      } else {
        d += ` L ${px.toFixed(1)} ${py.toFixed(1)}`;
      }
    });
    setSingleLinePath(d);
  };

  useEffect(() => {
    updateLineAndNodes();
    const handleResize = () => updateLineAndNodes();
    window.addEventListener('resize', handleResize);
    const t1 = setTimeout(updateLineAndNodes, 50);
    const t2 = setTimeout(updateLineAndNodes, 200);
    const t3 = setTimeout(updateLineAndNodes, 500);
    const t4 = setTimeout(updateLineAndNodes, 1200);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [stepsData]);

  const [lettersVisible, setLettersVisible] = useState(true);
  const [activeMilestone, setActiveMilestone] = useState<number | null>(null);
  const lettersSectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let animId: number;
    const CYCLE = 12200;
    const start = performance.now();

    const segmentWindows = [
      [500, 2500],
      [2800, 4800],
      [5100, 7100],
      [7400, 9400],
    ];

    const pulseWindows = [
      [150, 700],
      [2350, 2950],
      [4650, 5250],
      [6950, 7550],
      [9250, 9950],
    ];

    const frame = (now: number) => {
      const elapsed = (now - start) % CYCLE;

      for (let i = 0; i < 5; i++) {
        const ball = stepBallRefs.current[i];
        if (ball) {
          const [s, e] = pulseWindows[i];
          if (elapsed >= s && elapsed <= e) {
            const mid = (s + e) / 2;
            const factor = elapsed < mid ? (elapsed - s) / (mid - s) : (e - elapsed) / (e - mid);
            const scale = 1 + factor * 0.12;
            ball.style.transform = `scale(${scale})`;
          } else {
            ball.style.transform = 'scale(1)';
          }
        }
      }

      for (let k = 0; k < 4; k++) {
        const path = segmentPathRefs.current[k];
        if (path) {
          let len = Number(path.dataset.pathLen);
          if (!len || len <= 0) {
            try {
              len = path.getTotalLength();
              if (len > 0) path.dataset.pathLen = String(len);
            } catch {
              len = 0;
            }
          }

          if (len > 0) {
            path.style.strokeDasharray = `${len}`;
            const [s, e] = segmentWindows[k];
            let progress = 0;

            if (elapsed >= e) {
              progress = 1;
            } else if (elapsed > s) {
              const t = (elapsed - s) / (e - s);
              progress = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
            }

            path.style.strokeDashoffset = `${len * (1 - progress)}`;

            if (elapsed > 11200) {
              const fade = (elapsed - 11200) / 800;
              path.style.opacity = `${0.85 * (1 - Math.min(1, fade))}`;
            } else {
              path.style.opacity = '0.85';
            }
          }
        }
      }

      animId = requestAnimationFrame(frame);
    };

    animId = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(animId);
  }, []);

  useEffect(() => {
    const el = lettersSectionRef.current;
    if (!el) return;

    if (!('IntersectionObserver' in window)) {
      setLettersVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setLettersVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.05, rootMargin: '80px 0px' }
    );

    observer.observe(el);

    const fallbackTimer = setTimeout(() => {
      setLettersVisible(true);
    }, 2500);

    return () => {
      observer.disconnect();
      clearTimeout(fallbackTimer);
    };
  }, []);

  return (
    <div className="min-h-screen">
      
      <section className="relative overflow-hidden bg-gradient-to-br from-[rgba(235,147,1,0.08)] via-[rgba(25,112,132,0.1)] to-[rgba(27,153,81,0.08)] flex flex-col justify-between min-h-[calc(100vh-56px)] sm:min-h-[calc(100vh-64px)] lg:min-h-[calc(100vh-70px)] min-h-[calc(100dvh-56px)] sm:min-h-[calc(100dvh-64px)] lg:min-h-[calc(100dvh-70px)]">
        <HojasTropicales position="top" className="max-h-[60px] sm:max-h-[110px] md:max-h-none" />

        <div className="relative max-w-[1240px] w-full mx-auto px-4 sm:px-6 lg:px-12 py-6 sm:py-10 lg:py-12 my-auto grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-16 xl:gap-24 items-center">
          
          <div className="flex flex-col items-start gap-1 sm:gap-2 text-left">
            <span className="text-[clamp(18px,2.4vw,30px)] font-medium text-[#4a4033] tracking-wide m-0">
              Descubramos
            </span>
            <h1 className="m-0 leading-none w-full max-w-[560px]">
              <Image
                src="/assets/eldorado-logo.svg"
                alt="ELDORADO"
                width={780}
                height={180}
                className="w-full h-auto object-contain filter drop-shadow-sm"
                priority
              />
            </h1>
            <span className="text-[clamp(18px,2.4vw,30px)] font-medium text-[#4a4033] tracking-wide m-0">
              Letra por Letra
            </span>
          </div>

          
          <div className="flex flex-col items-start lg:pl-6 xl:pl-10 gap-4 sm:gap-5 text-left max-w-[480px]">
            <p className="text-[clamp(14px,1.5vw,19px)] max-w-[42ch] m-0 text-[#4a4033] font-normal leading-relaxed">
              Te invitamos a conocer nuestra identidad con un reto desde el{' '}
              <span className="text-[#BE0D00] font-semibold">
                29 de Sept. al 14 de Nov.
              </span>
            </p>

            
            <div className="w-full flex items-center justify-center gap-2 sm:gap-3.5 flex-wrap text-xs sm:text-[14px] min-h-[28px] select-none font-medium my-0.5">
              <span className="wave-step-1 font-bold tracking-wide">
                ESCANEA
              </span>
              <span className="wave-arrow-1 font-bold">
                →
              </span>
              <span className="wave-step-2 font-bold tracking-wide">
                DESCUBRE
              </span>
              <span className="wave-arrow-2 font-bold">
                →
              </span>
              <span className="wave-step-3 font-bold tracking-wide">
                ACUMULA
              </span>
              <span className="wave-arrow-3 font-bold">
                →
              </span>
              <span className="wave-step-4 font-extrabold tracking-wide">
                GANA
              </span>
            </div>

            <div className="w-full flex justify-center pt-2">
              <Link
                href="#participar"
                className="inline-block w-full sm:w-auto bg-[#BE0D00] text-white hover:text-white hover:bg-[#16984A] px-9 py-3.5 rounded-full font-semibold text-sm md:text-base transition-all shadow-md hover:shadow-lg hover:shadow-[#16984A]/25 transform active:scale-95 text-center"
              >
                Quiero participar
              </Link>
            </div>
          </div>
        </div>

        <HojasTropicales position="bottom" className="max-h-[60px] sm:max-h-[110px] md:max-h-none" />
      </section>

      
      <section
        id="letras"
        ref={lettersSectionRef}
        className="scroll-mt-24 relative mt-4 sm:mt-8 lg:mt-16 py-12 sm:py-16 lg:py-24 px-4 sm:px-6 lg:px-10 max-w-[1360px] mx-auto border-b border-[rgba(38,32,25,0.06)]"
      >
        <div className="max-w-[48ch] mx-auto mb-8 sm:mb-12 text-center">
          <h2 className="section-title text-[clamp(24px,4vw,44px)] m-0 mb-3">
            Descubrí la identidad <br className="hidden sm:inline" /> de cada letra
          </h2>
          <p className="text-[13px] sm:text-[15px] text-[#6b5f4e] leading-relaxed m-0">
            Cada letra de ELDORADO representa un pilar histórico, natural y cultural de nuestra ciudad
          </p>
        </div>

        
        <div className="flex justify-start md:justify-center items-start gap-2.5 sm:gap-[clamp(8px,1.4vw,20px)] flex-nowrap overflow-x-auto no-scrollbar pb-4 pt-2 px-2 sm:px-4 select-none snap-x snap-mandatory">
          {lettersData.map((pt, i) => (
            <Link
              key={i}
              href={`/letra/${pt.slug}`}
              className="flex flex-col items-center w-[92px] sm:w-[clamp(80px,9.5vw,132px)] shrink-0 p-1 select-none group cursor-pointer transition-all outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 active:outline-none active:ring-0 border-0 ring-0 focus:border-0 snap-start"
              style={{
                opacity: lettersVisible ? 1 : 0,
                animation: lettersVisible
                  ? `letterPop 0.65s cubic-bezier(0.34, 1.35, 0.64, 1) ${i * 0.15}s both`
                  : 'none',
                ['--letter-color' as string]: pt.color,
              }}
              title={`Ver detalle de la letra ${pt.letter} - ${pt.pillar}`}
            >
              <div className="w-full h-[64px] sm:h-[clamp(56px,7vw,96px)] flex items-center justify-center mb-2 transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1.5">
                <Image
                  src={pt.imageSrc}
                  alt={`Letra ${pt.letter} - ${pt.pillar}`}
                  width={240}
                  height={240}
                  className="w-full h-full object-contain filter drop-shadow-sm select-none pointer-events-none"
                  priority
                />
              </div>
              <div className="italic text-[11px] sm:text-[clamp(11px,0.95vw,13.5px)] text-[#6b5f4e] font-serif mb-0.5">es</div>
              <div className="letter-pillar-title font-extrabold text-[10px] sm:text-[clamp(9.5px,0.8vw,12px)] tracking-wider uppercase text-[#262019] text-center leading-snug transition-colors duration-200">
                {pt.pillar}
              </div>
            </Link>
          ))}
        </div>

        
        <div className="md:hidden flex items-center justify-center gap-1.5 text-xs text-[#6b5f4e] mt-1 font-medium select-none">
          <span>←</span> Deslizá para explorar las 8 letras <span>→</span>
        </div>
      </section>

      
      <section
        id="participar"
        className="scroll-mt-24 py-12 sm:py-16 lg:py-24 px-4 sm:px-6 lg:px-14 max-w-[1400px] mx-auto border-b border-[rgba(38,32,25,0.06)]"
      >
        <div className="max-w-[48ch] mx-auto mb-8 sm:mb-12 text-center">
          <h2 className="section-title text-[clamp(24px,4vw,44px)] m-0 mb-3">
            Cómo participar <br className="hidden sm:inline" /> del concurso
          </h2>
          <p className="text-[13px] sm:text-[15px] text-[#6b5f4e] leading-relaxed m-0">
            Seguí estos simples pasos para participar, recorré cada uno de los puntos y completá la palabra
          </p>
        </div>

        
        <div
          ref={stepsContainerRef}
          className="hidden md:block relative pt-6 sm:pt-8 overflow-x-auto pb-4 scroll-smooth"
        >
          <svg className="absolute top-0 left-0 w-full h-full pointer-events-none z-0 overflow-visible">
            {lineSegments.map((segD, k) => (
              <path
                key={k}
                ref={(el) => {
                  segmentPathRefs.current[k] = el;
                }}
                d={segD}
                stroke="#9CA3AF"
                strokeWidth="3.5"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.85"
              />
            ))}
          </svg>

          <div className="flex flex-nowrap gap-[clamp(12px,2.2vw,36px)] relative z-10 min-w-min justify-center pt-8 pb-2">
            {stepsData.map((step, i) => (
              <div
                key={i}
                className="flex flex-col items-center gap-3 px-2 flex-1 min-w-[150px] max-w-[210px]"
              >
                <div
                  style={{
                    transform: `translateY(${nodeOffsetsY[i] || 0}px)`,
                    transition: 'transform 0.25s ease-out',
                  }}
                >
                  <div
                    ref={(el) => {
                      circleRefs.current[i] = el;
                      stepBallRefs.current[i] = el;
                    }}
                    className="relative z-10 flex items-center justify-center w-[clamp(48px,7.2vw,84px)] h-[clamp(48px,7.2vw,84px)] rounded-full text-white font-normal text-[clamp(18px,2.6vw,32px)] shrink-0 shadow-md transition-transform hover:scale-105"
                    style={{ backgroundColor: step.color }}
                  >
                    {step.n}
                  </div>
                </div>
                <div className="font-bold text-[clamp(15px,1.6vw,19px)] text-[#262019] text-center">
                  {step.title}
                </div>
                <div className="text-[clamp(13px,1.3vw,15px)] text-[#6b5f4e] leading-relaxed text-center">
                  {step.desc}
                </div>
              </div>
            ))}
          </div>
        </div>

        
        <div className="block md:hidden max-w-sm mx-auto pt-2">
          <div className="relative flex flex-col gap-6 pl-3">
            
            <div className="absolute left-[31px] top-6 bottom-6 w-0.5 bg-gray-200 z-0" />

            {stepsData.map((step, i) => (
              <div key={i} className="relative z-10 flex items-start gap-4">
                
                <div
                  className="flex items-center justify-center w-10 h-10 rounded-full text-white font-bold text-sm shrink-0 shadow-sm"
                  style={{ backgroundColor: step.color }}
                >
                  {step.n}
                </div>

                
                <div className="flex flex-col pt-0.5">
                  <h3 className="text-[15px] font-bold text-[#262019] mb-1 leading-snug">
                    {step.title}
                  </h3>
                  <p className="text-xs text-[#6b5f4e] leading-relaxed m-0">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      
      <section
        id="puntos"
        className="scroll-mt-24 py-16 sm:py-20 lg:py-24 px-[clamp(16px,3vw,40px)] max-w-[1140px] mx-auto border-b border-[rgba(38,32,25,0.06)]"
      >
        <div className="max-w-[48ch] mx-auto mb-10 sm:mb-12 text-center">
          <h2 className="section-title text-[clamp(28px,4vw,44px)] m-0 mb-3">
            Dónde encontrar <br className="hidden sm:inline" /> las estaciones
          </h2>
          <p className="text-[14px] sm:text-[15px] text-[#6b5f4e] leading-relaxed m-0">
            Explorá el mapa para localizar las 8 letras y conocer el lugar donde está ubicada cada una
          </p>
        </div>

        <MapaInteractivo
          stations={
            estacionesBackend.length > 0
              ? estacionesBackend.map((st) => ({
                  orden: st.orden,
                  letter: st.letra,
                  color: st.color_hex,
                  pillar: st.nombre_pilar,
                  place: st.nombre_lugar,
                  zona: st.zona || 'Eldorado, Misiones',
                  lat: st.latitud ?? -26.406,
                  lng: st.longitud ?? -54.635,
                  token: st.token_qr,
                  image: st.url_imagen || '/assets/hero-1.jpeg',
                  desc: MAP_SHORT_DESCRIPTIONS[st.orden] || st.descripcion,
                }))
              : undefined
          }
        />
      </section>

      
      <SeccionPremios />

      
      <section
        id="faq"
        className="scroll-mt-24 py-16 sm:py-20 lg:py-24 px-[clamp(20px,4vw,56px)] max-w-[900px] mx-auto"
      >
        <div className="max-w-[44ch] mx-auto mb-10 sm:mb-12 text-center">
          <h2 className="section-title text-[clamp(28px,4vw,44px)] m-0">
            Preguntas frecuentes
          </h2>
        </div>

        <div className="flex flex-col divide-y divide-[rgba(38,32,25,0.12)]">
          {faqData.map((q, i) => (
            <div key={i} className="py-5">
              <button
                type="button"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex justify-between items-center gap-4 text-left cursor-pointer focus:outline-none group"
              >
                <span className="text-lg font-normal text-[#262019] group-hover:text-[#197084] transition-colors">
                  {q.question}
                </span>
                <span className="text-2xl font-light text-[#197084] shrink-0 w-6 text-center">
                  {openFaq === i ? '−' : '+'}
                </span>
              </button>

              {openFaq === i && (
                <p className="mt-3.5 text-[15px] leading-relaxed text-[#4a4033] max-w-[70ch] animate-tag-reveal">
                  {q.answer}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      
      <ModalBases
        estaAbierto={mostrarModalBases}
        alCerrar={() => setMostrarModalBases(false)}
      />
    </div>
  );
}
