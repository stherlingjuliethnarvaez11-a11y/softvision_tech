/**
 * SOFTVISION TECH — Aplicación Principal (Orquestador MVC)
 * "Tu comunidad a un solo clic"
 */

import React, { useState, useEffect } from 'react';
import { useAuthController } from './controllers/useAuthController';
import { useBusinessController } from './controllers/useBusinessController';
import { useAdminController } from './controllers/useAdminController';
import { useSecurityController } from './controllers/useSecurityController';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomeView } from './views/HomeView';
import { BusinessDetailView } from './views/BusinessDetailView';
import { RegisterBusinessView } from './views/RegisterBusinessView';
import { AdminDashboardView } from './views/AdminDashboardView';
import { SecurityCenterView } from './views/SecurityCenterView';
import { AuthModal } from './components/AuthModal';
import { ReviewModal } from './components/ReviewModal';
import { ScrumTeamDrawer } from './components/ScrumTeamDrawer';
import { Business, UserRole } from './models/types';
import { reviewService } from './services/reviewService';

export function App() {
  // Estado de Navegación de Vistas
  const [currentView, setCurrentView] = useState<'home' | 'business-detail' | 'register-business' | 'admin' | 'security'>('home');
  const [selectedBusinessId, setSelectedBusinessId] = useState<string | null>(null);

  // Estados de Modales y Drawers
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isScrumDrawerOpen, setIsScrumDrawerOpen] = useState(false);
  const [quickReviewBusiness, setQuickReviewBusiness] = useState<Business | null>(null);

  // Controladores MVC
  const {
    currentUser,
    role,
    switchRole,
    login,
    register,
    logout,
    authError
  } = useAuthController();

  const {
    businesses,
    categories,
    selectedCategory,
    setSelectedCategory,
    searchTerm,
    setSearchTerm,
    selectedZone,
    setSelectedZone,
    availableZones,
    clearFilters,
    registerBusiness,
    getBusiness
  } = useBusinessController();

  const { stats: adminStats } = useAdminController();
  const { activeAlertsCount } = useSecurityController();

  // Scroll to top on view changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView, selectedBusinessId]);

  const handleNavigate = (view: string, param?: string) => {
    if (view === 'business-detail' && param) {
      setSelectedBusinessId(param);
      setCurrentView('business-detail');
    } else if (view === 'home') {
      setSelectedBusinessId(null);
      setCurrentView('home');
    } else {
      setCurrentView(view as any);
    }
  };

  // Negocio actualmente seleccionado para vista de detalle
  const activeBusiness = selectedBusinessId ? getBusiness(selectedBusinessId) : null;

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] font-sans text-[#1E293B] selection:bg-blue-600 selection:text-white" id="softvision-app-root">
      
      {/* Barra de Navegación */}
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        currentUser={currentUser}
        role={role}
        onSwitchRole={switchRole}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenScrum={() => setIsScrumDrawerOpen(true)}
        pendingBusinessesCount={adminStats.pendingCount}
        activeSecurityAlertsCount={activeAlertsCount}
      />

      {/* Contenedor de la Vista Activa */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* Vista 1: Directorio Principal */}
        {currentView === 'home' && (
          <HomeView
            businesses={businesses}
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedZone={selectedZone}
            onSelectZone={setSelectedZone}
            availableZones={availableZones}
            onClearFilters={clearFilters}
            onViewBusinessDetails={(id) => handleNavigate('business-detail', id)}
            onNavigateRegister={() => handleNavigate('register-business')}
            onQuickReview={(b) => setQuickReviewBusiness(b)}
          />
        )}

        {/* Vista 2: Detalle de Negocio y Reseñas */}
        {currentView === 'business-detail' && activeBusiness && (
          <BusinessDetailView
            business={activeBusiness}
            currentUser={currentUser}
            onBack={() => handleNavigate('home')}
            onOpenAuth={() => setIsAuthModalOpen(true)}
          />
        )}

        {/* Vista 3: Registrar Negocio */}
        {currentView === 'register-business' && (
          <RegisterBusinessView
            categories={categories}
            currentUser={currentUser}
            onBack={() => handleNavigate('home')}
            onOpenAuth={() => setIsAuthModalOpen(true)}
            onSubmit={async (data) => {
              await registerBusiness(data);
            }}
          />
        )}

        {/* Vista 4: Panel de Moderación de Administrador */}
        {currentView === 'admin' && (
          <AdminDashboardView
            currentUser={currentUser}
            onBack={() => handleNavigate('home')}
            onSwitchToAdmin={() => switchRole('admin')}
            onViewBusinessDetails={(id) => handleNavigate('business-detail', id)}
          />
        )}

        {/* Vista 5: Centro de Ciberseguridad & Pentesting */}
        {currentView === 'security' && (
          <SecurityCenterView
            onBack={() => handleNavigate('home')}
          />
        )}
      </main>

      {/* Pie de Página Institucional */}
      <Footer
        onOpenScrum={() => setIsScrumDrawerOpen(true)}
        onNavigateSecurity={() => handleNavigate('security')}
      />

      {/* Modal de Autenticación */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={login}
        onRegister={register}
        currentRole={role}
        onSelectRole={switchRole}
        errorMessage={authError}
      />

      {/* Modal Rápido de Reseña desde Card */}
      {quickReviewBusiness && (
        <ReviewModal
          isOpen={!!quickReviewBusiness}
          businessName={quickReviewBusiness.name}
          currentUser={currentUser}
          onClose={() => setQuickReviewBusiness(null)}
          onSubmit={async (rating, comment) => {
            if (!currentUser) throw new Error('Debes identificarte como vecino.');
            await reviewService.addReview({
              businessId: quickReviewBusiness.id,
              userId: currentUser.uid,
              userName: currentUser.displayName,
              userAvatar: currentUser.photoURL,
              rating,
              comment
            });
            setQuickReviewBusiness(null);
          }}
          onOpenAuth={() => {
            setQuickReviewBusiness(null);
            setIsAuthModalOpen(true);
          }}
        />
      )}

      {/* Drawer Interactivo del Equipo Scrum */}
      <ScrumTeamDrawer
        isOpen={isScrumDrawerOpen}
        onClose={() => setIsScrumDrawerOpen(false)}
      />

    </div>
  );
}

export default App;
