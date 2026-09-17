const envApiUrl = process.env.NEXT_PUBLIC_API_URL?.trim();
export const API_BASE_URL =
  envApiUrl && envApiUrl.length > 0
    ? envApiUrl.replace(/\/+$/, '')
    : 'http://localhost:4000';

export interface SitioRelacionadoInfo {
  nombre: string;
  subtitulo: string;
  url_imagen?: string;
}

export interface TemaVisualInfo {
  bgDark: string;
  accentLight: string;
  accentMain: string;
  cardBgTint: string;
  patron: string;
}

export interface EstacionInfo {
  id: string;
  orden: number;
  letra: string;
  slug: string;
  token_qr: string;
  nombre_pilar: string;
  nombre_lugar: string;
  descripcion: string;
  url_imagen: string;
  url_letra?: string;
  color_hex: string;
  latitud?: number;
  longitud?: number;
  manifiesto?: string;
  zona?: string;
  tema_visual?: TemaVisualInfo;
  sitios_relacionados?: Array<SitioRelacionadoInfo | string>;
  preguntas?: Array<{
    id: string;
    texto: string;
    opciones: string[];
    orden: number;
  }>;
}

export interface PasoParticipacionInfo {
  id?: string;
  orden: number;
  n: string;
  color: string;
  titulo: string;
  descripcion: string;
}

export interface FaqInfo {
  id?: string;
  orden: number;
  pregunta: string;
  respuesta: string;
}

export interface TramoPremioInfo {
  id: string;
  nombre: string;
  descripcion: string;
  letras_min: number;
  letras_max: number;
  porcentaje_correctas_min: number | null;
}

export interface ResolverQrResponse {
  estacion: EstacionInfo;
  yaEscaneada: boolean;
  participanteEncontrado: boolean;
  nombreParticipante: string;
}

export interface ProgresoResponse {
  participante: {
    id: string;
    nombre: string;
    apellido: string;
    email: string;
    dni: string;
    barrio: string;
  };
  total_letras: number;
  letras_completas: boolean;
  total_preguntas_respondidas: number;
  respuestas_correctas: number;
  porcentaje_correctas: number;
  clasifica_premio_mayor: boolean;
  resumen_texto: string;
  letras: Array<{
    letra: string;
    orden: number;
    color_hex: string;
    nombre_pilar: string;
    nombre_lugar: string;
    escaneada: boolean;
    escaneado_en: string | null;
    respondida: boolean;
    es_correcta: boolean | null;
  }>;
  premios: Array<{
    id: string;
    nombre: string;
    descripcion: string;
    letras_min: number;
    letras_max: number;
    porcentaje_correctas_min: number | null;
    estado: 'Ganado' | 'En camino' | 'Bloqueado' | 'No clasifica';
    color_hex: string;
  }>;
}

                                               
export const STORAGE_KEY_EMAIL = 'descubre_eldorado_email';

export function getStoredEmail(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const fromStorage = localStorage.getItem(STORAGE_KEY_EMAIL);
    if (fromStorage) return fromStorage;

                      
    const match = document.cookie.match(new RegExp('(^| )' + STORAGE_KEY_EMAIL + '=([^;]+)'));
    return match ? decodeURIComponent(match[2]) : null;
  } catch {
    return null;
  }
}

export function setStoredEmail(email: string): void {
  if (typeof window === 'undefined') return;
  const clean = email.trim().toLowerCase();
  try {
    localStorage.setItem(STORAGE_KEY_EMAIL, clean);
                        
    document.cookie = `${STORAGE_KEY_EMAIL}=${encodeURIComponent(clean)}; path=/; max-age=${60 * 60 * 24 * 90}; SameSite=Lax`;
  } catch {
  }
}

export function clearStoredEmail(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY_EMAIL);
    document.cookie = `${STORAGE_KEY_EMAIL}=; path=/; max-age=0; SameSite=Lax`;
  } catch {}
}

export async function fetchEstaciones(): Promise<EstacionInfo[]> {
  const res = await fetch(`${API_BASE_URL}/estaciones`, {
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Error al cargar estaciones');
  return res.json();
}

export async function fetchEstacionBySlug(slug: string): Promise<EstacionInfo> {
  const res = await fetch(`${API_BASE_URL}/estaciones/slug/${encodeURIComponent(slug)}`, {
    cache: 'no-store',
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'No se encontró la letra');
  }
  return res.json();
}

export async function fetchTramosPremio(): Promise<TramoPremioInfo[]> {
  const res = await fetch(`${API_BASE_URL}/tramos-premio`, {
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Error al cargar tramos de premio');
  return res.json();
}

export async function fetchPasosParticipacion(): Promise<PasoParticipacionInfo[]> {
  const res = await fetch(`${API_BASE_URL}/pasos-participacion`, {
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Error al cargar pasos de participación');
  return res.json();
}

export async function fetchFaqs(): Promise<FaqInfo[]> {
  const res = await fetch(`${API_BASE_URL}/faq`, {
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Error al cargar preguntas frecuentes');
  return res.json();
}

export async function resolverQr(
  tokenQr: string,
  email?: string | null,
): Promise<ResolverQrResponse> {
  const query = email ? `?email=${encodeURIComponent(email)}` : '';
  const res = await fetch(`${API_BASE_URL}/estaciones/${encodeURIComponent(tokenQr)}${query}`, {
    cache: 'no-store',
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Código QR no reconocido');
  }
  return res.json();
}

export async function registrarParticipante(data: {
  nombre: string;
  apellido: string;
  dni: string;
  email: string;
  telefono?: string;
  barrio?: string;
  aceptoTerminos: boolean;
}) {
  const res = await fetch(`${API_BASE_URL}/participantes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.message || 'Error en el registro');
  }
  setStoredEmail(data.email);
  return json;
}

export async function registrarEscaneo(email: string, tokenQr: string) {
  const res = await fetch(`${API_BASE_URL}/escaneos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, tokenQr }),
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.message || 'Error al registrar escaneo');
  }
  return json;
}

export async function enviarRespuesta(
  email: string,
  preguntaId: string,
  opcionSeleccionada: number,
) {
  const res = await fetch(`${API_BASE_URL}/respuestas`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, preguntaId, opcionSeleccionada }),
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.message || 'Error al procesar respuesta');
  }
  return json;
}

export async function fetchProgreso(email: string): Promise<ProgresoResponse> {
  const res = await fetch(
    `${API_BASE_URL}/participantes/${encodeURIComponent(email)}/progreso`,
    { cache: 'no-store' },
  );
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.message || 'Error al obtener progreso');
  }
  return json;
}
