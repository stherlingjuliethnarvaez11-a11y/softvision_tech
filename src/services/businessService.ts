/**
 * SOFTVISION TECH — Servicio de Negocios y Categorías (Capa Modelo en MVC)
 * Firebase Firestore como Base de Datos Principal con sincronización en tiempo real
 * y fallback reactivo local transparente.
 */

import { 
  collection, 
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot
} from 'firebase/firestore';
import { Business, BusinessStatus, Category } from '../models/types';
import { INITIAL_BUSINESSES, INITIAL_CATEGORIES } from './mockData';
import { securityService } from './securityService';
import { db } from './firebase';

const BUSINESSES_STORAGE_KEY = 'softvision_businesses';
const CATEGORIES_STORAGE_KEY = 'softvision_categories';

// Estado en memoria y caché local
let memoryBusinesses: Business[] = [];
let memoryCategories: Category[] = [];

// Inicialización de datos desde localStorage o semilla
try {
  const storedBiz = localStorage.getItem(BUSINESSES_STORAGE_KEY);
  memoryBusinesses = storedBiz ? JSON.parse(storedBiz) : INITIAL_BUSINESSES;
} catch {
  memoryBusinesses = INITIAL_BUSINESSES;
}

try {
  const storedCats = localStorage.getItem(CATEGORIES_STORAGE_KEY);
  memoryCategories = storedCats ? JSON.parse(storedCats) : INITIAL_CATEGORIES;
} catch {
  memoryCategories = INITIAL_CATEGORIES;
}

function persistLocal(): void {
  try {
    localStorage.setItem(BUSINESSES_STORAGE_KEY, JSON.stringify(memoryBusinesses));
    localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(memoryCategories));
  } catch (e) {
    console.warn('[Storage] Error al persistir localmente:', e);
  }
}

export const businessService = {
  listeners: [] as Array<() => void>,
  initializedFirestore: false,

  init(): void {
    if (this.initializedFirestore) return;
    this.initializedFirestore = true;

    // Si Firestore está conectado, suscribirse a cambios en tiempo real
    if (db) {
      try {
        // Suscripción a Categorías en Firestore
        const catsCol = collection(db, 'categories');
        onSnapshot(catsCol, (snapshot) => {
          if (!snapshot.empty) {
            const list: Category[] = [];
            snapshot.forEach((docSnap) => {
              list.push({ ...(docSnap.data() as Category), id: docSnap.id });
            });
            memoryCategories = list;
            persistLocal();
            this.notify();
          } else {
            // Si la colección está vacía en Firestore, sembrar las categorías iniciales
            INITIAL_CATEGORIES.forEach(async (c) => {
              try {
                if (db) await setDoc(doc(db, 'categories', c.id), c);
              } catch (err) {
                console.warn('[Firestore] Error al sembrar categoría:', err);
              }
            });
          }
        }, (err) => {
          console.warn('[Firestore] Escucha de categorías en modo offline/fallback:', err);
        });

        // Suscripción a Negocios en Firestore
        const bizCol = collection(db, 'businesses');
        onSnapshot(bizCol, (snapshot) => {
          if (!snapshot.empty) {
            const list: Business[] = [];
            snapshot.forEach((docSnap) => {
              list.push({ ...(docSnap.data() as Business), id: docSnap.id });
            });
            // Ordenar por fecha de creación descendente
            list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            memoryBusinesses = list;
            persistLocal();
            this.notify();
          } else {
            // Si la colección está vacía en Firestore, sembrar los negocios iniciales
            INITIAL_BUSINESSES.forEach(async (b) => {
              try {
                if (db) await setDoc(doc(db, 'businesses', b.id), b);
              } catch (err) {
                console.warn('[Firestore] Error al sembrar negocio:', err);
              }
            });
          }
        }, (err) => {
          console.warn('[Firestore] Escucha de negocios en modo offline/fallback:', err);
        });

        console.info('[Firestore] businessService suscrito a colecciones "businesses" y "categories".');
      } catch (e) {
        console.warn('[Firestore] Error inicializando listeners:', e);
      }
    }
  },

  subscribe(callback: () => void): () => void {
    this.listeners.push(callback);
    this.init();
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  },

  notify(): void {
    this.listeners.forEach(cb => cb());
  },

  getCategories(): Category[] {
    return memoryCategories;
  },

  async addCategory(category: Omit<Category, 'id'>): Promise<Category> {
    const newId = `cat-${Date.now()}`;
    const newCat: Category = {
      ...category,
      id: newId,
      businessCount: 0
    };

    memoryCategories.push(newCat);
    persistLocal();
    this.notify();

    if (db) {
      try {
        await setDoc(doc(db, 'categories', newId), newCat);
      } catch (err) {
        console.warn('[Firestore] Error guardando categoría en Firestore:', err);
      }
    }

    return newCat;
  },

  getBusinesses(filterStatus?: BusinessStatus): Business[] {
    if (filterStatus) {
      return memoryBusinesses.filter(b => b.status === filterStatus);
    }
    return memoryBusinesses;
  },

  getBusinessById(id: string): Business | undefined {
    return memoryBusinesses.find(b => b.id === id);
  },

  searchBusinesses(query: {
    term?: string;
    categoryId?: string;
    zone?: string;
    includePending?: boolean;
  }): Business[] {
    let list = memoryBusinesses;

    // Si no se especifica ver pendientes (modo admin o dueño), solo mostramos aprobados
    if (!query.includePending) {
      list = list.filter(b => b.status === 'aprobado');
    }

    if (query.categoryId && query.categoryId !== 'all') {
      list = list.filter(b => b.categoryId === query.categoryId);
    }

    if (query.zone && query.zone !== 'all') {
      list = list.filter(b => b.zone === query.zone);
    }

    if (query.term && query.term.trim() !== '') {
      const term = query.term.toLowerCase().trim();
      list = list.filter(b => {
        const nameMatch = b.name.toLowerCase().includes(term);
        const descMatch = b.description.toLowerCase().includes(term);
        const catMatch = b.categoryName.toLowerCase().includes(term);
        const serviceMatch = b.services.some(s => s.toLowerCase().includes(term));
        const addressMatch = b.address.toLowerCase().includes(term);
        return nameMatch || descMatch || catMatch || serviceMatch || addressMatch;
      });
    }

    return list;
  },

  async createBusiness(data: {
    name: string;
    categoryId: string;
    address: string;
    zone: string;
    phone: string;
    whatsapp?: string;
    email?: string;
    website?: string;
    hours: Business['hours'];
    description: string;
    services: string[];
    imageUrl?: string;
    ownerId: string;
    ownerName: string;
  }): Promise<Business> {
    // Sanitización proactiva de seguridad contra XSS
    const sanitizedName = securityService.inspectAndSanitize(data.name, 'nombre_negocio', data.ownerId).safeText;
    const sanitizedDesc = securityService.inspectAndSanitize(data.description, 'descripcion_negocio', data.ownerId).safeText;
    const sanitizedAddress = securityService.inspectAndSanitize(data.address, 'direccion_negocio', data.ownerId).safeText;

    const cat = memoryCategories.find(c => c.id === data.categoryId);
    const categoryName = cat ? cat.name : 'Varios';

    const newId = `biz-${Date.now()}`;
    const newBusiness: Business = {
      id: newId,
      name: sanitizedName,
      categoryId: data.categoryId,
      categoryName,
      address: sanitizedAddress,
      zone: data.zone || 'Comuna 1 - Centro',
      phone: data.phone,
      whatsapp: data.whatsapp || data.phone.replace(/\D/g, ''),
      email: data.email,
      website: data.website,
      hours: data.hours,
      description: sanitizedDesc,
      services: data.services.length > 0 ? data.services : ['Atención al cliente', 'Servicio personalizado'],
      imageUrl: data.imageUrl || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80',
      ownerId: data.ownerId,
      ownerName: data.ownerName,
      ratingAverage: 5.0,
      reviewCount: 0,
      status: 'pendiente', // Por defecto pasa a revisión del Administrador
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    memoryBusinesses.unshift(newBusiness);

    // Actualizar conteo en categoría
    if (cat) {
      cat.businessCount = (cat.businessCount || 0) + 1;
    }

    persistLocal();
    this.notify();

    // Persistencia primaria en Firestore
    if (db) {
      try {
        await setDoc(doc(db, 'businesses', newId), newBusiness);
        if (cat) {
          await updateDoc(doc(db, 'categories', cat.id), {
            businessCount: cat.businessCount
          });
        }
        console.info(`[Firestore] Negocio ${newId} guardado con éxito en Firestore.`);
      } catch (err) {
        console.warn('[Firestore] Error al persistir negocio en Firestore:', err);
      }
    }

    return newBusiness;
  },

  async updateBusiness(id: string, updates: Partial<Business>, currentUserId: string, currentUserRole: string): Promise<Business> {
    const index = memoryBusinesses.findIndex(b => b.id === id);
    if (index === -1) throw new Error('Negocio no encontrado');

    const business = memoryBusinesses[index];

    // Verificación de autorización de seguridad (RBAC)
    if (currentUserRole !== 'admin' && business.ownerId !== currentUserId) {
      securityService.logPrivilegeEscalationAttempt(currentUserId, `EDIT_BUSINESS_${id}`, currentUserRole);
      throw new Error('Acceso no autorizado: No puedes modificar un negocio ajeno.');
    }

    // Prohibir que el dueño común altere el estado a 'aprobado' directamente
    if (currentUserRole !== 'admin' && updates.status && updates.status !== business.status) {
      securityService.logPrivilegeEscalationAttempt(currentUserId, `AUTO_APPROVE_BUSINESS_${id}`, currentUserRole);
      delete updates.status;
    }

    const updated: Business = {
      ...business,
      ...updates,
      updatedAt: new Date().toISOString()
    };

    memoryBusinesses[index] = updated;
    persistLocal();
    this.notify();

    if (db) {
      try {
        await updateDoc(doc(db, 'businesses', id), {
          ...updates,
          updatedAt: updated.updatedAt
        });
        console.info(`[Firestore] Negocio ${id} actualizado en Firestore.`);
      } catch (err) {
        console.warn('[Firestore] Error al actualizar negocio en Firestore:', err);
      }
    }

    return updated;
  },

  async moderateBusiness(id: string, status: BusinessStatus, adminUid: string, rejectionReason?: string): Promise<void> {
    const index = memoryBusinesses.findIndex(b => b.id === id);
    if (index === -1) throw new Error('Negocio no encontrado');

    memoryBusinesses[index].status = status;
    if (rejectionReason) {
      memoryBusinesses[index].rejectionReason = rejectionReason;
    }
    memoryBusinesses[index].updatedAt = new Date().toISOString();

    persistLocal();
    this.notify();

    if (db) {
      try {
        const payload: Record<string, any> = {
          status,
          updatedAt: memoryBusinesses[index].updatedAt
        };
        if (rejectionReason) payload.rejectionReason = rejectionReason;
        await updateDoc(doc(db, 'businesses', id), payload);
        console.info(`[Firestore] Moderación de negocio ${id} guardada en Firestore: ${status}`);
      } catch (err) {
        console.warn('[Firestore] Error al moderar negocio en Firestore:', err);
      }
    }
  },

  async deleteBusiness(id: string, requesterId: string, requesterRole: string): Promise<void> {
    const index = memoryBusinesses.findIndex(b => b.id === id);
    if (index === -1) return;

    if (requesterRole !== 'admin' && memoryBusinesses[index].ownerId !== requesterId) {
      securityService.logPrivilegeEscalationAttempt(requesterId, `DELETE_BUSINESS_${id}`, requesterRole);
      throw new Error('Solo el administrador o el dueño pueden dar de baja este negocio.');
    }

    memoryBusinesses.splice(index, 1);
    persistLocal();
    this.notify();

    if (db) {
      try {
        await deleteDoc(doc(db, 'businesses', id));
        console.info(`[Firestore] Negocio ${id} eliminado de Firestore.`);
      } catch (err) {
        console.warn('[Firestore] Error al eliminar negocio de Firestore:', err);
      }
    }
  }
};

