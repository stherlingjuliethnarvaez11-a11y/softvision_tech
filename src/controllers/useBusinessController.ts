/**
 * SOFTVISION TECH — Controlador de Negocios y Directorio (MVC: Controller)
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Business, Category } from '../models/types';
import { businessService } from '../services/businessService';

export function useBusinessController() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedZone, setSelectedZone] = useState<string>('all');
  const [version, setVersion] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  // Escuchar cambios reactivos en el servicio
  useEffect(() => {
    const unsubscribe = businessService.subscribe(() => {
      setVersion(v => v + 1);
    });
    return unsubscribe;
  }, []);

  const categories = useMemo(() => {
    return businessService.getCategories();
  }, [version]);

  // Lista de negocios filtrada según término, categoría y zona
  const filteredBusinesses = useMemo(() => {
    return businessService.searchBusinesses({
      term: searchTerm,
      categoryId: selectedCategory,
      zone: selectedZone,
      includePending: false
    });
  }, [searchTerm, selectedCategory, selectedZone, version]);

  const allApprovedBusinesses = useMemo(() => {
    return businessService.getBusinesses('aprobado');
  }, [version]);

  // Extraer lista de zonas únicas para el filtro geográfico
  const availableZones = useMemo(() => {
    const zones = new Set<string>();
    allApprovedBusinesses.forEach(b => {
      if (b.zone) zones.add(b.zone);
    });
    return Array.from(zones);
  }, [allApprovedBusinesses]);

  const getBusiness = useCallback((id: string): Business | undefined => {
    return businessService.getBusinessById(id);
  }, [version]);

  const registerBusiness = useCallback(async (data: {
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
  }) => {
    setIsSubmitting(true);
    setActionError(null);
    try {
      const created = await businessService.createBusiness(data);
      return created;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al registrar el negocio';
      setActionError(msg);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const updateBusiness = useCallback(async (id: string, updates: Partial<Business>, userId: string, role: string) => {
    setIsSubmitting(true);
    setActionError(null);
    try {
      const updated = await businessService.updateBusiness(id, updates, userId, role);
      return updated;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al actualizar el negocio';
      setActionError(msg);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const clearFilters = useCallback(() => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedZone('all');
  }, []);

  return {
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    selectedZone,
    setSelectedZone,
    categories,
    availableZones,
    businesses: filteredBusinesses,
    totalCount: filteredBusinesses.length,
    isSubmitting,
    actionError,
    getBusiness,
    registerBusiness,
    updateBusiness,
    clearFilters
  };
}
