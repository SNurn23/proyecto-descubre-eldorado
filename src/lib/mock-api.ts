import type {
  EstacionInfo,
  FaqInfo,
  PasoParticipacionInfo,
  ProgresoResponse,
  ResolverQrResponse,
  TramoPremioInfo,
} from './api';

type RegistroParticipante = {
  nombre: string;
  apellido: string;
  dni: string;
  email: string;
  telefono?: string;
  barrio?: string;
  aceptoTerminos: boolean;
};

const MOCK_STATE_KEY = 'eldorado_mock_state';
const QR_TOKENS = [
  'eldorado-e-fundador-7x9q',
  'eldorado-l-ceel-3m8v',
  'eldorado-d-naciones-9k2w',
  'eldorado-o-sanmartin-4p6j',
  'eldorado-r-costanera-8t5y',
  'eldorado-a-rotonda-2n7b',
  'eldorado-d-aeroclub-5r8c',
  'eldorado-o-kuppers-1z4m',
];

const estaciones: EstacionInfo[] = [
  ['E', 'e', 'El inicio', 'Feria Municipal', 'feria-municipal.jpg', '#1B9951'],
  ['L', 'l', 'La historia', 'Parador Turistico', 'parador-turistico.jpg', '#197084'],
  ['D', 'd', 'Descubrir', 'Sector Comercial KM 3', 'sector-comercial-km3.jpg', '#E8A62A'],
  ['O', 'o', 'Origen', 'Sector Comercial KM 9', 'sector-comercial-km9.jpg', '#D86A45'],
  ['R', 'r', 'Raices', 'Feria Municipal', 'feria-municipal.jpg', '#8E5B3A'],
  ['A', 'a', 'Aventura', 'Parador Turistico', 'parador-turistico.jpg', '#7B61A8'],
  ['D', 'd-final', 'Destino', 'Sector Comercial KM 3', 'sector-comercial-km3.jpg', '#D45B70'],
  ['O', 'o-final', 'Orgullo', 'Sector Comercial KM 9', 'sector-comercial-km9.jpg', '#2C8C8C'],
].map(([letra, slug, nombrePilar, nombreLugar, imagen, color], index) => ({
  id: `mock-estacion-${index + 1}`,
  orden: index + 1,
  letra,
  slug,
  token_qr: QR_TOKENS[index],
  nombre_pilar: nombrePilar,
  nombre_lugar: nombreLugar,
  descripcion: `Conocé la historia de ${nombreLugar} y descubrí una nueva letra de El Dorado.`,
  url_imagen: `/assets/sitios/${imagen}`,
  url_letra: `/assets/letters/base/letter-${index + 1}-${slug.startsWith('d') ? 'd' : slug.charAt(0)}.png`,
  color_hex: color,
  latitud: -34.6 + index * 0.001,
  longitud: -58.38 + index * 0.001,
  zona: 'El Dorado',
  preguntas: [
    {
      id: `mock-pregunta-${index + 1}`,
      texto: `¿Qué representa ${nombreLugar} para la comunidad?`,
      opciones: ['Un punto de encuentro', 'Una estación espacial', 'Un recuerdo lejano'],
      orden: 1,
    },
  ],
}));

const tramos: TramoPremioInfo[] = [
  { id: 'mock-premio-1', nombre: 'Premio inicial', descripcion: 'Completá dos estaciones.', letras_min: 2, letras_max: 3, porcentaje_correctas_min: 50 },
  { id: 'mock-premio-2', nombre: 'Premio explorador', descripcion: 'Completá cinco estaciones.', letras_min: 5, letras_max: 7, porcentaje_correctas_min: 60 },
  { id: 'mock-premio-3', nombre: 'Premio El Dorado', descripcion: 'Completá todo el recorrido.', letras_min: 8, letras_max: 8, porcentaje_correctas_min: 75 },
];

const pasos: PasoParticipacionInfo[] = [
  { orden: 1, n: '01', color: '#1B9951', titulo: 'Registrate', descripcion: 'Creá tu participante para guardar el progreso.' },
  { orden: 2, n: '02', color: '#197084', titulo: 'Recorré', descripcion: 'Visitá las estaciones y escaneá sus códigos QR.' },
  { orden: 3, n: '03', color: '#E8A62A', titulo: 'Respondé', descripcion: 'Contestá las preguntas de cada estación.' },
];

const faqs: FaqInfo[] = [
  { orden: 1, pregunta: '¿Cómo participo?', respuesta: 'Registrate, visitá las estaciones y escaneá los códigos QR.' },
  { orden: 2, pregunta: '¿Puedo continuar otro día?', respuesta: 'Sí. Tu progreso queda asociado a tu correo electrónico.' },
];

function readState() {
  if (typeof window === 'undefined') return { email: '', scanned: [] as string[], answers: [] as string[] };
  try {
    return JSON.parse(localStorage.getItem(MOCK_STATE_KEY) || '{"email":"","scanned":[],"answers":[]}');
  } catch {
    return { email: '', scanned: [], answers: [] };
  }
}

function writeState(state: { email: string; scanned: string[]; answers: string[] }) {
  if (typeof window !== 'undefined') localStorage.setItem(MOCK_STATE_KEY, JSON.stringify(state));
}

export async function mockFetchEstaciones() { return estaciones; }
export async function mockFetchEstacionBySlug(slug: string) {
  const estacion = estaciones.find((item) => item.slug === slug);
  if (!estacion) throw new Error('No se encontró la letra');
  return estacion;
}
export async function mockFetchTramosPremio() { return tramos; }
export async function mockFetchPasosParticipacion() { return pasos; }
export async function mockFetchFaqs() { return faqs; }

export async function mockResolverQr(tokenQr: string, email?: string | null): Promise<ResolverQrResponse> {
  const estacion = estaciones.find((item) => item.token_qr === tokenQr);
  if (!estacion) throw new Error('Código QR no reconocido');
  const state = readState();
  return {
    estacion,
    yaEscaneada: state.scanned.includes(tokenQr),
    participanteEncontrado: Boolean(email || state.email),
    nombreParticipante: 'Participante de prueba',
  };
}

export async function mockRegistrarParticipante(data: RegistroParticipante) {
  const state = readState();
  writeState({ ...state, email: data.email.trim().toLowerCase() });
  return { id: 'mock-participante-1', ...data };
}

export async function mockRegistrarEscaneo(email: string, tokenQr: string) {
  const state = readState();
  writeState({ ...state, email, scanned: Array.from(new Set([...state.scanned, tokenQr])) });
  return { ok: true, mensaje: 'Escaneo registrado en modo mock' };
}

export async function mockEnviarRespuesta(_email: string, preguntaId: string, opcionSeleccionada: number) {
  const state = readState();
  writeState({ ...state, answers: Array.from(new Set([...state.answers, preguntaId])) });
  return {
    esCorrecta: opcionSeleccionada === 0,
    opcionCorrecta: 0,
    mensaje: opcionSeleccionada === 0 ? '¡Respuesta correcta!' : 'Respuesta registrada. ¡Seguí recorriendo!',
  };
}

export async function mockFetchProgreso(email: string): Promise<ProgresoResponse> {
  const state = readState();
  const letras = estaciones.map((estacion) => ({
    letra: estacion.letra,
    orden: estacion.orden,
    color_hex: estacion.color_hex,
    nombre_pilar: estacion.nombre_pilar,
    nombre_lugar: estacion.nombre_lugar,
    escaneada: state.scanned.includes(estacion.token_qr),
    escaneado_en: state.scanned.includes(estacion.token_qr) ? new Date().toISOString() : null,
    respondida: Boolean(estacion.preguntas?.[0] && state.answers.includes(estacion.preguntas[0].id)),
    es_correcta: estacion.preguntas?.[0] && state.answers.includes(estacion.preguntas[0].id) ? true : null,
  }));
  const totalLetras = letras.filter((letra) => letra.escaneada).length;
  const respuestasCorrectas = letras.filter((letra) => letra.es_correcta).length;
  return {
    participante: { id: 'mock-participante-1', nombre: 'Participante', apellido: 'de prueba', email, dni: '00000000', barrio: 'El Dorado' },
    total_letras: totalLetras,
    letras_completas: totalLetras === estaciones.length,
    total_preguntas_respondidas: letras.filter((letra) => letra.respondida).length,
    respuestas_correctas: respuestasCorrectas,
    porcentaje_correctas: respuestasCorrectas ? Math.round((respuestasCorrectas / Math.max(1, letras.filter((letra) => letra.respondida).length)) * 100) : 0,
    clasifica_premio_mayor: totalLetras >= 8 && respuestasCorrectas >= 6,
    resumen_texto: `Completaste ${totalLetras} de ${estaciones.length} estaciones.`,
    letras,
    premios: tramos.map((premio) => ({ ...premio, estado: totalLetras >= premio.letras_min ? 'Ganado' : 'En camino', color_hex: estaciones[Math.min(premio.letras_min - 1, estaciones.length - 1)].color_hex })),
  };
}
