/**
 * SOFTVISION TECH — Controlador de Autenticación y Autorización (MVC: Controller)
 */

import { useState, useEffect, useCallback } from 'react';
import { UserProfile, UserRole } from '../models/types';
import { authService } from '../services/authService';

export function useAuthController() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(authService.getCurrentUser());
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = authService.subscribe((user) => {
      setCurrentUser(user);
    });
    return unsubscribe;
  }, []);

  const login = useCallback(async (email: string) => {
    setIsLoading(true);
    setAuthError(null);
    try {
      const user = await authService.login(email);
      return user;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al iniciar sesión';
      setAuthError(msg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (data: { displayName: string; email: string; role: 'usuario' | 'dueno'; phone?: string }) => {
    setIsLoading(true);
    setAuthError(null);
    try {
      const user = await authService.register(data);
      return user;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al registrar usuario';
      setAuthError(msg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
  }, []);

  const switchRole = useCallback(async (role: UserRole) => {
    return await authService.switchRole(role);
  }, []);

  const role = currentUser?.role || 'visitante';
  const isAuthenticated = currentUser !== null;
  const isOwner = role === 'dueno' || role === 'admin';
  const isAdmin = role === 'admin';

  return {
    currentUser,
    role,
    isAuthenticated,
    isOwner,
    isAdmin,
    isLoading,
    authError,
    login,
    register,
    logout,
    switchRole
  };
}
