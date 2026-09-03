/**
 * SOFTVISION TECH — Servicio de Calificaciones y Reseñas Comunitarias (Capa Modelo en MVC)
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
import { Review, ReviewStatus } from '../models/types';
import { INITIAL_REVIEWS } from './mockData';
import { businessService } from './businessService';
import { securityService } from './securityService';
import { db } from './firebase';

const REVIEWS_STORAGE_KEY = 'softvision_reviews';

let memoryReviews: Review[] = [];

try {
  const raw = localStorage.getItem(REVIEWS_STORAGE_KEY);
  memoryReviews = raw ? JSON.parse(raw) : INITIAL_REVIEWS;
} catch {
  memoryReviews = INITIAL_REVIEWS;
}

function persistLocal(): void {
  try {
    localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(memoryReviews));
  } catch (e) {
    console.warn('[Storage] Error al guardar reseñas localmente:', e);
  }
}

export const reviewService = {
  listeners: [] as Array<() => void>,
  initializedFirestore: false,

  init(): void {
    if (this.initializedFirestore) return;
    this.initializedFirestore = true;

    if (db) {
      try {
        const revCol = collection(db, 'reviews');
        onSnapshot(revCol, (snapshot) => {
          if (!snapshot.empty) {
            const list: Review[] = [];
            snapshot.forEach((docSnap) => {
              list.push({ ...(docSnap.data() as Review), id: docSnap.id });
            });
            list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            memoryReviews = list;
            persistLocal();
            this.notify();
          } else {
            // Sembrar reseñas iniciales si la colección en Firestore está vacía
            INITIAL_REVIEWS.forEach(async (r) => {
              try {
                if (db) await setDoc(doc(db, 'reviews', r.id), r);
              } catch (err) {
                console.warn('[Firestore] Error sembrando reseña en Firestore:', err);
              }
            });
          }
        }, (err) => {
          console.warn('[Firestore] Escucha de reseñas en modo fallback/offline:', err);
        });

        console.info('[Firestore] reviewService suscrito a la colección "reviews".');
      } catch (e) {
        console.warn('[Firestore] Error inicializando listener de reviews:', e);
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

  getAllReviews(): Review[] {
    return memoryReviews;
  },

  getReviewsByBusiness(businessId: string, showHidden = false): Review[] {
    return memoryReviews.filter(r => r.businessId === businessId && (showHidden ? true : r.status === 'visible'));
  },

  async addReview(data: {
    businessId: string;
    userId: string;
    userName: string;
    userAvatar?: string;
    rating: number;
    comment: string;
  }): Promise<Review> {
    // 1. Verificación de Rate Limiting / Prevención de Spam
    const rateCheck = securityService.checkRateLimit(data.userId, 'review');
    if (!rateCheck.allowed) {
      throw new Error(`Has publicado varias reseñas recientemente. Por favor espera ${rateCheck.waitTimeSeconds || 30} segundos para volver a comentar.`);
    }

    // 2. Validación de Entrada
    if (data.rating < 1 || data.rating > 5) {
      throw new Error('La calificación debe estar comprendida entre 1 y 5 estrellas.');
    }

    if (!data.comment || data.comment.trim().length < 5) {
      throw new Error('Por favor escribe un comentario de al menos 5 caracteres para orientar a la comunidad.');
    }

    if (data.comment.length > 800) {
      throw new Error('El comentario no puede superar los 800 caracteres.');
    }

    // 3. Sanitización de seguridad contra XSS
    const sanitized = securityService.inspectAndSanitize(data.comment, 'comentario_resena', data.userId);

    const newId = `rev-${Date.now()}`;
    const newReview: Review = {
      id: newId,
      businessId: data.businessId,
      userId: data.userId,
      userName: data.userName,
      userAvatar: data.userAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.userName}`,
      rating: Math.round(data.rating),
      comment: sanitized.safeText,
      createdAt: new Date().toISOString(),
      status: 'visible',
      helpfulVotes: 0
    };

    memoryReviews.unshift(newReview);
    persistLocal();

    // 4. Recalcular promedio de estrellas y número de reseñas en el negocio
    this.recalculateBusinessRating(data.businessId);
    this.notify();

    // 5. Persistir en Firestore
    if (db) {
      try {
        await setDoc(doc(db, 'reviews', newId), newReview);
        console.info(`[Firestore] Reseña ${newId} persistida exitosamente.`);
      } catch (err) {
        console.warn('[Firestore] Error al persistir reseña en Firestore:', err);
      }
    }

    return newReview;
  },

  async voteHelpful(reviewId: string): Promise<void> {
    const review = memoryReviews.find(r => r.id === reviewId);
    if (review) {
      review.helpfulVotes = (review.helpfulVotes || 0) + 1;
      persistLocal();
      this.notify();

      if (db) {
        try {
          await updateDoc(doc(db, 'reviews', reviewId), {
            helpfulVotes: review.helpfulVotes
          });
        } catch (err) {
          console.warn('[Firestore] Error al actualizar votos útiles en Firestore:', err);
        }
      }
    }
  },

  async reportReview(reviewId: string, reason: string): Promise<void> {
    const review = memoryReviews.find(r => r.id === reviewId);
    if (review) {
      review.status = 'reportado';
      review.reportedReason = reason;
      persistLocal();

      securityService.createAlert({
        eventType: 'SPAM_REVIEWS',
        title: 'Reseña Marcada por la Comunidad',
        description: `Usuario reportó la reseña ${reviewId}: "${reason}". Requiere revisión del moderador.`,
        severity: 'baja',
        sourceIp: '192.168.1.55',
        targetEntity: 'reviews',
        targetId: reviewId,
        actionTaken: 'Marcada como reportada en el panel administrativo.'
      });

      this.notify();

      if (db) {
        try {
          await updateDoc(doc(db, 'reviews', reviewId), {
            status: 'reportado',
            reportedReason: reason
          });
        } catch (err) {
          console.warn('[Firestore] Error al reportar reseña en Firestore:', err);
        }
      }
    }
  },

  async moderateReview(reviewId: string, status: ReviewStatus, adminUid: string): Promise<void> {
    const review = memoryReviews.find(r => r.id === reviewId);
    if (review) {
      review.status = status;
      persistLocal();
      this.recalculateBusinessRating(review.businessId);
      this.notify();

      if (db) {
        try {
          await updateDoc(doc(db, 'reviews', reviewId), {
            status
          });
          console.info(`[Firestore] Moderación de reseña ${reviewId} actualizada en Firestore: ${status}`);
        } catch (err) {
          console.warn('[Firestore] Error al moderar reseña en Firestore:', err);
        }
      }
    }
  },

  async deleteReview(reviewId: string): Promise<void> {
    const index = memoryReviews.findIndex(r => r.id === reviewId);
    if (index === -1) return;
    const bizId = memoryReviews[index].businessId;

    memoryReviews.splice(index, 1);
    persistLocal();
    this.recalculateBusinessRating(bizId);
    this.notify();

    if (db) {
      try {
        await deleteDoc(doc(db, 'reviews', reviewId));
        console.info(`[Firestore] Reseña ${reviewId} eliminada de Firestore.`);
      } catch (err) {
        console.warn('[Firestore] Error al eliminar reseña de Firestore:', err);
      }
    }
  },

  recalculateBusinessRating(businessId: string): void {
    const business = businessService.getBusinessById(businessId);
    if (!business) return;

    const visibleReviews = this.getReviewsByBusiness(businessId, false);
    if (visibleReviews.length === 0) {
      business.ratingAverage = 5.0;
      business.reviewCount = 0;
    } else {
      const sum = visibleReviews.reduce((acc, r) => acc + r.rating, 0);
      business.ratingAverage = Number((sum / visibleReviews.length).toFixed(1));
      business.reviewCount = visibleReviews.length;
    }

    try {
      businessService.updateBusiness(businessId, {
        ratingAverage: business.ratingAverage,
        reviewCount: business.reviewCount
      }, 'system-admin', 'admin');
    } catch {
      // Direct silent update for statistics
    }
  }
};

