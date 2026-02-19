const fs = require('fs');
const path = require('path');

// Usando sharp para criar ícone
try {
  const sharp = require('sharp');
  
  const sizes = [
    { name: 'hdpi', size: 72 },
    { name: 'mdpi', size: 48 },
    { name: 'xhdpi', size: 96 },
    { name: 'xxhdpi', size: 144 },
    { name: 'xxxhdpi', size: 192 },
  ];

  const createIcon = async () => {
    for (const { name, size } of sizes) {
      // Criar SVG com gradiente laranja e texto TB
      const svg = `
        <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#FF6B00;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#FF8F00;stop-opacity:1" />
            </linearGradient>
          </defs>
          <rect width="${size}" height="${size}" fill="url(#grad)"/>
          <text x="${size/2}" y="${size/2 + (size*0.15)}" font-size="${size*0.5}" font-weight="bold" fill="white" text-anchor="middle" font-family="Arial">TB</text>
        </svg>
      `;

      const dir = path.join(__dirname, `android/app/src/main/res/mipmap-${name}`);
      const filePath = path.join(dir, 'ic_launcher.png');
      
      await sharp(Buffer.from(svg)).png().toFile(filePath);
      console.log(`✓ Criado: mipmap-${name}/ic_launcher.png (${size}x${size})`);
    }

    console.log('\n✅ Ícones criados com sucesso!');
  };

  createIcon().catch(error => {
    console.error('Erro ao criar ícones:', error.message);
  });
} catch (error) {
  console.error('Erro ao criar ícones:', error.message);
  console.log('\nAlternativa: instale sharp com: npm install sharp');
}
