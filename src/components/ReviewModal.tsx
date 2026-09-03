/**
 * SOFTVISION TECH — Modal para Publicar Reseña y Calificación
 */

import React, { useState } from 'react';
import { RatingStars } from './RatingStars';
import { X, Send, AlertCircle, ShieldAlert, Sparkles } from 'lucide-react';
import { UserProfile } from '../models/types';

interface ReviewModalProps {
  isOpen: boolean;
  businessName: string;
  currentUser: UserProfile | null;
  onClose: () => void;
  onSubmit: (rating: number, comment: string) => Promise<void>;
  onOpenAuth: () => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  businessName,
  currentUser,
  onClose,
  onSubmit,
  onOpenAuth
}) => {
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      onOpenAuth();
      return;
    }

    if (comment.trim().length < 5) {
      setLocalError('El comentario debe contener al menos 5 caracteres.');
      return;
    }

    setIsSubmitting(true);
    setLocalError(null);

    try {
      await onSubmit(rating, comment);
      setComment('');
      setRating(5);
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al guardar la reseña';
      setLocalError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in" id="review-modal-backdrop">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-[#E2E8F0] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
          <div>
            <h3 className="text-base font-bold text-[#0F172A]">
              Calificar y Opinar
            </h3>
            <p className="text-xs text-[#64748B] truncate max-w-xs">
              {businessName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#94A3B8] hover:text-[#1E293B] rounded-lg hover:bg-slate-100 transition-colors"
            id="close-review-modal-btn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        {!currentUser ? (
          <div className="p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-3">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-[#0F172A] mb-1">
              Inicia sesión para opinar
            </h4>
            <p className="text-xs text-[#64748B] mb-4 max-w-sm mx-auto">
              Para garantizar que las reseñas provengan de vecinos reales y evitar el spam comercial, debes estar autenticado.
            </p>
            <button
              onClick={() => {
                onClose();
                onOpenAuth();
              }}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-sm"
            >
              Iniciar Sesión / Registrarme
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {localError && (
              <div className="flex items-start gap-2 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{localError}</span>
              </div>
            )}

            {/* Selector de Estrellas */}
            <div className="text-center py-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
              <span className="block text-xs font-semibold text-[#475569] mb-2">
                ¿Cómo calificarías tu experiencia?
              </span>
              <div className="flex justify-center">
                <RatingStars
                  rating={rating}
                  interactive={true}
                  onRatingChange={setRating}
                  size="lg"
                />
              </div>
              <span className="text-xs font-bold text-blue-600 mt-1.5 block">
                {rating === 5 && '¡Excelente servicio!'}
                {rating === 4 && 'Muy buen servicio'}
                {rating === 3 && 'Aceptable / Promedio'}
                {rating === 2 && 'Debe mejorar'}
                {rating === 1 && 'Mala experiencia'}
              </span>
            </div>

            {/* Comentario */}
            <div>
              <label className="block text-xs font-semibold text-[#1E293B] mb-1">
                Tu comentario y recomendación
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Cuéntale a tus vecinos qué tal fue el producto, la atención o el tiempo de entrega..."
                rows={4}
                maxLength={800}
                required
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none text-[#1E293B]"
                id="review-comment-textarea"
              />
              <div className="flex justify-between items-center text-[11px] text-[#94A3B8] mt-1">
                <span>Mínimo 5 caracteres • Inspección anti-XSS activa</span>
                <span>{comment.length} / 800</span>
              </div>
            </div>

            {/* Botones */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E2E8F0]">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-2 text-xs font-semibold text-[#475569] hover:bg-slate-100 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg shadow-sm transition-all"
                id="submit-review-modal-btn"
              >
                {isSubmitting ? (
                  <span>Publicando...</span>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Publicar Reseña</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
