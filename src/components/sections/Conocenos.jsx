import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Flame, Heart, Award, Users, Clock, ChevronRight, ChefHat, X } from 'lucide-react';
import { RESTAURANT_INFO } from '../../utils/constants';

const DIAS_ABIERTOS = [
  { nombre: 'Viernes', horario: RESTAURANT_INFO.hours.friday },
  { nombre: 'Sábado', horario: RESTAURANT_INFO.hours.saturday },
  { nombre: 'Domingo', horario: RESTAURANT_INFO.hours.sunday },
];

const formatTime = (time) => {
  const [hour, minute] = time.split(':').map(Number);
  return `${hour % 12 || 12}:${String(minute).padStart(2, '0')} ${hour >= 12 ? 'PM' : 'AM'}`;
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
  }),
};

const TIMELINE = [
  { year: '2024', title: 'Fundación', description: 'Isaac y Jorge traen la tradición de El Rosario a Arleta', icon: Flame },
  { year: '2025', title: 'Crecimiento', description: 'Más de 1000 clientes satisfechos cada mes', icon: Heart },
  { year: '2026', title: 'Actualidad', description: 'Comunidad en redes y expansión continua', icon: Award },
];

const VALORES = [
  { icon: Flame, titulo: 'Sazón Sinaloense', descripcion: 'Auténtico sabor del norte de México' },
  { icon: Heart, titulo: 'Pasión', descripcion: 'Amor en cada pollo que preparamos' },
  { icon: Award, titulo: 'Calidad', descripcion: 'Ingredientes frescos seleccionados' },
  { icon: Users, titulo: 'Familia', descripcion: 'Isaac, Jorge y todo nuestro equipo' },
];

const PASOS = [
  {
    id: 1,
    titulo: 'Selección',
    subtitulo: 'Calidad Premium',
    descripcion: 'Elegimos cuidadosamente cada pollo, garantizando frescura y calidad excepcional. Solo trabajamos con proveedores certificados que comparten nuestra pasión por la excelencia.',
    imagen: '/images/pollo fresco-1.webp',
  },
  {
    id: 2,
    titulo: 'Marinado',
    subtitulo: 'Receta Tradicional',
    descripcion: 'Nuestras especias secretas sinaloenses penetran cada fibra durante 24 horas. Receta perfeccionada por generaciones en El Rosario, Sinaloa.',
    imagen: '/images/1.jpg',
  },
  {
    id: 3,
    titulo: 'Asado',
    subtitulo: 'Cocción Artesanal',
    descripcion: 'Cocción lenta sobre brasas de carbón, girando en varilla metálica para lograr textura dorada y jugosa perfecta. El método tradicional que hace la diferencia.',
    imagen: '/images/hero-parrilla.jpg',
  },
];

export default function Conocenos({ setPaginaActual }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const [pasoSeleccionado, setPasoSeleccionado] = useState(null);

  const irAlMenu = () => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    setPaginaActual('menu');
  };

  return (
    <section
      ref={ref}
      className="py-20 relative overflow-hidden"
      style={{ background: '#FEFCF8' }}
    >
      {/* Fondo decorativo */}
      <div className="absolute inset-0 pointer-events-none opacity-30"
        style={{ backgroundImage: `radial-gradient(circle, rgba(192,57,43,0.08) 1px, transparent 1px)`, backgroundSize: '24px 24px' }}
      />
      <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(212,172,13,0.08) 0%, transparent 70%)', filter: 'blur(60px)' }}
      />
      <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(192,57,43,0.06) 0%, transparent 70%)', filter: 'blur(60px)' }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* HEADER */}
        <motion.div variants={fadeUp} initial="hidden" animate={isInView ? 'visible' : 'hidden'} className="text-center mb-16">
          <motion.div
            initial={{ scale: 0, rotate: -180 }} animate={isInView ? { scale: 1, rotate: 0 } : {}}
            transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
            className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-2xl"
            style={{ background: 'linear-gradient(135deg, #C0392B 0%, #D4AC0D 100%)' }}
          >
            <ChefHat size={32} className="text-white" />
          </motion.div>
          <motion.p initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ delay: 0.1 }}
            className="text-xs uppercase tracking-[0.3em] mb-2 font-bold" style={{ color: '#C0392B' }}>
            Nuestra Historia
          </motion.p>
          <motion.h2 initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.2 }}
            className="text-4xl md:text-5xl font-black mb-3" style={{ fontFamily: "'Georgia', serif", color: '#1A0A00' }}>
            Conócenos: Nuestra Pasión por Sinaloa
          </motion.h2>
          <motion.p initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ delay: 0.3 }}
            className="text-lg max-w-2xl mx-auto" style={{ color: '#7A5A40' }}>
            Pollos Asados El Compadrito De Sinaloa
          </motion.p>
          <motion.p initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ delay: 0.4 }}
            className="text-sm mt-2" style={{ color: '#B4977A' }}>
            Fundado el 14 de julio de 2024 por <strong style={{ color: '#C0392B' }}>Isaac y Jorge</strong>
          </motion.p>
        </motion.div>

        {/* TIMELINE */}
        <motion.div variants={fadeUp} initial="hidden" animate={isInView ? 'visible' : 'hidden'} custom={1} className="mb-20">
          <div className="relative">
            <motion.div
              initial={{ scaleX: 0 }} animate={isInView ? { scaleX: 1 } : {}}
              transition={{ delay: 0.5, duration: 0.6, ease: 'easeOut' }}
              className="absolute top-1/2 left-0 right-0 h-0.5 rounded-full -translate-y-1/2"
              style={{ background: 'linear-gradient(90deg, #C0392B 0%, #D4AC0D 50%, #C0392B 100%)', transformOrigin: 'left' }}
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
              {TIMELINE.map((item, i) => {
                const Icon = item.icon;
                return (
                  <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.6 + i * 0.1 }}>
                    <div className="rounded-2xl p-6 text-center"
                      style={{ background: 'rgba(255,255,255,0.8)', border: '1px solid rgba(192,57,43,0.1)' }}>
                      <div className="text-5xl font-black mb-3" style={{ fontFamily: "'Georgia', serif", color: '#C0392B' }}>{item.year}</div>
                      <div className="inline-flex items-center justify-center w-12 h-12 mb-3 rounded-xl" style={{ background: 'rgba(212,172,13,0.1)' }}>
                        <Icon size={20} style={{ color: '#C0392B' }} />
                      </div>
                      <h3 className="text-lg font-bold mb-1" style={{ color: '#1A0A00' }}>{item.title}</h3>
                      <p className="text-sm" style={{ color: '#7A5A40' }}>{item.description}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* HISTORIA + IMAGEN */}
        <div className="relative mb-20">
          <div className="w-full h-px bg-gradient-to-r from-transparent via-[#C0392B]/30 to-transparent mb-12" />
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-50px' }} transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}>
              <div className="space-y-4 text-stone-700 leading-relaxed">
                <h3 className="text-3xl font-black mb-4" style={{ fontFamily: "'Georgia', serif", color: '#1A0A00' }}>Nuestra Historia</h3>
                <p>El <strong style={{ color: '#C0392B' }}>14 de julio de 2024</strong>, Isaac y Jorge trajeron la auténtica tradición de <strong>El Rosario, Sinaloa</strong> a Arleta, California.</p>
                <p>Cada pollo es marinado con especias sinaloenses secretas, luego <strong style={{ color: '#D4AC0D' }}>ensartado en varilla</strong> y asado girando sobre <strong>brasas de carbón</strong>. Jugoso por dentro, dorado por fuera.</p>
                <p>Isaac y Jorge, junto a todo su equipo, mantienen viva la esencia de Sinaloa: ingredientes frescos, sabores auténticos y el calor de un hogar mexicano.</p>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.97 }} whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-50px' }} transition={{ duration: 0.4 }} className="relative">
              <img src="/images/blank.png" alt="Pollos Asados El Compadrito De Sinaloa"
                className="w-full h-auto object-cover" style={{ borderRadius: '24px', aspectRatio: '4/5' }} />
              <div className="mt-4 text-center">
                <p className="text-sm font-bold" style={{ color: '#C0392B' }}>Isaac & Jorge</p>
                <p className="text-xs" style={{ color: '#7A5A40' }}>Maestros del asado en varilla desde El Rosario, Sinaloa</p>
              </div>
            </motion.div>
          </div>
          <div className="w-full h-px bg-gradient-to-r from-transparent via-[#C0392B]/30 to-transparent mt-12" />
        </div>

        {/* VALORES */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }} transition={{ duration: 0.5 }} className="mb-16">
          <h3 className="text-2xl font-black text-center mb-10" style={{ fontFamily: "'Georgia', serif", color: '#1A0A00' }}>Nuestros Valores</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {VALORES.map((valor, i) => {
              const Icon = valor.icon;
              return (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                  className="rounded-2xl p-6 text-center"
                  style={{ background: 'rgba(255,255,255,0.8)', border: '1px solid rgba(192,57,43,0.1)' }}>
                  <div className="inline-flex items-center justify-center w-12 h-12 mb-3 rounded-xl" style={{ background: 'rgba(212,172,13,0.1)' }}>
                    <Icon size={20} style={{ color: '#C0392B' }} />
                  </div>
                  <h4 className="text-base font-bold mb-1" style={{ color: '#1A0A00' }}>{valor.titulo}</h4>
                  <p className="text-sm" style={{ color: '#7A5A40' }}>{valor.descripcion}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* GALERÍA */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }} transition={{ duration: 0.5 }} className="mb-12">
          <div className="grid lg:grid-cols-2 gap-6">
            {[
              { src: '/images/producto.png', titulo: 'Nuestros Pollos Asados', sub: 'Cocción perfecta sobre brasas de carbón' },
              { src: '/images/local.png', titulo: 'Nuestro Local', sub: 'Visítanos en Arleta, California' },
            ].map((img, i) => (
              <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="relative overflow-hidden rounded-3xl" style={{ height: '400px' }}>
                <img src={img.src} alt={img.titulo} className="w-full h-full object-cover" />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 50%)' }} />
                <div className="absolute bottom-6 left-6">
                  <p className="text-white text-2xl font-black" style={{ fontFamily: "'Georgia', serif", textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}>{img.titulo}</p>
                  <p className="text-white/90 text-sm" style={{ textShadow: '0 2px 6px rgba(0,0,0,0.8)' }}>{img.sub}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* HORARIO */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ delay: 0.3 }}
            className="mt-6 rounded-3xl p-8 max-w-md mx-auto"
            style={{ background: 'linear-gradient(135deg, #FFFDFB 0%, #FDF8F3 100%)', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', border: '1px solid rgba(192,57,43,0.08)' }}>
            <div className="text-center mb-6">
              <Clock size={32} className="mx-auto mb-3" style={{ color: '#C0392B' }} />
              <h3 className="text-xl font-black" style={{ fontFamily: "'Georgia', serif", color: '#1A0A00' }}>Horario</h3>
            </div>
            <div className="space-y-3">
              {DIAS_ABIERTOS.map(({ nombre, horario }, i) => (
                <motion.div key={nombre} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }} transition={{ delay: 0.4 + i * 0.05 }}
                  className="flex justify-between items-center py-2 border-b" style={{ borderColor: 'rgba(192,57,43,0.08)' }}>
                  <p className="text-sm font-semibold" style={{ color: '#1A0A00' }}>{nombre}</p>
                  <p className="text-xs font-medium tabular-nums" style={{ color: '#7A5A40' }}>
                    {formatTime(horario.open)} – {formatTime(horario.close)}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* PROCESO */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.5 }} className="mb-12">
          <div className="text-center mb-16">
            <p className="text-xs uppercase tracking-[0.3em] mb-3 font-bold" style={{ color: '#C0392B' }}>Nuestro Proceso</p>
            <h3 className="text-4xl md:text-5xl font-black" style={{ fontFamily: "'Georgia', serif", color: '#1A0A00' }}>Tradición en Cada Paso</h3>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {PASOS.map((paso, i) => (
              <motion.div key={paso.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.15 }}
                whileHover={{ y: -8 }} onClick={() => setPasoSeleccionado(paso)} className="cursor-pointer group">
                <div className="rounded-3xl overflow-hidden"
                  style={{ background: 'rgba(255,255,255,0.9)', boxShadow: '0 8px 32px rgba(0,0,0,0.08)', border: '1px solid rgba(192,57,43,0.08)' }}>
                  <div className="relative h-64 overflow-hidden">
                    <img src={paso.imagen} alt={paso.titulo}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.4) 100%)' }} />
                  </div>
                  <div className="p-6">
                    <h4 className="text-2xl font-black mb-2" style={{ fontFamily: "'Georgia', serif", color: '#1A0A00' }}>{paso.titulo}</h4>
                    <p className="text-sm mb-4" style={{ color: '#7A5A40' }}>{paso.subtitulo}</p>
                    <motion.div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider"
                      style={{ color: '#C0392B' }} whileHover={{ gap: '12px' }}>
                      <span>Ver detalles</span>
                      <ChevronRight size={16} />
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ delay: 0.6 }} className="text-center mt-16">
            <motion.button onClick={irAlMenu} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-10 py-5 rounded-full font-bold text-white"
              style={{ background: 'linear-gradient(135deg, #C0392B 0%, #D4AC0D 100%)', boxShadow: '0 12px 32px rgba(192,57,43,0.35)' }}>
              <span>Descubre Nuestro Menú</span>
              <ChevronRight size={22} />
            </motion.button>
          </motion.div>
        </motion.div>

        {/* MODAL */}
        <AnimatePresence>
          {pasoSeleccionado && (
            <>
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                onClick={() => setPasoSeleccionado(null)}
                className="fixed inset-0 z-50"
                style={{ background: 'radial-gradient(circle at center, rgba(26,10,0,0.85) 0%, rgba(0,0,0,0.95) 100%)', backdropFilter: 'blur(20px)' }}
              />
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                <motion.div
                  initial={{ scale: 0.85, opacity: 0, y: 40 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.9, opacity: 0, y: 20 }}
                  transition={{ type: 'spring', stiffness: 380, damping: 32, mass: 0.8 }}
                  onClick={(e) => e.stopPropagation()}
                  className="relative w-full max-w-6xl pointer-events-auto"
                >
                  <div className="relative overflow-hidden"
                    style={{
                      background: 'linear-gradient(135deg, rgba(254,252,248,0.98) 0%, rgba(253,248,243,0.95) 100%)',
                      borderRadius: '48px',
                      boxShadow: '0 0 0 1px rgba(255,255,255,0.1) inset, 0 60px 120px rgba(0,0,0,0.6)',
                      border: '1px solid rgba(255,255,255,0.2)',
                    }}>

                    {/* Cerrar */}
                    <motion.button
                      initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2, type: 'spring', stiffness: 400, damping: 25 }}
                      whileHover={{ scale: 1.15, rotate: 90 }} whileTap={{ scale: 0.9 }}
                      onClick={() => setPasoSeleccionado(null)}
                      className="absolute top-8 right-8 z-20 w-12 h-12 rounded-full flex items-center justify-center"
                      style={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(20px)', boxShadow: '0 8px 32px rgba(0,0,0,0.12)', border: '1px solid rgba(255,255,255,0.3)' }}>
                      <X size={20} strokeWidth={2.5} style={{ color: '#1A0A00' }} />
                    </motion.button>

                    <div className="grid lg:grid-cols-2 min-h-[600px]">
                      {/* Imagen */}
                      <motion.div className="relative overflow-hidden"
                        initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.1, duration: 0.6 }}>
                        <motion.div className="absolute inset-0" whileHover={{ scale: 1.05 }} transition={{ duration: 0.6 }}>
                          <img src={pasoSeleccionado.imagen} alt={pasoSeleccionado.titulo}
                            className="w-full h-full object-cover" style={{ filter: 'contrast(1.05) saturate(1.1)' }} />
                        </motion.div>
                        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.3) 0%, transparent 50%)' }} />
                      </motion.div>

                      {/* Contenido */}
                      <motion.div className="p-12 lg:p-16 flex flex-col justify-center"
                        initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.6 }}>
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 }} className="inline-flex items-center gap-2 mb-6">
                          <div className="w-1 h-1 rounded-full" style={{ background: '#C0392B' }} />
                          <p className="text-xs uppercase tracking-[0.3em] font-black" style={{ color: '#C0392B' }}>
                            Paso {pasoSeleccionado.id}
                          </p>
                        </motion.div>

                        <motion.h3 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.35 }}
                          className="text-6xl lg:text-7xl font-black mb-4 leading-none"
                          style={{ fontFamily: "'Georgia', serif", color: '#1A0A00', letterSpacing: '-0.02em' }}>
                          {pasoSeleccionado.titulo}
                        </motion.h3>

                        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 }} className="text-2xl font-bold mb-8"
                          style={{ background: 'linear-gradient(135deg, #C0392B 0%, #D4AC0D 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                          {pasoSeleccionado.subtitulo}
                        </motion.p>

                        <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
                          transition={{ delay: 0.45, duration: 0.6 }}
                          className="h-1 w-24 rounded-full mb-8"
                          style={{ background: 'linear-gradient(90deg, #C0392B 0%, #D4AC0D 100%)', transformOrigin: 'left' }}
                        />

                        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 }} className="text-lg leading-relaxed" style={{ color: '#7A5A40' }}>
                          {pasoSeleccionado.descripcion}
                        </motion.p>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}