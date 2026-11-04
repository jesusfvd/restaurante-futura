/**
 * UbicacionCompacta.jsx
 * Sección de ubicación con diseño limpio estilo Apple.
 * Usa la misma paleta de colores y animaciones que Conocenos.jsx
 * 
 * Paleta: #FEFCF8 (fondo), #C0392B (terracota), #D4AC0D (dorado)
 * Animaciones rápidas: 0.4s-0.6s
 */

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { MapPin, Clock, Phone, Navigation } from 'lucide-react';
import { RESTAURANT_INFO } from '../../utils/constants';

// ─── ANIMACIONES RÁPIDAS ESTILO APPLE ───────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.08,
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1],
    },
  }),
};

export default function UbicacionCompacta() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <section
      ref={ref}
      className="py-20 relative overflow-hidden"
      style={{ background: '#FEFCF8' }}
    >
      {/* Textura sutil */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(192,57,43,0.08) 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }}
      />

      {/* Manchas difuminadas */}
      <div
        className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ 
          background: 'radial-gradient(circle, rgba(212,172,13,0.08) 0%, transparent 70%)', 
          filter: 'blur(60px)',
        }}
      />
      <div
        className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ 
          background: 'radial-gradient(circle, rgba(192,57,43,0.06) 0%, transparent 70%)', 
          filter: 'blur(60px)',
        }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* HEADER */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={isInView ? { scale: 1, rotate: 0 } : {}}
            transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
            className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-2xl"
            style={{
              background: 'linear-gradient(135deg, #C0392B 0%, #D4AC0D 100%)',
            }}
          >
            <MapPin size={32} className="text-white" />
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="text-xs uppercase tracking-[0.3em] mb-2 font-bold"
            style={{ color: '#C0392B' }}
          >
            Visítanos
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-4xl md:text-5xl font-black mb-3"
            style={{ fontFamily: "'Georgia', serif", color: '#1A0A00' }}
          >
            Encuéntranos
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="text-lg max-w-2xl mx-auto"
            style={{ color: '#7A5A40' }}
          >
            Te esperamos con los mejores pollos asados de Arleta
          </motion.p>
        </motion.div>

        {/* LÍNEA DECORATIVA SUPERIOR */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-[#C0392B]/30 to-transparent mb-12" />

        {/* GRID: MAPA + INFO */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          
          {/* MAPA */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
            className="relative overflow-hidden"
            style={{ borderRadius: '24px' }}
          >
            <iframe
              title="Ubicación de Compadrito Pollos"
              width="100%"
              height="100%"
              style={{ 
                border: 0, 
                minHeight: '400px',
                borderRadius: '24px',
              }}
              loading="lazy"
              src="https://www.openstreetmap.org/export/embed.html?bbox=-118.4589,34.2108,-118.4369,34.2308&layer=mapnik&marker=34.2208,-118.4479"
              allowFullScreen=""
              aria-label="Mapa de OpenStreetMap mostrando la ubicación del restaurante"
            />
          </motion.div>

          {/* INFO */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
            className="flex flex-col justify-center space-y-6"
          >
            {/* Dirección */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="rounded-2xl p-6"
              style={{
                background: 'rgba(255,255,255,0.8)',
                border: '1px solid rgba(192,57,43,0.1)',
              }}
            >
              <div className="flex items-start gap-4">
                <div 
                  className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgba(192,57,43,0.1)' }}
                >
                  <MapPin size={20} style={{ color: '#C0392B' }} />
                </div>
                <div>
                  <p className="font-bold text-sm mb-1" style={{ color: '#1A0A00' }}>
                    Dirección
                  </p>
                  <p className="text-sm leading-relaxed" style={{ color: '#7A5A40' }}>
                    {RESTAURANT_INFO.address}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Horario */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="rounded-2xl p-6"
              style={{
                background: 'rgba(255,255,255,0.8)',
                border: '1px solid rgba(212,172,13,0.1)',
              }}
            >
              <div className="flex items-start gap-4">
                <div 
                  className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgba(212,172,13,0.1)' }}
                >
                  <Clock size={20} style={{ color: '#D4AC0D' }} />
                </div>
                <div>
                  <p className="font-bold text-sm mb-1" style={{ color: '#1A0A00' }}>
                    Horarios
                  </p>
                  <p className="text-sm" style={{ color: '#7A5A40' }}>
                    Viernes, Sábado y Domingo
                  </p>
                  <p className="text-sm font-semibold" style={{ color: '#7A5A40' }}>
                    10:30 AM - 6:00 PM
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Teléfonos */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="rounded-2xl p-6"
              style={{
                background: 'rgba(255,255,255,0.8)',
                border: '1px solid rgba(192,57,43,0.1)',
              }}
            >
              <div className="flex items-start gap-4">
                <div 
                  className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgba(192,57,43,0.1)' }}
                >
                  <Phone size={20} style={{ color: '#C0392B' }} />
                </div>
                <div>
                  <p className="font-bold text-sm mb-1" style={{ color: '#1A0A00' }}>
                    Teléfonos
                  </p>
                  <p className="text-sm" style={{ color: '#7A5A40' }}>
                    818-938-6936
                  </p>
                  <p className="text-sm" style={{ color: '#7A5A40' }}>
                    818-423-6912
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Botón Google Maps */}
            <motion.a
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.4 }}
              href={RESTAURANT_INFO.location.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-bold text-white relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #C0392B 0%, #D4AC0D 100%)',
              }}
            >
              <Navigation size={20} />
              <span>Abrir en Google Maps</span>
            </motion.a>
          </motion.div>
        </div>

        {/* LÍNEA DECORATIVA INFERIOR */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-[#C0392B]/30 to-transparent" />
      </div>
    </section>
  );
}
