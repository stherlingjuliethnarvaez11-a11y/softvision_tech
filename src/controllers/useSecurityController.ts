/**
 * SOFTVISION TECH — Controlador del Centro de Ciberseguridad y Alertas en Tiempo Real (MVC: Controller)
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { SecurityAlert, PenetrationTestReportItem } from '../models/types';
import { securityService } from '../services/securityService';

export function useSecurityController() {
  const [alerts, setAlerts] = useState<SecurityAlert[]>(securityService.getAlerts());

  useEffect(() => {
    const unsub = securityService.subscribeAlerts((updatedAlerts) => {
      setAlerts([...updatedAlerts]);
    });
    return unsub;
  }, []);

  const activeAlerts = useMemo(() => {
    return alerts.filter(a => a.status === 'activa');
  }, [alerts]);

  const criticalCount = useMemo(() => {
    return alerts.filter(a => a.severity === 'critica' || a.severity === 'alta').length;
  }, [alerts]);

  const updateAlertStatus = useCallback((alertId: string, status: SecurityAlert['status'], actionTaken?: string) => {
    securityService.updateAlertStatus(alertId, status, actionTaken);
  }, []);

  const simulateAttack = useCallback((type: 'XSS' | 'RATE_LIMIT' | 'ESCALATION') => {
    securityService.simulateAttack(type);
  }, []);

  const penetrationReport = useMemo((): PenetrationTestReportItem[] => {
    return securityService.getPenetrationTestReport();
  }, []);

  return {
    alerts,
    activeAlerts,
    activeAlertsCount: activeAlerts.length,
    criticalCount,
    penetrationReport,
    updateAlertStatus,
    simulateAttack
  };
}
