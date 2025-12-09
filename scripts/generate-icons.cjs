// PWA Icon Generator Script
// Generates PNG icons for Progressive Web App

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Create a beautiful SVG icon (base size 512)
const createSvgIcon = (size = 512) => `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1e40af"/>
      <stop offset="100%" style="stop-color:#3b82f6"/>
    </linearGradient>
    <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#f59e0b"/>
      <stop offset="100%" style="stop-color:#fbbf24"/>
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="#000" flood-opacity="0.2"/>
    </filter>
  </defs>
  
  <!-- Background with rounded corners -->
  <rect width="512" height="512" rx="102" fill="url(#bg)"/>
  
  <!-- Inner glow -->
  <rect x="20" y="20" width="472" height="472" rx="90" fill="none" stroke="white" stroke-opacity="0.1" stroke-width="2"/>
  
  <!-- Cross symbol with shadow -->
  <g filter="url(#shadow)">
    <!-- Vertical bar of cross -->
    <rect x="226" y="100" width="60" height="220" rx="15" fill="white"/>
    <!-- Horizontal bar of cross -->
    <rect x="156" y="145" width="200" height="60" rx="15" fill="white"/>
  </g>
  
  <!-- Book/Bible symbol -->
  <g transform="translate(256, 380)">
    <rect x="-70" y="-30" width="140" height="80" rx="8" fill="white" opacity="0.95"/>
    <rect x="-60" y="-20" width="120" height="60" rx="4" fill="url(#gold)" opacity="0.9"/>
    <line x1="-50" y1="-5" x2="50" y2="-5" stroke="white" stroke-width="3" stroke-linecap="round"/>
    <line x1="-50" y1="10" x2="30" y2="10" stroke="white" stroke-width="3" stroke-linecap="round"/>
    <line x1="-50" y1="25" x2="40" y2="25" stroke="white" stroke-width="3" stroke-linecap="round"/>
  </g>
  
  <!-- Decorative sparkles -->
  <circle cx="420" cy="90" r="12" fill="#fbbf24"/>
  <circle cx="450" cy="120" r="6" fill="#fbbf24" opacity="0.7"/>
  <circle cx="90" cy="420" r="8" fill="white" opacity="0.5"/>
</svg>`;

// Icon sizes needed for PWA
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

// Ensure directory exists
const iconsDir = path.join(__dirname, '..', 'public', 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Generate PNG icons using Sharp
async function generateIcons() {
  const baseSvg = Buffer.from(createSvgIcon(512));
  
  console.log('🎨 Generating PWA icons...\n');
  
  for (const size of sizes) {
    const filename = path.join(iconsDir, `icon-${size}x${size}.png`);
    
    await sharp(baseSvg)
      .resize(size, size)
      .png()
      .toFile(filename);
    
    console.log(`✅ Created: icon-${size}x${size}.png`);
  }
  
  // Also save the base SVG
  fs.writeFileSync(path.join(iconsDir, 'icon.svg'), createSvgIcon(512));
  console.log(`✅ Created: icon.svg`);
  
  // Create Apple touch icon (180x180)
  await sharp(baseSvg)
    .resize(180, 180)
    .png()
    .toFile(path.join(__dirname, '..', 'public', 'apple-touch-icon.png'));
  console.log(`✅ Created: apple-touch-icon.png`);
  
  // Create favicon (32x32)
  await sharp(baseSvg)
    .resize(32, 32)
    .png()
    .toFile(path.join(__dirname, '..', 'public', 'favicon-32x32.png'));
  console.log(`✅ Created: favicon-32x32.png`);
  
  // Create favicon (16x16)
  await sharp(baseSvg)
    .resize(16, 16)
    .png()
    .toFile(path.join(__dirname, '..', 'public', 'favicon-16x16.png'));
  console.log(`✅ Created: favicon-16x16.png`);
  
  console.log('\n🎉 All icons generated successfully!');
  console.log('📱 Your app is ready to be installed as a PWA!');
}

generateIcons().catch(console.error);

