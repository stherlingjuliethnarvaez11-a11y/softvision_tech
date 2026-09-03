# Softvision Tech — Directorio Digital de Negocios Locales
> **"Tu comunidad a un solo clic"**

Plataforma web integral desarrollada con arquitectura **MVC (Modelo-Vista-Controlador)** sobre **React, TypeScript, Tailwind CSS y Firebase**, diseñada para conectar a los vecinos con los comercios y servicios locales de su municipio y barrios, impulsando la economía comunitaria con información confiable, veraz y segura.

---

## 1. Identidad Institucional

- **Empresa:** Softvision Tech
- **Eslogan:** *"Tu comunidad a un solo clic"*
- **Misión:** Desarrollar una plataforma digital accesible y confiable que reúna, organice y muestre la información de los negocios y servicios de la zona, facilitando a las personas la búsqueda de lo que necesitan y ayudando a los comerciantes locales a darse a conocer y conectar con sus vecinos.
- **Visión (2028):** Ser el directorio digital de referencia en los municipios y barrios de la región, reconocido por impulsar el comercio local, facilitar información veraz y actualizada, y fortalecer los lazos entre vecinos y comerciantes.

---

## 2. Arquitectura del Sistema: Patrón MVC Adaptado a React SPA

La aplicación implementa rigurosamente el patrón **Modelo-Vista-Controlador (MVC)**, desacoplando completamente las responsabilidades de datos, lógica de negocio y presentación visual:

```
src/
├── models/             # MODELOS: Entidades de dominio, interfaces TypeScript y contratos
│   └── types.ts        # (User, Business, Category, Review, SecurityAlert, BusinessHours)
│
├── services/           # CAPA DE DATOS Y SERVICIOS: Acceso a datos y APIs
│   ├── firebase.ts     # Adaptador de Firebase Firestore y Auth
│   ├── authService.ts  # Servicio de autenticación, sesiones y RBAC
│   ├── businessService.ts # CRUD de negocios con persistencia y filtrado
│   ├── reviewService.ts   # Gestión de reseñas, cálculo de promedio y reportes
│   ├── securityService.ts # Motor SIEM, sanitización anti-XSS, rate limiting y alertas en vivo
│   └── mockData.ts     # Semilla inicial con datos verídicos de comercios locales
│
├── controllers/        # CONTROLADORES: Custom Hooks con la lógica de negocio y estado
│   ├── useAuthController.ts     # Orquestación de login, registro, roles y sesión
│   ├── useBusinessController.ts # Búsqueda reactiva, filtros por zona/categoría y creación
│   ├── useReviewController.ts   # Interacción con reseñas, votos de utilidad y anti-spam
│   ├── useAdminController.ts    # Moderación de comercios, censura de reseñas y categorías
│   └── useSecurityController.ts # Monitoreo reactivo de alertas de seguridad y simulador
│
├── views/              # VISTAS: Pantallas orquestadas libres de lógica de backend
│   ├── HomeView.tsx             # Directorio principal con hero banner y buscador
│   ├── BusinessDetailView.tsx   # Perfil del comercio, horarios, contacto y opiniones
│   ├── RegisterBusinessView.tsx # Formulario de alta para comerciantes
│   ├── AdminDashboardView.tsx   # Panel de moderación y métricas
│   └── SecurityCenterView.tsx   # Centro de ciberseguridad, SIEM y reporte de pentesting
│
├── components/         # COMPONENTES PRESENTACIONALES REUTILIZABLES
│   ├── Navbar.tsx            # Barra de navegación con simulador RBAC y badges en vivo
│   ├── Footer.tsx            # Pie institucional con misión, visión y enlaces
│   ├── BusinessCard.tsx      # Tarjeta del negocio con horarios, zona y calificación
│   ├── CategoryPills.tsx     # Selector horizontal de categorías
│   ├── RatingStars.tsx       # Componente de 1-5 estrellas accesible
│   ├── AuthModal.tsx         # Modal de ingreso / cambio de rol
│   ├── ReviewModal.tsx       # Modal para calificar comercio con sanitización
│   └── ScrumTeamDrawer.tsx   # Panel interactivo del equipo Scrum, debates y DoD
│
└── config/
    └── firebaseConfig.ts     # Inicialización segura de Firebase
```

---

## 3. Matriz de Seguridad y Roles (RBAC)

El sistema aplica el **Principio de Mínimo Privilegio** tanto en cliente como en el motor de reglas de Firestore (`firestore.rules`):

| Capacidad / Acción | Visitante | Usuario (Vecino) | Dueño de Comercio | Administrador |
| :--- | :---: | :---: | :---: | :---: |
| Consultar negocios aprobados | ✅ | ✅ | ✅ | ✅ |
| Buscar por texto, zona o categoría | ✅ | ✅ | ✅ | ✅ |
| Contactar vía WhatsApp o Teléfono | ✅ | ✅ | ✅ | ✅ |
| Escribir reseñas y calificar (1-5 estrellas) | ❌ | ✅ | ✅ | ✅ |
| Votar reseñas útiles o reportar abuso | ❌ | ✅ | ✅ | ✅ |
| Registrar nuevos comercios | ❌ | ❌ | ✅ | ✅ |
| Editar comercios propios | ❌ | ❌ | ✅ | ✅ |
| Aprobar / Rechazar comercios en moderación | ❌ | ❌ | ❌ | ✅ |
| Moderar y ocultar reseñas reportadas | ❌ | ❌ | ❌ | ✅ |
| Crear y administrar categorías del directorio | ❌ | ❌ | ❌ | ✅ |
| Acceder al SIEM y auditoría de ciberseguridad | ❌ | ❌ | ❌ | ✅ |

### Defensas Implementadas en Código:
1. **Prevención de XSS:** Todo texto entrante pasa por `securityService.inspectAndSanitize()`, el cual detecta etiquetas de scripting (`<script>`, `onerror=`, `javascript:`) y codifica entidades HTML.
2. **Control de Tasa (Rate Limiting):** Límite estricto de máximo 3 reseñas por minuto por usuario/IP para neutralizar ataques de spam o denegación de servicio a la reputación.
3. **Flujo de Moderación Obligatorio:** Nuevos comercios siempre ingresan en estado `pendiente`, impidiendo que comerciantes maliciosos publiquen información falsa sin validación previa.

---

## 4. Guía de Instalación y Ejecución Local

### Prerrequisitos
- **Node.js**: Versión 18.0.0 o superior
- **NPM**: Versión 9.0.0 o superior

### Pasos de Instalación
1. Clonar el repositorio o descargar el paquete fuente:
   ```bash
   git clone https://github.com/softvision-tech/directorio-local.git
   cd directorio-local
   ```

2. Instalar dependencias del proyecto:
   ```bash
   npm install
   ```

3. Configurar variables de entorno:
   Copiar `.env.example` a `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

   Editar los valores con las credenciales de tu consola de Firebase:
   ```env
   VITE_FIREBASE_API_KEY=tu_api_key_aqui
   VITE_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=tu_proyecto_id
   VITE_FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
   VITE_FIREBASE_APP_ID=tu_app_id
   ```
   *(Nota: La aplicación cuenta con modo de resiliencia fallback local con almacenamiento simulado en `localStorage` para pruebas sin conexión inmediata).*

4. Iniciar el servidor de desarrollo:
   ```bash
   npm run dev
   ```
   La aplicación estará disponible en `http://localhost:3000`.

5. Compilar para producción:
   ```bash
   npm run build
   ```

---

## 5. Despliegue de Reglas de Seguridad en Firebase

Para aplicar las reglas de seguridad de Firestore generadas en el proyecto:

```bash
# 1. Iniciar sesión en Firebase CLI
firebase login

# 2. Seleccionar el proyecto
firebase use tu_proyecto_id

# 3. Desplegar reglas de Firestore
firebase deploy --only firestore:rules
```

El archivo `firestore.rules` ubicado en la raíz del proyecto asegura:
- Comprobación estricta de pertenencia para edición de comercios (`request.auth.uid == resource.data.ownerId`).
- Solo usuarios con rol `admin` pueden mutar el campo `status` a `'aprobado'` o `'rechazado'`.
- Reseñas con validación de rango de estrellas (`rating >= 1 && rating <= 5`).

---

## 6. Guía de Uso por Rol

- **Visitante (Público general):**
  - Accede a la pantalla principal para buscar negocios por nombre, categoría o zona comunal.
  - Da clic en cualquier tarjeta para ver horarios de atención, teléfonos de contacto y botón directo de WhatsApp.
  - En la barra superior, utiliza el selector **"Rol"** para alternar a **"Usuario"**, **"Comerciante"** o **"Admin"** y probar los flujos interactivos.

- **Usuario / Vecino:**
  - Puede calificar cualquier comercio con 1 a 5 estrellas y escribir su comentario.
  - Vota reseñas útiles de otros vecinos o reporta comentarios inadecuados.

- **Dueño de Comercio:**
  - Hace clic en **"Registrar Negocio"**.
  - Completa los datos: nombre, categoría, zona, dirección, teléfonos, horarios de atención, servicios y fotografía.
  - El comercio queda enviado a revisión en estado *Pendiente*.

- **Administrador:**
  - Ingresa a **"Moderación Admin"** en el Navbar.
  - En la pestaña *Moderar Negocios*, revisa las solicitudes pendientes y hace clic en **"Aprobar"** o **"Rechazar"**.
  - En la pestaña *Moderar Reseñas*, atiende reportes de spam u ofensas y puede ocultar o restaurar opiniones.
  - En la pestaña *Categorías*, crea nuevos sectores comerciales según el crecimiento del municipio.

- **Analista de Seguridad / Auditor:**
  - Ingresa a **"Ciberseguridad"** en el Navbar.
  - Visualiza el flujo de alertas automáticas en tiempo real (SIEM).
  - Utiliza el **Simulador de Vectores de Ataque** para probar inyecciones XSS, saturación de peticiones o intentos de escalamiento RBAC.
  - Consulta el **Informe de Pruebas de Penetración** y el **Changelog**.

---

## 7. Roadmap Futuro

- **Sprint 4 (En curso):**
  - Integración de geolocalización interactiva con mapas GPS comunitarios.
  - Implementación de verificación vía SMS OTP para reclamo de negocios existentes.
  - Despliegue de cabeceras CSP (*Content Security Policy*) estrictas.
- **Sprint 5:**
  - Notificaciones Push para ofertas y avisos de emergencia barriales.
  - Módulo de eventos comunitarios y ferias comerciales de la alcaldía local.
  - Aplicación PWA con soporte offline para zonas de baja conectividad.

---

## 8. Gobernanza y Equipo Scrum Simulado

El desarrollo fue conducido bajo marco ágil Scrum por el equipo multidisciplinario:
- **Product Owner:** Valeria Restrepo
- **Scrum Master:** Mateo Osorio
- **Arquitecto de Software:** Daniel Henao
- **Dev Frontend (React):** Sofía Arango
- **Dev Backend / Firebase:** Camilo Torres
- **QA / Tester:** Laura Betancur
- **UX/UI Designer:** Felipe Jaramillo
- **Security Engineer:** Andrés Villada

Para explorar los debates de autoretroalimentación por épica y la *Definition of Done*, haz clic en el botón **"Equipo Scrum"** en el menú superior de la aplicación.
