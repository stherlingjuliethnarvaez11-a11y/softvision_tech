/**
 * SOFTVISION TECH — Vista de Detalle del Negocio y Sistema de Reseñas (Presentacional)
 */

import React, { useState } from 'react';
import { Business, UserProfile } from '../models/types';
import { useReviewController } from '../controllers/useReviewController';
import { RatingStars } from '../components/RatingStars';
import { ReviewModal } from '../components/ReviewModal';
import { 
  ArrowLeft, 
  MapPin, 
  Phone, 
  Clock, 
  MessageSquare, 
  Globe, 
  Mail, 
  ShieldCheck, 
  ThumbsUp, 
  Flag, 
  Sparkles,
  Share2,
  CheckCircle
} from 'lucide-react';

interface BusinessDetailViewProps {
  business: Business;
  currentUser: UserProfile | null;
  onBack: () => void;
  onOpenAuth: () => void;
}

export const BusinessDetailView: React.FC<BusinessDetailViewProps> = ({
  business,
  currentUser,
  onBack,
  onOpenAuth
}) => {
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const {
    reviews,
    reviewCount,
    addReview,
    voteHelpful,
    reportReview,
    successMessage,
    errorMessage
  } = useReviewController(business.id);

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto" id="business-detail-view">
      
      {/* Botón Volver */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-bold text-[#475569] hover:text-blue-600 transition-colors bg-white px-3 py-1.5 rounded-lg border border-[#E2E8F0] shadow-sm"
        id="btn-back-to-directory"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Volver al Directorio</span>
      </button>

      {/* Banner Principal del Negocio */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden">
        
        {/* Imagen de Cabecera */}
        <div className="relative h-64 sm:h-80 w-full bg-slate-900">
          <img
            src={business.imageUrl}
            alt={business.name}
            className="w-full h-full object-cover opacity-90"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1000&auto=format&fit=crop&q=80';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

          {/* Categoría y Estado */}
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <span className="px-3 py-1 rounded text-xs font-bold bg-blue-50 text-blue-600 shadow-sm uppercase">
              {business.categoryName}
            </span>
            {business.status === 'aprobado' && (
              <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-green-500 text-white shadow-sm">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Comercio Verificado</span>
              </span>
            )}
          </div>

          {/* Información Superpuesta en la Imagen */}
          <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 text-white space-y-2">
            <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight">
              {business.name}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-200">
              <div className="flex items-center gap-1.5">
                <RatingStars
                  rating={business.ratingAverage}
                  size="sm"
                  showNumber={true}
                  reviewCount={reviewCount}
                />
              </div>

              <span className="hidden sm:inline opacity-40">•</span>

              <div className="flex items-center gap-1 text-blue-200">
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{business.zone || business.address}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Barra de Acciones Rápidas y Contacto */}
        <div className="px-6 py-4 bg-[#F8FAFC] border-b border-[#E2E8F0] flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {business.whatsapp && (
              <a
                href={`https://wa.me/${business.whatsapp.replace(/\D/g, '')}?text=Hola,%20los%20encontré%20en%20el%20Directorio%20Digital%20de%20Softvision%20Tech.`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all"
                id="btn-contact-whatsapp"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Contactar por WhatsApp</span>
              </a>
            )}

            <a
              href={`tel:${business.phone}`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-white text-[#475569] border border-[#E2E8F0] hover:bg-[#F1F5F9] transition-colors shadow-sm"
              id="btn-contact-phone"
            >
              <Phone className="w-4 h-4 text-blue-600" />
              <span>{business.phone}</span>
            </a>

            {business.website && (
              <a
                href={business.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold bg-white text-[#475569] border border-[#E2E8F0] hover:bg-[#F1F5F9] transition-colors"
              >
                <Globe className="w-4 h-4 text-[#94A3B8]" />
                <span className="hidden sm:inline">Sitio Web</span>
              </a>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white text-[#475569] border border-[#E2E8F0] hover:bg-[#F1F5F9] transition-colors"
            >
              <Share2 className="w-4 h-4 text-[#94A3B8]" />
              <span>{copiedLink ? '¡Enlace copiado!' : 'Compartir'}</span>
            </button>

            <button
              onClick={() => setIsReviewModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all"
              id="btn-open-review-modal"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Calificar Comercio</span>
            </button>
          </div>
        </div>

        {/* Contenido en Dos Columnas */}
        <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Columna Izquierda: Descripción y Servicios */}
          <div className="md:col-span-2 space-y-6">
            <div>
              <h2 className="text-base font-bold text-[#0F172A] mb-2">
                Acerca de este negocio
              </h2>
              <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed whitespace-pre-line">
                {business.description}
              </p>
            </div>

            {/* Servicios Ofrecidos */}
            {business.services && business.services.length > 0 && (
              <div>
                <h3 className="text-xs uppercase tracking-wider font-bold text-[#94A3B8] mb-2.5">
                  Servicios y Especialidades
                </h3>
                <div className="flex flex-wrap gap-2">
                  {business.services.map((srv, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#F1F5F9] text-[#475569] border border-[#E2E8F0]"
                    >
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                      <span>{srv}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Avisos de Éxito / Error */}
            {successMessage && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs">
                {successMessage}
              </div>
            )}
            {errorMessage && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs">
                {errorMessage}
              </div>
            )}
          </div>

          {/* Columna Derecha: Horarios y Ubicación */}
          <div className="space-y-6 bg-[#F8FAFC] p-5 rounded-2xl border border-[#E2E8F0] text-xs">
            {/* Horarios de Atención */}
            <div>
              <div className="flex items-center gap-2 font-bold text-[#0F172A] mb-3">
                <Clock className="w-4 h-4 text-blue-600" />
                <span>Horarios de Atención</span>
              </div>
              <ul className="space-y-2 text-[#64748B]">
                <li className="flex justify-between border-b border-[#E2E8F0] pb-1">
                  <span className="font-medium text-[#475569]">Lunes a Viernes:</span>
                  <span className="font-semibold text-[#1E293B]">{business.hours.lunesViernes}</span>
                </li>
                <li className="flex justify-between border-b border-[#E2E8F0] pb-1">
                  <span className="font-medium text-[#475569]">Sábados:</span>
                  <span className="font-semibold text-[#1E293B]">{business.hours.sabado}</span>
                </li>
                <li className="flex justify-between">
                  <span className="font-medium text-[#475569]">Domingos y Festivos:</span>
                  <span className="font-semibold text-[#1E293B]">{business.hours.domingo}</span>
                </li>
              </ul>
            </div>

            {/* Dirección */}
            <div>
              <div className="flex items-center gap-2 font-bold text-[#0F172A] mb-1.5">
                <MapPin className="w-4 h-4 text-blue-600" />
                <span>Dirección Exacta</span>
              </div>
              <p className="text-[#1E293B] font-medium">{business.address}</p>
              <p className="text-[11px] text-[#64748B] mt-0.5">{business.zone}</p>
            </div>

            {/* Datos del Comerciante */}
            <div className="pt-2 border-t border-[#E2E8F0] text-[11px] text-[#64748B]">
              <span className="block">Comerciante responsable:</span>
              <strong className="text-[#1E293B] font-bold">{business.ownerName}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Sección de Opiniones y Reseñas Comunitarias */}
      <section className="bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-8 shadow-sm space-y-6" id="reviews-section">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-5">
          <div>
            <h2 className="text-lg font-bold text-[#0F172A]">
              Calificaciones y Comentarios de Vecinos
            </h2>
            <p className="text-xs text-[#64748B]">
              Experiencias compartidas por miembros de la comunidad
            </p>
          </div>

          <button
            onClick={() => setIsReviewModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all self-start sm:self-auto"
            id="btn-leave-review"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Opinar sobre este negocio</span>
          </button>
        </div>

        {/* Listado de Reseñas */}
        {reviews.length === 0 ? (
          <div className="py-10 text-center space-y-2">
            <MessageSquare className="w-8 h-8 text-[#94A3B8] mx-auto" />
            <p className="text-sm font-semibold text-[#1E293B]">
              Aún no hay reseñas registradas
            </p>
            <p className="text-xs text-[#64748B] max-w-sm mx-auto">
              Sé el primer vecino en compartir tu experiencia para guiar a los demás habitantes del barrio.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="p-4 sm:p-5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2.5 transition-all hover:bg-slate-50"
                id={`review-item-${rev.id}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <img
                      src={rev.userAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${rev.userName}`}
                      alt={rev.userName}
                      className="w-9 h-9 rounded-full object-cover border border-[#E2E8F0]"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs sm:text-sm font-bold text-[#1E293B]">
                          {rev.userName}
                        </h4>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-green-100 text-green-800 font-semibold">
                          Vecino Verificado
                        </span>
                      </div>
                      <span className="text-[11px] text-[#94A3B8]">
                        {new Date(rev.createdAt).toLocaleDateString('es-CO', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>

                  <RatingStars rating={rev.rating} size="sm" />
                </div>

                <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
                  {rev.comment}
                </p>

                <div className="flex items-center justify-between pt-2 text-xs text-[#64748B] border-t border-[#E2E8F0]">
                  <button
                    type="button"
                    onClick={() => voteHelpful(rev.id)}
                    className="inline-flex items-center gap-1.5 hover:text-blue-600 transition-colors"
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>Útil ({rev.helpfulVotes || 0})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => reportReview(rev.id, 'Contenido inapropiado o spam reportado por vecino')}
                    className="inline-flex items-center gap-1 text-[#94A3B8] hover:text-rose-600 transition-colors text-[11px]"
                  >
                    <Flag className="w-3 h-3" />
                    <span>Reportar</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Modal para Agregar Reseña */}
      <ReviewModal
        isOpen={isReviewModalOpen}
        businessName={business.name}
        currentUser={currentUser}
        onClose={() => setIsReviewModalOpen(false)}
        onSubmit={async (rating, comment) => {
          if (!currentUser) throw new Error('Debes iniciar sesión.');
          await addReview({
            userId: currentUser.uid,
            userName: currentUser.displayName,
            userAvatar: currentUser.photoURL,
            rating,
            comment
          });
        }}
        onOpenAuth={onOpenAuth}
      />
    </div>
  );
};
