import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

export default function GaleriaProceso({ items, stats }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section
      ref={ref}
      className="py-28 relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #FDF6EE 0%, #FAF0E4 60%, #FDF6EE 100%)' }}
    >
      {/* Textura de papel */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(180,100,30,0.055) 1px, transparent 1px)`,
          backgroundSize: '28px 28px',
        }}
      />

      {/* Manchas de color cálidas */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] pointer-events-none"
        style={{ background: 'radial-gradient(circle at 100% 0%, rgba(212,172,13,0.1) 0%, transparent 60%)', filter: 'blur(40px)' }}
      />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] pointer-events-none"
        style={{ background: 'radial-gradient(circle at 0% 100%, rgba(192,57,43,0.08) 0%, transparent 60%)', filter: 'blur(40px)' }}
      />

      {/* Línea decorativa superior */}
      <div className="absolute top-0 left-0 right-0 h-1 pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent, #C0392B 30%, #D4AC0D 50%, #C0392B 70%, transparent)' }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header */}
        <motion.div variants={fadeUp} initial="hidden" animate={isInView ? 'visible' : 'hidden'} className="text-center mb-20">
          <motion.p
            initial={{ opacity: 0, y: 16 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.1 }}
            className="text-xs uppercase tracking-[0.45em] mb-3 font-bold"
            style={{ color: '#C0392B' }}
          >
            ✦ Nuestro proceso ✦
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 24 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.25 }}
            className="text-5xl md:text-6xl font-black mb-6"
            style={{ fontFamily: "'Georgia', serif", color: '#1A0A00' }}
          >
            De las brasas a{' '}
            <span style={{ color: '#C0392B' }}>tu mesa</span>
          </motion.h2>
          <motion.div
            initial={{ scaleX: 0 }} animate={isInView ? { scaleX: 1 } : {}} transition={{ delay: 0.45, duration: 0.7 }}
            className="flex items-center justify-center gap-3 mb-6"
          >
            <div className="h-px w-24" style={{ background: 'linear-gradient(to right, transparent, #C0392B)' }} />
            <div className="w-1.5 h-1.5 rotate-45 bg-[#D4AC0D]" />
            <div className="h-px w-24" style={{ background: 'linear-gradient(to left, transparent, #C0392B)' }} />
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ delay: 0.6 }}
            className="max-w-xl mx-auto text-base"
            style={{ color: '#7A5A40' }}
          >
            Cada pollo es preparado con dedicación siguiendo nuestra receta tradicional sinaloense
          </motion.p>
        </motion.div>

        {/* Proceso — layout con números grandes estilo editorial */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {items.map((item, i) => {
            const IconComponent = item.icon;
            const isEven = i % 2 === 0;
            return (
              <motion.div
                key={i}
                variants={fadeUp}
                initial="hidden"
                animate={isInView ? 'visible' : 'hidden'}
                custom={i + 1}
                whileHover={{ y: -10 }}
                className="group relative"
              >
                <div
                  className="relative rounded-2xl p-8 h-full overflow-hidden"
                  style={{
                    background: '#FFFFFF',
                    border: '1px solid rgba(180,100,30,0.1)',
                    boxShadow: '0 8px 40px rgba(0,0,0,0.06), 0 2px 8px rgba(0,0,0,0.04)',
                  }}
                >
                  {/* Número grande de fondo */}
                  <div
                    className="absolute -top-2 -right-2 font-black pointer-events-none select-none"
                    style={{
                      fontSize: '7rem',
                      lineHeight: 1,
                      color: 'rgba(192,57,43,0.05)',
                      fontFamily: "'Georgia', serif",
                    }}
                  >
                    {i + 1}
                  </div>

                  {/* Número visible pequeño */}
                  <div
                    className="inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-black mb-5"
                    style={{ background: '#C0392B', color: 'white' }}
                  >
                    {i + 1}
                  </div>

                  {/* Ícono */}
                  <motion.div
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 3.5, repeat: Infinity, delay: i * 0.6, ease: 'easeInOut' }}
                    className="mb-5"
                  >
                    <IconComponent style={{ fontSize: '2.5rem', color: '#D4AC0D', filter: 'drop-shadow(0 2px 8px rgba(212,172,13,0.3))' }} />
                  </motion.div>

                  <h3 className="text-lg font-black mb-2" style={{ color: '#1A0A00' }}>{item.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#7A5A40' }}>{item.description}</p>

                  {/* Conector */}
                  {i < items.length - 1 && (
                    <div className="hidden lg:flex absolute top-10 -right-3 items-center z-10">
                      <motion.div
                        animate={{ x: [0, 4, 0] }}
                        transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.4 }}
                        className="w-6 h-0.5"
                        style={{ background: 'linear-gradient(to right, #D4AC0D, #C0392B)' }}
                      />
                      <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#C0392B' }} />
                    </div>
                  )}

                  {/* Línea inferior hover */}
                  <motion.div
                    initial={{ scaleX: 0 }} animate={isInView ? { scaleX: 1 } : {}} transition={{ delay: 0.6 + i * 0.15, duration: 0.6 }}
                    className="absolute bottom-0 left-0 right-0 h-0.5 origin-left"
                    style={{ background: 'linear-gradient(90deg, #C0392B, #D4AC0D, transparent)' }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Stats — banda de color terracota */}
        <motion.div
          variants={fadeUp} initial="hidden" animate={isInView ? 'visible' : 'hidden'} custom={5}
        >
          <div
            className="rounded-3xl overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #C0392B 0%, #922B1E 50%, #C0392B 100%)',
              boxShadow: '0 20px 60px rgba(192,57,43,0.25)',
            }}
          >
            {/* Patrón interior */}
            <div className="absolute inset-0 pointer-events-none" style={{
              backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)`,
              backgroundSize: '24px 24px',
            }} />

            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10">
              {stats.map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.8 + i * 0.1 }}
                  whileHover={{ scale: 1.03 }}
                  className="text-center py-10 px-6 relative"
                >
                  <motion.p
                    animate={{ scale: [1, 1.04, 1] }}
                    transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
                    className="text-4xl md:text-5xl font-black text-white mb-2"
                    style={{ fontFamily: "'Georgia', serif", textShadow: '0 2px 20px rgba(0,0,0,0.2)' }}
                  >
                    {stat.value}
                  </motion.p>
                  <p className="text-sm font-semibold uppercase tracking-wider" style={{ color: 'rgba(255,220,180,0.8)' }}>
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}