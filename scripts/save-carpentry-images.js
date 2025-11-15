const fs = require('fs').promises;
const path = require('path');

async function saveImages() {
  const outputDir = path.join(process.cwd(), 'public', 'images', 'portfolio', 'carpinteria');
  
  // Lista de imágenes y sus nombres
  const images = [
    { 
      name: 'restauracion-silla.jpg', 
      data: Buffer.from('ejemplo-imagen-1', 'utf-8') // Reemplazar con datos reales de la imagen
    },
    { 
      name: 'mueble-modular.jpg', 
      data: Buffer.from('ejemplo-imagen-2', 'utf-8') // Reemplazar con datos reales de la imagen
    },
    { 
      name: 'mesa-comedor.jpg', 
      data: Buffer.from('ejemplo-imagen-3', 'utf-8') // Reemplazar con datos reales de la imagen
    },
    { 
      name: 'set-sillas.jpg', 
      data: Buffer.from('ejemplo-imagen-4', 'utf-8') // Reemplazar con datos reales de la imagen
    }
  ];

  try {
    // Crear el directorio si no existe
    await fs.mkdir(outputDir, { recursive: true });

    // Guardar cada imagen
    for (const image of images) {
      const filePath = path.join(outputDir, image.name);
      await fs.writeFile(filePath, image.data);
      console.log(`✅ Guardada: ${image.name}`);
    }

    console.log('✨ Todas las imágenes han sido guardadas');
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

saveImages();