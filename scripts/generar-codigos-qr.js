const fs = require('fs');
const path = require('path');
const QRCode = require('qrcode');
const sharp = require('sharp');

const baseUrl = 'https://descubre-eldorado.vercel.app/estacion/';

const estaciones = [
  { orden: 1, letra: 'E', token: 'eldorado-e-fundador-7x9q', nombre: 'Museo Municipal Casa del Fundador', color: '#16984A' },
  { orden: 2, letra: 'L', token: 'eldorado-l-ceel-3m8v', nombre: 'Museo Cooperativo CEEL', color: '#45A28B' },
  { orden: 3, letra: 'D', token: 'eldorado-d-naciones-9k2w', nombre: 'Plazoleta de las Naciones', color: '#085E83' },
  { orden: 4, letra: 'O', token: 'eldorado-o-sanmartin-4p6j', nombre: 'Plaza San Martín', color: '#419372' },
  { orden: 5, letra: 'R', token: 'eldorado-r-costanera-8t5y', nombre: 'Costanera Eduviges Markovicz', color: '#305C19' },
  { orden: 6, letra: 'A', token: 'eldorado-a-rotonda-2n7b', nombre: 'Monumento a la Producción', color: '#ED9702' },
  { orden: 7, letra: 'D', token: 'eldorado-d-aeroclub-5r8c', nombre: 'Aeroclub Eldorado', color: '#DC3602' },
  { orden: 8, letra: 'O', token: 'eldorado-o-kuppers-1z4m', nombre: 'Parque Natural Municipal Salto Küppers', color: '#BE0D00' },
];

const outputDir = path.join(__dirname, '../public/assets/qr');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function generarQRs() {
  console.log('--- Generando códigos QR con letra en el centro ---');

  for (const est of estaciones) {
    const url = `${baseUrl}${est.token}`;

    const rawSvg = await QRCode.toString(url, {
      type: 'svg',
      errorCorrectionLevel: 'H',
      margin: 3,
      color: {
        dark: '#111827', 
        light: '#FFFFFF',
      },
    });

    const match = rawSvg.match(/viewBox="0 0 (\d+) (\d+)"/);
    if (!match) {
      console.error('No se pudo determinar el viewBox del SVG');
      continue;
    }

    const size = parseInt(match[1], 10);
    const center = size / 2;

    const badgeSize = Math.round(size * 0.22);
    const badgeRadius = Math.round(badgeSize * 0.22);
    const badgeX = center - badgeSize / 2;
    const badgeY = center - badgeSize / 2;
    const fontSize = Math.round(badgeSize * 0.72);
    const letterY = center + fontSize * 0.35;

    const centerBadge = `
      <g id="center-letter-badge">
        <!-- Fondo blanco para tapar módulos del centro -->
        <rect x="${badgeX}" y="${badgeY}" width="${badgeSize}" height="${badgeSize}" rx="${badgeRadius}" fill="#FFFFFF" stroke="${est.color}" stroke-width="1.2" />
        <!-- Recuadro interno suave -->
        <rect x="${badgeX + 0.8}" y="${badgeY + 0.8}" width="${badgeSize - 1.6}" height="${badgeSize - 1.6}" rx="${badgeRadius - 0.5}" fill="#FAF8F5" />
        <!-- Letra del pilar -->
        <text x="${center}" y="${letterY}" text-anchor="middle" font-family="'Segoe UI', Arial, Helvetica, sans-serif" font-weight="900" font-size="${fontSize}" fill="${est.color}">
          ${est.letra}
        </text>
      </g>
    `;

    const customSvg = rawSvg.replace('</svg>', `${centerBadge}</svg>`);

    const svgFileName = `qr-${est.orden}-${est.letra.toLowerCase()}-${est.token}.svg`;
    const svgFilePath = path.join(outputDir, svgFileName);
    fs.writeFileSync(svgFilePath, customSvg, 'utf8');

    const pngFileName = `qr-${est.orden}-${est.letra.toLowerCase()}-${est.token}.png`;
    const pngFilePath = path.join(outputDir, pngFileName);

    await sharp(Buffer.from(customSvg))
      .resize(1024, 1024, {
        kernel: sharp.kernel.nearest,
      })
      .png({ quality: 100 })
      .toFile(pngFilePath);

    console.log(`✓ QR [${est.letra}] Estación ${est.orden} (${est.nombre}) -> ${pngFileName}`);
  }

  console.log('\n¡Todos los 8 códigos QR generados con éxito en public/assets/qr/!');
}

generarQRs().catch(console.error);
