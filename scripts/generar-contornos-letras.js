const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const baseLettersDir = path.join(__dirname, '../public/assets/letters/base');
const outlineLettersDir = path.join(__dirname, '../public/assets/letters/outline');

async function generateAllOutlines() {
  console.log('Generating white outline PNGs for all 8 letters...');
  
  const files = [
    { orden: 1, letra: 'e' },
    { orden: 2, letra: 'l' },
    { orden: 3, letra: 'd' },
    { orden: 4, letra: 'o' },
    { orden: 5, letra: 'r' },
    { orden: 6, letra: 'a' },
    { orden: 7, letra: 'd' },
    { orden: 8, letra: 'o' },
  ];

  for (const item of files) {
    const srcName = `letter-${item.orden}-${item.letra}.png`;
    const outName = `letter-${item.orden}-${item.letra}-outline.png`;
    const srcPath = path.join(baseLettersDir, srcName);
    const outPath = path.join(outlineLettersDir, outName);

    if (!fs.existsSync(srcPath)) {
      console.error('Missing source file:', srcPath);
      continue;
    }

    const pngBuffer = fs.readFileSync(srcPath);
    const meta = await sharp(pngBuffer).metadata();
    const b64 = pngBuffer.toString('base64');

    const strokeWidth = Math.round(meta.width * 0.015) || 12;

    const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${meta.width}" height="${meta.height}" viewBox="0 0 ${meta.width} ${meta.height}">
      <defs>
        <filter id="outline-filter" x="-10%" y="-10%" width="120%" height="120%">
          <feMorphology in="SourceAlpha" operator="erode" radius="${strokeWidth}" result="eroded" />
          <feComposite in="SourceAlpha" in2="eroded" operator="out" result="strokeMask" />
          <feFlood flood-color="#FFFFFF" result="white" />
          <feComposite in="white" in2="strokeMask" operator="in" />
        </filter>
      </defs>
      <image href="data:image/png;base64,${b64}" width="${meta.width}" height="${meta.height}" filter="url(#outline-filter)" />
    </svg>
    `;

    await sharp(Buffer.from(svg))
      .png({ quality: 100 })
      .toFile(outPath);

    console.log(`✓ Generated: ${outName} (stroke: ${strokeWidth}px)`);
  }

  const test1 = path.join(lettersDir, 'test-outline-6-a.png');
  const test2 = path.join(lettersDir, 'test-outline-filter.png');
  if (fs.existsSync(test1)) fs.unlinkSync(test1);
  if (fs.existsSync(test2)) fs.unlinkSync(test2);
  
  console.log('All 8 outline PNGs generated successfully!');
}

generateAllOutlines().catch(console.error);
