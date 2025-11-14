import fs from 'fs';
import path from 'path';
import { Readable } from 'stream';
import { finished } from 'stream/promises';
import fetch from 'node-fetch';

const targetDir = './public/images/portfolio/decoracion';

// Asegurarse que el directorio existe
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// Función para descargar y guardar una imagen
async function downloadImage(url, filename) {
  const filepath = path.join(targetDir, filename);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Error! status: ${res.status}`);
  const fileStream = fs.createWriteStream(filepath);
  await finished(Readable.fromWeb(res.body).pipe(fileStream));
  console.log(`✅ Guardada: ${filename}`);
}

// Guardar las imágenes del portafolio en la carpeta public
const images = [
  {
    name: 'boda-elegante.jpg',
    url: 'https://raw.githubusercontent.com/tu-usuario/decoracion-eventos/main/boda-vista.jpg'
  },
  {
    name: 'babyshower-oso.jpg',
    url: 'https://raw.githubusercontent.com/tu-usuario/decoracion-eventos/main/baby-shower-oso.jpg'
  },
  {
    name: 'frozen-party.jpg',
    url: 'https://raw.githubusercontent.com/tu-usuario/decoracion-eventos/main/frozen-deco.jpg'
  },
  {
    name: 'rosegold-party.jpg',
    url: 'https://raw.githubusercontent.com/tu-usuario/decoracion-eventos/main/rose-gold.jpg'
  }
];

async function saveImages() {
  try {
    console.log('📂 Directorio de destino:', targetDir);
    
    for (const image of images) {
      await downloadImage(image.url, image.name);
    }
    
    console.log('✨ Todas las imágenes han sido guardadas');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

saveImages();