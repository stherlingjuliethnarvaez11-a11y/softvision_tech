/**
 * SOFTVISION TECH — Vista Principal (Directorio de Negocios Locales)
 * "Tu comunidad a un solo clic"
 */

import React from 'react';
import { Business, Category } from '../models/types';
import { BusinessCard } from '../components/BusinessCard';
import { CategoryPills } from '../components/CategoryPills';
import { 
  Search, 
  MapPin, 
  SlidersHorizontal, 
  Store, 
  Sparkles, 
  ShieldCheck, 
  PlusCircle, 
  X 
} from 'lucide-react';

interface HomeViewProps {
  businesses: Business[];
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (catId: string) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  selectedZone: string;
  onSelectZone: (zone: string) => void;
  availableZones: string[];
  onClearFilters: () => void;
  onViewBusinessDetails: (businessId: string) => void;
  onNavigateRegister: () => void;
  onQuickReview: (business: Business) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  businesses,
  categories,
  selectedCategory,
  onSelectCategory,
  searchTerm,
  onSearchChange,
  selectedZone,
  onSelectZone,
  availableZones,
  onClearFilters,
  onViewBusinessDetails,
  onNavigateRegister,
  onQuickReview
}) => {
  const hasActiveFilters = searchTerm !== '' || selectedCategory !== 'all' || selectedZone !== 'all';

  return (
    <div className="space-y-8 animate-fade-in" id="home-view">
      
      {/* Hero Banner y Buscador Central */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-700 via-blue-600 to-slate-900 text-white p-6 sm:p-10 shadow-sm border border-blue-500/20" id="hero-section">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-blue-100 text-xs font-semibold backdrop-blur-sm border border-white/10">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Softvision Tech • "Tu comunidad a un solo clic"</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
            Explora comercios y servicios recomendados en tu comunidad
          </h1>

          <p className="text-xs sm:text-sm text-blue-100/90 max-w-2xl mx-auto leading-relaxed">
            Panaderías, talleres mecánicos, clínicas, barberías y profesionales locales de confianza. Información veraz, horarios actualizados y opiniones comunitarias.
          </p>

          {/* Barra de Búsqueda Interactiva */}
          <div className="pt-3 max-w-2xl mx-auto">
            <div className="bg-white p-2 rounded-xl shadow-xl flex flex-col sm:flex-row items-center gap-2 text-[#1E293B] border border-[#E2E8F0]">
              
              {/* Input de Texto */}
              <div className="relative flex-1 w-full flex items-center">
                <Search className="w-5 h-5 text-[#94A3B8] absolute left-3.5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder="Buscar panaderías, talleres, médicos..."
                  className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm text-[#1E293B] placeholder-[#94A3B8] focus:outline-none rounded-xl"
                  id="main-search-input"
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => onSearchChange('')}
                    className="p-1 mr-2 text-[#94A3B8] hover:text-[#1E293B] rounded-full"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Filtro por Zona */}
              <div className="w-full sm:w-auto border-t sm:border-t-0 sm:border-l border-[#E2E8F0] pt-2 sm:pt-0 sm:pl-2 flex items-center">
                <MapPin className="w-4 h-4 text-[#94A3B8] mr-1.5 shrink-0" />
                <select
                  value={selectedZone}
                  onChange={(e) => onSelectZone(e.target.value)}
                  className="text-xs font-semibold text-[#475569] bg-transparent py-2 pr-4 focus:outline-none cursor-pointer w-full"
                  id="zone-select-filter"
                >
                  <option value="all">Todas las zonas</option>
                  {availableZones.map((zone) => (
                    <option key={zone} value={zone}>{zone}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categorías */}
      <section className="space-y-3" id="categories-section">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[#0F172A]">
              Explorar por Categoría
            </h2>
            <p className="text-xs text-[#64748B]">
              Clasificación organizada de los servicios comunitarios
            </p>
          </div>
          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" />
              <span>Limpiar filtros</span>
            </button>
          )}
        </div>

        <CategoryPills
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={onSelectCategory}
        />
      </section>

      {/* Listado de Negocios */}
      <section className="space-y-4" id="businesses-list-section">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-[#E2E8F0] pb-4">
          <div>
            <h2 className="text-2xl font-bold text-[#0F172A]">
              Explorar Negocios Locales
            </h2>
            <p className="text-sm text-[#64748B] mt-1">
              Mostrando {businesses.length} {businesses.length === 1 ? 'negocio recomendado' : 'negocios recomendados'} en tu comunidad.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onNavigateRegister}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 text-xs font-semibold shadow-sm transition-colors"
              id="cta-register-from-home"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Registrar Negocio</span>
            </button>
          </div>
        </div>

        {businesses.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-[#E2E8F0] p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#F8FAFC] text-[#94A3B8] flex items-center justify-center mx-auto border border-[#E2E8F0]">
              <Store className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#1E293B]">
              No encontramos negocios con estos criterios
            </h3>
            <p className="text-xs text-[#64748B] max-w-md mx-auto">
              Prueba modificando el término de búsqueda o selecciona "Todas las categorías".
            </p>
            <button
              onClick={onClearFilters}
              className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors shadow-sm"
            >
              Ver todos los comercios
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {businesses.map((biz) => (
              <BusinessCard
                key={biz.id}
                business={biz}
                onViewDetails={onViewBusinessDetails}
                onQuickReview={onQuickReview}
              />
            ))}
          </div>
        )}

        {/* Banner CTA Sleek Interface: ¿Eres comerciante local? */}
        <div className="mt-8 bg-blue-600 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between text-white gap-4 shadow-sm">
          <div>
            <h3 className="text-xl font-bold">¿Eres comerciante local?</h3>
            <p className="text-blue-100 text-sm mt-1">Únete a Softvision Tech y haz crecer tu negocio en el barrio.</p>
          </div>
          <button
            onClick={onNavigateRegister}
            className="px-6 py-3 bg-white text-blue-600 font-bold rounded-xl shadow-md hover:bg-blue-50 transition-all shrink-0"
          >
            Registrar mi negocio ahora
          </button>
        </div>
      </section>

    </div>
  );
};
