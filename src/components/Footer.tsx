/**
 * SOFTVISION TECH — Pie de Página Institucional (Presentacional)
 * "Tu comunidad a un solo clic"
 */

import React from 'react';
import { Store, ShieldCheck, Heart, Sparkles, MapPin, Phone, Mail } from 'lucide-react';

interface FooterProps {
  onOpenScrum: () => void;
  onNavigateSecurity: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenScrum, onNavigateSecurity }) => {
  return (
    <footer className="bg-white text-[#64748B] border-t border-[#E2E8F0] pt-12 pb-6 mt-16" id="main-footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-[#E2E8F0]">
          
          {/* Columna 1: Misión e Identidad */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">
                <Store className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold text-[#0F172A] tracking-tight">
                Softvision<span className="text-blue-600">Tech</span>
              </span>
            </div>
            <p className="text-xs italic text-blue-600 font-medium">
              "Tu comunidad a un solo clic"
            </p>
            <p className="text-xs text-[#64748B] leading-relaxed max-w-lg">
              <strong className="text-[#1E293B]">Misión:</strong> Desarrollar una plataforma digital accesible y confiable que reúna, organice y muestre la información de los negocios y servicios de la zona, facilitando a las personas la búsqueda de lo que necesitan y ayudando a los comerciantes locales a darse a conocer y conectar con sus vecinos.
            </p>
            <p className="text-xs text-[#64748B] leading-relaxed max-w-lg pt-1">
              <strong className="text-[#1E293B]">Visión (2028):</strong> Ser el directorio digital de referencia en los municipios y barrios de la región, reconocido por impulsar el comercio local, facilitar información veraz y actualizada, y fortalecer los lazos entre vecinos y comerciantes.
            </p>
          </div>

          {/* Columna 2: Enlaces Rápidos */}
          <div>
            <h4 className="text-xs uppercase tracking-wider font-bold text-[#0F172A] mb-3">
              Plataforma
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#buscar" className="hover:text-blue-600 transition-colors">
                  Buscador de Negocios
                </a>
              </li>
              <li>
                <a href="#categorias" className="hover:text-blue-600 transition-colors">
                  Categorías Comerciales
                </a>
              </li>
              <li>
                <button onClick={onOpenScrum} className="hover:text-blue-600 transition-colors text-left">
                  Equipo Scrum & Backlog
                </button>
              </li>
              <li>
                <button onClick={onNavigateSecurity} className="hover:text-rose-600 transition-colors text-left flex items-center gap-1.5 text-rose-500">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Ciberseguridad & Pentesting</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Columna 3: Arquitectura y Seguridad */}
          <div>
            <h4 className="text-xs uppercase tracking-wider font-bold text-[#0F172A] mb-3">
              Arquitectura MVC
            </h4>
            <div className="space-y-1.5 text-xs text-[#64748B]">
              <p>• <strong className="text-[#1E293B]">Modelo:</strong> Entidades + Firestore</p>
              <p>• <strong className="text-[#1E293B]">Controlador:</strong> Hooks / Custom Services</p>
              <p>• <strong className="text-[#1E293B]">Vista:</strong> React Components con Tailwind</p>
              <p>• <strong className="text-[#1E293B]">Seguridad:</strong> RBAC & Least Privilege</p>
              <div className="pt-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono bg-blue-50 text-blue-700 border border-blue-200">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                  <span>Reglas Firestore Activas</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Barra Inferior Sleek Interface */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#94A3B8] font-medium gap-3">
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <span>© 2026 Softvision Tech - Tu comunidad a un solo clic</span>
            <span>Términos y Privacidad</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span>Servicio activo en Región de Murcia y alrededores</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
