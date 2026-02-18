// Importing images from Next.js static build or public folder pattern if using public
// The USER requested specific paths: "/_next/static/media/..." which usually means they are looking at a build output.
// However, in development, we should refer to the source images if possible, or use the public folder.
// Since the prompt explicitly says "I already have 2 image assets in Next.js static build" and gives paths,
// but also lists "BG1", "BG2", "BG3", I will assume these follow the same pattern or are available imports.
// To be safe and cleaner, I will try to use the import pattern I used before which points to src/styles/Fotos.

import BG5 from '../styles/Fotos/Carrusel2/BG5.jpeg';
// Assuming BG1, BG2, BG3 exist in Carrusel2 or main Fotos folder based on previous list_dir
// Start with just BG5 and placeholders if files don't differ significantly or use valid local paths.
// Let's use the local paths found in list_dir for safety:
// Carrusel2/BG2.jpeg, Carrusel2/BG3.jpeg, Carrusel2/BG5.jpeg 

import BG2 from '../styles/Fotos/Carrusel2/BG2.jpeg';
import BG3 from '../styles/Fotos/Carrusel2/BG3.jpeg';
// using a fallback for the 4th image (maybe another one from list_dir like QuienSoy or one of the others)
import BG1 from '../styles/Fotos/Casos/1p.jpeg';

export const FLYER_IMAGES = [
    {
        id: 1,
        src: BG5,
        alt: "Ginecología Integral",
        title: "Atención de Calidad"
    },
    {
        id: 2,
        src: BG2,
        alt: "Control Prenatal",
        title: "Cuidado Materno"
    },
    {
        id: 3,
        src: BG3,
        alt: "Ecografía Especializada",
        title: "Tecnología Avanzada"
    },
    {
        id: 4,
        src: BG1,
        alt: "Casos Clínicos",
        title: "Experiencia Real"
    }
];
