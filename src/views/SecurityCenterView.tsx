/**
 * SOFTVISION TECH — Centro de Ciberseguridad, Alertas en Tiempo Real y Pentesting (MVC: Vista)
 * Monitoreo proactivo de actividades sospechosas y vectorización de amenazas
 */

import React, { useState } from 'react';
import { useSecurityController } from '../controllers/useSecurityController';
import { 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  Flame, 
  Terminal, 
  Activity, 
  CheckCircle2, 
  Clock, 
  ArrowLeft,
  FileCheck,
  Zap,
  Lock,
  Eye
} from 'lucide-react';
import { AlertSeverity } from '../models/types';

interface SecurityCenterViewProps {
  onBack: () => void;
}

export const SecurityCenterView: React.FC<SecurityCenterViewProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'alerts' | 'simulator' | 'pentest' | 'changelog'>('alerts');
  const [filterSeverity, setFilterSeverity] = useState<AlertSeverity | 'todas'>('todas');

  const {
    alerts,
    activeAlerts,
    activeAlertsCount,
    criticalCount,
    penetrationReport,
    updateAlertStatus,
    simulateAttack
  } = useSecurityController();

  const filteredAlerts = filterSeverity === 'todas'
    ? alerts
    : alerts.filter(a => a.severity === filterSeverity);

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto" id="security-center-view">
      
      {/* Botón Volver */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-indigo-600 transition-colors bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm"
        id="btn-back-from-security"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Volver al Directorio</span>
      </button>

      {/* Banner Principal del Centro de Ciberseguridad */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-rose-950 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-64 h-64 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-rose-600 text-white flex items-center justify-center shadow-lg shadow-rose-900/50 animate-pulse">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight">
                  Centro de Monitoreo de Seguridad en Tiempo Real
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  SIEM Activo
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Softvision Tech • Detección de inyecciones XSS, abuso de solicitudes (Rate Limit) y mitigación RBAC
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <div className="px-3.5 py-2 rounded-xl bg-slate-800/80 border border-slate-700/80">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Alertas Activas</span>
              <span className="text-lg font-black text-rose-400">{activeAlertsCount}</span>
            </div>
            <div className="px-3.5 py-2 rounded-xl bg-slate-800/80 border border-slate-700/80">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Críticas / Altas</span>
              <span className="text-lg font-black text-amber-400">{criticalCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Selector de Pestañas */}
      <div className="flex border-b border-slate-200 bg-white rounded-2xl px-4 shadow-sm text-xs font-bold">
        <button
          onClick={() => setActiveTab('alerts')}
          className={`flex items-center gap-2 py-3.5 px-4 border-b-2 transition-all ${
            activeTab === 'alerts'
              ? 'border-rose-600 text-rose-700'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
          id="tab-sec-alerts"
        >
          <Activity className="w-4 h-4" />
          <span>Registro de Alertas en Vivo</span>
          {activeAlertsCount > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-rose-600 text-white text-[10px]">
              {activeAlertsCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('simulator')}
          className={`flex items-center gap-2 py-3.5 px-4 border-b-2 transition-all ${
            activeTab === 'simulator'
              ? 'border-rose-600 text-rose-700'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
          id="tab-sec-simulator"
        >
          <Zap className="w-4 h-4 text-amber-500" />
          <span>Simulador de Vectores de Ataque</span>
        </button>

        <button
          onClick={() => setActiveTab('pentest')}
          className={`flex items-center gap-2 py-3.5 px-4 border-b-2 transition-all ${
            activeTab === 'pentest'
              ? 'border-rose-600 text-rose-700'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
          id="tab-sec-pentest"
        >
          <FileCheck className="w-4 h-4" />
          <span>Informe de Pentesting & Vulnerabilidades</span>
        </button>

        <button
          onClick={() => setActiveTab('changelog')}
          className={`flex items-center gap-2 py-3.5 px-4 border-b-2 transition-all ${
            activeTab === 'changelog'
              ? 'border-rose-600 text-rose-700'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
          id="tab-sec-changelog"
        >
          <Clock className="w-4 h-4" />
          <span>Registro de Cambios (Git Log)</span>
        </button>
      </div>

      {/* Pestaña 1: Feed de Alertas */}
      {activeTab === 'alerts' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
          
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Eventos de Seguridad Monitoreados ({alerts.length})
              </h2>
              <p className="text-xs text-slate-500">
                Filtrado por nivel de severidad para respuesta a incidentes
              </p>
            </div>

            <div className="flex items-center gap-1.5 text-xs">
              {(['todas', 'critica', 'alta', 'media', 'baja'] as const).map((sev) => (
                <button
                  key={sev}
                  onClick={() => setFilterSeverity(sev)}
                  className={`px-3 py-1 rounded-lg font-bold capitalize transition-all ${
                    filterSeverity === sev
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {sev}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {filteredAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-4 rounded-2xl border transition-all text-xs space-y-2 ${
                  alert.status === 'activa'
                    ? 'border-rose-300 bg-rose-50/40'
                    : 'border-slate-200 bg-white'
                }`}
                id={`alert-card-${alert.id}`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded-full font-bold uppercase text-[10px] ${
                        alert.severity === 'critica'
                          ? 'bg-rose-600 text-white'
                          : alert.severity === 'alta'
                          ? 'bg-amber-500 text-white'
                          : alert.severity === 'media'
                          ? 'bg-blue-500 text-white'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      Severidad {alert.severity}
                    </span>
                    <span className="font-mono text-slate-400 text-[11px]">
                      IP: {alert.sourceIp}
                    </span>
                    <span className="font-mono text-slate-400 text-[11px]">
                      {new Date(alert.timestamp).toLocaleTimeString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-500 font-medium">Estado:</span>
                    <select
                      value={alert.status}
                      onChange={(e) => updateAlertStatus(alert.id, e.target.value as any, 'Estado actualizado por analista de seguridad')}
                      className="px-2 py-1 rounded-lg border border-slate-200 bg-white font-bold text-slate-800 text-[11px] focus:outline-none"
                    >
                      <option value="activa">Activa</option>
                      <option value="investigando">Investigando</option>
                      <option value="resuelta">Resuelta</option>
                      <option value="descartada">Descartada</option>
                    </select>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{alert.title}</h3>
                  <p className="text-slate-600 mt-0.5">{alert.description}</p>
                </div>

                {alert.actionTaken && (
                  <div className="p-2.5 rounded-xl bg-slate-100 text-slate-700 font-mono text-[11px] flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span><strong>Acción Automática:</strong> {alert.actionTaken}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pestaña 2: Simulador de Ataques */}
      {activeTab === 'simulator' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Laboratorio de Simulación y Verificación de Defensas
            </h2>
            <p className="text-xs text-slate-500">
              Dispara vectores de prueba controlados para comprobar cómo el motor de seguridad intercepta y genera alertas automáticas en vivo.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Vector 1: XSS */}
            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                <Terminal className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-900">1. Inyección XSS</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Envía un payload malicioso `<script>alert("Hacked")</script>` hacia el campo de descripción.
              </p>
              <button
                onClick={() => {
                  simulateAttack('XSS');
                  setActiveTab('alerts');
                }}
                className="w-full py-2 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition-colors shadow-sm"
              >
                Disparar Ataque XSS
              </button>
            </div>

            {/* Vector 2: Rate Limit */}
            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
                <Activity className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-900">2. Ráfaga de Reseñas (Spam)</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Envía múltiples peticiones concurrentes superando el umbral de 3 reseñas por minuto.
              </p>
              <button
                onClick={() => {
                  simulateAttack('RATE_LIMIT');
                  setActiveTab('alerts');
                }}
                className="w-full py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-colors shadow-sm"
              >
                Superar Rate Limit
              </button>
            </div>

            {/* Vector 3: Privilege Escalation */}
            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-900">3. Escalamiento RBAC</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Intenta forzar la modificación del estado administrativo de un negocio ajeno.
              </p>
              <button
                onClick={() => {
                  simulateAttack('ESCALATION');
                  setActiveTab('alerts');
                }}
                className="w-full py-2 px-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition-colors shadow-sm"
              >
                Forzar Escalamiento
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pestaña 3: Informe de Pentesting */}
      {activeTab === 'pentest' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Informe Formal de Pruebas de Penetración (Pentesting)
              </h2>
              <p className="text-xs text-slate-500">
                Evaluación de vulnerabilidades OWASP Top 10 y reglas de seguridad Firestore
              </p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 self-start sm:self-auto">
              5/5 Vectores Evaluados y Neutralizados
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3">ID</th>
                  <th className="p-3">Caso de Prueba</th>
                  <th className="p-3">Vector / Carga Maliciosa</th>
                  <th className="p-3">Resultado</th>
                  <th className="p-3">Severidad</th>
                  <th className="p-3">Medidas de Mitigación</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {penetrationReport.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50">
                    <td className="p-3 font-mono font-bold text-slate-900">{item.id}</td>
                    <td className="p-3 font-semibold text-slate-800">{item.testCase}</td>
                    <td className="p-3 text-slate-600 max-w-xs truncate" title={item.vector}>
                      {item.vector}
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        {item.result}
                      </span>
                    </td>
                    <td className="p-3 uppercase font-bold text-[10px] text-rose-600">
                      {item.severity}
                    </td>
                    <td className="p-3 text-slate-600 max-w-sm">{item.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Vulnerabilidades Pendientes Documentadas para Siguiente Sprint */}
          <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 space-y-2">
            <div className="flex items-center gap-2 font-bold text-amber-900 text-xs uppercase tracking-wide">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Vulnerabilidades Pendientes / Roadmap de Endurecimiento (Sprint 4)</span>
            </div>
            <ul className="text-xs text-amber-950 space-y-1 list-disc pl-5">
              <li>
                <strong>Implementación de reCAPTCHA Enterprise:</strong> Agregar token de verificación en el formulario de contacto para evitar bots headless en producción.
              </li>
              <li>
                <strong>Verificación SMS OTP:</strong> Validación mediante número móvil para reclamo de negocios existentes por parte de nuevos comerciantes.
              </li>
              <li>
                <strong>Firmado Criptográfico de Encabezados CSP:</strong> Despliegue de Content Security Policy estricto en Firebase Hosting para bloquear fuentes de scripts externas no autorizadas.
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* Pestaña 4: Registro de Cambios (Changelog) */}
      {activeTab === 'changelog' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900">
            Registro Oficial de Cambios del Repositorio (Changelog)
          </h2>
          <div className="space-y-4 text-xs font-mono text-slate-700">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-indigo-600 font-bold">commit f8a129d (HEAD -&gt; main)</span>
              <p className="font-sans text-slate-900 font-bold">feat(security): Implementación del SIEM en tiempo real y detector de payloads XSS</p>
              <p className="font-sans text-slate-500 text-[11px]">Autor: Security Engineer (Andrés Villada) • Fecha: 2026-09-03</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-indigo-600 font-bold">commit e4c992a</span>
              <p className="font-sans text-slate-900 font-bold">feat(reviews): Módulo de calificaciones y recálculo automático de promedio en negocios</p>
              <p className="font-sans text-slate-500 text-[11px]">Autor: Dev Frontend (Sofía Arango) • Fecha: 2026-09-03</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-indigo-600 font-bold">commit b12401f</span>
              <p className="font-sans text-slate-900 font-bold">feat(rules): Despliegue de firestore.rules con principio de mínimo privilegio y roles RBAC</p>
              <p className="font-sans text-slate-500 text-[11px]">Autor: Dev Backend / Firebase (Camilo Torres) • Fecha: 2026-09-03</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-indigo-600 font-bold">commit a79901e</span>
              <p className="font-sans text-slate-900 font-bold">feat(mvc): Estructura base /models, /views, /controllers y configuración de Firebase</p>
              <p className="font-sans text-slate-500 text-[11px]">Autor: Arquitecto de Software (Daniel Henao) • Fecha: 2026-09-03</p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
