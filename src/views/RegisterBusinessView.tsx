/**
 * SOFTVISION TECH — Formulario de Registro de Negocio Local (Presentacional)
 * "Tu comunidad a un solo clic"
 */

import React, { useState } from 'react';
import { Category, UserProfile, BusinessHours } from '../models/types';
import { 
  Store, 
  MapPin, 
  Phone, 
  Clock, 
  Image as ImageIcon, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  ArrowLeft,
  ShieldAlert,
  Sparkles
} from 'lucide-react';

interface RegisterBusinessViewProps {
  categories: Category[];
  currentUser: UserProfile | null;
  onBack: () => void;
  onOpenAuth: () => void;
  onSubmit: (data: {
    name: string;
    categoryId: string;
    address: string;
    zone: string;
    phone: string;
    whatsapp?: string;
    email?: string;
    website?: string;
    hours: BusinessHours;
    description: string;
    services: string[];
    imageUrl?: string;
    ownerId: string;
    ownerName: string;
  }) => Promise<unknown>;
}

export const RegisterBusinessView: React.FC<RegisterBusinessViewProps> = ({
  categories,
  currentUser,
  onBack,
  onOpenAuth,
  onSubmit
}) => {
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || 'cat-alimentacion');
  const [zone, setZone] = useState('Comuna 1 - Centro');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [description, setDescription] = useState('');
  const [servicesInput, setServicesInput] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [hours, setHours] = useState<BusinessHours>({
    lunesViernes: '08:00 AM - 06:00 PM',
    sabado: '08:00 AM - 02:00 PM',
    domingo: 'Cerrado'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const presetImages = [
    { label: 'Panadería / Café', url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop&q=80' },
    { label: 'Farmacia / Salud', url: 'https://images.unsplash.com/photo-1586015555751-63c2c1a01725?w=800&auto=format&fit=crop&q=80' },
    { label: 'Taller Mecánico', url: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=800&auto=format&fit=crop&q=80' },
    { label: 'Barbería / Belleza', url: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&auto=format&fit=crop&q=80' },
    { label: 'Ferretería / Hogar', url: 'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?w=800&auto=format&fit=crop&q=80' },
    { label: 'Tecnología / Celulares', url: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=80' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      onOpenAuth();
      return;
    }

    if (name.trim().length < 3) {
      setErrorMsg('El nombre del negocio debe contener al menos 3 caracteres.');
      return;
    }

    if (address.trim().length < 5) {
      setErrorMsg('Por favor especifica una dirección clara para que tus vecinos puedan llegar.');
      return;
    }

    if (!phone) {
      setErrorMsg('El número de contacto telefónico es obligatorio.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const servicesArray = servicesInput
        .split(',')
        .map(s => s.trim())
        .filter(s => s.length > 0);

      await onSubmit({
        name,
        categoryId,
        address,
        zone,
        phone,
        whatsapp: whatsapp || phone,
        email,
        website,
        hours,
        description,
        services: servicesArray,
        imageUrl: imageUrl || presetImages[0].url,
        ownerId: currentUser.uid,
        ownerName: currentUser.displayName
      });

      setSuccess(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al registrar el negocio';
      setErrorMsg(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in" id="register-business-view">
      
      {/* Botón Volver */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-bold text-[#475569] hover:text-blue-600 transition-colors bg-white px-3 py-1.5 rounded-lg border border-[#E2E8F0] shadow-sm"
        id="btn-back-from-register"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Volver al Directorio</span>
      </button>

      {/* Pantalla de Éxito */}
      {success ? (
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-8 sm:p-12 text-center shadow-md space-y-4">
          <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#0F172A]">
            ¡Negocio registrado exitosamente!
          </h2>
          <p className="text-xs sm:text-sm text-[#64748B] max-w-lg mx-auto leading-relaxed">
            Tu negocio ha entrado al flujo de moderación de <strong className="text-[#1E293B]">Softvision Tech</strong> con estado <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold text-xs">Pendiente</span>. Un administrador verificará la información para asegurar datos confiables a la comunidad antes de su publicación general.
          </p>
          <div className="pt-4 flex justify-center gap-3">
            <button
              onClick={onBack}
              className="px-6 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 shadow-sm transition-all"
            >
              Ir al Directorio
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden">
          
          {/* Header del Formulario */}
          <div className="p-6 sm:p-8 bg-gradient-to-r from-blue-700 to-slate-900 text-white">
            <div className="flex items-center gap-2 text-blue-200 text-xs font-bold uppercase tracking-wider mb-1">
              <Store className="w-4 h-4" />
              <span>Alta Comercial en el Directorio</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold">
              Registra tu negocio o servicio local
            </h1>
            <p className="text-xs text-blue-100/80 mt-1 max-w-xl leading-relaxed">
              Completa la información básica para que los vecinos de la zona te encuentren fácilmente y puedan ponerse en contacto directo contigo.
            </p>
          </div>

          {/* Advertencia si no está logueado */}
          {!currentUser ? (
            <div className="p-8 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#0F172A]">
                Inicia sesión como Comerciante para continuar
              </h3>
              <p className="text-xs text-[#64748B] max-w-md mx-auto">
                Para vincularte como propietario del negocio y gestionar su información de forma segura según el modelo RBAC, debes autenticarte.
              </p>
              <button
                onClick={onOpenAuth}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-sm"
              >
                Identificarme con una cuenta
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
              
              {errorMsg && (
                <div className="flex items-start gap-2 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Sección 1: Información Básica */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-blue-600 border-b border-[#E2E8F0] pb-1">
                  1. Datos Generales del Comercio
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-[#1E293B] mb-1">
                      Nombre Comercial del Negocio *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ej. Panadería y Café La Espiga Dorada"
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-blue-500"
                      id="input-business-name"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1E293B] mb-1">
                      Categoría Principal *
                    </label>
                    <select
                      value={categoryId}
                      onChange={(e) => setCategoryId(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-[#1E293B]"
                      id="select-business-category"
                    >
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1E293B] mb-1">
                      Zona o Comuna *
                    </label>
                    <select
                      value={zone}
                      onChange={(e) => setZone(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-[#1E293B]"
                      id="select-business-zone"
                    >
                      <option value="Comuna 1 - Centro">Comuna 1 - Centro</option>
                      <option value="Comuna 2 - Los Cedros">Comuna 2 - Los Cedros</option>
                      <option value="Comuna 3 - Primavera">Comuna 3 - Primavera</option>
                      <option value="Comuna 4 - San Juan">Comuna 4 - San Juan</option>
                      <option value="Sector Rural / Veredas">Sector Rural / Veredas</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-[#1E293B] mb-1">
                      Dirección Física Completa *
                    </label>
                    <input
                      type="text"
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Ej. Carrera 14 # 45-20, Frente al Parque Principal"
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-blue-500"
                      id="input-business-address"
                    />
                  </div>
                </div>
              </div>

              {/* Sección 2: Contacto Directo */}
              <div className="space-y-4 pt-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-blue-600 border-b border-[#E2E8F0] pb-1">
                  2. Medios de Contacto
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#1E293B] mb-1">
                      Teléfono Fijo o Móvil *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+57 312 456 7890"
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-blue-500"
                      id="input-business-phone"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1E293B] mb-1">
                      Número de WhatsApp (Opcional)
                    </label>
                    <input
                      type="text"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      placeholder="573124567890 (con código de país)"
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1E293B] mb-1">
                      Correo Electrónico (Opcional)
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="contacto@minegocio.com"
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1E293B] mb-1">
                      Sitio Web o Red Social (Opcional)
                    </label>
                    <input
                      type="url"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      placeholder="https://instagram.com/minegocio"
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Sección 3: Horarios de Atención */}
              <div className="space-y-4 pt-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-blue-600 border-b border-[#E2E8F0] pb-1">
                  3. Horarios de Atención
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="block font-semibold text-[#1E293B] mb-1">
                      Lunes a Viernes
                    </label>
                    <input
                      type="text"
                      value={hours.lunesViernes}
                      onChange={(e) => setHours({ ...hours, lunesViernes: e.target.value })}
                      placeholder="08:00 AM - 06:00 PM"
                      className="w-full px-3 py-2 rounded-xl border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-[#1E293B] mb-1">
                      Sábados
                    </label>
                    <input
                      type="text"
                      value={hours.sabado}
                      onChange={(e) => setHours({ ...hours, sabado: e.target.value })}
                      placeholder="08:00 AM - 02:00 PM"
                      className="w-full px-3 py-2 rounded-xl border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-[#1E293B] mb-1">
                      Domingos y Festivos
                    </label>
                    <input
                      type="text"
                      value={hours.domingo}
                      onChange={(e) => setHours({ ...hours, domingo: e.target.value })}
                      placeholder="Cerrado o 09:00 AM - 01:00 PM"
                      className="w-full px-3 py-2 rounded-xl border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Sección 4: Descripción y Portafolio */}
              <div className="space-y-4 pt-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-blue-600 border-b border-[#E2E8F0] pb-1">
                  4. Descripción y Portafolio
                </h3>

                <div>
                  <label className="block text-xs font-bold text-[#1E293B] mb-1">
                    Descripción del Negocio *
                  </label>
                  <textarea
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    maxLength={1500}
                    placeholder="Describe qué ofreces, trayectoria, tradición, marcas que manejas o qué te hace especial en el barrio..."
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-[#1E293B]"
                    id="textarea-business-desc"
                  />
                  <span className="text-[11px] text-[#94A3B8] block mt-1">
                    {description.length} / 1500 caracteres • Sanitización automática activa
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1E293B] mb-1">
                    Servicios o Productos Clave (separados por comas)
                  </label>
                  <input
                    type="text"
                    value={servicesInput}
                    onChange={(e) => setServicesInput(e.target.value)}
                    placeholder="Ej. Pan campesino, Café de especialidad, Tortas de cumpleaños, Domicilios"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Fotografía o Imagen de Fachada */}
                <div>
                  <label className="block text-xs font-bold text-[#1E293B] mb-1">
                    Foto de Portada o Fachada (URL)
                  </label>
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://ejemplo.com/foto-mi-local.jpg"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                  />

                  {/* Galería de Fotos Preestablecidas */}
                  <span className="block text-[11px] font-semibold text-[#64748B] mb-2">
                    O selecciona una fotografía sugerida para tu rubro:
                  </span>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {presetImages.map((img, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setImageUrl(img.url)}
                        className={`relative rounded-xl overflow-hidden border-2 h-16 transition-all ${
                          imageUrl === img.url
                            ? 'border-blue-600 ring-2 ring-blue-500/30'
                            : 'border-transparent opacity-75 hover:opacity-100'
                        }`}
                      >
                        <img src={img.url} alt={img.label} className="w-full h-full object-cover" />
                        <span className="absolute inset-x-0 bottom-0 bg-black/60 text-[9px] text-white py-0.5 truncate px-1">
                          {img.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Botón de Envío */}
              <div className="pt-4 border-t border-[#E2E8F0] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onBack}
                  className="px-4 py-2 text-xs font-semibold text-[#475569] hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold shadow-sm transition-all flex items-center gap-2"
                  id="submit-register-business-btn"
                >
                  {isSubmitting ? (
                    <span>Registrando...</span>
                  ) : (
                    <>
                      <Store className="w-4 h-4" />
                      <span>Enviar a Moderación Comunitaria</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
};
