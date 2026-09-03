/**
 * SOFTVISION TECH — Datos Semilla Iniciales
 * Representación inicial para entornos de desarrollo y evaluación interactiva
 */

import { Category, Business, Review, SecurityAlert, UserProfile } from '../models/types';

export const INITIAL_USERS: UserProfile[] = [
  {
    uid: 'user-admin-01',
    email: 'admin@softvision.tech',
    displayName: 'Carlos Mendoza (Admin Softvision)',
    role: 'admin',
    photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    phone: '+57 310 998 8776',
    createdAt: '2026-01-15T08:00:00Z'
  },
  {
    uid: 'user-dueno-01',
    email: 'lucia.panaderia@gmail.com',
    displayName: 'Lucía Morales (Comerciante)',
    role: 'dueno',
    photoURL: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    phone: '+57 315 443 2190',
    createdAt: '2026-02-01T10:30:00Z'
  },
  {
    uid: 'user-cliente-01',
    email: 'esteban.vecino@gmail.com',
    displayName: 'Esteban Valencia (Vecino)',
    role: 'usuario',
    photoURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    phone: '+57 320 876 5432',
    createdAt: '2026-02-10T14:15:00Z'
  }
];

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat-alimentacion',
    name: 'Alimentación',
    slug: 'alimentacion',
    iconName: 'UtensilsCrossed',
    description: 'Restaurantes, panaderías, cafeterías, reposterías y mercados locales',
    businessCount: 3
  },
  {
    id: 'cat-salud',
    name: 'Salud & Farmacia',
    slug: 'salud',
    iconName: 'HeartPulse',
    description: 'Farmacias, consultorios médicos, clínicas dentales y ópticas',
    businessCount: 2
  },
  {
    id: 'cat-reparaciones',
    name: 'Reparaciones & Mantenimiento',
    slug: 'reparaciones',
    iconName: 'Wrench',
    description: 'Talleres mecánicos, plomería, electricidad y reparación de electrodomésticos',
    businessCount: 2
  },
  {
    id: 'cat-belleza',
    name: 'Belleza & Cuidado Personal',
    slug: 'belleza',
    iconName: 'Sparkles',
    description: 'Barberías, peluquerías, centros de estética y spas comunitarios',
    businessCount: 2
  },
  {
    id: 'cat-hogar',
    name: 'Hogar & Ferretería',
    slug: 'hogar',
    iconName: 'Home',
    description: 'Ferreterías, carpintería, artículos para el hogar, decoración y cerrajería',
    businessCount: 2
  },
  {
    id: 'cat-tecnologia',
    name: 'Tecnología & Celulares',
    slug: 'tecnologia',
    iconName: 'Smartphone',
    description: 'Soporte técnico de computadores, reparación de celulares y venta de accesorios',
    businessCount: 1
  },
  {
    id: 'cat-educacion',
    name: 'Educación & Cursos',
    slug: 'educacion',
    iconName: 'GraduationCap',
    description: 'Refuerzo escolar, academias de idiomas, cursos artísticos y deportivos',
    businessCount: 1
  }
];

export const INITIAL_BUSINESSES: Business[] = [
  {
    id: 'biz-01',
    name: 'Panadería y Café La Espiga Dorada',
    categoryId: 'cat-alimentacion',
    categoryName: 'Alimentación',
    address: 'Carrera 14 # 45-20, Barrio Central',
    zone: 'Comuna 1 - Centro',
    phone: '+57 312 456 7890',
    whatsapp: '573124567890',
    email: 'contacto@laespigadorada.com',
    website: 'https://laespigadorada.com',
    hours: {
      lunesViernes: '06:00 AM - 08:30 PM',
      sabado: '06:30 AM - 09:00 PM',
      domingo: '07:00 AM - 07:00 PM'
    },
    description: 'Tradición familiar desde hace más de 18 años. Horneamos diariamente pan campesino, croissants de mantequilla, pandebonos recién salidos y café de origen tostado por productores de la región.',
    services: ['Panadería artesanal', 'Cafetería de especialidad', 'Desayunos', 'Tortas por encargo', 'Domicilios al barrio'],
    imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop&q=80',
    ownerId: 'user-dueno-01',
    ownerName: 'Lucía Morales',
    ratingAverage: 4.8,
    reviewCount: 14,
    status: 'aprobado',
    createdAt: '2026-01-20T09:00:00Z',
    updatedAt: '2026-02-15T10:00:00Z',
    featured: true
  },
  {
    id: 'biz-02',
    name: 'Droguería & Farmacia San Jerónimo',
    categoryId: 'cat-salud',
    categoryName: 'Salud & Farmacia',
    address: 'Calle 38 # 19-14, Frente al Parque Principal',
    zone: 'Comuna 2 - Los Cedros',
    phone: '+57 300 987 6543',
    whatsapp: '573009876543',
    email: 'drogueriasanjeronimo@gmail.com',
    hours: {
      lunesViernes: '07:00 AM - 10:00 PM',
      sabado: '07:00 AM - 10:00 PM',
      domingo: '08:00 AM - 08:00 PM'
    },
    description: 'Medicamentos garantizados de laboratorios certificados, toma de presión arterial, inyectología certificada, suplementos nutricionales y productos para el cuidado de recién nacidos.',
    services: ['Medicamentos formulados', 'Toma de presión', 'Inyectología', 'Cuidado para bebés', 'Domicilios inmediatos'],
    imageUrl: 'https://images.unsplash.com/photo-1586015555751-63c2c1a01725?w=800&auto=format&fit=crop&q=80',
    ownerId: 'user-dueno-01',
    ownerName: 'Lucía Morales',
    ratingAverage: 4.9,
    reviewCount: 9,
    status: 'aprobado',
    createdAt: '2026-01-22T11:00:00Z',
    updatedAt: '2026-02-18T14:30:00Z',
    featured: true
  },
  {
    id: 'biz-03',
    name: 'Taller Mecánico & Frenos El Pistón',
    categoryId: 'cat-reparaciones',
    categoryName: 'Reparaciones & Mantenimiento',
    address: 'Avenida Bolivariana # 52-11',
    zone: 'Comuna 4 - San Juan',
    phone: '+57 318 654 3210',
    whatsapp: '573186543210',
    hours: {
      lunesViernes: '08:00 AM - 06:00 PM',
      sabado: '08:00 AM - 02:00 PM',
      domingo: 'Cerrado'
    },
    description: 'Diagnóstico computarizado para vehículos multimarca. Sincronización de motor, cambio de aceite, suspensión, frenos ABS y alineación láser con técnicos certificados.',
    services: ['Escáner automotriz', 'Mantenimiento preventivo', 'Cambio de pastillas y discos', 'Suspensión', 'Repuestos originales'],
    imageUrl: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=800&auto=format&fit=crop&q=80',
    ownerId: 'user-dueno-02',
    ownerName: 'Jorge Cardona',
    ratingAverage: 4.6,
    reviewCount: 11,
    status: 'aprobado',
    createdAt: '2026-01-25T14:00:00Z',
    updatedAt: '2026-02-12T16:00:00Z'
  },
  {
    id: 'biz-04',
    name: 'Barbería y Peluquería Vintage Cuts',
    categoryId: 'cat-belleza',
    categoryName: 'Belleza & Cuidado Personal',
    address: 'Carrera 11 # 28-50, Local 3',
    zone: 'Comuna 1 - Centro',
    phone: '+57 314 222 3344',
    whatsapp: '573142223344',
    hours: {
      lunesViernes: '09:00 AM - 08:00 PM',
      sabado: '08:30 AM - 08:30 PM',
      domingo: '10:00 AM - 04:00 PM'
    },
    description: 'Estilo clásico y cortes vanguardistas. Ritual de afeitado tradicional con toalla caliente, perfilado de barba, tratamientos capilares y venta de pomadas premium.',
    services: ['Corte de cabello masculino y niños', 'Perfilado de barba', 'Toalla caliente', 'Colorimetría capilar'],
    imageUrl: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&auto=format&fit=crop&q=80',
    ownerId: 'user-dueno-03',
    ownerName: 'Mateo Restrepo',
    ratingAverage: 4.7,
    reviewCount: 18,
    status: 'aprobado',
    createdAt: '2026-01-28T16:20:00Z',
    updatedAt: '2026-02-20T11:10:00Z',
    featured: true
  },
  {
    id: 'biz-05',
    name: 'Ferretería & Pinturas El Constructor',
    categoryId: 'cat-hogar',
    categoryName: 'Hogar & Ferretería',
    address: 'Calle 42 # 15-30',
    zone: 'Comuna 3 - Primavera',
    phone: '+57 311 555 7788',
    whatsapp: '573115557788',
    hours: {
      lunesViernes: '07:30 AM - 06:30 PM',
      sabado: '07:30 AM - 05:00 PM',
      domingo: '08:00 AM - 01:00 PM'
    },
    description: 'Todo para sus remodelaciones y reparaciones del hogar: tuberías PVC, herramientas eléctricas, tornillería por unidad o caja, iluminación LED, impermeabilizantes y preparación de color en pinturas.',
    services: ['Herramientas manuales y eléctricas', 'Preparación computarizada de pintura', 'Plomería y electricidad', 'Cerrajería y copias de llaves'],
    imageUrl: 'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?w=800&auto=format&fit=crop&q=80',
    ownerId: 'user-dueno-04',
    ownerName: 'Rodrigo Gómez',
    ratingAverage: 4.5,
    reviewCount: 7,
    status: 'aprobado',
    createdAt: '2026-02-02T10:00:00Z',
    updatedAt: '2026-02-22T09:00:00Z'
  },
  {
    id: 'biz-06',
    name: 'Soporte Tech & Reparación de Celulares iFix',
    categoryId: 'cat-tecnologia',
    categoryName: 'Tecnología & Celulares',
    address: 'Centro Comercial La Casona, Local 112',
    zone: 'Comuna 1 - Centro',
    phone: '+57 319 888 4411',
    whatsapp: '573198884411',
    hours: {
      lunesViernes: '09:30 AM - 07:00 PM',
      sabado: '10:00 AM - 06:00 PM',
      domingo: 'Cerrado'
    },
    description: 'Especialistas en cambio de pantallas, baterías originales, rescate de equipos mojados, mantenimiento térmico de laptops, instalación de software y venta de cargadores homologados.',
    services: ['Cambio de pantallas en 1 hora', 'Mantenimiento de computadores', 'Accesorios certificados', 'Recuperación de datos'],
    imageUrl: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=80',
    ownerId: 'user-dueno-05',
    ownerName: 'Andrea Pineda',
    ratingAverage: 4.9,
    reviewCount: 16,
    status: 'aprobado',
    createdAt: '2026-02-05T13:40:00Z',
    updatedAt: '2026-02-25T15:20:00Z'
  },
  {
    id: 'biz-07',
    name: 'Restaurante y Asados Donde Don Pedro',
    categoryId: 'cat-alimentacion',
    categoryName: 'Alimentación',
    address: 'Calle 50 # 22-18',
    zone: 'Comuna 2 - Los Cedros',
    phone: '+57 316 777 9900',
    hours: {
      lunesViernes: '11:30 AM - 04:00 PM',
      sabado: '11:30 AM - 06:00 PM',
      domingo: '11:30 AM - 06:00 PM'
    },
    description: 'Los mejores almuerzos ejecutivos con sazón casera, cortes de carne al carbón, sancocho tradicional de fin de semana y jugos naturales en agua o leche.',
    services: ['Almuerzos ejecutivos', 'Carnes al carbón', 'Platos típicos los fines de semana', 'Atención de eventos familiares'],
    imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80',
    ownerId: 'user-dueno-06',
    ownerName: 'Pedro Nel Giraldo',
    ratingAverage: 4.4,
    reviewCount: 8,
    status: 'pendiente', // Negocio registrado recientemente para moderación
    createdAt: '2026-02-28T16:00:00Z',
    updatedAt: '2026-02-28T16:00:00Z'
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-01',
    businessId: 'biz-01',
    userId: 'user-cliente-01',
    userName: 'Esteban Valencia',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    rating: 5,
    comment: '¡El mejor pan de chocolate del municipio! Voy casi todos los días por el café de la mañana. La atención de doña Lucía es insuperable y siempre tienen pan calientito.',
    createdAt: '2026-02-12T09:30:00Z',
    status: 'visible',
    helpfulVotes: 6
  },
  {
    id: 'rev-02',
    businessId: 'biz-01',
    userId: 'user-cliente-02',
    userName: 'Camila Ospina',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
    rating: 5,
    comment: 'Excelente servicio y puntualidad con un pedido especial para el cumpleaños de mi mamá. La torta de zanahoria estaba deliciosa y con la cantidad justa de dulce.',
    createdAt: '2026-02-18T16:45:00Z',
    status: 'visible',
    helpfulVotes: 4
  },
  {
    id: 'rev-03',
    businessId: 'biz-02',
    userId: 'user-cliente-01',
    userName: 'Esteban Valencia',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    rating: 5,
    comment: 'Muy amables y serviciales. Tuve una urgencia con una receta en la noche y el domicilio llegó en menos de 15 minutos. Totalmente recomendados.',
    createdAt: '2026-02-19T21:10:00Z',
    status: 'visible',
    helpfulVotes: 3
  },
  {
    id: 'rev-04',
    businessId: 'biz-04',
    userId: 'user-cliente-03',
    userName: 'David Zuluaga',
    userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
    rating: 5,
    comment: 'Mateo es un maestro con la tijera y la navaja. El ambiente de la barbería es relajante y la toalla caliente al final es una maravilla.',
    createdAt: '2026-02-24T18:00:00Z',
    status: 'visible',
    helpfulVotes: 5
  },
  {
    id: 'rev-05',
    businessId: 'biz-03',
    userId: 'user-cliente-04',
    userName: 'Mariana Duarte',
    userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=80',
    rating: 4,
    comment: 'Diagnóstico muy honesto. En otro taller me querían cambiar toda la bomba de agua, acá me explicaron que solo era una abrazadera suelta. Ahorré mucho dinero.',
    createdAt: '2026-02-21T11:20:00Z',
    status: 'visible',
    helpfulVotes: 8
  }
];

export const INITIAL_ALERTS: SecurityAlert[] = [
  {
    id: 'alert-01',
    timestamp: '2026-09-03T11:45:00Z',
    eventType: 'XSS_ATTEMPT',
    title: 'Intento de Inyección de Script en Formulario de Negocio',
    description: 'Detección y sanitización automática de payload `<script>document.cookie</script>` en el campo de descripción.',
    severity: 'alta',
    status: 'resuelta',
    sourceIp: '192.168.1.144',
    targetEntity: 'businesses',
    actionTaken: 'Entrada sanitizada y neutralizada; token de sesión advertido.'
  },
  {
    id: 'alert-02',
    timestamp: '2026-09-03T12:10:00Z',
    eventType: 'RATE_LIMIT_EXCEEDED',
    title: 'Límite de Solicitudes Superado (Rate Limit)',
    description: 'Dirección IP emitió 18 solicitudes de creación de comentarios en menos de 60 segundos hacia biz-01.',
    severity: 'media',
    status: 'activa',
    sourceIp: '186.84.92.12',
    targetEntity: 'reviews',
    targetId: 'biz-01',
    actionTaken: 'Bloqueo temporal por 15 minutos en el cliente y limitación de escritura.'
  }
];
