import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ShoppingBag } from 'lucide-react';
import useProductStore from '../store/useProductStore';
import './MenuPremium.css';

const CATEGORIAS = [
  { id: 'todos', label: 'Todos' },
  { id: 'pollos', label: 'Pollos' },
  { id: 'acompañamientos', label: 'Acompañamientos' },
  { id: 'bebidas', label: 'Bebidas' },
];

const SABORES = [
  { id: 'regular', nombre: 'Regular', icono: '🍗', descripcion: 'Clásico asado al carbón' },
  { id: 'enchiloso', nombre: 'Enchiloso', icono: '🌶️', descripcion: 'Chile ancho y especias sinaloenses' },
  { id: 'bbq', nombre: 'BBQ', icono: '🔥', descripcion: 'Ahumado lento con salsa BBQ' },
];

/* ─────────────────────────────────────────────
   ESTILOS GLOBALES — pega esto en tu index.css
   o en el archivo CSS global de tu proyecto:

   @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Inter:wght@300;400;500;600&display=swap');

   Las variables ya las tienes en tu proyecto:
   --cream: #F5F0EB
   --warm:  #FDF8F0
   --dark:  #1A0A00
   --mid:   #7A5A40
   --red:   #C0392B
   --gold:  #D4AC0D
───────────────────────────────────────────── */

export default function MenuPremium({ onAgregarAlCarrito }) {
  const productos = useProductStore((state) => state.productos);
  const [categoriaActiva, setCategoriaActiva] = useState('todos');
  const [busqueda, setBusqueda] = useState('');
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [saborElegido, setSaborElegido] = useState(null);
  const requiereSabor = productoSeleccionado?.categoria === 'pollos' || productoSeleccionado?.nombre?.includes('Pollo');

  useEffect(() => { setSaborElegido(null); }, [productoSeleccionado]);

  // Cierre con Escape
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setProductoSeleccionado(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Bloquear scroll del body cuando el modal está abierto
  useEffect(() => {
    document.body.style.overflow = productoSeleccionado ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [productoSeleccionado]);

  const itemsFiltrados = useMemo(() => {
    let items = productos;
    if (categoriaActiva !== 'todos') items = items.filter(i => i.categoria === categoriaActiva);
    if (busqueda.trim()) {
      const q = busqueda.toLowerCase();
      items = items.filter(i =>
        i.nombre.toLowerCase().includes(q) ||
        (i.descripcionCorta && i.descripcionCorta.toLowerCase().includes(q))
      );
    }
    return items;
  }, [productos, categoriaActiva, busqueda]);

  const handleAgregarAlCarrito = () => {
    if (requiereSabor && !saborElegido) return;
    const sabor = SABORES.find((opcion) => opcion.id === saborElegido);
    onAgregarAlCarrito?.({ ...productoSeleccionado, saborElegido: sabor?.nombre || '' });
    setProductoSeleccionado(null);
  };

  return (
    <div
      className="min-h-screen py-16 px-4 sm:px-6 lg:px-8"
      style={{ background: '#F5F0EB', fontFamily: "'Inter', sans-serif" }}
    >
      <div className="max-w-7xl mx-auto">

        {/* ── HEADER ── */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="text-center mb-12"
        >
          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(44px, 6vw, 72px)',
              fontWeight: 900,
              lineHeight: 1.02,
              letterSpacing: '-0.02em',
              color: '#1A0A00',
              marginBottom: 10,
            }}
          >
            Nuestro{' '}
            <em style={{ fontStyle: 'italic', color: '#C0392B' }}>Menú</em>
          </h1>
          <p style={{ fontSize: 15, color: '#7A5A40', fontWeight: 300 }}>
            Sabor auténtico de Sinaloa
          </p>
        </motion.div>

        {/* ── BUSCADOR ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08, duration: 0.45 }}
          className="max-w-xl mx-auto mb-8"
        >
          <div className="relative">
            <Search
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: '#C0392B' }}
            />
            <input
              type="text"
              placeholder="Buscar platillos…"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              style={{
                width: '100%',
                padding: '13px 16px 13px 44px',
                borderRadius: 100,
                border: `1.5px solid ${busqueda ? 'rgba(192,57,43,0.4)' : 'rgba(26,10,0,0.09)'}`,
                background: '#FDF8F0',
                fontFamily: "'Inter', sans-serif",
                fontSize: 14,
                color: '#1A0A00',
                outline: 'none',
                boxShadow: busqueda ? '0 0 0 4px rgba(192,57,43,0.07)' : 'none',
                transition: 'border-color .2s, box-shadow .2s',
              }}
            />
          </div>
        </motion.div>

        {/* ── FILTROS ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.14, duration: 0.45 }}
          className="flex flex-wrap justify-center gap-2 mb-12"
        >
          {CATEGORIAS.map((cat) => {
            const active = categoriaActiva === cat.id;
            return (
              <motion.button
                key={cat.id}
                onClick={() => setCategoriaActiva(cat.id)}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                style={{
                  padding: '8px 20px',
                  borderRadius: 100,
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: 'pointer',
                  border: `1.5px solid ${active ? '#1A0A00' : 'rgba(26,10,0,0.09)'}`,
                  background: active ? '#1A0A00' : '#FDF8F0',
                  color: active ? '#fff' : '#7A5A40',
                  boxShadow: active ? '0 4px 14px rgba(26,10,0,0.18)' : 'none',
                  transition: 'all .2s',
                }}
              >
                {cat.label}
              </motion.button>
            );
          })}
        </motion.div>

        {/* ── GRID ESTILO AIRBNB/STRIPE ── */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {itemsFiltrados.map((item, index) => (
              <motion.article
                key={item.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ delay: index * 0.04, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                onClick={() => setProductoSeleccionado(item)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    setProductoSeleccionado(item);
                  }
                }}
                role="button"
                tabIndex={0}
                aria-label={`Ver detalles de ${item.nombre}`}
                className="cursor-pointer group"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {/* Contenedor de imagen - Estilo Airbnb */}
                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    aspectRatio: '1 / 1',
                    borderRadius: 16,
                    overflow: 'hidden',
                    background: 'linear-gradient(135deg, #FFFDFB 0%, #FDF8F3 100%)',
                    marginBottom: 14,
                    border: '1px solid rgba(192,57,43,0.08)',
                  }}
                >
                  {/* Imagen del producto */}
                  <motion.img
                    src={item.imagen}
                    alt={item.nombre}
                    whileHover={{ scale: 1.04 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />

                  {/* Badge popular - Estilo Stripe */}
                  {item.popular && (
                    <div
                      style={{
                        position: 'absolute',
                        top: 12,
                        left: 12,
                        padding: '6px 12px',
                        borderRadius: 8,
                        background: 'linear-gradient(135deg, #C0392B 0%, #D4AC0D 100%)',
                        color: '#FFFFFF',
                        fontSize: 11,
                        fontWeight: 600,
                        fontFamily: "'Inter', sans-serif",
                        letterSpacing: '0.02em',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                        boxShadow: '0 4px 12px rgba(192,57,43,0.25)',
                      }}
                    >
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path d="M5 0L6.12257 3.45492H9.75528L6.81636 5.59017L7.93893 9.04508L5 6.90983L2.06107 9.04508L3.18364 5.59017L0.244718 3.45492H3.87743L5 0Z" fill="#FFFFFF"/>
                      </svg>
                      Popular
                    </div>
                  )}

                  {/* Overlay sutil en hover */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background: 'linear-gradient(180deg, transparent 0%, rgba(192,57,43,0.03) 100%)',
                    }}
                  />
                </div>

                {/* Contenido - Estilo Notion/Linear */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  {/* Categoría */}
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 500,
                      color: '#C0392B',
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      marginBottom: 6,
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    {item.categoria}
                  </div>

                  {/* Nombre del producto */}
                  <h3
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: 18,
                      fontWeight: 600,
                      color: '#1A0A00',
                      marginBottom: 8,
                      lineHeight: 1.3,
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {item.nombre}
                  </h3>

                  {/* Descripción */}
                  <p
                    style={{
                      fontSize: 14,
                      color: '#7A5A40',
                      lineHeight: 1.6,
                      marginBottom: 16,
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 400,
                      flex: 1,
                    }}
                  >
                    {item.descripcionCorta || item.descripcion}
                  </p>

                  {/* Footer con precio */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingTop: 12,
                      borderTop: '1px solid rgba(192,57,43,0.08)',
                    }}
                  >
                    {/* Precio */}
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                      <span
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontSize: 24,
                          fontWeight: 700,
                          color: '#C0392B',
                          letterSpacing: '-0.02em',
                        }}
                      >
                        ${item.precio}
                      </span>
                      <span
                        style={{
                          fontSize: 13,
                          color: '#7A5A40',
                          fontFamily: "'Inter', sans-serif",
                          fontWeight: 500,
                        }}
                      >
                        USD
                      </span>
                    </div>

                    {/* Indicador de acción */}
                    <motion.div
                      whileHover={{ x: 4 }}
                      transition={{ duration: 0.2 }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        color: '#C0392B',
                        fontSize: 13,
                        fontWeight: 500,
                        fontFamily: "'Inter', sans-serif",
                      }}
                    >
                      Ver detalles
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </motion.div>
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>

        {itemsFiltrados.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
            <p style={{ fontFamily: "'Playfair Display',serif", fontSize: 26, color: '#1A0A00', marginBottom: 8, fontWeight: 700 }}>
              Sin resultados
            </p>
            <p style={{ fontSize: 14, color: '#7A5A40' }}>Intenta con otra búsqueda o categoría</p>
          </motion.div>
        )}
      </div>

      {/* ══════════════ MODAL ══════════════ */}
      <AnimatePresence>
        {productoSeleccionado && (
          <>
            {/* Overlay con glassmorphism real */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setProductoSeleccionado(null)}
              style={{
                position: 'fixed', inset: 0, zIndex: 200,
                background: 'rgba(14,5,0,0.62)',
                backdropFilter: 'blur(22px) saturate(160%)',
                WebkitBackdropFilter: 'blur(22px) saturate(160%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: 20,
              }}
            >
              {/* Modal */}
              <motion.div
                initial={{ opacity: 0, scale: 0.92, y: 18 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.94, y: 10 }}
                transition={{ type: 'spring', stiffness: 340, damping: 28, mass: 0.8 }}
                onClick={(e) => e.stopPropagation()}
                style={{
                  background: 'rgba(253,248,240,0.97)',
                  borderRadius: 32,
                  border: '1px solid rgba(255,255,255,0.35)',
                  boxShadow: '0 50px 100px rgba(0,0,0,0.36), 0 0 0 1px rgba(255,255,255,0.1) inset',
                }}
                className="menu-product-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="menu-product-title"
              >
                {/* Botón cerrar */}
                <motion.button
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.15, type: 'spring', stiffness: 380, damping: 22 }}
                  whileHover={{ rotate: 90 }}
                  onClick={() => setProductoSeleccionado(null)}
                  aria-label="Cerrar detalle del producto"
                  type="button"
                  style={{
                    position: 'absolute', top: 16, right: 16, zIndex: 10,
                    width: 36, height: 36, borderRadius: '50%',
                    background: 'rgba(26,10,0,0.07)',
                    border: '1px solid rgba(26,10,0,0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', fontSize: 16, color: '#1A0A00',
                    backdropFilter: 'blur(8px)',
                    transition: 'background .2s, color .2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#1A0A00';
                    e.currentTarget.style.color = '#fff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(26,10,0,0.07)';
                    e.currentTarget.style.color = '#1A0A00';
                  }}
                >
                  <X size={16} strokeWidth={2.5} />
                </motion.button>

                {/* ── IMAGEN ── */}
                <motion.div
                  className="menu-product-modal__image"
                  initial={{ x: -30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.07, duration: 0.48, ease: [0.25, 0.1, 0.25, 1] }}
                  style={{ position: 'relative', overflow: 'hidden' }}
                >
                  {productoSeleccionado.popular && (
                    <span
                      style={{
                        position: 'absolute', top: 16, right: 16, zIndex: 2,
                        padding: '5px 13px', borderRadius: 100,
                        fontSize: 10, fontWeight: 700,
                        background: 'rgba(212,172,13,0.9)', color: '#1A0A00',
                        backdropFilter: 'blur(10px)',
                        fontFamily: "'Inter', sans-serif",
                      }}
                    >
                      ★ Más pedido
                    </span>
                  )}
                  <span
                    style={{
                      position: 'absolute', top: 16, left: 16, zIndex: 2,
                      padding: '5px 13px', borderRadius: 100,
                      fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
                      background: 'rgba(253,248,240,0.88)', color: '#1A0A00',
                      backdropFilter: 'blur(10px)',
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    {productoSeleccionado.categoria}
                  </span>
                  <motion.img
                    src={productoSeleccionado.imagen}
                    alt={productoSeleccionado.nombre}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.04 }}
                    transition={{ duration: 0.5 }}
                    style={{ filter: 'contrast(1.04) saturate(1.08)' }}
                  />
                  <div
                    style={{
                      position: 'absolute', inset: 0,
                      background: 'linear-gradient(to top, rgba(0,0,0,0.1) 0%, transparent 35%)',
                    }}
                  />
                </motion.div>

                {/* ── CONTENIDO ── */}
                <motion.div
                  className="menu-product-modal__content"
                  initial={{ x: 30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.14, duration: 0.48, ease: [0.25, 0.1, 0.25, 1] }}
                  style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
                >
                  {/* Nombre */}
                  <motion.h2
                    id="menu-product-title"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.22 }}
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: 'clamp(28px, 3.5vw, 38px)',
                      fontWeight: 900, lineHeight: 1.06,
                      color: '#1A0A00', letterSpacing: '-0.02em',
                      marginBottom: 4,
                    }}
                  >
                    {productoSeleccionado.nombre}
                  </motion.h2>

                  {/* Precio */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.26 }}
                    style={{ display: 'flex', alignItems: 'baseline', gap: 5, marginBottom: 18 }}
                  >
                    <span
                      style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: 36, fontWeight: 700,
                        color: '#C0392B', letterSpacing: '-0.02em',
                      }}
                    >
                      ${productoSeleccionado.precio}
                    </span>
                    <span style={{ fontSize: 13, color: '#7A5A40', fontFamily: "'Inter',sans-serif" }}>USD</span>
                  </motion.div>

                  {/* Divisor */}
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.3, duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                    style={{
                      width: 40, height: 2, borderRadius: 2,
                      background: '#C0392B',
                      transformOrigin: 'left', marginBottom: 16,
                    }}
                  />

                  {/* Descripción */}
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.33 }}
                    style={{ fontSize: 14, color: '#7A5A40', lineHeight: 1.75, marginBottom: 24, fontWeight: 300 }}
                  >
                    {productoSeleccionado.descripcion}
                  </motion.p>

                  {/* Selector sabor */}
                  {requiereSabor && <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.37 }}
                  >
                    <div
                      style={{
                        fontSize: 10, fontWeight: 700, letterSpacing: '0.18em',
                        textTransform: 'uppercase', color: '#C0392B',
                        marginBottom: 10, fontFamily: "'Inter', sans-serif",
                      }}
                    >
                      Elige tu sabor
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginBottom: 24 }}>
                      {SABORES.map((sabor, i) => {
                        const sel = saborElegido === sabor.id;
                        return (
                          <motion.button
                            key={sabor.id}
                            type="button"
                            aria-pressed={sel}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 + i * 0.05 }}
                            onClick={() => setSaborElegido(sabor.id)}
                            whileHover={{ x: 2 }}
                            style={{
                              display: 'flex', alignItems: 'center', gap: 12,
                              padding: '12px 14px', borderRadius: 14, cursor: 'pointer',
                              width: '100%', textAlign: 'left',
                              fontFamily: "'Inter', sans-serif",
                              border: `1.5px solid ${sel ? '#C0392B' : 'rgba(26,10,0,0.08)'}`,
                              background: sel ? 'rgba(192,57,43,0.05)' : 'rgba(255,255,255,0.55)',
                              boxShadow: sel ? '0 3px 14px rgba(192,57,43,0.1)' : 'none',
                              transition: 'all .18s',
                            }}
                          >
                            <span style={{ fontSize: 22, lineHeight: 1, flexShrink: 0 }}>{sabor.icono}</span>
                            <div style={{ flex: 1 }}>
                              <div style={{ fontSize: 13, fontWeight: 600, color: '#1A0A00', marginBottom: 1, fontFamily: "'Inter',sans-serif" }}>
                                {sabor.nombre}
                              </div>
                              <div style={{ fontSize: 11, color: '#7A5A40', fontWeight: 300, fontFamily: "'Inter',sans-serif" }}>
                                {sabor.descripcion}
                              </div>
                            </div>
                            {/* Radio */}
                            <div
                              style={{
                                width: 17, height: 17, borderRadius: '50%', flexShrink: 0,
                                border: `2px solid ${sel ? '#C0392B' : 'rgba(192,57,43,0.3)'}`,
                                background: sel ? '#C0392B' : 'transparent',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                transition: 'all .18s',
                              }}
                            >
                              {sel && <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#fff' }} />}
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>
                  </motion.div>}

                  {/* Botón agregar */}
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.58 }}
                    onClick={handleAgregarAlCarrito}
                    type="button"
                    disabled={requiereSabor && !saborElegido}
                    whileHover={!requiereSabor || saborElegido ? { y: -1 } : {}}
                    whileTap={!requiereSabor || saborElegido ? { scale: 0.98 } : {}}
                    style={{
                      width: '100%', padding: '15px 0',
                      borderRadius: 100, border: 'none',
                      fontFamily: "'Inter', sans-serif",
                      fontSize: 14, fontWeight: 700, letterSpacing: '0.02em',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                      cursor: !requiereSabor || saborElegido ? 'pointer' : 'not-allowed',
                      background: !requiereSabor || saborElegido ? '#1A0A00' : 'rgba(170,160,150,0.3)',
                      color: !requiereSabor || saborElegido ? '#fff' : 'rgba(26,10,0,0.3)',
                      boxShadow: !requiereSabor || saborElegido ? '0 7px 24px rgba(26,10,0,0.2)' : 'none',
                      transition: 'all .28s cubic-bezier(.25,.1,.25,1)',
                    }}
                    onMouseEnter={(e) => {
                      if (requiereSabor && !saborElegido) return;
                      e.currentTarget.style.background = '#C0392B';
                      e.currentTarget.style.boxShadow = '0 12px 36px rgba(192,57,43,0.35)';
                    }}
                    onMouseLeave={(e) => {
                      if (requiereSabor && !saborElegido) return;
                      e.currentTarget.style.background = '#1A0A00';
                      e.currentTarget.style.boxShadow = '0 7px 24px rgba(26,10,0,0.2)';
                    }}
                  >
                    <ShoppingBag size={16} />
                    {requiereSabor && !saborElegido ? 'Selecciona un sabor' : 'Agregar al pedido'}
                  </motion.button>
                </motion.div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}