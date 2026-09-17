# Descubre Eldorado - Frontend Mockups

Frontend del concurso de gamificación urbana **"Descubre Eldorado"**, organizado por la Municipalidad de Eldorado (Misiones). Los participantes recorren 8 puntos de la ciudad, escanean un código QR en cada uno, completan la palabra **E-L-D-O-R-A-D-O** y acceden a premios.

Este repo es un **prototipo**: un frontend independiente que conserva las pantallas y el flujo visual del proyecto real, pero funciona sin backend usando datos mock en `src/lib/mock-api.ts`.

Toda la información (estaciones, tramos de premio, pasos de participación, FAQ) fue tomada de la documentación oficial del concurso.

## Versión en producción

Existe una versión de este proyecto con backend propio, ya desplegada: **https://descubre-eldorado.vercel.app**. Sirve como referencia visual y funcional del flujo completo.

## Stack

- Next.js 14 (App Router) + React 18 + TypeScript
- Tailwind CSS
- `leaflet` para el mapa interactivo de estaciones
- `qrcode` + `sharp` para generar los QR físicos (scripts)

## Ejecutar

Requisitos: Node.js 18 o superior.

1. Instalar las dependencias:

   ```bash
   npm install
   ```

2. Levantar el servidor de desarrollo:

   ```bash
   npm run dev
   ```

3. Abrir `http://localhost:3000` en el navegador (si el puerto está ocupado, Next.js usa automáticamente el siguiente libre, ej. `3001`; el mismo terminal muestra en qué URL quedó corriendo).

Para detener el servidor, `Ctrl + C` en la terminal donde corre.

## Estructura de pantallas

| Ruta | Descripción |
| --- | --- |
| `/` | Home del concurso |
| `/estacion/[token]` | Landing de una estación al escanear su QR |
| `/estacion/[token]/detalle` | Detalle/información de la estación |
| `/estacion/[token]/trivia` | Trivia asociada a la estación |
| `/letra/[slug]` | Vista de la letra desbloqueada al completar una estación |
| `/mi-progreso` | Progreso del participante (letras conseguidas, mapa) |
| `/premios` | Tramos de premios según avance |
| `/registro` | Alta de participante |
| `/bases-y-condiciones` | Bases y condiciones del concurso |

## Cómo funciona el mock

- `src/lib/api.ts` conserva los tipos y las funciones que consume la interfaz.
- `src/lib/mock-api.ts` implementa esas funciones con datos locales.
- El progreso se guarda en `localStorage` para poder probar registro, escaneos y respuestas sin base de datos.
- Los datos visuales y las imágenes son los del frontend actual.

Para reiniciar la demo, borrar la clave `eldorado_mock_state` del `localStorage` del navegador.

## Pendientes de contenido

- En `/estacion/[token]/detalle` (`src/app/estacion/[token]/detalle/page.tsx`), la sección **"Otros puntos del recorrido"** muestra las fotos de las demás estaciones (`estacion.url_imagen`, servidas desde `public/assets/sitios`). Estas imágenes son provisorias: hay que reemplazarlas por las fotos originales de cada lugar antes de publicar.
- Las preguntas de trivia definidas en `src/lib/mock-api.ts` **no son las oficiales del concurso**: son de prueba, solo para validar el flujo de `/estacion/[token]/trivia`. Deben reemplazarse por las preguntas y respuestas oficiales antes de publicar.

## Scripts auxiliares

- `npm run generar-codigos-qr` - genera los códigos QR (con la letra de cada estación superpuesta) en `public/assets/qr`, a partir de los tokens definidos en `scripts/generar-codigos-qr.js`.
- `scripts/generar-contornos-letras.js` - genera los contornos SVG de las letras usados en `/letra/[slug]`.

> **Importante:** los QR ya generados en `public/assets/qr` están codificados con la `baseUrl` hardcodeada en `scripts/generar-codigos-qr.js` (actualmente `https://descubre-eldorado.vercel.app/estacion/`, la versión en producción). Si se despliega en otra URL, hay que actualizar esa constante y volver a correr `npm run generar-codigos-qr` antes de imprimir/usar los QR.

## Guía para conectar el backend

El backend debe reemplazar las exportaciones mock de `src/lib/api.ts` manteniendo las mismas firmas y tipos. Los endpoints esperados son:

| Función frontend | Método | Endpoint |
| --- | --- | --- |
| `fetchEstaciones` | GET | `/estaciones` |
| `fetchEstacionBySlug(slug)` | GET | `/estaciones/slug/:slug` |
| `fetchTramosPremio` | GET | `/tramos-premio` |
| `fetchPasosParticipacion` | GET | `/pasos-participacion` |
| `fetchFaqs` | GET | `/faq` |
| `resolverQr(tokenQr, email)` | GET | `/estaciones/:tokenQr?email=...` |
| `registrarParticipante(data)` | POST | `/participantes` |
| `registrarEscaneo(email, tokenQr)` | POST | `/escaneos` |
| `enviarRespuesta(email, preguntaId, opcionSeleccionada)` | POST | `/respuestas` |
| `fetchProgreso(email)` | GET | `/participantes/:email/progreso` |

Los nombres y formas de respuesta están definidos en las interfaces de `src/lib/api.ts`.

## Integración

1. Copiar `.env.example` como `.env.local`.
2. Configurar `NEXT_PUBLIC_API_URL` con la URL del backend.
3. Reemplazar el re-export mock en `src/lib/api.ts` por implementaciones HTTP.
4. Mantener los tipos y nombres públicos para no modificar las pantallas.
5. Ejecutar `npx tsc --noEmit` y `npm run build`.
