/**
 * SOFTVISION TECH — Panel Interactivo del Equipo Scrum Simulado
 * Presenta roles, debates de autoretroalimentación, backlog por sprints y DoD
 */

import React, { useState } from 'react';
import { 
  X, 
  Users, 
  CheckCircle2, 
  ShieldAlert, 
  Code, 
  Sparkles, 
  Bug, 
  Layers, 
  MessageSquareQuote,
  ChevronRight,
  ShieldCheck,
  Zap
} from 'lucide-react';

interface ScrumTeamDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ScrumTeamDrawer: React.FC<ScrumTeamDrawerProps> = ({
  isOpen,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'feedback' | 'backlog' | 'roles' | 'dod'>('feedback');

  if (!isOpen) return null;

  const rolesList = [
    {
      title: 'Product Owner',
      name: 'Valeria Restrepo',
      icon: Users,
      color: 'bg-indigo-100 text-indigo-700',
      focus: 'Alineación estratégica con la misión de Softvision Tech ("Tu comunidad a un solo clic") y valor de negocio.'
    },
    {
      title: 'Scrum Master',
      name: 'Mateo Osorio',
      icon: Zap,
      color: 'bg-emerald-100 text-emerald-700',
      focus: 'Gestión de sprints, remoción de impedimentos, trazabilidad y cadencia ágil.'
    },
    {
      title: 'Arquitecto de Software',
      name: 'Daniel Henao',
      icon: Layers,
      color: 'bg-blue-100 text-blue-700',
      focus: 'Patrón MVC para React SPA, diseño desacoplado (Models, Services, Controllers, Views) y escalabilidad.'
    },
    {
      title: 'Dev Frontend (React)',
      name: 'Sofía Arango',
      icon: Code,
      color: 'bg-cyan-100 text-cyan-700',
      focus: 'Componentización limpia, hooks controladores, accesibilidad y experiencia reactiva sin lag.'
    },
    {
      title: 'Dev Backend / Firebase',
      name: 'Camilo Torres',
      icon: Layers,
      color: 'bg-amber-100 text-amber-700',
      focus: 'Modelado en Firestore (users, businesses, reviews, security_alerts) y adaptadores persistentes.'
    },
    {
      title: 'QA / Tester',
      name: 'Laura Betancur',
      icon: Bug,
      color: 'bg-purple-100 text-purple-700',
      focus: 'Casos de prueba funcionales, validaciones límite de formularios y aserciones de consistencia.'
    },
    {
      title: 'UX/UI Designer',
      name: 'Felipe Jaramillo',
      icon: Sparkles,
      color: 'bg-pink-100 text-pink-700',
      focus: 'Flujos intuitivos de búsqueda, jerarquía visual, microinteracciones y ergonomía móvil.'
    },
    {
      title: 'Security Engineer',
      name: 'Andrés Villada',
      icon: ShieldAlert,
      color: 'bg-rose-100 text-rose-700',
      focus: 'Reglas Firestore con mínimo privilegio, mitigación XSS/Rate Limiting y motor de alertas en tiempo real.'
    }
  ];

  const feedbackCycles = [
    {
      epic: 'Épica 1: Autenticación, Roles y Reglas de Mínimo Privilegio',
      po: 'Necesitamos 4 perfiles: visitante (solo consulta), usuario (opina), dueño (registra/edita sus locales) y admin (modera todo).',
      archDev: 'Arquitectura: Colección `users` en Firestore. Tokens con custom claims o campo role verificado por Security Rules.',
      qaSecurity: 'CRÍTICA QA + SEGURIDAD: ¿Qué impide que un comerciante envíe `{ role: "admin" }` en la petición de registro? Si no hay validación estricta en `firestore.rules`, se genera escalamiento de privilegios vertical.',
      resolution: 'AJUSTE: Regla Firestore `request.resource.data.role in ["usuario", "dueno"]` al registrarse. Mutaciones posteriores de `role` restringidas exclusivamente a administradores.',
      sm: 'DECISIÓN SCRUM: Aprobado con prueba de penetración PT-02 validada.'
    },
    {
      epic: 'Épica 2: Registro de Negocios y Prevención de Inyecciones',
      po: 'Cualquier dueño debe poder publicar su comercio con foto, horario, teléfono y descripción.',
      archDev: 'Formulario en React con hook `useBusinessController` que envía los datos a `businessService` y persisten en Firestore.',
      qaSecurity: 'CRÍTICA QA + SEGURIDAD: Un atacante puede insertar `<script>stealCookies()</script>` en la descripción o teléfono. Además, un dueño podría auto-aprobarse cambiando el estado a "aprobado".',
      resolution: 'AJUSTE: Implementación del motor `securityService.inspectAndSanitize()` en cliente, codificación de entidades HTML, y regla Firestore que exige que los negocios nuevos inicien con `status == "pendiente"`.',
      sm: 'DECISIÓN SCRUM: Aprobado e integrado con alerta de auditoría inmediata.'
    },
    {
      epic: 'Épica 3: Reseñas, Calificaciones y Protección Anti-Spam',
      po: 'Los vecinos deben poder calificar con 1 a 5 estrellas y escribir su experiencia con el comercio.',
      archDev: 'Subcolección o colección raíz `reviews` con trigger/cálculo de promedio en `businesses.ratingAverage`.',
      qaSecurity: 'CRÍTICA QA + SEGURIDAD: Riesgo de bots publicando 50 reseñas por segundo para inflar o destruir la reputación de un comercio rival (Sybil Attack / DoS).',
      resolution: 'AJUSTE: Rate limiting activo (máx. 3 reseñas/minuto por usuario/IP), verificación obligatoria de usuario autenticado y validación de rango estricto de estrellas (1 a 5).',
      sm: 'DECISIÓN SCRUM: Aprobado con recálculo automático de promedio y sistema de reportes.'
    },
    {
      epic: 'Épica 4: Monitoreo y Alertas en Tiempo Real de Actividades Sospechosas',
      po: 'Softvision Tech necesita visibilidad en vivo de anomalías para proteger la confianza de la comunidad.',
      archDev: 'Controlador `useSecurityController` suscrito al canal reactivo de `securityService` con persistencia en `security_alerts`.',
      qaSecurity: 'CRÍTICA QA + SEGURIDAD: ¿Cómo probamos que las alertas se disparan en tiempo real sin atacar la base de datos de producción?',
      resolution: 'AJUSTE: Se incorpora simulador de vectores de ataque en el Centro de Ciberseguridad (inyección XSS de prueba, saturación de tasa y escalamiento) con actualización instantánea del badge en el Navbar.',
      sm: 'DECISIÓN SCRUM: Aprobado como diferenciador de seguridad enterprise para el producto.'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/60 backdrop-blur-sm animate-fade-in" id="scrum-drawer-backdrop">
      <div className="bg-white w-full max-w-2xl h-full shadow-2xl flex flex-col overflow-hidden border-l border-[#E2E8F0]">
        {/* Header */}
        <div className="p-6 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-sm">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#0F172A]">
                Equipo Scrum — Softvision Tech
              </h2>
              <p className="text-xs text-[#64748B]">
                Trazabilidad ágil, autoretroalimentación y gobernanza técnica
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#94A3B8] hover:text-[#1E293B] rounded-lg hover:bg-slate-100 transition-colors"
            id="close-scrum-drawer-btn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Pestañas */}
        <div className="flex border-b border-[#E2E8F0] px-6 bg-[#F8FAFC] text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => setActiveTab('feedback')}
            className={`py-3 px-3 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'feedback'
                ? 'border-blue-600 text-blue-600 font-bold'
                : 'border-transparent text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            Autoretroalimentación (Debates)
          </button>
          <button
            onClick={() => setActiveTab('backlog')}
            className={`py-3 px-3 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'backlog'
                ? 'border-blue-600 text-blue-600 font-bold'
                : 'border-transparent text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            Backlog & Sprints
          </button>
          <button
            onClick={() => setActiveTab('roles')}
            className={`py-3 px-3 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'roles'
                ? 'border-blue-600 text-blue-600 font-bold'
                : 'border-transparent text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            Roles del Equipo
          </button>
          <button
            onClick={() => setActiveTab('dod')}
            className={`py-3 px-3 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'dod'
                ? 'border-blue-600 text-blue-600 font-bold'
                : 'border-transparent text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            Definition of Done
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'feedback' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-blue-50 border border-blue-100 text-xs text-blue-900 leading-relaxed">
                <span className="font-bold block mb-1">Metodología de Autoretroalimentación Obligatoria:</span>
                Antes de fusionar cada funcionalidad, el Product Owner presenta el requerimiento, Arquitectura/Dev diseñan la solución, QA y Seguridad retan la propuesta buscando vulnerabilidades, el equipo ajusta el código y el Scrum Master resume el consenso.
              </div>

              {feedbackCycles.map((cycle, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-sm space-y-3"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#0F172A] text-white text-[11px] font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <h3 className="text-sm font-bold text-[#0F172A]">{cycle.epic}</h3>
                  </div>

                  <div className="text-xs space-y-2.5 pl-8 border-l-2 border-[#E2E8F0]">
                    <div>
                      <span className="font-bold text-blue-600 block">1. Product Owner:</span>
                      <p className="text-[#475569]">{cycle.po}</p>
                    </div>

                    <div>
                      <span className="font-bold text-blue-700 block">2. Arquitecto & Dev:</span>
                      <p className="text-[#475569]">{cycle.archDev}</p>
                    </div>

                    <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-100 text-rose-800">
                      <span className="font-bold block mb-0.5">3. Crítica QA + Seguridad:</span>
                      <p>{cycle.qaSecurity}</p>
                    </div>

                    <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-800">
                      <span className="font-bold block mb-0.5">4. Ajuste Técnico Implementado:</span>
                      <p>{cycle.resolution}</p>
                    </div>

                    <div className="text-[#64748B] font-medium italic pt-1">
                      {cycle.sm}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'backlog' && (
            <div className="space-y-5 text-xs">
              {/* Sprint 1 */}
              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-sm text-slate-900">Sprint 1: Cimientos y Autenticación Segura</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">100% Completado</span>
                </div>
                <ul className="space-y-1.5 text-slate-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Configuración de entorno Vite + Tailwind + Firebase Config</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Autenticación y RBAC con roles: visitante, usuario, dueño, admin</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Reglas de seguridad Firestore para /users con mínimo privilegio</span>
                  </li>
                </ul>
              </div>

              {/* Sprint 2 */}
              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-sm text-slate-900">Sprint 2: Directorio, Categorías y Buscador</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">100% Completado</span>
                </div>
                <ul className="space-y-1.5 text-slate-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Formulario de registro de comercio (horarios, teléfonos, fotos, mapa)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Organización por 7 categorías iniciales extensibles</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Buscador reactivo por nombre, categoría, zona y servicios</span>
                  </li>
                </ul>
              </div>

              {/* Sprint 3 */}
              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-sm text-slate-900">Sprint 3: Reseñas, Moderación y Ciberseguridad</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">100% Completado</span>
                </div>
                <ul className="space-y-1.5 text-slate-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Sistema de calificación de 1-5 estrellas con recálculo automático</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Panel de administración para moderar negocios y comentarios</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Monitor en tiempo real de actividades sospechosas y test de penetración</span>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'roles' && (
            <div className="grid grid-cols-1 gap-3">
              {rolesList.map((r, i) => (
                <div key={i} className="p-3.5 rounded-xl border border-slate-200 flex items-start gap-3 bg-white">
                  <div className={`p-2 rounded-lg ${r.color} shrink-0`}>
                    <r.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-bold text-slate-900 text-xs">{r.title}</span>
                      <span className="text-[11px] text-slate-400">({r.name})</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{r.focus}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'dod' && (
            <div className="space-y-3 text-xs">
              <div className="p-4 rounded-xl bg-slate-900 text-slate-200 space-y-2">
                <span className="font-bold text-white text-sm block">Definition of Done (DoD) — Calidad Enterprise</span>
                <p>Ninguna historia de usuario se considera terminada hasta que cumple los 6 criterios:</p>
              </div>

              {[
                'Arquitectura MVC estrictamente respetada (separación de Modelos, Vistas y Controladores).',
                'Reglas de Firestore declaradas con principio de mínimo privilegio en firestore.rules.',
                'Sanitización de entrada activa contra ataques XSS y Rate Limiting contra spam.',
                'Diseño responsivo sin desbordamientos probado en pantallas móviles y de escritorio.',
                'Informe de pruebas de penetración actualizado con mitigaciones verificadas.',
                'Documentación completa en README.md con comandos de ejecución y despliegue.'
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-2.5 p-3 rounded-xl border border-slate-200 bg-white">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="text-slate-700">{item}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
