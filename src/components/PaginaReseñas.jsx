/**
 * PaginaReseñas.jsx
 * Sección de reseñas y testimonios de clientes con sistema de calificación.
 * Permite a los usuarios ver opiniones y agregar sus propias reseñas.
 * 
 * Props: { userRole: 'admin' | 'comprador' }
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star,
  Quote,
  ThumbsUp,
  MessageSquare,
  Send,
  X,
  TrendingUp,
  Award,
  Users,
} from 'lucide-react';
import useReseñasStore from '../store/useReseñasStore';

// ─── ANIMACIONES ───────────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.08,
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

// ─── COMPONENTE PRINCIPAL ──────────────────────────────────────────────────
export default function PaginaReseñas() {
  const { reseñas, addReseña, toggleLike } = useReseñasStore();
  const [showForm, setShowForm] = useState(false);
  const [filtroEstrellas, setFiltroEstrellas] = useState('todas');

  // Calcular estadísticas
  const totalReseñas = reseñas.length;
  const promedioEstrellas = totalReseñas > 0
    ? (reseñas.reduce((acc, r) => acc + r.estrellas, 0) / totalReseñas).toFixed(1)
    : 0;
  const reseñas5Estrellas = reseñas.filter((r) => r.estrellas === 5).length;
  const porcentaje5Estrellas = totalReseñas > 0
    ? ((reseñas5Estrellas / totalReseñas) * 100).toFixed(0)
    : 0;

  // Filtrar reseñas
  const reseñasFiltradas = filtroEstrellas === 'todas'
    ? reseñas
    : reseñas.filter((r) => r.estrellas === parseInt(filtroEstrellas));

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5F0EB] to-white pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ─── HEADER ─────────────────────────────────────────────────────── */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="text-center mb-12"
        >
          <p className="text-xs text-[#C0392B] uppercase tracking-[0.3em] mb-3 font-semibold">
            Testimonios
          </p>
          <h1
            className="text-5xl md:text-6xl lg:text-7xl font-black text-[#1A0A00] leading-tight mb-4"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            Lo que dicen
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C0392B] to-[#D4AC0D]">
              nuestros clientes
            </span>
          </h1>
          <p className="text-stone-600 text-lg max-w-2xl mx-auto">
            Más de {totalReseñas} familias confían en nosotros para sus mejores momentos
          </p>
        </motion.div>

        {/* ─── ESTADÍSTICAS ───────────────────────────────────────────────── */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          <StatsCard
            icon={<Star className="text-[#D4AC0D]" size={32} />}
            value={promedioEstrellas}
            label="Calificación Promedio"
            suffix="/5"
            index={0}
          />
          <StatsCard
            icon={<Users className="text-[#C0392B]" size={32} />}
            value={totalReseñas}
            label="Reseñas Totales"
            suffix="+"
            index={1}
          />
          <StatsCard
            icon={<Award className="text-[#D4AC0D]" size={32} />}
            value={porcentaje5Estrellas}
            label="5 Estrellas"
            suffix="%"
            index={2}
          />
        </motion.div>

        {/* ─── FILTROS Y BOTÓN AGREGAR ────────────────────────────────────── */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={3}
          className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8"
        >
          {/* Filtros */}
          <div className="flex gap-2 flex-wrap justify-center sm:justify-start">
            {['todas', '5', '4', '3', '2', '1'].map((filtro) => (
              <button
                key={filtro}
                onClick={() => setFiltroEstrellas(filtro)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  filtroEstrellas === filtro
                    ? 'bg-[#C0392B] text-white shadow-lg'
                    : 'bg-white text-stone-600 border border-stone-200 hover:border-[#C0392B]'
                }`}
              >
                {filtro === 'todas' ? 'Todas' : `${filtro} ⭐`}
              </button>
            ))}
          </div>

          {/* Botón Agregar Reseña */}
          <motion.button
            onClick={() => setShowForm(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-6 py-3 bg-[#C0392B] text-white rounded-xl font-semibold hover:bg-[#a93226] transition-colors shadow-lg"
          >
            <MessageSquare size={18} />
            Dejar Reseña
          </motion.button>
        </motion.div>

        {/* ─── GRID DE RESEÑAS ────────────────────────────────────────────── */}
        <AnimatePresence mode="wait">
          {reseñasFiltradas.length === 0 ? (
            <EmptyState key="empty" filtro={filtroEstrellas} />
          ) : (
            <motion.div
              key={filtroEstrellas}
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {reseñasFiltradas.map((reseña, index) => (
                <ReseñaCard
                  key={reseña.id}
                  reseña={reseña}
                  index={index}
                  onToggleLike={toggleLike}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ─── MODAL FORMULARIO ───────────────────────────────────────────── */}
        <AnimatePresence>
          {showForm && (
            <FormularioReseña
              onClose={() => setShowForm(false)}
              onSubmit={(data) => {
                addReseña(data);
                setShowForm(false);
              }}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ============================================
   STATS CARD
   ============================================ */
function StatsCard({ icon, value, label, suffix, index }) {
  return (
    <motion.div
      variants={fadeUp}
      custom={index}
      whileHover={{ scale: 1.02, y: -4 }}
      className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm hover:shadow-lg transition-all"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="w-14 h-14 bg-gradient-to-br from-stone-50 to-stone-100 rounded-xl flex items-center justify-center">
          {icon}
        </div>
        <TrendingUp size={20} className="text-green-500" />
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-4xl font-black text-[#1A0A00]">{value}</span>
        <span className="text-xl font-bold text-stone-400">{suffix}</span>
      </div>
      <p className="text-sm text-stone-500 mt-1">{label}</p>
    </motion.div>
  );
}

/* ============================================
   RESEÑA CARD
   ============================================ */
function ReseñaCard({ reseña, index, onToggleLike }) {
  const [imageError, setImageError] = useState(false);

  return (
    <motion.div
      variants={fadeUp}
      custom={index}
      whileHover={{ y: -8 }}
      className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm hover:shadow-xl transition-all relative overflow-hidden group"
    >
      {/* Quote Icon */}
      <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <Quote size={48} className="text-[#C0392B]" />
      </div>

      {/* Header */}
      <div className="flex items-start gap-4 mb-4 relative z-10">
        {/* Avatar */}
        <div className="w-14 h-14 rounded-full overflow-hidden bg-gradient-to-br from-[#C0392B] to-[#D4AC0D] flex-shrink-0 border-2 border-white shadow-md">
          {reseña.avatar && !imageError ? (
            <img
              src={reseña.avatar}
              alt={reseña.nombre}
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white text-xl font-bold">
              {reseña.nombre.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-[#1A0A00] truncate">{reseña.nombre}</h3>
          <p className="text-xs text-stone-500">{reseña.fecha}</p>
          {/* Estrellas */}
          <div className="flex gap-1 mt-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={14}
                className={`${
                  i < reseña.estrellas
                    ? 'fill-[#D4AC0D] text-[#D4AC0D]'
                    : 'text-stone-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Comentario */}
      <p className="text-sm text-stone-600 leading-relaxed mb-4 relative z-10">
        "{reseña.comentario}"
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between relative z-10">
        <button
          onClick={() => onToggleLike(reseña.id)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
            reseña.liked
              ? 'bg-[#C0392B]/10 text-[#C0392B]'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
        >
          <ThumbsUp size={14} className={reseña.liked ? 'fill-current' : ''} />
          <span>{reseña.likes}</span>
        </button>

        {reseña.verificado && (
          <span className="text-xs bg-green-50 text-green-600 px-3 py-1 rounded-full font-semibold">
            ✓ Verificado
          </span>
        )}
      </div>
    </motion.div>
  );
}

/* ============================================
   FORMULARIO RESEÑA
   ============================================ */
function FormularioReseña({ onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    nombre: '',
    comentario: '',
    estrellas: 5,
    avatar: '',
  });
  const [hoveredStar, setHoveredStar] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.nombre.trim() || !formData.comentario.trim()) return;
    onSubmit(formData);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1A0A00] to-[#2C1206] text-white p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-1">Deja tu Reseña</h2>
            <p className="text-sm text-white/70">Comparte tu experiencia con nosotros</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Nombre */}
          <div>
            <label className="block text-sm font-semibold text-[#1A0A00] mb-2">
              Tu Nombre *
            </label>
            <input
              type="text"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              placeholder="Ej: María González"
              className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C0392B]"
              required
            />
          </div>

          {/* Calificación */}
          <div>
            <label className="block text-sm font-semibold text-[#1A0A00] mb-2">
              Calificación *
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <motion.button
                  key={star}
                  type="button"
                  onClick={() => setFormData({ ...formData, estrellas: star })}
                  onMouseEnter={() => setHoveredStar(star)}
                  onMouseLeave={() => setHoveredStar(0)}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  className="focus:outline-none"
                >
                  <Star
                    size={32}
                    className={`transition-all ${
                      star <= (hoveredStar || formData.estrellas)
                        ? 'fill-[#D4AC0D] text-[#D4AC0D]'
                        : 'text-stone-300'
                    }`}
                  />
                </motion.button>
              ))}
            </div>
          </div>

          {/* Comentario */}
          <div>
            <label className="block text-sm font-semibold text-[#1A0A00] mb-2">
              Tu Opinión *
            </label>
            <textarea
              value={formData.comentario}
              onChange={(e) => setFormData({ ...formData, comentario: e.target.value })}
              placeholder="Cuéntanos sobre tu experiencia..."
              rows={4}
              className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C0392B] resize-none"
              required
            />
          </div>

          {/* Avatar URL (opcional) */}
          <div>
            <label className="block text-sm font-semibold text-[#1A0A00] mb-2">
              URL de tu Foto (opcional)
            </label>
            <input
              type="url"
              value={formData.avatar}
              onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
              placeholder="https://ejemplo.com/tu-foto.jpg"
              className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C0392B]"
            />
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-stone-300 rounded-xl text-[#1A0A00] font-semibold hover:bg-stone-50 transition-colors"
            >
              Cancelar
            </button>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 px-4 py-3 bg-[#C0392B] text-white rounded-xl font-semibold hover:bg-[#a93226] transition-colors flex items-center justify-center gap-2"
            >
              <Send size={18} />
              Publicar
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

/* ============================================
   EMPTY STATE
   ============================================ */
function EmptyState({ filtro }) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      className="col-span-full"
    >
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="text-6xl mb-4">😊</div>
        <p className="text-lg font-semibold text-stone-700 mb-2">
          {filtro === 'todas'
            ? 'Aún no hay reseñas'
            : `No hay reseñas de ${filtro} estrellas`}
        </p>
        <p className="text-sm text-stone-500">
          {filtro === 'todas'
            ? '¡Sé el primero en dejar tu opinión!'
            : 'Intenta con otro filtro'}
        </p>
      </div>
    </motion.div>
  );
}
