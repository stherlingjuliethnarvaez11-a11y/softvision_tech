/**
 * SOFTVISION TECH — Barra de Navegación Principal
 * "Tu comunidad a un solo clic"
 */

import React, { useState } from 'react';
import { 
  Store, 
  PlusCircle, 
  ShieldCheck, 
  ShieldAlert, 
  Users, 
  User, 
  LogOut, 
  ChevronDown,
  Menu,
  X
} from 'lucide-react';
import { UserProfile, UserRole } from '../models/types';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string, param?: string) => void;
  currentUser: UserProfile | null;
  role: UserRole;
  onSwitchRole: (role: UserRole) => void;
  onOpenAuth: () => void;
  onOpenScrum: () => void;
  pendingBusinessesCount: number;
  activeSecurityAlertsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  currentUser,
  role,
  onSwitchRole,
  onOpenAuth,
  onOpenScrum,
  pendingBusinessesCount,
  activeSecurityAlertsCount
}) => {
  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const roleLabels: Record<UserRole, { label: string; badge: string; color: string }> = {
    visitante: { label: 'Visitante (Público)', badge: 'Público', color: 'bg-slate-100 text-slate-700' },
    usuario: { label: 'Usuario / Vecino', badge: 'Vecino', color: 'bg-blue-100 text-blue-800' },
    dueno: { label: 'Dueño de Comercio', badge: 'Comerciante', color: 'bg-emerald-100 text-emerald-800' },
    admin: { label: 'Administrador', badge: 'Admin', color: 'bg-purple-100 text-purple-800' }
  };

  const handleRoleSelect = (newRole: UserRole) => {
    onSwitchRole(newRole);
    setIsRoleMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E2E8F0]" id="main-header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo y Marca */}
          <div 
            onClick={() => onNavigate('home')}
            className="flex items-center gap-3 cursor-pointer group select-none"
            id="brand-logo"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold shadow-sm group-hover:bg-blue-700 transition-colors">
              <span>S</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-bold tracking-tight text-[#0F172A]">
                  Softvision
                </span>
                <span className="hidden sm:inline-block text-[10px] uppercase tracking-widest text-blue-600 font-bold">
                  Directorio Digital
                </span>
              </div>
              <p className="text-[10px] text-[#64748B] font-medium hidden sm:block">
                Tu comunidad a un solo clic
              </p>
            </div>
          </div>

          {/* Navegación Desktop */}
          <nav className="hidden md:flex items-center gap-1.5">
            <button
              onClick={() => onNavigate('home')}
              className={`px-3.5 py-2 rounded-lg text-xs font-medium transition-colors ${
                currentView === 'home'
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-[#64748B] hover:text-[#1E293B] hover:bg-[#F1F5F9]'
              }`}
              id="nav-home-btn"
            >
              Explorar
            </button>

            <button
              onClick={() => onNavigate('register-business')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium transition-colors ${
                currentView === 'register-business'
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-[#64748B] hover:text-[#1E293B] hover:bg-[#F1F5F9]'
              }`}
              id="nav-register-biz-btn"
            >
              <PlusCircle className="w-4 h-4 text-blue-600" />
              <span>Registrar Negocio</span>
            </button>

            {/* Panel de Moderación (destacado si es admin) */}
            <button
              onClick={() => onNavigate('admin')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium transition-colors ${
                currentView === 'admin'
                  ? 'bg-purple-50 text-purple-700'
                  : 'text-[#64748B] hover:text-[#1E293B] hover:bg-[#F1F5F9]'
              }`}
              id="nav-admin-btn"
            >
              <ShieldCheck className="w-4 h-4 text-purple-600" />
              <span>Moderación</span>
              {pendingBusinessesCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-purple-600 text-white text-[10px] font-bold flex items-center justify-center">
                  {pendingBusinessesCount}
                </span>
              )}
            </button>

            {/* Centro de Seguridad y Alertas en Tiempo Real */}
            <button
              onClick={() => onNavigate('security')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium transition-colors ${
                currentView === 'security'
                  ? 'bg-rose-50 text-rose-700'
                  : 'text-[#64748B] hover:text-[#1E293B] hover:bg-[#F1F5F9]'
              }`}
              id="nav-security-btn"
            >
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              <span>Ciberseguridad</span>
              {activeSecurityAlertsCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-bold animate-pulse">
                  {activeSecurityAlertsCount}
                </span>
              )}
            </button>

            {/* Drawer Scrum */}
            <button
              onClick={onOpenScrum}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-[#64748B] hover:text-blue-600 hover:bg-[#F1F5F9] transition-colors"
              id="nav-scrum-team-btn"
              title="Ver equipo Scrum, historias y debates de arquitectura"
            >
              <Users className="w-4 h-4 text-blue-600" />
              <span>Equipo Scrum</span>
            </button>
          </nav>

          {/* Selector Rápido de Roles (Herramienta de Auditoría y Testing) */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <button
                onClick={() => setIsRoleMenuOpen(!isRoleMenuOpen)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[#E2E8F0] text-xs font-semibold hover:border-slate-300 transition-all ${roleLabels[role].color}`}
                id="role-switcher-btn"
                title="Cambiar rol para simular permisos en tiempo real"
              >
                <span className="w-2 h-2 rounded-full bg-current"></span>
                <span className="hidden sm:inline font-bold">Rol:</span>
                <span>{roleLabels[role].badge}</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-70" />
              </button>

              {isRoleMenuOpen && (
                <div 
                  className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-[#E2E8F0] py-2 z-50 text-xs animate-fade-in"
                  id="role-dropdown-menu"
                >
                  <div className="px-3 py-1.5 border-b border-[#E2E8F0] text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">
                    Simulador RBAC (Firebase Auth)
                  </div>
                  {(['visitante', 'usuario', 'dueno', 'admin'] as UserRole[]).map((r) => (
                    <button
                      key={r}
                      onClick={() => handleRoleSelect(r)}
                      className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-[#F8FAFC] transition-colors ${
                        role === r ? 'font-bold text-blue-600 bg-blue-50/50' : 'text-[#1E293B]'
                      }`}
                    >
                      <span>{roleLabels[r].label}</span>
                      {role === r && <span className="text-xs">✓</span>}
                    </button>
                  ))}
                  <div className="p-2 border-t border-[#E2E8F0] text-[11px] text-[#64748B] leading-tight">
                    Permite verificar reglas Firestore y permisos en vivo.
                  </div>
                </div>
              )}
            </div>

            {/* Auth / Avatar Button */}
            {currentUser ? (
              <button
                onClick={() => handleRoleSelect('visitante')}
                className="p-2 text-[#64748B] hover:text-rose-600 rounded-lg hover:bg-[#F1F5F9] transition-colors"
                title="Cerrar sesión"
                id="nav-logout-btn"
              >
                <LogOut className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={onOpenAuth}
                className="bg-blue-600 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-sm hover:bg-blue-700 transition-colors"
                id="nav-login-btn"
              >
                Ingresar
              </button>
            )}

            {/* Botón Menú Móvil */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 md:hidden text-[#64748B] hover:text-[#1E293B] rounded-lg hover:bg-[#F1F5F9]"
              id="mobile-menu-btn"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Menú Móvil Expandible */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-[#E2E8F0] bg-white px-4 py-3 space-y-2 text-xs font-medium">
          <button
            onClick={() => {
              onNavigate('home');
              setIsMobileMenuOpen(false);
            }}
            className="w-full text-left py-2 px-3 rounded-lg text-[#1E293B] hover:bg-[#F1F5F9]"
          >
            Explorar Negocios
          </button>
          <button
            onClick={() => {
              onNavigate('register-business');
              setIsMobileMenuOpen(false);
            }}
            className="w-full text-left py-2 px-3 rounded-lg text-[#1E293B] hover:bg-[#F1F5F9] flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4 text-blue-600" />
            <span>Registrar mi Negocio</span>
          </button>
          <button
            onClick={() => {
              onNavigate('admin');
              setIsMobileMenuOpen(false);
            }}
            className="w-full text-left py-2 px-3 rounded-lg text-[#1E293B] hover:bg-[#F1F5F9] flex items-center justify-between"
          >
            <span className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-purple-600" />
              <span>Panel de Moderación</span>
            </span>
            {pendingBusinessesCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-purple-600 text-white text-[10px]">
                {pendingBusinessesCount}
              </span>
            )}
          </button>
          <button
            onClick={() => {
              onNavigate('security');
              setIsMobileMenuOpen(false);
            }}
            className="w-full text-left py-2 px-3 rounded-lg text-[#1E293B] hover:bg-[#F1F5F9] flex items-center justify-between"
          >
            <span className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              <span>Centro de Ciberseguridad</span>
            </span>
            {activeSecurityAlertsCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white text-[10px]">
                {activeSecurityAlertsCount}
              </span>
            )}
          </button>
          <button
            onClick={() => {
              onOpenScrum();
              setIsMobileMenuOpen(false);
            }}
            className="w-full text-left py-2 px-3 rounded-lg text-blue-600 hover:bg-blue-50 flex items-center gap-2"
          >
            <Users className="w-4 h-4 text-blue-600" />
            <span>Ver Equipo Scrum & Historias</span>
          </button>
        </div>
      )}
    </header>
  );
};
