/**
 * SOFTVISION TECH — Servicio de Autenticación y Gestión de Roles (RBAC)
 * Firestore como Base de Datos Principal con sincronización en tiempo real
 * y soporte multi-rol seguro.
 */

import {
  collection,
  doc,
  setDoc,
  onSnapshot
} from 'firebase/firestore';
import { UserProfile, UserRole } from '../models/types';
import { INITIAL_USERS } from './mockData';
import { db } from './firebase';

const AUTH_STORAGE_KEY = 'softvision_current_user';
const ALL_USERS_KEY = 'softvision_users_list';

let memoryUsers: UserProfile[] = [];

try {
  const raw = localStorage.getItem(ALL_USERS_KEY);
  memoryUsers = raw ? JSON.parse(raw) : INITIAL_USERS;
} catch {
  memoryUsers = INITIAL_USERS;
}

function persistUsersLocal(): void {
  try {
    localStorage.setItem(ALL_USERS_KEY, JSON.stringify(memoryUsers));
  } catch (e) {
    console.warn('[Storage] Error al persistir usuarios localmente:', e);
  }
}

export const authService = {
  initializedFirestore: false,

  init(): void {
    if (this.initializedFirestore) return;
    this.initializedFirestore = true;

    if (db) {
      try {
        const usersCol = collection(db, 'users');
        onSnapshot(usersCol, (snapshot) => {
          if (!snapshot.empty) {
            const list: UserProfile[] = [];
            snapshot.forEach((docSnap) => {
              list.push({ ...(docSnap.data() as UserProfile), uid: docSnap.id });
            });
            memoryUsers = list;
            persistUsersLocal();
          } else {
            // Sembrar usuarios iniciales en Firestore si la colección está vacía
            INITIAL_USERS.forEach(async (u) => {
              try {
                if (db) await setDoc(doc(db, 'users', u.uid), u);
              } catch (err) {
                console.warn('[Firestore] Error sembrando usuario:', err);
              }
            });
          }
        }, (err) => {
          console.warn('[Firestore] Escucha de usuarios en modo fallback:', err);
        });

        console.info('[Firestore] authService suscrito a la colección "users".');
      } catch (e) {
        console.warn('[Firestore] Error inicializando listener de usuarios:', e);
      }
    }
  },

  getCurrentUser(): UserProfile | null {
    this.init();
    try {
      const raw = localStorage.getItem(AUTH_STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      console.error('Error al recuperar usuario actual:', e);
    }
    // Por defecto inicializamos con comerciante local para una experiencia interactiva inmediata
    const defaultUser = INITIAL_USERS[1]; // Lucía Morales (dueño)
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(defaultUser));
    return defaultUser;
  },

  setCurrentUser(user: UserProfile | null): void {
    if (user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
    this.notifyListeners(user);
  },

  getUsers(): UserProfile[] {
    return memoryUsers;
  },

  async login(email: string): Promise<UserProfile> {
    const cleanEmail = email.trim().toLowerCase();
    let found = memoryUsers.find(u => u.email.toLowerCase() === cleanEmail);

    if (!found) {
      const isOwnerIntent = cleanEmail.includes('dueno') || cleanEmail.includes('comercio') || cleanEmail.includes('negocio');
      const isAdminIntent = cleanEmail.includes('admin');
      
      const newRole: UserRole = isAdminIntent ? 'admin' : isOwnerIntent ? 'dueno' : 'usuario';
      const nameParts = cleanEmail.split('@')[0].split('.');
      const formattedName = nameParts.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' ');

      const newUid = `user-${Date.now()}`;
      found = {
        uid: newUid,
        email: cleanEmail,
        displayName: formattedName || 'Usuario Local',
        role: newRole,
        createdAt: new Date().toISOString()
      };
      memoryUsers.push(found);
      persistUsersLocal();

      if (db) {
        try {
          await setDoc(doc(db, 'users', newUid), found);
          console.info(`[Firestore] Usuario registrado y persistido en Firestore: ${newUid}`);
        } catch (err) {
          console.warn('[Firestore] Error guardando usuario en Firestore:', err);
        }
      }
    }

    this.setCurrentUser(found);
    return found;
  },

  async register(data: { displayName: string; email: string; role: 'usuario' | 'dueno'; phone?: string }): Promise<UserProfile> {
    const cleanEmail = data.email.trim().toLowerCase();
    const cleanName = data.displayName.replace(/[<>]/g, '').trim();
    const newUid = `user-${Date.now()}`;

    const newUser: UserProfile = {
      uid: newUid,
      email: cleanEmail,
      displayName: cleanName,
      role: data.role,
      phone: data.phone,
      createdAt: new Date().toISOString()
    };

    memoryUsers.push(newUser);
    persistUsersLocal();
    this.setCurrentUser(newUser);

    if (db) {
      try {
        await setDoc(doc(db, 'users', newUid), newUser);
        console.info(`[Firestore] Nuevo usuario registrado en Firestore: ${newUid}`);
      } catch (err) {
        console.warn('[Firestore] Error registrando usuario en Firestore:', err);
      }
    }

    return newUser;
  },

  async logout(): Promise<void> {
    this.setCurrentUser(null);
  },

  /**
   * Permite alternar de rol en tiempo de ejecución para validar permisos y flujos
   */
  async switchRole(role: UserRole): Promise<UserProfile | null> {
    if (role === 'visitante') {
      this.setCurrentUser(null);
      return null;
    }

    const existing = memoryUsers.find(u => u.role === role);
    if (existing) {
      this.setCurrentUser(existing);
      return existing;
    }

    const current = this.getCurrentUser();
    const newUid = current?.uid || `user-${Date.now()}`;
    const updated: UserProfile = {
      uid: newUid,
      displayName: current?.displayName || (role === 'admin' ? 'Administrador General' : 'Comerciante Local'),
      email: current?.email || `${role}@softvision.tech`,
      role,
      createdAt: current?.createdAt || new Date().toISOString()
    };

    this.setCurrentUser(updated);
    return updated;
  },

  listeners: [] as Array<(user: UserProfile | null) => void>,

  subscribe(callback: (user: UserProfile | null) => void): () => void {
    this.init();
    this.listeners.push(callback);
    callback(this.getCurrentUser());
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  },

  notifyListeners(user: UserProfile | null): void {
    this.listeners.forEach(cb => cb(user));
  }
};

