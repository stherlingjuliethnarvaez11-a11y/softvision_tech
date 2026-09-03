/**
 * SOFTVISION TECH — Controlador de Reseñas y Calificaciones (MVC: Controller)
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Review } from '../models/types';
import { reviewService } from '../services/reviewService';

export function useReviewController(businessId: string) {
  const [version, setVersion] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = reviewService.subscribe(() => {
      setVersion(v => v + 1);
    });
    return unsubscribe;
  }, []);

  const reviews = useMemo(() => {
    return reviewService.getReviewsByBusiness(businessId, false);
  }, [businessId, version]);

  const addReview = useCallback(async (data: {
    userId: string;
    userName: string;
    userAvatar?: string;
    rating: number;
    comment: string;
  }) => {
    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const newReview = await reviewService.addReview({
        businessId,
        userId: data.userId,
        userName: data.userName,
        userAvatar: data.userAvatar,
        rating: data.rating,
        comment: data.comment
      });
      setSuccessMessage('¡Tu reseña ha sido publicada exitosamente y apoya al comercio local!');
      return newReview;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'No se pudo registrar la reseña.';
      setErrorMessage(msg);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  }, [businessId]);

  const voteHelpful = useCallback(async (reviewId: string) => {
    await reviewService.voteHelpful(reviewId);
  }, []);

  const reportReview = useCallback(async (reviewId: string, reason: string) => {
    await reviewService.reportReview(reviewId, reason);
  }, []);

  return {
    reviews,
    reviewCount: reviews.length,
    isSubmitting,
    errorMessage,
    successMessage,
    addReview,
    voteHelpful,
    reportReview
  };
}
