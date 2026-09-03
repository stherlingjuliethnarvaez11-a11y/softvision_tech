/**
 * SOFTVISION TECH — Panel de Administración y Moderación (MVC: Vista)
 * "Tu comunidad a un solo clic"
 */

import React, { useState } from 'react';
import { useAdminController } from '../controllers/useAdminController';
import { UserProfile, BusinessStatus, ReviewStatus } from '../models/types';
import { 
  ShieldCheck, 
  Store, 
  MessageSquare, 
  Layers, 
  Check, 
  X, 
  Trash2, 
  Eye, 
  AlertTriangle, 
  Plus, 
  ShieldAlert,
  ArrowLeft,
  Sparkles
} from 'lucide-react';

interface AdminDashboardViewProps {
  currentUser: UserProfile | null;
  onBack: () => void;
  onSwitchToAdmin: () => void;
  onViewBusinessDetails: (id: string) => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  currentUser,
  onBack,
  onSwitchToAdmin,
  onViewBusinessDetails
}) => {
  const [activeTab, setActiveTab] = useState<'businesses' | 'reviews' | 'categories'>('businesses');
  const [businessFilter, setBusinessFilter] = useState<BusinessStatus | 'all'>('pendiente');
  const [newCatName, setNewCatName] = useState('');
  const [newCatSlug, setNewCatSlug] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');

  const {
    allBusinesses,
    pendingBusinesses,
    allReviews,
    reportedReviews,
    categories,
    stats,
    moderateBusiness,
    moderateReview,
    addCategory,
    deleteBusiness
  } = useAdminController();

  const isAdmin = currentUser?.role === 'admin';

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName) return;
    addCategory({
      name: newCatName,
      slug: newCatSlug || newCatName.toLowerCase().replace(/\s+/g, '-'),
      iconName: 'Store',
      description: newCatDesc || `Comercios de ${newCatName}`
    });
    setNewCatName('');
    setNewCatSlug('');
    setNewCatDesc('');
  };

  const displayedBusinesses = businessFilter === 'all' 
    ? allBusinesses 
    : allBusinesses.filter(b => b.status === businessFilter);

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto" id="admin-dashboard-view">
      
      {/* Botón Volver y Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-bold text-[#475569] hover:text-blue-600 transition-colors bg-white px-3 py-1.5 rounded-lg border border-[#E2E8F0] shadow-sm self-start"
          id="btn-back-from-admin"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al Directorio</span>
        </button>

        {/* Notificación si no es admin */}
        {!isAdmin && (
          <div className="flex items-center gap-2 p-2 px-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 text-xs">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>Estás viendo el panel en modo de prueba.</span>
            <button
              onClick={onSwitchToAdmin}
              className="font-bold underline ml-1 hover:text-blue-950"
            >
              Cambiar a Rol Administrador
            </button>
          </div>
        )}
      </div>

      {/* Encabezado del Panel */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-200">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#0F172A]">
              Panel de Moderación y Gobernanza Comunitaria
            </h1>
            <p className="text-xs text-[#64748B]">
              Softvision Tech • Verificación de comercios, moderación de opiniones y control de calidad
            </p>
          </div>
        </div>

        {/* Métricas Resumidas */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
            <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block">
              Pendientes
            </span>
            <span className="text-2xl font-extrabold text-amber-900 mt-1 block">
              {stats.pendingCount}
            </span>
            <span className="text-[10px] text-amber-700">Comercios por revisar</span>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
            <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
              Aprobados
            </span>
            <span className="text-2xl font-extrabold text-emerald-900 mt-1 block">
              {stats.approvedCount}
            </span>
            <span className="text-[10px] text-emerald-700">Comercios en vivo</span>
          </div>

          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200">
            <span className="text-[11px] font-bold text-rose-800 uppercase tracking-wider block">
              Reseñas Reportadas
            </span>
            <span className="text-2xl font-extrabold text-rose-900 mt-1 block">
              {stats.reportedReviewsCount}
            </span>
            <span className="text-[10px] text-rose-700">Alertas de vecinos</span>
          </div>

          <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
            <span className="text-[11px] font-bold text-blue-800 uppercase tracking-wider block">
              Categorías
            </span>
            <span className="text-2xl font-extrabold text-blue-900 mt-1 block">
              {categories.length}
            </span>
            <span className="text-[10px] text-blue-700">Sectores activos</span>
          </div>
        </div>
      </div>

      {/* Pestañas de Navegación del Panel */}
      <div className="flex border-b border-[#E2E8F0] bg-white rounded-2xl px-4 shadow-sm text-xs font-bold overflow-x-auto">
        <button
          onClick={() => setActiveTab('businesses')}
          className={`flex items-center gap-2 py-3.5 px-4 border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'businesses'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-[#64748B] hover:text-[#0F172A]'
          }`}
          id="tab-admin-businesses"
        >
          <Store className="w-4 h-4" />
          <span>Moderar Negocios</span>
          {stats.pendingCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-amber-500 text-white text-[10px] flex items-center justify-center">
              {stats.pendingCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('reviews')}
          className={`flex items-center gap-2 py-3.5 px-4 border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'reviews'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-[#64748B] hover:text-[#0F172A]'
          }`}
          id="tab-admin-reviews"
        >
          <MessageSquare className="w-4 h-4" />
          <span>Moderar Reseñas</span>
          {stats.reportedReviewsCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] flex items-center justify-center">
              {stats.reportedReviewsCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('categories')}
          className={`flex items-center gap-2 py-3.5 px-4 border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'categories'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-[#64748B] hover:text-[#0F172A]'
          }`}
          id="tab-admin-categories"
        >
          <Layers className="w-4 h-4" />
          <span>Gestionar Categorías</span>
        </button>
      </div>

      {/* Contenido de la Pestaña 1: Negocios */}
      {activeTab === 'businesses' && (
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-sm space-y-4">
          
          {/* Sub-filtro de estado */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-900">
              Cola de Moderación de Negocios
            </h2>
            <div className="flex items-center gap-1.5 text-xs">
              {(['pendiente', 'aprobado', 'rechazado', 'all'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setBusinessFilter(st)}
                  className={`px-3 py-1 rounded-lg font-semibold capitalize transition-all ${
                    businessFilter === st
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {st === 'all' ? 'Todos' : st}
                </button>
              ))}
            </div>
          </div>

          {displayedBusinesses.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs">
              No hay negocios registrados con el filtro seleccionado.
            </div>
          ) : (
            <div className="space-y-3">
              {displayedBusinesses.map((b) => (
                <div
                  key={b.id}
                  className="p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-purple-200 transition-colors"
                  id={`admin-biz-${b.id}`}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={b.imageUrl}
                      alt={b.name}
                      className="w-14 h-14 rounded-xl object-cover border border-slate-200 shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-slate-900">{b.name}</h3>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                            b.status === 'aprobado'
                              ? 'bg-emerald-100 text-emerald-800'
                              : b.status === 'pendiente'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {b.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {b.categoryName} • {b.zone} • Dueño: <strong className="text-slate-700">{b.ownerName}</strong>
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Tel: {b.phone} • Dirección: {b.address}
                      </p>
                    </div>
                  </div>

                  {/* Acciones de Moderación */}
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      onClick={() => onViewBusinessDetails(b.id)}
                      className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded-lg text-xs font-semibold flex items-center gap-1"
                      title="Ver ficha pública"
                    >
                      <Eye className="w-4 h-4" />
                      <span className="hidden sm:inline">Ver</span>
                    </button>

                    {b.status !== 'aprobado' && (
                      <button
                        onClick={() => moderateBusiness(b.id, 'aprobado', currentUser?.uid || 'admin')}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 shadow-sm"
                        id={`btn-approve-${b.id}`}
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Aprobar</span>
                      </button>
                    )}

                    {b.status !== 'rechazado' && (
                      <button
                        onClick={() => moderateBusiness(b.id, 'rechazado', currentUser?.uid || 'admin', 'Información incompleta o no verificable.')}
                        className="px-3 py-1.5 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-800 text-xs font-semibold flex items-center gap-1"
                        id={`btn-reject-${b.id}`}
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Rechazar</span>
                      </button>
                    )}

                    <button
                      onClick={() => {
                        if (confirm(`¿Estás seguro de eliminar "${b.name}" definitivamente?`)) {
                          deleteBusiness(b.id, currentUser?.uid || 'admin');
                        }
                      }}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Eliminar registro"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Contenido de la Pestaña 2: Reseñas */}
      {activeTab === 'reviews' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-900">
              Moderación de Opiniones Comunitarias
            </h2>
            <span className="text-xs text-slate-500">
              Total de comentarios: {allReviews.length}
            </span>
          </div>

          <div className="space-y-3">
            {allReviews.map((r) => (
              <div
                key={r.id}
                className="p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
                id={`admin-review-${r.id}`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{r.userName}</span>
                    <span className="text-amber-500 font-bold">★ {r.rating}</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                        r.status === 'visible'
                          ? 'bg-emerald-100 text-emerald-800'
                          : r.status === 'reportado'
                          ? 'bg-rose-100 text-rose-800 animate-pulse'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {r.status}
                    </span>
                  </div>
                  <p className="text-slate-700">{r.comment}</p>
                  {r.reportedReason && (
                    <p className="text-[11px] text-rose-600 font-medium">
                      Motivo del reporte: {r.reportedReason}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  {r.status !== 'visible' ? (
                    <button
                      onClick={() => moderateReview(r.id, 'visible', currentUser?.uid || 'admin')}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                    >
                      Restaurar
                    </button>
                  ) : (
                    <button
                      onClick={() => moderateReview(r.id, 'oculto', currentUser?.uid || 'admin')}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 font-semibold border border-slate-200"
                    >
                      Ocultar
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Contenido de la Pestaña 3: Categorías */}
      {activeTab === 'categories' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Formulario Agregar Categoría */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900">
              Crear Nueva Categoría
            </h3>
            <form onSubmit={handleAddCategory} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nombre</label>
                <input
                  type="text"
                  required
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  placeholder="Ej. Mascotas & Veterinaria"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Slug identificador</label>
                <input
                  type="text"
                  value={newCatSlug}
                  onChange={(e) => setNewCatSlug(e.target.value)}
                  placeholder="mascotas-veterinaria"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Descripción</label>
                <textarea
                  value={newCatDesc}
                  onChange={(e) => setNewCatDesc(e.target.value)}
                  rows={2}
                  placeholder="Veterinarias, alimentos, accesorios y paseadores"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold shadow-sm transition-colors flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Agregar Categoría</span>
              </button>
            </form>
          </div>

          {/* Listado de Categorías Existentes */}
          <div className="md:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900">
              Categorías Activas ({categories.length})
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {categories.map((cat) => (
                <div key={cat.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{cat.name}</span>
                    <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 text-[10px] font-bold">
                      {cat.businessCount || 0} negocios
                    </span>
                  </div>
                  <p className="text-slate-500 text-[11px] line-clamp-2">{cat.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
