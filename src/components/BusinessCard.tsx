/**
 * SOFTVISION TECH — Tarjeta de Negocio Local (Presentacional)
 */

import React from 'react';
import { Business } from '../models/types';
import { RatingStars } from './RatingStars';
import { MapPin, Phone, MessageSquare, Clock, ArrowRight, ShieldCheck } from 'lucide-react';

interface BusinessCardProps {
  business: Business;
  onViewDetails: (businessId: string) => void;
  onQuickReview?: (business: Business) => void;
}

export const BusinessCard: React.FC<BusinessCardProps> = ({
  business,
  onViewDetails,
  onQuickReview
}) => {
  return (
    <article
      id={`business-card-${business.id}`}
      className="group bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden shadow-sm hover:shadow-md hover:border-blue-300 transition-all duration-200 flex flex-col justify-between"
    >
      <div>
        {/* Encabezado con Imagen y Badges */}
        <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
          <img
            src={business.imageUrl}
            alt={business.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&auto=format&fit=crop&q=80';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Categoría */}
          <div className="absolute top-3 left-3">
            <span className="text-[10px] px-2.5 py-1 bg-blue-50 text-blue-600 rounded font-bold uppercase shadow-sm">
              {business.categoryName}
            </span>
          </div>

          {/* Badge de Verificación / Estado */}
          <div className="absolute top-3 right-3 flex items-center gap-1.5">
            {business.status === 'aprobado' && (
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-500 text-white shadow-sm">
                <ShieldCheck className="w-3 h-3" />
                <span>ABIERTO</span>
              </div>
            )}
          </div>

          {/* Zona o Comuna */}
          <div className="absolute bottom-2 left-3 flex items-center gap-1 text-[11px] text-white/95 font-medium">
            <MapPin className="w-3.5 h-3.5 text-blue-300 shrink-0" />
            <span className="truncate max-w-[220px]">{business.zone || business.address}</span>
          </div>
        </div>

        {/* Contenido Principal */}
        <div className="p-5">
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <h3
              onClick={() => onViewDetails(business.id)}
              className="text-base font-bold text-[#1E293B] group-hover:text-blue-600 transition-colors cursor-pointer line-clamp-1"
            >
              {business.name}
            </h3>
          </div>

          {/* Calificación y Conteo */}
          <div className="mb-2.5">
            <RatingStars
              rating={business.ratingAverage}
              showNumber={true}
              reviewCount={business.reviewCount}
              size="sm"
            />
          </div>

          {/* Descripción */}
          <p className="text-xs text-[#64748B] line-clamp-2 mb-3 leading-relaxed">
            {business.description}
          </p>

          {/* Horario y Teléfono */}
          <div className="space-y-1.5 pt-2.5 border-t border-[#E2E8F0] text-xs text-[#64748B]">
            <div className="flex items-center gap-2 truncate">
              <Clock className="w-3.5 h-3.5 text-[#94A3B8] shrink-0" />
              <span className="truncate">L-V: {business.hours.lunesViernes}</span>
            </div>
            <div className="flex items-center gap-2 truncate">
              <Phone className="w-3.5 h-3.5 text-[#94A3B8] shrink-0" />
              <span className="font-mono text-[#1E293B]">{business.phone}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Acciones Rápidas */}
      <div className="p-5 pt-0">
        <div className="flex items-center gap-2 pt-3 border-t border-[#E2E8F0]">
          {business.whatsapp ? (
            <a
              href={`https://wa.me/${business.whatsapp.replace(/\D/g, '')}?text=Hola,%20los%20encontré%20en%20el%20Directorio%20de%20Softvision%20Tech.`}
              target="_blank"
              rel="noopener noreferrer"
              id={`btn-wa-${business.id}`}
              className="py-2 px-3 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors border border-emerald-200 text-center"
            >
              WhatsApp
            </a>
          ) : (
            <a
              href={`tel:${business.phone}`}
              id={`btn-tel-${business.id}`}
              className="py-2 px-3 rounded-lg text-xs font-bold bg-[#F8FAFC] border border-[#E2E8F0] text-[#475569] hover:bg-slate-200 transition-colors text-center"
            >
              Llamar
            </a>
          )}

          <button
            type="button"
            id={`btn-view-${business.id}`}
            onClick={() => onViewDetails(business.id)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-bold bg-[#F8FAFC] border border-[#E2E8F0] text-[#475569] hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all shadow-sm"
          >
            <span>Ver Detalles</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </article>
  );
};
