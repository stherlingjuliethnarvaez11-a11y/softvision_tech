/**
 * SOFTVISION TECH — Controlador del Panel de Administración y Moderación (MVC: Controller)
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Business, Review, Category, BusinessStatus, ReviewStatus } from '../models/types';
import { businessService } from '../services/businessService';
import { reviewService } from '../services/reviewService';

export function useAdminController() {
  const [version, setVersion] = useState(0);

  useEffect(() => {
    const unsubBiz = businessService.subscribe(() => setVersion(v => v + 1));
    const unsubRev = reviewService.subscribe(() => setVersion(v => v + 1));
    return () => {
      unsubBiz();
      unsubRev();
    };
  }, []);

  const allBusinesses = useMemo((): Business[] => {
    return businessService.getBusinesses();
  }, [version]);

  const pendingBusinesses = useMemo(() => {
    return allBusinesses.filter(b => b.status === 'pendiente');
  }, [allBusinesses]);

  const allReviews = useMemo((): Review[] => {
    return reviewService.getAllReviews();
  }, [version]);

  const reportedReviews = useMemo(() => {
    return allReviews.filter(r => r.status === 'reportado');
  }, [allReviews]);

  const categories = useMemo((): Category[] => {
    return businessService.getCategories();
  }, [version]);

  const moderateBusiness = useCallback(async (businessId: string, newStatus: BusinessStatus, adminUid: string, reason?: string) => {
    await businessService.moderateBusiness(businessId, newStatus, adminUid, reason);
  }, []);

  const moderateReview = useCallback(async (reviewId: string, newStatus: ReviewStatus, adminUid: string) => {
    await reviewService.moderateReview(reviewId, newStatus, adminUid);
  }, []);

  const addCategory = useCallback(async (data: { name: string; slug: string; iconName: string; description: string }) => {
    return await businessService.addCategory(data);
  }, []);

  const deleteBusiness = useCallback(async (id: string, adminUid: string) => {
    await businessService.deleteBusiness(id, adminUid, 'admin');
  }, []);

  return {
    allBusinesses,
    pendingBusinesses,
    allReviews,
    reportedReviews,
    categories,
    stats: {
      totalBusinesses: allBusinesses.length,
      pendingCount: pendingBusinesses.length,
      approvedCount: allBusinesses.filter(b => b.status === 'aprobado').length,
      totalReviews: allReviews.length,
      reportedReviewsCount: reportedReviews.length
    },
    moderateBusiness,
    moderateReview,
    addCategory,
    deleteBusiness
  };
}
