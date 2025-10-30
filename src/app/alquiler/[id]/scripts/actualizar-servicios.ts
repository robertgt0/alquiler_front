import { actualizarUsuario } from '../services/usuario.service';

async function actualizarServicios() {
    const servicios = [
        {
            id_servicio: 1,
            nombre: "Reparación y Ajuste de Muebles",
            descripcion: "Servicio básico que incluye lijado, refuerzo de juntas, cambio de tornillos o bisagras, y retoque con barniz. Ideal para muebles que necesitan mantenimiento o ajustes menores.",
            precio: 293,
            disponible: true
        },
        {
            id_servicio: 2,
            nombre: "Fabricación de Estantes o Repisas Personalizadas",
            descripcion: "Diseño y construcción de repisas de madera a medida, con acabado barnizado o pintado. Perfecto para dormitorios, cocinas o salas modernas.",
            precio: 338,
            disponible: true
        },
        {
            id_servicio: 3,
            nombre: "Puertas y Marcos a Medida",
            descripcion: "Elaboración de puertas de madera maciza o MDF, con diseño personalizado y acabado profesional. Incluye instalación y barnizado.",
            precio: 575,
            disponible: true
        },
        {
            id_servicio: 4,
            nombre: "Muebles de Diseño (Mesas, Cómodas o Roperos)",
            descripcion: "Servicio premium que incluye diseño, construcción y acabado de muebles a medida según tus necesidades. Ideal para espacios que buscan elegancia y funcionalidad.",
            precio: 579,
            disponible: true
        }
    ];

    try {
        const resultado = await actualizarUsuario("68f9431ffda8e814d7eca37f", { servicios });
        console.log('Servicios actualizados:', resultado);
    } catch (error) {
        console.error('Error al actualizar servicios:', error);
    }
}

actualizarServicios();