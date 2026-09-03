/**
 * SOFTVISION TECH — Modal de Autenticación y Registro de Usuarios
 */

import React, { useState } from 'react';
import { X, Lock, Mail, User, Phone, Shield, Store, UserCheck } from 'lucide-react';
import { UserRole } from '../models/types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (email: string) => Promise<unknown>;
  onRegister: (data: { displayName: string; email: string; role: 'usuario' | 'dueno'; phone?: string }) => Promise<unknown>;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLogin,
  onRegister
}) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<'usuario' | 'dueno'>('usuario');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (mode === 'login') {
        if (!email) throw new Error('Por favor ingresa tu correo electrónico.');
        await onLogin(email);
      } else {
        if (!displayName || !email) throw new Error('Completa los campos obligatorios.');
        await onRegister({
          displayName,
          email,
          role,
          phone
        });
      }
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error durante la autenticación';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in" id="auth-modal-backdrop">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-[#E2E8F0] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
          <div>
            <span className="text-[11px] uppercase tracking-wider font-bold text-blue-600 block">
              Softvision Tech Auth
            </span>
            <h3 className="text-base font-bold text-[#0F172A]">
              {mode === 'login' ? 'Bienvenido de nuevo' : 'Crea tu cuenta comunitaria'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#94A3B8] hover:text-[#1E293B] rounded-lg hover:bg-slate-100 transition-colors"
            id="close-auth-modal-btn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 text-xs bg-rose-50 border border-rose-200 text-rose-700 rounded-xl">
              {error}
            </div>
          )}

          {mode === 'register' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-[#1E293B] mb-1">
                  Nombre Completo o Comercial
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#94A3B8] absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Ej. Juan Pérez o Restaurante La Casona"
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#1E293B]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1E293B] mb-1">
                  Tipo de Cuenta / Rol
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('usuario')}
                    className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                      role === 'usuario'
                        ? 'border-blue-600 bg-blue-50 text-blue-700 ring-2 ring-blue-500/20'
                        : 'border-[#E2E8F0] bg-white text-[#64748B] hover:bg-[#F8FAFC]'
                    }`}
                  >
                    <UserCheck className="w-4 h-4" />
                    <span>Vecino / Usuario</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('dueno')}
                    className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                      role === 'dueno'
                        ? 'border-blue-600 bg-blue-50 text-blue-700 ring-2 ring-blue-500/20'
                        : 'border-[#E2E8F0] bg-white text-[#64748B] hover:bg-[#F8FAFC]'
                    }`}
                  >
                    <Store className="w-4 h-4" />
                    <span>Dueño de Negocio</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1E293B] mb-1">
                  Teléfono / Móvil (Opcional)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-[#94A3B8] absolute left-3 top-3" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+57 300 123 4567"
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#1E293B]"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#1E293B] mb-1">
              Correo Electrónico
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#94A3B8] absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu.correo@ejemplo.com"
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#1E293B]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1E293B] mb-1">
              Contraseña
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#94A3B8] absolute left-3 top-3" />
              <input
                type="password"
                required
                defaultValue="••••••••"
                placeholder="Mínimo 8 caracteres"
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#1E293B]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all disabled:opacity-50"
            id="auth-submit-btn"
          >
            {isLoading
              ? 'Procesando...'
              : mode === 'login'
              ? 'Iniciar Sesión'
              : 'Registrar Cuenta'}
          </button>

          <div className="text-center pt-2 text-xs text-[#64748B]">
            {mode === 'login' ? (
              <p>
                ¿Aún no tienes cuenta?{' '}
                <button
                  type="button"
                  onClick={() => setMode('register')}
                  className="font-bold text-blue-600 hover:underline"
                >
                  Regístrate aquí
                </button>
              </p>
            ) : (
              <p>
                ¿Ya eres miembro?{' '}
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="font-bold text-blue-600 hover:underline"
                >
                  Inicia sesión
                </button>
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
