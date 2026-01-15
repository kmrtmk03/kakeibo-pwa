
import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const sourceImage = path.resolve(__dirname, 'public/images/ichigo-public.png');
const publicDir = path.resolve(__dirname, 'public');

async function generateIcons() {
  try {
    console.log(`Generating icons from ${sourceImage}...`);

    await sharp(sourceImage)
      .resize(192, 192)
      .toFile(path.join(publicDir, 'pwa-192x192.png'));

    await sharp(sourceImage)
      .resize(512, 512)
      .toFile(path.join(publicDir, 'pwa-512x512.png'));

    // Maskable icon (usually needs padding, but for now reusing 512)
    // In a real scenario, we might want to add padding.
    await sharp(sourceImage)
      .resize(512, 512, { fit: 'contain', background: { r: 26, g: 26, b: 46, alpha: 1 } }) // #1a1a2e
      .toFile(path.join(publicDir, 'maskable-icon-512x512.png'));

    console.log('Icons generated successfully.');
  } catch (error) {
    console.error('Error generating icons:', error);
    process.exit(1);
  }
}

generateIcons();
