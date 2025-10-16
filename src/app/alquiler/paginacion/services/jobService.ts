import { Job } from "../types/job";

// Datos completos de trabajos (más de 10 para probar paginación)
export const getJobs = (): Job[] => {
  const jobs = [
      
    {
      title: "Especialista en SEO",
      company: "Digital Growth Bolivia",
      service: "Servicio: Posicionamiento Web",
      location: "Quillacollo, Cochabamba",
      postedDate: "Publicado hace 3 días",
      salaryRange: "Bs 9,000 - Bs 14,000",
      employmentType: "Medio Tiempo",
      employmentTypeColor: "bg-blue-100 text-blue-800"
    },
    {
      title: "Project Manager",
      company: "Agile Solutions Bolivia",
      service: "Servicio: Gestión de Proyectos",
      location: "Cochabamba, Bolivia",
      postedDate: "Publicado hace 1 día",
      salaryRange: "Bs 18,000 - Bs 26,000",
      employmentType: "Tiempo Completo",
      employmentTypeColor: "bg-blue-100 text-blue-800"
    },
    {
      title: "Desarrollador Frontend",
      company: "TechBolivia Solutions",
      service: "Servicio: Desarrollo Web",
      location: "La Paz, Bolivia",
      postedDate: "Publicado hace 2 días",
      salaryRange: "Bs 12,000 - Bs 18,000",
      employmentType: "Tiempo Completo",
      employmentTypeColor: "bg-blue-100 text-blue-800"
    },
    {
      title: "Diseñador UX/UI",
      company: "Creative Studio Bolivia",
      service: "Servicio: Diseño Digital",
      location: "Santa Cruz, Bolivia",
      postedDate: "Publicado hace 4 días",
      salaryRange: "Bs 8,000 - Bs 15,000",
      employmentType: "Medio Tiempo",
      employmentTypeColor: "bg-blue-100 text-blue-800"
    },
    {
      title: "Analista de Datos",
      company: "Data Insights Bolivia",
      service: "Servicio: Análisis de Datos",
      location: "Cochabamba, Bolivia",
      postedDate: "Publicado hace 5 días",
      salaryRange: "Bs 10,000 - Bs 16,000",
      employmentType: "Tiempo Completo",
      employmentTypeColor: "bg-blue-100 text-blue-800"
    },
    {
      title: "Marketing Digital",
      company: "Growth Marketing Bolivia",
      service: "Servicio: Marketing Online",
      location: "La Paz, Bolivia",
      postedDate: "Publicado hace 6 días",
      salaryRange: "Bs 7,000 - Bs 12,000",
      employmentType: "Medio Tiempo",
      employmentTypeColor: "bg-blue-100 text-blue-800"
    },
    {
      title: "Desarrollador Backend",
      company: "Backend Solutions Bolivia",
      service: "Servicio: Desarrollo de APIs",
      location: "Santa Cruz, Bolivia",
      postedDate: "Publicado hace 7 días",
      salaryRange: "Bs 14,000 - Bs 22,000",
      employmentType: "Tiempo Completo",
      employmentTypeColor: "bg-blue-100 text-blue-800"
    },
    {
      title: "Community Manager",
      company: "Social Media Bolivia",
      service: "Servicio: Gestión de Redes",
      location: "Cochabamba, Bolivia",
      postedDate: "Publicado hace 8 días",
      salaryRange: "Bs 6,000 - Bs 10,000",
      employmentType: "Medio Tiempo",
      employmentTypeColor: "bg-blue-100 text-blue-800"
    },
    {
      title: "DevOps Engineer",
      company: "Cloud Infrastructure Bolivia",
      service: "Servicio: Infraestructura Cloud",
      location: "La Paz, Bolivia",
      postedDate: "Publicado hace 9 días",
      salaryRange: "Bs 16,000 - Bs 25,000",
      employmentType: "Tiempo Completo",
      employmentTypeColor: "bg-blue-100 text-blue-800"
    },
    {
      title: "Copywriter",
      company: "Content Creation Bolivia",
      service: "Servicio: Redacción de Contenidos",
      location: "Santa Cruz, Bolivia",
      postedDate: "Publicado hace 10 días",
      salaryRange: "Bs 5,000 - Bs 9,000",
      employmentType: "Medio Tiempo",
      employmentTypeColor: "bg-blue-100 text-blue-800"
    },
    {
      title: "QA Tester",
      company: "Quality Assurance Bolivia",
      service: "Servicio: Testing de Software",
      location: "Cochabamba, Bolivia",
      postedDate: "Publicado hace 11 días",
      salaryRange: "Bs 8,000 - Bs 13,000",
      employmentType: "Tiempo Completo",
      employmentTypeColor: "bg-blue-100 text-blue-800"
    },
    {
      title: "Product Manager",
      company: "Product Strategy Bolivia",
      service: "Servicio: Gestión de Productos",
      location: "La Paz, Bolivia",
      postedDate: "Publicado hace 12 días",
      salaryRange: "Bs 20,000 - Bs 30,000",
      employmentType: "Tiempo Completo",
      employmentTypeColor: "bg-blue-100 text-blue-800"
    },
    {
      title: "Sales Representative",
      company: "Sales Force Bolivia",
      service: "Servicio: Ventas B2B",
      location: "Santa Cruz, Bolivia",
      postedDate: "Publicado hace 13 días",
      salaryRange: "Bs 9,000 - Bs 15,000",
      employmentType: "Tiempo Completo",
      employmentTypeColor: "bg-blue-100 text-blue-800"
    },
    {
      title: "Mobile Developer",
      company: "Mobile Apps Bolivia",
      service: "Servicio: Desarrollo Móvil",
      location: "Cochabamba, Bolivia",
      postedDate: "Publicado hace 14 días",
      salaryRange: "Bs 13,000 - Bs 20,000",
      employmentType: "Tiempo Completo",
      employmentTypeColor: "bg-blue-100 text-blue-800"
    },
    {
      title: "Graphic Designer",
      company: "Visual Design Bolivia",
      service: "Servicio: Diseño Gráfico",
      location: "La Paz, Bolivia",
      postedDate: "Publicado hace 15 días",
      salaryRange: "Bs 7,000 - Bs 12,000",
      employmentType: "Medio Tiempo",
      employmentTypeColor: "bg-blue-100 text-blue-800"
    },
    {
      title: "Especialista en SEO",
      company: "Digital Growth Bolivia",
      service: "Servicio: Posicionamiento Web",
      location: "Quillacollo, Cochabamba",
      postedDate: "Publicado hace 3 días",
      salaryRange: "Bs 9,000 - Bs 14,000",
      employmentType: "Medio Tiempo",
      employmentTypeColor: "bg-blue-100 text-blue-800"
    },
    {
      title: "Project Manager",
      company: "Agile Solutions Bolivia",
      service: "Servicio: Gestión de Proyectos",
      location: "Cochabamba, Bolivia",
      postedDate: "Publicado hace 1 día",
      salaryRange: "Bs 18,000 - Bs 26,000",
      employmentType: "Tiempo Completo",
      employmentTypeColor: "bg-blue-100 text-blue-800"
    },
    {
      title: "Desarrollador Frontend",
      company: "TechBolivia Solutions",
      service: "Servicio: Desarrollo Web",
      location: "La Paz, Bolivia",
      postedDate: "Publicado hace 2 días",
      salaryRange: "Bs 12,000 - Bs 18,000",
      employmentType: "Tiempo Completo",
      employmentTypeColor: "bg-blue-100 text-blue-800"
    },
    {
      title: "Diseñador UX/UI",
      company: "Creative Studio Bolivia",
      service: "Servicio: Diseño Digital",
      location: "Santa Cruz, Bolivia",
      postedDate: "Publicado hace 4 días",
      salaryRange: "Bs 8,000 - Bs 15,000",
      employmentType: "Medio Tiempo",
      employmentTypeColor: "bg-blue-100 text-blue-800"
    },
    {
      title: "Analista de Datos",
      company: "Data Insights Bolivia",
      service: "Servicio: Análisis de Datos",
      location: "Cochabamba, Bolivia",
      postedDate: "Publicado hace 5 días",
      salaryRange: "Bs 10,000 - Bs 16,000",
      employmentType: "Tiempo Completo",
      employmentTypeColor: "bg-blue-100 text-blue-800"
    },
    {
      title: "Marketing Digital",
      company: "Growth Marketing Bolivia",
      service: "Servicio: Marketing Online",
      location: "La Paz, Bolivia",
      postedDate: "Publicado hace 6 días",
      salaryRange: "Bs 7,000 - Bs 12,000",
      employmentType: "Medio Tiempo",
      employmentTypeColor: "bg-blue-100 text-blue-800"
    },
    {
      title: "Desarrollador Backend",
      company: "Backend Solutions Bolivia",
      service: "Servicio: Desarrollo de APIs",
      location: "Santa Cruz, Bolivia",
      postedDate: "Publicado hace 7 días",
      salaryRange: "Bs 14,000 - Bs 22,000",
      employmentType: "Tiempo Completo",
      employmentTypeColor: "bg-blue-100 text-blue-800"
    },
    {
      title: "Community Manager",
      company: "Social Media Bolivia",
      service: "Servicio: Gestión de Redes",
      location: "Cochabamba, Bolivia",
      postedDate: "Publicado hace 8 días",
      salaryRange: "Bs 6,000 - Bs 10,000",
      employmentType: "Medio Tiempo",
      employmentTypeColor: "bg-blue-100 text-blue-800"
    },
    {
      title: "DevOps Engineer",
      company: "Cloud Infrastructure Bolivia",
      service: "Servicio: Infraestructura Cloud",
      location: "La Paz, Bolivia",
      postedDate: "Publicado hace 9 días",
      salaryRange: "Bs 16,000 - Bs 25,000",
      employmentType: "Tiempo Completo",
      employmentTypeColor: "bg-blue-100 text-blue-800"
    },
    {
      title: "Copywriter",
      company: "Content Creation Bolivia",
      service: "Servicio: Redacción de Contenidos",
      location: "Santa Cruz, Bolivia",
      postedDate: "Publicado hace 10 días",
      salaryRange: "Bs 5,000 - Bs 9,000",
      employmentType: "Medio Tiempo",
      employmentTypeColor: "bg-blue-100 text-blue-800"
    },
    {
      title: "QA Tester",
      company: "Quality Assurance Bolivia",
      service: "Servicio: Testing de Software",
      location: "Cochabamba, Bolivia",
      postedDate: "Publicado hace 11 días",
      salaryRange: "Bs 8,000 - Bs 13,000",
      employmentType: "Tiempo Completo",
      employmentTypeColor: "bg-blue-100 text-blue-800"
    },
    {
      title: "Product Manager",
      company: "Product Strategy Bolivia",
      service: "Servicio: Gestión de Productos",
      location: "La Paz, Bolivia",
      postedDate: "Publicado hace 12 días",
      salaryRange: "Bs 20,000 - Bs 30,000",
      employmentType: "Tiempo Completo",
      employmentTypeColor: "bg-blue-100 text-blue-800"
    },
    {
      title: "Cantante de Stray Kids",
      company: "Sales Force Bolivia",
      service: "Servicio: Ventas B2B",
      location: "Santa Cruz, Bolivia",
      postedDate: "Publicado hace 13 días",
      salaryRange: "Bs 9,000 - Bs 15,000",
      employmentType: "Tiempo Completo",
      employmentTypeColor: "bg-blue-100 text-blue-800"
    },
    {
      title: "Mobile Developer",
      company: "Mobile Apps Bolivia",
      service: "Servicio: Desarrollo Móvil",
      location: "Cochabamba, Bolivia",
      postedDate: "Publicado hace 14 días",
      salaryRange: "Bs 13,000 - Bs 20,000",
      employmentType: "Tiempo Completo",
      employmentTypeColor: "bg-blue-100 text-blue-800"
    },
    {
      title: "Graphic Designer",
      company: "Visual Design Bolivia",
      service: "Servicio: Diseño Gráfico",
      location: "La Paz, Bolivia",
      postedDate: "Publicado hace 15 días",
      salaryRange: "Bs 7,000 - Bs 12,000",
      employmentType: "Medio Tiempo",
      employmentTypeColor: "bg-blue-100 text-blue-800"
    },
          {
      title: "Especialista en SEO",
      company: "Digital Growth Bolivia",
      service: "Servicio: Posicionamiento Web",
      location: "Quillacollo, Cochabamba",
      postedDate: "Publicado hace 3 días",
      salaryRange: "Bs 9,000 - Bs 14,000",
      employmentType: "Medio Tiempo",
      employmentTypeColor: "bg-blue-100 text-blue-800"
    },
    {
      title: "Project Manager",
      company: "Agile Solutions Bolivia",
      service: "Servicio: Gestión de Proyectos",
      location: "Cochabamba, Bolivia",
      postedDate: "Publicado hace 1 día",
      salaryRange: "Bs 18,000 - Bs 26,000",
      employmentType: "Tiempo Completo",
      employmentTypeColor: "bg-blue-100 text-blue-800"
    },
    {
      title: "Desarrollador Frontend",
      company: "TechBolivia Solutions",
      service: "Servicio: Desarrollo Web",
      location: "La Paz, Bolivia",
      postedDate: "Publicado hace 2 días",
      salaryRange: "Bs 12,000 - Bs 18,000",
      employmentType: "Tiempo Completo",
      employmentTypeColor: "bg-blue-100 text-blue-800"
    },
    {
      title: "Albañil de paredes",
      company: "Creative Studio Bolivia",
      service: "Servicio: Diseño Digital",
      location: "Santa Cruz, Bolivia",
      postedDate: "Publicado hace 4 días",
      salaryRange: "Bs 8,000 - Bs 15,000",
      employmentType: "Medio Tiempo",
      employmentTypeColor: "bg-blue-100 text-blue-800"
    },
    {
      title: "Albañil de techos",
      company: "Data Insights Bolivia",
      service: "Servicio: Análisis de Datos",
      location: "Cochabamba, Bolivia",
      postedDate: "Publicado hace 5 días",
      salaryRange: "Bs 10,000 - Bs 16,000",
      employmentType: "Tiempo Completo",
      employmentTypeColor: "bg-blue-100 text-blue-800"
    },
    {
      title: "Marketing Digital",
      company: "Growth Marketing Bolivia",
      service: "Servicio: Marketing Online",
      location: "La Paz, Bolivia",
      postedDate: "Publicado hace 6 días",
      salaryRange: "Bs 7,000 - Bs 12,000",
      employmentType: "Medio Tiempo",
      employmentTypeColor: "bg-blue-100 text-blue-800"
    },
    {
      title: "Desarrollador Backend",
      company: "Backend Solutions Bolivia",
      service: "Servicio: Desarrollo de APIs",
      location: "Santa Cruz, Bolivia",
      postedDate: "Publicado hace 7 días",
      salaryRange: "Bs 14,000 - Bs 22,000",
      employmentType: "Tiempo Completo",
      employmentTypeColor: "bg-blue-100 text-blue-800"
    },
    {
      title: "Community Manager",
      company: "Social Media Bolivia",
      service: "Servicio: Gestión de Redes",
      location: "Cochabamba, Bolivia",
      postedDate: "Publicado hace 8 días",
      salaryRange: "Bs 6,000 - Bs 10,000",
      employmentType: "Medio Tiempo",
      employmentTypeColor: "bg-blue-100 text-blue-800"
    },
    {
      title: "DevOps Engineer",
      company: "Cloud Infrastructure Bolivia",
      service: "Servicio: Infraestructura Cloud",
      location: "La Paz, Bolivia",
      postedDate: "Publicado hace 9 días",
      salaryRange: "Bs 16,000 - Bs 25,000",
      employmentType: "Tiempo Completo",
      employmentTypeColor: "bg-blue-100 text-blue-800"
    },
    {
      title: "Copywriter",
      company: "Content Creation Bolivia",
      service: "Servicio: Redacción de Contenidos",
      location: "Santa Cruz, Bolivia",
      postedDate: "Publicado hace 10 días",
      salaryRange: "Bs 5,000 - Bs 9,000",
      employmentType: "Medio Tiempo",
      employmentTypeColor: "bg-blue-100 text-blue-800"
    },
    {
      title: "QA Tester",
      company: "Quality Assurance Bolivia",
      service: "Servicio: Testing de Software",
      location: "Cochabamba, Bolivia",
      postedDate: "Publicado hace 11 días",
      salaryRange: "Bs 8,000 - Bs 13,000",
      employmentType: "Tiempo Completo",
      employmentTypeColor: "bg-blue-100 text-blue-800"
    },
    {
      title: "Product Manager",
      company: "Product Strategy Bolivia",
      service: "Servicio: Gestión de Productos",
      location: "La Paz, Bolivia",
      postedDate: "Publicado hace 12 días",
      salaryRange: "Bs 20,000 - Bs 30,000",
      employmentType: "Tiempo Completo",
      employmentTypeColor: "bg-blue-100 text-blue-800"
    },
    {
      title: "Sales Representative",
      company: "Sales Force Bolivia",
      service: "Servicio: Ventas B2B",
      location: "Santa Cruz, Bolivia",
      postedDate: "Publicado hace 13 días",
      salaryRange: "Bs 9,000 - Bs 15,000",
      employmentType: "Tiempo Completo",
      employmentTypeColor: "bg-blue-100 text-blue-800"
    },
    {
      title: "Mobile Developer",
      company: "Mobile Apps Bolivia",
      service: "Servicio: Desarrollo Móvil",
      location: "Cochabamba, Bolivia",
      postedDate: "Publicado hace 14 días",
      salaryRange: "Bs 13,000 - Bs 20,000",
      employmentType: "Tiempo Completo",
      employmentTypeColor: "bg-blue-100 text-blue-800"
    },
    {
      title: "Graphic Designer",
      company: "Visual Design Bolivia",
      service: "Servicio: Diseño Gráfico",
      location: "La Paz, Bolivia",
      postedDate: "Publicado hace 15 días",
      salaryRange: "Bs 7,000 - Bs 12,000",
      employmentType: "Medio Tiempo",
      employmentTypeColor: "bg-blue-100 text-blue-800"
    },
          {
      title: "Especialista en SEO",
      company: "Digital Growth Bolivia",
      service: "Servicio: Posicionamiento Web",
      location: "Quillacollo, Cochabamba",
      postedDate: "Publicado hace 3 días",
      salaryRange: "Bs 9,000 - Bs 14,000",
      employmentType: "Medio Tiempo",
      employmentTypeColor: "bg-blue-100 text-blue-800"
    },
    {
      title: "Project Manager",
      company: "Agile Solutions Bolivia",
      service: "Servicio: Gestión de Proyectos",
      location: "Cochabamba, Bolivia",
      postedDate: "Publicado hace 1 día",
      salaryRange: "Bs 18,000 - Bs 26,000",
      employmentType: "Tiempo Completo",
      employmentTypeColor: "bg-blue-100 text-blue-800"
    },
    {
      title: "Desarrollador Frontend",
      company: "TechBolivia Solutions",
      service: "Servicio: Desarrollo Web",
      location: "La Paz, Bolivia",
      postedDate: "Publicado hace 2 días",
      salaryRange: "Bs 12,000 - Bs 18,000",
      employmentType: "Tiempo Completo",
      employmentTypeColor: "bg-blue-100 text-blue-800"
    },
    {
      title: "Diseñador UX/UI",
      company: "Creative Studio Bolivia",
      service: "Servicio: Diseño Digital",
      location: "Santa Cruz, Bolivia",
      postedDate: "Publicado hace 4 días",
      salaryRange: "Bs 8,000 - Bs 15,000",
      employmentType: "Medio Tiempo",
      employmentTypeColor: "bg-blue-100 text-blue-800"
    },
    {
      title: "Analista de Datos",
      company: "Data Insights Bolivia",
      service: "Servicio: Análisis de Datos",
      location: "Cochabamba, Bolivia",
      postedDate: "Publicado hace 5 días",
      salaryRange: "Bs 10,000 - Bs 16,000",
      employmentType: "Tiempo Completo",
      employmentTypeColor: "bg-blue-100 text-blue-800"
    },
    {
      title: "Marketing Digital",
      company: "Growth Marketing Bolivia",
      service: "Servicio: Marketing Online",
      location: "La Paz, Bolivia",
      postedDate: "Publicado hace 6 días",
      salaryRange: "Bs 7,000 - Bs 12,000",
      employmentType: "Medio Tiempo",
      employmentTypeColor: "bg-blue-100 text-blue-800"
    },
    {
      title: "Desarrollador Backend",
      company: "Backend Solutions Bolivia",
      service: "Servicio: Desarrollo de APIs",
      location: "Santa Cruz, Bolivia",
      postedDate: "Publicado hace 7 días",
      salaryRange: "Bs 14,000 - Bs 22,000",
      employmentType: "Tiempo Completo",
      employmentTypeColor: "bg-blue-100 text-blue-800"
    },
    {
      title: "Community Manager",
      company: "Social Media Bolivia",
      service: "Servicio: Gestión de Redes",
      location: "Cochabamba, Bolivia",
      postedDate: "Publicado hace 8 días",
      salaryRange: "Bs 6,000 - Bs 10,000",
      employmentType: "Medio Tiempo",
      employmentTypeColor: "bg-blue-100 text-blue-800"
    },
    {
      title: "DevOps Engineer",
      company: "Cloud Infrastructure Bolivia",
      service: "Servicio: Infraestructura Cloud",
      location: "La Paz, Bolivia",
      postedDate: "Publicado hace 9 días",
      salaryRange: "Bs 16,000 - Bs 25,000",
      employmentType: "Tiempo Completo",
      employmentTypeColor: "bg-blue-100 text-blue-800"
    },
    {
      title: "Copywriter",
      company: "Content Creation Bolivia",
      service: "Servicio: Redacción de Contenidos",
      location: "Santa Cruz, Bolivia",
      postedDate: "Publicado hace 10 días",
      salaryRange: "Bs 5,000 - Bs 9,000",
      employmentType: "Medio Tiempo",
      employmentTypeColor: "bg-blue-100 text-blue-800"
    },
    {
      title: "QA Tester",
      company: "Quality Assurance Bolivia",
      service: "Servicio: Testing de Software",
      location: "Cochabamba, Bolivia",
      postedDate: "Publicado hace 11 días",
      salaryRange: "Bs 8,000 - Bs 13,000",
      employmentType: "Tiempo Completo",
      employmentTypeColor: "bg-blue-100 text-blue-800"
    },
    {
      title: "Product Manager",
      company: "Product Strategy Bolivia",
      service: "Servicio: Gestión de Productos",
      location: "La Paz, Bolivia",
      postedDate: "Publicado hace 12 días",
      salaryRange: "Bs 20,000 - Bs 30,000",
      employmentType: "Tiempo Completo",
      employmentTypeColor: "bg-blue-100 text-blue-800"
    },
    {
      title: "Sales Representative",
      company: "Sales Force Bolivia",
      service: "Servicio: Ventas B2B",
      location: "Santa Cruz, Bolivia",
      postedDate: "Publicado hace 13 días",
      salaryRange: "Bs 9,000 - Bs 15,000",
      employmentType: "Tiempo Completo",
      employmentTypeColor: "bg-blue-100 text-blue-800"
    },
    {
      title: "Mobile Developer",
      company: "Mobile Apps Bolivia",
      service: "Servicio: Desarrollo Móvil",
      location: "Cochabamba, Bolivia",
      postedDate: "Publicado hace 14 días",
      salaryRange: "Bs 13,000 - Bs 20,000",
      employmentType: "Tiempo Completo",
      employmentTypeColor: "bg-blue-100 text-blue-800"
    },
    {
      title: "Graphic Designer",
      company: "Visual Design Bolivia",
      service: "Servicio: Diseño Gráfico",
      location: "La Paz, Bolivia",
      postedDate: "Publicado hace 15 días",
      salaryRange: "Bs 7,000 - Bs 12,000",
      employmentType: "Medio Tiempo",
      employmentTypeColor: "bg-blue-100 text-blue-800"
    },
    {
      title: "Desarrollador Full Stack",
      company: "Full Stack Solutions Bolivia",
      service: "Servicio: Desarrollo Web Completo",
      location: "Cochabamba, Bolivia",
      postedDate: "Publicado hace 16 días",
      salaryRange: "Bs 15,000 - Bs 25,000",
      employmentType: "Tiempo Completo",
      employmentTypeColor: "bg-blue-100 text-blue-800"
    },
    {
      title: "Especialista en Redes Sociales",
      company: "Social Media Pro Bolivia",
      service: "Servicio: Gestión de Redes Sociales",
      location: "Santa Cruz, Bolivia",
      postedDate: "Publicado hace 17 días",
      salaryRange: "Bs 6,500 - Bs 11,000",
      employmentType: "Medio Tiempo",
      employmentTypeColor: "bg-blue-100 text-blue-800"
    },
    {
      title: "Analista de Sistemas",
      company: "System Analysis Bolivia",
      service: "Servicio: Análisis de Sistemas",
      location: "La Paz, Bolivia",
      postedDate: "Publicado hace 18 días",
      salaryRange: "Bs 11,000 - Bs 17,000",
      employmentType: "Tiempo Completo",
      employmentTypeColor: "bg-blue-100 text-blue-800"
    },
    {
      title: "Diseñador de Interiores",
      company: "Interior Design Bolivia",
      service: "Servicio: Diseño de Interiores",
      location: "Cochabamba, Bolivia",
      postedDate: "Publicado hace 19 días",
      salaryRange: "Bs 8,500 - Bs 14,000",
      employmentType: "Medio Tiempo",
      employmentTypeColor: "bg-blue-100 text-blue-800"
    },
    {
      title: "Especialista en Marketing Digital",
      company: "Digital Marketing Pro Bolivia",
      service: "Servicio: Marketing Digital Avanzado",
      location: "Santa Cruz, Bolivia",
      postedDate: "Publicado hace 20 días",
      salaryRange: "Bs 9,000 - Bs 16,000",
      employmentType: "Tiempo Completo",
      employmentTypeColor: "bg-blue-100 text-blue-800"
    },
    {
      title: "Desarrollador de Videojuegos",
      company: "Game Studio Bolivia",
      service: "Servicio: Desarrollo de Videojuegos",
      location: "La Paz, Bolivia",
      postedDate: "Publicado hace 21 días",
      salaryRange: "Bs 12,000 - Bs 20,000",
      employmentType: "Tiempo Completo",
      employmentTypeColor: "bg-blue-100 text-blue-800"
    },
    {
      title: "Especialista en Recursos Humanos",
      company: "HR Solutions Bolivia",
      service: "Servicio: Gestión de Recursos Humanos",
      location: "Cochabamba, Bolivia",
      postedDate: "Publicado hace 22 días",
      salaryRange: "Bs 7,500 - Bs 13,000",
      employmentType: "Tiempo Completo",
      employmentTypeColor: "bg-blue-100 text-blue-800"
    },
    {
      title: "Consultor Financiero",
      company: "Financial Consulting Bolivia",
      service: "Servicio: Consultoría Financiera",
      location: "Santa Cruz, Bolivia",
      postedDate: "Publicado hace 23 días",
      salaryRange: "Bs 18,000 - Bs 28,000",
      employmentType: "Tiempo Completo",
      employmentTypeColor: "bg-blue-100 text-blue-800"
    },
    {
      title: "Especialista en Logística",
      company: "Logistics Pro Bolivia",
      service: "Servicio: Gestión Logística",
      location: "La Paz, Bolivia",
      postedDate: "Publicado hace 24 días",
      salaryRange: "Bs 10,000 - Bs 16,000",
      employmentType: "Tiempo Completo",
      employmentTypeColor: "bg-blue-100 text-blue-800"
    },
    {
      title: "Diseñador Web",
      company: "Web Design Studio Bolivia",
      service: "Servicio: Diseño Web",
      location: "Cochabamba, Bolivia",
      postedDate: "Publicado hace 25 días",
      salaryRange: "Bs 8,000 - Bs 14,000",
      employmentType: "Medio Tiempo",
      employmentTypeColor: "bg-blue-100 text-blue-800"
    },
    {
      title: "Especialista en Ventas Online",
      company: "E-commerce Solutions Bolivia",
      service: "Servicio: Ventas Digitales",
      location: "Santa Cruz, Bolivia",
      postedDate: "Publicado hace 26 días",
      salaryRange: "Bs 7,000 - Bs 12,000",
      employmentType: "Medio Tiempo",
      employmentTypeColor: "bg-blue-100 text-blue-800"
    },
    {
      title: "Desarrollador Python",
      company: "Python Solutions Bolivia",
      service: "Servicio: Desarrollo Python",
      location: "La Paz, Bolivia",
      postedDate: "Publicado hace 27 días",
      salaryRange: "Bs 13,000 - Bs 21,000",
      employmentType: "Tiempo Completo",
      employmentTypeColor: "bg-blue-100 text-blue-800"
    },
    {
      title: "Especialista en Fotografía",
      company: "Photo Studio Bolivia",
      service: "Servicio: Fotografía Profesional",
      location: "Cochabamba, Bolivia",
      postedDate: "Publicado hace 28 días",
      salaryRange: "Bs 6,000 - Bs 10,000",
      employmentType: "Medio Tiempo",
      employmentTypeColor: "bg-blue-100 text-blue-800"
    },
    {
      title: "Analista de Marketing",
      company: "Marketing Analytics Bolivia",
      service: "Servicio: Análisis de Marketing",
      location: "Santa Cruz, Bolivia",
      postedDate: "Publicado hace 29 días",
      salaryRange: "Bs 9,500 - Bs 15,000",
      employmentType: "Tiempo Completo",
      employmentTypeColor: "bg-blue-100 text-blue-800"
    },
    {
      title: "Desarrollador Java",
      company: "Java Solutions Bolivia",
      service: "Servicio: Desarrollo Java",
      location: "La Paz, Bolivia",
      postedDate: "Publicado hace 30 días",
      salaryRange: "Bs 14,000 - Bs 22,000",
      employmentType: "Tiempo Completo",
      employmentTypeColor: "bg-blue-100 text-blue-800"
    },
    {
      title: "Especialista en Contabilidad",
      company: "Accounting Pro Bolivia",
      service: "Servicio: Contabilidad",
      location: "Cochabamba, Bolivia",
      postedDate: "Publicado hace 31 días",
      salaryRange: "Bs 8,000 - Bs 13,000",
      employmentType: "Tiempo Completo",
      employmentTypeColor: "bg-blue-100 text-blue-800"
    },
    {
      title: "Diseñador de Productos",
      company: "Product Design Bolivia",
      service: "Servicio: Diseño de Productos",
      location: "Santa Cruz, Bolivia",
      postedDate: "Publicado hace 32 días",
      salaryRange: "Bs 11,000 - Bs 18,000",
      employmentType: "Tiempo Completo",
      employmentTypeColor: "bg-blue-100 text-blue-800"
    },
    {
      title: "Especialista en Seguridad Informática",
      company: "Cyber Security Bolivia",
      service: "Servicio: Seguridad Informática",
      location: "La Paz, Bolivia",
      postedDate: "Publicado hace 33 días",
      salaryRange: "Bs 16,000 - Bs 26,000",
      employmentType: "Tiempo Completo",
      employmentTypeColor: "bg-blue-100 text-blue-800"
    },
    {
      title: "Desarrollador React Native",
      company: "Mobile Development Bolivia",
      service: "Servicio: Desarrollo Móvil React Native",
      location: "Cochabamba, Bolivia",
      postedDate: "Publicado hace 34 días",
      salaryRange: "Bs 12,000 - Bs 20,000",
      employmentType: "Tiempo Completo",
      employmentTypeColor: "bg-blue-100 text-blue-800"
    },
    {
      title: "Especialista en Comercio Electrónico",
      company: "E-commerce Pro Bolivia",
      service: "Servicio: Comercio Electrónico",
      location: "Santa Cruz, Bolivia",
      postedDate: "Publicado hace 35 días",
      salaryRange: "Bs 10,000 - Bs 17,000",
      employmentType: "Tiempo Completo",
      employmentTypeColor: "bg-blue-100 text-blue-800"
    }
  ];
  
  // Eliminar duplicados basándose en título y empresa para mantener orden consistente
  const uniqueJobs = jobs.filter((job, index, self) => 
    index === self.findIndex(j => j.title === job.title && j.company === job.company)
  );
  
  return uniqueJobs;
};
