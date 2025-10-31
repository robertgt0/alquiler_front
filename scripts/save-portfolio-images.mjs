import fs from 'fs';
import path from 'path';

// URLs de las imágenes originales proporcionadas (están en el contexto del chat)
const sourceImages = [
    'https://raw.githubusercontent.com/robertgt0/portfolio-images/main/boda-elegante.jpg',
    'https://raw.githubusercontent.com/robertgt0/portfolio-images/main/babyshower-oso.jpg',
    'https://raw.githubusercontent.com/robertgt0/portfolio-images/main/frozen-party.jpg',
    'https://raw.githubusercontent.com/robertgt0/portfolio-images/main/rosegold-party.jpg'
];

const targetDir = './public/images/portfolio/decoracion';

// Asegurarse que el directorio existe
if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
}

// Descargar y guardar cada imagen
async function downloadImage(url, filename) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const buffer = await response.arrayBuffer();
        fs.writeFileSync(path.join(targetDir, filename), Buffer.from(buffer));
        console.log(`✅ Guardada: ${filename}`);
    } catch (error) {
        console.error(`❌ Error al descargar ${filename}:`, error);
    }
}

// Nombres de archivo para cada imagen
const filenames = [
    'boda-elegante.jpg',
    'babyshower-oso.jpg',
    'frozen-party.jpg',
    'rosegold-party.jpg'
];

console.log('📂 Guardando imágenes en:', targetDir);

// Procesar todas las imágenes
Promise.all(
    sourceImages.map((url, index) => downloadImage(url, filenames[index]))
).then(() => {
    console.log('✨ Todas las imágenes han sido guardadas');
}).catch(error => {
    console.error('❌ Error:', error);
});