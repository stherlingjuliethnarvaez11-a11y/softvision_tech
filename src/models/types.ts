/**
 * SOFTVISION TECH — Modelos de Dominio (Capa Modelo en MVC)
 * "Tu comunidad a un solo clic"
 */

export type UserRole = 'visitante' | 'usuario' | 'dueno' | 'admin';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  photoURL?: string;
  phone?: string;
  createdAt: string;
  isBlocked?: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  iconName: string;
  description: string;
  businessCount?: number;
}

export type BusinessStatus = 'pendiente' | 'aprobado' | 'rechazado';

export interface BusinessHours {
  lunesViernes: string;
  sabado: string;
  domingo: string;
}

export interface Business {
  id: string;
  name: string;
  categoryId: string;
  categoryName: string;
  address: string;
  zone: string;
  phone: string;
  whatsapp?: string;
  email?: string;
  website?: string;
  hours: BusinessHours;
  description: string;
  services: string[];
  imageUrl: string;
  ownerId: string;
  ownerName: string;
  ratingAverage: number;
  reviewCount: number;
  status: BusinessStatus;
  createdAt: string;
  updatedAt: string;
  featured?: boolean;
  rejectionReason?: string;
}

export type ReviewStatus = 'visible' | 'oculto' | 'reportado';

export interface Review {
  id: string;
  businessId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  userRole?: UserRole;
  rating: number; // 1 to 5
  comment: string;
  createdAt: string;
  status: ReviewStatus;
  helpfulVotes?: number;
  reportedReason?: string;
}

export type AlertSeverity = 'baja' | 'media' | 'alta' | 'critica';
export type AlertStatus = 'activa' | 'investigando' | 'resuelta' | 'descartada';

export interface SecurityAlert {
  id: string;
  timestamp: string;
  eventType: 'XSS_ATTEMPT' | 'RATE_LIMIT_EXCEEDED' | 'PRIVILEGE_ESCALATION' | 'SPAM_REVIEWS' | 'UNAUTHORIZED_STATUS_CHANGE' | 'SUSPICIOUS_PAYLOAD';
  title: string;
  description: string;
  severity: AlertSeverity;
  status: AlertStatus;
  sourceIp: string;
  targetEntity?: string;
  targetId?: string;
  userUid?: string;
  userEmail?: string;
  metadata?: Record<string, unknown>;
  actionTaken?: string;
}

export interface PenetrationTestReportItem {
  id: string;
  testCase: string;
  vector: string;
  target: string;
  result: 'Mitigado' | 'En Observación' | 'Bloqueado';
  details: string;
  severity: AlertSeverity;
}

export interface ScrumRoleInfo {
  role: string;
  member: string;
  avatar: string;
  responsibilities: string;
  contribution: string;
}
